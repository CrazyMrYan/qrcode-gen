/**
 * 颜色验证和对比度检查
 * 支持 HEX、RGB、颜色名称
 * 实现 WCAG 2.1 相对亮度算法
 */

import { WCAG_LUMINANCE_CONSTANTS, LIMITS, WARNING_TYPES, ERROR_CODES } from '../utils/constants.js';
import { ValidationError } from '../utils/errors.js';

// 常用颜色名称到HEX的映射
const COLOR_NAMES = {
  black: '#000000',
  white: '#FFFFFF',
  red: '#FF0000',
  green: '#008000',
  blue: '#0000FF',
  yellow: '#FFFF00',
  cyan: '#00FFFF',
  magenta: '#FF00FF',
  gray: '#808080',
  grey: '#808080',
  silver: '#C0C0C0',
  maroon: '#800000',
  olive: '#808000',
  lime: '#00FF00',
  aqua: '#00FFFF',
  teal: '#008080',
  navy: '#000080',
  fuchsia: '#FF00FF',
  purple: '#800080',
  orange: '#FFA500',
};

/**
 * 解析颜色字符串为RGB值
 * @param {string} color - 颜色字符串(HEX/RGB/颜色名称)
 * @returns {{r: number, g: number, b: number}} RGB值
 * @throws {ValidationError} 颜色格式无效时抛出
 */
export function parseColor(color) {
  if (!color || typeof color !== 'string') {
    throw new ValidationError('颜色必须是字符串', ERROR_CODES.ERR_INVALID_COLOR);
  }

  const trimmed = color.trim().toLowerCase();

  // 尝试解析颜色名称
  if (COLOR_NAMES[trimmed]) {
    return parseHexColor(COLOR_NAMES[trimmed]);
  }

  // 尝试解析HEX格式
  if (trimmed.startsWith('#')) {
    return parseHexColor(trimmed);
  }

  // 尝试解析RGB格式
  if (trimmed.startsWith('rgb')) {
    return parseRgbColor(trimmed);
  }

  throw new ValidationError(
    `无效的颜色格式: ${color}。支持格式: HEX(#RRGGBB)、RGB(rgb(r,g,b))或颜色名称`,
    ERROR_CODES.ERR_INVALID_COLOR
  );
}

/**
 * 解析HEX颜色
 * @param {string} hex - HEX颜色字符串
 * @returns {{r: number, g: number, b: number}} RGB值
 */
function parseHexColor(hex) {
  // 移除 # 前缀
  let cleanHex = hex.replace('#', '');

  // 支持缩写格式 #RGB -> #RRGGBB
  if (cleanHex.length === 3) {
    cleanHex = cleanHex
      .split('')
      .map(char => char + char)
      .join('');
  }

  // 验证格式
  if (!/^[0-9A-Fa-f]{6}$/.test(cleanHex)) {
    throw new ValidationError(
      `无效的HEX颜色格式: ${hex}`,
      ERROR_CODES.ERR_INVALID_COLOR
    );
  }

  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);

  return { r, g, b };
}

/**
 * 解析RGB颜色
 * @param {string} rgb - RGB颜色字符串
 * @returns {{r: number, g: number, b: number}} RGB值
 */
function parseRgbColor(rgb) {
  // 提取RGB值: rgb(255, 0, 0) 或 rgb(255,0,0)
  const match = rgb.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/);

  if (!match) {
    throw new ValidationError(
      `无效的RGB颜色格式: ${rgb}。正确格式: rgb(r,g,b)`,
      ERROR_CODES.ERR_INVALID_COLOR
    );
  }

  const r = parseInt(match[1], 10);
  const g = parseInt(match[2], 10);
  const b = parseInt(match[3], 10);

  // 验证范围
  if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
    throw new ValidationError(
      `RGB值必须在0-255范围内: ${rgb}`,
      ERROR_CODES.ERR_INVALID_COLOR
    );
  }

  return { r, g, b };
}

/**
 * RGB转HEX
 * @param {number} r - 红色通道
 * @param {number} g - 绿色通道
 * @param {number} b - 蓝色通道
 * @returns {string} HEX颜色字符串
 */
export function rgbToHex(r, g, b) {
  const toHex = value => {
    const hex = Math.round(value).toString(16).padStart(2, '0');
    return hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

/**
 * 计算WCAG 2.1相对亮度
 * @param {number} r - 红色通道 (0-255)
 * @param {number} g - 绿色通道 (0-255)
 * @param {number} b - 蓝色通道 (0-255)
 * @returns {number} 相对亮度 (0-1)
 */
export function calculateRelativeLuminance(r, g, b) {
  const {
    RED_COEFFICIENT,
    GREEN_COEFFICIENT,
    BLUE_COEFFICIENT,
    GAMMA_THRESHOLD,
    GAMMA_DIVISOR,
    GAMMA_OFFSET,
    GAMMA_MULTIPLIER,
    GAMMA_EXPONENT,
  } = WCAG_LUMINANCE_CONSTANTS;

  // 归一化RGB值到0-1
  const normalize = value => {
    const normalized = value / 255;
    // 应用gamma校正
    if (normalized <= GAMMA_THRESHOLD) {
      return normalized / GAMMA_DIVISOR;
    }
    return Math.pow((normalized + GAMMA_OFFSET) / GAMMA_MULTIPLIER, GAMMA_EXPONENT);
  };

  const rs = normalize(r);
  const gs = normalize(g);
  const bs = normalize(b);

  // 计算相对亮度
  return RED_COEFFICIENT * rs + GREEN_COEFFICIENT * gs + BLUE_COEFFICIENT * bs;
}

/**
 * 计算对比度比率
 * @param {number} lum1 - 第一个颜色的相对亮度
 * @param {number} lum2 - 第二个颜色的相对亮度
 * @returns {number} 对比度比率
 */
export function calculateContrastRatio(lum1, lum2) {
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * 验证颜色并返回ColorInfo对象
 * @param {string} color - 颜色字符串
 * @returns {Object} ColorInfo对象
 */
export function validateColor(color) {
  const rgb = parseColor(color);
  const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
  const luminance = calculateRelativeLuminance(rgb.r, rgb.g, rgb.b);

  return {
    hex,
    r: rgb.r,
    g: rgb.g,
    b: rgb.b,
    luminance,
  };
}

/**
 * 检查颜色对比度并返回警告
 * @param {string} foreground - 前景色
 * @param {string} background - 背景色
 * @returns {{warnings: Array, contrastRatio: number}} 对比度检查结果
 */
export function checkColorContrast(foreground, background) {
  const warnings = [];

  const fgColor = validateColor(foreground);
  const bgColor = validateColor(background);

  const contrastRatio = calculateContrastRatio(fgColor.luminance, bgColor.luminance);

  // 对比度低于阈值时发出警告
  if (contrastRatio < LIMITS.MIN_CONTRAST_RATIO) {
    warnings.push({
      type: WARNING_TYPES.LOW_CONTRAST,
      message: `前景色和背景色对比度过低 (${contrastRatio.toFixed(2)}:1),可能影响扫描成功率`,
      details: {
        contrastRatio: parseFloat(contrastRatio.toFixed(2)),
        recommended: LIMITS.MIN_CONTRAST_RATIO,
        foreground: fgColor.hex,
        background: bgColor.hex,
      },
    });
  }

  return { warnings, contrastRatio };
}
