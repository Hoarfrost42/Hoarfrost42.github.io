import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  rmSync,
} from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const currentFilePath = fileURLToPath(import.meta.url)
const currentDirectory = dirname(currentFilePath)
const projectDirectory = resolve(currentDirectory, '..')
const sourceResumePath = resolve(
  projectDirectory,
  '..',
  '柳培钧_南开大学_26届_个人简历.pdf',
)
const publicDirectory = resolve(projectDirectory, 'public')
const targetResumePath = resolve(publicDirectory, 'resume.pdf')
const sourceImageDirectory = resolve(projectDirectory, '..', 'resource', 'img')
const targetImageDirectory = resolve(publicDirectory, 'resource', 'img')
const sourceTextDirectory = resolve(projectDirectory, '..', 'resource', 'text')
const targetTextDirectory = resolve(publicDirectory, 'resource', 'text')

if (!existsSync(sourceResumePath)) {
  console.warn(
    `[sync:resume] 未找到根目录简历文件，跳过同步: ${sourceResumePath}`,
  )
} else {
  mkdirSync(publicDirectory, { recursive: true })
  copyFileSync(sourceResumePath, targetResumePath)
  console.log(`[sync:resume] 已同步简历到 ${targetResumePath}`)
}

if (!existsSync(sourceImageDirectory)) {
  console.warn(
    `[sync:resume] 未找到截图目录，跳过同步: ${sourceImageDirectory}`,
  )
  process.exit(0)
}

rmSync(targetImageDirectory, { force: true, recursive: true })
mkdirSync(targetImageDirectory, { recursive: true })

const screenshotNameMap = new Map([
  ['首页.png', 'ai-home.png'],
  ['分类页.png', 'ai-category.png'],
  ['详情页.png', 'ai-detail.png'],
  ['效果展示.png', 'contract-report-demo.png'],
  ['测评指标.png', 'contract-metrics-chart.png'],
  ['测评混淆矩阵.png', 'contract-confusion-matrix.png'],
  ['跑团界面.png', 'vestige-runtime.png'],
])

for (const sourceFileName of readdirSync(sourceImageDirectory)) {
  const targetFileName = screenshotNameMap.get(sourceFileName) ?? sourceFileName
  copyFileSync(
    resolve(sourceImageDirectory, sourceFileName),
    resolve(targetImageDirectory, targetFileName),
  )
}

console.log(`[sync:resume] 已同步截图到 ${targetImageDirectory}`)

if (!existsSync(sourceTextDirectory)) {
  console.warn(
    `[sync:resume] 未找到文本目录，跳过同步: ${sourceTextDirectory}`,
  )
  process.exit(0)
}

rmSync(targetTextDirectory, { force: true, recursive: true })
mkdirSync(targetTextDirectory, { recursive: true })

for (const sourceFileName of readdirSync(sourceTextDirectory)) {
  copyFileSync(
    resolve(sourceTextDirectory, sourceFileName),
    resolve(targetTextDirectory, sourceFileName),
  )
}

console.log(`[sync:resume] 已同步文本资源到 ${targetTextDirectory}`)
