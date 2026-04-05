# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

个人作品集网站（Hoarfrost42 Portfolio），面向 AI 产品经理 / 游戏策划 双方向求职。单页应用，部署在 GitHub Pages。核心特色是"双阅读路径"——同一组项目根据选择的方向（AI / Game）展示不同的排序和语境解读。

## Tech Stack

- **框架**: React 19 + TypeScript (strict mode) + Vite 8
- **样式**: Tailwind CSS v4 + 自定义手绘笔记本风格 CSS（`.sketch-frame`, `.sticky-note`, `.ink-title` 等）
- **部署**: 静态构建输出到 `docs/`，通过 GitHub Pages 提供服务
- **语言**: 界面与内容均为中文

## Repository Structure

```
F:\Githubio/
├── portfolio-app/          # 应用源码（所有开发工作在此目录）
│   ├── src/
│   │   ├── App.tsx         # 主组件，包含全部页面布局和状态
│   │   ├── main.tsx        # React 入口
│   │   ├── index.css       # 全局样式 + Tailwind + CSS 变量（配色/字体/阴影体系）
│   │   ├── components/     # UI 组件
│   │   └── content/
│   │       └── portfolioData.ts  # 所有项目数据（单一数据源，TypeScript 类型安全）
│   ├── scripts/
│   │   └── sync-resume.mjs # 构建前自动同步简历 PDF 和截图（中文→英文重命名）
│   ├── public/             # 静态资源（favicon, icons, resume, 截图）
│   ├── vite.config.ts      # base: './', outDir: '../docs'
│   └── package.json
├── docs/                   # 构建产物（GitHub Pages 源）
├── resource/img/           # 项目截图原始文件（中文文件名）
├── index.html              # 根重定向 → docs/index.html
└── .codex-tasks/           # Codex 任务定义
```

## Common Commands

所有命令在 `portfolio-app/` 目录下执行：

```powershell
# 开发
npm run dev           # 启动开发服务器（自动同步简历和截图）

# 构建
npm run build         # TypeScript 类型检查 + Vite 构建 → ../docs/

# 构建预览
npm run preview       # 预览 docs/ 构建产物

# Lint
npx eslint .          # ESLint 检查（flat config, TypeScript + React Hooks 规则）
```

## Architecture

### 双阅读路径机制

- `portfolioData.ts` 中每个项目有 `primaryValue: { ai, game }` 字段，存储方向相关的解读文案
- `FocusTrack` 定义每个方向的项目排序（`ordering[]`）
- `App.tsx` 通过单个 `useState<FocusTrackId>('ai' | 'game')` 驱动切换
- `getProjectsForTrack()` 函数根据当前方向重排项目
- 无路由，纯单页 + 锚点导航（`#cases`），避免 GitHub Pages SPA 路由问题

### 组件结构

- **`DirectionSwitcher`**: 方向切换按钮组（AI / Game）
- **`ProjectNotebookSheet`**: 项目详情卡片（主组件，含图片画廊、方向专属 sticky note、指标、证据徽章）
- **`ProjectSpotlightCard`**: 紧凑型项目卡片（已存在但当前未使用）
- **`SectionHeading`**: 可复用的章节标题

### 视觉设计体系

配色和样式定义在 `index.css` 的 CSS 变量中：
- `--paper` / `--ink` / `--line` 系列：笔记本纸张 + 墨水色
- `--sticky-yellow/pink/blue/green`：便签色
- `--shadow-hard` / `--shadow-lifted`：手绘阴影
- 字体：Outfit（正文）、Patrick Hand（手写标注）、Shantell Sans（标题）

### 资源同步管道

`scripts/sync-resume.mjs` 在 `predev` 和 `prebuild` 钩子自动执行：
1. 将根目录中文简历 PDF 复制为 `public/resume.pdf`
2. 将 `resource/img/` 中的中文截图复制到 `public/resource/img/` 并重命名为英文

## Key Conventions

- 内容修改集中在 `portfolioData.ts`，不需要改组件代码
- 新增项目截图放入 `resource/img/`，然后在 `sync-resume.mjs` 中添加对应的中英文映射
- 构建产物（`docs/`）直接提交到仓库，供 GitHub Pages 读取
- `index.html`（portfolio-app 和 docs）内含 fallback 加载提示，处理 `file://` 协议白屏问题
