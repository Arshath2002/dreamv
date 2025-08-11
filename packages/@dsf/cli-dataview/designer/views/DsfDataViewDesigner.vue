<!--
 * @Description: 设计器
 * @Author: zhanghang
 * @Date: 2022-07-18 15:37:56
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-07-18 18:16:50
-->
<template>
  <DsfDVDesignerFrame
    @selectPage="selectPage"
    ref="designerPanel"
    :defaultDevice="defaultDevice"
    :mobile="deviceMobile"
    @scale-change="scaleChange"
    :disableScale="disableScale"
    @changeDrag="changeDrag"
    class="data-view-designer-frame"
    :style="themeStyle"
  >
    <template v-slot:top>
      <slot name="top">
        <div class="designer_tools_left">
          <div class="designer_tools_left">
            <DsfDVDesignerButtons :designer="_self" :show-button="showButton" :buttons="tpl ? templateButtons : buttons"></DsfDVDesignerButtons>
          </div>
        </div>
        <div class="designer_tools_right">
          <div class="dv-designer-btn-wrapper">
            <div class="dsf-dv-designer-btn" v-for="(button, $index) in controlButtons" :key="$index" :title="button.text" @click="button.handler($event, button)">
              <template v-if="button.id === 3">
                <el-popover
                  width="340"
                  trigger="hover"
                  placement="bottom-start"
                  popper-class="data-view-style-theme-popover"
                  v-model="popularStyleFlag"
                  @show="popularStyleFlag = true"
                  @hide="popularStyleFlag = false"
                >
                  <div slot="reference">
                    <div class="icon-box">
                      <DsfIcon :name="button.icon"></DsfIcon>
                    </div>
                    <p>{{ button.text }}</p>
                  </div>
                  <div class="data-view-style-theme-wrap">
                    <SingleMoreSelect v-model="styleTheme" :list="themeColorList" labelField="text" itemWidth="100" @change="popularStyleSwitch"></SingleMoreSelect>
                    <!-- 颜色系列 -->
                    <div class="data-view-style-color-series">
                      <div class="style-color-series-title-wrap">
                        <div class="style-color-series-title">
                          颜色系列

                          <DesDVToolTipsIcon
                            :data="{
                              desc: '点击页面空白处，可切换页面图表组件的颜色系列。选中单个组件时，切换单个图表组件颜色。',
                            }"
                          />
                        </div>
                        <div class="btn-list">
                          <el-button size="mini" type="text" @click="customColorAdd()" v-if="!customThemeStyleColorSeriesList.length">+新增</el-button>
                        </div>
                      </div>
                      <div class="style-color-series-content">
                        <div
                          class="style-color-series-content-items custom-series-content-items"
                          v-for="(item, index) in customThemeStyleColorSeriesList"
                          :key="item.id"
                          :class="{
                            active: item.id === styleColorSeries,
                          }"
                          @click="changeColorSeries(item)"
                        >
                          <div class="btn-list">
                            <i class="el-icon-edit common-icon edit" @click.stop="customColorAdd(item)"></i>
                            <i class="el-icon-close common-icon del" @click.stop="customColorDel(index)"></i>
                          </div>
                          <div class="style-color-series-content-item" :style="styleColorSeriesContentItemStyle(one)" v-for="(one, oneIndex) in item.colorList" :key="oneIndex"></div>
                        </div>
                        <div
                          class="style-color-series-content-items"
                          v-for="item in colorSeriesList"
                          :key="item.id"
                          :class="{
                            active: item.id === styleColorSeries,
                          }"
                          @click="changeColorSeries(item)"
                        >
                          <div class="style-color-series-content-item" :style="styleColorSeriesContentItemStyle(one)" v-for="(one, oneIndex) in item.colorList" :key="oneIndex"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </el-popover>
              </template>
              <template v-else-if="button.id === 4">
                <el-dropdown @command="command">
                  <div class="icon-box">
                    <DsfIcon :name="button.icon"></DsfIcon>
                  </div>
                  <p>{{ button.text }}</p>

                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="0">操作手册</el-dropdown-item>
                    <el-dropdown-item command="1">伪代码API</el-dropdown-item>
                    <el-dropdown-item disabled command="-1">当前版本：v{{ DATAVIEW_VERSION }}</el-dropdown-item>
                    <el-dropdown-item disabled command="-2">平台版本：v{{ PLATFORM_VERSION }}</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
              <template v-else-if="button.id === 5">
                <template v-if="designerTheme === 'darked'">
                  <div class="icon-box" @click="changeDesignerTheme('light')">
                    <i class="el-icon-sunny"></i>
                  </div>
                  <p>日间</p>
                </template>
                <template v-if="designerTheme === 'light'">
                  <div class="icon-box" @click="changeDesignerTheme('darked')">
                    <i class="el-icon-moon"></i>
                  </div>
                  <p>夜间</p>
                </template>
              </template>
              <template v-else>
                <div :style="{ transform: $index === 1 ? 'rotateY(180deg)' : '' }" class="icon-box">
                  <DsfIcon :name="button.icon"></DsfIcon>
                </div>
                <p>{{ button.text }}</p>
              </template>
            </div>
          </div>
        </div>
      </slot>
    </template>
    <template v-slot:nav></template>
    <!--页面主体-->
    <template>
      <div class="design-center designer-page-margin-10">
        <slot>
          <DsfLayoutTree
            v-if="page"
            ref="viewProxy"
            style="position: absolute; height: 100%; width: 100%"
            :is-design="true"
            :component-props.sync="page"
            @dragstart.native.prevent
            @mousedown.native.stop="mouseDownHanlder($event)"
            @mousemove.native="mouseMoveHanlder($event)"
            @contextmenu.native="contextMenuOpen($event)"
            @click.native="dataviewLayoutTreeClickHandler($event)"
          ></DsfLayoutTree>
        </slot>
      </div>
    </template>
    <!--左侧工具箱-->
    <template v-slot:left>
      <slot name="left">
        <div class="dv-designer-left-wrapper" v-show="!shrink">
          <div class="switch-bar">
            <div class="switch-bar-item_active">
              <template v-if="activeTools === 0">
                <DsfIcon :name="switchToolsButtons[0].icon"></DsfIcon>
                {{ switchToolsButtons[0].name }}
              </template>
              <template v-if="activeTools === 1">
                <i :class="`${switchToolsButtons[1].icon}`"></i>
                {{ switchToolsButtons[1].name }}
              </template>
            </div>
            <div class="switch-bar-item" @click="changeActiveTools">
              <template v-if="activeTools === 1">
                <i :class="`${switchToolsButtons[0].icon}`"></i>
              </template>
              <template v-if="activeTools === 0">
                <i :class="`${switchToolsButtons[1].icon}`"></i>
              </template>
            </div>
          </div>
          <dsf-data-view-designer-left-tools v-show="activeTools === 0" :layout="dataViewLayout" />
          <dsf-data-view-designer-left-outline v-show="activeTools === 1" ref="outline" />
        </div>
      </slot>
    </template>
    <!--右侧属性-->
    <template v-slot:right>
      <dsf-designer-right :class="{ 'is-shrink': shrink }">
        <!--属性-->
        <dsf-designer-right-item icon="icon-gongnengdingyi" title="属性">
          <DsfDataViewDesignerProperties :data="attributesGroup" :owner="attributesOwner" :prop-show="propShow" :key="attributesOwner._uid"></DsfDataViewDesignerProperties>
        </dsf-designer-right-item>
      </dsf-designer-right>
    </template>
    <!--附加-->
    <template v-slot:append>
      <div v-show="dragProxy.show" ref="dragProxy" class="drag-proxy" :class="[dragProxy.class]" :style="dragProxy.style" />
      <dsf-page-doc />
      <slot name="append"></slot>
    </template>
  </DsfDVDesignerFrame>
</template>
<script>
const LayoutTemplate = Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_private" */ "../setting/layoutTemplateSelect.vue"));
const CustomColorSeries = Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_private" */ "../setting/customColorSeries.vue"));
import { styleColorSeries } from "_dataview/output/dataviewStyle/config.index.js";
import SingleMoreSelect from "_dataview/share/common/components/singleMoreSelect.vue";
import DsfDataViewDesignerLeftTools from "./DsfDataViewDesignerLeftTools.vue";
import DsfDataViewDesignerLeftOutline from "./DsfDataViewDesignerLeftOutline.vue";
import DsfDataViewDesignerProperties from "../propertyEditor/dsfDataViewDesignerProperties";
import DsfDVDesignerFrame from "../common/designerFrame.vue";
import DsfDVDesignerButtons from "../common/designerButtons.vue";
import cssStyleConfig from "_dataview/output/config/cssStyleConfig.js";
import _keyboard from "./_keyboard.js";
import designerTheme from "_dataview/output/config/designerTheme.js";
import dataviewStyle from "_dataview/output/dataviewStyle/index.js";
//默认pc设备
const pcDevice = {
  name: "1k屏 (16:9)",
  width: 1920,
  height: 1080,
  divided: true,
};
// 合并图表组件数组
const mergeCtrlType = ["dsf.dataviewmixinaxis"];
export default {
  name: "DsfDataViewDesigner",
  mixins: [$platformDesigner.DsfDesigner, _keyboard],
  components: {
    DsfDataViewDesignerLeftTools,
    DsfDataViewDesignerLeftOutline,
    DsfDataViewDesignerProperties,
    SingleMoreSelect,
    DsfDVDesignerFrame,
    DsfDVDesignerButtons,
  },
  provide() {
    return {
      $designer: this,
    };
  },
  props: {
    pageComponent: {
      type: String,
      default: "dsf.dataviewpage",
    },
    defaultDevice: {
      type: Object,
      default() {
        return { ...pcDevice };
      },
    },
    addControlAfter: {
      type: Function,
      default(child, slot, parent) {
        const isDesignerAdd = child.isDesignerAdd;
        Reflect.deleteProperty(child, "isDesignerAdd");
        setTimeout(() => {
          const el = $(`div[des-id="${child.designId}"]`)[0];
          const component = el && el.__vue__;

          if (isDesignerAdd && component && component.$layoutTree) {
            dsf.designer.recursionLayoutTree(component.$layoutTree, null, null, (component) => {
              if (component.isDataViewControl) {
                const theme = this.getTheme();
                this.updateColorSeries(theme, this.styleColorSeries);

                component.$nextTick(() => {
                  component.handlerCurrentStyleConfig && component.handlerCurrentStyleConfig.call(component, theme);
                });

                // 添加样式统一如字体
                const page = this.$refs.viewProxy;
                const vm = page.$children[0];
                this.componentChangeCssStyle(
                  {
                    value: vm.pageFontFamily,
                    field: "fontFamily",
                  },
                  component
                );
              }
            });
          }
          //组件别名更新
          this.recursionComponentsSlots(child);
        });
      },
    },
  },
  computed: {
    themeStyle() {
      const styleList = designerTheme[this.designerTheme];
      return { ...styleList };
    },
    dragProxy_el() {
      return this.$refs.dragProxy;
    },

    // 基本控件组
    getUseControlsGroup() {
      const groups = this.useControlsGroup.groups;
      return this.getFilterResult(groups, "control");
    },

    // 业务控件组
    getBusinessControlGroup() {
      const groups = this.useControlsGroup.groups;
      return this.getFilterResult(groups, "business");
    },

    graphsTemplates() {
      let data = [];

      let list = _.cloneDeep(this.getBusinessControlGroup);
      list.forEach((it) => {
        if (it.title != "动态图表") {
          let item = it;
          let isChart = false;
          let items = item.items;
          item.items = null;
          let $items = [];
          items.forEach((n) => {
            try {
              let comp = n.data;
              let content = JSON.parse(comp.content);
              if (content.chart && !content.area) {
                isChart = true;
                $items.push(n);
              }
            } catch (error) {
              console.log(error);
            }
          });
          item.items = $items;
          isChart && data.push(item);
        }
      });
      return data;
    },
  },
  data() {
    return {
      dragEl: null,
      // 风格数组
      styles: dataviewStyle.concat(dsf.dataview.extendStyle),
      shrink: false,
      designerTheme: "light",
      selectComponentsSort: [],
      DATAVIEW_VERSION: process.env.DATAVIEW_VERSION,
      PLATFORM_VERSION: process.env.PLATFORM_VERSION,
      popularStyleFlag: false, // 风格标志
      themeColorList: [], // 主题列表
      customThemeStyleColorSeriesList: [], //自定义颜色系列列表
      colorSeriesList: styleColorSeries, // 颜色系列列表
      activeTools: 0,
      switchToolsButtons: [
        {
          id: 0,
          name: "组件",
          icon: "dv-icon-module",
        },
        {
          id: 1,
          name: "大纲",
          icon: "dv-icon-outline",
        },
      ],
      controlButtons: [
        {
          text: "撤销",
          id: 0,
          icon: "cancel",
          handler: this.preStep,
        },
        {
          text: "前进",
          id: 1,
          icon: "cancel",
          handler: this.nextStep,
        },
        {
          text: "风格切换",
          icon: "dv-icon-styleSwitching",
          id: 3,
          handler: () => {},
        },
        {
          text: "主题切换",
          id: 5,
          icon: "",
          handler: () => {},
        },
        {
          text: "帮助",
          id: 4,
          icon: "charulianjie",
          handler: () => {},
        },
      ],
      buttons: [
        {
          text: "保存",
          id: "save",
          icon: "baocun",
          handler: this.dataViewSaveLayout,
          setting: true,
          roles: [],
          value: "1",
        },
        {
          text: "保存并预览",
          id: "preview",
          icon: "dv-icon-preview",
          handler: this.preView,
          setting: false,
          roles: [],
        },
        {
          text: "模板选择",
          id: "tpl",
          icon: "dv-icon-templateSelection",
          handler: this.useTpl,
          setting: true,
          roles: [],
          value: "2",
        },
        {
          text: "控件组选择",
          id: "ctrl",
          icon: "dv-icon-controlGroup",
          handler: this.openComponentSelect,
          setting: true,
          roles: [],
          value: "4",
        },

        {
          text: "二次开发",
          id: "js",
          icon: "dv-icon-secondaryDevelopment",
          handler: this.openDevelopment,
          setting: true,
          roles: [],
          saved: true,
          value: "7",
        },
      ],
      //模板设计时显示的按钮
      templateButtons: [
        {
          text: "保存模板",
          icon: "baocun",
          handler: this.saveLayoutToTemplate,
          setting: false,
          roles: [],
          show: () => true,
        },
        {
          text: "预览",
          icon: "dv-icon-preview",
          handler: this.preView,
          setting: false,
          roles: [],
          show: () => true,
        },
        {
          text: "模板选择",
          icon: "dv-icon-templateSelection",
          handler: this.useTpl,
          setting: true,
          roles: [],
          show: () => true,
        },
        {
          text: "控件组选择",
          icon: "dv-icon-controlGroup",
          handler: this.openComponentSelect,
          setting: true,
          roles: [],
          show: () => true,
        },
      ],
      dataViewLayout: {
        toolsBox: {
          //tab默认选中
          activeName: "controls",
          tabs: [
            { name: "controls", label: "基础组件" },
            { name: "business", label: "组件模板" },
          ],
        },
      },
      //设备是否是移动端
      deviceMobile: false,
      page: null,
      // 页面数据集
      designerDataSources: [],
      designerDataMappingComps: [], // 获取有data映射的组件
      attributesOwner: {},
      attributesGroup: [],
      useControlsGroup: {
        activeName: "",
        groups: [],
      },
      tools: {
        activeName: "",
        groups: [],
      },
      dragProxy: {
        show: false,
      },
      //是否开启缩放
      disableScale: false,
      // 是否开启辅助工具
      auxiliary: true,
      //开启页面拖曳
      openDrag: false,
      operationStep: [],
      //页面风格
      styleTheme: "",
      // 颜色系列(图表)
      styleColorSeries: "",
      //  缩放比例
      scale: 100,
      //业务数据控制数据
      businessData: [],
      // 数据来源
      dataResources: [],
    };
  },
  created() {
    // 初始化主题选择
    this.themeColorList = _.cloneDeep(dsf.dataview.selectThemes);
    if (dsf.config.setting_dataview_business) {
      const data = dsf.config.setting_dataview_business;
      this.businessData = JSON.parse(data).map((it) => it["dataview_setting_setting_dataview_business.type"]);
    }

    if (dsf.config.setting_dataview_ds) {
      this.dataResources = dsf.config.setting_dataview_ds.split("^");
    }

    // 北京二包--外来数据集
    const { fromModeId } = this.$route.query;
    if (fromModeId) {
      this.exoticInterface(fromModeId);
    }
  },
  methods: {
    /**
     * @param {Array} list 组件列表
     * @param {Number}  type 组件类型 0 普通组件 1 业务组件
     *
     */
    getFilterResult(list, type) {
      const groups = [];
      _.each(list, (g) => {
        let ng = dsf.mix(true, {}, g);
        ng.items = [];
        _.each(g.items, (it) => {
          if (it.type === type) {
            ng.items.push(it);
          }
        });
        if (ng.items.length) {
          groups.push(ng);
        }
      });
      return groups;
    },

    /**
     * 大屏切换主题
     */
    changeDesignerTheme(t) {
      this.designerTheme = t;
      //更新页面背景
      const page = this.$refs.viewProxy;
      if (page && page.$children[0]) {
        const vm = page.$children[0];
        vm.designerTheme = t;
      }
    },

    /**
     * 加载html2canvas
     */
    loadCanvas() {
      return new Promise((resolve, reject) => {
        if (window.html2canvas) {
          resolve();
        } else {
          dsf.http
            .importFiles([this.$getWebPath("static/js/libs/html2canvas/html2canvas_dv.js", __DSF_DATAVIEW_PATH__)])
            .then(() => {
              resolve();
            })
            .catch((err) => {
              dsf.layer.message("加载html2canvas文件报错", false);
              reject();
            });
        }
      });
    },

    /**
     * 大屏页面保存
     */
    dataViewSaveLayout() {
      // 保存预览图
      this.loadCanvas()
        .then(() => {
          let page = document.querySelector(".dv-designer-container__warp-canvas");
          const scale = window.devicePixelRatio * (1 / (this.scale / 100));
          if (!page) return false;
          html2canvas(page, {
            useCORS: true,
            allowTaint: true,
            scale,
          }).then((canvas) => {
            const extendData = {
              isStatic: 0,
              isPublic: 1,
              namespace: `${this.$route.query.B}.${this.$route.query.M}`,
              pageName: this.$route.query.pname,
            };
            const blob = dsf.dataview.utils.base64ToBlob(canvas.toDataURL("image/jpeg"));
            this.$http.upload(dsf.url.getWebPath("resource/uploadCover", $$webRoot.dataview), {
              ...extendData,
              files: blob,
            });
          });
        })
        .catch((error) => {
          console.log("保存预览图失败", error);
        });

      return this.saveLayout();
    },

    /**
     * 外部的接口集合
     */
    exoticInterface(modeId) {
      this.$http.get(`/eb/dp/model/getModeNodeData?modeId=${modeId}`).done((res) => {
        if (res.success) {
          // 基础数据源
          const base = res.data.base;
          // 结果数据源
          const result = res.data.result;

          const baseResource = {
            id: "base_resource",
            label: "基础数据资源",
            nodeKey: "base_resource",
            is_folder: 1,
            children: this.analysisExoticData(base),
          };
          this.designerDataSources.push(baseResource);

          const resultResource = {
            id: "result_resource",
            label: "结果数据资源",
            nodeKey: "result_resource",
            is_folder: 1,
            children: this.analysisExoticData(result),
          };
          this.designerDataSources.push(resultResource);
        }
      });
    },
    // 递归解析数据
    analysisExoticData(data) {
      const result = [];
      data.forEach((it) => {
        // 目录
        if (it.is_folder === 1) {
          const res = {
            id: it.id,
            label: it.name,
            nodeKey: it.id,
            is_folder: 1,
            children: [],
          };
          if (it.children) {
            res.children = this.analysisExoticData(it.children);
          }
          result.push(res);
          // 数据表
        } else if (it.is_folder === 0) {
          const params = [
            {
              origin: "text",
              queryKey: "modeId",
              valueKey: it.mode_id,
              designValue: it.mode_id,
            },
            {
              origin: "text",
              queryKey: "groupType",
              valueKey: it.group_type,
              designValue: it.group_type,
            },
            {
              origin: "text",
              queryKey: "nodeId",
              valueKey: it.id,
              designValue: it.id,
            },
            {
              origin: "text",
              queryKey: "nodePath",
              valueKey: it.nodePath,
              designValue: it.nodePath,
            },
            {
              origin: "text",
              queryKey: "pageNum",
              valueKey: 1,
              designValue: 1,
            },
            {
              origin: "text",
              queryKey: "pageSize",
              valueKey: 100,
              designValue: 100,
            },
          ];
          const url = "/eb/dp/model/getNodeDatailData";
          const origin = {
            _id: it.id,
            id: it.id,
            url: url,
            label: it.name,
            fields: [],
            isExotic: true,
          };
          const res = {
            id: it.id,
            label: it.name,
            url: url,
            type: "interface",
            nodeKey: it.id,
            group_type: it.group_type,
            nodePath: it.nodePath,
            mode_id: it.mode_id,
            values: [],
            params: params,
            origin: origin,
            mapFieldList: [],
            is_folder: 0,
            // 外来数据
            isExotic: true,
            children: [],
          };
          if (it.fields) {
            const fields = JSON.parse(it.fields);
            const mapFieldList = fields.map(({ field, name }) => {
              return {
                name,
                value: field,
              };
            });
            res.mapFieldList = mapFieldList;
            origin.fields = mapFieldList;
            res.children = mapFieldList.map(({ value, name }) => {
              return {
                id: value,
                label: name,
                isField: true,
              };
            });
          }
          result.push(res);
        }
      });
      return result;
    },
    dataviewLayoutTreeClickHandler(evt) {
      this.layoutTreeClickHandler(evt);

      const target = $(evt.target);
      const component_el = target.closest(".designer-ctrl-proxy");
      if (component_el.length) {
        let component = component_el.get(0).__vue__;

        if (component.$layoutTree) {
          component = component.$layoutTree;
        }
        const selectComponentsSort = this.selectComponentsSort;
        const index = selectComponentsSort.findIndex((it) => it === component._uid);
        if (index > -1) {
          selectComponentsSort.splice(index, 1);
        } else {
          selectComponentsSort.push(component._uid);
        }
        this.$nextTick(() => {
          const components = this.getSelectionComponents();
          this.selectComponentsSort = selectComponentsSort.filter((it) => components.find((comp) => comp._uid == it));
        });
      }
    },
    recursionComponentsSlots(component) {
      //组件别名更新
      let ctrlName = component.ctrlName;
      let ctrlType = component.ctrlType.split(".")[1];
      let sign = component.caption.substr(ctrlType.length);
      let dv = window.$components.dataview;
      //如果是大屏组件
      if (dv[ctrlName]) {
        let chineseName = dv[ctrlName].ctrlCaption;
        let name = `${chineseName}${sign}`;
        component.fakeCodeName = name;
      }
      if (component.slots && component.slots.length) {
        component.slots.forEach((it) => {
          it.controls.forEach((_it) => {
            this.recursionComponentsSlots(_it);
          });
        });
      }
    },
    //获取主题颜色
    getTheme(themeName = this.styleTheme) {
      const styles = this.styles;
      const theme = styles.find((it) => it.value === themeName);
      return theme;
    },
    command(args) {
      switch (args) {
        case "0":
          window.open("http://cd.dreamdt.cn:20102/s/e2Qaishn", "_blank");
          break;
        case "1":
          window.open("http://cd.dreamdt.cn:20102/wiki/page.html?#/pc/wiki?code=e2Qaishn&id=db984d691bf248a19fb2e5dea5607ce5&pid=&type=&tId=", "_blank");
          break;
      }
    },
    changeActiveTools() {
      if (this.activeTools === 0) {
        this.activeTools = 1;
      } else {
        this.activeTools = 0;
      }
    },
    //切换辅助工具
    changeAuxiliary() {
      this.auxiliary = !this.auxiliary;
    },
    changeDrag() {
      this.openDrag = !this.openDrag;
    },
    dvCustomDrag(data, evt) {
      let proxy = $(this.dragProxy_el);
      let slotEl = proxy.closest("[slot-name]");
      let slotName = slotEl.attr("slot-name");

      //添加强制风格标识 拖进来 且不是业务组件
      if (data.state === "add" && data.attributes.type != "business") {
        if (data.attributes.data) {
          if (data.attributes.data.props) {
            data.attributes.data.props.isDesignerAdd = true;
          } else {
            data.attributes.data.props = {
              isDesignerAdd: true,
            };
          }
        } else {
          data.attributes.data = {
            props: {
              isDesignerAdd: true,
            },
          };
        }
      }
      // 嵌套大模型组件
      const nestComp = function (data, container) {
        const title = data.attributes.data.props.modelArgs.title;
        if (container && container.ctrlName === "DsfDataViewBusinessDefaultPanel") {
          container.title = title;
          return null;
        } else {
          // 这里不需要判断是否异步---一定存在该组件
          const child = dsf.createComponent(data.attributes.data.code, { designProxy: true, ...data.attributes.data.props });
          return {
            code: "dsf.dataviewbusinessdefaultpanel",
            props: {
              title,
              isDesignerAdd: true,
              slots: [{ name: "default", controls: [child] }],
            },
          };
        }
      };
      // 大模型拖拽特殊处理
      if (data.attributes.isModelDrag && !this.dragEl) {
        const containerVm = this.dragProxy_el.closest(".ds-control")?.__vue__;
        const result = nestComp(data, containerVm);
        result && (data.attributes.data = result);
      }

      // 判断拖拽在元素上,不在插槽上
      if (this.dragEl) {
        const target = this.dragEl;
        const ctrl = target.closest(".designer-ctrl-proxy");
        const selectSlot = ctrl.closest("[slot-name]");
        const slotName = selectSlot.attr("slot-name");

        if (slotName) {
          const parentControl = dsf.designer.getParentControl(selectSlot);
          const slot = _.find(parentControl.slots, (it) => {
            return it.name == slotName;
          });
          const com = dsf.designer.getDsfComponent(ctrl.get(0).__vue__, this);
          const layoutTree = com.$layoutTree || com;

          let hasMerge = false;
          let mergeArgs = null;
          try {
            // 新增与移动
            const code = data.state === "add" ? data.attributes.data.code : data.attributes.ctrlType;
            if (mergeCtrlType.includes(com.ctrlType) && mergeCtrlType.includes(code)) {
              if (data.attributes.data.props && data.attributes.data.props.modelArgs) {
                const modelArgs = data.attributes.data.props.modelArgs;
                mergeArgs = modelArgs;

                const name = modelArgs.describe[0].field;
                const chartOptions = com.chart;
                const re = chartOptions.xAxis[0].type === "category" ? chartOptions.xAxis : chartOptions.yAxis;
                const origin = re[0].data;
                const category = modelArgs.data.map((it) => it[name]);

                // 类目轴相等且必须是表格数据才能进行合并
                if (origin.join(",") === category.join(",") && com.dataType === "excel") {
                  hasMerge = true;
                }
              }
            }
          } catch (error) {
            console.warn(`error ${error}`);
          }
          openPosDialog(hasMerge)
            .then((res) => {
              let index = _.findIndex(slot.controls, (it) => it === layoutTree.__context__.props);
              if (index < 0) return false;
              if (res === "merge") {
                com.mergeSeries && com.mergeSeries(mergeArgs);
              } else {
                switch (res) {
                  case "after":
                    index = index + 1;
                    break;
                  case "cover":
                    dsf.array.remove(slot.controls, layoutTree.__context__.props);
                    break;
                }

                // 新增
                if (data.state === "add") {
                  let layoutProps = {};
                  // 大模型组件嵌套面板
                  if (data.attributes.isModelDrag) {
                    const result = nestComp(data, parentControl);
                    result && (data.attributes.data = result);
                    if (result) {
                      const { props } = result;
                      layoutProps = props;
                    }
                  }
                  let code = data.attributes.data.code;

                  // 如果是业务组件
                  if (data.attributes.type == "business") {
                    let contextKey = "content";
                    if (this.mobile) {
                      contextKey = "mobilecontent";
                    }
                    let content = data.attributes.data[contextKey];
                    if (!content) {
                      throw new Error("业务组件中缺失组件信息");
                    }
                    layoutProps = JSON.parse(content);
                    code = layoutProps.ctrlType;
                    dsf.recursionComponentProps(layoutProps, (props) => {
                      let ctrl = dsf.createComponent(props.ctrlType, props);
                      dsf.mix(props, ctrl);
                      props.designId = dsf.uuid();
                      props.isBusiness = true;
                    });
                  }

                  //检查当前标签是否是异步组件
                  let asyncCom = dsf.checkAsyncComponent(code);
                  if (asyncCom) {
                    //异步组件则请求相关属性
                    dsf.requestAsyncComponents(asyncCom).then(() => {
                      this.addDragControl(code, parentControl, slot.name, data, layoutProps, index);
                    });
                  } else {
                    Promise.resolve().then(() => {
                      this.addDragControl(code, parentControl, slot.name, data, layoutProps, index);
                    });
                  }
                  // 移动
                } else {
                  data.component.$$remove();
                  this.addControl(parentControl, slot.name, data.attributes, index);
                }
              }
            })
            .catch((error) => {
              console.warn(error);
            });
        }

        this.dragEl = null;
      }

      //头部特殊处理
      if (slotName === "head" || !evt) {
        return false;
      }

      //开启页面内布局
      if (this.openDrag && evt) {


        const wrapper = document.querySelector(".designer-grid-layout__wrapper");
        let toElement = evt.toElement;

        if (!toElement) {
          try {
            toElement = document.elementFromPoint(evt.clientX, evt.clientY);
          } catch (error) {
            console.log(`${error}`);
          }
        }
        // 不是拖曳在布局里
        if (toElement && !wrapper.contains(toElement)) return false;

        let x = 0;
        let y = 0;

        const dataviewPageProxy = this.$refs.viewProxy;
        const designActive = dataviewPageProxy.designActive;
        const layout = dataviewPageProxy.layout;
        const { width, height } = dataviewPageProxy.designerRatio;
        const activeLevel = dataviewPageProxy.currentLevel;
        const activeLevelLayout = layout[activeLevel - 1];

        const unit = activeLevelLayout.colNumUnit || "%";

        const { clientX, clientY } = evt;
        const transformScale = dataviewPageProxy.transformScale;
        const { left, top } = wrapper.getBoundingClientRect();
        const offsetX = (clientX - left) / transformScale;
        const offsetY = (clientY - top) / transformScale;

        let w = 30;
        let h = 30;
        if (unit !== "%") {
          w = 200;
          h = 200;
        }

        if (unit === "%") {
          x = (100 * offsetX) / width;
          y = (100 * offsetY) / height;
          x = Number(x.toFixed(2));
          y = Number(y.toFixed(2));
        } else {
          x = offsetX;
          y = offsetY;
        }

        //判断超出边界
        if (unit === "%") {
          if (w + x > 100) {
            x = 100 - w;
          }
        }

        let area = "";
        const i = dsf.uuid();
        Object.keys(activeLevelLayout.layout).forEach((item) => {
          const currentLayout = activeLevelLayout.layout[item];
          //当前分辨率插槽名字
          if (item === designActive) {
            area = i;
          }
          let max = Math.max(...currentLayout.map((it) => it.zIndex), 0);
          if (isNaN(max)) {
            max = 0;
          }
          currentLayout.push({
            x,
            y,
            w,
            h,
            static: false,
            i,
            zIndex: max + 1,
          });
        });
        this.dealSlots();

        if (area) {
          const slot = `area-${area}-${activeLevel}`;
          const container = dataviewPageProxy;
          let component = container._isVue ? container : container.get(0).__vue__;

          let code = data.attributes.data.code;
          let layoutProps = {};
          //业务组件处理
          if (data.attributes.type == "business") {
            let content = data.attributes.data.content;
            if (!content) {
              throw new Error("业务组件中缺失组件信息");
            }
            layoutProps = JSON.parse(content);
            code = layoutProps.ctrlType;
            dsf.recursionComponentProps(layoutProps, (props) => {
              let ctrl = dsf.createComponent(props.ctrlType, props);
              dsf.mix(props, ctrl);
              props.designId = dsf.uuid();
              props.isBusiness = true;
            });
          }

          //检查当前标签是否是异步组件
          let asyncCom = dsf.checkAsyncComponent(code);
          if (asyncCom) {
            //异步组件则请求相关属性
            dsf.requestAsyncComponents(asyncCom).then(() => {
              this.addDragControl(code, component, slot, data, layoutProps);
            });
          } else {
            Promise.resolve().then(() => {
              this.addDragControl(code, component, slot, data, layoutProps);
            });
          }
        }
      }
    },
    addDragControl(code, component, slot, data, layoutProps, index = null) {
      //基础组件
      if (data.attributes.type == "control") {
        let newComp = dsf.designer.createComponent(code, { designProxy: true }, false, this);
        if (data?.attributes?.data?.props) {
          newComp = dsf.mix(true, newComp, data?.attributes?.data?.props);
        }
        newComp && this.addControl(component, slot, newComp, index);
        //业务组件
      } else if (data.attributes.type == "business") {
        this.addControl(component, slot, layoutProps, index);
      }
    },
    //处理插槽
    dealSlots() {
      const owner = this.$refs.viewProxy;
      let slots = {};
      const applyingSlots = {};
      const tempSlots = owner.slots.splice(0, 2);
      // slots从集合转成对象格式
      _.forEach(owner.slots, (item) => {
        applyingSlots[item.name] = item;
      });
      _.forEach(owner.layout, (item, index) => {
        for (let key in item.layout) {
          let layout = item.layout[key];
          _.forEach(layout, (it) => {
            const slotName = `area-${it.i}-${index + 1}`;
            slots[slotName] = applyingSlots[slotName] || {
              name: slotName,
              controls: [],
            };
          });
        }
      });
      owner.slots = [...tempSlots, ...Object.values(slots)];

      dsf.emit.$emit("update-minimap");
    },
    preStep() {
      this?.undo?.();
    },
    nextStep() {
      this?.redo?.();
    },
    //选中页面属性
    selectPage() {
      if (this.$refs.viewProxy) {
        this.clearSelectedSlot();
        this.clearSelectedComponent();
        this.selectedComponent($(this.$refs.viewProxy.$el));
      }
    },
    //页面切换了分辨率
    changeDevice(device) {
      const el = this.$refs.designerPanel.$el;
      const vm = $(el).find(".designer-page")[0]?.__vue__;

      vm && vm.deviceChange(device);
    },
    preView() {
      if (this.isTemplate) {
        try {
          let page = this.$refs.viewProxy.$$getComponent();
          try {
            dsf.designer.createViewMetaData(page, this.mobile);
          } catch (ex) {
            dsf.layer.message(ex, false);
            return;
          }
          this.$nextTick().then(() => {
            let str = dsf.designer.getLayoutInfo(page, true);
            str = dsf.designer.controlToJson(str);
            let x = "/";
            let layoutStr = `<script type="text/template" id="layout">\n${str}\n<${x}script>`;
            window.$previewStr = layoutStr;
            dsf.layer.pc.openWindow(true, "./designer.html#" + (this.mobile ? "/mobile" : "/pc") + "/preview");
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
      } else {
        let url = this.nameSpace.replace(/\./g, "/");
        url += "/" + this.pageName;
        this.dataViewSaveLayout().then(() => {
          this.$openWindow("./page.html#/pc/" + url);
        });
      }
    },
    scaleChange(scale) {
      this.scale = scale;
    },
    leftSearch() {
      this.$nextTick(() => {
        this.initToolDrag();
      });
    },
    // 风格切换
    popularStyleSwitch(val) {
      let themeName = val;
      this.styleTheme = themeName;
      this.styleColorSeries = "";

      const theme = this.getTheme(themeName);
      if (theme) {
        //更新页面背景
        const page = this.$refs.viewProxy;
        const vm = page.$children[0];
        vm.changePageStyle(themeName, theme);
      }
    },
    /**
     * @name: 页面切换样式
     * @param {Object} obj
     * 如:field fontFamily 证明里面包含的属性有fontFamily  value当前的值
     * @return {*}
     */
    pageTotalCssChangeStyle(obj) {
      dsf.designer.recursionLayoutTree(this.$refs.viewProxy, null, null, (component) => {
        if (component.isDataViewControl) {
          this.componentChangeCssStyle(obj, component);
        }
      });
    },
    /**
     * @name: 组件切换样式,利用枚举
     * @param {Object} obj
     * 如:field fontFamily 证明里面包含的属性有fontFamily  value当前的值
     * @return {*}
     */
    componentChangeCssStyle(obj, component) {
      let field = obj.field;
      let val = obj.value;
      let propStyle = cssStyleConfig.props;
      let needFieldArr = [];
      this.recursiveValChange(needFieldArr, component, propStyle, field, val, []);
      needFieldArr.forEach((field) => {
        component.$emit(`update:${field}`, component[field]);
      });
      if (component.chart) {
        // 证明是图表
        component.chartString = dsf.dataview.utils.objectToString(component.chart, true);
        component.reset();
        dsf.emit.$emit("updateStyleChange", {}, [component]);
      }

      // console.log(component.fakeCodeName + ":", needFieldArr);
    },
    /**
     * @name: 递归更新对应的属性
     * @param {Array} needFieldArr 最后需要更新props的字段
     * @param {Vm} component 大屏组件(例如largeTable等)
     * @param {Object} obj cssStyleConfig中配置对象
     * @param {String} needField 需要更新的属性
     * @param {any} newValue  component中对应的key值
     * @param {Array} parentKeys 例如:最终的属性为a.b.c.d  那么这个就代表[a,b,c]
     */
    recursiveValChange(needFieldArr, component, obj, needField, newValue, parentKeys = []) {
      for (let key in obj) {
        if (needField === key) {
          obj[needField].forEach((field) => {
            const currentKeys = parentKeys.concat(key);
            const firstKeys = currentKeys[0];
            if (component && Object.prototype.hasOwnProperty.call(component, field)) {
              component[field] = newValue;
              if (needFieldArr.indexOf(firstKeys) === -1) {
                needFieldArr.push(firstKeys);
              }
            } else if (firstKeys === "chart") {
              // 证明是图表
              component[field] = newValue;
              if (needFieldArr.indexOf(firstKeys) === -1) {
                needFieldArr.push(firstKeys);
              }
            }
          });
        } else {
          let splitArr = key.split("^_^");
          let realKey = splitArr[0];
          if (splitArr.length > 1) {
            if (component[realKey] && typeof component[realKey] === "object" && obj[key] && typeof obj[key] === "object") {
              // 证明当前属性为数组
              component[realKey].forEach((item) => {
                this.recursiveValChange(needFieldArr, item, obj[key], needField, newValue, parentKeys.concat(realKey));
              });
            }
          } else {
            if (component[key] && typeof component[key] === "object" && obj[key] && typeof obj[key] === "object") {
              this.recursiveValChange(needFieldArr, component[key], obj[key], needField, newValue, parentKeys.concat(key));
            }
          }
        }
      }
    },
    // 新版本模板切换
    openTemplateDialog(showClose, showCancel) {
      let self = this;
      return new Promise((resolve, reject) => {
        let btns = [
          {
            text: "确定",
            handler: async (data) => {
              let tplData = data.yes();
              if (_.isNull(tplData)) {
                dsf.layer.message("请选择一个模板", false);
                return false;
              } else {
                self.loading = true;
                let themeName = "";
                if (tplData.label_value) {
                  const theme = tplData.label_value.split("^")[0];
                  const val = dsf.dataview.selectThemes.find((it) => it.value === theme);
                  if (val) {
                    themeName = val.value;
                  }
                }
                self
                  .loadTemplateContent(tplData)
                  .then((page) => {
                    //使用页面主题颜色
                    if (page.theme) {
                      self.styleTheme = page.theme;
                      //使用模板主题颜色
                    } else if (themeName) {
                      self.styleTheme = themeName;
                      page.theme = themeName;
                    }
                    resolve(page);
                  })
                  .catch((ex) => {
                    reject(ex);
                  })
                  .finally(() => {
                    self.loading = false;
                  });
              }
            },
          },
        ];
        if (showCancel !== false) {
          btns.push({
            text: "取消",
          });
        }
        this.$openDialog({
          title: "选择布局模板",
          content: LayoutTemplate,
          width: "1400px",
          height: "660px",
          customClass: "data-view-layout-template-dialog",
          top: "6vh",
          params: {
            designer: this,
          },
          showClose: showClose !== false,
          btns,
        });
      });
    },
    // 过滤出不在右侧显示
    filterJson(arr) {
      // 只有一层不用递归,后续如果有多层考虑递归
      try {
        let nowArr = _.cloneDeep(arr);
        nowArr.forEach((item) => {
          let attrList = item.attributes.filter((attr) => !attr.dataViewHidden);
          item.attributes = attrList;
        });
        return nowArr;
      } catch (error) {
        return arr;
      }
    },
    //切换选中组件
    changeSelectComp(attributes, curSlots) {
      let selectCtrls = document.querySelector(".designer-ctrl-proxy.ds-control-selected");
      if (selectCtrls) {
        let container = dsf.designer.getParentControl(selectCtrls);
        let slotEl = $(selectCtrls).closest("[slot-name]");
        let slot = slotEl.attr("slot-name");
        let next = $(selectCtrls).next(".designer-ctrl-proxy");
        let data = {
          state: "add",
          attributes,
        };
        const designId = this.changeSlot(next.length ? next : null, container, slot, data, curSlots);
        $(selectCtrls).find(".designer-btns .remove").click();

        setTimeout(() => {
          let el = slotEl.find(`div[des-id=${designId}]`).closest(".designer-ctrl-proxy");
          this.selectedComponent(el, false, true);
        });
      }
    },
    //私有添加密级组件
    privateConfidentiality(container, slot, code) {
      let component = container._isVue ? container : container.get(0).__vue__;
      let parentComponent = component,
        index = null,
        newComp = null;
      newComp = dsf.designer.createComponent(code, { designProxy: true }, false, this);

      let designOptions = dsf.getComponentDesignOptions(newComp.ctrlType);
      let defaultInitProps = designOptions?.defaultInitProps?.() || {};
      dsf.mix(true, newComp, defaultInitProps);
      newComp && this.addControl(parentComponent, slot, newComp, index);
    },
    changeSlot(obstacle, container, slot, data, curSlots) {
      let component = container._isVue ? container : container.get(0).__vue__;
      let parentComponent = component,
        index = null,
        newComp = null;
      if (obstacle) {
        //如果拖放位置已经存在组件，则计算该组件位置，准备插入到其前
        let target = obstacle.get(0).__vue__;
        let slotItem = _.find(parentComponent.slots, (s) => s.name === slot);
        index = _.findIndex(slotItem.controls, (com) => com === target.__context__.props);
      }
      try {
        //边框切换
        if (data.attributes.customType == "border") {
          newComp = dsf.designer.createComponent(data.attributes.data.code, { designProxy: true }, false, this);
          if (newComp && newComp.metadata) {
            newComp.metadata.level = 0;
          }
          if (data?.attributes?.data?.props) {
            newComp = dsf.mix(true, newComp, data?.attributes?.data?.props);
          }
          if (curSlots && newComp.slots) {
            let slots = dsf.mix(true, newComp.slots, curSlots);
            newComp.slots = slots;
          }
          newComp && this.addControl(parentComponent, slot, newComp, index);
          return newComp.designId;
          //图标切换
        } else if (data.attributes.customType == "graph") {
          var controlData = data.attributes.data;
          let layoutProps = JSON.parse(controlData.content);
          dsf.recursionComponentProps(layoutProps, (props) => {
            let ctrl = dsf.createComponent(props.ctrlType, props);
            dsf.mix(props, ctrl);
            props.designId = dsf.uuid();
            props.isBusiness = true;
            //表单控件不改变caption
            if (!props.isFormControl) {
              props.caption = "";
            }
          });
          this.addControl(parentComponent, slot, layoutProps, index);
          return layoutProps.designId;
        }
      } catch (ex) {
        dsf.error(ex);
      }
    },
    designerLoaded() {
      this.selectComponentsSort = [];
      this.$nextTick(() => {
        this.selectedComponent($(this.$refs.viewProxy.$el));
        this.$eventBus.$emit("update-desinger-outline", this);
        this.recordPageChange();
        this._layoutInfo = JSON.stringify(dsf.designer.getLayoutInfo(this.$refs.viewProxy));
        // 设置主题
        this.styleTheme = this.$refs.viewProxy.theme;

        //监听页面布局是否有变化
        this.watchLayoutChange();
        this.$emit("loaded");
        this.showToolBar = true;
        this.showProperties = true;

        this.isLoaded = true;

        //如果是密级非模板才会校验
        if (dsf.config.setting_security_is_open_classified == "1" && !this.tpl) {
          this.$nextTick(() => {
            let allComponents = Object.values(this.allComponents);
            for (let i = 0; i < allComponents.length; i++) {
              let ctrlType = allComponents[i].ctrlType;
              if (ctrlType === "dsf.dataviewconfidentialitywords") {
                return false;
              }
            }
            const container = this.$refs.viewProxy;
            const slot = "head";
            const code = "dsf.dataviewconfidentialitywords";
            //检查当前标签是否是异步组件
            let asyncCom = dsf.checkAsyncComponent(code);
            if (asyncCom) {
              //异步组件则请求相关属性
              dsf.requestAsyncComponents(asyncCom).then(() => {
                this.privateConfidentiality(container, slot, code);
              });
            } else {
              this.privateConfidentiality(container, slot, code);
            }
          });
        }
      });
    },
    styleColorSeriesContentItemStyle(one) {
      let style = {
        backgroundColor: one[2],
      };
      return style;
    },
    changeColorSeries(row) {
      this.styleColorSeries = row.id;

      const vm = this.$refs.viewProxy.$children[0];
      vm.themeStyleColorSeries = row.id;
      // 选中的组件
      const sel_components = this.getSelectionComponents();

      const theme = this.getTheme();
      if (theme) {
        this.updateColorSeries(theme, this.styleColorSeries);
        if (sel_components.length == 0) {
          //替换页面组件风格
          dsf.designer.recursionLayoutTree(this.$refs.viewProxy, null, null, (component) => {
            if (component?.styleMapKey === "dataviewGraph") {
              component?.handlerCurrentStyleConfig?.call(component, theme);
            }
          });
        } else {
          sel_components.forEach((component) => {
            if (component?.styleMapKey === "dataviewGraph") {
              component?.handlerCurrentStyleConfig?.call(component, theme);
            }
          });
        }
      }
    },
    /**
     * @name: 更新颜色
     * @param {*} theme 当前风格对象
     * @param {*} colorSeriesId 系列的id
     */
    updateColorSeries(theme, colorSeriesId) {
      if (theme) {
        let listType = String(colorSeriesId).includes("custom") ? "customThemeStyleColorSeriesList" : "colorSeriesList";
        let nowColorSeriesList = this[listType];
        let oneObj = nowColorSeriesList.find((item) => item.id === colorSeriesId);
        // 更新图表方面
        if (oneObj) {
          let colorList = _.cloneDeep(oneObj.colorList);
          let colorListReverse = [...oneObj.colorList.map((item) => item[2])].reverse();
          if (theme.style?.dataviewGraph?.commonStyle) {
            theme.style.dataviewGraph.commonStyle.colors = colorList;
            theme.style.dataviewGraph.commonStyle.barColors = colorList;
          }
          // 更新热力图颜色方面
          if (theme.style?.dataviewGraph?.visualMap) {
            theme.style.dataviewGraph.visualMap.colors = colorListReverse;
          }
          if (theme.style?.dataviewGraph?.map) {
            theme.style.dataviewGraph.map.colors = colorListReverse;
          }
          if (theme.commonConfig?.colorList) {
            theme.commonConfig.colorList = colorList.map((item) => item[2]);
          }
        }
      }
    },
    // 自定义颜色添加
    customColorAdd(row) {
      const page = this.$refs.viewProxy;
      const vm = page.$children[0];
      const currentData = row ? row : null;
      this.$openDialog({
        title: "自定义颜色系列",
        content: CustomColorSeries,
        width: "600px",
        height: "400px",
        params: {
          currentData,
        },
        btns: [
          {
            text: "确定",
            handler: (res) => {
              let result = res.yes();
              if (result) {
                let list = vm.customThemeStyleColorSeriesList;
                if (row) {
                  let index = list.findIndex((item) => item.id === result.id);
                  if (index > -1) {
                    if (result.colorList.length) {
                      list.splice(index, 1, result);
                    } else {
                      list.splice(index, 1);
                    }
                  }
                } else {
                  if (result.colorList.length) {
                    list.push(result);
                  }
                }
                vm.$emit("update:customThemeStyleColorSeriesList", list);
              }
            },
          },
        ],
      });
    },
    // 自定义颜色删除
    customColorDel(index) {
      const page = this.$refs.viewProxy;
      const vm = page.$children[0];
      let list = vm.customThemeStyleColorSeriesList;
      list.splice(index, 1);
      vm.$emit("update:customThemeStyleColorSeriesList", list);
    },

    /**
     * 重写平台粘贴页面方法
     * @param {Object} data 页面数据
     */
    $copyPage(data) {
      //直接页面对页面
      return new Promise((resolve, reject) => {
        let targetPage = this.page;
        let isMark = false;
        _.each(targetPage.slots, (it) => {
          if (it?.controls?.length > 0) {
            isMark = true;
          }
        });
        if (isMark) {
          let append = false;
          dsf.layer
            .confirm({
              message: "当前页面上已经存在内容，您是否要覆盖当前页面",
              confirmButtonText: "确定",
              cancelButtonText: "取消",
            })
            .then((res) => {
              // 将原page的部分属性同步到新page上
              let pagePropJson = this.propJson[targetPage.ctrlType];
              let filterAttr = ["name", "title", "isEs", "pageType"];
              _.each(pagePropJson, ({ attributes }) => {
                _.each(attributes, ({ bindControlAttr }) => {
                  if (filterAttr.indexOf(bindControlAttr) == -1) {
                    if (~bindControlAttr.indexOf(".")) {
                      const attrs = bindControlAttr.split(".");
                      const key = attrs.shift();
                      if (key) targetPage[key] = data[key];
                    } else {
                      targetPage[bindControlAttr] = data[bindControlAttr];
                    }
                  }
                });
              });

              targetPage.layout = dsf.mix(true, [], data.layout);

              _.each(targetPage.slots || [], (it) => {
                it.controls.splice(0, it.controls.length);
              });

              this.$createComponentsFromClipboard(data, append);
              resolve();
            })
            .catch((ex) => {
              // append = true;
            })
            .finally(() => {});
        } else {
          this.$createComponentsFromClipboard(data);
          resolve();
        }
      });
    },
    /**
     * 拖放时候，鼠标经过元素时触发--中间层
     *
     */
    middlewareDragMouseMoveHandler(evt) {
      this.dragEl = null;
      const proxy = $(this.dragProxy_el);
      // 还原proxy 元素----start
      if (this.dragProxy.show) {
        this.dragProxy.show = false;
        this.dragProxy.class = "";
        this.dragProxy.style = {};
        $(proxy).appendTo(this.$el);
      }
      // 还原proxy 元素----end

      const target = $(evt.target);
      const ctrl = target.closest(".designer-ctrl-proxy");
      const isDsControl = target.hasClass("ds-control");
      let vueComponent = null;
      if (ctrl && ctrl.length) {
        vueComponent = dsf.designer.getDsfComponent(ctrl.get(0).__vue__, this);
      }
      // 当前元素在 ctrl 内部
      if (!target.is("[slot-name]") && !isDsControl && vueComponent) {
        this.dragEl = Object.freeze(target);
      }

      this.dragMouseMoveHandler(evt);
    },
  },

  beforeRouteEnter(to, from, next) {
    // 模板不做密级判断
    if (to.query.tpl) {
      next();
      return false;
    }
    let B = to.query.B;
    let M = to.query.M;
    let pageName = to.query.pname;
    let namespace = B + "." + M;
    let currentPath = (namespace + "." + pageName).replace(/\./g, "/");
    let params = {
      pageName,
      namespace,
      currentPath: "/pc/" + currentPath,
    };
    const url = dsf.url.getWebPath("meta/init", $$webRoot.platform);
    dsf.http
      .get(url, params)
      .then((res) => {
        let result = res.data;
        //越权访问
        if (!result.success && result.state == 20107) {
          next("/dataViewDesign403");
        } else {
          next();
        }
      })
      .catch(() => {
        next();
      });
  },
};
function openPosDialog(hasMerge) {
  return new Promise((resolve, reject) => {
    const operations = [
      {
        text: "之前",
        type: "main",
        handler() {
          resolve("before");
        },
      },
      {
        text: "之后",
        type: "main",
        handler() {
          resolve("after");
        },
      },
      {
        text: "覆盖",
        type: "main",
        handler() {
          resolve("cover");
        },
      },
    ];
    if (hasMerge) {
      operations.push({
        text: "合并",
        type: "main",
        handler() {
          resolve("merge");
        },
      });
    }
    dsf.layer.openDialog({
      template: "您想插入到当前选中组件哪个位置？",
      title: "提示",
      width: "480px",
      height: "60px",
      btnSize: "small",
      btns: [
        ...operations,
        {
          text: "取消",
          handler() {
            reject();
          },
        },
      ],
    });
  });
}
</script>
