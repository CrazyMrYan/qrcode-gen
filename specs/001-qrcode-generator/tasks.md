# Tasks: 二维码生成工具库

**输入**: 设计文档来自 `/specs/001-qrcode-generator/`
**前置条件**: plan.md (技术栈), spec.md (用户故事), research.md (技术决策), data-model.md (数据实体)

**测试策略**: 本项目采用TDD方法,但测试任务作为可选项标记,仅在明确要求时执行

**组织方式**: 任务按用户故事分组,确保每个故事可以独立实现和测试

## 格式: `- [ ] [ID] [P?] [Story?] 描述`

- **[P]**: 可并行执行(不同文件,无依赖)
- **[Story]**: 属于哪个用户故事(如 US1, US2, US3)
- 描述中包含具体文件路径

---

## Phase 1: Setup (项目初始化)

**目的**: 创建项目基础结构和配置

- [X] T001 根据 plan.md 创建项目目录结构 (src/, tests/, examples/, dist/)
- [X] T002 初始化 package.json 并安装核心依赖 (qrcode, @types/qrcode)
- [X] T003 [P] 配置 ESLint 和 Prettier 规则文件 (.eslintrc.js, .prettierrc)
- [X] T004 [P] 配置构建工具 (Rollup/Webpack) 支持 UMD 和 ESM 输出
- [X] T005 [P] 配置 Jest 测试环境 (jest.config.js)
- [X] T006 [P] 创建 TypeScript 类型定义文件骨架 src/types/index.d.ts
- [X] T007 创建 .gitignore 文件排除 node_modules 和 dist

---

## Phase 2: Foundational (基础设施 - 阻塞所有用户故事)

**目的**: 核心基础设施,所有用户故事都依赖于此

**⚠️ 关键**: 完成此阶段前无法开始任何用户故事的实现

- [X] T008 [P] 创建常量定义文件 src/utils/constants.js (默认配置、错误码、限制值)
- [X] T009 [P] 实现配置解析器 src/utils/config-parser.js (合并用户配置和默认值)
- [X] T010 [P] 实现输入验证器 src/utils/validators.js (验证 content、size、errorCorrectionLevel 等)
- [X] T011 [P] 创建自定义错误类 src/utils/errors.js (ValidationError, TimeoutError, LoadError, EncodingError)
- [X] T012 [P] 实现颜色解析和验证 src/processors/color-validator.js (支持 HEX/RGB/颜色名称)
- [X] T013 [P] 实现 WCAG 2.1 对比度计算 src/processors/color-validator.js (相对亮度和对比度比率)
- [X] T014 创建渲染器基类 src/core/renderer.js (定义渲染接口)

**检查点**: 基础设施就绪 - 现在可以并行开始用户故事实现

---

## Phase 3: User Story 1 - 基础二维码生成 (优先级: P1) 🎯 MVP

**目标**: 开发者可以用最少代码生成标准黑白二维码,输入文本/URL即可输出可扫描的二维码图像

**独立测试**: 调用 `generateQRCode({ content: 'test' })` 生成二维码,用扫描器验证内容是否正确

### 实现 User Story 1

- [X] T015 [P] [US1] 封装 node-qrcode 编码器 src/core/encoder.js (文本 -> QRCodeMatrix)
- [X] T016 [P] [US1] 实现 Canvas 渲染器 src/renderers/canvas.js (矩阵 -> Canvas 元素)
- [X] T017 [US1] 实现主入口函数 src/index.js 导出 generateQRCode API
- [X] T018 [US1] 处理空内容错误 src/utils/validators.js (content 非空验证)
- [X] T019 [US1] 处理超长内容错误 src/utils/validators.js (content 长度验证)
- [X] T020 [US1] 添加错误日志输出 src/index.js (console.error)
- [X] T021 [US1] 创建基础使用示例 examples/basic.html

**检查点**: User Story 1 完成 - 可以生成和扫描基础二维码

---

## Phase 4: User Story 2 - 自定义尺寸和颜色 (优先级: P2)

**目标**: 开发者可以指定二维码尺寸和前景/背景色以匹配应用设计

**独立测试**: 指定 `size: 300, foregroundColor: '#0066CC', backgroundColor: '#FFFFFF'` 生成二维码,验证图像尺寸为 300x300 且颜色正确

### 实现 User Story 2

- [X] T022 [P] [US2] 扩展 Canvas 渲染器支持自定义颜色 src/renderers/canvas.js
- [X] T023 [P] [US2] 实现尺寸验证和自动调整 src/utils/validators.js (最小 100px)
- [X] T024 [US2] 实现颜色对比度检查和警告 src/processors/color-validator.js
- [X] T025 [US2] 扩展 QRCodeConfig 类型定义 src/types/index.d.ts (size, foregroundColor, backgroundColor, margin)
- [X] T026 [US2] 创建自定义样式示例 examples/custom-style.html

**检查点**: User Story 1 和 2 均可独立工作 - 基础生成和样式定制功能完整

---

## Phase 5: User Story 5 - 多种输出格式支持 (优先级: P2)

**目标**: 开发者可以导出 Canvas/SVG/Base64 格式以适应不同场景

**独立测试**: 分别请求 `outputFormat: 'canvas'/'svg'/'base64'` 验证返回对应格式的数据

### 实现 User Story 5

- [X] T027 [P] [US5] 实现 SVG 渲染器 src/renderers/svg.js (矩阵 -> SVG 字符串)
- [X] T028 [P] [US5] 实现 Base64 渲染器 src/renderers/base64.js (Canvas -> Base64 Data URI)
- [X] T029 [US5] 扩展主入口支持格式选择 src/index.js (outputFormat 参数)
- [X] T030 [US5] 扩展 QRCodeConfig 类型定义 src/types/index.d.ts (outputFormat)
- [X] T031 [US5] 创建多格式输出示例 examples/multiple-formats.html

**检查点**: User Story 1, 2, 5 均可独立工作 - 核心功能和多格式输出完整

---

## Phase 6: User Story 3 - 嵌入Logo图标 (优先级: P3)

**目标**: 开发者可以在二维码中心嵌入品牌 Logo,支持 File/Blob/URL 输入

**独立测试**: 提供 Logo 源 (`logo: { source: 'logo.png', scale: 0.2 }`),验证生成的二维码中心显示 Logo 且仍可扫描

### 实现 User Story 3

- [X] T032 [P] [US3] 实现 Logo 加载器 src/processors/logo-loader.js (支持 File/Blob/URL, 5秒超时)
- [X] T033 [P] [US3] 实现 Logo 尺寸缩放 src/processors/logo-scaler.js (最大 20% 面积)
- [X] T034 [US3] 实现 Logo 嵌入逻辑 src/processors/logo-embedder.js (Canvas API drawImage)
- [X] T035 [US3] 集成 Logo 处理到主流程 src/index.js (logo 参数处理)
- [X] T036 [US3] 处理 Logo 加载超时和失败 src/processors/logo-loader.js (TimeoutError, LoadError)
- [X] T037 [US3] 扩展 LogoConfig 类型定义 src/types/index.d.ts (source, scale, borderWidth, borderColor)
- [X] T038 [US3] 创建 Logo 嵌入示例 examples/with-logo.html

**检查点**: User Story 1, 2, 3, 5 均可独立工作 - Logo 功能完整且不影响其他功能

---

## Phase 7: User Story 4 - 错误纠正级别配置 (优先级: P3)

**目标**: 开发者可以根据场景调整容错级别 (L/M/Q/H)

**独立测试**: 设置 `errorCorrectionLevel: 'H'` 生成二维码,部分遮挡后验证仍可扫描

### 实现 User Story 4

- [X] T039 [P] [US4] 实现容错级别验证 src/utils/validators.js (L/M/Q/H 枚举)
- [X] T040 [US4] 传递容错级别到编码器 src/core/encoder.js
- [X] T041 [US4] 扩展 QRCodeConfig 类型定义 src/types/index.d.ts (errorCorrectionLevel)
- [X] T042 [US4] 创建高级配置示例 examples/advanced.html (包含容错级别演示)

**检查点**: 所有用户故事均可独立工作 - 完整功能集实现完成

---

## Phase 8: Polish & 交叉关注点

**目的**: 优化和完善影响多个用户故事的部分

- [X] T043 [P] 编写 README.md 文档 (项目简介、安装、快速开始)
- [X] T044 [P] 编写 API 文档 docs/api.md (所有配置选项和方法)
- [X] T045 [P] 创建 quickstart.md 文档 (5+ 使用场景示例)
- [X] T046 [P] 优化构建配置生成压缩版本 dist/qrcode-gen.min.js
- [X] T047 [P] 添加性能基准测试 tests/benchmark.js (使用 benchmark.js)
- [X] T048 代码审查和重构 (消除重复,改进命名)
- [X] T049 运行 ESLint 和 Prettier 格式化所有代码
- [X] T050 验证所有示例文件可正常运行 (手动测试)

---

## Dependencies & 执行顺序

### Phase 依赖关系

- **Setup (Phase 1)**: 无依赖 - 立即开始
- **Foundational (Phase 2)**: 依赖 Setup 完成 - **阻塞所有用户故事**
- **User Stories (Phase 3-7)**: 全部依赖 Foundational 完成
  - 用户故事可以并行实施(如果有团队容量)
  - 或按优先级顺序实施 (P1 → P2 → P3)
- **Polish (Phase 8)**: 依赖所有期望的用户故事完成

### User Story 依赖关系

- **User Story 1 (P1)**: Foundational 完成后可开始 - 无其他故事依赖
- **User Story 2 (P2)**: Foundational 完成后可开始 - 无其他故事依赖
- **User Story 5 (P2)**: Foundational 完成后可开始 - 轻微依赖 US1 (Canvas 渲染器)
- **User Story 3 (P3)**: Foundational 完成后可开始 - 依赖 US1 (需要基础二维码)
- **User Story 4 (P3)**: Foundational 完成后可开始 - 无其他故事依赖

### 每个 User Story 内部顺序

- 基础模块在前 → 集成在后
- 验证和错误处理与核心功能并行
- 类型定义可以最后完善
- 示例文件在功能完成后创建

### 并行机会

- Phase 1 所有标记 [P] 的任务可并行
- Phase 2 所有标记 [P] 的任务可并行(同阶段内)
- Phase 2 完成后,所有用户故事可以并行开始(如果团队容量允许)
- 每个用户故事内标记 [P] 的任务可并行
- 不同用户故事可由不同团队成员并行处理

---

## 并行示例: User Story 1

```bash
# 同时启动 User Story 1 的所有并行任务:
Task: "封装 node-qrcode 编码器 src/core/encoder.js"
Task: "实现 Canvas 渲染器 src/renderers/canvas.js"
```

---

## 并行示例: User Story 3

```bash
# 同时启动 User Story 3 的所有并行任务:
Task: "实现 Logo 加载器 src/processors/logo-loader.js"
Task: "实现 Logo 尺寸缩放 src/processors/logo-scaler.js"
```

---

## 实施策略

### MVP 优先 (仅 User Story 1)

1. 完成 Phase 1: Setup
2. 完成 Phase 2: Foundational (关键 - 阻塞所有故事)
3. 完成 Phase 3: User Story 1
4. **停止并验证**: 独立测试 User Story 1
5. 准备就绪时部署/演示

### 增量交付

1. 完成 Setup + Foundational → 基础就绪
2. 添加 User Story 1 → 独立测试 → 部署/演示 (MVP!)
3. 添加 User Story 2 → 独立测试 → 部署/演示
4. 添加 User Story 5 → 独立测试 → 部署/演示
5. 添加 User Story 3 → 独立测试 → 部署/演示
6. 添加 User Story 4 → 独立测试 → 部署/演示
7. 每个故事增加价值而不破坏先前故事

### 并行团队策略

如果有多个开发者:

1. 团队一起完成 Setup + Foundational
2. Foundational 完成后:
   - 开发者 A: User Story 1
   - 开发者 B: User Story 2
   - 开发者 C: User Story 4
3. US1 完成后:
   - 开发者 A: User Story 5 (依赖 US1 的 Canvas 渲染器)
   - 开发者 D: User Story 3 (依赖 US1 的基础生成)
4. 故事独立完成和集成

---

## 格式验证总结

✅ **所有任务遵循 Checklist 格式**:
- Checkbox: `- [ ]`
- Task ID: T001-T050 (按执行顺序)
- [P] 标记: 标记可并行任务(不同文件,无依赖)
- [Story] 标签: 用户故事阶段任务标记 US1-US5
- 描述: 清晰动作 + 具体文件路径

✅ **任务组织**:
- Setup: 7 个任务
- Foundational: 7 个任务
- User Story 1: 7 个任务
- User Story 2: 5 个任务
- User Story 5: 5 个任务
- User Story 3: 7 个任务
- User Story 4: 4 个任务
- Polish: 8 个任务
- **总计**: 50 个任务

✅ **独立测试标准**: 每个用户故事都有明确的独立测试方法

✅ **并行机会**: 已标识 23 个可并行任务

✅ **MVP 范围**: User Story 1 (基础二维码生成)

---

## 注意事项

- [P] 任务 = 不同文件,无依赖关系
- [Story] 标签将任务映射到特定用户故事以便追溯
- 每个用户故事应该是独立可完成和可测试的
- 在每个检查点停下来独立验证故事
- 避免: 模糊任务、同文件冲突、破坏独立性的跨故事依赖
- 每个任务或逻辑组后提交代码
