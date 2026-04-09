export type FocusTrackId = 'ai' | 'game'

export interface FocusTrack {
  id: FocusTrackId
  label: string
  shortLabel: string
  eyebrow: string
  summary: string
  ordering: string[]
  stackNote: string
}

export interface PortfolioProject {
  id: string
  title: string
  subtitle: string
  timeframe: string
  role: string
  heroLine: string
  summary: string
  detailHeadline: string
  coreQuestion: string
  primaryValue: {
    ai: string
    game: string
  }
  highlights: string[]
  ownedWorkstreams: string[]
  deliveryChoices: string[]
  publicArtifacts: string[]
  showcaseBoundary: string
  gallery?: {
    src: string
    alt: string
    caption: string
  }[]
  diagram?: {
    src: string
  }
  metrics: string[]
  evidence: string[]
  liveLink?: {
    label: string
    href: string
  }
  stickyTone: string
  tilt: string
}

export interface WorkingPrinciple {
  title: string
  note: string
  details: string
  tone: string
}

export interface ContactLink {
  id: string
  label: string
  value: string
  href: string
  openInNewTab?: boolean
}

export const resumeAsset = {
  href: './resume.pdf',
  label: '简历 PDF',
  meta: '南开大学 / 26届 / 求职版',
} as const

export const focusTracks: Record<FocusTrackId, FocusTrack> = {
  ai: {
    id: 'ai',
    label: 'AI 产品经理方向',
    shortLabel: 'AI 产品',
    eyebrow: 'Focus A',
    summary:
      '这条路径看的是问题怎么拆、架构怎么搭、效果怎么验。会调模型不稀奇，能把 AI 能力收成一个经得起检验的产品，这件事更值得聊。',
    ordering: ['ai-navigation', 'agent-round', 'contract-risk-agent', 'vestige'],
    stackNote:
      '按这个顺序看，先看产品判断和内容结构，再看多模型协作机制，最后看 AI workflow 设计。',
  },
  game: {
    id: 'game',
    label: '游戏策划方向',
    shortLabel: '游戏策划',
    eyebrow: 'Focus B',
    summary:
      '这条路径看的是体验怎么设计、规则怎么编排、节奏怎么控。做了个 demo 不算数，让游戏想法真正跑起来、玩得通，才是我想证明的。',
    ordering: ['vestige', 'agent-round', 'ai-navigation', 'contract-risk-agent'],
    stackNote:
      '按这个顺序看，先看玩法设计和叙事结构，再看系统编排能力，最后看产品落地和验证方式。',
  },
}

export const portfolioProjects: PortfolioProject[] = [
  {
    id: 'ai-navigation',
    title: 'AI空间站',
    subtitle: 'AI 工具导航与内容运营平台',
    timeframe: '2026.02 - 至今',
    role: '产品定义 / 信息架构 / 前端主链路 / 后台运营',
    heroLine: '用户不缺再多一个工具目录——缺的是更快判断哪个适合自己。',
    summary:
      '这个项目最直接地展示了我怎么拆需求、怎么取舍功能、怎么把一堆内容收进同一套架子里——而且真正上了线。',
    detailHeadline:
      '导航站做到后来，核心目标变成了帮用户做选型判断，而不只是多堆一页工具列表。',
    coreQuestion:
      'AI 工具一直在冒，但用户真正卡住的地方不是"找不到"，而是"不知道哪个适合我"。这个项目里我一直在做的事，就是把一堆散着的信息整理成更容易做出判断的入口。',
    primaryValue: {
      ai: '这个项目最直接地展示了我怎么拆需求、怎么取舍功能、怎么把内容体系和后台运营收进同一套产品里。',
      game:
        '不是游戏项目，但里面用到的能力是共通的——处理复杂信息、设计内容结构、让多角色的流程在同一套产品里跑通。',
    },
    highlights: [
      '做完竞品分析后，把产品定位从"再做一个工具聚合"收到了"辅助用户选型判断"。',
      '整理出工具、快讯、教程、工作流四类内容板块，后台运营入口同步落地。',
      '首页、筛选、详情、搜索、对比、后台管理——关键链路都有可演示的前端版本。',
    ],
    ownedWorkstreams: [
      '产品定位收口：公开站、搜索对比、后台运营，放进同一套信息架构里。',
      '体验梳理 + 前端落地：首页、分类、详情、搜索、对比、后台管理等关键页面。',
      '内容分层设计：工具、快讯、教程、工作流四类入口，理清阅读顺序和优先级。',
      '上线前收口：内容维护流程、后台协作方式、后续扩展边界。',
    ],
    deliveryChoices: [
      '主链路定成"发现→判断→对比→跳转"，让整个站更像选型工具而不是资讯聚合。',
      '工具、教程、工作流、快讯之间建了内容网络，站内互相导流，内容也能复用。',
      '后台运营能力保留了，但对外只展示公开效果和抽象职责，不涉及内部运营细节。',
      '搜索入口、结构化数据、robots、sitemap 这些 SEO 基础也一并补齐了。',
    ],
    publicArtifacts: [
      '首页、分类页、详情页的成套截图——看信息架构和内容层级怎么落的。',
      '"搜索→加入对比→对比表格→官网跳转"的短录屏，选型链路完整可走通。',
      '内容关系图：工具、教程、工作流、快讯之间不是孤立的页面堆砌。',
      '结构化数据、robots、sitemap 等公开 SEO 截图。',
      '桌面端和移动端的响应式对照，确认体验一致性。',
    ],
    showcaseBoundary:
      '公司项目，这里只放公开站的效果和抽象职责说明。运营数据、后台账号、内部策略文档、部署配置这些不会出现。',
    gallery: [
      {
        src: './resource/img/ai-home.png',
        alt: 'AI空间站首页截图',
        caption: '首页：推荐工具、搜索入口、快讯流放一起，先解决"从哪看起"的问题。',
      },
      {
        src: './resource/img/ai-category.png',
        alt: 'AI空间站分类页截图',
        caption: '分类页：同一类工具按用途展开，在一个场景里缩小候选范围。',
      },
      {
        src: './resource/img/ai-detail.png',
        alt: 'AI空间站详情页截图',
        caption: '详情页：标签、亮点、跳转入口收到一页，方便快速判断和对比。',
      },
    ],
    metrics: ['70+ 工具内容', '4 类内容板块', '搜索与对比链路', '公开站主链路可演示'],
    evidence: ['公开页面截图', '信息架构说明', '搜索与对比录屏', '脱敏内容关系图'],
    liveLink: {
      label: 'https://ai-kjz.cn/',
      href: 'https://ai-kjz.cn/',
    },
    stickyTone: 'var(--sticky-blue)',
    tilt: 'rotate(1.6deg)',
  },
  {
    id: 'agent-round',
    title: 'AgentRound v2.0',
    subtitle: '多模型协作圆桌讨论工具',
    timeframe: '2026.03',
    role: '产品定义 / 多模型交互设计 / 全栈原型实现',
    heroLine: '多模型不是并排开几个聊天框，而是围绕同一个问题真正接上话。',
    summary:
      '这个项目最能体现我怎么把“多模型能力”从 Demo 变成产品机制：轮次、上下文、配置、导出，都得在同一套体验里闭环。',
    detailHeadline:
      '多模型协作这件事，关键不是模型数量，而是讨论机制能不能真的成立。',
    coreQuestion:
      '用户要的不是同时开很多聊天框，而是让多个模型围绕同一个问题真正接上话。难点不在于把模型排成列表，而在于轮次、上下文、用户决策点和配置入口，能不能在同一套产品里闭环。',
    primaryValue: {
      ai: '这个项目最能展示我怎么把“AI 能力”往产品机制里压，而不是停在 prompt 试玩层面。',
      game:
        '放到游戏策划路径里看，它更像一次系统设计练习：多角色发言顺序、信息流和决策节点，都需要被编排。',
    },
    highlights: [
      '把“多模型并排问答”收口成了“围绕同一议题的圆桌讨论”，产品目标一下就清楚了。',
      '轮次推进、继续讨论、认可共识、导出会话——整条闭环不是概念，而是完整地做出来了。',
      '支持多 Provider、Prompt 模板、会话持久化和异常重试，不是一次性的演示页。',
    ],
    ownedWorkstreams: [
      '产品定义：把“多模型并排问答”收口成“围绕同一议题的圆桌讨论”。',
      '交互链路设计：建起从选择模型、发起问题、多轮继续、达成共识到导出会话的完整流程。',
      '设置与模板能力：Provider、Model、Prompt、预设模板统一放进可操作的配置页。',
      '后端能力搭建：SSE 流式返回、会话持久化、异常重试、API Key 加密存储。',
    ],
    deliveryChoices: [
      '每一轮不是简单并发生成，而是给模型注入发言顺序，让后续发言者能回应前文。',
      '流式和非流式 provider 共存时，用统一的 SSE 事件层去兼容，保证前端展示一致。',
      '把 prompt 调试真正做成产品能力：模板、本地 YAML、设置页编辑、Markdown 导出都放进同一套链路。',
      '单个模型出错也不直接打断整轮讨论，而是记录状态后继续往下走。',
    ],
    publicArtifacts: [
      '主界面截图：看多模型回复如何按轮次连续展开。',
      '设置页与模板系统：Provider、Prompt、模板配置都可操作。',
      'README 功能说明：圆桌讨论、导出、决策卡片、长回复折叠等能力齐全。',
      '测试目录：流式、Provider、Session、过滤器等关键模块都有对应测试。',
    ],
    showcaseBoundary:
      '这里仅展示界面效果、公开实现结构和抽象能力说明。API Key、provider 细节配置、本地会话数据这些不会放出来。',
    gallery: [
      {
        src: './resource/img/agent-round-chat.png',
        alt: 'AgentRound 多模型圆桌讨论主界面截图',
        caption:
          '主界面：回复按轮次连续展开，用户不用来回切窗口，就能在一页里看完整个讨论过程。',
      },
    ],
    metrics: ['4 类 Provider', 'SSE 实时流式', 'Markdown 导出', '8 组单测/集成测试'],
    evidence: ['主界面截图', '设置页配置能力', 'README 功能说明', '测试目录结构'],
    liveLink: {
      label: 'https://github.com/Hoarfrost42/Agent_Round',
      href: 'https://github.com/Hoarfrost42/Agent_Round',
    },
    stickyTone: 'var(--sticky-yellow)',
    tilt: 'rotate(-2.1deg)',
  },
  {
    id: 'contract-risk-agent',
    title: '合同风险监测系统',
    subtitle: '基于本地小模型的合同风险智能监测系统',
    timeframe: '2025.09 - 2026.01',
    role: '毕业设计 / AI workflow 设计 / 评测闭环 / 全栈实现',
    heroLine: '规则、检索、LLM 推理——压成一个可解释、可评测的垂直 AI 产品。',
    summary:
      '这个项目的意思不是"我做了个 Agent"，而是在一个真实场景里跑通了约束条件、工作流方案和效果验证的完整闭环。',
    detailHeadline:
      '合同风控这件事，最后做成了可解释、可评测、能在本地跑起来的垂直 AI workflow。',
    coreQuestion:
      '合同审查是高风险、强隐私的场景。问题不在于"模型能不能回答"——而在于能不能在本地环境下给出足够稳定、可解释、可评测的风险判断。',
    primaryValue: {
      ai: '这个项目最能体现我的指标意识和风险控制意识——从工作流设计到效果验证，整条链路是闭合的。',
      game:
        '不是游戏作品，但底层能力是相通的：怎么把复杂的规则体系结构化，怎么让推理过程可被解释。',
    },
    highlights: [
      '场景敏感度高、隐私要求严，所以选了本地小模型路线，设计了规则引导 + LLM 推理的混合架构。',
      '召回、重排、自反思、结构化报告——整条链路围绕"结果可解释、误判可控"来搭。',
      '用消融实验逐个模块对比，在多项指标上做到了量化验证的优化。',
    ],
    ownedWorkstreams: [
      '本地部署路线和场景边界：关键数据不默认送到云端。',
      '完整 workflow 设计：规则引导→检索召回→重排→LLM 推理→二次反思。',
      '产品链路搭建：从上传、解析、条款切分到风险报告导出。',
      'benchmark 与消融实验：逐个模块验证对效果和稳定性的影响。',
    ],
    deliveryChoices: [
      '高风险召回放到更前面，用 F2、QWK、加权准确率这些硬指标来约束效果。',
      '混合检索 + Rerank 双管齐下，避免纯语义或纯关键词带来的偏差。',
      '中高风险结果加了二次审查和可解释链路，幻觉率和漏判率都在控制范围内。',
      '模型输出整理成结构化报告——不是甩一段自然语言就完了。',
    ],
    publicArtifacts: [
      '架构图和工作流图——看规则、检索、推理、报告之间怎么衔接。',
      '评测图表和消融实验结果，workflow 优化有据可查。',
      '脱敏风险报告样例，结构化输出和可解释结果长什么样。',
      '上传、分析、报告页的界面截图——不只是后端脚本，有完整的产品界面。',
    ],
    showcaseBoundary:
      '架构、指标、脱敏报告都可以看。原始合同文本、隐私样本数据不会出现，系统输出也不会包装成正式法律建议。',
    gallery: [
      {
        src: './resource/img/contract-report-demo.png',
        alt: '合同风险监测系统报告页效果展示',
        caption:
          '效果展示：风险总分、分布、执行摘要、结构化条款结果收在一页里——不是研究脚本，是完整的分析工作台。',
      },
      {
        src: './resource/img/contract-metrics-chart.png',
        alt: '合同风险监测系统核心性能指标图',
        caption:
          '核心性能指标：基准模型、指令引导、RAG 增强、CoT 推理四组方案并排对比，F2、QWK、Weighted Accuracy 一目了然。',
      },
      {
        src: './resource/img/contract-confusion-matrix.png',
        alt: '合同风险监测系统混淆矩阵对照图',
        caption:
          '混淆矩阵：高/中/低三档风险的预测分布对比，误判集中在哪里、优化拉开了哪些类别，看图最直观。',
      },
    ],
    metrics: [
      'Weighted Acc 76.1%',
      'QWK 0.53',
      'Risk ID Precision 98.6%',
      '本地 RTX 3060 验证',
    ],
    evidence: ['效果展示页', '核心性能指标图', '混淆矩阵对照', 'Benchmark 与消融实验说明'],
    stickyTone: 'var(--sticky-green)',
    tilt: 'rotate(-1.4deg)',
  },
  {
    id: 'vestige',
    title: 'Vestige / 黑域边界',
    subtitle: 'AI 驱动的单人 TRPG 游戏系统',
    timeframe: '2026.01 - 2026.03',
    role: '产品定义 / 游戏系统设计 / 模组内容创作 / 全栈实现',
    heroLine: '"像真人 KP 一样自然"——这个想法最后真的做成了可玩的单人调查系统。',
    summary:
      '辨识度最高的一个项目。叙事、规则、内容、运行时产品化——从头到尾连成了一条完整的线。',
    detailHeadline:
      '单人 TRPG 从最初的"聊天想法"开始，最后推进到了有运行时骨架、有模组节奏的可玩系统。',
    coreQuestion:
      '单人跑团最难的地方不在于生成叙述。没有真人 KP 的时候，玩家的自由输入、检定触发、线索推进、模组节奏——这些碎片怎么接成一条真正可玩的流程？这是整个项目一直在回答的问题。',
    primaryValue: {
      ai: '放在 AI 产品路径里看，它展示的是另一面：交互设计、状态流管理，以及怎么处理非结构化的自然语言输入。',
      game:
        '世界观、关卡结构、检定机制、线索推进、产品化实现——这个项目基本覆盖了游戏策划最核心的那些能力。',
    },
    highlights: [
      '针对单人跑团的痛点，设计了条件触发检定、@mention 对话、流式叙述三套核心机制。',
      '系统抽象成了"引擎 + 模组"结构——扩展内容不需要改代码。',
      '原创模组《黑域边界》：四幕结构、四条结局、24 个场景、29 条线索、11 个 NPC。',
    ],
    ownedWorkstreams: [
      '体验目标定义：自然语言输入、检定触发、叙事推进分别怎么做。',
      '模块边界拆分：运行时 facade、规则结算、场景导演、状态提交、叙述服务。',
      '原创模组《黑域边界》：四幕流程、线索链、NPC、结局设计全套。',
      'Python 主线 + Web 入口落地：从设想变成可试玩、可验证的产品原型。',
    ],
    deliveryChoices: [
      '自然语言是主入口，但状态、检定、事实提交全走结构化通道——避免纯聊天失控。',
      '世界事实提交收到单一入口，叙述、规则、状态不会在运行时互相打架。',
      'Web 端定位是体验入口而非业务中枢，后续换前端壳很方便。',
      '模组规模、线索密度、节奏设计共同维持 2-3 小时的完整体验弧线。',
    ],
    publicArtifacts: [
      '模组结构图 + 四幕节奏图，看调查推进和体验起伏怎么设计的。',
      '场景、线索、NPC 关系示意——不是零散灵感，是成体系的结构。',
      'Python 运行时架构图，自然语言入口和规则、状态管理之间怎么协作。',
      '试玩界面和对话流截图，可运行的产品原型长这样。',
    ],
    showcaseBoundary:
      '系统结构、玩法机制、模组规模都可以看。完整剧情文本、剧透、provider 配置、运行时私有素材暂时不公开。',
    gallery: [
      {
        src: './resource/img/vestige-runtime.png',
        alt: '黑域边界运行时界面截图',
        caption: '运行时界面：自然语言输入、检定结果、会话状态在一页内闭环——不是单纯的聊天壳。',
      },
    ],
    diagram: {
      src: './resource/diagrams/vestige-system-architecture.json',
    },
    metrics: ['24 个场景', '29 条线索链', '11 个 NPC', '2-3 小时完整体验'],
    evidence: ['模组结构图', '场景与线索关系', '运行时架构设计', '试玩 Demo 与 UI 截图'],
    stickyTone: 'var(--sticky-pink)',
    tilt: 'rotate(2.2deg)',
  },
]

export const workingPrinciples: WorkingPrinciple[] = [
  {
    title: '先收口问题，再决定功能',
    note: '用户真正要解决什么，比先堆出页面来重要得多。',
    details:
      'AI 空间站也好，合同项目也好，都是先把目标、边界、成功指标理清楚，再决定哪些能力现在做、哪些往后放。',
    tone: 'var(--sticky-yellow)',
  },
  {
    title: '把复杂系统拆成可理解的结构',
    note: '规则、信息、角色关系——都应该能被解释清楚。',
    details:
      'TRPG 的场景推进也好，合同风险的检索推理也好，我习惯先拆成清晰的流程节点和状态边界，再往下做。',
    tone: 'var(--sticky-green)',
  },
  {
    title: '结果需要证据，而不是感觉',
    note: '评测、样例、对照——设计有没有效，不能靠感觉。',
    details:
      '合同项目有完整的 benchmark 和消融实验，AI 空间站则用信息架构和内容体系来回答"为什么这么组织"。',
    tone: 'var(--sticky-blue)',
  },
  {
    title: '体验设计要落到真实交互',
    note: '好不好看是其次，能不能帮用户进入状态才是关键。',
    details:
      'Vestige 里的流式叙述、条件检定、定向对话，归根结底都在做同一件事——维持沉浸感和节奏。',
    tone: 'var(--sticky-pink)',
  },
]

export const contactLinks: ContactLink[] = [
  {
    id: 'email',
    label: '邮箱',
    value: 'fhoar53@gmail.com',
    href: 'mailto:fhoar53@gmail.com',
  },
  {
    id: 'github',
    label: 'GitHub',
    value: 'github.com/Hoarfrost42',
    href: 'https://github.com/Hoarfrost42',
    openInNewTab: true,
  },
  {
    id: 'resume',
    label: '简历 PDF',
    value: '当前求职版本，站内同步发布',
    href: './resume.pdf',
    openInNewTab: true,
  },
  {
    id: 'track',
    label: '简历方向',
    value: 'AI 产品 / 游戏策划',
    href: '#cases',
  },
]

/**
 * 根据当前焦点方向返回项目展示顺序。
 */
export function getProjectsForTrack(trackId: FocusTrackId): PortfolioProject[] {
  const orderLookup = new Map(
    focusTracks[trackId].ordering.map((projectId, index) => [projectId, index]),
  )

  return [...portfolioProjects].sort((leftProject, rightProject) => {
    const leftIndex = orderLookup.get(leftProject.id) ?? Number.MAX_SAFE_INTEGER
    const rightIndex =
      orderLookup.get(rightProject.id) ?? Number.MAX_SAFE_INTEGER
    return leftIndex - rightIndex
  })
}
