/**
 * Base64 渲染器
 * 将 Canvas 转换为 Base64 Data URI
 */

import { Renderer } from '../core/renderer.js';
import { CanvasRenderer } from './canvas.js';
import { EncodingError } from '../utils/errors.js';
import { ERROR_CODES } from '../utils/constants.js';

/**
 * Base64 渲染器类
 */
export class Base64Renderer extends Renderer {
  constructor() {
    super();
    this.canvasRenderer = new CanvasRenderer();
  }

  /**
   * 渲染二维码矩阵到 Base64 Data URI
   * @param {Object} matrix - 二维码矩阵数据
   * @param {Object} config - 渲染配置
   * @returns {string} Base64 Data URI 字符串
   */
  render(matrix, config) {
    try {
      // 先使用 Canvas 渲染器生成 Canvas
      const canvas = this.canvasRenderer.render(matrix, config);

      // 将 Canvas 转换为 Base64 Data URI
      const dataUrl = canvas.toDataURL('image/png');

      return dataUrl;
    } catch (error) {
      throw new EncodingError(
        `Base64渲染失败: ${error.message}`,
        ERROR_CODES.ERR_RENDERING_FAILED,
        error
      );
    }
  }

  /**
   * 获取渲染器支持的输出格式
   * @returns {string} 输出格式名称
   */
  getFormat() {
    return 'base64';
  }
}
