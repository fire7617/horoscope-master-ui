import Vue from 'vue'

import Cookies from 'js-cookie'

import Element from 'element-ui'
import './assets/styles/element-variables.scss'

import '@/assets/styles/index.scss' // global css
import '@/assets/styles/ruoyi.scss' // ruoyi css
import App from './App'
import store from './store'
import router from './router'
import directive from './directive' // directive
import plugins from './plugins' // plugins
import { download } from '@/utils/request'

import './assets/icons' // icon
import './permission' // permission control
import { getDicts } from "@/api/system/dict/data";
import { getConfigKey } from "@/api/system/config";
import { parseTime, resetForm, addDateRange, selectDictLabel, selectDictLabels, handleTree } from "@/utils/ruoyi";
// 分頁組件
import Pagination from "@/components/Pagination";
// 自定義表格工具組件
import RightToolbar from "@/components/RightToolbar"
// 富文本組件
import Editor from "@/components/Editor"
// 文件上傳組件
import FileUpload from "@/components/FileUpload"
// 圖片上傳組件
import ImageUpload from "@/components/ImageUpload"
// 圖片預覽組件
import ImagePreview from "@/components/ImagePreview"
// 字典標籤組件
import DictTag from '@/components/DictTag'
// 頭部標籤組件
import VueMeta from 'vue-meta'
// 字典數據組件
import DictData from '@/components/DictData'

// 全局方法掛載
Vue.prototype.getDicts = getDicts
Vue.prototype.getConfigKey = getConfigKey
Vue.prototype.parseTime = parseTime
Vue.prototype.resetForm = resetForm
Vue.prototype.addDateRange = addDateRange
Vue.prototype.selectDictLabel = selectDictLabel
Vue.prototype.selectDictLabels = selectDictLabels
Vue.prototype.download = download
Vue.prototype.handleTree = handleTree

// 全局組件掛載
Vue.component('DictTag', DictTag)
Vue.component('Pagination', Pagination)
Vue.component('RightToolbar', RightToolbar)
Vue.component('Editor', Editor)
Vue.component('FileUpload', FileUpload)
Vue.component('ImageUpload', ImageUpload)
Vue.component('ImagePreview', ImagePreview)

Vue.use(directive)
Vue.use(plugins)
Vue.use(VueMeta)
DictData.install()

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */

Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
})

Vue.config.productionTip = false

import i18n from '@/utils/lang'
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
