import { useRef, useState, type ChangeEvent } from 'react'
import type { PortfolioProject } from '../content/portfolioData'
import {
  normalizeStoryDraft,
  type ContactLinkStoryDraft,
  type PageCopy,
  type ProjectStoryDraft,
  type StoryDraft,
  type TrackStoryDraft,
} from '../content/storyData'

interface StoryEditorPanelProps {
  draft: StoryDraft
  projects: PortfolioProject[]
  onChange: (nextDraft: StoryDraft) => void
  onReset: () => void
}

interface StoryFieldProps {
  label: string
  value: string
  rows?: number
  onChange: (value: string) => void
}

/**
 * 把数组字段转成逐行编辑的文本，方便在面板里直接改写。
 */
function joinLines(items: string[]): string {
  return items.join('\n')
}

/**
 * 把逐行输入重新解析回数组，自动过滤空行。
 */
function splitLines(rawText: string): string[] {
  return rawText
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean)
}

function StoryField({
  label,
  value,
  rows = 3,
  onChange,
}: StoryFieldProps) {
  const isTextarea = rows > 1

  return (
    <label className="editor-field">
      <span className="editor-label">{label}</span>
      {isTextarea ? (
        <textarea
          className="editor-textarea"
          rows={rows}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <input
          className="editor-input"
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
    </label>
  )
}

/**
 * 站内文案编辑面板，用于调整讲述口径并导出/导入 JSON 草稿。
 */
export function StoryEditorPanel({
  draft,
  projects,
  onChange,
  onReset,
}: StoryEditorPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [feedback, setFeedback] = useState(
    '改动会实时反映在页面上，并自动保存在当前浏览器里。想发布到 GitHub 时，把导出的 JSON 覆盖根目录同名文件后再 build。',
  )
  const importInputRef = useRef<HTMLInputElement | null>(null)

  const updatePageCopy = <Key extends keyof PageCopy>(
    field: Key,
    value: PageCopy[Key],
  ) => {
    onChange({
      ...draft,
      pageCopy: {
        ...draft.pageCopy,
        [field]: value,
      },
    })
  }

  const updateProjectDraft = <Key extends keyof ProjectStoryDraft>(
    projectId: string,
    field: Key,
    value: ProjectStoryDraft[Key],
  ) => {
    onChange({
      ...draft,
      projects: {
        ...draft.projects,
        [projectId]: {
          ...draft.projects[projectId],
          [field]: value,
        },
      },
    })
  }

  const updateTrackDraft = <Key extends keyof TrackStoryDraft>(
    trackId: 'ai' | 'game',
    field: Key,
    value: TrackStoryDraft[Key],
  ) => {
    onChange({
      ...draft,
      tracks: {
        ...draft.tracks,
        [trackId]: {
          ...draft.tracks[trackId],
          [field]: value,
        },
      },
    })
  }

  const updateContactLink = <Key extends keyof ContactLinkStoryDraft>(
    contactLinkIndex: number,
    field: Key,
    value: ContactLinkStoryDraft[Key],
  ) => {
    onChange({
      ...draft,
      contactLinks: draft.contactLinks.map((contactLink, index) =>
        index === contactLinkIndex
          ? { ...contactLink, [field]: value }
          : contactLink,
      ),
    })
  }

  const updateWorkingPrinciple = (
    principleIndex: number,
    field: 'title' | 'note' | 'details',
    value: string,
  ) => {
    onChange({
      ...draft,
      workingPrinciples: draft.workingPrinciples.map((principle, index) =>
        index === principleIndex ? { ...principle, [field]: value } : principle,
      ),
    })
  }

  const handleExport = () => {
    const exportBlob = new Blob([JSON.stringify(draft, null, 2)], {
      type: 'application/json;charset=utf-8',
    })
    const exportUrl = URL.createObjectURL(exportBlob)
    const anchor = document.createElement('a')
    anchor.href = exportUrl
    anchor.download = 'portfolio-story-draft.json'
    anchor.click()
    URL.revokeObjectURL(exportUrl)
    setFeedback(
      '已导出 JSON。把它覆盖到仓库根目录的 portfolio-story-draft.json 后重新 build，再 push 到 GitHub，就会发布这版文案。',
    )
  }

  const handleImport = async (event: ChangeEvent<HTMLInputElement>) => {
    const importFile = event.target.files?.[0]

    if (!importFile) {
      return
    }

    try {
      const importedText = await importFile.text()
      const parsedDraft = JSON.parse(importedText)
      const normalizedDraft = normalizeStoryDraft(parsedDraft)
      onChange(normalizedDraft)
      setFeedback(`已导入 ${importFile.name}，页面文案已更新。`)
    } catch {
      setFeedback('导入失败：请确认文件是合法 JSON。')
    } finally {
      event.target.value = ''
    }
  }

  return (
    <div className="fixed right-4 bottom-4 z-30 flex max-w-[calc(100vw-1rem)] flex-col items-end gap-3">
      {isOpen ? (
        <aside className="sketch-frame w-[min(470px,calc(100vw-1rem))] overflow-hidden rounded-[2rem] bg-[rgba(255,250,242,0.98)]">
          <div className="flex items-start justify-between gap-4 border-b-2 border-[var(--line)] px-5 py-4">
            <div className="space-y-2">
              <p className="font-hand text-[1.8rem] text-[var(--ink)]">
                讲述稿接口
              </p>
              <p className="max-w-[28ch] text-sm leading-6 text-[var(--ink-muted)]">
                改这里的文字，页面会实时跟着变。想正式发布时，导出 JSON 覆盖根目录同名文件，再重新 build。
              </p>
            </div>

            <button
              className="editor-action"
              type="button"
              onClick={() => setIsOpen(false)}
            >
              收起
            </button>
          </div>

          <div className="story-panel-scroll max-h-[calc(100dvh-8.5rem)] overflow-y-auto px-4 py-4">
            <div className="flex flex-wrap gap-2">
              <button
                className="editor-action"
                type="button"
                onClick={handleExport}
              >
                导出 JSON
              </button>
              <button
                className="editor-action"
                type="button"
                onClick={() => importInputRef.current?.click()}
              >
                导入 JSON
              </button>
              <button
                className="editor-action"
                type="button"
                onClick={() => {
                  onReset()
                  setFeedback('已恢复默认讲述稿。')
                }}
              >
                恢复默认
              </button>
            </div>

            <p className="editor-note mt-4">{feedback}</p>

            <details className="editor-section mt-4" open>
              <summary className="editor-summary">首页讲述稿</summary>
              <div className="editor-grid">
                <StoryField
                  label="顶部署名"
                  rows={1}
                  value={draft.pageCopy.nameLabel}
                  onChange={(value) => updatePageCopy('nameLabel', value)}
                />
                <StoryField
                  label="标题上半句"
                  rows={1}
                  value={draft.pageCopy.heroTitleLead}
                  onChange={(value) => updatePageCopy('heroTitleLead', value)}
                />
                <StoryField
                  label="标题下半句"
                  rows={1}
                  value={draft.pageCopy.heroTitleTrail}
                  onChange={(value) => updatePageCopy('heroTitleTrail', value)}
                />
                <StoryField
                  label="首页导语"
                  value={draft.pageCopy.heroIntro}
                  rows={5}
                  onChange={(value) => updatePageCopy('heroIntro', value)}
                />
                <StoryField
                  label="当前路径卡片标题"
                  rows={1}
                  value={draft.pageCopy.currentTrackTitle}
                  onChange={(value) => updatePageCopy('currentTrackTitle', value)}
                />
                <StoryField
                  label="项目堆栈标题"
                  rows={1}
                  value={draft.pageCopy.projectStackTitle}
                  onChange={(value) => updatePageCopy('projectStackTitle', value)}
                />
                <StoryField
                  label="补充便签标题"
                  rows={1}
                  value={draft.pageCopy.stackNoteTitle}
                  onChange={(value) => updatePageCopy('stackNoteTitle', value)}
                />
              </div>
            </details>

            <details className="editor-section mt-4">
              <summary className="editor-summary">路径说明</summary>
              <div className="editor-grid">
                <StoryField
                  label="AI 按钮眉标"
                  rows={1}
                  value={draft.tracks.ai.eyebrow}
                  onChange={(value) => updateTrackDraft('ai', 'eyebrow', value)}
                />
                <StoryField
                  label="AI 按钮主标题"
                  rows={1}
                  value={draft.tracks.ai.shortLabel}
                  onChange={(value) => updateTrackDraft('ai', 'shortLabel', value)}
                />
                <StoryField
                  label="AI 当前路径标题"
                  rows={1}
                  value={draft.tracks.ai.label}
                  onChange={(value) => updateTrackDraft('ai', 'label', value)}
                />
                <StoryField
                  label="AI 路径摘要"
                  value={draft.tracks.ai.summary}
                  rows={4}
                  onChange={(value) => updateTrackDraft('ai', 'summary', value)}
                />
                <StoryField
                  label="AI 路径便签"
                  value={draft.tracks.ai.stackNote}
                  rows={3}
                  onChange={(value) =>
                    updateTrackDraft('ai', 'stackNote', value)
                  }
                />
                <StoryField
                  label="游戏按钮眉标"
                  rows={1}
                  value={draft.tracks.game.eyebrow}
                  onChange={(value) => updateTrackDraft('game', 'eyebrow', value)}
                />
                <StoryField
                  label="游戏按钮主标题"
                  rows={1}
                  value={draft.tracks.game.shortLabel}
                  onChange={(value) =>
                    updateTrackDraft('game', 'shortLabel', value)
                  }
                />
                <StoryField
                  label="游戏当前路径标题"
                  rows={1}
                  value={draft.tracks.game.label}
                  onChange={(value) => updateTrackDraft('game', 'label', value)}
                />
                <StoryField
                  label="游戏路径摘要"
                  value={draft.tracks.game.summary}
                  rows={4}
                  onChange={(value) =>
                    updateTrackDraft('game', 'summary', value)
                  }
                />
                <StoryField
                  label="游戏路径便签"
                  value={draft.tracks.game.stackNote}
                  rows={3}
                  onChange={(value) =>
                    updateTrackDraft('game', 'stackNote', value)
                  }
                />
              </div>
            </details>

            <details className="editor-section mt-4">
              <summary className="editor-summary">按钮、区块标题与模块标签</summary>
              <div className="editor-grid">
                <StoryField
                  label="Hero 按钮：看案例"
                  rows={1}
                  value={draft.pageCopy.viewCasesLabel}
                  onChange={(value) => updatePageCopy('viewCasesLabel', value)}
                />
                <StoryField
                  label="Hero 按钮：简历标题"
                  rows={1}
                  value={draft.pageCopy.resumeLabel}
                  onChange={(value) => updatePageCopy('resumeLabel', value)}
                />
                <StoryField
                  label="Hero 按钮：简历副文案"
                  rows={1}
                  value={draft.pageCopy.resumeMeta}
                  onChange={(value) => updatePageCopy('resumeMeta', value)}
                />
                <StoryField
                  label="Hero 按钮：联系我"
                  rows={1}
                  value={draft.pageCopy.contactLabel}
                  onChange={(value) => updatePageCopy('contactLabel', value)}
                />
                <StoryField
                  label="案例区眉标"
                  rows={1}
                  value={draft.pageCopy.caseEyebrow}
                  onChange={(value) => updatePageCopy('caseEyebrow', value)}
                />
                <StoryField
                  label="案例区标题"
                  rows={1}
                  value={draft.pageCopy.caseTitle}
                  onChange={(value) => updatePageCopy('caseTitle', value)}
                />
                <StoryField
                  label="案例区说明"
                  value={draft.pageCopy.caseDescription}
                  rows={4}
                  onChange={(value) => updatePageCopy('caseDescription', value)}
                />
                <StoryField
                  label="方法区眉标"
                  rows={1}
                  value={draft.pageCopy.howIWorkEyebrow}
                  onChange={(value) => updatePageCopy('howIWorkEyebrow', value)}
                />
                <StoryField
                  label="方法区标题"
                  rows={1}
                  value={draft.pageCopy.howIWorkTitle}
                  onChange={(value) => updatePageCopy('howIWorkTitle', value)}
                />
                <StoryField
                  label="方法区说明"
                  value={draft.pageCopy.howIWorkDescription}
                  rows={4}
                  onChange={(value) =>
                    updatePageCopy('howIWorkDescription', value)
                  }
                />
                <StoryField
                  label="联系区眉标"
                  rows={1}
                  value={draft.pageCopy.contactEyebrow}
                  onChange={(value) => updatePageCopy('contactEyebrow', value)}
                />
                <StoryField
                  label="联系区标题"
                  rows={1}
                  value={draft.pageCopy.contactTitle}
                  onChange={(value) => updatePageCopy('contactTitle', value)}
                />
                <StoryField
                  label="联系区说明"
                  value={draft.pageCopy.contactDescription}
                  rows={4}
                  onChange={(value) =>
                    updatePageCopy('contactDescription', value)
                  }
                />
                <StoryField
                  label="下一步标题"
                  rows={1}
                  value={draft.pageCopy.nextStepsTitle}
                  onChange={(value) => updatePageCopy('nextStepsTitle', value)}
                />
                <StoryField
                  label="下一步列表（每行一项）"
                  value={joinLines(draft.pageCopy.nextSteps)}
                  rows={5}
                  onChange={(value) =>
                    updatePageCopy('nextSteps', splitLines(value))
                  }
                />
                <StoryField
                  label="我负责的部分"
                  rows={1}
                  value={draft.pageCopy.ownedWorkLabel}
                  onChange={(value) => updatePageCopy('ownedWorkLabel', value)}
                />
                <StoryField
                  label="关键结果与证据"
                  rows={1}
                  value={draft.pageCopy.evidenceLabel}
                  onChange={(value) => updatePageCopy('evidenceLabel', value)}
                />
                <StoryField
                  label="怎么把它做成产品"
                  rows={1}
                  value={draft.pageCopy.deliveryLabel}
                  onChange={(value) => updatePageCopy('deliveryLabel', value)}
                />
                <StoryField
                  label="无截图时的证据板标题"
                  rows={1}
                  value={draft.pageCopy.publicProofBoardTitle}
                  onChange={(value) =>
                    updatePageCopy('publicProofBoardTitle', value)
                  }
                />
              </div>
            </details>

            <details className="editor-section mt-4">
              <summary className="editor-summary">联系卡片</summary>
              <div className="editor-grid">
                {draft.contactLinks.map((contactLink, index) => (
                  <div
                    key={`${contactLink.label}-${index}`}
                    className="editor-card"
                  >
                    <StoryField
                      label={`卡片 ${index + 1} 标题`}
                      rows={1}
                      value={contactLink.label}
                      onChange={(value) =>
                        updateContactLink(index, 'label', value)
                      }
                    />
                    <StoryField
                      label="显示内容"
                      rows={2}
                      value={contactLink.value}
                      onChange={(value) =>
                        updateContactLink(index, 'value', value)
                      }
                    />
                    <StoryField
                      label="跳转地址"
                      rows={1}
                      value={contactLink.href}
                      onChange={(value) =>
                        updateContactLink(index, 'href', value)
                      }
                    />
                  </div>
                ))}
              </div>
            </details>

            {projects.map((project) => {
              const projectDraft = draft.projects[project.id]

              return (
                <details key={project.id} className="editor-section mt-4">
                  <summary className="editor-summary">{projectDraft.title}</summary>
                  <div className="editor-grid">
                    <StoryField
                      label="项目名"
                      rows={1}
                      value={projectDraft.title}
                      onChange={(value) =>
                        updateProjectDraft(project.id, 'title', value)
                      }
                    />
                    <StoryField
                      label="项目副标题"
                      rows={1}
                      value={projectDraft.subtitle}
                      onChange={(value) =>
                        updateProjectDraft(project.id, 'subtitle', value)
                      }
                    />
                    <StoryField
                      label="时间"
                      rows={1}
                      value={projectDraft.timeframe}
                      onChange={(value) =>
                        updateProjectDraft(project.id, 'timeframe', value)
                      }
                    />
                    <StoryField
                      label="角色"
                      rows={2}
                      value={projectDraft.role}
                      onChange={(value) =>
                        updateProjectDraft(project.id, 'role', value)
                      }
                    />
                    <StoryField
                      label="一句话开场"
                      value={projectDraft.heroLine}
                      rows={3}
                      onChange={(value) =>
                        updateProjectDraft(project.id, 'heroLine', value)
                      }
                    />
                    <StoryField
                      label="我在解决什么"
                      value={projectDraft.coreQuestion}
                      rows={6}
                      onChange={(value) =>
                        updateProjectDraft(project.id, 'coreQuestion', value)
                      }
                    />
                    <StoryField
                      label="我负责的部分（每行一项）"
                      value={joinLines(projectDraft.ownedWorkstreams)}
                      rows={6}
                      onChange={(value) =>
                        updateProjectDraft(
                          project.id,
                          'ownedWorkstreams',
                          splitLines(value),
                        )
                      }
                    />
                    <StoryField
                      label="怎么把它做成产品（每行一项）"
                      value={joinLines(projectDraft.deliveryChoices)}
                      rows={6}
                      onChange={(value) =>
                        updateProjectDraft(
                          project.id,
                          'deliveryChoices',
                          splitLines(value),
                        )
                      }
                    />
                    <StoryField
                      label="指标标签（每行一项）"
                      value={joinLines(projectDraft.metrics)}
                      rows={5}
                      onChange={(value) =>
                        updateProjectDraft(project.id, 'metrics', splitLines(value))
                      }
                    />
                    <StoryField
                      label="证据标签（每行一项）"
                      value={joinLines(projectDraft.evidence)}
                      rows={5}
                      onChange={(value) =>
                        updateProjectDraft(project.id, 'evidence', splitLines(value))
                      }
                    />
                    <StoryField
                      label="截图说明（每行一项，按顺序对应）"
                      value={joinLines(projectDraft.galleryCaptions)}
                      rows={6}
                      onChange={(value) =>
                        updateProjectDraft(
                          project.id,
                          'galleryCaptions',
                          splitLines(value),
                        )
                      }
                    />
                  </div>
                </details>
              )
            })}

            <details className="editor-section mt-4">
              <summary className="editor-summary">工作方法便签</summary>
              <div className="editor-grid">
                {draft.workingPrinciples.map((principle, index) => (
                  <div key={`${principle.title}-${index}`} className="editor-card">
                    <StoryField
                      label={`便签 ${index + 1} 标题`}
                      rows={1}
                      value={principle.title}
                      onChange={(value) =>
                        updateWorkingPrinciple(index, 'title', value)
                      }
                    />
                    <StoryField
                      label="一句话说明"
                      rows={2}
                      value={principle.note}
                      onChange={(value) =>
                        updateWorkingPrinciple(index, 'note', value)
                      }
                    />
                    <StoryField
                      label="详细说明"
                      rows={4}
                      value={principle.details}
                      onChange={(value) =>
                        updateWorkingPrinciple(index, 'details', value)
                      }
                    />
                  </div>
                ))}
              </div>
            </details>
          </div>
        </aside>
      ) : null}

      <button
        className={`sketch-button ${isOpen ? 'is-active' : ''}`}
        type="button"
        onClick={() => setIsOpen((currentState) => !currentState)}
      >
        <span className="block font-hand text-lg tracking-[0.12em]">
          Story
        </span>
        <span className="mt-1 block font-hand text-xl font-semibold">
          讲述稿面板
        </span>
      </button>

      <input
        ref={importInputRef}
        accept="application/json"
        className="hidden"
        type="file"
        onChange={handleImport}
      />
    </div>
  )
}
