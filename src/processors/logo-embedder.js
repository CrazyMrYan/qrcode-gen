/**
 * Logo 嵌入处理器
 * 使用 Canvas API 将 Logo 绘制到二维码中心
 */

import { loadLogo } from './logo-loader.js';
import { calculateLogoSize, calculateLogoPosition } from './logo-scaler.js';
import { parseLogoConfig } from '../utils/config-parser.js';

/**
 * 将 Logo 嵌入到二维码 Canvas 中
 * @param {HTMLCanvasElement} qrCanvas - 二维码 Canvas
 * @param {Object} logoConfig - Logo 配置
 * @param {string|File|Blob} logoConfig.source - Logo 源
 * @param {number} logoConfig.scale - Logo 缩放比例
 * @param {number} logoConfig.borderWidth - Logo 边框宽度
 * @param {string} logoConfig.borderColor - Logo 边框颜色
 * @returns {Promise<{canvas: HTMLCanvasElement, warnings: Array}>} 嵌入 Logo 后的 Canvas 和警告信息
 */
export async function embedLogo(qrCanvas, logoConfig) {
  const warnings = [];

  // 解析 Logo 配置
  const config = parseLogoConfig(logoConfig);

  if (!config) {
    return { canvas: qrCanvas, warnings };
  }

  try {
    // 1. 加载 Logo 图像
    const logoImage = await loadLogo(config.source);

    // 2. 计算 Logo 尺寸
    const sizeResult = calculateLogoSize(logoImage, qrCanvas.width, config.scale);
    warnings.push(...sizeResult.warnings);

    // 3. 计算 Logo 位置(居中)
    const position = calculateLogoPosition(qrCanvas.width, sizeResult.width, sizeResult.height);

    // 4. 获取 Canvas 上下文
    const ctx = qrCanvas.getContext('2d');

    if (!ctx) {
      throw new Error('无法获取 Canvas 2D 上下文');
    }

    // 5. 绘制 Logo 边框(如果设置)
    if (config.borderWidth > 0) {
      const borderPadding = config.borderWidth;
      ctx.fillStyle = config.borderColor;
      ctx.fillRect(
        position.x - borderPadding,
        position.y - borderPadding,
        sizeResult.width + borderPadding * 2,
        sizeResult.height + borderPadding * 2
      );
    }

    // 6. 绘制 Logo 图像
    ctx.drawImage(
      logoImage,
      position.x,
      position.y,
      sizeResult.width,
      sizeResult.height
    );

    return { canvas: qrCanvas, warnings };
  } catch (error) {
    // Logo 加载或嵌入失败,返回原始二维码
    console.warn(`[QRCode警告] Logo嵌入失败: ${error.message}`, error);
    warnings.push({
      type: 'LOGO_EMBED_FAILED',
      message: `Logo嵌入失败: ${error.message}`,
      details: { error: error.message },
    });
    return { canvas: qrCanvas, warnings };
  }
}
