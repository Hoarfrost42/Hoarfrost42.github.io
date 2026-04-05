import { copyFileSync, existsSync, mkdirSync, rmSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const currentFilePath = fileURLToPath(import.meta.url)
const currentDirectory = dirname(currentFilePath)
const projectDirectory = resolve(currentDirectory, '..')
const publicDirectory = resolve(projectDirectory, 'public')
const sourceStoryDraftPath = resolve(
  projectDirectory,
  '..',
  'portfolio-story-draft.json',
)
const targetStoryDraftPath = resolve(publicDirectory, 'portfolio-story-draft.json')

mkdirSync(publicDirectory, { recursive: true })

if (!existsSync(sourceStoryDraftPath)) {
  rmSync(targetStoryDraftPath, { force: true })
  console.warn(
    `[sync:story] 未找到根目录文案草稿，已移除发布目录中的旧文件: ${sourceStoryDraftPath}`,
  )
  process.exit(0)
}

copyFileSync(sourceStoryDraftPath, targetStoryDraftPath)
console.log(`[sync:story] 已同步文案草稿到 ${targetStoryDraftPath}`)
