module.exports = {
  /**
   * 側邊欄主題 深色主題theme-dark，淺色主題theme-light
   */
  sideTheme: 'theme-dark',

  /**
   * 是否系統佈局配置
   */
  showSettings: false,

  /**
   * 是否顯示頂部導航
   */
  topNav: false,

  /**
   * 是否顯示 tagsView
   */
  tagsView: true,

  /**
   * 是否固定頭部
   */
  fixedHeader: false,

  /**
   * 是否顯示logo
   */
  sidebarLogo: true,

  /**
   * 是否顯示動態標題
   */
  dynamicTitle: false,

  /**
   * @type {string | array} 'production' | ['production', 'development']
   * @description Need show err logs component.
   * The default is only used in the production env
   * If you want to also use it in dev, you can pass ['production', 'development']
   */
  errorLog: 'production'
}
