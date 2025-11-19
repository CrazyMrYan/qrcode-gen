/**
 * 输入验证器
 * 验证配置参数的有效性
 */

import {
  LIMITS,
  ERROR_CODES,
  VALID_ERROR_CORRECTION_LEVELS,
  VALID_OUTPUT_FORMATS,
  WARNING_TYPES,
} from './constants.js';
import { ValidationError } from './errors.js';

/**
 * 验证内容
 * @param {string} content - 要编码的内容
 * @returns {{valid: boolean, warnings: Array}} 验证结果
 * @throws {ValidationError} 内容无效时抛出
 */
export function validateContent(content) {
  const warnings = [];

  // 验证非空
  if (!content || typeof content !== 'string') {
    throw new ValidationError(
      '内容不能为空且必须是字符串',
      ERROR_CODES.ERR_CONTENT_EMPTY
    );
  }

  // 验证长度
  if (content.length > LIMITS.MAX_CONTENT_LENGTH) {
    throw new ValidationError(
      `内容长度超过最大限制 ${LIMITS.MAX_CONTENT_LENGTH} 字符`,
      ERROR_CODES.ERR_CONTENT_TOO_LONG
    );
  }

  return { valid: true, warnings };
}

/**
 * 验证尺寸
 * @param {number} size - 二维码尺寸
 * @returns {{valid: boolean, adjustedSize: number, warnings: Array}} 验证结果
 */
export function validateSize(size) {
  const warnings = [];
  let adjustedSize = size;

  if (typeof size !== 'number' || size <= 0) {
    throw new ValidationError('尺寸必须是正数', ERROR_CODES.ERR_INVALID_SIZE);
  }

  // 自动调整过小的尺寸
  if (size < LIMITS.MIN_SIZE) {
    adjustedSize = LIMITS.MIN_SIZE;
    warnings.push({
      type: WARNING_TYPES.SIZE_ADJUSTED,
      message: `尺寸 ${size}px 小于最小值,已自动调整到 ${LIMITS.MIN_SIZE}px`,
      details: {
        originalSize: size,
        adjustedSize: LIMITS.MIN_SIZE,
        minimum: LIMITS.MIN_SIZE,
      },
    });
  }

  return { valid: true, adjustedSize, warnings };
}

/**
 * 验证错误纠正级别
 * @param {string} level - 错误纠正级别
 * @returns {{valid: boolean, warnings: Array}} 验证结果
 * @throws {ValidationError} 级别无效时抛出
 */
export function validateErrorCorrectionLevel(level) {
  if (!VALID_ERROR_CORRECTION_LEVELS.includes(level)) {
    throw new ValidationError(
      `无效的错误纠正级别: ${level}。有效值: ${VALID_ERROR_CORRECTION_LEVELS.join(', ')}`,
      ERROR_CODES.ERR_INVALID_ERROR_CORRECTION_LEVEL
    );
  }

  return { valid: true, warnings: [] };
}

/**
 * 验证输出格式
 * @param {string} format - 输出格式
 * @returns {{valid: boolean, warnings: Array}} 验证结果
 * @throws {ValidationError} 格式无效时抛出
 */
export function validateOutputFormat(format) {
  if (!VALID_OUTPUT_FORMATS.includes(format)) {
    throw new ValidationError(
      `无效的输出格式: ${format}。有效值: ${VALID_OUTPUT_FORMATS.join(', ')}`,
      ERROR_CODES.ERR_INVALID_OUTPUT_FORMAT
    );
  }

  return { valid: true, warnings: [] };
}

/**
 * 验证 Logo source
 * @param {string|File|Blob} source - Logo 源
 * @returns {{valid: boolean, warnings: Array}} 验证结果
 * @throws {ValidationError} source 无效时抛出
 */
export function validateLogoSource(source) {
  if (!source) {
    throw new ValidationError('Logo source 不能为空', ERROR_CODES.ERR_INVALID_LOGO_SOURCE);
  }

  const isString = typeof source === 'string';
  const isFile = typeof File !== 'undefined' && source instanceof File;
  const isBlob = typeof Blob !== 'undefined' && source instanceof Blob;

  if (!isString && !isFile && !isBlob) {
    throw new ValidationError(
      'Logo source 必须是字符串、File 对象或 Blob 对象',
      ERROR_CODES.ERR_INVALID_LOGO_SOURCE
    );
  }

  // 验证字符串URL
  if (isString && source.trim().length === 0) {
    throw new ValidationError('Logo URL 不能为空字符串', ERROR_CODES.ERR_INVALID_LOGO_SOURCE);
  }

  return { valid: true, warnings: [] };
}

/**
 * 验证 Logo scale
 * @param {number} scale - Logo 缩放比例
 * @returns {{valid: boolean, adjustedScale: number, warnings: Array}} 验证结果
 */
export function validateLogoScale(scale) {
  const warnings = [];
  let adjustedScale = scale;

  if (typeof scale !== 'number' || scale <= 0) {
    throw new ValidationError('Logo scale 必须是正数', ERROR_CODES.ERR_INVALID_LOGO_SCALE);
  }

  // 自动限制过大的scale
  if (scale > LIMITS.LOGO_MAX_SCALE) {
    adjustedScale = LIMITS.LOGO_MAX_SCALE;
    warnings.push({
      type: WARNING_TYPES.LOGO_SCALED,
      message: `Logo占比 ${scale} 超过最大值,已自动限制到 ${LIMITS.LOGO_MAX_SCALE}`,
      details: {
        originalScale: scale,
        adjustedScale: LIMITS.LOGO_MAX_SCALE,
        maximum: LIMITS.LOGO_MAX_SCALE,
      },
    });
  }

  return { valid: true, adjustedScale, warnings };
}
