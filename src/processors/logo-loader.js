/**
 * Logo 加载器
 * 支持 File/Blob/URL 三种输入源,处理超时和加载失败
 */

import { LoadError, TimeoutError } from '../utils/errors.js';
import { ERROR_CODES, LIMITS } from '../utils/constants.js';
import { validateLogoSource } from '../utils/validators.js';

/**
 * 加载 Logo 图像
 * @param {string|File|Blob} source - Logo 源
 * @param {number} timeout - 超时时间(毫秒)
 * @returns {Promise<HTMLImageElement>} 加载的图像对象
 * @throws {LoadError|TimeoutError} 加载失败或超时时抛出
 */
export async function loadLogo(source, timeout = LIMITS.LOGO_LOAD_TIMEOUT) {
  // 验证 source
  validateLogoSource(source);

  // 根据类型选择加载方式
  if (typeof source === 'string') {
    return loadLogoFromUrl(source, timeout);
  } else {
    return loadLogoFromBlob(source, timeout);
  }
}

/**
 * 从 URL 加载 Logo
 * @param {string} url - 图像 URL
 * @param {number} timeout - 超时时间
 * @returns {Promise<HTMLImageElement>} 加载的图像对象
 */
function loadLogoFromUrl(url, timeout) {
  return new Promise((resolve, reject) => {
    const img = new Image();

    // 设置超时
    const timeoutId = setTimeout(() => {
      img.src = ''; // 取消加载
      reject(
        new TimeoutError(
          `Logo加载超时(${timeout}ms): ${url}`,
          ERROR_CODES.ERR_LOGO_LOAD_TIMEOUT
        )
      );
    }, timeout);

    // 成功加载
    img.onload = () => {
      clearTimeout(timeoutId);
      resolve(img);
    };

    // 加载失败
    img.onerror = () => {
      clearTimeout(timeoutId);
      reject(
        new LoadError(
          `Logo加载失败: ${url}`,
          ERROR_CODES.ERR_LOGO_LOAD_FAILED
        )
      );
    };

    // 支持跨域(如果需要)
    img.crossOrigin = 'anonymous';

    // 开始加载
    img.src = url;
  });
}

/**
 * 从 File/Blob 加载 Logo
 * @param {File|Blob} blob - 图像 Blob
 * @param {number} timeout - 超时时间
 * @returns {Promise<HTMLImageElement>} 加载的图像对象
 */
function loadLogoFromBlob(blob, timeout) {
  return new Promise((resolve, reject) => {
    try {
      // 创建 Object URL
      const objectUrl = URL.createObjectURL(blob);

      const img = new Image();

      // 设置超时
      const timeoutId = setTimeout(() => {
        URL.revokeObjectURL(objectUrl);
        reject(
          new TimeoutError(
            `Logo加载超时(${timeout}ms)`,
            ERROR_CODES.ERR_LOGO_LOAD_TIMEOUT
          )
        );
      }, timeout);

      // 成功加载
      img.onload = () => {
        clearTimeout(timeoutId);
        // 不立即释放 objectUrl,因为可能还需要使用图像
        resolve(img);
      };

      // 加载失败
      img.onerror = () => {
        clearTimeout(timeoutId);
        URL.revokeObjectURL(objectUrl);
        reject(
          new LoadError(
            'Logo加载失败: 无效的图像文件',
            ERROR_CODES.ERR_LOGO_LOAD_FAILED
          )
        );
      };

      // 开始加载
      img.src = objectUrl;
    } catch (error) {
      reject(
        new LoadError(
          `Logo加载失败: ${error.message}`,
          ERROR_CODES.ERR_LOGO_LOAD_FAILED,
          error
        )
      );
    }
  });
}
