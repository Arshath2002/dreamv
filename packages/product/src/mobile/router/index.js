import VueRouter from "vue-router";
import ErrorView from '../views/Error';
// import platformMobileRouter from "_platform/mobile/router";
// import ncMobileRouter from "_nc/mobile/router";
import Login from "../views/Login";

Vue.use(VueRouter);

const routes = [
  //注入平台路由
  ...$platformRouter.mobile,
  {
    path: "/mobile/login",
    meta: {
      title: "登录",
      needLogin: false,
      loginPage: true
    },
    component: Login
  },
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


//配置页面动态路由监听
dsf.init.initRouter(router, 'mobile');
//移动端增加对url变化时的过场动画监听
dsf.transition.initRouteTransition(router);

export default router;