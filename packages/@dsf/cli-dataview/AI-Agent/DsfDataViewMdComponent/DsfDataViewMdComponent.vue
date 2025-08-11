<!--
 * @Editor: zhanghang
 * @Description: 
 * @Date: 2025-03-25 10:01:26
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-07-21 13:56:32
-->
<template>
  <div class="dsf-dv-md-component" :class="{ 'has-title': originOptions && originOptions.title }">
    <!-- 控制栏 -->
    <div class="ds-control-bar">
      <template v-if="componentGroups && componentGroups.length && originOptions">
        <el-select class="ds-change-select" size="mini" :popper-append-to-body="true" v-model="originOptions.component" placeholder="请选择" @change="changeGraph">
          <el-option v-for="item in componentGroups" :key="item.value" :label="item.name" :value="item.value"></el-option>
        </el-select>
      </template>
      <DsfIagentTipIconButton class="tools-bt ds-desinger-drag-component" title="拖拽" icon="dsf-icon-yidong" :hasBg="false" @mousedown.stop />
      <DsfIagentTipIconButton class="tools-bt" title="下载" icon="iagent-icon-xia" :hasBg="false" @click="downloadImage" />
    </div>
    <!-- 标题 -->
    <div class="ds-title-bar" v-if="displayTitle">{{ displayTitle }}</div>

    <component
      v-if="componentProps"
      @changeTitle="changeTitle"
      :style="background"
      :key="componentKey"
      v-onresize="onResize"
      :is="attrs.component"
      v-bind.sync="componentProps"
      :modelArgs="dsf.mix(true, { recommend, styleTheme }, attrs)"
      ref="comp"
    />
  </div>
</template>

<script>
import dataviewStyle from "_dataview/output/dataviewStyle/index.js";
import { componentMap } from "./common.js";
export default {
  name: "DsfDataViewMdComponent",
  inject: ["$designer"],
  props: {
    styleTheme: {
      type: String,
      default: "lanbai",
    },
    options: {
      type: Object,
      require: true,
    },
  },
  computed: {
    componentGroups() {
      const options = this.options;
      if (!options || dsf.isEmptyObject(options)) return [];
      const comp = options.component;
      const groups = [
        {
          DsfDataViewRankProgress: "排名",
          DsfDataViewScrollRankingBoard: "胶囊图",
          DsfDataViewIconRate: "图标排名",

          DsfDataViewBar: "柱状图",
          DsfDataViewStackedBar: "堆叠柱图",
          DsfDataViewHorizontalBar: "条形图",
          DsfDataViewStackHorizontalBar: "堆叠条形图",
          DsfDataViewBar3d: "3d柱状图",
          DsfDataViewPolyline: "折线图",
          DsfDataViewPie: "饼状图",
          DsfDataViewCirclePie: "饼环图",
          DsfDataViewPie3d: "3d饼状图",
          DsfDataViewMultiRing: "多环图",
          DsfDataViewFunnel: "漏斗图",
          DsfDataViewThreePyramid: "金字塔图",

          DsfDataViewPictorialBar: "象形图",
          DsfDataViewBusinessHotWord: "热词气泡图",
          DsfDataViewWordCloud: "词云图",
          DsfDataViewLargeTable: "表格",
          DsfDataViewBusinessKeyTrades: "数据看板",
          DsfDataViewRadar: "雷达图",
          DsfDataViewScatter: "散点图",
        },
        // 地图组件
        {
          DsfDataViewThreeMap: "三维地图",
          DsfDataViewBaseMap: "二维地图",
        },
        // gis 组件
        {
          DsfDataViewGis: "gis地图",
        },
      ];

      const index = groups.findIndex((it) => it[comp]);
      if (index > -1) {
        return Object.entries(groups[index]).map(([value, name]) => {
          return { name, value };
        });
      } else {
        return [];
      }
    },
    // component:组件名称, modelArgs：模型参数: describe 描述对象 data 数据数组
    attrs() {
      let options = this.originOptions;

      if (!options) return null;
      const component = options.component;
      // 如果组件不存在则查找映射列表
      if (componentMap.has(component)) {
        const { actual, extra = {} } = componentMap.get(component);
        options = dsf.mix(true, {}, options, { ...extra, component: actual });
      } else if (!window.$components.dataview[component]) {
        options.component = "";
      }

      return options;
    },
    background() {
      try {
        if (this.$designer && this.$designer.getTheme) {
          const theme = this.$designer.getTheme();
          const backgroundConfig = theme.style.dataviewPage.backgroundConfig;
          return { "background-color": backgroundConfig.color.value };
        }
      } catch (error) {
        console.warn(`error:${error}`);
      }
      return {};
    },
    displayTitle() {
      return this.title ? this.title : this.originOptions ? this.originOptions.title : "";
    },
  },
  data() {
    return {
      recommend: true, // 控制第一次才生成推荐数据看板
      componentKey: 0,
      hasChangeGraph: false,
      title: "",
      originOptions: null,
      componentProps: null,
    };
  },
  created() {
    this.originOptions = this.options;
  },
  mounted() {
    this.initDrag();
    const compKey = this.$el.getAttribute("comp-key");
    this.getDefaultProps().then((componentProps) => {
      this.componentProps = componentProps;
      // 坐标系图表类目轴缩放
      const hasDataZoom = componentProps.dataZoom != void 0 && this.attrs.data && this.attrs.data.length > 10;
      if (hasDataZoom) {
        componentProps.dataZoom = true;
      }
      if (compKey != undefined) {
        this.componentProps.compKey = compKey;
      }
    });
  },

  methods: {
    /**
     * 改变页面主题
     */
    changTheme(themeName) {
      this.setCompStyle(themeName);
      const comp = this.$refs.comp;
      setTimeout(() => {
        comp && dsf.emit.$emit("aiModelData", { el: comp.$el, modelArgs: this.attrs });
      }, 1500);
    },

    /**
     * 设置组件风格
     */
    setCompStyle(themeName) {
      const theme = this.getTheme(themeName);
      const comp = this.$refs.comp;
      comp && comp.handlerCurrentStyleConfig && comp.handlerCurrentStyleConfig(theme);
    },
    getTheme(themeName) {
      const styles = dataviewStyle;
      const theme = styles.find((it) => it.value === themeName);
      return theme;
    },
    onResize() {
      this.$refs.comp && this.$refs.comp.resize && this.$refs.comp.resize();
    },
    changeTitle(title) {
      if (this.hasChangeGraph) {
        this.title = title;
      }
    },
    downloadImage() {
      this.loadCanvas().then(() => {
        const el = this.$refs.comp.$el;
        if (!el) return false;
        html2canvas(el, {
          useCORS: true,
          allowTaint: true,
        }).then((canvas) => {
          const a = document.createElement("a");
          a.href = canvas.toDataURL("image/jpeg").replace("image/jpeg", "image/octet-stream");
          a.download = `${dsf.uuid()}.jpg`;
          a.click();
        });
      });
    },
    loadCanvas() {
      return new Promise((resolve, reject) => {
        if (window.html2canvas) {
          resolve();
        } else {
          dsf.dataview.utils.importFiles(
            [this.$getWebPath("static/js/libs/html2canvas/html2canvas_dv.js", __DSF_DATAVIEW_PATH__)],
            () => resolve(),
            () => reject(dsf.layer.message("加载html2canvas文件报错", false))
          );
        }
      });
    },
    changeGraph() {
      this.title = "";
      this.recommend = false;
      this.hasChangeGraph = true;

      this.componentKey++;
      this.componentProps = null;
      // 清除展开类名
      this.$el.closest(".dsf-iagant-vue-comp")?.classList.remove("__expand");
      this.getDefaultProps().then((componentProps) => {
        this.componentProps = componentProps;
      });
    },
    getDefaultProps() {
      return new Promise((resolve) => {
        if (this.attrs && this.attrs.component) {
          const code = getCtrlCodeByName(this.attrs.component);
          const asyncCom = dsf.checkAsyncComponent(code);
          if (asyncCom) {
            //异步组件则请求相关属性
            dsf.requestAsyncComponents(asyncCom).then(() => {
              const componentProps = dsf.createComponent(code);
              resolve(componentProps);
            });
          } else {
            const componentProps = dsf.createComponent(code);
            resolve(componentProps);
          }
        }
      });
    },
    initDrag() {
      if (!this.$designer) return;
      const chatBox = document.querySelector(".dsf-dv-ai-chat");
      $(this.$el)
        .find(".ds-desinger-drag-component")
        .draggable({
          addClasses: false,
          appendTo: this.$designer.$el,
          distance: 10,
          revert: "invalid",
          cursor: "move",
          containment: "window",
          cursorAt: {
            left: -20,
            top: -20,
          },
          helper: (evt) => {
            const child = this.$refs.comp;
            let source = $(evt.currentTarget);
            let attrs = {
              type: "control",
              isModelDrag: true,
              data: {
                code: child.ctrlType,
                props: {
                  modelArgs: dsf.mix(true, {}, this.attrs),
                },
              },
            };
            let proxy = source.clone();
            proxy.addClass("proxy");
            proxy.data("data", {
              state: "add",
              attributes: attrs,
            });
            return proxy;
          },
          start: (evt) => {
            chatBox.classList.add("is-dragging");
            this.$designer.dragProxy.style = {};
            $(this.$designer.$el).addClass("designer-dragging");
            try {
              dsf.designer.broadcast(this.$designer, "clearMouseDownHandler", evt, null);
            } catch (ex) {
              //todo
            }
          },
          stop: () => {
            chatBox.classList.remove("is-dragging");
            try {
              this.$designer.dragProxy.show = false;
              this.$designer.dragProxy.class = "";
              this.$designer.dragProxy.style = {};
              this.$nextTick(() => {
                $(this.$designer.dragProxy_el).appendTo(this.$designer.$el);
              });
            } catch (ex) {
              //todo
            } finally {
              $(this.$designer.$el).removeClass("designer-dragging");
            }
          },
        });
    },
  },
};
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
@import "./DsfDataViewMdComponent.scss";
</style>
