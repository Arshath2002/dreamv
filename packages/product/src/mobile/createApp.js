import "../dsf_config";
//全局样式
import "../assets/styles/mobile/dsfStyle.scss";


//注入本地元数据
import "../metadata";
//注入入本地api
import "../api";

import driver from "@dsf/cli-core/driver";
//引入本项目所有移动端组件
// import mobile from "./../mobile/components";
dsf.mix(dsf, { driver });


//此处引入要使用的组件
import App from "./App.vue";
import store from "../store";
import router from "./router";
import i18n from '../i18n';
import NProgress from "nprogress";
import themesConfig from "_project/assets/styles/common";

Vue.config.productionTip = false;

NProgress.configure({
  easing: "ease-in",
  minimum: 0.1,
  showSpinner: false
});

const isDemo = (window.frameElement || window).name == "appDemo";
dsf.global.$isMobile = true;

dsf.init.initPlatform(Vue);
dsf.init.globalMixin(Vue, {
  beforeRouteEnter(to, from, next) {
    //将当前页面保存到keepAlive中
    next(vm => {
      dsf.transition.addCache(vm.$store, to, from, vm);
    })
  },
  beforeRouteLeave(to, from, next) {
    if (to && from && this.$root.navs) {
      //路由离开时清除掉keepAlive缓存,当index>=0时为顶级页面
      let index = _.findIndex(this.$root.navs, (it) => it.href == from?.path);
      dsf.transition.clearCache(this.$store, to, from, index >= 0);
    }
    next();
  },
});

// Vue.use(platformComponents);
// Vue.use(ncComponents)
// Vue.use(teasComponents);
// Vue.use(mobile);

let loginUrl = dsf.url.getMobileLogin();
router.beforeEach((to, from, next) => {
  NProgress.start();
  if (!dsf.driver.$inited) {
    dsf.driver.$init()
      .then(() => {
        toNext()
      })
  }
  else {
    toNext()
  }
  function toNext() {
    // 非登录页，且需要登录，跳转到登录页面
    if ((to.meta.needLogin || to.fullPath == "/") && !dsf.getToken()) {
      location.replace(loginUrl);
      next(false);
      return;
    }
    next();
  }
});

router.afterEach((to) => {
  //通过路由的title修改页面标题
  document.title = to.meta.title || dsf.config.setting_public_logo_title || "";
  if (isDemo) {
    try {
      if (window.parent && window.parent.$mobileSetting) {
        window.parent.$mobileSetting.routeChange(to);
      }
    } catch (ex) {
      dsf.error(ex);
    }
  }

  NProgress.done();
});

new Vue({
  mixins: [dsf.$systemGlobalSetting(themesConfig)],
  store,
  router,
  i18n,
  data() {
    return {
      isDemo: isDemo,
      inited: false,
      navs: [],
      preloads: [],
      cachePages: [],
      noCachePages: []
    };
  },
  methods: {
    getAppId() {
      let urlInfo = dsf.url.parse(window.location.href);
      let appId = urlInfo.searchQuery["appid"] || "";
      if (!appId) {
        appId = dsf.storage.session.get("appid");
      }
      return appId;
    },
    async initApp(appId) {
      appId = appId || this.getAppId();
      if (appId) {
        let res = await this.$webAPI.appInit(appId);
        if (res && res.data) {
          let configData = JSON.parse(res.data.data["dsfa_rm.content"] || "{}");
          this.navs = configData.navs;
          this.preloads = configData.preloads;
          await dsf.init.preloads(this.preloads || [], this.$router, "mobile");
          this.inited = true;
        } else {
          this.inited = true;
        }
        dsf.storage.session.set("appid", appId);
      }
    }
  },
  beforeCreate() {
    //移动端页面增加rem适配
    dsf.flexible();
    //监听window窗体变化后，递归组件执行组件的resize函数
    dsf.resizeDetector();
  },
  async created() {
    if (this.isDemo) {
      //动态加载@vant/touch-emulator模块
      import(/* webpackChunkName: "touch-emulator" */ "@vant/touch-emulator");
    }
    this.initApp()
  },
  render: (h) => h(App)
}).$mount("#app");
