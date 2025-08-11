/*
 * @Editor: zhanghang
 * @Description: 
 * @Date: 2022-08-03 14:46:58
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-01-09 11:36:33
 */
import "./sysButton";
import directives from "../share/directives/index.js";

import * as comps from "./components";
const components = {
  ...comps,
};
function install(Vue) {
  //注册指令
  Vue.use(directives);
  const installComponents = dsf.createDsfVueInstall("dataview", components);
  installComponents(Vue);
}
export default install;

export { install };