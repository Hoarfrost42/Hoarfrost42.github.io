import type { FocusTrackId } from './portfolioData'

export interface SupplementalNote {
  id: string
  title: string
  subtitle: string
  heroLine: string
  summary: string
  whyItMatters: string
  sourcePath: string
  sourceLabel: string
  trackIds: FocusTrackId[]
  stickyTone: string
  highlightBullets: string[]
  badges: string[]
}

/**
 * 非项目型补充材料，用来承接策划拆解、机制提案、系统分析等文字型作品。
 */
export const supplementalNotes: SupplementalNote[] = [
  {
    id: 'sts2-role-design',
    title: '杀戮尖塔2 新角色设计方案',
    subtitle: '非项目 / 角色机制拆解练习',
    heroLine:
      '这不是一个已经开发完成的项目，而是一份围绕既有系统反推角色定位、核心循环和风险点的策划提案。',
    summary:
      '这份稿子最能体现我作为游戏策划方向的拆解能力。重点不在于写了多少张牌，而在于能不能把角色定位、核心机制、卡池结构、商业化位置和不同战斗场景的适配关系讲清楚。',
    whyItMatters:
      '如果让我做游戏策划，我不只想展示“我有点子”，而是展示我会怎么把一个点子收成系统：它和原作循环哪里不同，数值风险在哪里，Boss 战和联机场景会不会失控，玩家为什么会愿意为它买单。',
    sourcePath: './resource/text/杀戮尖塔2_新角色设计方案.md',
    sourceLabel: '查看原始 Markdown',
    trackIds: ['game'],
    stickyTone: 'var(--sticky-pink)',
    highlightBullets: [
      '先定义角色在现有体系里的差异化位置，再往下推卡牌和遗物。',
      '核心机制不是停在概念层，而是有完整的“叠层→临界→手动引爆→眩晕→爆发”闭环。',
      '把普通战、精英战、Boss 战、联机模式都单独拎出来看适配与风险。',
      '连 DLC 商业化定位也一起想了，不是纯系统设计而已。',
    ],
    badges: ['角色定位拆解', '核心循环设计', '卡牌与遗物成套', 'Boss/联机适配'],
  },
]

