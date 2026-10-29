# Littlewood · littlewood.io

把反直觉的科学问题画明白。静态站点，无构建步骤；共用样式在 `public/site.css`、`public/article.css`，图/SVG 内联在各页里。深色主题：深蓝黑底、毛玻璃面板、金/青强调。

- 首页：`public/index.html`（文章目录）
- 文章：`public/hydrostatic-paradox.html`（《为什么 1 千克的薄层水，仍可能让挡板承受 1000 吨力？》），线上地址不带 `.html`：https://littlewood.io/hydrostatic-paradox
- 部署（Cloudflare Worker 静态资源，域名 littlewood.io）：push 到 `main` 自动部署，或手动：

```sh
npx wrangler deploy
```

