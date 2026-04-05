import { useEffect, useMemo, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { SupplementalNote } from '../content/supplementalNotes'

interface SupplementalNoteSheetProps {
  note: SupplementalNote
  index: number
}

interface MarkdownPanel {
  id: string
  eyebrow?: string
  title: string
  content: string
  isWide: boolean
}

type LoadState = 'loading' | 'ready' | 'error'

const markdownTablePattern = /(^\|.*\|\s*$\n^\|[\s:|-]+\|\s*$)/m

/**
 * 去掉 Markdown 片段首尾多余空白，避免拆段后产生额外留白。
 */
function trimMarkdownBlock(markdownBlock: string): string {
  return markdownBlock.replace(/^\s+|\s+$/g, '')
}

/**
 * 识别片段中是否包含 GFM 表格，用来决定是否占满整行。
 */
function containsMarkdownTable(markdownBlock: string): boolean {
  return markdownTablePattern.test(markdownBlock)
}

/**
 * 依据标题级别拆分 Markdown，保留标题文本和对应正文。
 */
function splitMarkdownByHeading(
  markdownBlock: string,
  headingLevel: 2 | 3,
): Array<{ title: string; content: string }> {
  const headingPattern = new RegExp(`^#{${headingLevel}}\\s+(.+)$`, 'gm')
  const headingMatches = Array.from(markdownBlock.matchAll(headingPattern))

  if (headingMatches.length === 0) {
    const normalizedContent = trimMarkdownBlock(markdownBlock)

    return normalizedContent
      ? [{ title: '', content: normalizedContent }]
      : []
  }

  return headingMatches.map((headingMatch, index) => {
    const headingStartIndex = headingMatch.index ?? 0
    const headingEndIndex = headingStartIndex + headingMatch[0].length
    const nextHeadingIndex = headingMatches[index + 1]?.index ?? markdownBlock.length

    return {
      title: headingMatch[1].trim(),
      content: trimMarkdownBlock(
        markdownBlock.slice(headingEndIndex, nextHeadingIndex),
      ),
    }
  })
}

/**
 * 把长文按二级、三级标题拆成栅格面板，降低一列长文的拉伸感。
 */
function buildMarkdownPanels(markdownContent: string): MarkdownPanel[] {
  const normalizedDocument = trimMarkdownBlock(
    markdownContent.replace(/\r\n/g, '\n').replace(/^#\s+.+\n*/, ''),
  )

  const levelTwoSections = splitMarkdownByHeading(normalizedDocument, 2)

  return levelTwoSections.flatMap((section, sectionIndex) => {
    const levelThreeSections = splitMarkdownByHeading(section.content, 3)

    if (
      levelThreeSections.length === 1 &&
      levelThreeSections[0]?.title.length === 0
    ) {
      const panelContent = levelThreeSections[0].content

      return panelContent
        ? [
            {
              id: `note-panel-${sectionIndex + 1}`,
              title: section.title,
              content: panelContent,
              isWide:
                containsMarkdownTable(panelContent) || panelContent.length > 900,
            },
          ]
        : []
    }

    const firstSubsectionIndex = section.content.search(/^###\s+/m)
    const sectionLead = trimMarkdownBlock(
      firstSubsectionIndex >= 0
        ? section.content.slice(0, firstSubsectionIndex)
        : section.content,
    )

    const panels: MarkdownPanel[] = []

    if (sectionLead) {
      panels.push({
        id: `note-panel-${sectionIndex + 1}-lead`,
        title: section.title,
        content: sectionLead,
        isWide: containsMarkdownTable(sectionLead) || sectionLead.length > 900,
      })
    }

    levelThreeSections.forEach((subsection, subsectionIndex) => {
      if (!subsection.title || !subsection.content) {
        return
      }

      panels.push({
        id: `note-panel-${sectionIndex + 1}-${subsectionIndex + 1}`,
        eyebrow: section.title,
        title: subsection.title,
        content: subsection.content,
        isWide:
          containsMarkdownTable(subsection.content) ||
          subsection.content.length > 950,
      })
    })

    return panels
  })
}

/**
 * 渲染补充型设计文档，让纯文字方案也能作为作品证据展示。
 */
export function SupplementalNoteSheet({
  note,
  index,
}: SupplementalNoteSheetProps) {
  const [loadState, setLoadState] = useState<LoadState>('loading')
  const [markdownContent, setMarkdownContent] = useState<string>('')

  const sourceHref = useMemo(() => encodeURI(note.sourcePath), [note.sourcePath])
  const markdownPanels = useMemo(
    () => buildMarkdownPanels(markdownContent),
    [markdownContent],
  )

  useEffect(() => {
    const abortController = new AbortController()

    async function loadMarkdownContent() {
      setLoadState('loading')

      try {
        const response = await fetch(sourceHref, {
          cache: 'no-store',
          signal: abortController.signal,
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch markdown: ${response.status}`)
        }

        const nextMarkdownContent = await response.text()
        setMarkdownContent(nextMarkdownContent)
        setLoadState('ready')
      } catch (error) {
        if (abortController.signal.aborted) {
          return
        }

        console.error(error)
        setLoadState('error')
      }
    }

    void loadMarkdownContent()

    return () => {
      abortController.abort()
    }
  }, [sourceHref])

  return (
    <article className="sketch-frame overflow-hidden rounded-[2rem] bg-[rgba(255,255,255,0.8)] px-5 py-5 md:px-7 md:py-7">
      <div className="space-y-6">
        <header className="space-y-5">
          <div className="space-y-2">
            <p className="font-hand text-lg uppercase tracking-[0.18em] text-[var(--ink-soft)]">
              Supplemental Writing
            </p>
            <h3 className="font-hand text-3xl font-semibold text-[var(--ink)] md:text-[2.7rem]">
              {note.title}
            </h3>
            <p className="text-sm uppercase tracking-[0.18em] text-[var(--ink-soft)]">
              {note.subtitle}
            </p>
          </div>

          <div className="grid gap-4 xl:grid-cols-[1.12fr_0.88fr]">
            <section
              className="sticky-note notebook-shadow rounded-[1.8rem] px-5 py-5"
              style={{
                backgroundColor: note.stickyTone,
                transform: index % 2 === 0 ? 'rotate(-1.2deg)' : 'rotate(1.1deg)',
              }}
            >
              <p className="font-hand text-[1.7rem] text-[var(--ink)]">
                Design Note 0{index}
              </p>
              <p className="mt-3 font-hand text-lg font-semibold leading-8 text-[var(--ink)]">
                {note.heroLine}
              </p>
              <p className="mt-3 leading-8 text-[var(--ink-muted)]">{note.summary}</p>
            </section>

            <section className="rounded-[1.7rem] border-2 border-[var(--line)] bg-[rgba(255,255,255,0.74)] px-5 py-5">
              <p className="font-hand text-[1.6rem] text-[var(--ink)]">
                这份稿子的重点
              </p>
              <p className="mt-3 leading-8 text-[var(--ink-muted)]">
                {note.whyItMatters}
              </p>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {note.highlightBullets.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 rounded-[1.1rem] border border-[rgba(67,87,98,0.18)] bg-[rgba(248,241,223,0.54)] px-3 py-3 leading-7 text-[var(--ink-muted)]"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-2 h-3 w-3 shrink-0 rounded-full border-2 border-[var(--ink)] bg-[rgba(255,255,255,0.82)]"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex flex-wrap gap-2">
                {note.badges.map((badge) => (
                  <span key={badge} className="badge-chip">
                    {badge}
                  </span>
                ))}
              </div>
            </section>
          </div>
        </header>

        <section className="markdown-note">
          {loadState === 'loading' ? (
            <div className="markdown-note__loading" aria-hidden="true">
              <span className="markdown-note__skeleton markdown-note__skeleton--short" />
              <span className="markdown-note__skeleton markdown-note__skeleton--full" />
              <span className="markdown-note__skeleton markdown-note__skeleton--full" />
              <span className="markdown-note__skeleton markdown-note__skeleton--medium" />
            </div>
          ) : null}

          {loadState === 'error' ? (
            <div className="markdown-note__status">
              这份策划稿暂时没读出来，但原始 Markdown 仍然可以直接打开。
            </div>
          ) : null}

          {loadState === 'ready' ? (
            <div className="markdown-note__deck">
              {markdownPanels.map((panel) => (
                <article
                  key={panel.id}
                  id={panel.id}
                  className={`markdown-note__panel${panel.isWide ? ' markdown-note__panel--wide' : ''}`}
                >
                  <header className="markdown-note__panel-head">
                    {panel.eyebrow ? (
                      <p className="markdown-note__panel-eyebrow">{panel.eyebrow}</p>
                    ) : null}
                    <h4 className="markdown-note__panel-title">{panel.title}</h4>
                  </header>

                  <div className="markdown-note__rich">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        h1: ({ children }) => <h1>{children}</h1>,
                        h2: ({ children }) => <h2>{children}</h2>,
                        h3: ({ children }) => <h3>{children}</h3>,
                        p: ({ children }) => <p>{children}</p>,
                        ul: ({ children }) => <ul>{children}</ul>,
                        ol: ({ children }) => <ol>{children}</ol>,
                        table: ({ children }) => (
                          <div className="markdown-note__table-wrap">
                            <table>{children}</table>
                          </div>
                        ),
                        blockquote: ({ children }) => <blockquote>{children}</blockquote>,
                        hr: () => <hr />,
                      }}
                    >
                      {panel.content}
                    </ReactMarkdown>
                  </div>
                </article>
              ))}
            </div>
          ) : null}
        </section>
      </div>
    </article>
  )
}
