# Arashi Works

Arashi Works（山嵐异造坊）是山嵐的个人品牌作品站，用于展示软件、游戏、模组、实验项目与开发手记。

> 记录灵感，分享热爱，探索有趣的世界

## 当前状态

项目正在开发中，目前主要推进页面结构、响应式布局、亮暗主题与统一视觉体验。开发阶段不自动部署。

## 技术栈

- [Astro](https://astro.build/)
- TypeScript
- Markdown 内容集合
- 原生 CSS
- [Pagefind](https://pagefind.app/)
- Vitest
- Playwright

## 本地开发

环境要求：

- Node.js `>=22.12.0`
- npm

首次克隆或 CI 环境建议使用：

```powershell
npm ci
```

需要主动调整依赖时再使用：

```powershell
npm install
```


启动开发服务器：

```powershell
npm run dev
```

局域网真机调试：

```powershell
npm run dev -- --host
```

## 检查与测试

```powershell
npm test
npm run check
npm run build
npm run test:e2e
```

E2E 测试通过 Preview 使用 `dist/` 中的静态产物，运行前应先执行 `npm run build`，确保站点与 Pagefind 索引为最新版本。

## 搜索预览

Astro 开发服务器不会生成 Pagefind 索引，因此 `npm run dev` 下搜索功能可能显示加载失败提示。

需要验证完整搜索时运行：

```powershell
npm run preview:full
```

## 项目文档

正式实施方案位于：

```text
.docs/Arashi Works网站实施方案.md
```

## 版权与许可

网站代码、文章内容、软件项目和角色素材的许可或版权边界分别处理。仓库公开不代表其中所有内容均采用同一种开源许可证。

山雾铃（山霧りん / Yamagiri Rin）的角色设定、立绘、差分与徽记由山嵐原创并保留版权。允许非商业分享与非商业二次创作，使用时须署名“山嵐”并注明原始来源；未经另行授权不得用于商业用途。

各软件与模组项目的许可信息以对应独立仓库及作品页面说明为准。引用或再利用本站代码、文章或素材前，请先确认对应内容的许可与版权说明。