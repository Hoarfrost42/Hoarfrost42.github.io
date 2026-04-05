import { useEffect, useId, useState } from 'react'
import mermaid from 'mermaid'

interface MermaidDiagramPayload {
  title: string
  purpose: string
  mermaid: string
  notes: string[]
}

interface MermaidDiagramCardProps {
  src: string
}

let hasInitializedMermaid = false
let renderSequence = 0

/**
 * 只在首次渲染时初始化 Mermaid，全站复用同一套主题配置。
 */
function ensureMermaidInitialized() {
  if (hasInitializedMermaid) {
    return
  }

  mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'loose',
    theme: 'base',
    fontFamily: 'Outfit, sans-serif',
    flowchart: {
      htmlLabels: true,
      curve: 'basis',
    },
    themeVariables: {
      primaryColor: '#f8f1df',
      primaryTextColor: '#1e2930',
      primaryBorderColor: '#435762',
      lineColor: '#435762',
      tertiaryColor: '#fbf4e7',
      clusterBkg: '#fffaf0',
      clusterBorder: '#435762',
      fontFamily: 'Outfit, sans-serif',
    },
  })

  hasInitializedMermaid = true
}

/**
 * 判断远端 JSON 是否符合图表数据结构，避免渲染阶段出现隐式错误。
 *
 * @param {unknown} value 通过 fetch 得到的未知数据。
 * @returns {value is MermaidDiagramPayload} 是否为合法图表负载。
 */
function isMermaidDiagramPayload(value: unknown): value is MermaidDiagramPayload {
  if (!value || typeof value !== 'object') {
    return false
  }

  const candidate = value as Partial<MermaidDiagramPayload>

  return (
    typeof candidate.title === 'string' &&
    typeof candidate.purpose === 'string' &&
    typeof candidate.mermaid === 'string' &&
    Array.isArray(candidate.notes) &&
    candidate.notes.every((note) => typeof note === 'string')
  )
}

/**
 * 读取构建前同步出的图表 JSON。
 *
 * @param {string} src 图表资源路径。
 * @returns {Promise<MermaidDiagramPayload>} 解析后的图表数据。
 */
async function loadMermaidDiagram(src: string): Promise<MermaidDiagramPayload> {
  const response = await window.fetch(src, {
    cache: import.meta.env.DEV ? 'no-store' : 'default',
  })

  if (!response.ok) {
    throw new Error(`图表资源读取失败：${response.status}`)
  }

  const payload = (await response.json()) as unknown

  if (!isMermaidDiagramPayload(payload)) {
    throw new Error('图表资源格式不正确')
  }

  return payload
}

/**
 * 生成当前实例专属的 Mermaid render id，避免多图并存时发生节点冲突。
 *
 * @param {string} prefix 当前组件前缀。
 * @returns {string} Mermaid render id。
 */
function createRenderId(prefix: string): string {
  renderSequence += 1
  return `${prefix}-${renderSequence}`
}

/**
 * 展示项目架构图与简要说明，适合挂在案例卡片内部。
 */
export function MermaidDiagramCard({ src }: MermaidDiagramCardProps) {
  const diagramId = useId().replaceAll(':', '_')
  const [diagramPayload, setDiagramPayload] = useState<MermaidDiagramPayload | null>(
    null,
  )
  const [svgMarkup, setSvgMarkup] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    let isCancelled = false

    async function renderDiagram() {
      setIsLoading(true)
      setErrorMessage('')

      try {
        const payload = await loadMermaidDiagram(src)
        ensureMermaidInitialized()

        const { svg } = await mermaid.render(
          createRenderId(`portfolio-mermaid-${diagramId}`),
          payload.mermaid,
        )

        if (isCancelled) {
          return
        }

        setDiagramPayload(payload)
        setSvgMarkup(svg)
      } catch (error) {
        if (isCancelled) {
          return
        }

        const nextErrorMessage =
          error instanceof Error ? error.message : '图表暂时无法渲染'
        setDiagramPayload(null)
        setSvgMarkup('')
        setErrorMessage(nextErrorMessage)
      } finally {
        if (!isCancelled) {
          setIsLoading(false)
        }
      }
    }

    void renderDiagram()

    return () => {
      isCancelled = true
    }
  }, [diagramId, src])

  return (
    <section className="diagram-note">
      <div className="diagram-note__header">
        <p className="diagram-note__eyebrow">System Sketch</p>
        <h4 className="diagram-note__title">
          {diagramPayload?.title ?? '系统整体架构图'}
        </h4>
        {diagramPayload?.purpose ? (
          <p className="diagram-note__purpose">{diagramPayload.purpose}</p>
        ) : null}
      </div>

      <div className="diagram-note__canvas" aria-live="polite">
        {isLoading ? (
          <p className="diagram-note__status">正在整理架构图...</p>
        ) : null}

        {!isLoading && errorMessage ? (
          <p className="diagram-note__status">图表加载失败：{errorMessage}</p>
        ) : null}

        {!isLoading && !errorMessage && svgMarkup ? (
          <div
            className="diagram-note__svg"
            dangerouslySetInnerHTML={{ __html: svgMarkup }}
          />
        ) : null}
      </div>

      {diagramPayload?.notes.length ? (
        <ul className="diagram-note__notes">
          {diagramPayload.notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      ) : null}
    </section>
  )
}
