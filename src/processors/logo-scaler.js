/**
 * Logo 尺寸缩放
 * 确保 Logo 不超过二维码面积的 20%
 */

import { validateLogoScale } from '../utils/validators.js';

/**
 * 计算 Logo 缩放后的尺寸
 * @param {HTMLImageElement} logoImage - Logo 图像对象
 * @param {number} qrSize - 二维码尺寸(像素)
 * @param {number} scale - 期望的缩放比例(相对于二维码面积)
 * @returns {{width: number, height: number, adjustedScale: number, warnings: Array}} 缩放结果
 */
export function calculateLogoSize(logoImage, qrSize, scale = 0.2) {
  // 验证并调整 scale
  const scaleValidation = validateLogoScale(scale);
  const adjustedScale = scaleValidation.adjustedScale;
  const warnings = scaleValidation.warnings;

  // 计算最大 Logo 面积
  const maxLogoArea = qrSize * qrSize * adjustedScale;

  // 计算最大 Logo 边长(假设正方形)
  const maxLogoSize = Math.sqrt(maxLogoArea);

  // 获取 Logo 原始尺寸
  const logoWidth = logoImage.naturalWidth || logoImage.width;
  const logoHeight = logoImage.naturalHeight || logoImage.height;

  // 计算 Logo 宽高比
  const aspectRatio = logoWidth / logoHeight;

  // 计算缩放后的尺寸,保持宽高比
  let scaledWidth, scaledHeight;

  if (aspectRatio >= 1) {
    // 宽度大于等于高度
    scaledWidth = Math.min(logoWidth, maxLogoSize);
    scaledHeight = scaledWidth / aspectRatio;
  } else {
    // 高度大于宽度
    scaledHeight = Math.min(logoHeight, maxLogoSize);
    scaledWidth = scaledHeight * aspectRatio;
  }

  // 确保不超过最大面积
  const currentArea = scaledWidth * scaledHeight;
  if (currentArea > maxLogoArea) {
    const areaRatio = Math.sqrt(maxLogoArea / currentArea);
    scaledWidth *= areaRatio;
    scaledHeight *= areaRatio;
  }

  return {
    width: Math.round(scaledWidth),
    height: Math.round(scaledHeight),
    adjustedScale,
    warnings,
  };
}

/**
 * 计算 Logo 在二维码中的位置(居中)
 * @param {number} qrSize - 二维码尺寸
 * @param {number} logoWidth - Logo 宽度
 * @param {number} logoHeight - Logo 高度
 * @returns {{x: number, y: number}} Logo 位置坐标
 */
export function calculateLogoPosition(qrSize, logoWidth, logoHeight) {
  return {
    x: Math.round((qrSize - logoWidth) / 2),
    y: Math.round((qrSize - logoHeight) / 2),
  };
}
