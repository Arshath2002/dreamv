/*
 * @Description: 
 * @Author: zhanghang
 * @Date: 2022-11-28 13:53:54
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-02-18 11:46:00
 */

import chartNodata from './chartNodata.js'
import longPress from './customLongPress.js'
import imgFormat from './imgFormat.js'
function install(Vue) {
  Vue.use(chartNodata);
  Vue.use(longPress);
  Vue.use(imgFormat);
}

export default install