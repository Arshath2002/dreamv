/*
 * @Editor: zhanghang
 * @Description: 
 * @Date: 2025-01-23 10:54:31
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-01-23 11:32:11
 */

import install from "./pc";
import "./assets/styles/pc/index.scss";

!(function (global) {
  Vue.use(install);
})(dsf.global || (dsf.global = {}));