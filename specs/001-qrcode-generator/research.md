# 研究报告: 二维码生成工具库

**日期**: 2025-11-19
**功能**: 001-qrcode-generator
**状态**: Phase 0 完成

## 研究概述

本文档记录了二维码生成工具库实现过程中的技术调研决策,解决了技术上下文中标记的 NEEDS CLARIFICATION 项。

---

## 决策 1: JavaScript 二维码编码库选择

### 选择: node-qrcode (npm包名: qrcode)

#### 理由

1. **最活跃的维护和社区支持**: 8000+ GitHub stars,每周下载量超过400万次,2024年仍在持续更新
2. **完善的浏览器支持**: 支持IE10+、Safari 5.1+及所有现代浏览器,提供预编译的浏览器bundle
3. **优秀的TypeScript支持**: 通过@types/qrcode提供完整的TypeScript类型定义
4. **合理的体积大小**: 虽然不是最小的,但通过排除可选的kanji转换表等优化手段保持了合理的体积
5. **功能完善**: 支持多种输出格式(Canvas、SVG、Data URL、终端等),支持所有错误纠正级别和UTF-8编码

#### 对比分析

| 库名称 | 体积 | 性能 | 浏览器支持 | 维护状态 | 推荐度 |
|--------|------|------|-----------|---------|--------|
| **node-qrcode** | ~40KB (估算,含依赖) | 优秀 | IE10+/Safari 5.1+/所有现代浏览器 | 非常活跃 (2024更新) | ⭐⭐⭐⭐⭐ |
| qrcode-generator | 17KB (估算minified) | 良好 | 全浏览器支持 | 活跃 (2025年8月更新) | ⭐⭐⭐⭐ |
| qr-creator | 4.75KB gzipped | 良好 | 现代浏览器 | 不活跃 (5年未更新) | ⭐⭐⭐ |
| qrcodejs | ~5-10KB | 良好 | IE6+/所有浏览器 | 不活跃 (大量未解决issue) | ⭐⭐ |

#### 考虑的替代方案

- **方案A: qrcode-generator (kazuhikoarase)** - 被拒绝原因:
  - 虽然也在维护,但社区规模较小(2.3k stars vs 8k stars)
  - 每周下载量仅50万次(vs 400万次),表明生态系统支持较弱
  - 包体积556KB(未压缩)相对较大,没有明确的体积优化策略
  - TypeScript支持较弱(虽有定义但为stub types)

- **方案B: qr-creator (Nimiq)** - 被拒绝原因:
  - 已5年未更新,维护状态为"Inactive"
  - 虽然体积最小(4.75KB gzipped),但缺乏长期支持保障
  - 功能相对简单,专注于样式化QR码,不适合通用场景

- **方案C: qrcodejs (davidshimjs)** - 被拒绝原因:
  - 维护严重滞后,有172个未解决的issues和61个pending PR
  - 虽然支持老旧浏览器(IE6+),但对现代Web开发意义不大
  - 缺乏TypeScript支持和现代化的API设计

#### 实施建议

##### 安装方式
```bash
npm install qrcode
npm install --save-dev @types/qrcode  # TypeScript项目
```

##### 浏览器集成

**方式1: 通过打包工具(推荐)**
```javascript
import QRCode from 'qrcode'

// 生成Data URL
QRCode.toDataURL('https://example.com')
  .then(url => {
    console.log(url)
  })
  .catch(err => {
    console.error(err)
  })

// 渲染到Canvas
const canvas = document.getElementById('canvas')
QRCode.toCanvas(canvas, 'sample text', function (error) {
  if (error) console.error(error)
  console.log('success!')
})
```

**方式2: 使用预编译bundle**
```html
<script src="node_modules/qrcode/build/qrcode.min.js"></script>
<script>
  QRCode.toCanvas(document.getElementById('canvas'), 'sample text')
</script>
```

##### 额外配置建议

1. **优化bundle体积**:
   - 库已默认不包含kanji转换表,无需额外配置
   - 如需要日文支持,可手动引入

2. **TypeScript配置**:
   - 确保安装@types/qrcode以获得完整的类型支持
   - 所有API都有完整的类型定义

3. **错误纠正级别建议**:
   - L级(低): 约7%的错误可被纠正 - 适合干净环境
   - M级(中): 约15%的错误可被纠正 - 默认推荐
   - Q级(中高): 约25%的错误可被纠正 - 需要更高可靠性
   - H级(高): 约30%的错误可被纠正 - 二维码可能被部分遮挡

4. **浏览器兼容性**:
   - 预编译bundle支持IE10+, Safari 5.1+
   - 如需更老版本浏览器支持,可考虑polyfill
   - 移动端浏览器(Mobile Safari, Android)完全支持

##### 性能优化建议

```javascript
// 使用合适的编码模式优化QR码大小
QRCode.toDataURL('HTTPS://EXAMPLE.COM', {
  errorCorrectionLevel: 'M',
  type: 'image/jpeg',
  quality: 0.3,
  margin: 1,
  width: 200
})
```

#### 技术规格总结

- **License**: MIT
- **GitHub仓库**: https://github.com/soldair/node-qrcode
- **npm包名**: qrcode
- **最新版本**: 1.5.4
- **每周下载量**: 4,200,000+
- **GitHub Stars**: 8,000+
- **支持的输出格式**: PNG, JPEG, SVG, Canvas, Data URL, Terminal
- **UTF-8支持**: ✅ 完整支持
- **TypeScript**: ✅ 通过@types/qrcode
- **浏览器支持**: ✅ IE10+, Safari 5.1+, 所有现代浏览器
- **Node.js支持**: ✅ 完整支持

---

## 决策 2: 二维码编码算法实现策略

### 选择: 包装node-qrcode而非从零实现

#### 理由

1. **避免重复造轮子**: 二维码编码涉及复杂的Reed-Solomon纠错码算法,已有成熟实现
2. **专注核心价值**: 我们的工具库核心价值在于易用的API、Logo嵌入、多格式输出等特性
3. **质量保证**: node-qrcode经过多年生产环境验证,已处理各种边界情况
4. **维护成本**: 使用成熟库可获得持续的bug修复和安全更新

#### 实施策略

- 将node-qrcode作为底层依赖,负责文本到二进制矩阵的编码
- 我们的库提供上层封装:
  - 更友好的配置API
  - Logo嵌入处理
  - 颜色定制和验证
  - 统一的多格式输出接口

#### 考虑的替代方案

- **方案A: 完全自行实现** - 被拒绝原因:
  - 开发周期长(至少2-3周实现基础功能)
  - 需要深入理解QR Code规范和Reed-Solomon算法
  - 初期bug多,需要大量测试和修复
  - 维护成本高,需要持续跟进规范变化

- **方案B: 使用多个库组合** - 被拒绝原因:
  - 增加依赖复杂度
  - 可能存在兼容性问题
  - bundle体积会增大

---

## 决策 3: Logo处理策略

### 选择: Canvas 2D API进行图像合成

#### 理由

1. **浏览器原生支持**: 无需额外图像处理库
2. **高性能**: 硬件加速的图像操作
3. **灵活性**: 支持File/Blob/URL多种输入源
4. **精确控制**: 可精确计算Logo尺寸和位置

#### 实施方案

```javascript
// 伪代码
async function embedLogo(qrCanvas, logoSource, options) {
  // 1. 加载Logo图像
  const logoImage = await loadImage(logoSource)

  // 2. 计算Logo尺寸(最大20%面积)
  const maxSize = Math.sqrt(qrCanvas.width * qrCanvas.height * 0.2)
  const { width, height } = scaleToFit(logoImage, maxSize)

  // 3. 在二维码中心绘制Logo
  const ctx = qrCanvas.getContext('2d')
  const x = (qrCanvas.width - width) / 2
  const y = (qrCanvas.height - height) / 2
  ctx.drawImage(logoImage, x, y, width, height)

  return qrCanvas
}
```

#### 考虑的替代方案

- **方案A: 使用图像处理库(如pica)** - 被拒绝原因:
  - 增加bundle体积
  - Canvas API已足够满足需求
  - 额外的学习和维护成本

- **方案B: SVG操作** - 被拒绝原因:
  - 只适用于SVG格式输出
  - Canvas输出仍需要Canvas API
  - 不统一的实现增加复杂度

---

## 决策 4: 颜色对比度检测算法

### 选择: WCAG 2.1 相对亮度算法

#### 理由

1. **标准化**: W3C官方标准,广泛采用
2. **准确性**: 考虑了人眼对不同颜色的感知差异
3. **可验证**: 可通过在线工具验证计算结果

#### 实施公式

```javascript
// WCAG 2.1 相对亮度计算
function relativeLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

// 对比度计算
function contrastRatio(lum1, lum2) {
  const lighter = Math.max(lum1, lum2)
  const darker = Math.min(lum1, lum2)
  return (lighter + 0.05) / (darker + 0.05)
}

// 阈值: 对比度 < 3:1 发出警告
const MIN_CONTRAST_RATIO = 3
```

#### 考虑的替代方案

- **方案A: 简单亮度差值** - 被拒绝原因:
  - 不符合标准
  - 对某些颜色组合判断不准确
  - 不考虑人眼感知特性

---

## 研究总结

所有技术上下文中的 NEEDS CLARIFICATION 项已解决:

1. ✅ **主要依赖**: node-qrcode (MIT许可,8k+ stars,400万周下载)
2. ✅ **编码策略**: 包装成熟库而非从零实现
3. ✅ **Logo处理**: Canvas 2D API
4. ✅ **对比度检测**: WCAG 2.1标准算法

下一步可以进入 Phase 1 设计阶段,生成数据模型和API契约。
