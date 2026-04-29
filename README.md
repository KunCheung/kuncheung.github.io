# kuncheung-homepage

一个使用 Vite + React 搭建的个人品牌主页。页面结构偏内容优先，包含简介、近况、项目、写作和联系方式；当前内容仍以占位信息为主，已接入一篇真实文章。

## 开发

安装依赖：

```bash
npm install
```

启动本地开发服务器：

```bash
npm run dev
```

生产构建：

```bash
npm run build
```

本地预览构建产物：

```bash
npm run preview
```

## 内容维护

- 主页内容主要在 `src/App.jsx` 的数据数组里维护，例如 `updates`、`projects`、`posts`、`links`。
- 文章 Markdown 放在 `public/articles/`，当前文章是 `public/articles/agent-safety-core.md`。
- 写作栏目通过 `#/articles/<slug>` 打开站内文章页，由 React 读取 Markdown 并渲染中文长文排版。
- 头像占位图在 `public/profile-placeholder.svg`，替换为真实图片时保持同名文件即可。

## 部署提示

- `dist/` 是 `npm run build` 生成的产物，不建议手动编辑。
- 如果部署到 GitHub Pages 的项目页，例如 `https://<username>.github.io/kuncheung/`，需要在 `vite.config.js` 中设置对应的 `base`。
- 如果部署到用户名根站，例如 `https://<username>.github.io/`，默认 `base` 通常即可。
