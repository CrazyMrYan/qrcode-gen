/**
 * 配置解析器
 * 合并用户配置和默认值
 */

import { DEFAULT_CONFIG } from './constants.js';

/**
 * 解析和合并用户配置
 * @param {Object} userConfig - 用户提供的配置
 * @returns {Object} 合并后的完整配置
 */
export function parseConfig(userConfig) {
  if (!userConfig || typeof userConfig !== 'object') {
    throw new Error('配置必须是一个对象');
  }

  // 合并配置
  const config = {
    ...DEFAULT_CONFIG,
    ...userConfig,
  };

  // 处理 logo 配置
  if (userConfig.logo !== undefined) {
    if (userConfig.logo === null) {
      config.logo = null;
    } else if (typeof userConfig.logo === 'object') {
      config.logo = {
        scale: 0.2,
        borderWidth: 0,
        borderColor: '#FFFFFF',
        ...userConfig.logo,
      };
    }
  }

  return config;
}

/**
 * 提取 Logo 配置
 * @param {Object|null} logoConfig - Logo配置对象
 * @returns {Object|null} 规范化的Logo配置
 */
export function parseLogoConfig(logoConfig) {
  if (!logoConfig) {
    return null;
  }

  return {
    source: logoConfig.source,
    scale: logoConfig.scale ?? 0.2,
    borderWidth: logoConfig.borderWidth ?? 0,
    borderColor: logoConfig.borderColor ?? '#FFFFFF',
  };
}
