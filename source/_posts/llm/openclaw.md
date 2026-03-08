---
title: OpenClaw 部署与配置全指南：从零开始搭建你的 AI 助手
date: 2026-03-08 00:00:00
description: 开源 AI 助手框架 OpenClaw 的部署、配置与实战经验
categories: 大模型
tags:
- AI助手
- OpenClaw
- 自动化
- NVIDIA
- 大模型
- 2026
---


# 什么是 OpenClaw

核心特点：
- 本地运行，数据隐私安全
- 高度可定制，支持自定义技能（Skills）
- 支持多种大模型（Qwen、Kimi 等）
- 丰富的工具生态

# 环境准备

## 系统要求

- **操作系统**：macOS（已验证 Darwin 24.6.0 arm64）
- **Node.js**：v25.6.1 或更高版本
- **Shell**：zsh（推荐）
- **内存**：建议 8GB+
- **磁盘空间**：至少 5GB 可用空间

## 依赖安装

```bash
# 安装 Homebrew（如果还没有）
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 安装 Node.js（OpenClaw 运行时依赖）
brew install node

# 验证
node --version
```

# 安装步骤

## 1. 安装 OpenClaw

```bash
curl -fsSL https://openclaw.ai/install.sh | bash

openclaw --version
```

## 2. 初始化工作空间

```bash
mkdir -p ~/.openclaw/workspace
cd ~/.openclaw/workspace

openclaw onboard
```

## 3. 启动 Gateway 服务

```bash
openclaw gateway status
openclaw gateway start
openclaw gateway logs
```

# 配置详解

## 核心配置文件结构

```
~/.openclaw/workspace/
├── AGENTS.md          # 助手行为准则和工作流程
├── SOUL.md            # 助手的人格设定
├── USER.md            # 用户信息配置
├── IDENTITY.md        # 助手身份信息
├── TOOLS.md           # 本地工具和配置备注
├── MEMORY.md          # 长期记忆（主会话专用）
├── memory/            # 每日记忆文件
│   └── YYYY-MM-DD.md
├── HEARTBEAT.md       # 定时任务配置
└── skills/            # 自定义技能目录
```

## 关键配置文件说明

### AGENTS.md - 行为准则

定义助手的工作流程、记忆管理策略、安全边界和群聊参与规则。

核心原则：
- 先读文件再行动，不盲目询问
- 重要信息必须写入文件，"文字 > 大脑"
- 外部操作（发邮件、发推文）需要确认
- 群聊中保持适度参与，不刷屏

### SOUL.md - 人格设定

定义助手的核心特质（真诚、有意见、资源导向）、边界意识和沟通风格。

### TOOLS.md - 本地配置

存放环境特定的配置，比如搜索策略优先级、设备名称、TTS 语音偏好等。

示例：

```markdown
## Search Strategy
1. Tavily Search (优先)
2. Brave Search (备用)
3. Multi Search Engine (兜底)
```

### HEARTBEAT.md - 定时任务

配置轻量级定时任务，零 Token 消耗：

```bash
echo '0 8 * * * /path/to/script.sh >> /path/to/log.log 2>&1' | crontab -
```

适合每日信息抓取、定时检查更新、批量任务处理等场景。

# 可用 Skills 介绍

OpenClaw 通过 Skills 系统扩展功能，以下是部分已有的 Skills：

**搜索类**：
- **tavily-search**：AI 优化的搜索，返回干净内容，大多数场景首选
- **multi-search-engine**：17 个引擎集成（8 国内 + 9 国际），适合复杂搜索和隐私需求
- **web_search**：Brave Search 集成，备用方案
- **web_fetch**：网页内容提取

**多媒体类**：
- **peekaboo**：macOS UI 自动化（截图、UI 操作）
- **weather**：天气查询
- **douyin-hot-trend**：抖音热榜抓取

**文档协作类**：
- **feishu-doc / feishu-drive / feishu-wiki / feishu-bitable / feishu-chat**：飞书全家桶，覆盖文档、云盘、知识库、多维表格和聊天

**系统管理类**：
- **healthcheck**：安全审计和系统检查
- **skill-creator**：技能创建和管理
- **clawhub**：技能市场搜索安装

**AI 模型类**：
- **ollama-local**：本地 Ollama 模型管理

## 安装新 Skills

```bash
clawhub search <关键词>
clawhub install <skill-name>
clawhub update
clawhub list
```

# 从 openclaw-cn 切换到原版 openclaw

初次尝试时使用了国内社区维护的 `openclaw-cn` 版本，但遇到了严重问题：

- Kimi Coding Plan 无法使用，配置了 API Key 后模型始终调不通
- 即使没有成功调用，也会消耗 Token

解决方案很简单——切换到原版：

```bash
npm uninstall -g openclaw-cn
curl -fsSL https://openclaw.ai/install.sh | bash
openclaw --version
```

切换后 Kimi 模型和其他功能恢复正常，Token 消耗也不再异常。

**经验**：除非有特殊的国内网络需求，建议直接使用原版 OpenClaw。安装后立即测试核心功能是否正常。

# 模型配置：使用 NVIDIA 免费 Token

Kimi 的免费额度耗尽后，发现 NVIDIA 提供了免费的 Qwen 模型 Token，可以继续使用 OpenClaw。

## 获取 NVIDIA 免费 Token

1. 注册 [NVIDIA NGC 平台](https://ngc.nvidia.com)（免费）
2. 登录后进入 "API Keys" 页面，创建 API Key
3. 可用模型包括 Qwen 2.5 系列（Qwen2.5-72B、Qwen2.5-Coder 等），每月免费额度足够日常使用

## 配置 openclaw.json

OpenClaw 的主配置文件位于 `~/.openclaw/openclaw.json`：

```json
{
  "models": {
    "mode": "merge",
    "providers": {
      "nvidia": {
        "baseUrl": "https://integrate.api.nvidia.com/v1",
        "apiKey": "nvapi-你的API-Key",
        "api": "openai-completions",
        "models": [
          {
            "id": "qwen/qwen3.5-122b-a10b",
            "name": "Qwen 3.5 122B A10B",
            "api": "openai-completions",
            "reasoning": false,
            "input": ["text"],
            "cost": {
              "input": 0,
              "output": 0,
              "cacheRead": 0,
              "cacheWrite": 0
            },
            "contextWindow": 262144,
            "maxTokens": 8192
          }
        ]
      }
    }
  },
  "agents": {
    "defaults": {
      "model": {
        "primary": "nvidia/qwen/qwen3.5-122b-a10b"
      }
    }
  }
}
```

配置说明：
- `baseUrl`：NVIDIA 集成 API 地址
- `contextWindow`：262144（256K 上下文）
- `maxTokens`：8192（单次响应最大 token 数）
- `cost` 全部为 0，表示使用免费额度

> 安全提示：不要将 API Key 提交到 Git，建议使用环境变量或 `.env` 文件管理。

## 验证

```bash
openclaw status
# 应该看到类似：
# Model: nvidia/qwen/qwen3.5-122b-a10b
# Cost: $0.0000 (免费额度)
# Context: 131k/262k (50%)
```

## 注意事项

- NVIDIA 免费额度有使用限制，合理控制频率
- Qwen 2.5 系列性能优秀，适合代码生成和文本分析
- 使用 `.gitignore` 排除配置文件中的敏感信息

# 最佳实践

## 记忆管理

- **即时记录**：重要信息立刻写入 `memory/YYYY-MM-DD.md`
- **定期整理**：每周 review，更新 `MEMORY.md`
- **分类清晰**：决策、经验、教训分开记录

## 自动化任务：Heartbeat vs Cron

| 场景 | 推荐方案 | 原因 |
|------|---------|------|
| 多任务批量检查 | Heartbeat | 可结合对话上下文 |
| 精确时间执行 | Cron | 时间准确，独立运行 |
| 零 Token 需求 | Cron + 脚本 | 完全不消耗 Token |
| 需要 AI 判断 | Heartbeat | 可调用大模型 |

## 浏览器操作

效率技巧：
1. 用 `snapshot` 检查页面状态后再操作
2. 批量获取 URL 后立即下载，避免签名过期
3. 文件上传前先复制到 `/tmp/openclaw/uploads/`
4. 分步操作，避免超时

重试机制示例：

```javascript
for (let i = 0; i < 3; i++) {
  try {
    await click(ref);
    break;
  } catch (e) {
    if (i === 2) throw e;
    await snapshot({delayMs: 2000});
  }
}
```

## 安全边界

**需要确认**：发送邮件、发布公开内容、删除重要数据、访问外部 API

**可自由执行**：读取本地文件、搜索网络、整理工作空间、更新记忆文件

# 资源链接

- [OpenClaw 官方文档](https://docs.openclaw.ai)
- [GitHub 仓库](https://github.com/openclaw/openclaw)
- [技能市场 ClawHub](https://clawhub.com)
- [NVIDIA NGC](https://ngc.nvidia.com)
- [社区 Discord](https://discord.com/invite/clawd)
