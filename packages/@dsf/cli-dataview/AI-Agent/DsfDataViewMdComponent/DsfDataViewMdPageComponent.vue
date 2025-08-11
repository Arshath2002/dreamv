<template>
  <div class="dsf-dv-md-page-component">
    <div class="_warp">
      <div class="__warp" ref="__warp" v-onresize="onResize" :style="scaleStyle">
        <RenderTree v-if="page" ref="viewProxy" :style="pageRectStyle" :component-props.sync="page"></RenderTree>
      </div>
    </div>
    <div class="opera-btn">
      <div class="btn" @click="preview"><DsfIcon name="ln_jiantouyou" />预览</div>
      <div class="select">
        <span class="btn">主题</span>
        <el-select :popper-append-to-body="false" size="mini" v-model="pageTheme">
          <el-option v-for="item in themeList" :key="item.value" :label="item.text" :value="item.value"> </el-option>
        </el-select>
      </div>
      <div class="btn" v-if="!isDataViewDesigner" @click="saveIAgentLayout"><DsfIcon name="add1" />新建项目</div>
      <div class="btn" v-if="isDataViewDesigner" @click="applyTemplate"><DsfIcon name="add1" />应用模板</div>
    </div>
  </div>
</template>
<script>
import RenderTree from "./RenderTree.vue";
import { componentMap } from "./common.js";
export default dsf.component({
  name: "DsfDataViewMdPageComponent",
  components: { RenderTree },
  inject: ["$designer"],
  ctrlCaption: "大屏AI看板",
  mixins: [$mixins.smartCard],
  data() {
    return {
      themeList: dsf.dataview.selectThemes,
      pageTheme: "",
      page: null,
      width: 0,
      height: 0,
      scale: 1,
      designerNode: {
        metadataGroup: {},
        controlGroup: {},
        businessControlGroup: {},
        fromTemplateId: "",
      },
    };
  },
  created() {
    this.getLayout();
  },
  computed: {
    isDataViewDesigner() {
      return this.$designer && this.$designer.page && this.$designer.page.ctrlName === "DsfDataViewPage";
    },
    options() {
      return this.layout;
    },
    layout() {
      if (typeof this.local.options.layout === "string") {
        let result = {};
        
        this.local.options.layout.replace(/(```json|json)[\s\S]*?(```)/gm, function (value) {
          value = value
            .replace(/^```\s*json|^\s*json/, "")
            .replace(/```/, "")
            .replace(/\\n/gm, "")
            .replace(/\\/gm, "")
            .replace(/\/\/.*/g, "");

          result = dsf.eval(value);
        });
        return result;
      }
      return this.local.options.layout || {};
    },
    // 模板id
    templateId() {
      return this.options.templateId;
    },
    // 组件
    modules() {
      return (this.options && this.options.modules) || [];
    },

    pageTitle() {
      return (this.options && this.options.pageName) || "";
    },

    pageRectStyle() {
      const { width, height } = this;
      return {
        width: `${width}px`,
        height: `${height}px`,
      };
    },
    scaleStyle() {
      const { scale, height } = this;
      return {
        height: `${scale * height}px`,
        transform: `scale(${scale})`,
      };
    },
  },
  watch: {
    pageTheme(v) {
      if (!v || !this.page || !this.$refs.viewProxy) return false;
      const styleTheme = v;
      import(/* webpackChunkName: "dataview_theme",webpackMode: "lazy" */ "_dataview/output/dataviewStyle/index.js").then((res) => {
        const styles = res.default.concat(dsf.dataview.extendStyle);
        const theme = styles.find((it) => it.value === styleTheme);
        theme && this.$refs.viewProxy.$children[0].changePageStyle(styleTheme, theme);
      });
    },
  },
  methods: {
    /**
     * 应用模板
     */
    applyTemplate() {
      // 暂时更新这几个属性
      const updateProps = ["theme", "designActive", "designerRatio", "fitType", "hasDataViewHead", "popupConfig", "dialogConfig", "layout", "compositionLayouts", "slots", "backgroundConfig"];
      updateProps.forEach((prop) => {
        const designerPage = this.$designer.page;
        const page = this.page;
        designerPage[prop] = _.cloneDeep(page[prop]);
      });
    },

    /**
     * 获取空模板布局数据
     */
    async getLayout() {
      const code = this.templateId;
      const path = code.split(".");
      const b = path.shift();
      const pn = path.pop();
      const m = path.join(".");

      const folder = [b, m].join(".");

      const clientDirs = `pc/temp`;

      let proxyPath = "/dataview/";
      let htmlPath = `${proxyPath}${clientDirs}/${folder}/${pn}.layout.html`;

      let res = await this.$http.get(htmlPath, null, { responseType: "text", cache: false });

      res = await dsf.designer.analysisLayoutInfo(res);
      const layout = dsf.fillComponentDefaultProps(res.layout);

      // 设置保存designerNode内容
      const { metadataGroup, controlGroup, businessControlGroup } = res.designer;
      this.designerNode.metadataGroup = metadataGroup;
      this.designerNode.controlGroup = controlGroup;
      this.designerNode.businessControlGroup = businessControlGroup;
      this.designerNode.fromTemplateId = code;

      const page = layout.ctrlType;

      const asyncCom = dsf.checkAsyncComponent(page);
      if (asyncCom) {
        //异步组件则请求相关属性
        await dsf.requestAsyncComponents(asyncCom);
      }

      const instance = dsf.createComponent(page, { designProxy: true, ...layout });

      const designActive = instance.designActive;
      const layouts = instance.layout[0].layout[designActive];

      const slotsNames = layouts.map((it) => `area-${it.i}-1`);
      const slots = instance.slots.filter((it) => slotsNames.includes(it.name));

      let controls = slots.map((it) => it.controls[0]);
      // 地图插槽
      const map = controls.find((it) => it.title === "地图模块");
      let modules = [...this.modules];
      // 地图组件
      const mapIndex = modules.findIndex((it) => it.component === "DsfDataViewThreeMap");
      // gis 组件
      const gisIndex = modules.findIndex((it) => it.component === "DsfDataViewGis");

      let hasMap = false;

      let hasGis = false;

      if (map && ~mapIndex) {
        hasMap = true;
        this.createComponent(map, modules[mapIndex]);
      } else if (map && ~gisIndex) {
        hasGis = true;
        this.createComponent(map, modules[gisIndex]);
      }
      // 如果存在map
      if (hasMap) {
        controls = controls.filter((it) => it.title != "地图模块");
        modules.splice(mapIndex, 1);
      } else if (hasGis) {
        controls = controls.filter((it) => it.title != "地图模块");
        modules.splice(gisIndex, 1);
      }
      for (let i = 0; i < controls.length; i++) {
        const panel = controls[i];
        modules[i] && this.createComponent(panel, modules[i]);
      }

      const { width, height } = instance.designerRatio;
      this.width = width;
      this.height = height;
      instance.isModel = true;
      instance.designId = dsf.uuid();

      this.pageTheme = instance.theme;

      this.width = width;
      this.height = height;

      instance.slots[1].controls[0].title = this.pageTitle;

      this.page = instance;

      this.calculateScale();
    },
    async createComponent(panel, it) {
      let comp = dsf.mix(true, {}, it);
      const { component, title } = comp;
      // 如果组件不存在则查找映射列表
      if (componentMap.has(component)) {
        const { actual, extra = {} } = componentMap.get(component);
        comp = dsf.mix(true, {}, comp, { ...extra, component: actual });
      } else if (!window.$components.dataview[component]) {
        comp.component = "";
      }
      if (!comp.component) {
        return false;
      }

      const code = getCtrlCodeByName(comp.component);
      const asyncCom = dsf.checkAsyncComponent(code);
      await dsf.requestAsyncComponents(asyncCom);
      const props = dsf.createComponent(code, { designProxy: true });
      dsf.mix(true, props, { modelArgs: dsf.mix(true, {}, comp) });

      if (!props.caption) {
        const arr = props.ctrlType.split(".");
        props.caption = arr[arr.length - 1].toLowerCase() + dsf.uuid(6);
      }

      panel.slots[0].controls = [props];
      panel.title = title;
    },

    /**
     *保存页面布局，打开设计器--页面生成位置写死的
     */
    async saveIAgentLayout() {
      const aiChatEl = $(this.$el).closest(".dsf-iagent.dsf-iagent-ai-chat")[0];
      // 当前会话id
      let currentChatId = "";
      // 当前智能体
      let agentCode = "";
      if (aiChatEl) {
        const aiChat = aiChatEl.__vue__;
        const chatBox = aiChat.$refs.chatBox;
        currentChatId = chatBox.currentChatId;
        agentCode = chatBox.agentCode;
      }
      const title = this.pageTitle || dsf.uuid();
      const queryString = {
        pid: "9e302584b89e4cf9b4880e34809ebd9e",
        mark: "page",
        flag: "dataview.product.iagent",
      };
      const qs = dsf.url.queryStringStringify(queryString);
      const url = `/meta/persistData${qs ? "?" + qs : ""}`;
      const code = dsf.uuid();
      const data = {
        "dataview_rm.name": title,
        "dataview_rm.type": { text: "大屏设计器 ", value: "18" },
        "dataview_rm.code": code,
        "dataview_rm.flag": `dataview.product.iagent.${code}`,
        "dataview_rm.path": `dataview/product/iagent/${code}`,
        "dataview_rm.ds_order": "0",
        "dataview_rm.treeinfo": { pid: "9e302584b89e4cf9b4880e34809ebd9e", icon: "" },
      };
      const params = {
        namespace: "dataview.rm",
        pageName: "edit",
        data: JSON.stringify(data),
        attach: "",
      };
      const res = await this.$http.post(url, params, $$webRoot.dataview);

      if (res.data && res.data.success) {
        const data = res.data.data;
        const path = data["dataview_rm.path"];
        const arr = path.split("/");
        const B = arr.shift();
        const pageName = arr.pop();
        const M = arr.join(".");
        const post = this.getPostData(B, M, pageName, title);
        await this.$webAPI.pageBuild(post, {}, $$webRoot.platform);
        await this.$webAPI.pageBuildToFile({ ...post, serviceCode: "dataview" }, {}, "/dataview/");
        this.$openWindow(
          true,
          "./designer.html#/dataViewDesign?B=" +
            B +
            "&M=" +
            M +
            "&pname=" +
            pageName +
            "&title=" +
            data["dataview_rm.name"] +
            "&templateType=1&agentCode=" +
            agentCode +
            "&currentChatId=" +
            currentChatId
        );
      }
    },

    /**
     * 预览页面
     */
    preview() {
      try {
        const page = { ...this.page, isModel: false };
        this.$nextTick().then(() => {
          let x = "/";
          let layoutStr = `<script type="text/template" id="layout">\n${dsf.designer.controlToJson(page)}\n<${x}script>`;
          window.$previewStr = layoutStr;
          dsf.layer.pc.openWindow(true, "./designer.html#" + "/pc/preview");
        });
      } catch (ex) {
        let message = "出现了未知的错误";
        if (dsf.type(ex) == "string") {
          message = ex;
        } else {
          dsf.error(ex);
        }
        dsf.layer.pc.message(message, false);
      }
    },

    /**
     * 生成大屏数据
     */
    getPostData(B, M, pageName, pageTitle) {
      const namespace = B + "." + M;
      const page = { ...this.page, isModel: false };

      page.name = pageName;
      page.title = pageTitle;
      page.customServer = false;
      page.context = {
        B,
        M,
      };

      let path = [B, M, pageName];

      const md = {
        variableExpress: null,
        path: path.join("/").replaceAll(".", "/"),
        nameSpace: path.join("."),
        customServer: page.customServer || void 0,
        accessRole: page.dataAccessRole || [],
        isForm: false,
        needLogin: page.needLogin,
        pageState: page.pageType,
        mode: page.mode,
        xssConfig: page.xssConfig,
        init: { privilege: page.pagePrivilege || [] },
        query: {},
        export: {},
        browseScope: {},
        metadata: {},
        isMobile: false,
        attach: {},
        isEs: page.isEs || false,
        esIndexName: page.isEs ? page.esIndexName || null : undefined,
        conditionExp: {},
      };
      const designerNode = this.designerNode;
      const { fromTemplateId } = this.designerNode;
      const extJsCode = dsf.extDefaultCode;

      const x = "/";
      // 提交信息
      const post = {
        isMobile: false,
        md: JSON.stringify(md),
        stateSetting: "[]",
        layout: [
          `<script type="text/template" id="layout">\n${dsf.designer.controlToJson(page, (k, v) => {
            return k == "$isNew" ? undefined : v;
          })}\n<${x}script>`,
          `<script type="text/template" id="css">\n\n<${x}script>`,
          `<script type="text/template" id="scss">\n\n<${x}script>`,
          `<script type="text/template" id="showLogic">\n{}\n<${x}script>`,
          `<script type="text/template" id="showLogicCompile">\n\n<${x}script>`,
          `<script type="text/template" id="designer">\n${JSON.stringify(designerNode)}\n<${x}script>`,
          `<script type="text/template" id="staticValue">\n{}\n<${x}script>`,
          `<script type="text/template" id="doc">\n\n<${x}script>`,
          `<script type="text/template" id="metadatedict">\n\n<${x}script>`,
        ].join("\n"),
        extJsCode,
        templateid: fromTemplateId,
        pageName,
        namespace,
        pageTitle,
      };
      return post;
    },
    onResize() {
      this.calculateScale();
    },
    calculateScale() {
      if (!this.$refs.__warp) return false;
      const { width } = this;
      const clientWidth = this.$refs.__warp.clientWidth;
      const scale = clientWidth / width;
      this.scale = scale;
    },
  },
});
const componentNameRE = /^(Dsf)(Mobile)?(\w+)/g;
function getCtrlCodeByName(name) {
  componentNameRE.lastIndex = 0;
  let code = componentNameRE.exec(name);
  let arr = [];
  if (code && code.length > 0) {
    for (let i = 1; i < code.length; i++) {
      if (code[i]) {
        arr.push(code[i].toLowerCase());
      }
    }
  }
  return arr.join(".");
}
</script>
<style lang="scss">
@import "./DsfDataViewMdPageComponent.scss";
</style>
