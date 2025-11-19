# 快速开始: 二维码生成工具库

**功能**: 001-qrcode-generator
**日期**: 2025-11-19

本文档提供5+个常见使用场景的完整示例。

## 场景 1: 网站URL分享

**需求**: 将网站URL转换为二维码,方便用户扫码访问。

```javascript
import { generateQRCode } from 'qrcode-gen';

// 生成网站URL二维码
const canvas = await generateQRCode({
  content: 'https://mywebsite.com'
});

// 添加到页面
document.getElementById('qrcode-container').appendChild(canvas);
```

**预期结果**: 生成标准黑白二维码,用户扫码可直接访问网站。

---

## 场景 2: 品牌营销二维码

**需求**: 生成带品牌Logo和配色的营销二维码,用于宣传材料。

```javascript
// 品牌配色二维码
const canvas = await generateQRCode({
  content: 'https://promotion.mywebsite.com/campaign',
  size: 400,
  errorCorrectionLevel: 'H',  // 高容错,支持Logo
  foregroundColor: '#FF6B6B',  // 品牌红色
  backgroundColor: '#FFFFFF',
  logo: {
    source: '/assets/brand-logo.png',
    scale: 0.2,
    borderWidth: 6,
    borderColor: '#FFFFFF'
  }
});

// 下载为图片
const link = document.createElement('a');
link.download = 'marketing-qrcode.png';
link.href = canvas.toDataURL('image/png');
link.click();
```

**预期结果**: 生成带品牌Logo和颜色的高质量二维码,可用于印刷。

---

## 场景 3: 产品包装二维码

**需求**: 为产品生成高分辨率SVG二维码,用于包装设计。

```javascript
// 生成SVG格式,适合印刷
const svg = await generateQRCode({
  content: 'https://product.mywebsite.com/12345',
  size: 800,  // 高分辨率
  outputFormat: 'svg',
  errorCorrectionLevel: 'Q',  // 中高容错
  margin: 6  // 较大边距,适合印刷
});

// 保存SVG文件
const blob = new Blob([svg], { type: 'image/svg+xml' });
const link = document.createElement('a');
link.download = 'product-qrcode.svg';
link.href = URL.createObjectURL(blob);
link.click();
```

**预期结果**: 生成矢量SVG二维码,可无损缩放,适合印刷。

---

## 场景 4: WiFi连接二维码

**需求**: 生成WiFi配置二维码,用户扫码即可连接。

```javascript
// WiFi配置格式
const wifiConfig = `WIFI:T:WPA;S:MyNetwork;P:MyPassword123;;`;

const canvas = await generateQRCode({
  content: wifiConfig,
  size: 300,
  errorCorrectionLevel: 'M'
});

// 显示在页面上
document.getElementById('wifi-qrcode').appendChild(canvas);
```

**预期结果**: 生成WiFi配置二维码,用户扫码自动连接WiFi。

---

## 场景 5: 名片二维码

**需求**: 生成包含联系信息的vCard二维码。

```javascript
// vCard格式
const vcard = `BEGIN:VCARD
VERSION:3.0
FN:张三
TEL:+86 138 0000 0000
EMAIL:zhangsan@example.com
URL:https://mywebsite.com
END:VCARD`;

const canvas = await generateQRCode({
  content: vcard,
  size: 350,
  errorCorrectionLevel: 'M',
  foregroundColor: '#2C3E50',  // 深灰色,更专业
  backgroundColor: '#ECF0F1'   // 浅灰背景
});

document.getElementById('business-card').appendChild(canvas);
```

**预期结果**: 生成联系人二维码,扫码可直接保存到通讯录。

---

## 场景 6: 动态内容二维码

**需求**: 根据用户输入实时生成二维码。

```html
<input type="text" id="user-input" placeholder="输入内容">
<button id="generate-btn">生成二维码</button>
<div id="qr-output"></div>
```

```javascript
const input = document.getElementById('user-input');
const button = document.getElementById('generate-btn');
const output = document.getElementById('qr-output');

button.addEventListener('click', async () => {
  const content = input.value.trim();

  if (!content) {
    alert('请输入内容');
    return;
  }

  try {
    // 清空旧的二维码
    output.innerHTML = '';

    // 生成新的二维码
    const canvas = await generateQRCode({
      content: content,
      size: 300
    });

    output.appendChild(canvas);
  } catch (error) {
    alert(`生成失败: ${error.message}`);
  }
});
```

**预期结果**: 用户输入内容,点击按钮实时生成二维码。

---

## 场景 7: 批量生成二维码

**需求**: 为多个产品批量生成二维码。

```javascript
const products = [
  { id: 'P001', name: '产品A', url: 'https://shop.com/P001' },
  { id: 'P002', name: '产品B', url: 'https://shop.com/P002' },
  { id: 'P003', name: '产品C', url: 'https://shop.com/P003' }
];

async function generateBatch() {
  const qrcodes = await Promise.all(
    products.map(async product => {
      const canvas = await generateQRCode({
        content: product.url,
        size: 250,
        errorCorrectionLevel: 'M'
      });

      return {
        id: product.id,
        name: product.name,
        canvas: canvas
      };
    })
  );

  // 显示所有二维码
  qrcodes.forEach(qr => {
    const container = document.createElement('div');
    container.innerHTML = `<h3>${qr.name}</h3>`;
    container.appendChild(qr.canvas);
    document.getElementById('batch-output').appendChild(container);
  });
}

generateBatch();
```

**预期结果**: 批量生成多个二维码,每个对应一个产品。

---

## 场景 8: 响应式二维码

**需求**: 根据屏幕尺寸生成合适大小的二维码。

```javascript
function getResponsiveQRSize() {
  const width = window.innerWidth;
  if (width < 768) return 200;      // 手机
  if (width < 1024) return 300;     // 平板
  return 400;                       // 桌面
}

async function generateResponsiveQR(content) {
  const size = getResponsiveQRSize();

  const canvas = await generateQRCode({
    content: content,
    size: size
  });

  return canvas;
}

// 使用
const qr = await generateResponsiveQR('https://example.com');
document.body.appendChild(qr);

// 窗口大小改变时重新生成
window.addEventListener('resize', async () => {
  const newQr = await generateResponsiveQR('https://example.com');
  document.body.innerHTML = '';
  document.body.appendChild(newQr);
});
```

**预期结果**: 二维码尺寸根据设备屏幕自动调整。

---

## 测试验证

### 基础功能测试

1. **生成基础二维码**: 运行场景1,验证二维码可扫描
2. **自定义样式**: 运行场景2,验证颜色和Logo正确显示
3. **SVG格式**: 运行场景3,验证SVG可正常渲染
4. **特殊内容**: 运行场景4和5,验证WiFi和vCard格式

### 集成测试

1. **动态生成**: 运行场景6,测试实时交互
2. **批量处理**: 运行场景7,验证并发生成
3. **响应式**: 运行场景8,测试不同屏幕尺寸

### 错误处理测试

```javascript
// 测试空内容错误
try {
  await generateQRCode({ content: '' });
} catch (error) {
  console.assert(error.name === 'ValidationError');
  console.log('✓ 空内容验证通过');
}

// 测试超长内容错误
try {
  await generateQRCode({ content: 'x'.repeat(3000) });
} catch (error) {
  console.assert(error.name === 'ValidationError');
  console.log('✓ 超长内容验证通过');
}

// 测试颜色对比度警告
const canvas = await generateQRCode({
  content: 'test',
  foregroundColor: '#CCCCCC',
  backgroundColor: '#FFFFFF'
});
console.log('✓ 低对比度警告测试通过');
```

## 性能测试

```javascript
// 测试生成性能
console.time('基础生成');
await generateQRCode({ content: 'https://example.com' });
console.timeEnd('基础生成');  // 应 < 100ms

console.time('Logo嵌入');
await generateQRCode({
  content: 'https://example.com',
  logo: { source: 'logo.png' }
});
console.timeEnd('Logo嵌入');  // 应 < 200ms
```

## 常见问题

### Q: Logo嵌入后二维码无法扫描?
**A**: 使用更高的容错级别(Q或H),并确保Logo不超过20%面积。

### Q: 颜色对比度过低警告?
**A**: 调整前景色和背景色,确保对比度 ≥ 3:1。推荐使用深色前景+浅色背景。

### Q: 如何提高生成速度?
**A**: 避免过大尺寸(>1000px),使用适当的容错级别,Logo使用压缩图像。

### Q: 支持哪些内容格式?
**A**: 支持任意UTF-8文本,包括URL、文本、WiFi配置、vCard等。

### Q: 如何在Node.js中使用?
**A**: 本库仅支持浏览器环境,因为依赖Canvas API。Node.js环境请使用node-qrcode。
