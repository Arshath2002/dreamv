/*
 * @Description: 
 * @Author: zhanghang
 * @Date: 2022-07-20 10:18:42
 * @LastEditors: zhanghang
 * @LastEditTime: 2022-07-26 13:55:00
 */
import router from '../designer/router'
import install from '../designer';
import "../assets/styles/designer/designer.scss";
!function (global) {
  Vue.use(install);
  global.$platformRouter.designer.push(...router);
}(dsf.global || (dsf.global = {}))