import { Suspense, lazy, useEffect, useMemo, useState } from 'react'
import { DirectionSwitcher } from './components/DirectionSwitcher'
import { ProjectNotebookSheet } from './components/ProjectNotebookSheet'
import { SectionHeading } from './components/SectionHeading'
import { SupplementalNoteSheet } from './components/SupplementalNoteSheet'
import {
  type FocusTrackId,
  type PortfolioProject,
} from './content/portfolioData'
import { supplementalNotes } from './content/supplementalNotes'
import {
  STORY_DRAFT_STORAGE_KEY,
  buildPortfolioStory,
  createDefaultStoryDraft,
  normalizeStoryDraft,
  type StoryDraft,
} from './content/storyData'

const STORY_EDITOR_ENABLED = import.meta.env.DEV

const StoryEditorPanelComponent = STORY_EDITOR_ENABLED
  ? lazy(async () => {
      const module = await import('./components/StoryEditorPanel')
      return { default: module.StoryEditorPanel }
    })
  : undefined

/**
 * 仅在本地开发时从浏览器缓存中恢复讲述稿草稿，避免公开站读取个人本地编辑状态。
 */
function loadInitialStoryDraft(): StoryDraft {
  const defaultStoryDraft = createDefaultStoryDraft()

  if (!STORY_EDITOR_ENABLED || typeof window === 'undefined') {
    return defaultStoryDraft
  }

  try {
    const storedDraft = window.localStorage.getItem(STORY_DRAFT_STORAGE_KEY)
    return storedDraft
      ? normalizeStoryDraft(JSON.parse(storedDraft))
      : defaultStoryDraft
  } catch {
    return defaultStoryDraft
  }
}

/**
 * 判断当前浏览器是否已经保存过本地讲述稿。
 */
function hasStoredStoryDraft(): boolean {
  if (!STORY_EDITOR_ENABLED || typeof window === 'undefined') {
    return false
  }

  return window.localStorage.getItem(STORY_DRAFT_STORAGE_KEY) !== null
}

/**
 * 从发布目录读取仓库里的文案 JSON，作为 GitHub Pages 的默认展示内容。
 */
async function loadPublishedStoryDraft(): Promise<StoryDraft | null> {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const response = await window.fetch('./portfolio-story-draft.json', {
      cache: 'no-store',
    })

    if (!response.ok) {
      return null
    }

    const publishedDraft = (await response.json()) as unknown
    return normalizeStoryDraft(publishedDraft)
  } catch {
    return null
  }
}

/**
 * 作品集首页，围绕两条求职路径组织同一组案例材料。
 */
function App() {
  const [activeTrackId, setActiveTrackId] = useState<FocusTrackId>('ai')
  const [storyDraft, setStoryDraft] = useState<StoryDraft>(loadInitialStoryDraft)
  const [isStoryDraftReady, setIsStoryDraftReady] = useState<boolean>(
    () => STORY_EDITOR_ENABLED && hasStoredStoryDraft(),
  )

  useEffect(() => {
    if (isStoryDraftReady) {
      return
    }

    let isCancelled = false

    void loadPublishedStoryDraft().then((publishedDraft) => {
      if (isCancelled) {
        return
      }

      if (publishedDraft) {
        setStoryDraft(publishedDraft)
      }

      setIsStoryDraftReady(true)
    })

    return () => {
      isCancelled = true
    }
  }, [isStoryDraftReady])

  useEffect(() => {
    if (!STORY_EDITOR_ENABLED || !isStoryDraftReady) {
      return
    }

    window.localStorage.setItem(STORY_DRAFT_STORAGE_KEY, JSON.stringify(storyDraft))
  }, [isStoryDraftReady, storyDraft])

  const {
    pageCopy,
    focusTracks,
    portfolioProjects,
    workingPrinciples,
    contactLinks,
    resumeAsset,
  } = useMemo(() => buildPortfolioStory(storyDraft), [storyDraft])

  const activeTrack = focusTracks[activeTrackId]
  const orderedProjects = useMemo(
    () => {
      const projectLookup = new Map(
        portfolioProjects.map((project) => [project.id, project]),
      )

      return activeTrack.ordering
        .map((projectId) => projectLookup.get(projectId))
        .filter(
          (project): project is PortfolioProject => typeof project !== 'undefined',
        )
    },
    [activeTrack.ordering, portfolioProjects],
  )
  const activeSupplementalNotes = useMemo(
    () =>
      supplementalNotes.filter((note) => note.trackIds.includes(activeTrackId)),
    [activeTrackId],
  )
  const sectionJumpNotes = useMemo(
    () => {
      const jumpNotes = [
        {
          id: 'intro',
          label: '首页速览',
          hint: '先看定位',
          tone: 'var(--sticky-yellow)',
        },
        {
          id: 'cases',
          label: '项目案例',
          hint: '核心作品',
          tone: 'var(--sticky-blue)',
        },
      ]

      if (activeSupplementalNotes.length > 0) {
        jumpNotes.push({
          id: 'design-notes',
          label: '策划拆解',
          hint: '文字型证据',
          tone: 'var(--sticky-pink)',
        })
      }

      jumpNotes.push(
        {
          id: 'work-style',
          label: '工作方式',
          hint: '怎么推进事',
          tone: 'var(--sticky-green)',
        },
        {
          id: 'contact',
          label: '联系',
          hint: '继续往下聊',
          tone: 'var(--sticky-yellow)',
        },
      )

      return jumpNotes
    },
    [activeSupplementalNotes.length],
  )

  return (
    <div className="paper-grid min-h-[100dvh] overflow-x-clip bg-[var(--paper)] text-[var(--ink)]">
      <aside aria-label="板块跳转" className="page-jump-board hidden lg:block">
        <p className="page-jump-board__title">快速跳转</p>
        <div className="page-jump-board__list">
          {sectionJumpNotes.map((item, index) => (
            <a
              key={item.id}
              className="page-jump-note"
              href={`#${item.id}`}
              style={{
                backgroundColor: item.tone,
                transform: index % 2 === 0 ? 'rotate(-1.6deg)' : 'rotate(1.2deg)',
              }}
            >
              <span className="page-jump-note__index">0{index + 1}</span>
              <strong className="page-jump-note__label">{item.label}</strong>
              <span className="page-jump-note__hint">{item.hint}</span>
            </a>
          ))}
        </div>
      </aside>

      <main className="relative mx-auto w-full max-w-[1400px] px-4 py-4 md:px-8 md:py-8">
        <div className="flex min-w-0 flex-col gap-8">
            <section
              id="intro"
              className="sketch-frame relative overflow-hidden rounded-[2.2rem] px-6 py-7 md:px-10 md:py-10"
            >
              <div className="grid gap-10 lg:grid-cols-[1.16fr_0.84fr] lg:items-center">
                <div className="space-y-8">
                  <div className="space-y-4">
                    <p className="font-hand text-2xl tracking-[0.16em] text-[var(--ink-soft)]">
                      {pageCopy.nameLabel}
                    </p>
                    <h1 className="ink-title max-w-[11ch] text-5xl md:text-7xl">
                      {pageCopy.heroTitleLead}
                      <span className="block">{pageCopy.heroTitleTrail}</span>
                    </h1>
                    <p className="max-w-[60ch] text-base leading-8 text-[var(--ink-muted)] md:text-lg">
                      {pageCopy.heroIntro}
                    </p>
                  </div>

                  <DirectionSwitcher
                    activeTrackId={activeTrackId}
                    tracks={Object.values(focusTracks)}
                    onChange={setActiveTrackId}
                  />

                  <div className="grid gap-4 md:grid-cols-[1fr_auto]">
                    <div className="sticky-note rounded-[1.9rem] px-5 py-5">
                      <p className="font-hand text-[1.8rem] text-[var(--ink)]">
                        {pageCopy.currentTrackTitle}
                      </p>
                      <p className="mt-3 text-sm uppercase tracking-[0.18em] text-[var(--ink-soft)]">
                        {activeTrack.label}
                      </p>
                      <p className="mt-3 max-w-[48ch] leading-8 text-[var(--ink-muted)]">
                        {activeTrack.summary}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-3 md:flex-col">
                      <a className="sketch-button" href="#cases">
                        {pageCopy.viewCasesLabel}
                      </a>
                      <a
                        className="sketch-button"
                        href={resumeAsset.href}
                        rel="noreferrer"
                        target="_blank"
                      >
                        <span>{resumeAsset.label}</span>
                        <span className="text-xs uppercase tracking-[0.16em] text-[var(--ink-soft)]">
                          {resumeAsset.meta}
                        </span>
                      </a>
                      <a
                        className="sketch-button"
                        href={contactLinks[0]?.href ?? 'mailto:fhoar53@gmail.com'}
                      >
                        {pageCopy.contactLabel}
                      </a>
                    </div>
                  </div>
                </div>

                <aside className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                  <div
                    className="sticky-note notebook-shadow rounded-[1.7rem] px-5 py-5"
                    style={{ transform: 'rotate(-2.2deg)' }}
                  >
                    <p className="font-hand text-[1.65rem] text-[var(--ink)]">
                      {pageCopy.projectStackTitle}
                    </p>
                    <ol className="mt-4 space-y-3">
                      {orderedProjects.map((project, index) => (
                        <li
                          key={project.id}
                          className="flex items-start gap-3 text-sm leading-7 text-[var(--ink-muted)]"
                        >
                          <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-[var(--ink)] bg-[rgba(255,255,255,0.72)] font-hand text-base text-[var(--ink)]">
                            {index + 1}
                          </span>
                          <span>
                            <strong className="font-semibold text-[var(--ink)]">
                              {project.title}
                            </strong>
                            <span className="mt-1 block">{project.heroLine}</span>
                          </span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div
                    className="sticky-note notebook-shadow rounded-[1.7rem] px-5 py-5"
                    style={{
                      backgroundColor: 'var(--sticky-blue)',
                      transform: 'rotate(1.8deg)',
                    }}
                  >
                    <p className="font-hand text-[1.65rem] text-[var(--ink)]">
                      {pageCopy.stackNoteTitle}
                    </p>
                    <p className="mt-4 leading-8 text-[var(--ink-muted)]">
                      {activeTrack.stackNote}
                    </p>
                  </div>
                </aside>
              </div>
            </section>

            <section
              id="cases"
              className="sketch-frame rounded-[2.2rem] px-6 py-7 md:px-10 md:py-10"
            >
              <div className="flex flex-col gap-8">
                <SectionHeading
                  eyebrow={pageCopy.caseEyebrow}
                  title={pageCopy.caseTitle}
                  description={pageCopy.caseDescription}
                />

                <div className="grid gap-6">
                  {orderedProjects.map((project, index) => (
                    <ProjectNotebookSheet
                      key={project.id}
                      labels={{
                        ownedWork: pageCopy.ownedWorkLabel,
                        evidence: pageCopy.evidenceLabel,
                        delivery: pageCopy.deliveryLabel,
                        publicProofBoard: pageCopy.publicProofBoardTitle,
                      }}
                      notebookIndex={index + 1}
                      project={project}
                    />
                  ))}
                </div>
              </div>
            </section>

            {activeSupplementalNotes.length > 0 ? (
              <section
                id="design-notes"
                className="sketch-frame rounded-[2.2rem] px-6 py-7 md:px-10 md:py-10"
              >
                <div className="flex flex-col gap-8">
                  <SectionHeading
                    eyebrow="Design Notes"
                    title="不算项目，也能说明我怎么拆机制"
                    description="这类材料更像策划拆解或机制提案。重点不在有没有做成 Demo，而在于我怎么定义角色定位、搭出核心循环、识别平衡风险，再把它整理成一份能讲清楚的方案。"
                  />

                  <div className="grid gap-6">
                    {activeSupplementalNotes.map((note, index) => (
                      <SupplementalNoteSheet
                        key={note.id}
                        index={index + 1}
                        note={note}
                      />
                    ))}
                  </div>
                </div>
              </section>
            ) : null}

            <section
              id="work-style"
              className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr]"
            >
              <div className="sketch-frame rounded-[2.2rem] px-6 py-7 md:px-8 md:py-9">
                <SectionHeading
                  eyebrow={pageCopy.howIWorkEyebrow}
                  title={pageCopy.howIWorkTitle}
                  description={pageCopy.howIWorkDescription}
                />
              </div>

              <div className="grid gap-5 md:grid-cols-[1.05fr_0.95fr]">
                {workingPrinciples.map((principle, index) => (
                  <article
                    key={principle.title}
                    className="sticky-note notebook-shadow rounded-[1.8rem] px-5 py-5"
                    style={{
                      backgroundColor: principle.tone,
                      transform:
                        index % 2 === 0 ? 'rotate(-1.5deg)' : 'rotate(1.3deg)',
                    }}
                  >
                    <p className="font-hand text-[1.6rem] text-[var(--ink)]">
                      {principle.title}
                    </p>
                    <p className="mt-3 font-hand text-lg font-semibold leading-8 text-[var(--ink)]">
                      {principle.note}
                    </p>
                    <p className="mt-3 leading-8 text-[var(--ink-muted)]">
                      {principle.details}
                    </p>
                  </article>
                ))}
              </div>
            </section>

            <section
              id="contact"
              className="sketch-frame rounded-[2.2rem] px-6 py-7 md:px-10 md:py-10"
            >
              <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
                <SectionHeading
                  eyebrow={pageCopy.contactEyebrow}
                  title={pageCopy.contactTitle}
                  description={pageCopy.contactDescription}
                />

                <div className="grid gap-4 md:grid-cols-[1fr_1fr]">
                  {contactLinks.map((link, index) => (
                    <a
                      key={link.id}
                      className="sticky-note notebook-shadow rounded-[1.7rem] px-5 py-5 text-left no-underline"
                      href={link.href}
                      rel={link.openInNewTab ? 'noreferrer' : undefined}
                      style={{
                        transform:
                          index % 2 === 0 ? 'rotate(-1deg)' : 'rotate(1.2deg)',
                      }}
                      target={link.openInNewTab ? '_blank' : undefined}
                    >
                      <p className="font-hand text-[1.6rem] text-[var(--ink)]">
                        {link.label}
                      </p>
                      <p className="mt-3 leading-8 text-[var(--ink-muted)]">
                        {link.value}
                      </p>
                    </a>
                  ))}

                  <div className="contact-tagline-wrap md:col-span-2">
                    <div className="contact-tagline">
                      <p className="contact-tagline__text">Contact Me!</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
        </div>
      </main>

      {STORY_EDITOR_ENABLED && StoryEditorPanelComponent ? (
        <Suspense fallback={null}>
          <StoryEditorPanelComponent
            draft={storyDraft}
            projects={portfolioProjects}
            onChange={setStoryDraft}
            onReset={() => setStoryDraft(createDefaultStoryDraft())}
          />
        </Suspense>
      ) : null}
    </div>
  )
}

export default App
