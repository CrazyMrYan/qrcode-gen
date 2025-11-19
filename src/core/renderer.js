/**
 * 渲染器基类
 * 定义所有渲染器的通用接口
 */

/**
 * 抽象渲染器基类
 */
export class Renderer {
  /**
   * 渲染二维码矩阵
   * @param {Object} matrix - 二维码矩阵数据
   * @param {Object} config - 渲染配置
   * @returns {*} 渲染结果(具体类型由子类决定)
   */
  render(_matrix, _config) {
    throw new Error('render() 方法必须由子类实现');
  }

  /**
   * 获取渲染器支持的输出格式
   * @returns {string} 输出格式名称
   */
  getFormat() {
    throw new Error('getFormat() 方法必须由子类实现');
  }
}

/**
 * 工具函数: 计算模块尺寸
 * @param {number} canvasSize - Canvas总尺寸
 * @param {number} moduleCount - 模块数量
 * @param {number} margin - 边距(模块单位)
 * @returns {{moduleSize: number, offset: number}} 模块尺寸和偏移量
 */
export function calculateModuleSize(canvasSize, moduleCount, margin) {
  const totalModules = moduleCount + margin * 2;
  const moduleSize = canvasSize / totalModules;
  const offset = moduleSize * margin;

  return { moduleSize, offset };
}
