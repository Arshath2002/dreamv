import "../dsf_config";

import store from "../store";

//注入本地元数据
import "../metadata";
//注入入本地api
import "../api";
//引入本项目所有pc组件
import pcComponent from "./../pc/components";
//引入本项目所有移动端组件
import mobileComponent from "./../mobile/components";

//引入设计器
import App from "./App.vue";
import router from "./router";
import i18n from '../i18n';
import themesConfig from "_project/assets/styles/common";

Vue.config.productionTip = false;

dsf.init.initPlatform(Vue);
dsf.init.globalMixin(Vue);

// Vue.use(_platform.pc.components);
// Vue.use(_platform.mobile.components);
Vue.use(pcComponent);
Vue.use(mobileComponent);

var EventBus = new Vue();
//注入WEBAPI
Object.defineProperties(Vue.prototype, {
  $bus: {
    get: function () {
      return EventBus;
    }
  }
});

router.beforeResolve((to, from, next) => {
  //通过路由的title修改页面标题
  document.title = to.meta.title || dsf.config.setting_public_logo_title || "";
  next();
});

new Vue({
  mixins: [dsf.$systemGlobalSetting(themesConfig)],
  router,
  store,
  i18n,
  data() {
    return {};
  },
  created() {
    //监听window窗体变化后，递归组件执行组件的resize函数
    dsf.resizeDetector();
    //修复IE前进后退路由变化没效果的问题
    if ("-ms-scroll-limit" in document.documentElement.style && "-ms-ime-align" in document.documentElement.style) {
      //修复IE前进后退路由变化没效果的问题
      window.addEventListener(
        "hashchange",
        () => {
          var currentPath = window.location.hash.slice(1);
          if (this.$router.path !== currentPath) {
            this.$router.replace(currentPath);
          }
        },
        false
      );
    }
  },
  render: (h) => h(App)
}).$mount("#app");
