# 数据模型: 二维码生成工具库

**日期**: 2025-11-19
**功能**: 001-qrcode-generator
**状态**: Phase 1 设计

## 概述

本文档定义二维码生成工具库中的核心数据实体和它们之间的关系。作为纯前端工具库,这里的"数据模型"指的是运行时内存中的数据结构,而非持久化存储模型。

---

## 实体定义

### 1. QRCodeConfig (二维码配置对象)

**描述**: 用户提供的完整配置参数,定义如何生成二维码。

**字段**:

| 字段名 | 类型 | 必填 | 默认值 | 验证规则 | 说明 |
|--------|------|------|--------|---------|------|
| `content` | `string` | ✅ | - | 非空,长度≤2953字符 | 要编码的文本内容 |
| `size` | `number` | ❌ | `256` | ≥100 | 二维码尺寸(像素),小于100自动调整并警告 |
| `errorCorrectionLevel` | `'L'\|'M'\|'Q'\|'H'` | ❌ | `'M'` | 枚举值 | 容错级别: L(7%), M(15%), Q(25%), H(30%) |
| `foregroundColor` | `string` | ❌ | `'#000000'` | 有效颜色格式 | 前景色(二维码图案),支持HEX/RGB/颜色名称 |
| `backgroundColor` | `string` | ❌ | `'#FFFFFF'` | 有效颜色格式 | 背景色 |
| `logo` | `LogoConfig \| null` | ❌ | `null` | - | Logo配置,为null时不嵌入Logo |
| `outputFormat` | `'canvas'\|'svg'\|'base64'` | ❌ | `'canvas'` | 枚举值 | 输出格式 |
| `margin` | `number` | ❌ | `4` | ≥0 | 二维码外边距(模块单位) |

**约束**:
- `foregroundColor` 和 `backgroundColor` 对比度 < 3:1 时发出警告但允许生成
- `size` < 100 时自动调整到100并返回警告
- `content` 长度超过当前容错级别容量时返回错误

**示例**:
```javascript
const config = {
  content: 'https://example.com',
  size: 300,
  errorCorrectionLevel: 'H',
  foregroundColor: '#0066CC',
  backgroundColor: '#FFFFFF',
  logo: {
    source: 'https://example.com/logo.png',
    scale: 0.2
  },
  outputFormat: 'canvas'
}
```

---

### 2. LogoConfig (Logo配置对象)

**描述**: 定义如何加载和嵌入Logo图像。

**字段**:

| 字段名 | 类型 | 必填 | 默认值 | 验证规则 | 说明 |
|--------|------|------|--------|---------|------|
| `source` | `string \| File \| Blob` | ✅ | - | 非空,有效的图像源 | Logo来源: URL字符串/File对象/Blob对象 |
| `scale` | `number` | ❌ | `0.2` | 0 < scale ≤ 0.2 | Logo相对二维码面积的占比,最大20% |
| `borderWidth` | `number` | ❌ | `0` | ≥0 | Logo周围的白边宽度(像素),提升可扫描性 |
| `borderColor` | `string` | ❌ | `'#FFFFFF'` | 有效颜色格式 | Logo边框颜色 |

**约束**:
- `scale` > 0.2 时自动限制为0.2并警告
- URL类型的`source`加载超时5秒返回TimeoutError
- 无效的`source`(404/加载失败)返回LoadError

**关系**:
- 从属于 `QRCodeConfig`
- 一个 `QRCodeConfig` 最多包含一个 `LogoConfig`

**示例**:
```javascript
const logoConfig = {
  source: 'data:image/png;base64,iVBORw0KG...',  // Data URI
  scale: 0.15,
  borderWidth: 2,
  borderColor: '#FFFFFF'
}
```

---

### 3. ColorInfo (颜色信息对象)

**描述**: 内部使用的规范化颜色数据,包含RGB值和亮度信息。

**字段**:

| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| `hex` | `string` | ✅ | HEX格式颜色值(如'#FF0000') |
| `r` | `number` | ✅ | 红色通道(0-255) |
| `g` | `number` | ✅ | 绿色通道(0-255) |
| `b` | `number` | ✅ | 蓝色通道(0-255) |
| `luminance` | `number` | ✅ | WCAG相对亮度(0-1) |

**用途**:
- 颜色对比度计算
- 颜色验证和规范化
- 内部传递标准化颜色信息

**转换规则**:
```javascript
// 输入: '#FF0000' / 'rgb(255,0,0)' / 'red'
// 输出: ColorInfo对象
{
  hex: '#FF0000',
  r: 255,
  g: 0,
  b: 0,
  luminance: 0.2126  // 根据WCAG 2.1计算
}
```

---

### 4. QRCodeMatrix (二维码矩阵)

**描述**: node-qrcode生成的二进制矩阵数据,表示二维码图案。

**字段**:

| 字段名 | 类型 | 说明 |
|--------|------|------|
| `modules` | `Uint8Array` | 二进制数据,1表示黑色模块,0表示白色 |
| `size` | `number` | 矩阵尺寸(模块数量,如21x21) |
| `version` | `number` | 二维码版本号(1-40) |

**关系**:
- 由 `QRCodeConfig.content` 和 `errorCorrectionLevel` 编码生成
- 用于各种渲染器的输入

**生命周期**:
1. 用户提供 `content` 和 `errorCorrectionLevel`
2. node-qrcode编码生成 `QRCodeMatrix`
3. 渲染器将矩阵渲染为指定格式
4. (可选) Logo处理器在渲染结果上叠加Logo

---

### 5. QRCodeOutput (二维码输出)

**描述**: 最终生成的二维码,根据`outputFormat`不同有不同的类型。

**类型定义**:

```typescript
type QRCodeOutput =
  | HTMLCanvasElement      // outputFormat = 'canvas'
  | string                 // outputFormat = 'svg' (SVG XML字符串)
  | string                 // outputFormat = 'base64' (Base64 Data URI)
```

**格式说明**:

| 格式 | 返回类型 | 用途 | 示例 |
|------|---------|------|------|
| `'canvas'` | `HTMLCanvasElement` | 直接插入DOM,进一步处理 | `<canvas>` 元素 |
| `'svg'` | `string` | 矢量图形,印刷场景 | `'<svg>...</svg>'` |
| `'base64'` | `string` | 嵌入HTML/CSS | `'data:image/png;base64,...'` |

---

### 6. GenerationWarning (生成警告)

**描述**: 非致命性问题的警告信息,生成仍会继续。

**字段**:

| 字段名 | 类型 | 说明 |
|--------|------|------|
| `type` | `'LOW_CONTRAST' \| 'SIZE_ADJUSTED' \| 'LOGO_SCALED'` | 警告类型 |
| `message` | `string` | 人类可读的警告消息 |
| `details` | `object` | 额外的上下文信息 |

**示例**:
```javascript
{
  type: 'LOW_CONTRAST',
  message: '前景色和背景色对比度过低(2.1:1),可能影响扫描成功率',
  details: {
    contrastRatio: 2.1,
    recommended: 3.0,
    foreground: '#CCCCCC',
    background: '#FFFFFF'
  }
}
```

---

### 7. GenerationError (生成错误)

**描述**: 阻止生成继续的致命错误。

**字段**:

| 字段名 | 类型 | 说明 |
|--------|------|------|
| `type` | `'VALIDATION_ERROR' \| 'TIMEOUT_ERROR' \| 'LOAD_ERROR' \| 'ENCODING_ERROR'` | 错误类型 |
| `message` | `string` | 错误消息 |
| `code` | `string` | 错误码(如'ERR_CONTENT_EMPTY') |
| `cause` | `Error \| null` | 原始错误对象(如果有) |

**错误类型说明**:

| 类型 | 触发条件 | 恢复建议 |
|------|---------|---------|
| `VALIDATION_ERROR` | 配置验证失败(如content为空) | 修正配置参数 |
| `TIMEOUT_ERROR` | Logo URL加载超过5秒 | 使用本地Logo或增加超时时间 |
| `LOAD_ERROR` | Logo加载失败(404/网络错误) | 检查URL或降级为无Logo |
| `ENCODING_ERROR` | 文本编码失败(超长/无效字符) | 缩短文本或检查字符合法性 |

---

## 数据流

```
用户输入配置
      ↓
[验证和规范化]
      ↓
  QRCodeConfig ──────→ [生成警告] → GenerationWarning[]
      ↓
[node-qrcode编码]
      ↓
  QRCodeMatrix
      ↓
   [渲染器]
      ↓
  Canvas/SVG/Base64
      ↓
  [Logo处理] ←── LogoConfig (如果有)
      ↓
  QRCodeOutput
```

---

## 状态转换

### LogoConfig 状态

```
PENDING (初始) → LOADING (加载中) → LOADED (已加载) → EMBEDDED (已嵌入)
                      ↓
                   FAILED (加载失败)
```

### 颜色验证状态

```
INPUT (输入) → PARSING (解析) → VALIDATED (验证通过)
                    ↓
                INVALID (格式错误)
```

---

## 验证规则总结

### QRCodeConfig 验证

1. ✅ `content` 非空且长度合理
2. ✅ `size` ≥ 100 (自动调整)
3. ✅ `errorCorrectionLevel` 为 L/M/Q/H 之一
4. ✅ `foregroundColor` 和 `backgroundColor` 为有效颜色格式
5. ⚠️  对比度 < 3:1 时警告(不阻止)
6. ✅ `outputFormat` 为 canvas/svg/base64 之一

### LogoConfig 验证

1. ✅ `source` 非空
2. ✅ `source` 为 File/Blob 对象或有效的URL字符串
3. ✅ `scale` 在 0-0.2 范围内 (超出自动限制)
4. ✅ URL类型的 `source` 在5秒内加载完成

---

## 默认值策略

所有可选字段都有明确的默认值,确保用户可以只提供`content`就能生成二维码:

```javascript
const DEFAULT_CONFIG = {
  size: 256,
  errorCorrectionLevel: 'M',
  foregroundColor: '#000000',
  backgroundColor: '#FFFFFF',
  logo: null,
  outputFormat: 'canvas',
  margin: 4
}
```

最小调用示例:
```javascript
generateQRCode({ content: 'Hello World' })
// 等同于
generateQRCode({
  content: 'Hello World',
  size: 256,
  errorCorrectionLevel: 'M',
  foregroundColor: '#000000',
  backgroundColor: '#FFFFFF',
  logo: null,
  outputFormat: 'canvas',
  margin: 4
})
```
