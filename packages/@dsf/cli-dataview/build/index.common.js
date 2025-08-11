/*
 * @Description:
 * @Author: zhanghang
 * @Date: 2022-07-20 10:02:38
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-03-24 09:40:56
 */
import "./config.js";
import config from "../common/config";
import api from "../api";
//引入平台级元数据
import "../metadata";
//引入平台使用的vuex的store
import store from "../store";
//语言包
import i18n from "../i18n";
import "../mixins";
import setModulePath from "@dsf/cli-core/build/setDsfModulePath";
import iconfont from "../assets/styles/common/icon.scss";


!(function (global) {
  setModulePath("dataview", __DSF_DATAVIEW_PATH__);
  //注册图标库
  dsf.icons.addLib({
    json: () => import(/*webpackChunkName:"dataview_icon"*/ "../assets/fonts/iconfont/iconfont.json"),
  });
  //注册api
  api(dsf);
  dsf.mergeConfig(dsf.config, config);
  dsf.mix(true, global.$i18n, { ...i18n });
  dsf.mix(true, global.$platformStore, { ...store });
})(dsf.global || (dsf.global = {}));
