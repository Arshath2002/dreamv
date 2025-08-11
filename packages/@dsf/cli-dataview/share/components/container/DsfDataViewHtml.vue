<!--
 * @Editor: zhanghang
 * @Description: 
 * @Date: 2025-07-01 10:27:37
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-07-01 16:45:39
-->
<template>
  <div class="dsf-dv-html data-view-item-wrap" :style="controlStyle">
    <div v-if="isDesign" style="text-align: center; background-color: #fff; padding: 20px 0px; font-style: italic; color: #c0c0c0">html片段</div>
    <component v-else :is="component" :key="renderKey"></component>
  </div>
</template>
<script>
export default dsf.component({
  name: "DsfDataViewHtml",
  ctrlCaption: "大屏html",
  mixins: [$mixins.dataView],
  props: {
    injectTemplate: {
      type: String,
      default: "",
    },
    injectData: {
      type: Object,
      default() {},
    },
  },
  data() {
    return {
      component: null,
      renderKey: dsf.uuid(), // 用于强制重新渲染
      pageProxyWatcher: null, // 用于存储观察者
    };
  },
  mounted() {
    this.render();
    this.setupDataWatcher();
  },
  beforeDestroy() {
    // 组件销毁时清除观察者
    if (this.pageProxyWatcher) {
      this.pageProxyWatcher();
    }
  },
  watch: {
    injectData: {
      handler() {
        this.render();
      },
      deep: true,
    },
  },
  methods: {
    render() {
      if (this.isDesign) return false;
      const template = dsf.unescapeHTML(this.injectTemplate);
      const pageProxy = this.$page && this.$page.$parent;

      const res = Vue.compile(template);

      let sharedContext = {
        $data: {},
        $props: {},
        $computed: {},
        $methods: {},
      };

      if (pageProxy) {
        // 创建绑定到pageProxy的方法
        const boundMethods = {};
        Object.keys(pageProxy.$options.methods || {}).forEach((key) => {
          boundMethods[key] = pageProxy.$options.methods[key].bind(pageProxy);
        });
        // 创建绑定到pageProxy的计算属性
        const boundComputed = {};
        Object.keys(pageProxy.$options.computed || {}).forEach((key) => {
          const computedFn = pageProxy.$options.computed[key];

          if (typeof computedFn === "function") {
            boundComputed[key] = {
              get: computedFn.bind(pageProxy),
              // 如果有setter也绑定
              set: computedFn.set ? computedFn.set.bind(pageProxy) : undefined,
            };
          } else if (typeof computedFn === "object" && computedFn.get) {
            boundComputed[key] = {
              get: computedFn.get.bind(pageProxy),
              set: computedFn.set ? computedFn.set.bind(pageProxy) : undefined,
            };
          }
        });
        sharedContext = {
          $data: pageProxy.$data,
          $props: pageProxy.$props,
          $computed: boundComputed,
          $methods: boundMethods,
        };
      }
      this.component = {
        data: () => ({ injectData: this.injectData, ...sharedContext.$data }),
        computed: {
          ...sharedContext.$computed,
        },
        methods: {
          ...sharedContext.$methods,
        },
        render: res.render,
        staticRenderFns: res.staticRenderFns,
      };
      // 增加渲染key以强制更新
      this.renderKey = dsf.uuid();
    },
    setupDataWatcher() {
      const pageProxy = this.$page && this.$page.$parent;
      if (!pageProxy) return;

      // 清除之前的观察者
      if (this.pageProxyWatcher) {
        this.pageProxyWatcher();
      }

      // 观察pageProxy的$data变化
      this.pageProxyWatcher = this.$watch(
        function () {
          // 观察所有数据变化
          return pageProxy.$data;
        },
        () => {
          console.log("render");
          // 数据变化时重新渲染
          this.render();
        },
        { deep: true }
      );
    },
  },
});
</script>
