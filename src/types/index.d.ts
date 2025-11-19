/**
 * 二维码生成工具库类型定义
 */

/**
 * 错误纠正级别
 * - L: 低 (~7%)
 * - M: 中 (~15%)
 * - Q: 中高 (~25%)
 * - H: 高 (~30%)
 */
export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

/**
 * 输出格式类型
 */
export type OutputFormat = 'canvas' | 'svg' | 'base64';

/**
 * Logo 配置选项
 */
export interface LogoConfig {
  /** Logo 图像源: File对象、Blob对象或URL字符串 */
  source: string | File | Blob;
  /** Logo 相对二维码面积的占比 (0 < scale ≤ 0.2) */
  scale?: number;
  /** Logo 周围的白边宽度(像素) */
  borderWidth?: number;
  /** Logo 边框颜色 */
  borderColor?: string;
}

/**
 * 二维码配置选项
 */
export interface QRCodeConfig {
  /** 要编码的文本内容 (必填) */
  content: string;
  /** 二维码尺寸(像素), 最小100px */
  size?: number;
  /** 错误纠正级别 */
  errorCorrectionLevel?: ErrorCorrectionLevel;
  /** 前景色(二维码图案) */
  foregroundColor?: string;
  /** 背景色 */
  backgroundColor?: string;
  /** Logo 配置 */
  logo?: LogoConfig | null;
  /** 输出格式 */
  outputFormat?: OutputFormat;
  /** 二维码外边距(模块单位) */
  margin?: number;
}

/**
 * 颜色信息对象
 */
export interface ColorInfo {
  /** HEX 格式颜色值 */
  hex: string;
  /** 红色通道 (0-255) */
  r: number;
  /** 绿色通道 (0-255) */
  g: number;
  /** 蓝色通道 (0-255) */
  b: number;
  /** WCAG 相对亮度 (0-1) */
  luminance: number;
}

/**
 * 生成警告类型
 */
export type WarningType = 'LOW_CONTRAST' | 'SIZE_ADJUSTED' | 'LOGO_SCALED';

/**
 * 生成警告
 */
export interface GenerationWarning {
  /** 警告类型 */
  type: WarningType;
  /** 警告消息 */
  message: string;
  /** 额外的上下文信息 */
  details: Record<string, any>;
}

/**
 * 错误类型
 */
export type ErrorType = 'VALIDATION_ERROR' | 'TIMEOUT_ERROR' | 'LOAD_ERROR' | 'ENCODING_ERROR';

/**
 * 生成错误
 */
export interface GenerationError extends Error {
  /** 错误类型 */
  type: ErrorType;
  /** 错误码 */
  code: string;
  /** 原始错误对象 */
  cause?: Error | null;
}

/**
 * 二维码输出类型
 */
export type QRCodeOutput = HTMLCanvasElement | string;

/**
 * 生成二维码的主入口函数
 * @param config 二维码配置选项
 * @returns 生成的二维码 (根据 outputFormat 返回不同类型)
 * @throws {GenerationError} 当生成失败时抛出错误
 */
export function generateQRCode(config: QRCodeConfig): Promise<QRCodeOutput>;

/**
 * 默认配置常量
 */
export const DEFAULT_CONFIG: Required<Omit<QRCodeConfig, 'content' | 'logo'>>;
