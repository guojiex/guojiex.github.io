---
title: Stock-A-Future - A股股票买卖点预测系统
date: 2025-01-08 22:34:37
description: 基于Go语言开发的A股股票买卖点预测系统，支持多种数据源，提供技术指标计算和智能预测功能
categories: stock
tags:
- golang
- stock
- api
- prediction
- technical-analysis
- echarts
- k-line
- macd
- rsi
---

> [Stock-A-Future GitHub Repository](https://github.com/guojiex/stock-a-future)

# Stock-A-Future 项目介绍

![股票查询](/images/stock-a-future/股票查询.png)

Stock-A-Future 是一个基于Go语言开发的A股股票买卖点预测系统，支持多种数据源（Tushare、AKTools），提供技术指标计算和买卖点预测功能。该项目采用现代化的技术栈，提供专业的K线图显示、智能搜索、股票收藏等丰富功能。

## 项目特性

### 📊 数据获取
- **多数据源支持**：集成Tushare API和AKTools（基于AKShare的免费开源数据源）
- 支持股票日线数据查询
- 自动数据预处理和清洗
- **股票列表工具**：支持从上交所在线获取最新股票列表
- **深交所数据**：使用本地Excel文件（`data/A股列表.xlsx`）提供完整深交所股票数据

### 📈 技术指标计算

![技术指标](/images/stock-a-future/技术指标.png)

- **MACD** - 指数平滑异同平均线，识别趋势转折
- **RSI** - 相对强弱指数，判断超买超卖
- **布林带** - 价格波动区间分析
- **移动平均线** - MA5/MA10/MA20/MA60/MA120多周期均线
- **KDJ** - 随机指标，短期买卖信号

### 🎯 智能预测
- 基于多指标综合分析的买卖点预测
- 预测概率和置信度计算
- 详细的预测理由说明
- 支持多时间周期预测

### 🚀 RESTful API
- 完整的REST API接口
- JSON格式数据交换
- CORS支持，便于前端集成
- 详细的错误处理和日志记录

### 🌐 Web界面

![日K线信息](/images/stock-a-future/日k线信息.png)

- **专业K线图**: 使用ECharts显示完整的OHLC数据
- **技术指标叠加**: MA5/MA10/MA20移动平均线
- **成交量副图**: 底部显示成交量柱状图，颜色与K线联动
- **智能搜索**: 支持股票名称和代码实时搜索
- **股票代码缓存**: 自动保存用户选择的股票，下次访问时自动恢复
- **响应式设计**: 自适应桌面端和移动端
- **交互体验**: 缩放、平移、十字光标等专业功能

### 🛠️ 开发工具
- **内置Curl工具**: Go语言版本的curl工具，支持Windows环境下的API调试
- **多平台支持**: 提供批处理和PowerShell脚本，简化编译和测试流程

## 技术架构

### 后端技术栈
- **Go 1.22+**: 使用最新版本的Go语言
- **标准库**: 主要使用`net/http`包构建RESTful API
- **数据源集成**: 支持Tushare和AKTools两种数据源
- **Excel处理**: 使用`excelize`库处理股票列表数据
- **配置管理**: 使用`godotenv`管理环境变量
- **数值计算**: 使用`shopspring/decimal`确保金融计算精度

### 前端技术栈
- **原生JavaScript**: 无框架依赖，轻量级实现
- **ECharts**: 专业的图表库，提供K线图和指标显示
- **响应式CSS**: 支持多设备访问
- **模块化设计**: 清晰的代码组织结构

### 项目结构
```
stock-a-future/
├── cmd/                    # 命令行工具
│   ├── server/            # 主应用程序入口
│   ├── curl/              # 内置curl工具
│   ├── stocklist/         # 股票列表获取工具
│   └── aktools-test/      # AKTools测试工具
├── internal/               # 内部包
│   ├── client/            # API客户端（Tushare + 交易所）
│   ├── handler/           # HTTP处理器
│   ├── indicators/        # 技术指标计算
│   ├── models/            # 数据模型
│   └── service/           # 业务逻辑服务
├── web/                   # Web资源
│   └── static/            # 静态文件（HTML、CSS、JS）
├── config/                # 配置管理
├── data/                  # 数据文件
│   └── A股列表.xlsx        # 深交所股票列表（Excel格式）
├── docs/                  # 项目文档
├── scripts/               # 构建和启动脚本
├── Makefile              # 构建脚本
└── README.md             # 项目文档
```

## 数据源对比

| 特性 | Tushare | AKTools |
|------|---------|---------|
| **费用** | 免费账号有限制，Pro版收费 | 完全免费，无调用限制 |
| **数据质量** | 专业级，数据准确度高 | 基于AKShare，数据质量良好 |
| **更新频率** | 实时，T+1 | 实时，T+1 |
| **安装复杂度** | 简单，仅需Token | 需要Python环境，安装AKTools |
| **稳定性** | 商业服务，稳定性高 | 开源项目，依赖社区维护 |
| **推荐场景** | 生产环境，商业应用 | 学习研究，个人项目 |

> **推荐**: 如果您是初学者或用于学习研究，建议使用AKTools数据源；如果是商业应用或对数据质量要求极高，建议使用Tushare。

## 快速开始

### 环境要求
- Go 1.22+
- 数据源选择：
  - **Tushare**: 需要Tushare Pro账号和Token，数据质量高但有限制
  - **AKTools**: 免费开源，基于[AKShare](https://akshare.akfamily.xyz/)，数据全面且无调用限制
    - 需要Python 3.7+环境
    - 安装命令：`pip install aktools`

### 安装步骤

1. **克隆项目**
   ```bash
   git clone https://github.com/guojiex/stock-a-future.git
   cd stock-a-future
   ```

2. **安装依赖**
   ```bash
   make deps
   ```

3. **配置环境变量**
   ```bash
   make env
   # 编辑.env文件，选择数据源并配置相应参数
   vim .env
   
   # 使用Tushare数据源
   DATA_SOURCE_TYPE=tushare
   TUSHARE_TOKEN=your_tushare_token_here
   
   # 或使用AKTools数据源（免费）
   DATA_SOURCE_TYPE=aktools
   AKTOOLS_BASE_URL=http://127.0.0.1:8080
   ```

4. **获取股票列表（可选）**
   ```bash
   # 获取上交所股票列表
   make fetch-sse
   
   # 获取所有股票列表（上交所在线获取 + 深交所Excel文件）
   make fetch-stocks
   ```
   
   > **注意**：深交所股票数据已包含在 `data/A股列表.xlsx` 文件中，无需在线获取。

5. **启动服务**
   ```bash
   # 开发模式
   make dev
   
   # 或者构建后运行
   make build
   make run
   ```

6. **编译Curl工具（可选）**
   ```bash
   # 使用批处理文件（推荐Windows用户）
   build-curl.bat
   
   # 或使用PowerShell脚本
   .\build-curl.ps1
   
   # 或手动编译
   go build -o curl.exe ./cmd/curl
   ```
   
   > **注意**：curl工具特别适合在Windows环境下调试API接口，无需安装额外的curl工具。

服务将在 `http://localhost:8081` 启动。

### 🚀 AKTools快速启动指南

如果您想快速体验系统功能，推荐使用AKTools数据源（完全免费）：

#### 1. 一键启动AKTools服务
```bash
# Windows用户（推荐）
start-aktools-server.bat

# PowerShell用户
.\start-aktools-server.ps1

# 手动启动
python -m aktools
```

#### 2. 启动Stock-A-Future API
```bash
# 使用启动脚本
start-aktools-server.bat

# 或手动启动
go run cmd/server/main.go
```

#### 3. 验证服务
```bash
# 测试AKTools连接
curl http://127.0.0.1:8080/api/public/stock_zh_a_info?symbol=000001

# 测试Stock-A-Future API
curl http://localhost:8081/api/v1/health
```

#### 4. 访问Web界面
在浏览器中打开：http://localhost:8081

> **提示**: 使用项目提供的启动脚本可以自动处理端口配置和依赖检查，推荐新手使用。

### 🔧 服务器管理

新增的Make命令让服务器管理更加便捷：

```bash
# 检查服务器状态（显示进程和端口占用）
make status

# 优雅停止服务器
make stop

# 强制停止（包括端口清理）
make kill

# 一键重启
make restart
```

## 功能展示

### 🖥️ Web界面特性

#### K线图升级

![日K线信息](/images/stock-a-future/日k线信息.png)

- **从简单折线图到专业K线图**: 显示完整的开盘、最高、最低、收盘价
- **红绿涨跌色彩**: 红色阳线表示上涨，绿色阴线表示下跌
- **成交量联动**: 底部成交量柱状图，颜色与K线保持一致
- **技术指标叠加**: 自动计算并显示MA5、MA10、MA20移动平均线

#### 智能搜索功能

![搜索功能视图](/images/stock-a-future/搜索功能视图.png)

- **实时搜索**: 输入股票名称或代码，300ms防抖搜索
- **模糊匹配**: 支持部分匹配，如输入"平安"可找到"平安银行"、"中国平安"
- **键盘导航**: 支持上下箭头键选择，回车确认
- **自动填充**: 选择搜索结果后自动填入股票代码框
- **股票代码缓存**: 自动保存用户选择的股票，下次访问时自动恢复，提升用户体验

#### 股票收藏功能

![股票收藏](/images/stock-a-future/股票收藏.png)

- **收藏管理**: 支持添加和删除股票收藏，便于快速访问常关注的股票
- **分组管理**: 支持将收藏的股票按不同分组进行管理
- **快速切换**: 一键切换至收藏的股票进行查看和分析

#### 交互体验
- **图表缩放**: 鼠标滚轮缩放，拖拽平移
- **数据提示**: 鼠标悬停显示详细的OHLC数据、成交量、涨跌幅
- **响应式设计**: 自适应不同屏幕尺寸
- **数据摘要**: 显示8个关键指标（收盘价、成交量、振幅等）

## 核心功能详解

### 收藏股票功能
收藏股票功能允许用户将感兴趣的股票及其对应的时间范围保存下来，方便快速访问和查看历史数据。

**主要特性**：
- ⭐ **收藏股票**：保存股票代码、名称和查询时间范围
- 📊 **快速查看**：点击收藏列表中的股票快速加载K线图
- 🕒 **时间记忆**：自动恢复收藏时设置的开始和结束日期
- 💾 **持久化存储**：数据保存在服务器端，重启后不丢失
- 🔄 **实时同步**：收藏状态实时更新

### API接口设计
系统提供完整的RESTful API接口，支持以下主要功能：

- **股票数据查询**: 获取股票日线数据和技术指标
- **预测分析**: 基于多指标的综合买卖点预测
- **收藏管理**: 股票的收藏、查询、删除等操作
- **健康检查**: 服务状态监控

### 技术指标算法
系统实现了多种经典技术指标的计算算法：

- **MACD**: 使用12日和26日EMA计算，9日EMA作为信号线
- **RSI**: 14日相对强弱指数，用于判断超买超卖
- **布林带**: 20日移动平均线，标准差倍数计算上下轨
- **移动平均线**: 支持多种周期的简单移动平均线
- **KDJ**: 9日随机指标，包含K、D、J三条线

## 使用场景

### 个人投资者
- 技术分析和买卖点判断
- 股票历史数据查询
- 投资决策支持

### 量化研究
- 技术指标回测
- 策略开发和验证
- 数据分析和建模

### 学习研究
- 股票市场学习
- 技术分析入门
- 编程实践项目

## 项目优势

1. **开源免费**: 基于开源技术栈，无商业限制
2. **技术先进**: 使用Go 1.23+最新特性，性能优异
3. **数据丰富**: 支持多种数据源，数据全面
4. **易于使用**: 提供Web界面和API接口，使用简单
5. **可扩展性**: 模块化设计，易于扩展新功能
6. **跨平台**: 支持Windows、Linux、macOS等平台

## 未来规划

- [ ] 增加更多技术指标
- [ ] 支持更多数据源
- [ ] 添加机器学习预测模型
- [ ] 开发移动端应用
- [ ] 增加回测功能
- [ ] 支持期货和期权数据

## 贡献指南

1. Fork 本项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 许可证

本项目采用MIT许可证，详见LICENSE文件。

---

**免责声明**: 本项目仅用于技术学习和研究目的，不构成任何投资建议。使用者应当自行承担投资风险。

*Stock-A-Future - 让股票投资更智能，让技术分析更简单*


