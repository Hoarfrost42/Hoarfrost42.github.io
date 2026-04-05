# Hoarfrost42 Portfolio

基于 `Vite + React + TypeScript + Tailwind CSS v4` 的个人作品集网站首版，核心定位是面向 `AI 产品经理` 与 `游戏策划` 的双阅读路径作品集。

## 当前内容结构

- 首页双入口：`AI 产品经理方向` / `游戏策划方向`
- 已接入项目：`AI空间站`、`Contract Risk Agent`、`Vestige / 黑域边界`
- 视觉风格：`Hand-Drawn Sketch` 手绘涂鸦笔记页

## 本地开发

```bash
npm install
npm run dev
```

默认开发地址：

```text
http://localhost:5173/
```

如果要看构建后的真实效果：

```bash
npm run build
npm run preview -- --host 127.0.0.1 --port 4173
```

然后访问：

```text
http://127.0.0.1:4173/
```

根目录下的 `柳培钧_南开大学_26届_个人简历.pdf` 会在 `dev/build` 前自动同步到站点公开资源，发布后访问路径为：

```text
./resume.pdf
```

## 关于“直接双击 index.html 白屏”

这是本地 `file://` 打开 Vite/React 构建产物时的常见现象，不代表页面本身有问题。当前入口页已加入降级提示，但完整站点仍应通过本地 HTTP 服务或 GitHub Pages 访问。

## 构建输出

执行：

```bash
npm run build
```

静态产物会输出到仓库根目录下的：

```text
../docs/
```

也就是当前工作区的：

```text
F:\Githubio\docs
```

## GitHub Pages 发布说明

当前 `vite.config.ts` 采用：

- `base: './'`
- `build.outDir: '../docs'`

推荐把 GitHub Pages 发布目录指向仓库根下的 `docs` 文件夹。这样可以同时兼容：

- GitHub Pages 静态托管
- 本地 `npm run preview` 预览
- 后续继续保留 `portfolio-app` 作为源码目录

## 后续迭代

- 补充每个项目的独立案例页
- 增加截图、流程图、评测图表与证据材料
- 增加简历下载入口
- 完善部署与更新流程
