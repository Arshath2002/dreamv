/*
 * @Editor: zhanghang
 * @Description: 
 * @Date: 2024-10-12 14:41:49
 * @LastEditors: zhanghang
 * @LastEditTime: 2024-12-31 18:20:50
 */
if (window.$$serverModulesConfig) {
  dsf.init.loadRemoteModule(Vue, "mobile", window.$$serverModulesConfig || []).then(() => {
    require("./createApp.js");
  });
} else {
  require("./createApp.js");
}