module.exports = {

  title: 'easyboot-web',

  /**
   * @type {boolean} true | false
   * @description Whether show the settings right-panel
   */
  showSettings: false,

  /**
   * @type {boolean} true | false
   * @description Whether need tagsView
   */
  tagsView: true,

  /**
   * @type {boolean} true | false
   * @description Whether fix the header
   */
  fixedHeader: false,

  /**
   * @type {boolean} true | false
   * @description Whether show the logo in sidebar
   */
  sidebarLogo: true,

  /**
   * @type {string | array} 'production' | ['production', 'development']
   * @description Need show err logs component.
   * The default is only used in the production env
   * If you want to also use it in dev, you can pass ['production', 'development']
   */
  errorLog: 'production',

  /**
   *  后台地址服务
   */
  base_api: 'http://localhost/easyboot',

  /**
   * @description 请求超时时间，毫秒（默认3分钟）
   */
  timeout: 1800000,

  /**
   *@description 自定义token头
   */
  authorizationName: 'ZFSimple-Token',

  /**
   * 错误提示信息
   */
  durationTimeout: 5 * 1000
}
