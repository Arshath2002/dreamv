<!--
 * @Description: threeJs3D球体
 * @Author: shenah
 * @Date: 2024-08-22 09:07:49
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-02-21 14:59:07
-->

<template>
  <div
    class="data-view-item-wrap ds-control data-view-no-padding dv-three-global-earth"
    :style="{
      ...controlStyle,
      ...getCommonEnterAnimateStyle,
    }"
    v-loading="dataLoad"
    :element-loading-text="loadingText"
    :element-loading-spinner="loadingSpinner"
    :element-loading-background="loadingBackground"
  >
    <!-- 视觉映射 -->
    <div class="three-visual-wrap" v-if="range.show && range.visualMap.show">
      <div class="three-visual" :style="getVisualMapItemStyle">
        <div class="three-visual-gradient" v-if="range.mode == 'range'">
          <div class="gradient" :style="getVisualMapColumnStyle"></div>
          <div class="high">
            <div>{{ range.visualMap.maxText }}</div>
            <div>{{ range.max }}</div>
          </div>
          <div class="low">
            <div>{{ range.visualMap.minText }}</div>
            <div>{{ range.min }}</div>
          </div>
        </div>
        <div class="three-visual-color-group" v-else-if="range.mode == 'separate'">
          <div class="three-visual-color" v-for="(color, colorIndex) in range.rules" :key="colorIndex">
            <div class="color" :style="getVisualMapColorStyle(color)"></div>
            <div class="name">{{ color.label }}</div>
          </div>
        </div>
      </div>
    </div>

    <div ref="map" class="dv-three-global-earth-canvas"></div>
    <div ref="markerTooltip" :style="getTooltipBackground" class="dv-three-earth-marker-tooltip"></div>
    <div class="design-tip" v-if="isDesign">
      <p>按住Ctrl键+鼠标右键调整初始视角</p>
    </div>
  </div>
</template>
<script>
import ThreeEarth from "./ThreeEarth.js";
import defaultOptions from "_dataview/output/earth/earthOption.js";
import dataAndGraphRelationMixin from "_dataview/mixins/dataAndGraphRelationMixin.js";
import { eventTemp } from "_dataview/output/utils/relativeEvent";
import defaultBackground from "_dataview/share/components/common/backgroundDefault.js";
const staticDataKeyDic = {
  name: "名称",
  district: "地点",
  startPoint: "起点（飞行线）",
  endPoint: "终点（飞行线）",
  value: "值",
};
let staticData = [
  {
    name: "北京",
    district: "116.3, 39.9",
    value: "1000",
  },
  {
    name: "上海",
    district: "121.0, 31.0",
    startPoint: "116.3, 39.9",
    endPoint: "121.0, 31.0",
    value: "500",
  },
  {
    name: "西安",
    district: "108.0, 34.0",
    startPoint: "116.3, 39.9",
    endPoint: "108.0, 34.0",
    value: "200",
  },
  {
    name: "成都",
    district: "103.0, 31.0",
    startPoint: "116.3, 39.9",
    endPoint: "103.0, 31.0",
    value: "800",
  },
  {
    name: "乌鲁木齐",
    district: "87.0, 43.0",
    startPoint: "116.3, 39.9",
    endPoint: "87.0, 43.0",
    value: "100",
  },
  {
    name: "拉萨",
    district: "91.06, 29.36",
    startPoint: "116.3, 39.9",
    endPoint: "91.06, 29.36",
    value: "400",
  },
  {
    name: "广州",
    district: "113.0, 23.06",
    startPoint: "116.3, 39.9",
    endPoint: "113.0, 23.06",
    value: "700",
  },
  {
    name: "哈尔滨",
    district: "127.0, 45.5",
    startPoint: "116.3, 39.9",
    endPoint: "127.0, 45.5",
    value: "200",
  },
  {
    name: "沈阳",
    district: "123.43, 41.8",
    startPoint: "116.3, 39.9",
    endPoint: "123.43, 41.8",
    value: "300",
  },
  {
    name: "海口",
    district: "110.0, 20.03",
    startPoint: "116.3, 39.9",
    endPoint: "110.0, 20.03",
    value: "200",
  },
  {
    name: "纽约",
    district: "-74.5, 40.5",
    startPoint: "116.3, 39.9",
    endPoint: "-74.5, 40.5",
    value: "800",
  },
  {
    name: "巴黎",
    district: "2.2, 48.5",
    startPoint: "116.3, 39.9",
    endPoint: "2.2, 48.5",
    value: "200",
  },
];
export default dsf.component({
  name: "DsfDataViewThreeGlobalEarth",
  ctrlCaption: "three3D地球",
  mixins: [$mixins.dataView, dataAndGraphRelationMixin],
  props: {
    //tooltip字段样式显示规则
    fieldsStyleRules: {
      type: Array,
      default() {
        return [];
      },
    },
    staticData: {
      type: Array,
      default() {
        return staticData;
      },
    },
    //表格数据
    excelData: {
      type: Array,
      default: () => {
        return dsf.dataview.utils.transformToExcelData(staticData, staticDataKeyDic);
      },
    },
    //自定义配置总览
    threeOptions: {
      type: Object,
      default() {
        return defaultOptions;
      },
    },
    //three 配置字符串
    threeString: {
      type: String,
      default: "",
    },
    // 提示框背景图
    tooltipBackground: {
      type: Object,
      default() {
        return { ...defaultBackground };
      },
    },
    //事件依赖
    eventRelativeDeal: {
      type: Object,
      default() {
        return {
          //组件初始化事件
          mounted: {
            relatives: [],
            fn: eventTemp,
          },
          //数据加载完成事件
          dataLoad: {
            relatives: [],
            fn: eventTemp,
          },
          //数据处理完成事件
          load: {
            relatives: [],
            fn: eventTemp,
          },
          //数据点击事件
          click: {
            relatives: [],
            fn: eventTemp,
          },
        };
      },
    },
  },
  data() {
    return {
      // 组件类型
      componentType: "threeGlobalEarth",
      isCtrl: false,
    };
  },
  computed: {
    range() {
      if (this.threeOptions.world) {
        return this.threeOptions.world.itemStyle.range;
      }
      return {};
    },
    getTooltipBackground() {
      const background = this.dvBackgroundFormat(this.tooltipBackground);
      return {
        ...background,
      };
    },
    // 视觉映射样式
    getVisualMapItemStyle() {
      const { range } = this.threeOptions.world.itemStyle;
      const { visualMap } = range;
      const { textStyle } = visualMap;
      return {
        color: textStyle.color,
        fontSize: dsf.dataview.utils.transformPx(textStyle.fontSize),
        top: dsf.dataview.utils.transformPx(visualMap.top),
        left: dsf.dataview.utils.transformPx(visualMap.left),
      };
    },
    // 视觉映射渐变样式
    getVisualMapColumnStyle() {
      const { range } = this.threeOptions.world.itemStyle;
      if (range.color && range.color.length) {
        const gradientValue = range.color.map((item, index) => `${item} ${(index / range.color.length) * 100}%`).join();
        ``;
        return {
          "background-color": range.color[0],
          "background-image": `linear-gradient(to top, ${gradientValue})`,
        };
      } else {
        return {};
      }
    },
  },
  mounted() {
    document.addEventListener("keydown", this.keyBoard, false);
    document.addEventListener("keyup", this.keyBoardUp, false);
  },
  created() {
    // threeString 获取 threeString 作为配置项
    if (this.threeString) {
      let threeString = this.threeString;
      let threeOptions = dsf.eval(threeString);
      for (let key in this.threeOptions) {
        Reflect.deleteProperty(this.threeOptions, key);
      }
      Object.assign(this.threeOptions, threeOptions);
      this.$emit("update:threeOptions", threeOptions);
    } else {
      let o = dsf.dataview.utils.objectToString(this.threeOptions, true);
      this.$emit("update:threeString", o);
    }
    dsf.emit.$on(
      "updateThree",
      (args) => {
        console.log("接受");
        // chart
        const threeOptions = args.threeOptions;
        const threeString = dsf.dataview.utils.objectToString(threeOptions, true);
        this.$emit("update:threeOptions", threeOptions);
        this.$emit("update:threeString", threeString);
        //在option 获取之后执行
        setTimeout(() => {
          this.middleWareData(this.serviceData);
        });
      },
      this
    );
  },
  methods: {
    keyBoard(e) {
      if (e.keyCode === 17 && this.isDesign) {
        this.isCtrl = true;
      }
    },
    keyBoardUp(e) {
      if (e.keyCode === 17 && this.isDesign) {
        this.isCtrl = false;
      }
    },
    dynamicMapAnalysis(data) {
      const { series, world } = this.threeOptions;
      if (world) {
        const mapData = [];
        const { nameRelation, valueRelation, districtRelation } = world;
        data.forEach((item) => {
          if (item[districtRelation]) {
            let name = nameRelation ? item[nameRelation] : undefined;
            const itData = {
              ...item,
              district: item[districtRelation],
              value: item[valueRelation],
            };
            if (name) {
              itData.name = name;
            }
            mapData.push(itData);
          }
        });
        world.data = mapData;
      }

      series.forEach((it) => {
        const startRelation = it.startRelation || "startPoint";
        const endRelation = it.endRelation || "endPoint";

        let districtRelation = it.districtRelation || "district";
        let nameRelation = it.nameRelation;
        let valueRelation = it.valueRelation || "value";

        const seriesData = [];
        data.forEach((item) => {
          if (it.type == "flight") {
            if (item[startRelation] && item[endRelation]) {
              let start = item[startRelation];
              let end = item[endRelation];
              start = typeof start === "string" ? start.split(",").map((it) => parseFloat(it)) : start;
              end = typeof end === "string" ? end.split(",").map((it) => parseFloat(it)) : end;
              seriesData.push({
                district: [start, end],
              });
            }
          } else {
            if (item[districtRelation]) {
              let name = nameRelation ? item[nameRelation] : undefined;
              const district = item[districtRelation];
              const itData = {
                ...item,
                district: typeof district === "string" ? district.split(",").map((it) => parseFloat(it)) : district,
                value: item[valueRelation],
              };
              if (name) {
                itData.name = name;
              }
              seriesData.push(itData);
            }
          }
        });
        it.data = seriesData;
      });
    },
    dataAnalysis(data = []) {
      this.data = data;
      this.dynamicMapAnalysis(data);

      if (this.$listeners["interceptOptions"]) {
        this.$dispatch("interceptOptions", { chart: this.threeOptions, vm: this });
      } else {
        this.reset();
      }
    },
    beforeInit() {
      this.map = new ThreeEarth(this.$refs.map, {
        markerId: this.markerId,
        markerTooltip: this.$refs.markerTooltip,
        isDesign: this.isDesign,
      });
      this.init();
    },
    reset() {
      if (!this.map || !this.threeOptions) return false;
      let series = this.threeOptions.series;
      let hasData = false;

      if (series && series.length) {
        for (let i = 0; i < series.length; i++) {
          let it = series[i];
          let data = it.data;
          if (data.length > 0) {
            hasData = true;
            break;
          }
        }
      }
      this.$set(this, "hasData", hasData);
      try {
        this.map.off("click");
        this.map.off("change");
      } catch (error) {
        console.log(error);
      }
      this.map.on("click", (data) => {
        if (this.$listeners["three-click"]) {
          this.$dispatch("three-click", data);
        }
        this.loadClickEvents(data);
      });

      if (this.isDesign) {
        this.map.on("change", () => {
          let result = this.map.getCamera();
          if (result && this.isCtrl) {
            const { x, y, z } = result;
            this.cameraPosition = { x, y, z };
          }
        });
      }

      const options = _.cloneDeep(this.threeOptions);
      //处理图片前缀
      if (!["default", "satellite"].includes(options.earth.texture)) {
        options.earth.texture = options.earth.texture;
      }
      options.satellite.data?.forEach((it) => {
        it.ring.texture = it.ring.texture != "default" ? it.ring.texture : it.ring.texture;
        it.planet.texture = it.planet.texture != "default" ? it.planet.texture : it.planet.texture;
      });

      this.map.setOption(options);
    },
    resize() {
      this.map && this.map.resize();
    },
    getVisualMapColorStyle(color) {
      let style = {};
      style.backgroundColor = color.color;
      return style;
    },
  },
  beforeDestroy() {
    dsf.emit.$remove("updateThree", this);
    document.removeEventListener("keydown", this.keyBoard, false);
    document.removeEventListener("keyup", this.keyBoardUp, false);
    this.map && this.map.destroyMap();
    this.map = null;
  },

  design: {
    metadata: {
      create() {
        if (this.map) {
          let result = this.cameraPosition;
          if (result) {
            const { x, y, z } = result;
            this.threeOptions.camera.x = x;
            this.threeOptions.camera.y = y;
            this.threeOptions.camera.z = z;
            this.threeString = dsf.dataview.utils.objectToString(this.threeOptions, true);
          }
        }
      },
    },
  },
});
</script>
<style lang="scss">
@import "_dataview/assets/styles/share/components/threeGlobalEarth.scss";
</style>
