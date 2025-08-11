/*
 * @Description:
 * @Author: zhanghang
 * @Date: 2023-05-19 18:13:35
 * @LastEditors: zhanghang
 * @LastEditTime: 2024-06-03 15:38:35
 */

import router from "../pc/router";
import install from "../pc";
import "../assets/styles/pc/index.scss";

!(function (global) {
  Vue.use(install);
  global.$platformRouter.pc.push(...router);

})(dsf.global || (dsf.global = {}));
