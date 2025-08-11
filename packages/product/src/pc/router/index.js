/*
 * @Editor: zhanghang
 * @Description: 
 * @Date: 2024-08-20 09:19:40
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-02-19 16:44:24
 */

import VueRouter from "vue-router";
import Login from '../views/Login';
import ErrorView from '../views/Error';
import DsfDataViewExtra from '_dataview/extra-module/pc/components/DsfDataViewExtra';
// const DsfDataViewExtra = $mixins.dataView().then(()=> import("../../../../@dsf/cli-dataview/extra-module/pc/components/DsfDataViewExtra.vue"))
Vue.use(VueRouter);

const routes = [
  //注入平台路由
  ...$platformRouter.pc,
  {
    path: "/pc/login",
    meta: {
      title: "登录",
      needLogin: false,
      waterMark:false
    },
    component: Login
  },
  {
    path: "/pc/extraTest",
    meta: {
      title: "组件测试",
      needLogin: false,
      waterMark:false
    },
    component: DsfDataViewExtra
  },
  // {
  //   path: "/pc/exam",
  //   meta: {
  //     title: "考试",
  //     needLogin: false
  //   },
  //   component: exam
  // },
  //强制匹配404页面
  {
    path: "*",
    component: ErrorView
  }
];

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes
});

dsf.init.initRouter(router, 'pc');

export default router;