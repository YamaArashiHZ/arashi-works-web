---
title: PixBox
summary: Pixiv 每日存图助手，支持浏览、筛选和批量保存作品。
type: software
status: maintained
draft: false
featured: true
publishedAt: "2026-07-29T15:22:19+08:00"
updatedAt: "2026-07-29T18:26:04+08:00"
tags:
    - tools
platforms:
    - windows
repositoryUrl: https://github.com/YamaArashiHZ/PixBox
feedbackUrl: https://github.com/YamaArashiHZ/PixBox/issues
license: MIT
cover: ./assets/cover.webp
---

PixBox 是一款面向 Windows 的 Pixiv 每日存图助手，支持浏览关注与推荐流、筛选作品、一键保存原图并自动生成压缩备份。

> PixBox 是非官方第三方客户端，与 pixiv Inc. 无隶属、赞助或官方授权关系。

## 功能

- 浏览 Pixiv 关注流和推荐流
- 筛选并批量选择作品
- 保存原图并生成压缩备份
- 自定义保存目录和日期路径模板
- 使用 Windows 凭据管理器保存登录凭据
- 支持签名验证的应用内自动更新

技术栈：Tauri 2、Vue 3、TypeScript、Rust。

## 下载

请从 [GitHub Releases](https://github.com/YamaArashiHZ/PixBox/releases) 下载最新的 Windows 安装包。

## 安全与隐私

- OAuth refresh token 和 Web 会话 Cookie（PHPSESSID）保存在 Windows 凭据管理器中，不以明文写入文件。
- PixBox 不收集用户数据，也不会将凭据上传至开发者服务器。
- 网络请求由本机直接发送至 Pixiv 或用户配置的代理。
- 系统密钥库不能防御已经控制本机用户会话的恶意软件。停止使用前，建议在应用内退出登录以清除本地凭据。
- 提交问题时，请勿附带 token、Cookie、OAuth 回调 URL、旧版 `tokens.json` 或包含私人数据的日志。

## 免责声明

- 本项目使用 Pixiv 未公开保证稳定性的 App API 和 Web AJAX 接口，相关功能可能随服务变更而失效。
- 使用者应遵守 [Pixiv 服务条款](https://www.pixiv.net/terms.php)、当地法律及作品权利人的要求。
- 请勿使用本项目进行高频请求、规避访问控制或其他违反 Pixiv 规则的行为。
- 内置的 `CLIENT_ID` 和 `CLIENT_SECRET` 是 Pixiv Android 客户端的公开常量，并非本项目的私有密钥。

## 贡献

欢迎提交 Issue 和 Pull Request。提交代码前请确保版本检查、前端构建和 Rust 测试均通过。提交消息建议遵循 [Conventional Commits](https://www.conventionalcommits.org/zh-hans/)。

## 许可

本项目基于 [MIT License](LICENSE) 开源。
