/**
 * 自定义错误类
 * 定义各种生成过程中可能出现的错误
 */

/**
 * 基础生成错误类
 */
export class GenerationError extends Error {
  constructor(message, type, code, cause = null) {
    super(message);
    this.name = 'GenerationError';
    this.type = type;
    this.code = code;
    this.cause = cause;
  }
}

/**
 * 验证错误
 * 配置参数验证失败时抛出
 */
export class ValidationError extends GenerationError {
  constructor(message, code, cause = null) {
    super(message, 'VALIDATION_ERROR', code, cause);
    this.name = 'ValidationError';
  }
}

/**
 * 超时错误
 * Logo加载超时时抛出
 */
export class TimeoutError extends GenerationError {
  constructor(message, code, cause = null) {
    super(message, 'TIMEOUT_ERROR', code, cause);
    this.name = 'TimeoutError';
  }
}

/**
 * 加载错误
 * Logo加载失败时抛出
 */
export class LoadError extends GenerationError {
  constructor(message, code, cause = null) {
    super(message, 'LOAD_ERROR', code, cause);
    this.name = 'LoadError';
  }
}

/**
 * 编码错误
 * 二维码编码失败时抛出
 */
export class EncodingError extends GenerationError {
  constructor(message, code, cause = null) {
    super(message, 'ENCODING_ERROR', code, cause);
    this.name = 'EncodingError';
  }
}
