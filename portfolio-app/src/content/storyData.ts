import {
  contactLinks as baseContactLinks,
  focusTracks as baseFocusTracks,
  portfolioProjects as basePortfolioProjects,
  resumeAsset as baseResumeAsset,
  workingPrinciples as baseWorkingPrinciples,
  type ContactLink,
  type FocusTrack,
  type FocusTrackId,
  type PortfolioProject,
  type WorkingPrinciple,
} from './portfolioData'

export interface PageCopy {
  nameLabel: string
  heroTitleLead: string
  heroTitleTrail: string
  heroIntro: string
  viewCasesLabel: string
  resumeLabel: string
  resumeMeta: string
  contactLabel: string
  currentTrackTitle: string
  projectStackTitle: string
  stackNoteTitle: string
  caseEyebrow: string
  caseTitle: string
  caseDescription: string
  howIWorkEyebrow: string
  howIWorkTitle: string
  howIWorkDescription: string
  contactEyebrow: string
  contactTitle: string
  contactDescription: string
  nextStepsTitle: string
  nextSteps: string[]
  ownedWorkLabel: string
  evidenceLabel: string
  boundaryLabel: string
  deliveryLabel: string
  publicProofBoardTitle: string
}

export interface TrackStoryDraft {
  label: string
  shortLabel: string
  eyebrow: string
  summary: string
  stackNote: string
}

export interface ProjectStoryDraft {
  title: string
  subtitle: string
  timeframe: string
  role: string
  heroLine: string
  coreQuestion: string
  ownedWorkstreams: string[]
  deliveryChoices: string[]
  showcaseBoundary: string
  metrics: string[]
  evidence: string[]
  galleryCaptions: string[]
}

export interface WorkingPrincipleStoryDraft {
  title: string
  note: string
  details: string
}

export interface ResumeAssetCopy {
  href: string
  label: string
  meta: string
}

export interface ContactLinkStoryDraft {
  label: string
  value: string
  href: string
}

export interface StoryDraft {
  pageCopy: PageCopy
  tracks: Record<FocusTrackId, TrackStoryDraft>
  projects: Record<string, ProjectStoryDraft>
  workingPrinciples: WorkingPrincipleStoryDraft[]
  contactLinks: ContactLinkStoryDraft[]
}

export const STORY_DRAFT_STORAGE_KEY = 'hoarfrost42-story-draft-v1' as const

export const defaultPageCopy: PageCopy = {
  nameLabel: 'Hoarfrost42 / 柳培钧',
  heroTitleLead: '把复杂系统整理成',
  heroTitleTrail: '看得懂的产品。',
  heroIntro:
    '这不是项目流水账，是一份我自己能拿来讲述的作品笔记。四个项目，分别回答我怎么定义问题、怎么搭结构、怎么把想法做成真正能跑的体验。',
  viewCasesLabel: '看案例',
  resumeLabel: baseResumeAsset.label,
  resumeMeta: baseResumeAsset.meta,
  contactLabel: '联系我',
  currentTrackTitle: '当前浏览路径',
  projectStackTitle: 'Project Stack',
  stackNoteTitle: 'Sketch Note',
  caseEyebrow: 'Project Cases',
  caseTitle: '直接翻到项目本体',
  caseDescription:
    '每个项目先看核心画面，再看我解决了什么问题、负责了哪些环节、最后怎么把它真正做出来。切换上面的方向按钮后，项目排序会一起变化。',
  howIWorkEyebrow: 'How I Work',
  howIWorkTitle: '比起拼功能，我更像在整理一页笔记',
  howIWorkDescription:
    '做产品也好、AI workflow 也好、游戏系统也好，先整理结构，再决定哪些信息必须在场、哪些机制应该退后。',
  contactEyebrow: 'Contact',
  contactTitle: '感兴趣的话，从这里继续聊',
  contactDescription:
    '第一版先把核心判断点摆出来。简历已经同步到站内，后续会继续补项目细节页、流程图、截图和更完整的证据材料。',
  nextStepsTitle: '下一步准备补什么',
  nextSteps: [
    '项目细节页',
    '后台与 UI 截图',
    '评测图表',
    '模组结构图',
    '公司项目脱敏公开版',
  ],
  ownedWorkLabel: '我负责的部分',
  evidenceLabel: '关键结果与证据',
  boundaryLabel: '公开展示边界',
  deliveryLabel: '我怎么把它做成产品',
  publicProofBoardTitle: 'Public Proof Board',
}

/**
 * 基于当前默认内容生成一份可编辑的讲述稿草稿。
 */
export function createDefaultStoryDraft(): StoryDraft {
  return {
    pageCopy: {
      ...defaultPageCopy,
      nextSteps: [...defaultPageCopy.nextSteps],
    },
    tracks: {
      ai: {
        label: baseFocusTracks.ai.label,
        shortLabel: baseFocusTracks.ai.shortLabel,
        eyebrow: baseFocusTracks.ai.eyebrow,
        summary: baseFocusTracks.ai.summary,
        stackNote: baseFocusTracks.ai.stackNote,
      },
      game: {
        label: baseFocusTracks.game.label,
        shortLabel: baseFocusTracks.game.shortLabel,
        eyebrow: baseFocusTracks.game.eyebrow,
        summary: baseFocusTracks.game.summary,
        stackNote: baseFocusTracks.game.stackNote,
      },
    },
    projects: Object.fromEntries(
      basePortfolioProjects.map((project) => [
        project.id,
        {
          title: project.title,
          subtitle: project.subtitle,
          timeframe: project.timeframe,
          role: project.role,
          heroLine: project.heroLine,
          coreQuestion: project.coreQuestion,
          ownedWorkstreams: [...project.ownedWorkstreams],
          deliveryChoices: [...project.deliveryChoices],
          showcaseBoundary: project.showcaseBoundary,
          metrics: [...project.metrics],
          evidence: [...project.evidence],
          galleryCaptions: project.gallery?.map((image) => image.caption) ?? [],
        },
      ]),
    ) as Record<string, ProjectStoryDraft>,
    workingPrinciples: baseWorkingPrinciples.map((principle) => ({
      title: principle.title,
      note: principle.note,
      details: principle.details,
    })),
    contactLinks: baseContactLinks.map((link) => ({
      label: link.label,
      value: link.value,
      href: link.href,
    })),
  }
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string')
}

function readString(candidateValue: unknown, fallbackValue: string): string {
  return typeof candidateValue === 'string' ? candidateValue : fallbackValue
}

function readStringArray(
  candidateValue: unknown,
  fallbackValue: string[],
): string[] {
  return isStringArray(candidateValue) ? candidateValue : fallbackValue
}

/**
 * 对浏览器缓存或导入文件里的草稿做兜底，保证新旧字段都能兼容。
 */
export function normalizeStoryDraft(candidate: unknown): StoryDraft {
  const defaultDraft = createDefaultStoryDraft()

  if (!candidate || typeof candidate !== 'object') {
    return defaultDraft
  }

  const maybeDraft = candidate as Partial<StoryDraft>
  const maybePageCopy =
    maybeDraft.pageCopy && typeof maybeDraft.pageCopy === 'object'
      ? (maybeDraft.pageCopy as Partial<PageCopy>)
      : {}

  const normalizedPageCopy: PageCopy = {
    nameLabel: readString(maybePageCopy.nameLabel, defaultDraft.pageCopy.nameLabel),
    heroTitleLead: readString(
      maybePageCopy.heroTitleLead,
      defaultDraft.pageCopy.heroTitleLead,
    ),
    heroTitleTrail: readString(
      maybePageCopy.heroTitleTrail,
      defaultDraft.pageCopy.heroTitleTrail,
    ),
    heroIntro: readString(maybePageCopy.heroIntro, defaultDraft.pageCopy.heroIntro),
    viewCasesLabel: readString(
      maybePageCopy.viewCasesLabel,
      defaultDraft.pageCopy.viewCasesLabel,
    ),
    resumeLabel: readString(
      maybePageCopy.resumeLabel,
      defaultDraft.pageCopy.resumeLabel,
    ),
    resumeMeta: readString(
      maybePageCopy.resumeMeta,
      defaultDraft.pageCopy.resumeMeta,
    ),
    contactLabel: readString(
      maybePageCopy.contactLabel,
      defaultDraft.pageCopy.contactLabel,
    ),
    currentTrackTitle: readString(
      maybePageCopy.currentTrackTitle,
      defaultDraft.pageCopy.currentTrackTitle,
    ),
    projectStackTitle: readString(
      maybePageCopy.projectStackTitle,
      defaultDraft.pageCopy.projectStackTitle,
    ),
    stackNoteTitle: readString(
      maybePageCopy.stackNoteTitle,
      defaultDraft.pageCopy.stackNoteTitle,
    ),
    caseEyebrow: readString(
      maybePageCopy.caseEyebrow,
      defaultDraft.pageCopy.caseEyebrow,
    ),
    caseTitle: readString(maybePageCopy.caseTitle, defaultDraft.pageCopy.caseTitle),
    caseDescription: readString(
      maybePageCopy.caseDescription,
      defaultDraft.pageCopy.caseDescription,
    ),
    howIWorkEyebrow: readString(
      maybePageCopy.howIWorkEyebrow,
      defaultDraft.pageCopy.howIWorkEyebrow,
    ),
    howIWorkTitle: readString(
      maybePageCopy.howIWorkTitle,
      defaultDraft.pageCopy.howIWorkTitle,
    ),
    howIWorkDescription: readString(
      maybePageCopy.howIWorkDescription,
      defaultDraft.pageCopy.howIWorkDescription,
    ),
    contactEyebrow: readString(
      maybePageCopy.contactEyebrow,
      defaultDraft.pageCopy.contactEyebrow,
    ),
    contactTitle: readString(
      maybePageCopy.contactTitle,
      defaultDraft.pageCopy.contactTitle,
    ),
    contactDescription: readString(
      maybePageCopy.contactDescription,
      defaultDraft.pageCopy.contactDescription,
    ),
    nextStepsTitle: readString(
      maybePageCopy.nextStepsTitle,
      defaultDraft.pageCopy.nextStepsTitle,
    ),
    nextSteps: readStringArray(
      maybePageCopy.nextSteps,
      defaultDraft.pageCopy.nextSteps,
    ),
    ownedWorkLabel: readString(
      maybePageCopy.ownedWorkLabel,
      defaultDraft.pageCopy.ownedWorkLabel,
    ),
    evidenceLabel: readString(
      maybePageCopy.evidenceLabel,
      defaultDraft.pageCopy.evidenceLabel,
    ),
    boundaryLabel: readString(
      maybePageCopy.boundaryLabel,
      defaultDraft.pageCopy.boundaryLabel,
    ),
    deliveryLabel: readString(
      maybePageCopy.deliveryLabel,
      defaultDraft.pageCopy.deliveryLabel,
    ),
    publicProofBoardTitle: readString(
      maybePageCopy.publicProofBoardTitle,
      defaultDraft.pageCopy.publicProofBoardTitle,
    ),
  }

  const maybeTracks =
    maybeDraft.tracks && typeof maybeDraft.tracks === 'object'
      ? (maybeDraft.tracks as Partial<Record<FocusTrackId, Partial<TrackStoryDraft>>>)
      : ({} as Partial<Record<FocusTrackId, Partial<TrackStoryDraft>>>)

  const normalizedTracks: Record<FocusTrackId, TrackStoryDraft> = {
    ai: {
      label: readString(maybeTracks.ai?.label, defaultDraft.tracks.ai.label),
      shortLabel: readString(
        maybeTracks.ai?.shortLabel,
        defaultDraft.tracks.ai.shortLabel,
      ),
      eyebrow: readString(
        maybeTracks.ai?.eyebrow,
        defaultDraft.tracks.ai.eyebrow,
      ),
      summary: readString(
        maybeTracks.ai?.summary,
        defaultDraft.tracks.ai.summary,
      ),
      stackNote: readString(
        maybeTracks.ai?.stackNote,
        defaultDraft.tracks.ai.stackNote,
      ),
    },
    game: {
      label: readString(maybeTracks.game?.label, defaultDraft.tracks.game.label),
      shortLabel: readString(
        maybeTracks.game?.shortLabel,
        defaultDraft.tracks.game.shortLabel,
      ),
      eyebrow: readString(
        maybeTracks.game?.eyebrow,
        defaultDraft.tracks.game.eyebrow,
      ),
      summary: readString(
        maybeTracks.game?.summary,
        defaultDraft.tracks.game.summary,
      ),
      stackNote: readString(
        maybeTracks.game?.stackNote,
        defaultDraft.tracks.game.stackNote,
      ),
    },
  }

  const maybeProjects =
    maybeDraft.projects && typeof maybeDraft.projects === 'object'
      ? (maybeDraft.projects as Record<string, Partial<ProjectStoryDraft>>)
      : {}

  const normalizedProjects = Object.fromEntries(
    basePortfolioProjects.map((project) => {
      const fallbackProjectDraft = defaultDraft.projects[project.id]
      const maybeProjectDraft = maybeProjects[project.id] ?? {}

      return [
        project.id,
        {
          title: readString(maybeProjectDraft.title, fallbackProjectDraft.title),
          subtitle: readString(
            maybeProjectDraft.subtitle,
            fallbackProjectDraft.subtitle,
          ),
          timeframe: readString(
            maybeProjectDraft.timeframe,
            fallbackProjectDraft.timeframe,
          ),
          role: readString(maybeProjectDraft.role, fallbackProjectDraft.role),
          heroLine: readString(
            maybeProjectDraft.heroLine,
            fallbackProjectDraft.heroLine,
          ),
          coreQuestion: readString(
            maybeProjectDraft.coreQuestion,
            fallbackProjectDraft.coreQuestion,
          ),
          ownedWorkstreams: readStringArray(
            maybeProjectDraft.ownedWorkstreams,
            fallbackProjectDraft.ownedWorkstreams,
          ),
          deliveryChoices: readStringArray(
            maybeProjectDraft.deliveryChoices,
            fallbackProjectDraft.deliveryChoices,
          ),
          showcaseBoundary: readString(
            maybeProjectDraft.showcaseBoundary,
            fallbackProjectDraft.showcaseBoundary,
          ),
          metrics: readStringArray(
            maybeProjectDraft.metrics,
            fallbackProjectDraft.metrics,
          ),
          evidence: readStringArray(
            maybeProjectDraft.evidence,
            fallbackProjectDraft.evidence,
          ),
          galleryCaptions: readStringArray(
            maybeProjectDraft.galleryCaptions,
            fallbackProjectDraft.galleryCaptions,
          ),
        },
      ]
    }),
  ) as Record<string, ProjectStoryDraft>

  const maybeWorkingPrinciples = Array.isArray(maybeDraft.workingPrinciples)
    ? maybeDraft.workingPrinciples
    : []

  const normalizedWorkingPrinciples = baseWorkingPrinciples.map(
    (principle, index) => {
      const maybePrinciple =
        maybeWorkingPrinciples[index] &&
        typeof maybeWorkingPrinciples[index] === 'object'
          ? (maybeWorkingPrinciples[index] as Partial<WorkingPrincipleStoryDraft>)
          : {}

      return {
        title: readString(maybePrinciple.title, principle.title),
        note: readString(maybePrinciple.note, principle.note),
        details: readString(maybePrinciple.details, principle.details),
      }
    },
  )

  const maybeContactLinks = Array.isArray(maybeDraft.contactLinks)
    ? maybeDraft.contactLinks
    : []

  const normalizedContactLinks = baseContactLinks.map((link, index) => {
    const maybeContactLink =
      maybeContactLinks[index] && typeof maybeContactLinks[index] === 'object'
        ? (maybeContactLinks[index] as Partial<ContactLinkStoryDraft>)
        : {}

    return {
      label: readString(maybeContactLink.label, link.label),
      value: readString(maybeContactLink.value, link.value),
      href: readString(maybeContactLink.href, link.href),
    }
  })

  return {
    pageCopy: normalizedPageCopy,
    tracks: normalizedTracks,
    projects: normalizedProjects,
    workingPrinciples: normalizedWorkingPrinciples,
    contactLinks: normalizedContactLinks,
  }
}

function resolveContactLinkTarget(
  href: string,
  fallbackOpenInNewTab?: boolean,
): boolean | undefined {
  if (href.startsWith('http://') || href.startsWith('https://')) {
    return true
  }

  if (
    href.startsWith('mailto:') ||
    href.startsWith('#') ||
    href.startsWith('./')
  ) {
    return undefined
  }

  return fallbackOpenInNewTab
}

/**
 * 把可编辑草稿重新映射回页面实际消费的数据结构。
 */
export function buildPortfolioStory(draft: StoryDraft): {
  pageCopy: PageCopy
  focusTracks: Record<FocusTrackId, FocusTrack>
  portfolioProjects: PortfolioProject[]
  workingPrinciples: WorkingPrinciple[]
  contactLinks: ContactLink[]
  resumeAsset: ResumeAssetCopy
} {
  const normalizedDraft = normalizeStoryDraft(draft)

  const renderedFocusTracks: Record<FocusTrackId, FocusTrack> = {
    ai: {
      ...baseFocusTracks.ai,
      label: normalizedDraft.tracks.ai.label,
      shortLabel: normalizedDraft.tracks.ai.shortLabel,
      eyebrow: normalizedDraft.tracks.ai.eyebrow,
      summary: normalizedDraft.tracks.ai.summary,
      stackNote: normalizedDraft.tracks.ai.stackNote,
    },
    game: {
      ...baseFocusTracks.game,
      label: normalizedDraft.tracks.game.label,
      shortLabel: normalizedDraft.tracks.game.shortLabel,
      eyebrow: normalizedDraft.tracks.game.eyebrow,
      summary: normalizedDraft.tracks.game.summary,
      stackNote: normalizedDraft.tracks.game.stackNote,
    },
  }

  const renderedProjects = basePortfolioProjects.map((project) => {
    const projectDraft = normalizedDraft.projects[project.id]

    return {
      ...project,
      title: projectDraft.title,
      subtitle: projectDraft.subtitle,
      timeframe: projectDraft.timeframe,
      role: projectDraft.role,
      heroLine: projectDraft.heroLine,
      coreQuestion: projectDraft.coreQuestion,
      ownedWorkstreams: [...projectDraft.ownedWorkstreams],
      deliveryChoices: [...projectDraft.deliveryChoices],
      showcaseBoundary: projectDraft.showcaseBoundary,
      metrics: [...projectDraft.metrics],
      evidence: [...projectDraft.evidence],
      gallery: project.gallery?.map((image, index) => ({
        ...image,
        caption: projectDraft.galleryCaptions[index] ?? image.caption,
      })),
    }
  })

  const renderedWorkingPrinciples = baseWorkingPrinciples.map(
    (principle, index) => ({
      ...principle,
      ...normalizedDraft.workingPrinciples[index],
    }),
  )

  const renderedContactLinks = baseContactLinks.map((link, index) => {
    const contactLinkDraft = normalizedDraft.contactLinks[index]

    return {
      ...link,
      label: contactLinkDraft.label,
      value: contactLinkDraft.value,
      href: contactLinkDraft.href,
      openInNewTab: resolveContactLinkTarget(
        contactLinkDraft.href,
        link.openInNewTab,
      ),
    }
  })

  return {
    pageCopy: normalizedDraft.pageCopy,
    focusTracks: renderedFocusTracks,
    portfolioProjects: renderedProjects,
    workingPrinciples: renderedWorkingPrinciples,
    contactLinks: renderedContactLinks,
    resumeAsset: {
      ...baseResumeAsset,
      label: normalizedDraft.pageCopy.resumeLabel,
      meta: normalizedDraft.pageCopy.resumeMeta,
    },
  }
}
