import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const currentFilePath = fileURLToPath(import.meta.url)
const currentDirectory = dirname(currentFilePath)
const projectDirectory = resolve(currentDirectory, '..')
const sourceDiagramPath = resolve(
  projectDirectory,
  '..',
  'resource',
  'text',
  '系统整体架构图.md',
)
const targetDiagramDirectory = resolve(
  projectDirectory,
  'public',
  'resource',
  'diagrams',
)
const targetDiagramPath = resolve(
  targetDiagramDirectory,
  'vestige-system-architecture.json',
)

/**
 * 从 Markdown 文档中提取必填字段，缺失时直接抛错，避免发布过期内容。
 *
 * @param {string} content Markdown 原文。
 * @param {RegExp} pattern 匹配规则，首个捕获组必须为目标内容。
 * @param {string} fieldLabel 当前字段的日志名称。
 * @returns {string} 清理后的字段值。
 */
function extractRequiredField(content, pattern, fieldLabel) {
  const match = content.match(pattern)
  const fieldValue = match?.[1]?.trim()

  if (!fieldValue) {
    throw new Error(`[sync:diagram] 文档缺少 ${fieldLabel}，请检查 ${sourceDiagramPath}`)
  }

  return fieldValue
}

/**
 * 提取“图意”段落下的 bullet 列表。
 *
 * @param {string} content Markdown 原文。
 * @returns {string[]} 图意说明数组。
 */
function extractDiagramNotes(content) {
  const sectionMatch = content.match(/##\s+图意\s*([\s\S]*?)(?:\n##\s+|\s*$)/)
  const sectionContent = sectionMatch?.[1] ?? ''

  return sectionContent
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith('- '))
    .map((line) => line.replace(/^- /, '').trim())
}

if (!existsSync(sourceDiagramPath)) {
  rmSync(targetDiagramPath, { force: true })
  console.warn(
    `[sync:diagram] 未找到 Mermaid 文档，已移除旧产物: ${sourceDiagramPath}`,
  )
  process.exit(0)
}

const sourceContent = readFileSync(sourceDiagramPath, 'utf8')
const title = extractRequiredField(sourceContent, /^#\s+(.+)$/m, '标题')
const purpose = extractRequiredField(
  sourceContent,
  /^>\s*用途：(.+)$/m,
  '用途说明',
)
const mermaid = extractRequiredField(
  sourceContent,
  /```mermaid\s*([\s\S]*?)```/m,
  'Mermaid 代码块',
)
const notes = extractDiagramNotes(sourceContent)

mkdirSync(targetDiagramDirectory, { recursive: true })

writeFileSync(
  targetDiagramPath,
  JSON.stringify(
    {
      title,
      purpose,
      mermaid,
      notes,
    },
    null,
    2,
  ),
  'utf8',
)

console.log(`[sync:diagram] 已同步 Mermaid 图表到 ${targetDiagramPath}`)
