/**
 * Canvas 渲染器
 * 将二维码矩阵渲染为 Canvas 元素
 */

import { Renderer, calculateModuleSize } from '../core/renderer.js';
import { EncodingError } from '../utils/errors.js';
import { ERROR_CODES } from '../utils/constants.js';

/**
 * Canvas 渲染器类
 */
export class CanvasRenderer extends Renderer {
  /**
   * 渲染二维码矩阵到 Canvas
   * @param {Object} matrix - 二维码矩阵数据
   * @param {Object} config - 渲染配置
   * @param {number} config.size - Canvas尺寸
   * @param {string} config.foregroundColor - 前景色
   * @param {string} config.backgroundColor - 背景色
   * @param {number} config.margin - 边距
   * @returns {HTMLCanvasElement} Canvas 元素
   */
  render(matrix, config) {
    try {
      const {
        size,
        foregroundColor = '#000000',
        backgroundColor = '#FFFFFF',
        margin = 4,
      } = config;

      // 创建 Canvas 元素
      const canvas = this.createCanvas(size, size);
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('无法获取 Canvas 2D 上下文');
      }

      // 计算模块尺寸
      const { moduleSize, offset } = calculateModuleSize(size, matrix.size, margin);

      // 绘制背景
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, size, size);

      // 绘制二维码模块
      ctx.fillStyle = foregroundColor;
      const modules = matrix.modules;

      for (let row = 0; row < matrix.size; row++) {
        for (let col = 0; col < matrix.size; col++) {
          const index = row * matrix.size + col;
          // 如果该位置是黑色模块(1),则绘制
          if (modules.data[index]) {
            const x = offset + col * moduleSize;
            const y = offset + row * moduleSize;
            ctx.fillRect(x, y, moduleSize, moduleSize);
          }
        }
      }

      return canvas;
    } catch (error) {
      throw new EncodingError(
        `Canvas渲染失败: ${error.message}`,
        ERROR_CODES.ERR_RENDERING_FAILED,
        error
      );
    }
  }

  /**
   * 创建 Canvas 元素
   * @param {number} width - 宽度
   * @param {number} height - 高度
   * @returns {HTMLCanvasElement} Canvas 元素
   */
  createCanvas(width, height) {
    // 浏览器环境
    if (typeof document !== 'undefined') {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      return canvas;
    }

    // Node.js 环境(测试用)
    throw new Error('Canvas渲染器仅支持浏览器环境');
  }

  /**
   * 获取渲染器支持的输出格式
   * @returns {string} 输出格式名称
   */
  getFormat() {
    return 'canvas';
  }
}
