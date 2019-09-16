/**
 * 焦点控制参数错误类
 */
class FocusManagerParamError extends Error {
  constructor(message: string) {
    super();
    this.message = `[FocusManager]-[ParamError]: ${message}`;
  }
}

/**
 * 焦点控制配置错误类
 */
class FocusManagerConfigError extends Error {
  constructor(message: string) {
    super();
    this.message = `[FocusManager]-[ConfigError]: ${message}`;
  }
}

/**
 * 焦点控制普通错误类
 */
class FocusManagerNormalError extends Error {
  constructor(messsage: string) {
    super();
    this.message = `[FocusManager]-[Error]: ${messsage}`;
  }
}

export {
  FocusManagerParamError,
  FocusManagerConfigError,
  FocusManagerNormalError
};