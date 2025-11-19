/**
 * 二维码编码器
 * 封装 node-qrcode 库,将文本转换为二维码矩阵
 */

import QRCode from 'qrcode';
import { EncodingError } from '../utils/errors.js';
import { ERROR_CODES } from '../utils/constants.js';

/**
 * 编码文本为二维码矩阵
 * @param {string} content - 要编码的文本内容
 * @param {Object} options - 编码选项
 * @param {string} options.errorCorrectionLevel - 错误纠正级别 (L/M/Q/H)
 * @param {number} options.margin - 边距(模块单位)
 * @returns {Promise<Object>} 二维码矩阵数据
 * @throws {EncodingError} 编码失败时抛出
 */
export async function encode(content, options = {}) {
  try {
    const {
      errorCorrectionLevel = 'M',
      margin = 4,
    } = options;

    // 使用 node-qrcode 创建二维码段
    const segments = QRCode.create(content, {
      errorCorrectionLevel,
    });

    // 返回二维码数据
    return {
      modules: segments.modules,
      size: segments.modules.size,
      data: segments.modules.data,
      errorCorrectionLevel,
      margin,
    };
  } catch (error) {
    throw new EncodingError(
      `二维码编码失败: ${error.message}`,
      ERROR_CODES.ERR_ENCODING_FAILED,
      error
    );
  }
}
