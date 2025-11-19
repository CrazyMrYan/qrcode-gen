# 实现计划: 二维码生成工具库

**分支**: `001-qrcode-generator` | **日期**: 2025-11-19 | **规格**: [spec.md](./spec.md)
**输入**: 功能规格来自 `/specs/001-qrcode-generator/spec.md`

**说明**: 本模板由 `/speckit.plan` 命令填充。详见 `.specify/templates/commands/plan.md` 执行流程。

## 概要

开发一个面向Web浏览器的二维码生成JavaScript工具库,支持文本/URL转二维码,提供尺寸、颜色定制,Logo嵌入,以及Canvas/SVG/Base64多种输出格式。核心目标是简洁易用的API(少于5行代码生成基础二维码),高性能(<100ms生成时间),高可扫描性(99%成功率),以及完善的文档和示例。技术方案基于Canvas API进行二维码渲染,使用Reed-Solomon算法实现容错纠正,支持L/M/Q/H四种容错级别。

## 技术上下文

**语言/版本**: JavaScript ES6+ / TypeScript (用于类型定义)
**主要依赖**: NEEDS CLARIFICATION - 待研究最佳二维码编码库(考虑qrcode-generator、node-qrcode等)
**存储**: N/A (纯前端工具库,无需持久化存储)
**测试**: Jest (单元测试) + Playwright (集成测试 - Canvas渲染验证)
**目标平台**: 现代浏览器 (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
**项目类型**: 单一JavaScript库项目 (UMD/ESM双模块格式)
**性能目标**:
  - 标准二维码生成 < 100ms
  - Logo嵌入二维码生成 < 200ms
  - 支持并发生成(Web Worker可选优化)
**约束**:
  - 最小二维码尺寸 100x100px
  - Logo最大占比 20%
  - 远程Logo加载超时 5秒
  - 浏览器内存占用 < 50MB (单次生成)
**规模/范围**:
  - 核心库代码 < 500 LOC
  - 支持最长文本 ~2953字符 (QR Code Version 40, L级)
  - 文档包含 ≥5 个使用示例

## 宪章检查

*门禁: 必须在 Phase 0 研究前通过。Phase 1 设计后重新检查。*

### I. 代码质量优先

- ✅ **编码规范**: 将使用ESLint + Prettier确保代码风格一致
- ✅ **类型注解**: 使用TypeScript提供完整类型定义文件(.d.ts)
- ✅ **代码复杂度**: 单函数圈复杂度 < 10,核心二维码生成逻辑将模块化拆分
- ✅ **静态分析**: 配置ESLint规则,零警告要求
- ✅ **代码审查**: 所有PR需至少一人审查批准

### II. 测试驱动开发

- ✅ **TDD流程**: 遵循红-绿-重构循环
- ✅ **测试覆盖率**:
  - 单元测试覆盖率目标 ≥ 80%
  - 核心二维码生成/Logo嵌入逻辑覆盖率 ≥ 95%
- ✅ **测试类型**:
  - 单元测试: 测试配置解析、颜色验证、尺寸校正等独立函数
  - 集成测试: 测试完整生成流程和不同输出格式
  - 契约测试: 验证公共API接口的输入输出契约
- ✅ **Bug修复**: 先编写失败测试重现bug,再修复

### III. 用户体验一致性

- ✅ **API一致性**:
  - 统一的配置对象接口
  - 一致的错误消息格式
  - 清晰的警告提示(对比度过低、尺寸调整等)
- ✅ **响应时间**:
  - 基础生成 < 100ms (符合规格SC-004)
  - Logo嵌入 < 200ms
  - 远程Logo加载显示进度(可选回调)
- ✅ **错误处理**:
  - 清晰的错误类型(ValidationError, TimeoutError等)
  - 提供恢复建议(如自动降级为无Logo)
  - 所有错误记录到console

### IV. 性能要求

- ✅ **性能指标**:
  - 标准二维码生成 p95 < 100ms (SC-004)
  - Logo嵌入二维码 p95 < 200ms
  - 库体积 < 50KB (gzip压缩后)
- ✅ **性能测试**:
  - 使用benchmark.js进行性能基准测试
  - CI中集成性能回归检测
- ✅ **资源优化**:
  - 代码分割: 核心生成 + Logo处理可独立加载
  - 懒加载: 远程Logo加载采用异步Promise
  - 缓存: 相同配置复用Canvas上下文

### V. 可维护性与文档

- ✅ **代码自文档化**:
  - 清晰的函数和变量命名
  - 复杂算法(Reed-Solomon)添加注释说明原理
  - 使用常量替代魔法数字(如LOGO_MAX_RATIO = 0.2)
- ✅ **文档要求**:
  - README: 项目简介、安装、快速开始
  - API文档: 所有公共方法、配置选项、示例代码
  - quickstart.md: 5+个使用场景示例 (SC-003)
- ✅ **依赖管理**:
  - package-lock.json锁定版本
  - 定期更新依赖(Dependabot)
  - 移除未使用依赖

**宪章合规状态**: ✅ 全部通过 (无需复杂度跟踪表)

## 项目结构

### 文档 (当前功能)

```text
specs/001-qrcode-generator/
├── plan.md              # 本文件 (/speckit.plan 命令输出)
├── research.md          # Phase 0 输出 (/speckit.plan 命令)
├── data-model.md        # Phase 1 输出 (/speckit.plan 命令)
├── quickstart.md        # Phase 1 输出 (/speckit.plan 命令)
├── contracts/           # Phase 1 输出 (/speckit.plan 命令)
│   └── api.d.ts         # TypeScript API 契约定义
└── tasks.md             # Phase 2 输出 (/speckit.tasks 命令 - 不由 /speckit.plan 创建)
```

### 源代码 (仓库根目录)

```text
src/
├── core/                # 核心二维码生成逻辑
│   ├── encoder.js       # 二维码编码器 (文本 -> 二进制矩阵)
│   ├── renderer.js      # 渲染器基类
│   └── error-correction.js  # 容错级别处理
├── renderers/           # 多种输出格式渲染器
│   ├── canvas.js        # Canvas 渲染
│   ├── svg.js           # SVG 渲染
│   └── base64.js        # Base64 渲染
├── processors/          # 图像处理模块
│   ├── logo-loader.js   # Logo 加载器 (File/Blob/URL)
│   ├── logo-scaler.js   # Logo 尺寸调整
│   └── color-validator.js  # 颜色验证和对比度检查
├── utils/               # 工具函数
│   ├── config-parser.js # 配置解析和默认值
│   ├── validators.js    # 输入验证
│   └── constants.js     # 常量定义
├── types/               # TypeScript 类型定义
│   └── index.d.ts       # 公共 API 类型
└── index.js             # 库入口,导出公共 API

tests/
├── unit/                # 单元测试
│   ├── core/
│   ├── processors/
│   └── utils/
├── integration/         # 集成测试
│   ├── generate.test.js      # 完整生成流程
│   ├── formats.test.js       # 输出格式测试
│   └── logo-embed.test.js    # Logo 嵌入测试
└── contract/            # 契约测试
    └── api.test.js      # API 接口契约验证

examples/                # 使用示例 (用于文档和手动测试)
├── basic.html           # 基础使用
├── custom-style.html    # 自定义样式
├── with-logo.html       # Logo 嵌入
├── multiple-formats.html # 多种格式
└── advanced.html        # 高级配置

dist/                    # 构建输出 (gitignore)
├── qrcode-gen.js        # UMD 格式
├── qrcode-gen.esm.js    # ESM 格式
└── qrcode-gen.min.js    # 压缩版本
```

**结构决策**: 选择单一JavaScript库项目结构 (Option 1)。理由:
1. 这是纯前端工具库,无需后端或移动端结构
2. 模块化设计: core/renderers/processors 清晰分离关注点
3. 支持多种输出格式,每种格式独立renderer模块
4. 完整的测试覆盖: unit/integration/contract 三层测试
5. examples/ 目录既用于文档示例也可手动测试

## 复杂度跟踪

> **仅在宪章检查有违规需要论证时填写**

无违规项需要论证。
