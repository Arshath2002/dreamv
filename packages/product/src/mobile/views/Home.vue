<template>
  <div class="mobile-view" :class="{'demo':isDemo}" v-mobile-loading="loading">
    <template>
      <!--头部导航-->
      <div class="mobile-view-head">
      </div>
      <!--主体-->
      <div class="mobile-view-content">
        <transition :name="transitionName">
          <keep-alive v-if="isShowNavsBar" :include="cachePages" :exclude="noCachePages" :max="max">
            <router-view class="full-view has-nav-bar" :is-show-nav-bar="true"></router-view>
          </keep-alive>
          <keep-alive v-else :include="cachePages" :exclude="noCachePages" :max="max">
            <router-view class="full-view no-nav-bar" :is-show-nav-bar="false"></router-view>
          </keep-alive>
        </transition>
        <!--底部导航-->
        <div class="mobile-view-foot">
          <div :key="'nav-bar'" class="mobile-view-nav-bar">
            <DsfMobileButtonNav :buttons="navs"></DsfMobileButtonNav>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
export default {
  name: "Home",
  props: {
    hasFooter: {
      type: Boolean,
      default: false
    }
  },
  provide() {
    return {
      $isMobile: true,
      $app: this
    };
  },
  data() {
    return {
      loading: false,
      transitionName: "", //初始过渡动画方向
      // cachePages: this.$store.state.keepAlive.include,
      // noCachePages: this.$store.state.keepAlive.exclude,
      navBarTitle: "",
      max: 10
    };
  },
  computed: {
    isDemo() {
      //为true则表示在designer.html#/mobilesetting中使用
      return this.$root.isDemo;
    },
    isShowNavsBar() {
      if (this.navs.length <= 1) {
        return false;
      }
      let route = this.$route;
      let result = this.isInNavBar(route);
      return result;
    },
    navs() {
      return this.$root.navs;
    },
    inited() {
      return this.$root.inited;
    },
    cachePages() {
      return this.$store.state.keepAlive.include;
    },
    noCachePages() {
      return this.$store.state.keepAlive.exclude;
    }
  },
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {},
  beforeDestroy() {},
  destroyed() {},
  methods: {
    isInNavBar(route) {
      let index = _.findIndex(this.navs, (nav) => {
        let href = dsf.url.anchorToRoutePath(nav.href);
        if (dsf.url.isIframeLoader(href) && dsf.url.isIframeLoader(route)) {
          return href.toLowerCase() == route.fullPath.toLowerCase();
        }

        return href == route.path;
      });
      return index >= 0;
    }
  },
  watch: {
    $route: {
      handler(to, from) {
        //检测to路由是否在在导航栏内
        if (this.isInNavBar(to) && this.isInNavBar(from)) {
          //切换的页面都是顶级页面，无动画过渡效果
          this.transitionName = "slide-normal";
        } else if (!from || from.path == "/") {
          //如果form路由不存在或者从根路由进入，无动画过渡效果
          this.transitionName = "slide-normal";
        } else {
          if (to?.meta.loginPage) {
            //跳转到登录页,例如退出登录
            this.transitionName = "slide-right";
            return;
          }
          if (from?.meta.loginPage) {
            //清理当前app路由链的残留登录页面过进入系统
            dsf.transition.clearAll(this.$store);
            this.transitionName = "slide-left";
            return;
          }
          this.transitionName = window.$$state.pageDirection;
        }
      },
      immediate: true
    }
  }
};
</script>