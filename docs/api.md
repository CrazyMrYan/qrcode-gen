# API 文档

完整的 API 参考文档。

## 目录

- [主要 API](#主要-api)
- [类型定义](#类型定义)
- [错误处理](#错误处理)
- [高级用法](#高级用法)

## 主要 API

### `generateQRCode(config: QRCodeConfig): Promise<QRCodeOutput>`

生成二维码的主函数。

#### 参数详解

##### `content` (必填)

- **类型**: `string`
- **说明**: 要编码的文本内容
- **限制**:
  - 非空字符串
  - 最大长度: 2953 字符 (QR Code Version 40, L级)
- **示例**:
  ```javascript
  content: 'https://example.com'
  content: 'Hello World'
  content: '中文内容支持'
  ```

##### `size`

- **类型**: `number`
- **默认值**: `256`
- **说明**: 二维码尺寸(像素)
- **限制**:
  - 最小值: 100px (小于此值会自动调整并警告)
  - 建议值: 200-500px
- **示例**:
  ```javascript
  size: 300  // 生成 300x300 像素的二维码
  ```

##### `errorCorrectionLevel`

- **类型**: `'L' | 'M' | 'Q' | 'H'`
- **默认值**: `'M'`
- **说明**: 容错级别
- **详细说明**:
  - `L`: Low (约7%容错) - 适合干净环境
  - `M`: Medium (约15%容错) - 默认推荐
  - `Q`: Quartile (约25%容错) - 需要更高可靠性
  - `H`: High (约30%容错) - 嵌入Logo或可能损坏
- **示例**:
  ```javascript
  errorCorrectionLevel: 'H'  // 高容错,适合嵌入Logo
  ```

##### `foregroundColor`

- **类型**: `string`
- **默认值**: `'#000000'`
- **说明**: 前景色(二维码图案颜色)
- **支持格式**:
  - HEX: `#FF0000`, `#F00`
  - RGB: `rgb(255, 0, 0)`
  - 颜色名称: `red`, `blue`, `green`, 等
- **示例**:
  ```javascript
  foregroundColor: '#0066CC'
  foregroundColor: 'rgb(0, 102, 204)'
  foregroundColor: 'blue'
  ```

##### `backgroundColor`

- **类型**: `string`
- **默认值**: `'#FFFFFF'`
- **说明**: 背景色
- **支持格式**: 同 `foregroundColor`
- **注意**:
  - 与前景色对比度应 ≥ 3:1
  - 对比度过低会发出警告但仍可生成

##### `logo`

- **类型**: `LogoConfig | null`
- **默认值**: `null`
- **说明**: Logo配置对象
- **子属性**:

  ###### `logo.source` (必填)
  - **类型**: `string | File | Blob`
  - **说明**: Logo图像源
  - **支持**:
    - URL字符串: `'https://example.com/logo.png'`
    - Data URI: `'data:image/png;base64,...'`
    - File对象: 来自 `<input type="file">`
    - Blob对象: 任意图像Blob
  - **超时**: URL加载超时5秒

  ###### `logo.scale`
  - **类型**: `number`
  - **默认值**: `0.2`
  - **说明**: Logo相对二维码面积的占比
  - **限制**: 0 < scale ≤ 0.2
  - **示例**: `0.15` = Logo占15%面积

  ###### `logo.borderWidth`
  - **类型**: `number`
  - **默认值**: `0`
  - **说明**: Logo周围白边宽度(像素)
  - **用途**: 提升可扫描性

  ###### `logo.borderColor`
  - **类型**: `string`
  - **默认值**: `'#FFFFFF'`
  - **说明**: Logo边框颜色

- **示例**:
  ```javascript
  logo: {
    source: 'logo.png',
    scale: 0.2,
    borderWidth: 4,
    borderColor: '#FFFFFF'
  }
  ```

##### `outputFormat`

- **类型**: `'canvas' | 'svg' | 'base64'`
- **默认值**: `'canvas'`
- **说明**: 输出格式
- **详细说明**:
  - `canvas`: 返回 `HTMLCanvasElement`,可直接插入DOM或进一步处理
  - `svg`: 返回 SVG XML 字符串,矢量格式,适合印刷
  - `base64`: 返回 Base64 Data URI,可嵌入 HTML/CSS
- **示例**:
  ```javascript
  outputFormat: 'svg'  // 生成矢量图形
  ```

##### `margin`

- **类型**: `number`
- **默认值**: `4`
- **说明**: 二维码外边距(模块单位)
- **建议值**: 2-10
- **示例**:
  ```javascript
  margin: 2  // 较小边距
  ```

## 类型定义

### `QRCodeConfig`

完整的配置接口:

```typescript
interface QRCodeConfig {
  content: string;                              // 必填
  size?: number;                                // 默认: 256
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H'; // 默认: 'M'
  foregroundColor?: string;                     // 默认: '#000000'
  backgroundColor?: string;                     // 默认: '#FFFFFF'
  logo?: LogoConfig | null;                     // 默认: null
  outputFormat?: 'canvas' | 'svg' | 'base64';   // 默认: 'canvas'
  margin?: number;                              // 默认: 4
}
```

### `LogoConfig`

Logo配置接口:

```typescript
interface LogoConfig {
  source: string | File | Blob;  // 必填
  scale?: number;                // 默认: 0.2
  borderWidth?: number;          // 默认: 0
  borderColor?: string;          // 默认: '#FFFFFF'
}
```

### `QRCodeOutput`

输出类型:

```typescript
type QRCodeOutput = HTMLCanvasElement | string;
```

## 错误处理

### 错误类型

所有错误继承自 `GenerationError`:

#### `ValidationError`

配置验证失败时抛出。

**常见情况**:
- 内容为空
- 内容超长(>2953字符)
- 无效的颜色格式
- 无效的容错级别
- 无效的输出格式

**示例**:
```javascript
try {
  await generateQRCode({ content: '' });
} catch (error) {
  if (error.name === 'ValidationError') {
    console.log(error.code);  // 'ERR_CONTENT_EMPTY'
  }
}
```

#### `TimeoutError`

Logo URL加载超时(5秒)。

**示例**:
```javascript
try {
  await generateQRCode({
    content: 'test',
    logo: { source: 'https://slow-server.com/logo.png' }
  });
} catch (error) {
  if (error.name === 'TimeoutError') {
    console.log('Logo加载超时,请使用本地文件');
  }
}
```

#### `LoadError`

Logo加载失败(404、网络错误等)。

#### `EncodingError`

二维码编码或渲染失败。

### 警告处理

某些非致命问题会生成警告,但不会中断生成:

```javascript
// 警告会输出到 console.warn
const canvas = await generateQRCode({
  size: 50,  // 小于最小值100
  foregroundColor: '#CCCCCC',
  backgroundColor: '#FFFFFF'  // 对比度低
});

// 警告示例:
// [QRCode警告] 尺寸 50px 小于最小值,已自动调整到 100px
// [QRCode警告] 前景色和背景色对比度过低(2.1:1),可能影响扫描成功率
```

## 高级用法

### 使用默认配置

```javascript
import { DEFAULT_CONFIG } from '@yjh1102/qrcode-gen';

console.log(DEFAULT_CONFIG);
// {
//   size: 256,
//   errorCorrectionLevel: 'M',
//   foregroundColor: '#000000',
//   backgroundColor: '#FFFFFF',
//   logo: null,
//   outputFormat: 'canvas',
//   margin: 4
// }
```

### 下载二维码

```javascript
// Canvas 转下载
const canvas = await generateQRCode({ content: 'https://example.com' });
const link = document.createElement('a');
link.download = 'qrcode.png';
link.href = canvas.toDataURL();
link.click();

// Base64 转下载
const base64 = await generateQRCode({
  content: 'https://example.com',
  outputFormat: 'base64'
});
const link = document.createElement('a');
link.download = 'qrcode.png';
link.href = base64;
link.click();
```

### 打印二维码

```javascript
// 使用 SVG 格式获得最佳打印质量
const svg = await generateQRCode({
  content: 'https://example.com',
  size: 800,  // 高分辨率
  outputFormat: 'svg',
  errorCorrectionLevel: 'H'
});

const printWindow = window.open('', '_blank');
printWindow.document.write(svg);
printWindow.print();
```

### 批量生成

```javascript
const urls = [
  'https://example.com/page1',
  'https://example.com/page2',
  'https://example.com/page3'
];

const qrcodes = await Promise.all(
  urls.map(url => generateQRCode({ content: url }))
);

qrcodes.forEach(canvas => document.body.appendChild(canvas));
```

### 响应式尺寸

```javascript
function getResponsiveSize() {
  const width = window.innerWidth;
  if (width < 768) return 200;
  if (width < 1024) return 300;
  return 400;
}

const canvas = await generateQRCode({
  content: 'https://example.com',
  size: getResponsiveSize()
});
```

## 性能优化

### 建议

1. **缓存结果**: 相同内容不要重复生成
2. **适当尺寸**: 避免过大尺寸(>1000px)
3. **避免频繁生成**: 使用防抖处理用户输入
4. **Logo优化**: 使用压缩后的Logo图像

### 性能指标

- 标准二维码生成: < 100ms
- Logo嵌入: < 200ms
- 库体积: < 50KB (gzip)

## 浏览器兼容性

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**注意**: 需要支持 Canvas API 和 ES6+。
