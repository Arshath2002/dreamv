<template>
  <div class="ds-control ds-viewpart ds-no-padding" :class="getCss" :path="getPath()">
    <component
      :is="componentName"
      v-if="componentName"
      ref="view"
      :name-space="nameSpace"
      :page-name="pageName"
      :local-params="localParams"
      :query-string="params"
      :page-props="{
        gisVm,
      }"
      @ready="viewReady"
    ></component>
  </div>
</template>
<script>
export default dsf.component({
  inheritAttrs: false,
  name: "DsfGisViewPart",
  ctrlCaption: "Gis页面视图",
  mixins: [$mixins.control],
  provide() {
    return {
      $frame: this,
    };
  },
  props: {
    path: {
      type: String,
      default: "",
    },
    //GIS组件实例
    gisVm: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      componentName: "",
      nameSpace: "",
      pageName: "",
      params: {},
      localParams: {},
      watchPath: null,
    };
  },
  created() {
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
    getCss() {
      return [...this.$getClass()];
    },
  },
  beforeDestroy() {
    if (this.$dialog && this.isOpenDialog) {
      this.$dialog.currentView = null;
    }
    this.watchPath && this.watchPath();
  },
  methods: {
    //页面加载完成
    viewReady() {
      this.$dispatch("ready", this);
    },
    updatePath(path) {
      this.$emit("update:path", path);
    },
    getNameSpacePath(path) {
      return (path || "").replace(/^((\#\/)?pc\/|\/pc\/)/g, "");
    },
    getPath() {
      if (this.path) {
        let path2 = this.getNameSpacePath(this.path);
        let urlInfo = dsf.url.parse(path2);
        let url = urlInfo.href.replace(urlInfo.search, "");
        let query = [];
        for (let k in urlInfo.searchQuery) {
          query.push(k + "=" + urlInfo.searchQuery[k]);
        }
        url += query.length > 0 ? "?" + query.join("&") : "";
        return this.$replace(url);
      }
      return "";
    },

    analysisUrl() {
      let currPath = this.getNameSpacePath(this.path);
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
      this.localParams = localParams;
      return {
        ns: ns,
        nameSpace: nameSpace,
        pageName: pageName,
        params: localParams,
        localParams: localParams,
      };
    },
    checkRemoteModule() {
      let currPath = this.getNameSpacePath(this.path);
      return dsf.init.checkRemotingModule("/pc/" + currPath);
    },
    //路径映射组件
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
            this.componentName = "";
            this.$nextTick(() => {
              this.componentName = result.name;
            });
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
    //更新页面路径
    updateView() {
      this.componentName = "";
      this.$nextTick(() => {
        let urlInfo = this.analysisUrl();
        let ns = urlInfo.ns;
        dsf.dynamicComponent.remove("pc", ns);
        this.$nextTick(() => {
          this.mappingComponent(this.getPath(), true);
        });
      });
    },
  },
});
</script>
