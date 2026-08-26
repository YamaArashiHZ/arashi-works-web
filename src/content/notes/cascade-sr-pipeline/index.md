---
title: AI 超分流水线部署方案
summary: 分步重绘式 4K/8K/20K 超分——SeedVR2/FlashVSR + Flux.2-Klein 重绘 + RealESRGAN 收尾的模型核验、硬件要求与部署参数要点。
draft: false
category: technical
tags:
    - ai
featured: false
publishedAt: "2026-08-02T12:00:00+08:00"
---

> 方案来源：B 站视频《细节爆炸！20K分辨率级还原动画原图的方式？！》（UP：知晓更sulTO，2026-03-20）。本文为对该视频简介所列模型的**核实与工程化复刻**，可独立部署。核验日期：2026-08。
>
> 一句话：单个超分模型做不到高倍放大，本方案靠**分步叠加**——每次放大都补一次细节，所以高倍数下仍清晰。

---

## 一、原理：为什么能到 20K

分步叠加三档，各干各擅长的一档：

```text
底图（如 1024px）
  ├─ 阶段1：重绘式/扩散式超分 ×4  (SeedVR2 或 FlashVSR)
  │        → 细节"重画"，放大到 4K 级
  ├─ 阶段2：生成式重绘增强 ×4 或 ×2 (Flux.2-Klein 图生图, 可选)
  │        → 提示词引导补充细节/风格增强
  └─ 阶段3：重建式超分收尾 ×2  (Real-ESRGAN)
── 最终：1K 底图 → 16K~20K
```

- **混合分步**：不同模型接力，各做最擅长的一档
- **叠加超分**：同一模型连续多次（×4 两次 = ×16）
- 这是纯重建式（一次 4×）无法做到的

## 二、硬件要求

| 项目 | 要求 |
| --- | --- |
| 显存 | **最低 8G**（fp8 量化 + 分块 tile 可跑）；推荐 12G+ |
| 参考配置 | RTX 5080 16G：宽裕，阶段 1/2 可关 tile 全幅跑，2K 底图直接上 8K |
| 系统 | Windows 10+ / Linux，NVIDIA 显卡（CUDA） |
| 存储 | 模型合计约 20~40GB 下载空间 |

## 三、模型清单

### 已核实（开源，可直接下载）

| 模型 | 用途 | 阶段 | 来源 | 许可 |
| --- | --- | --- | --- | --- |
| **SeedVR2** | 扩散式超分主模型，保真最好，无限分辨率 | 1（主） | `github.com/ByteDance-Seed/SeedVR`（ICLR 2026，权重按仓库 README 下载） | 开源，商用需自查条款 |
| **FlashVSR** | 单步扩散超分，速度快（CVPR 2026），视频/单帧均可 | 1（备选） | `github.com/OpenImagingLab/FlashVSR`；HF: `JunhaoZhuang/FlashVSR-v1.1` | Apache 2.0 |
| **Flux.2-Klein** | 图生图重绘增强，提示词可控补细节（9B 轻量） | 2（可选） | HF: `black-forest-labs/FLUX.2-klein-9B` | 按 BFL 条款 |
| **Real-ESRGAN** | 重建超分收尾，轻量快 | 3 | ComfyUI 内置 / 官方仓库 | Apache 2.0 |

### 未核实（来自 UP 主网盘，公开渠道查不到出处）

以下模型名在 GitHub / HuggingFace / ModelScope **无法核验**，推测为社区整合包内本地命名，使用前注意来源可信度与商用合规，**建议先用上面 4 个开源模型替代**：

- RecoverV2 / RecoverV3
- WonderV1 / WonderV2
- Redefine-Realistic
- Standard-Max
- Image 1.5
- Banana Pro / 2（Google Nano Banana 系，**官方不开源权重**，本地无法合法部署，勿信第三方"转换版"）

## 四、部署步骤（Windows + ComfyUI）

1. **安装 ComfyUI**：用官方 Portable 版（免 Python 环境），解压后运行 `run_nvidia_gpu.bat`，浏览器打开 `http://127.0.0.1:8188`
2. **安装所需节点**（`custom_nodes` 目录下 git clone）：`ComfyUI-SUPIR`（SeedVR 工作流参考）、`ComfyUI-GGUF`（fp8 省显存）、`ComfyUI_UltimateSDUpscale`（分块放大）
3. **下载模型权重**：SeedVR2/FlashVSR → `models/checkpoints`；FLUX.2-klein-9B → `models/diffusion_models` + T5/CLIP 文本编码器 → `models/text_encoders`；Real-ESRGAN（如 `RealESRGAN_x4plus.pth`）→ `models/upscale_models`
4. **搭建三阶段工作流**：

```text
输入图
 └→ 阶段1 (SeedVR2 或 FlashVSR)：scale=4
 └→ 阶段2 (Flux.2-Klein img2img)：denoise≈0.3~0.5，提示词描述补充细节（可选）
 └→ 阶段3 (Upscale Model: Real-ESRGAN x4)：scale=2
输出图
```

> 项目 `workflows/` 目录下已有几组对应的 ComfyUI JSON 工作流（如 `Stage_1_SeedVR2_2048.json`、`Stage_2_FLUX2_Klein9B_Faithful.json`、`Stage_3_RealESRGAN_x2.json`、以及组合版 `SeedVR2_3B_FLUX2_Klein9B_RealESRGAN_x2.json`），可直接对照导入。

## 五、参数建议（二次元角色设定图场景）

| 阶段 | 参数 | 说明 |
| --- | --- | --- |
| 阶段1 SeedVR2 | 4×；tile 分块开 | 保真优先，细节重建强，角色特征不易漂移 |
| 阶段2 Flux.2-Klein | denoise 0.3~0.5；提示词写清"保持原人物脸型/发型/服装细节不变" | 重绘会"自由发挥"：花纹/饰品/文字可能被改，强度越高越明显 |
| 阶段3 Real-ESRGAN | 2× | 纯重建，无漂移风险 |

**关键提醒**：

- **细节漂移是重绘式方案的固有风险**（脸型、花纹、logo 可能变化），出图后逐张检查关键细节
- 显存不足时：阶段 1/2 开 tile 分块、模型用 fp8/GGUF 量化
- 追求极致保真时：跳过阶段 2，仅用 SeedVR2 ×4 + Real-ESRGAN ×2

## 六、替代方案（不想本地部署时）

- 付费网页端：Magnific Premium+（含 Magnific 10K + Topaz 超分，约 $33.75/月）、Topaz Image Web（$12~19/月，Wonder 3，32MP）
- 免费网页端：Bigjpg（动漫 20 张/月）、Waifu2x、Krea（100 积分/天）

---

*本文由对公开方案的核实与工程化整理生成，用于个人网站技术笔记栏目。*
