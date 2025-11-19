/**
 * 二维码生成工具库主入口
 * 导出公共 API
 */

import { parseConfig } from './utils/config-parser.js';
import {
  validateContent,
  validateSize,
  validateErrorCorrectionLevel,
  validateOutputFormat,
} from './utils/validators.js';
import { checkColorContrast } from './processors/color-validator.js';
import { encode } from './core/encoder.js';
import { embedLogo } from './processors/logo-embedder.js';
import { CanvasRenderer } from './renderers/canvas.js';
import { SvgRenderer } from './renderers/svg.js';
import { Base64Renderer } from './renderers/base64.js';
import { DEFAULT_CONFIG } from './utils/constants.js';

// 导出默认配置供外部使用
export { DEFAULT_CONFIG };

/**
 * 生成二维码的主函数
 * @param {Object} userConfig - 用户配置
 * @param {string} userConfig.content - 要编码的文本内容(必填)
 * @param {number} [userConfig.size=256] - 二维码尺寸(像素)
 * @param {string} [userConfig.errorCorrectionLevel='M'] - 错误纠正级别
 * @param {string} [userConfig.foregroundColor='#000000'] - 前景色
 * @param {string} [userConfig.backgroundColor='#FFFFFF'] - 背景色
 * @param {Object|null} [userConfig.logo=null] - Logo配置
 * @param {string} [userConfig.outputFormat='canvas'] - 输出格式
 * @param {number} [userConfig.margin=4] - 边距
 * @returns {Promise<HTMLCanvasElement|string>} 生成的二维码
 * @throws {Error} 当配置无效或生成失败时抛出
 */
export async function generateQRCode(userConfig) {
  const warnings = [];

  try {
    // 1. 解析和合并配置
    const config = parseConfig(userConfig);

    // 2. 验证配置
    // 验证内容
    const contentValidation = validateContent(config.content);
    warnings.push(...contentValidation.warnings);

    // 验证尺寸
    const sizeValidation = validateSize(config.size);
    config.size = sizeValidation.adjustedSize;
    warnings.push(...sizeValidation.warnings);

    // 验证错误纠正级别
    const errorCorrectionValidation = validateErrorCorrectionLevel(config.errorCorrectionLevel);
    warnings.push(...errorCorrectionValidation.warnings);

    // 验证输出格式
    const outputFormatValidation = validateOutputFormat(config.outputFormat);
    warnings.push(...outputFormatValidation.warnings);

    // 验证颜色对比度
    const contrastCheck = checkColorContrast(config.foregroundColor, config.backgroundColor);
    warnings.push(...contrastCheck.warnings);

    // 3. 输出警告信息
    if (warnings.length > 0) {
      warnings.forEach(warning => {
        console.warn(`[QRCode警告] ${warning.message}`, warning.details);
      });
    }

    // 4. 编码二维码
    const matrix = await encode(config.content, {
      errorCorrectionLevel: config.errorCorrectionLevel,
      margin: config.margin,
    });

    // 5. 渲染二维码
    let output;
    let renderer;

    switch (config.outputFormat) {
      case 'canvas':
        renderer = new CanvasRenderer();
        break;
      case 'svg':
        renderer = new SvgRenderer();
        break;
      case 'base64':
        renderer = new Base64Renderer();
        break;
      default:
        throw new Error(`不支持的输出格式: ${config.outputFormat}`);
    }

    output = renderer.render(matrix, config);

    // 6. 如果有 Logo 配置且输出格式支持,嵌入 Logo
    if (config.logo && (config.outputFormat === 'canvas' || config.outputFormat === 'base64')) {
      // 对于 base64 格式,需要先获取 canvas
      let canvas = output;
      if (config.outputFormat === 'base64') {
        // 重新生成 canvas
        const canvasRenderer = new CanvasRenderer();
        canvas = canvasRenderer.render(matrix, config);
      }

      const logoResult = await embedLogo(canvas, config.logo);
      warnings.push(...logoResult.warnings);

      // 如果是 base64 格式,转换回 base64
      if (config.outputFormat === 'base64') {
        output = logoResult.canvas.toDataURL('image/png');
      } else {
        output = logoResult.canvas;
      }
    }

    return output;
  } catch (error) {
    // 记录错误
    console.error('[QRCode错误]', error);
    throw error;
  }
}
