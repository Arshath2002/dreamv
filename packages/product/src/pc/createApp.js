import "../dsf_config";

//全局样式
import "../assets/styles/pc/dsfStyle.scss";

//注入本地元数据
import "../metadata";
//注入入本地api
import "../api";
//引入本项目所有pc组件
import pcComponent from "./../pc/components";

import App from "./App.vue";
import store from "../store";
import router from "./router";
import i18n from '../i18n';

import themesConfig from "_project/assets/styles/common";

Vue.use(pcComponent);

dsf.init.initPlatform(Vue);
dsf.init.globalMixin(Vue);

Vue.config.productionTip = false;
Vue.config.devtools = true;

// 登录页地址处理
let loginUrl = dsf.config.setting_public_pc_login_page;

router.beforeEach((to, from, next) => {
  // 非登录页，且需要登录，跳转到登录页面
  // if ((to.meta.needLogin || to.fullPath == "/") && !dsf.getToken()) {
  //   let url = loginUrl + (to.fullPath !== "/" ? ("?from=" + encodeURIComponent(location.href)) : "");
  //   location.replace(url);
  //   return;
  // }
  //通过路由的title修改页面标题
  document.title = to.meta.title || dsf.config.setting_public_logo_title || "";
  //优先判断路由是否存在
  next();
});

new Vue({
  mixins: [dsf.$systemGlobalSetting(themesConfig)],
  store,
  router,
  i18n,
  created() {
    //监听window窗体变化后，递归组件执行组件的resize函数
    dsf.resizeDetector();
    //修复IE前进后退路由变化没效果的问题
    if ("-ms-scroll-limit" in document.documentElement.style && "-ms-ime-align" in document.documentElement.style) {
      window.addEventListener("hashchange",
        () => {
          var currentPath = window.location.hash.slice(1);
          console.log(router.replace);
          if (router.path !== currentPath) {
            router.replace(currentPath);
          }
        },
        false
      );
    }
  },
  render: (h) => h(App)
}).$mount("#app");
