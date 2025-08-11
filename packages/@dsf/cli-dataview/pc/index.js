/*
 * @Description:
 * @Author: zhanghang
 * @Date: 2022-07-20 10:02:38
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-02-07 16:57:00
 */
//注入按钮
import "./sysButton";
import directives from "../share/directives/index.js";

import * as comps from "./components";


import Agent from '../AI-Agent';

const components = {
  ...comps,
};
function install(Vue) {
  //注册指令
  Vue.use(directives);
  const installComponents = dsf.createDsfVueInstall("dataview", components);
  installComponents(Vue);

  Vue.use(Agent);
}
export default install;

export { install };
