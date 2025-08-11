<!--
 * @Description:
 * @Author: zhanghang
 * @Date: 2022-07-20 10:42:39
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-07-24 15:55:08
-->
<template>
  <div class="ds-control ds-page data-view-page" :page-type="pageType" :class="[getCss, { 'show-mark': waterMark }]">
    <dsf-virtual-scroll class="data-view-page-scroll" :class="{ 'run-scroll': !isDesign }" :isDesign="isDesign" :scroll-x="true">
      <div class="data-view-full-page" ref="fullPage">
        <div class="data-view-inner-page" :style="$pageStyle" ref="dataViewPage">
          <div class="empty-page"></div>
          <div class="mask" v-if="waveSetting.show && waveSetting.maskImage" ref="mask">
            <div class="mask-inner" ref="mask-inner" :style="maskInnerStyle"></div>
          </div>
          <!--页头-->
          <div class="ds-page-head" :style="setOpacity" v-show="hasDataViewHead">
            <div ref="head" class="head-inner" v-onresize="watchCenterHeight" :slot-name="slots[1].name">
              <slot :name="slots[1].name">
                <div class="placeholder-title" v-if="isDesign">标题区域</div>
              </slot>
            </div>
          </div>
          <div class="ds-page-content" :style="setOpacity">
            <div class="data-view-page-wrap dsf-dv-drag-view ds-no-padding" :slot-name="slots[0].name">
              <div class="dsf-layout-container" :class="{ 'dsf-layout-container__design': isDesign }" ref="box">
                <template v-if="isPageLoaded">
                  <div
                    v-for="(item, index) in layout"
                    :key="index"
                    class="dsf-layout-grid"
                    v-show="handleShow(index)"
                    :style="{
                      'z-index': item.zIndex,
                      'pointer-events': item.penetrate ? 'none' : 'auto',
                    }"
                  >
                    <template v-for="it in item.layout[active]">
                      <div class="dsf-layout-grid-item dsf-dv-grid-item" :key="it.i" :style="setGridItemStyle(it, item)" :slot-name="getSlotName(it, index)">
                        <slot :name="getSlotName(it, index)"></slot>
                      </div>
                    </template>
                  </div>
                </template>
                <!-- 设计器中布局方式 -->
                <designerGridLayout
                  :compositionLayouts="compositionLayouts"
                  @click.native.stop
                  :parentHeight="containerHeight"
                  :designer="__designer"
                  v-if="isDesign && __designer && __designer.openDrag"
                  :designerRatio="designerRatio"
                  :transformScale="transformScale"
                  :layout="layout"
                  :activeLevel="currentLevel"
                  :activeRatio="designActive"
                  @selectSlot="selectSlot"
                  @changSize="changSizeSlot"
                />
              </div>
            </div>
          </div>
          <div style="display: none" v-html="customCss"></div>
          <dsf-pc-to-designer v-if="!isPreview && gotoIcon" :title="title" :goto-preview="gotoPreview" />
        </div>
      </div>
    </dsf-virtual-scroll>
    <svg xlmns="http://www.w3.org/2000/svg" version="1.1" style="display: none">
      <filter :id="heatId" filterUnits="objectBoundingBox" x="0" y="0" width="100%" height="100%">
        <feTurbulence :id="heatTurbulence" type="fractalNoise" numOctaves="1" seed="2" />
        <feDisplacementMap xChannelSelector="G" yChannelSelector="B" scale="22" in="SourceGraphic" />
      </filter>
    </svg>
  </div>
</template>
<script>
import { initPageTemp } from "_dataview/output/utils/relativeEvent";
import { utilsHandleParseCode, utilsHandleScope } from "_dataview/output/utils/event";

import defaultBackground from "_dataview/share/components/common/backgroundDefault.js";
import { gisRelativeEventsTemp } from "_dataview/output/utils/relativeEvent.js";
import { createCommonTextStyle, createCommonAnimateCss } from "_dataview/output/config/commonConfig";
const designerGridLayout = Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_page" */ "_dataview/pc/components/designerLayout/designerGridLayout"));
const device_1 = {
  name: "1k屏 (16:9)",
  width: 1920,
  height: 1080,
  divided: true,
};
const device_2 = { name: "1k屏 (16:9)", width: 1366, height: 768 };
const device_3 = { name: "iPad Air", width: 1180, height: 820, divided: true };
const device_4 = { name: "iPhone SE", width: 375, height: 667, divided: true };

export default dsf.component({
  name: "DsfDataViewPage",
  ctrlCaption: "大屏页面",
  mixins: [$components.platform.DsfPage, $mixins.layout],
  components: {
    designerGridLayout,
  },
  props: {
    resizeObserveDom: {
      type: String,
      default: "",
    },
    isResizeObserve: {
      type: Boolean,
      default: true,
    },
    // 背景波纹设置
    waveSetting: {
      type: Object,
      default() {
        return {
          show: false,
          maskImage: "",
        };
      },
    },
    designerTheme: {
      type: String,
      default: "light",
    },
    resetFontsize: {
      type: Function,
      default: null,
    },
    pageFontFamily: {
      type: String,
      default: "Microsoft Yahei",
    },
    enterAnimate: {
      type: Object,
      default: () => createCommonAnimateCss(),
    },
    //是否开启滤镜
    isFilter: {
      type: Boolean,
      default: false,
    },
    filterConfig: {
      type: Object,
      default() {
        return {
          //色相
          hueRotate: 0,
          //饱和度
          saturate: 1,
          //对比度
          contrast: 1,
          //亮度
          brightness: 1,
        };
      },
    },
    //页面风格
    theme: {
      type: String,
      default: "",
    },
    customThemeStyleColorSeriesList: {
      type: Array,
      default: () => [],
    },
    //颜色系列风格
    themeStyleColorSeries: {
      type: [Number, String],
      default: "",
    },
    //选择设备
    designActive: {
      type: String,
      default: ">=1920",
    },
    //设备分辨率
    designerRatio: {
      type: Object,
      default() {
        return { ...device_1 };
      },
    },
    //自适应方式 default-横向铺满，纵向按照布局计算高度,vertical 横向铺满，纵向自适应滚动  horizontal 竖向铺满，横向自适应滚动， fit强制自适应
    fitType: {
      type: String,
      default: "default",
    },
    // fitType 为 horizontal 时候排列
    horizontalAlign: {
      type: String,
      default: "left",
    },
    // fitType 为 vertical 时候排列
    verticalAlign: {
      type: String,
      default: "top",
    },

    //是否有标题头部
    hasDataViewHead: {
      type: Boolean,
      default: true,
    },
    // 大屏悬浮框配置
    popupConfig: {
      type: Array,
      default() {
        return [
          {
            id: "default",
            background: {
              active: "color",
              color: {
                // 选色方式 默认为空 单色色盘选择 color  线性渐变 linear  径向渐变 radial
                type: "color",
                //提供给渐变使用
                image: "",
                isTheme: false,
                theme: "main",
                value: "rgba(16,75,157,0.6)",
              },
            },
            placement: "right", // 悬浮方向
            relativeStyle: true,
            arrow: {
              show: true,
              size: 10,
            },
            offsetFormat: 10,
            padding: [0, 0, 0, 0],
            borderRadius: "5",
            borderWidth: "0",
            // 边框颜色
            borderColor: "#ffffff",
            shadowShow: false, //阴影
            shadowColor: "#FFF",
          },
        ];
      },
    },
    //大屏弹框配置
    dialogConfig: {
      type: Array,
      default() {
        return [
          {
            id: "default",
            background: {
              active: "color",
              color: {
                // 选色方式 默认为空 单色色盘选择 color  线性渐变 linear  径向渐变 radial
                type: "color",
                //提供给渐变使用
                image: "",
                value: "rgba(16,75,157,0.6)",
              },
            },
            //标题高度
            titleHeight: "40",
            //标题对齐
            align: "left",
            vectorAlign: "center",
            iconColor: "#FFF",
            iconSize: "16",
            padding: [0, 0, 0, 0],
            titlePadding: [0, 10, 0, 10],
            borderWidth: "1",
            // 边框颜色
            borderColor: "#104B9D",
            // 边框圆角
            borderRadius: "5",
            animate: {
              flag: false,
              class: "left-to-right",
            },
            position: "left",
            modal: false,
            //文本样式
            textStyle: {
              ...createCommonTextStyle(),
            },
            relativeStyle: true,
            iconPosition: ["auto", "auto", "auto", "auto"],
            // 标题背景
            titleBackground: {
              active: "color",
              color: {
                // 选色方式 默认为空 单色色盘选择 color  线性渐变 linear  径向渐变 radial
                type: "color",
                //提供给渐变使用
                image: "",
                isTheme: false,
                theme: "main",
                value: "rgba(16,75,157,0.6)",
              },
            },
          },
        ];
      },
    },
    //伪代码方法对象-字符串
    executeFnScope: {
      type: String,
      default: "",
    },
    //伪代码中文组件映射对象
    executeFnComp: {
      type: Object,
      default() {
        return {};
      },
    },
    //在gis一张图下运行
    isGisViewPart: {
      type: Boolean,
      default: false,
    },
    //该页面是否依赖于拓展的gis组件
    dependExtendGis: {
      type: Boolean,
      default: false,
    },
    pageType: {
      type: String,
      default: "dataview",
    },
    height: {
      type: String,
      default: "100%",
    },
    fontFamily: {
      type: String,
      default: "Microsoft Yahei",
    },
    layout: {
      type: [Array, Object],
      default: () => {
        return [
          {
            // 10 25
            layout: {
              ">=1920": [
                { x: 0, y: 0, w: 50, h: 70, i: "A" },
                { x: 50, y: 0, w: 25, h: 50, i: "B" },
                { x: 75, y: 0, w: 25, h: 50, i: "C" },
                { x: 0, y: 70, w: 25, h: 30, i: "D" },
                { x: 25, y: 70, w: 25, h: 30, i: "E" },
                { x: 50, y: 50, w: 25, h: 50, i: "F" },
                { x: 75, y: 50, w: 25, h: 50, i: "G" },
              ],
              ">=1200": [
                { x: 0, y: 0, w: 50, h: 70, i: "A" },
                { x: 50, y: 0, w: 25, h: 50, i: "B" },
                { x: 75, y: 0, w: 25, h: 50, i: "C" },
                { x: 0, y: 70, w: 25, h: 30, i: "D" },
                { x: 25, y: 70, w: 25, h: 30, i: "E" },
                { x: 50, y: 50, w: 25, h: 50, i: "F" },
                { x: 75, y: 50, w: 25, h: 50, i: "G" },
              ],
              ">=768": [
                { x: 0, y: 0, w: 100, h: 40, i: "A" },
                { x: 0, y: 40, w: 100, h: 40, i: "B" },
                { x: 0, y: 80, w: 100, h: 40, i: "C" },
                { x: 0, y: 120, w: 100, h: 40, i: "D" },
                { x: 0, y: 160, w: 100, h: 40, i: "E" },
                { x: 0, y: 200, w: 100, h: 40, i: "F" },
                { x: 0, y: 240, w: 100, h: 40, i: "G" },
              ],
              "<768": [
                { x: 0, y: 0, w: 100, h: 40, i: "A" },
                { x: 0, y: 40, w: 100, h: 40, i: "B" },
                { x: 0, y: 80, w: 100, h: 40, i: "C" },
                { x: 0, y: 120, w: 100, h: 40, i: "D" },
                { x: 0, y: 160, w: 100, h: 40, i: "E" },
                { x: 0, y: 200, w: 100, h: 40, i: "F" },
                { x: 0, y: 240, w: 100, h: 40, i: "G" },
              ],
            },
            margin: [0, 0],
            zIndex: 1, // css控制层级
            penetrate: false, // 事件穿透
            verticalCompact: true,
            colNum: 100,
            rowHeight: 1,
            freeDrag: false, // 自由拖动
            freeResize: false, // 自由拉伸
          },
        ];
      },
    },
    //各个分辨率从下的组合类型
    compositionLayouts: {
      type: Object,
      default() {
        return {
          ">=1920": [],
          ">=1200": [],
          ">=768": [],
          "<768": [],
        };
      },
    },
    //插槽
    slots: {
      type: Array,
      default() {
        return [
          { name: "center", controls: [] },
          { name: "head", controls: [] },
          // 布局插槽
          { name: "area-A-1", controls: [] },
          { name: "area-B-1", controls: [] },
          { name: "area-C-1", controls: [] },
          { name: "area-D-1", controls: [] },
          { name: "area-E-1", controls: [] },
          { name: "area-F-1", controls: [] },
          { name: "area-G-1", controls: [] },
        ];
      },
    },
    showAll: {
      type: Boolean,
      default: false,
    },
    padding: {
      type: Array,
      default: () => [0, 0, 0, 0],
    },
    currentLevel: {
      type: Number,
      default: 1,
    },
    //slots 动画--预留属性
    slotsAnimate: {
      type: Object,
      default() {
        return {};
      },
    },
    //模板
    templates: {
      type: Array,
      default() {
        return [];
      },
    },
    // 背景设置
    backgroundConfig: {
      type: Object,
      default() {
        return { ...defaultBackground };
      },
    },
    //特效名字
    effectsName: {
      type: String,
      default: "none",
    },
    effectsConfig: {
      type: Object,
      default() {
        return {};
      },
    },
    //初始化事件
    initDealDataFunction: {
      type: String,
      default: initPageTemp,
    },
    //大屏页面强制无水印
    waterMark: {
      type: Boolean,
      default: false,
    },

    //gis事件设置（只有该页面在gis一张图运行模式下生效）
    gisEventRelative: {
      type: Object,
      default() {
        return gisRelativeEventsTemp;
      },
    },
    //是否定时刷寻页面数据
    isRefreshData: {
      type: Boolean,
      default: false,
    },
    //定时刷新数据间隔（分钟）
    refreshTime: {
      type: [String, Number],
      default: 1,
    },
    // 是否是只做模型展示
    isModel: {
      type: Boolean,
      default: false,
    },
    //页面缩放比--当window.top 报错时候
    pageRatio: {
      type: [Number, Function],
      default: 1,
    },
    //页面字体列表
    pageFonts: {
      type: Array,
      default() {
        return [
          {
            text: "微软雅黑",
            value: "Microsoft Yahei",
          },
        ];
      },
    },
  },
  data() {
    const effectsMap = new Map();
    effectsMap.set("granule", import(/* webpackChunkName: "dataview_output_effects" */ "_dataview/output/effects/granule.js"));
    effectsMap.set("starCloud", import(/* webpackChunkName: "dataview_output_effects" */ "_dataview/output/effects/starCloud.js"));
    effectsMap.set("starSky", import(/* webpackChunkName: "dataview_output_effects" */ "_dataview/output/effects/starSky.js"));
    effectsMap.set("transform", import(/* webpackChunkName: "dataview_output_effects" */ "_dataview/output/effects/transform.js"));
    effectsMap.set("vortex", import(/* webpackChunkName: "dataview_output_effects" */ "_dataview/output/effects/vortex.js"));
    effectsMap.set("wave", import(/* webpackChunkName: "dataview_output_effects" */ "_dataview/output/effects/wave.js"));

    const heatId = dsf.uuid();
    return {
      heatId: `heat_${heatId}`,
      heatTurbulence: `heatTurbulence_${heatId}`,

      // 伪代码事件相关作用域
      eventScope: {},
      //当前组件值
      currentComponentData: {},

      gotoIcon: (dsf.config.setting_public_gotoicon || dsf.config.setting_public_gotoicon) == "1",
      active: ">=1920",

      resourceLoad: true,

      clientWidth: 0,
      clientHeight: 0,

      pageHeadHeight: 0,
      effectsBackGround: null,
      effectsMap,
      containerWidth: 0,
      containerHeight: 0,

      isPageLoaded: false,

      // 页面刷新时间
      refreshTimer: null,

      // 主题配置变量
      themeVarConfig: {},

      // 悬浮弹框组件
      popupDialogs: {},
      requestInterfaceList: [], //用于取消请求
      requestFileList: [], //用于取消加载文件
    };
  },
  computed: {
    noSign: {
      get() {
        return !this.needLogin;
      },
      set(v) {
        this.$emit("update:needLogin", !v);
      },
    },
    isPreview() {
      return this.isDesign || this.isModel;
    },
    maskInnerStyle() {
      const { waveSetting, heatId, backgroundConfig } = this;
      const background = this.dvBackgroundFormat(backgroundConfig);
      return {
        ...background,
        "mask-size": background["background-size"],
        "mask-position": background["background-position"],
        "mask-image": `url(${waveSetting.maskImage})`,
        filter: `url(#${heatId})`,
      };
    },
    __designer() {
      return this.$designer;
    },
    setOpacity() {
      return this.resourceLoad ? { opacity: 1 } : { opacity: 0 };
    },
    //风格样式，变量
    styleThemeVariable() {
      let { themeVarConfig, theme } = this;
      return themeVarConfig[theme] || {};
    },
    transformScale() {
      return +(this.$designer.scale / 100).toFixed(2);
    },
    $pageStyle() {
      const { headHeight, footHeight } = this.getHeadAndFootHeight();
      const { isFilter, filterConfig } = this;
      const style = {
        "padding-top": headHeight + "px",
        "padding-bottom": footHeight + "px",
        ...this.styleThemeVariable,
      };
      if (isFilter) {
        let filter = "";
        Object.keys(filterConfig).forEach((key) => {
          const value = filterConfig[key];
          if (key === "hueRotate") {
            filter += `hue-rotate(${value}deg) `;
          } else {
            filter += `${key}(${value}) `;
          }
        });
        filter && (style.filter = filter);
      }

      const gisVm = this.$parent?.pageProps?.gisVm;

      //如果是gis运行一张图 清除背景
      if (!this.isDesign && gisVm) {
        return style;
      } else {
        const background = this.dvBackgroundFormat(this.backgroundConfig);
        return {
          ...background,
          ...style,
        };
      }
    },
  },
  watch: {
    backgroundConfig: {
      handler(val, old) {
        const active = val.active;
        const oldActive = old.active;
        try {
          if (val[active].image != old[oldActive].image || !val[active].image) {
            this.$set(this.waveSetting, "maskImage", "");
            this.$set(this.waveSetting, "show", false);
          }
        } catch (error) {
          console.warn(`${error}`);
          this.$set(this.waveSetting, "maskImage", "");
          this.$set(this.waveSetting, "show", false);
        }
      },
      deep: true,
    },
    theme: {
      handler(v) {
        if (this.isDesign && this.$designer && v && !this.isModel) {
          this.$designer.styleTheme = v;
        }
      },
    },
    designerTheme: {
      handler(v) {
        if (this.isDesign && this.$designer && v) {
          this.$designer.designerTheme = v;
        }
      },
      immediate: true,
    },
    customThemeStyleColorSeriesList: {
      handler(v) {
        this.initCustomSeriesList(v);
      },
      deep: true,
    },
    themeStyleColorSeries: {
      handler(v) {
        if (this.isDesign && this.$designer && v) {
          this.$designer.styleColorSeries = v;
        }
      },
    },
    pageFontFamily(val) {
      try {
        this.$designer &&
          this.$designer.pageTotalCssChangeStyle({
            value: val,
            field: "fontFamily",
          });
      } catch (error) {
        console.warn(`error-${error}`);
      }
    },
    pageFonts() {},
    //设备切换
    deviceType(v) {
      if (v === "pc") {
        this.$emit("update:designActive", ">=1920");
      } else {
        this.$emit("update:designActive", "<768");
      }
      if (this.isDesign) {
        this.$designer && this.$designer.changeDevice && this.$designer.changeDevice(v);
      }
    },
    //监听到设备分辨率改变
    designerRatio: {
      handler(v, o) {
        if (this.isDesign) {
          let width = v.width;
          if (width > 1366) {
            this.$emit("update:designActive", ">=1920");
          } else if (width >= 1200 && width <= 1366) {
            this.$emit("update:designActive", ">=1200");
          } else if (width >= 768 && width < 1200) {
            this.$emit("update:designActive", ">=768");
          } else if (width < 768) {
            this.$emit("update:designActive", "<768");
          }
          if (v && o && v.width == o.width && v.height == o.height) {
            return false;
          }
          this.$designer && this.$designer.changeDevice && this.$designer.changeDevice(v);
          this.resizeComponent();
        }
      },
      deep: true,
    },
    //是否显示页面标题
    hasDataViewHead() {
      this.resizeComponent();
    },
    currentLevel() {
      this.resizeComponent();
    },
    designActive: {
      handler(screen, old) {
        if (!this.isDesign) return false;
        this.active = screen;
        this.$nextTick(this.setEffects);
        let device = this.designerRatio;
        let { width } = device;
        switch (screen) {
          case ">=1920":
            //如果不符合当前设备的分辨率，则重置
            if (width < 1920) {
              device = device_1;
            }
            break;
          case ">=1200":
            //如果不符合当前设备的分辨率，则重置
            if (width < 1200 || width > 1366) {
              device = device_2;
            }
            break;
          case ">=768":
            //如果不符合当前设备的分辨率，则重置
            if (width < 768 || width >= 1200) {
              device = device_3;
            }
            break;
          case "<768":
            //如果不符合当前设备的分辨率，则重置
            if (width >= 768) {
              device = device_4;
            }
            break;
        }
        this.$designer && this.$designer.changeDevice && this.$designer.changeDevice(device);
        this.$emit("update:designerRatio", device);
      },
      immediate: true,
    },
    showAll() {
      this.resizeComponent();
    },
    height: {
      handler(v) {
        if (this.isDesign) {
          let height = v;
          if (!v) {
            height = "auto";
          }
          if (dsf.isNumber(height)) {
            height += "px";
          }
          this.$dispatch("design-height-change", height);
        }
      },
      immediate: true,
    },
    headHeight(v, o) {
      setTimeout(this.resizeComponent);
    },
    containerHeight() {
      if (this.isModel) {
        setTimeout(this.resizeComponent);
      }
    },
    layout: {
      handler(v) {
        if (this.isDesign) {
          _.forEach(v, (item) => {
            if (!item.layout[">=1920"]) {
              item.layout[">=1920"] = item.layout[">=1200"];
            }
          });
          this.resizeComponent();
        }
      },
    },
    effectsName: {
      handler(name) {
        if (this.isDesign) {
          let config = {};
          if (this.effectsMap.has(name)) {
            let url = this.effectsMap.get(name);
            url.then((res) => {
              config = res.config;
              this.$emit("update:effectsConfig", config);
            });
          }
          this.$emit("update:effectsConfig", config);
        }
      },
      deep: true,
    },
    effectsConfig: {
      handler() {
        if (this.isDesign) {
          this.setEffects();
        }
      },
      deep: true,
    },
  },
  created() {
    import(/* webpackChunkName: "dataview_theme_form",webpackMode: "lazy" */ "_dataview/output/config/select.js").then((res) => {
      const defaultTheme = res.createSelectStyleVar();
      this.themeVarConfig = dsf.mix(true, {}, defaultTheme, dsf.dataview.extendSelectThemeConfig);
    });
    // 模型风格
    if (this.isModel) {
      const styleTheme = this.theme;
      import(/* webpackChunkName: "dataview_theme",webpackMode: "lazy" */ "_dataview/output/dataviewStyle/index.js").then((res) => {
        const styles = res.default.concat(dsf.dataview.extendStyle);
        const theme = styles.find((it) => it.value === styleTheme);
        theme && this.changePageStyle(styleTheme, theme);
      });
    }
    if (!this.isPreview) {
      if (dsf.isFunction(this.resetFontsize)) {
        this.setFontsize = this.resetFontsize;
      }
      // 设置根元素大小
      this.setFontsize();
      window.addEventListener("resize", this.setFontsize);
      this.initPageEvent();
    }
    // 加载外部字体文件
    this.loadExtendFonts();
  },
  mounted() {
    this.initCustomSeriesList();

    // 如果支持--ResizeObserver API
    if (!this.isDesign && window.ResizeObserver && this.isResizeObserve) {
      const resizeObserveDom = this.resizeObserveDom;
      const bound = resizeObserveDom && document.querySelector(resizeObserveDom) ? document.querySelector(resizeObserveDom) : this.$el.parentNode;
      const resizeObserver = new ResizeObserver(
        _.debounce((entries) => {
          for (const entry of entries) {
            const rect = entry.contentRect;
            if (rect) {
              this._debounceResize();
            }
          }
        }),
        300
      );
      resizeObserver.observe(bound);
      this.resizeObserver = resizeObserver;
    }
    // 加载波纹动效
    this.loadWave();
    //初始化gis一张图页面事件
    this.initGisEvent();
    this.isPageLoaded = true;
    // 定时刷新
    this.refreshData();
  },
  methods: {
    /**
     * 初始化自定义颜色列表
     */
    initCustomSeriesList(customThemeStyleColorSeriesList = this.customThemeStyleColorSeriesList) {
      if (this.isDesign && this.$designer) {
        this.$designer.customThemeStyleColorSeriesList = customThemeStyleColorSeriesList;
        let item = customThemeStyleColorSeriesList.find((item) => item.id === this.themeStyleColorSeries);
        if (item) {
          this.$designer.changeColorSeries(item);
        }
      }
    },

    /**
     * 切换页面风格
     */
    changePageStyle(styleTheme, theme) {
      //更新页面背景
      const page = this;
      page.theme = styleTheme;
      page.themeStyleColorSeries = "";
      let config = page.backgroundConfig;

      let style = theme.style;
      const dataviewPageStyle = style.dataviewPage;
      const { dialogConfig, popupConfig } = style;
      let { backgroundConfig, ...keys } = dataviewPageStyle;

      backgroundConfig = dsf.mix(true, {}, backgroundConfig);
      if (["custom", "pattern"].includes(backgroundConfig.active)) {
        let image = backgroundConfig[backgroundConfig.active].image;
        backgroundConfig[backgroundConfig.active].image = image;
      }
      config = {
        ...config,
        ...backgroundConfig,
      };
      page.backgroundConfig = config;

      page.$emit("update:backgroundConfig", config);

      const props = Object.keys(page.$props);

      Object.keys(keys).forEach((key) => {
        if (props.includes(key)) {
          page.$emit(`update:${key}`, dataviewPageStyle[key]);
        }
      });
      // 替换弹窗风格
      let vmDialogConfig = [];
      _.each(page.dialogConfig, (item) => {
        if (item.relativeStyle) {
          vmDialogConfig.push(dsf.mix(true, {}, item, dialogConfig));
        } else {
          vmDialogConfig.push(item);
        }
      });
      page.$emit("update:dialogConfig", vmDialogConfig);
      // 替换悬浮框风格
      let vmPopupConfig = [];
      _.each(page.popupConfig, (item) => {
        if (item.relativeStyle) {
          vmPopupConfig.push(dsf.mix(true, {}, item, popupConfig));
        } else {
          vmPopupConfig.push(item);
        }
      });
      page.$emit("update:popupConfig", vmPopupConfig);
      // 子组件
      const _recursePage = (components, callback) => {
        components.forEach((it) => {
          callback(it);
          if (it.$children && it.$children.length) {
            _recursePage(it.$children, callback);
          }
        });
      };
      _recursePage([page], (comp) => {
        if (comp.isDataViewControl && comp.handlerCurrentStyleConfig && !comp.isLayoutTree) {
          comp.handlerCurrentStyleConfig(theme);
        }
      });
    },

    /**
     * 加载波纹动效
     */
    loadWave() {
      const waveSetting = this.waveSetting;
      if (!this.isDesign && (!waveSetting.show || !waveSetting.maskImage)) return false;
      // 背景波纹动效
      this.loadTweenMaxScript(() => {
        const timeline = new TimelineMax({
          repeat: -1,
          yoyo: true,
        });
        this.timeline = timeline;

        const heatTurbulence = document.querySelector(`#${this.heatTurbulence}`);

        timeline.add(
          TweenMax.to(heatTurbulence, 8, {
            onUpdate: function () {
              var bfX = this.progress() * 0.01 + 0.025,
                bfY = this.progress() * 0.003 + 0.01,
                bfStr = bfX.toString() + " " + bfY.toString();
              heatTurbulence.setAttribute("baseFrequency", bfStr);
            },
          }),
          0
        );
      });
    },

    /**
     * 移除fitType===fit 产生的额外元素
     */
    removeFitResize() {
      const dom = document.querySelector("#ignore-style");
      dom && dom.remove();
    },

    /**
     * 宽高铺满容器  fitType===fit
     */
    fitResize() {
      const ignores = [".amap-container"];
      let ignoreStyleDOM = document.querySelector("#ignore-style");
      if (!ignoreStyleDOM) {
        const style = document.createElement("style");
        style.lang = "text/css";
        style.id = "ignore-style";
        document.body.appendChild(style);
        ignoreStyleDOM = style;
      }

      const resizeEl = this.$refs.fullPage;
      let { width, height } = this.designerRatio;

      const el = this.$el;
      const { clientHeight, clientWidth } = el.parentNode;
      const scale = clientWidth / clientHeight < width / height ? clientWidth / width : clientHeight / height;

      resizeEl.style.height = `${width}px`;
      resizeEl.style.width = `${height}px`;
      resizeEl.style.transformOrigin = `0 0`;
      resizeEl.style.overflow = "hidden";
      resizeEl.style.height = `${clientHeight / scale}px`;
      resizeEl.style.width = `${clientWidth / scale}px`;
      resizeEl.style.transform = `scale(${scale})`;
      // 暴露给全局 在3d地球使用html2canvas
      window.dataviewPageScale = scale;

      const realScale = 1 / scale;
      for (let item of ignores) {
        ignoreStyleDOM.innerHTML += `\n${item} {
          transform: scale(${realScale});
          transform-origin: 0 0;
       }`;
      }
    },

    /**
     *页面缩放比
     */
    getPageRatio() {
      // 存在一定的缺陷
      try {
        return window.top.outerWidth && window.top.innerWidth ? window.top.outerWidth / window.top.innerWidth : 1;
      } catch (error) {
        return typeof this.pageRatio === "function" ? this.pageRatio() : this.pageRatio;
      }
    },

    /**
     * 宽高等比缩放
     */
    ratioResize() {
      const bound = this.$el.parentNode;
      const page = this.$refs.fullPage;
      const mode = this.fitType;

      const { width, height } = this.designerRatio;
      // 页面的缩放大小
      let pageRatio = this.getPageRatio();

      pageRatio = Math.floor(pageRatio * 100);
      let ratio = pageRatio / 100;
      //如果误差小于0.1
      ratio = Math.abs(ratio - 1) < 0.1 ? 1 : ratio;

      const { clientWidth, clientHeight } = bound;

      let scale = 1;
      let transform = "";
      switch (mode) {
        // 以宽度为准
        case "vertical":
          scale = (clientWidth * ratio) / width;
          const _height = height * scale;
          let halfTop = 0;
          if (_height < clientHeight) {
            halfTop = Math.floor((clientHeight - _height) / 2);
          }
          const verticalAlign = this.verticalAlign;

          if (verticalAlign === "top") {
            halfTop = 0;
          } else if (verticalAlign === "bottom") {
            halfTop = halfTop * 2;
          }
          transform = `translateY(${halfTop}px) scale(${scale})`;
          break;
        // 以高度为准
        case "horizontal":
          scale = (clientHeight * ratio) / height;
          const _width = width * scale;
          let halfLeft = 0;
          if (_width < clientWidth) {
            halfLeft = Math.floor((clientWidth - _width) / 2);
          }
          const horizontalAlign = this.horizontalAlign;

          if (horizontalAlign === "left") {
            halfLeft = 0;
          } else if (horizontalAlign === "right") {
            halfLeft = halfLeft * 2;
          }
          transform = `translateX(${halfLeft}px) scale(${scale}) `;
          break;
        // 同比反向放大
        case "ratio":
          scale = clientWidth / width;
          transform = `scale(${scale})`;
          // this.$el.style.width = `${width * scale}px`;
          // this.$el.style.height = `${height * scale}px`;
          break;
      }
      page.style.width = `${width}px`;
      page.style.height = `${height}px`;
      page.style.transformOrigin = `0 0`;
      page.style.transform = transform;
    },
    setGridItemStyle(it, item) {
      let { x, y, w, h, zIndex, show = true, penetrate, overflow = "hidden" } = it;
      let { colNum, colNumUnit = "%", rowHeight, rowHeightUnit = "%" } = item;
      const itemWidth = colNumUnit === "%" ? this.containerWidth / colNum : colNum;

      let itemHeight = 0;

      if (rowHeightUnit === "px") {
        itemHeight = rowHeight;
      } else {
        const rate = parseFloat(rowHeight);
        itemHeight = (this.containerHeight / 100) * rate;
      }
      return {
        width: `${w * itemWidth}px`,
        height: `${h * itemHeight}px`,
        top: `${y * itemHeight}px`,
        left: `${x * itemWidth}px`,
        zIndex: zIndex === undefined ? 1 : zIndex,
        "pointer-events": show ? (this.isPreview ? "auto" : penetrate ? "none" : "auto") : "none",
        opacity: show ? 1 : 0,
        overflow,
      };
    },

    /**
     * 获取页面的真实宽高 宽度只有在像素比布局有效
     */
    getPageWidthHeight() {
      const heights = []; // 可能存在多个层级
      const widths = [];
      //是否是像素布局
      let isPx = false;
      _.forEach(this.layout, (item) => {
        const { rowHeight, layout, colNumUnit } = item;
        _.forEach(layout[this.active], (it) => {
          let height = rowHeight * (it.y + it.h);
          let width = "";
          if (colNumUnit === "px") {
            height = height + this.headHeight;
            width = it.x + it.w;
            isPx = true;
          } else {
            height = (height / 100) * this.containerHeight + this.headHeight;
            width = ((it.x + it.w) / 100) * this.containerWidth;
          }
          heights.push(height);
          width && widths.push(width);
        });
      });

      const maxContentHeight = Math.max(...heights, this.containerHeight + this.headHeight);
      const maxContentWidth = isPx ? Math.max(...widths, this.containerWidth) : null;
      // console.log("maxContentHeight", maxContentHeight);
      return { maxContentWidth, maxContentHeight };
    },
    /**
     * 设置页面实际高度
     */
    setPageHeight() {
      const { maxContentWidth, maxContentHeight } = this.getPageWidthHeight();
      //如果是像素布局则需要设置宽度
      if (maxContentWidth) {
        this.$refs.dataViewPage.style.width = maxContentWidth + "px";
      }
      this.$refs.dataViewPage.style.height = maxContentHeight + "px";
    },

    /**
     * 设置页面宽高
     */
    setContainerSize() {
      const el = this.$refs.box;
      if (!el) return false;

      let { clientWidth, clientHeight } = el;

      this.containerWidth = clientWidth;

      if (this.isPreview) {
        this.containerHeight = clientHeight;
      } else {
        const parentNode = this.fitType != "default" ? this.$refs.fullPage : this.$el.parentNode;
        this.containerWidth = parentNode.clientWidth;
        this.containerHeight = parentNode.clientHeight - this.headHeight;

        //大于1366  以 1920 为准
        if (clientWidth > 1366 && this.active !== ">=1920") {
          this.active = ">=1920";
          //14寸电脑 1366*768
        } else if (clientWidth >= 1200 && clientWidth <= 1366 && this.active !== ">=1200") {
          this.active = ">=1200";
          //平板
        } else if (clientWidth >= 768 && clientWidth < 1200 && this.active !== ">=768") {
          this.active = ">=768";
          //移动端
        } else if (clientWidth < 768 && this.active !== "<768") {
          this.active = "<768";
        }
      }
    },
    resize() {
      this._debounceResize();
    },
    _debounceResize() {
      if (!this.isPreview) {
        // 页面等比缩放
        if (["vertical", "horizontal", "ratio"].includes(this.fitType)) {
          this.ratioResize();
        }
        // 页面等比拉满布局
        if (this.fitType === "fit") {
          this.fitResize();
        }
        //设置特效,防止滚动条
        this.$nextTick(() => {
          this.setEffects();
        });
      }
      this.resizeComponent();
    },

    resizeComponent() {
      this.$nextTick(() => {
        this.setContainerSize();
        if (!this.isPreview) {
          this.setPageHeight();
        }
        _.each(this.$children || [], (it) => {
          dsf.resizeComponent(it);
        });
      });
    },
    /**
     * 应用4种设备布局转换方法
     * @param {Object} item 布局模板
     */
    changeDeviceRatio(item) {
      const from = item.value;
      this.layout.forEach((it) => {
        const layout = it.layout;
        Object.keys(layout).forEach((key) => {
          if (key != from && layout[from]) {
            layout[key] = dsf.mix(true, [], layout[from]);
          }
        });
      });

      dsf.resizeComponent(this);
    },
    resetEnterAnimate() {
      if (this.isDesign) {
        if (this.$el) {
          this.$el.style["animation-name"] = "none";
          this.$nextTick(() => {
            setTimeout(() => {
              this.$el.style["animation-name"] = this.enterAnimate.animation[0]; // 然后重新设置动画名称
            }, 20); // 等待下一个DOM更新周期
          });
        }
      }
    },
    async loadExtendFonts() {
      const url = dsf.url.getWebPath("font/manage/getFontList", $$webRoot.dataview);
      try {
        const res = await this.$http.get(url, {});
        const data = res.data.data;
        for (let i = 0; i < data.length; i++) {
          const { name: text, value, url } = data[i];
          if (url && JSON.parse(url).length) {
            const fileId = JSON.parse(url)[0].id;
            const fontUrl = dsf.url.getWebPath("/file/sdk/download?files=" + fileId, $$webRoot.dataview);
            const font = new FontFace(value, `url(${fontUrl})`);
            document.fonts.add(font);
            font.load();
          }
          if (this.isDesign) {
            dsf.dataview.designer.fonts.push({ text, value });
          }
        }
      } catch (error) {
        console.warn(error);
      }
    },
    dvBackgroundFormat(config) {
      return dsf.dataview.utils.$backgroundFormat(config);
    },
    // 设置根fontsize
    setFontsize() {
      let ScreenRatio = 1;

      if (this.fitType === "default") {
        try {
          ScreenRatio = window.top.outerWidth && window.top.innerWidth ? window.top.outerWidth / window.top.innerWidth : 1;
        } catch (error) {
          ScreenRatio = typeof this.pageRatio === "function" ? this.pageRatio() : this.pageRatio;
        }
      }
      ScreenRatio = Math.abs(ScreenRatio - 1) < 0.1 ? 1 : ScreenRatio;

      // 移动端
      if (document.body.clientWidth < 768) {
        let fontSize = (document.body.clientWidth / 750) * 100;
        document.documentElement.style.fontSize = fontSize * ScreenRatio + "px";
      } else {
        document.documentElement.style.fontSize = 50 * ScreenRatio + "px";
      }
    },

    handleChangeActiveScreen(screen) {
      this.active = screen;
    },
    refreshData() {
      if (this.isRefreshData && !this.isPreview) {
        this.refreshTimer = setTimeout(() => {
          let components = this.$vm.$refs;
          for (let key in components) {
            let component = components[key];
            //如果不是静态和表格数据，则需要刷新数据
            if (component.dataType && component.dataType != "static" && component.dataType != "excel") {
              component.init();
            }
          }
          this.refreshData();
        }, this.refreshTime * 60 * 1000);
      }
    },
    //改变插槽大小
    changSizeSlot(grid) {
      if (!Array.isArray(grid)) {
        grid = [grid];
      }
      grid.forEach((i) => {
        let slotName = `area-${i}-${this.currentLevel}`;
        const slot = this.slots.find((it) => it.name === slotName);
        if (slot) {
          slot.controls.forEach((key) => {
            const el = $(`[des-id=${key.designId}]`)[0];
            if (el && el.__vue__) {
              dsf.resizeComponent(el.__vue__);
            }
          });
        }
      });
    },
    //选中插槽里面的组件
    selectSlot(item) {
      let slotName = `area-${item.i}-${this.currentLevel}`;
      const el = $(`[slot-name=${slotName}]`);
      const proxy = el.find(".designer-ctrl-proxy");
      if (proxy.length) {
        this.$designer.clearSelectedComponent();
        this.$designer.clearSelectedSlot();
        this.$nextTick(() => {
          proxy[0].gridItem = item.i;
          this.$designer.selectedComponent($(proxy[0]));
        });
      } else {
        this.$designer.selectPage();
      }
    },

    getSlotName({ i }, index) {
      return `area-${i}-${index + 1}`;
    },
    handleShow(index) {
      if (this.isDesign) {
        return this.showAll ? true : index + 1 === this.currentLevel;
      }
      return true;
    },

    setEffects() {
      if (this.effectsBackGround) {
        this.effectsBackGround.clear();
      }
      let EffectName = this.effectsName;
      let config = this.effectsConfig;
      if (EffectName && EffectName !== "none") {
        let url = this.effectsMap.get(EffectName);
        url.then((res) => {
          let EffectsClass = res.fac;
          this.effectsBackGround = new EffectsClass({
            el: this.$refs.dataViewPage,
            ...config,
          });
          this.effectsBackGround.init();
        });
      }
    },
    // 相关事件作用域处理
    handleEventScope() {
      if (this.executeFnScope && !this.isPreview) {
        this.eventScope = utilsHandleScope(this, this.executeFnScope, true);
      }
    },
    // 组件伪代码统一入口
    handleCommonEmit(code, data) {
      if (!this.isPreview && code) {
        try {
          let page = this.$vm;
          //给作用域注入 vm page data
          this.eventScope.vm = this;
          this.eventScope.page = page;
          this.eventScope.data = data;
          let query = this.$route.query;
          //在viewpart中打开页面-gis运行一张图
          if (page.$frame) {
            let localParams = page.$frame.localParams;
            query = { ...query, ...localParams };
          }
          this.eventScope["路径参数"] = query;
          this.eventScope["全局参数"] = page.$dataview;

          let callback = utilsHandleParseCode(code);

          callback.call(this, this.eventScope);
        } catch (error) {
          console.warn("伪代码执行失败", error);
        }
      }
    },
    //gis加载完成事件
    gisLoadEvents(data) {
      try {
        let { fn } = this.gisEventRelative.load;
        if (!fn) return false;
        //给组件设置当前数据
        this.currentComponentData = data;
        this.handleCommonEmit(fn, data);
      } catch (e) {
        console.error(e);
      }
    },
    gisPolygonClickEvent(data) {
      try {
        let { fn } = this.gisEventRelative.districtClick;
        if (!fn) return false;

        //给组件设置当前数据
        this.currentComponentData = data;
        this.handleCommonEmit(fn, data);
      } catch (e) {
        console.error(e);
      }
    },
    //初始化gis一张图运行事件
    initGisEvent() {
      //如果在gis一张图下运行
      if (this.isGisViewPart && !this.isPreview) {
        //子组件加载完成
        this.$nextTick(() => {
          //绑定函数执行上下文
          this.handleEventScope();
          let gisComponent = this.$parent?.pageProps?.gisVm;
          if (gisComponent) {
            //如果改地图已经加载完成
            if (gisComponent.isLoadMap) {
              this.gisLoadEvents();
            } else {
              dsf.emit.$on("GISLoad", this.gisLoadEvents, window);
            }
            dsf.emit.$on("GISPolygonClick", this.gisPolygonClickEvent, window);
          }
        });
      }
    },
    //获取页面的密级属性
    getConfidentiality() {
      let allComponents = this.$designer.allComponents;
      let keys = Object.keys(allComponents);
      let confidentialityLevel = "";
      let confidentialityLevelText = "";
      let releaseSecretTime = "";
      for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        let comp = allComponents[key];
        if (comp.confidentiality) {
          confidentialityLevel = comp.confidentialityLevel;
          confidentialityLevelText = comp.confidentialityLevelText;
          releaseSecretTime = comp.releaseSecretTime;
          break;
        }
      }

      return {
        confidentialityLevel,
        confidentialityLevelText,
        releaseSecretTime,
      };
    },
    clear() {
      let backgroundConfig = this.backgroundConfig;
      backgroundConfig.image = "";
      this.$emit("update:backgroundConfig", backgroundConfig);
      return backgroundConfig;
    },
    gotoPreview() {
      let previewUrl = "";
      let baseUrl = "~/designer.html#/dataViewDesign"; // + (this.pageType == "question" ? "#/question" : "#/pc/page");
      if (this.openDesignerUrl) {
        baseUrl = this.openDesignerUrl;
      }
      if (this.$vm) {
        let arr = this.$vm.nameSpace.split(".");
        let b = arr[0];
        let m = arr.slice(1).join(".");
        let p = this.$vm.pageName;
        previewUrl = dsf.url.getWebPath(`${baseUrl}?B=${b}&M=${m}&pname=${p}&title=${this.title}&templateType=1`);
        window.open(previewUrl, "_blank");
      }
    },
    loadTweenMaxScript(callback) {
      if (window.TweenMax) {
        callback?.();
      } else {
        this.$http
          .importFiles([this.$getWebPath("static/js/libs/TweenMax/TweenMax.min.js", __DSF_DATAVIEW_PATH__)])
          .then(() => {
            callback?.();
          })
          .catch((err) => {
            console.error(err);
            dsf.layer.message("加载TweenMax文件报错", false);
          });
      }
    },
    addFonts(data) {
      data.dictionary = dsf.dataview.designer.fonts;
    },

    /**
     * 初始化页面事件
     */
    initPageEvent() {
      try {
        let page = this.$vm;
        let eventScope = {
          page: page,
        };
        let query = this.$route.query;
        //在viewpart中打开页面-gis运行一张图
        if (page.$frame) {
          let localParams = page.$frame.localParams;
          query = { ...query, ...localParams };
        }

        eventScope["路径参数"] = query;
        eventScope["全局参数"] = page.$dataview;
        let callback = utilsHandleParseCode(this.initDealDataFunction);

        callback.call(this, eventScope);
      } catch (error) {
        console.warn("伪代码执行失败", error);
      }
    },
    /**
     * @description: 取消
     * @return {*}
     */
    cancelSomeThing() {
      this.cancelFileList(); // 取消文件
      this.cancelRequestList(); // 取消接口
    },
    /**
     * @description: 取消加载文件
     */
    cancelFileList() {
      this.requestFileList.forEach((obj) => {
        if (obj && typeof obj === "object") {
          obj.__CANCEL__ = true;
        }
      });
      this.requestFileList = [];
    },
    /**
     * @description: 取消请求
     */
    cancelRequestList() {
      this.requestInterfaceList.forEach((obj) => {
        obj.source?.cancel();
      });
      this.requestInterfaceList = [];
    },
  },
  beforeDestroy() {
    this.cancelSomeThing();
    // 移除fit 布局产生的dom元素
    this.removeFitResize();
    this.timeline && this.timeline.kill();

    this.$el.removeEventListener("animationend", this.handleEnterAnimateEnd);
    this.effectsBackGround?.clear?.();

    clearTimeout(this.refreshTimer);
    //移除gis这一张图事件
    dsf.emit.$remove("GISLoad", window, this.gisLoadEvents);
    dsf.emit.$remove("GISPolygonClick", window, this.gisPolygonClickEvent);

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }

    !this.isPreview && window.removeEventListener("resize", this.setFontsize);

    //摧毁悬浮框
    for (const key in this.popupDialogs) {
      const { popupInstance } = this.popupDialogs[key];
      popupInstance.$destroy();
      popupInstance.$el.parentNode?.removeChild(popupInstance.$el);
    }
  },
  design: {
    //设计器是是否在组件上产生遮罩
    isMask: false,
  },
});
</script>
