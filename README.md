# QRCode Generator - 二维码生成工具库

一个功能完善的二维码生成工具库,支持颜色定制、尺寸调整、Logo嵌入和多格式输出。

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## ✨ 特性

- 🎯 **简单易用** - 3行代码即可生成二维码
- 🎨 **样式定制** - 自定义颜色、尺寸、边距
- 🖼️ **Logo嵌入** - 支持品牌Logo嵌入,自动处理尺寸
- 📦 **多格式输出** - Canvas、SVG、Base64 三种格式
- ⚡ **高性能** - 标准二维码生成 < 100ms
- 🔒 **容错可靠** - 支持 L/M/Q/H 四种容错级别
- 📱 **浏览器原生** - 纯前端实现,无需服务端
- 🎓 **TypeScript支持** - 完整的类型定义

## 📦 安装

### NPM 安装

```bash
npm install @yjh1102/qrcode-gen
```

### 浏览器直接使用

在HTML中直接引入构建好的UMD版本(已包含所有依赖):

```html
<!-- 引入库文件 -->
<script src="dist/qrcode-gen.min.js"></script>

<script>
  // 使用全局变量 QRCodeGen
  const canvas = await QRCodeGen.generateQRCode({
    content: 'https://example.com'
  });
  document.body.appendChild(canvas);
</script>
```

## 🚀 快速开始

### 基础使用 (ES模块)

```javascript
import { generateQRCode } from '@yjh1102/qrcode-gen';

// 生成基础二维码
const canvas = await generateQRCode({
  content: 'https://example.com'
});

// 添加到页面
document.body.appendChild(canvas);
```

### 自定义样式

```javascript
const canvas = await generateQRCode({
  content: 'https://example.com',
  size: 300,
  foregroundColor: '#0066CC',
  backgroundColor: '#FFFFFF',
  margin: 4
});
```

### 嵌入Logo

```javascript
const canvas = await generateQRCode({
  content: 'https://example.com',
  size: 400,
  errorCorrectionLevel: 'H', // 使用高容错级别
  logo: {
    source: 'path/to/logo.png', // 支持 URL、File、Blob
    scale: 0.2,                 // Logo占比(最大20%)
    borderWidth: 4,             // Logo边框宽度
    borderColor: '#FFFFFF'      // Logo边框颜色
  }
});
```

### 多种输出格式

```javascript
// Canvas 格式(默认)
const canvas = await generateQRCode({
  content: 'https://example.com',
  outputFormat: 'canvas'
});

// SVG 格式(矢量图形)
const svg = await generateQRCode({
  content: 'https://example.com',
  outputFormat: 'svg'
});
document.body.innerHTML = svg;

// Base64 格式(Data URI)
const base64 = await generateQRCode({
  content: 'https://example.com',
  outputFormat: 'base64'
});
const img = document.createElement('img');
img.src = base64;
```

## 📖 API 文档

### `generateQRCode(config)`

生成二维码的主函数。

#### 参数

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `content` | `string` | ✅ | - | 要编码的文本内容 |
| `size` | `number` | ❌ | `256` | 二维码尺寸(像素),最小100px |
| `errorCorrectionLevel` | `'L'\|'M'\|'Q'\|'H'` | ❌ | `'M'` | 容错级别 |
| `foregroundColor` | `string` | ❌ | `'#000000'` | 前景色 |
| `backgroundColor` | `string` | ❌ | `'#FFFFFF'` | 背景色 |
| `logo` | `LogoConfig\|null` | ❌ | `null` | Logo配置 |
| `outputFormat` | `'canvas'\|'svg'\|'base64'` | ❌ | `'canvas'` | 输出格式 |
| `margin` | `number` | ❌ | `4` | 边距(模块单位) |

#### Logo配置 (LogoConfig)

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `source` | `string\|File\|Blob` | ✅ | - | Logo图像源 |
| `scale` | `number` | ❌ | `0.2` | Logo占比(0-0.2) |
| `borderWidth` | `number` | ❌ | `0` | 边框宽度(像素) |
| `borderColor` | `string` | ❌ | `'#FFFFFF'` | 边框颜色 |

#### 返回值

- `outputFormat: 'canvas'` → `HTMLCanvasElement`
- `outputFormat: 'svg'` → `string` (SVG XML)
- `outputFormat: 'base64'` → `string` (Data URI)

#### 异常

抛出 `GenerationError` 及其子类:
- `ValidationError` - 配置验证失败
- `TimeoutError` - Logo加载超时(5秒)
- `LoadError` - Logo加载失败
- `EncodingError` - 二维码编码失败

## 🎯 容错级别说明

| 级别 | 容错率 | 使用场景 |
|------|-------|---------|
| **L** | ~7% | 干净环境,数据量优先 |
| **M** | ~15% | 默认级别,平衡性能 |
| **Q** | ~25% | 需要更高可靠性 |
| **H** | ~30% | 嵌入Logo或可能损坏 |

💡 **提示**: 嵌入Logo时建议使用 H 级容错。

## 🌈 颜色支持

支持多种颜色格式:
- **HEX**: `#FF0000` 或 `#F00`
- **RGB**: `rgb(255, 0, 0)`
- **颜色名称**: `red`, `blue`, `green` 等

⚠️ **对比度警告**: 前景色和背景色对比度低于 3:1 时会发出警告(但仍可生成)。

## 📝 示例

查看 `examples/` 目录获取完整示例:

- [基础使用](./examples/basic.html)
- [自定义样式](./examples/custom-style.html)
- [Logo嵌入](./examples/with-logo.html)
- [多格式输出](./examples/multiple-formats.html)
- [高级配置](./examples/advanced.html)

## 🔧 开发

```bash
# 安装依赖
npm install

# 构建
npm run build

# 运行测试
npm test

# 代码检查
npm run lint

# 格式化代码
npm run format
```

## 📄 许可证

[MIT](LICENSE)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request!

## 📮 联系方式

如有问题或建议,请提交 [Issue](https://github.com/CrazyMrYan/qrcode-gen/issues)。
