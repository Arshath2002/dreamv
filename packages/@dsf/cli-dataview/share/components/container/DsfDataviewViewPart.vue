<!--
 * @Editor: zhanghang
 * @Description: 内嵌视图
 * @Date: 2024-11-04 14:37:48
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-02-27 11:19:01
-->
<template>
  <div v-if="!isDesign" class="data-view-item-wrap dsf-dv-view-part ds-control data-view-no-padding" :class="getCss" :path="getPath()" :style="controlStyle">
    <component
      :is="componentName"
      v-if="componentName"
      ref="view"
      :name-space="nameSpace"
      :page-name="pageName"
      :local-params="localParams"
      :query-string="params"
      v-bind="getProps"
      :page-props="$pageProps"
      v-on="$listeners"
      @created="viewCreated"
      @ready="viewReady"
      @yes="yes"
    ></component>
  </div>
  <div v-else class="data-view-item-wrap dsf-dv-view-part ds-control data-view-no-padding" :class="getCss" :style="controlStyle">
    <div class="ds-dv-view-part-designer-panel">
      <span>{{ path }}内嵌视图</span>
    </div>
  </div>
</template>
<script>
import defaultBackground from "_dataview/share/components/common/backgroundDefault.js";
export default dsf.component({
  name: "DsfDataviewViewPart",
  ctrlCaption: "内嵌视图",
  mixins: [$mixins.dataView],
  inheritAttrs: false,
  provide() {
    return {
      $frame: this,
    };
  },
  props: {
    //存在事件依赖
    hasEventRelative: {
      type: Boolean,
      default: true,
    },
    controlBackgroundConfig: {
      type: Object,
      default: () => defaultBackground,
    },
    hasExtJs: {
      type: Boolean,
      default: true,
    },
    path: {
      type: String,
      default: "",
    },
    showModel: {
      type: String,
      default: "full",
    },
    forceUpdate: {
      type: Boolean,
      default: true,
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
    syncSave: {
      type: Boolean,
      default: false,
    },
    //独立页面，表单保存时不会将参数提交到弹出框或者窗体的url中
    independent: {
      type: Boolean,
      default: false,
    },
    setProps: {
      type: Function,
      default: null,
    },
    isOpenDialog: {
      type: Boolean,
      default: false,
    },
    isBlockControl: {
      type: Boolean,
      default: true,
    },
    pageProps: {
      type: Object,
      default() {
        return {};
      },
    },
    needInheritParams: {
      // 继承父级页面参数
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      componentName: "",
      nameSpace: "",
      pageName: "",
      params: {},
      localParams: {},
      isFormSave: false,
      watchPath: null,
      htmlAttrs: {},
      componentType: "viewPart",
    };
  },
  created() {
    if (this.$vm && this.$vm.frames) {
      this.$vm.frames[this.caption] = this;
    }
    if (this.$dialog && this.isOpenDialog) {
      this.$dialog.currentView = this;
    }
    //监听路径是否发生变化
    this.watchPath = this.$watch(
      function () {
        return this.getPath();
      },
      {
        handler(v, ov) {
          if (v != ov) {
            this.mappingComponent(v);
          }
        },
        immediate: true,
      }
    );
  },
  computed: {
    controlStyle() {
      let { controlBackgroundConfig } = this;
      let background = this.dvBackgroundFormat(controlBackgroundConfig);
      return { ...background, ...this.getBoxShadowConfig(false) };
    },
    getProps() {
      return !this.setProps ? this.htmlAttrs : this.setProps() || {};
    },
    getCss() {
      return [...this.$getClass(), this.shadow ? "shadow" : "", this.showModel == "full" ? "full" : ""];
    },
    $pageProps() {
      let props = dsf.mix(
        {
          fit: this.showModel == "full",
        },
        this.pageProps || {}
      );
      return props;
    },
  },
  updated() {
    if (this.isDesign) {
      this.$dispatch("design-height-change", this.showModel == "full" ? "100%" : "auto");
    }
  },
  beforeDestroy() {
    if (this.$vm && this.$vm.frames) {
      this.$vm.frames[this.caption] = null;
      delete this.$vm.frames[this.caption];
    }
    if (this.$dialog && this.isOpenDialog) {
      this.$dialog.currentView = null;
    }
    this.watchPath && this.watchPath();
  },
  methods: {
    viewCreated(vm) {
      this.$dispatch("view-created", {
        viewPart: this,
        view: vm,
      });
      this.$emit("created");
    },
    viewReady() {
      this.$dispatch("ready", this);
      if (this.$vm) {
        this.$vm.$emit(this.caption.toLowerCase() + "-ready", this);
      }
    },
    getNameSpacePath(path) {
      return (path || "").replace(/^((\#\/)?pc\/|\/pc\/)/g, "");
    },
    pathChange(path) {
      // 解决没有写pc或者mobile前缀的数据
      if (path.startsWith("#/")) {
        if (!path.startsWith("#/pc/") && !path.startsWith("#/mobile/")) {
          path = "#/pc/" + url.slice(2);
        }
        this.$emit("update:path", path);
      }
    },
    getPath() {
      if (this.path) {
        let path2 = this.getNameSpacePath(this.path);
        // path2 = path2.replace(/^((\#\/)?pc\/|\/pc\/)/g, "");
        let urlInfo = dsf.url.parse(path2);
        let url = urlInfo.href.replace(urlInfo.search, "");
        let query = [];
        for (let k in urlInfo.searchQuery) {
          query.push(k + "=" + urlInfo.searchQuery[k]);
        }
        if (dsf.isUnDef(urlInfo.searchQuery.isview)) {
          if (this.readOnly) {
            query.push("isview=1");
          }
        }
        url += query.length > 0 ? "?" + query.join("&") : "";
        return this.$replace(url);
      }
      return "";
    },
    reset() {
      this.$refs?.view?.reset?.();
    },
    reloadData() {
      this.$refs?.view?.reloadData?.();
    },
    analysisUrl() {
      let currPath = this.getNameSpacePath(this.path);
      // currPath = currPath.replace(/^(\#\/pc\/|\/pc\/)/g, "");
      let paramsStart = currPath.indexOf("?");
      var arr = [currPath.substr(0, paramsStart < 0 ? currPath.length : paramsStart), paramsStart < 0 ? "" : currPath.substr(paramsStart + 1)];
      var path = arr[0];
      path = path.startsWith("/") ? path.substr(1) : path;
      var params = arr[1];
      let pathArr = path.split("/");
      let ns = path.replace(/\//g, ".");
      let nameSpace = pathArr.slice(0, pathArr.length - 1).join(".");
      let pageName = pathArr[pathArr.length - 1];
      let parseResult = dsf.url.queryStringParse(params);
      //动态替换表达式
      let localParams = {};
      _.each(parseResult, (param, i) => {
        localParams[i] = this.$replace(param);
      });
      let parentViewParams = this.getParentParams();
      let mergeParams = {};
      if (this.needInheritParams) {
        // 继承父级页面
        if (this.isOpenDialog || this.independent) {
          //id参数为表单特殊参数在弹出层时不会默认继承给子页面
          mergeParams = dsf.mix({}, this.$route?.query, parentViewParams, { id: null }, localParams);
        } else {
          mergeParams = dsf.mix({}, this.$route?.query, parentViewParams, localParams);
        }
        if (this.readOnly) {
          mergeParams.isview = "1";
        }
        //如果id为null或者undefined清除id参数
        if (dsf.isUnDef(mergeParams.id)) {
          delete mergeParams.id;
        }
      } else {
        mergeParams = localParams;
      }
      this.localParams = localParams;
      return {
        ns: ns,
        nameSpace: nameSpace,
        pageName: pageName,
        params: mergeParams,
        localParams: localParams,
      };
    },
    urlChange(v, isFormSave) {
      let queryString = dsf.url.queryStringStringify(v.query || {});
      let newPath = v.nameSpace.replace(".", "/") + "/" + v.pageName + (queryString ? "?" + queryString : "");
      this.isFormSave = isFormSave;
      this.$emit("update:path", newPath);
    },
    async yes() {
      let result = await this.$refs.view.yes();
      this.$emit("yes", result);
      return result;
    },
    checkRemoteModule() {
      let currPath = this.getNameSpacePath(this.path);
      return dsf.init.checkRemotingModule("/pc/" + currPath);
    },
    mappingComponent(v, cache) {
      if (v && !this.isDesign) {
        let urlInfo = this.analysisUrl();
        let ns = urlInfo.ns;
        this.nameSpace = urlInfo.nameSpace;
        this.pageName = urlInfo.pageName;
        this.params = urlInfo.params;
        let proxyRule = this.checkRemoteModule();
        dsf
          .dynamicComponent({
            namespace: ns,
            client: "pc",
            cache,
            hasExtJs: this.hasExtJs,
            proxyRule,
          })
          .then((result) => {
            if (this.componentName == result.name) {
              if (this.forceUpdate) {
                this.componentName = "";
                this.$nextTick(() => {
                  this.componentName = result.name;
                });
              } else {
                this.updateChildrenViewsParams();
                if (!this.isFormSave) {
                  this.reset();
                  this.reloadData();
                }
              }
            } else {
              this.componentName = "";
              this.$nextTick(() => {
                this.componentName = result.name;
              });
            }
          })
          .catch((error) => {
            dsf.error(error);
            dsf.layer.pc.message("无法加载组件", false);
          })
          .finally(() => {
            this.isFormSave && (this.isFormSave = false);
          });
      }
    },
    getParentParams() {
      if (this?.$vm?.$frame) {
        return this.$vm.$frame.params;
      }
      return {};
    },
    updateChildrenViewsParams() {
      _.each(this.$children || [], (it) => {
        dsf.deepForEach(
          it,
          function (c) {
            if (c.$options._componentTag == "DsfDataviewViewPart") {
              let urlinfo = c.analysisUrl();
              c.params = urlinfo.params;
              c.localParams = urlinfo.localParams;
            }
          },
          {
            children: "$children",
          }
        );
      });
    },
    updateView() {
      this.componentName = "";
      this.$nextTick(() => {
        let urlInfo = this.analysisUrl();
        let ns = urlInfo.ns;
        dsf.dynamicComponent.remove("pc", ns);
        this.$nextTick(() => {
          this.mappingComponent(this.getPath(), false);
        });
      });
    },
  },
  watch: {
    "$route.query"(to, from) {
      let urlInfo = this.analysisUrl();
      this.params = urlInfo.params;
    },
    $attrs: {
      handler(v, ov) {
        if (!dsf.isEqualObject(v, ov)) {
          this.htmlAttrs = v;
        }
      },
      immediate: true,
    },
  },
});
</script>

<style lang="scss">
@import "_dataview/assets/styles/share/components/viewPart.scss";
</style>
