
import VueRouter from "vue-router";


Vue.use(VueRouter);
const routes = [
  //平台导出的默认路由
  ...$platformRouter.designer,
];

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes
});

dsf.init.initRouter(router, 'pc');

export default router;