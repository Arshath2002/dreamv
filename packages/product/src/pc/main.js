/*
 * @Editor: zhanghang
 * @Description: 
 * @Date: 2025-01-16 09:20:39
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-01-16 14:04:03
 */
if (window.$$serverModulesConfig) {
  dsf.init.loadRemoteModule(Vue, "pc", window.$$serverModulesConfig || []).then(() => {
    require("./createApp.js");
  });
} else {
  require("./createApp.js");
}