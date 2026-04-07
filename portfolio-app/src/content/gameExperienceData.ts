export interface GameExperienceEntry {
  name: string
  proof: string
  note?: string
}

export interface GameExperienceBucket {
  title: string
  summary: string
  tone: string
  entries: GameExperienceEntry[]
}

export interface GameExperienceLens {
  title: string
  detail: string
}

export const gameExperienceBoard = {
  eyebrow: 'Play History',
  title: '游戏经历是我判断玩法和节奏的底层样本',
  description:
    '我长期游玩的不止一个品类。动作、肉鸽、经营、塔防、开放世界、长线二游和竞技对抗都持续投入过，这让我看一个新项目时，能更快抓到它的核心循环、成长线和反馈节奏。',
  badges: [
    'LOL 1500+h',
    '杀戮尖塔 1+2 共 184.4h',
    '艾尔登法环 103.4h',
    '四款长线二游 55-58 级',
  ],
  noteTitle: '这些时长能说明什么',
  noteSummary:
    '我不是只盯着一个品类刷时长，而是在不同目标结构和体验密度之间反复切换。对我来说，游戏经历的价值不只是“玩过”，而是能更快形成一个项目的初步 taste。',
  lenses: [
    {
      title: '核心循环',
      detail:
        '从《土豆兄弟》《雨中冒险 2》到《杀戮尖塔》，我会先看玩家每 30 秒在做什么，爽点靠什么维持。',
    },
    {
      title: '成长结构',
      detail:
        '从《LOL》《APEX》的熟练度积累，到《月圆之夜》《杀戮尖塔》的局内构筑，我会区分局内成长和局外留存。',
    },
    {
      title: '长线运营感',
      detail:
        '《原神》《星穹铁道》《绝区零》《鸣潮》都玩到 55-58 级，对版本节奏、养成疲劳和角色价值有持续体感。',
    },
  ] satisfies GameExperienceLens[],
  ledgerTitle: '代表性游玩账本',
  ledgerSummary: '这里挑的是最能证明深度和覆盖面的样本，不是完整游玩清单。',
  buckets: [
    {
      title: '竞技与对抗',
      summary: '关注操作反馈、强度判断、博弈关系和长期熟练度曲线。',
      tone: 'var(--sticky-yellow)',
      entries: [
        {
          name: '英雄联盟',
          proof: '1500+h',
        },
        {
          name: '云顶之弈',
          proof: '常驻黄金段位',
        },
        {
          name: '金铲铲之战',
          proof: '常驻钻石 / 大师',
        },
        {
          name: 'APEX Legends',
          proof: '158.8h',
        },
        {
          name: 'PUBG',
          proof: '64h',
        },
        {
          name: 'Robocraft',
          proof: '21h',
        },
      ],
    },
    {
      title: '肉鸽与构筑',
      summary: '更关注随机性管理、局内构筑决策和失败后的再开动力。',
      tone: 'var(--sticky-pink)',
      entries: [
        {
          name: '杀戮尖塔 1 + 2',
          proof: '129h + 55.4h',
          note: '一代全职业进阶 20 碎心',
        },
        {
          name: '月圆之夜',
          proof: 'Steam 69.2h',
          note: '全职业通关，移动端时长更多',
        },
        {
          name: '土豆兄弟',
          proof: '34.9h',
        },
        {
          name: '雨中冒险 2',
          proof: '36.4h',
        },
      ],
    },
    {
      title: '动作、探索与解谜',
      summary: '重视地图引导、风险收益、探索驱动力，以及解谜叙事里的信息投放和回收。',
      tone: 'var(--sticky-blue)',
      entries: [
        {
          name: '艾尔登法环',
          proof: '103.4h',
        },
        {
          name: '无人深空',
          proof: '29.8h',
        },
        {
          name: '森林',
          proof: '16.3h',
        },
        {
          name: '锈湖系列',
          proof: '全通关',
        },
        {
          name: '星露谷物语',
          proof: '67.5h',
        },
      ],
    },
    {
      title: '经营、塔防与长线二游',
      summary: '会留意版本节奏、资源投放、养成负担和长期目标设计。',
      tone: 'var(--sticky-green)',
      entries: [
        {
          name: '开罗全系列',
          proof: '长期游玩',
          note: 'Steam 单作最少 24.7h，移动端更多',
        },
        {
          name: '气球塔防',
          proof: '60+h',
        },
        {
          name: '原神 / 星穹铁道',
          proof: '58 级 / 58 级',
        },
        {
          name: '绝区零 / 鸣潮',
          proof: '55 级 / 55 级',
        },
      ],
    },
  ] satisfies GameExperienceBucket[],
  closingTitle: '对游戏策划岗位的意义',
  closingNote:
    '这组经历最直接的价值，是我能把“我玩过”转成“我知道它为什么留人、为什么掉人、为什么这一段节奏有效”。做方案时，我更容易把抽象感受落成具体机制判断。',
} as const
