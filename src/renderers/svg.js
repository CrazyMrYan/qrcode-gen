/**
 * SVG 渲染器
 * 将二维码矩阵渲染为 SVG 字符串
 */

import { Renderer, calculateModuleSize } from '../core/renderer.js';
import { EncodingError } from '../utils/errors.js';
import { ERROR_CODES } from '../utils/constants.js';

/**
 * SVG 渲染器类
 */
export class SvgRenderer extends Renderer {
  /**
   * 渲染二维码矩阵到 SVG
   * @param {Object} matrix - 二维码矩阵数据
   * @param {Object} config - 渲染配置
   * @param {number} config.size - SVG尺寸
   * @param {string} config.foregroundColor - 前景色
   * @param {string} config.backgroundColor - 背景色
   * @param {number} config.margin - 边距
   * @returns {string} SVG XML 字符串
   */
  render(matrix, config) {
    try {
      const {
        size,
        foregroundColor = '#000000',
        backgroundColor = '#FFFFFF',
        margin = 4,
      } = config;

      // 计算模块尺寸
      const { moduleSize, offset } = calculateModuleSize(size, matrix.size, margin);

      // 构建SVG字符串
      const svgParts = [];

      // SVG 头部
      svgParts.push(
        `<svg xmlns="http://www.w3.org/2000/svg" `,
        `width="${size}" height="${size}" `,
        `viewBox="0 0 ${size} ${size}">`
      );

      // 背景矩形
      svgParts.push(
        `<rect width="${size}" height="${size}" `,
        `fill="${backgroundColor}"/>`
      );

      // 绘制二维码模块
      const modules = matrix.modules;
      const rects = [];

      for (let row = 0; row < matrix.size; row++) {
        for (let col = 0; col < matrix.size; col++) {
          const index = row * matrix.size + col;
          // 如果该位置是黑色模块(1),则添加矩形
          if (modules.data[index]) {
            const x = offset + col * moduleSize;
            const y = offset + row * moduleSize;
            rects.push(
              `<rect x="${x.toFixed(2)}" y="${y.toFixed(2)}" `,
              `width="${moduleSize.toFixed(2)}" height="${moduleSize.toFixed(2)}" `,
              `fill="${foregroundColor}"/>`
            );
          }
        }
      }

      svgParts.push(...rects);
      svgParts.push('</svg>');

      return svgParts.join('');
    } catch (error) {
      throw new EncodingError(
        `SVG渲染失败: ${error.message}`,
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
    return 'svg';
  }
}
