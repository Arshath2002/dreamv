<!--
 * @Editor: zhanghang
 * @Description: 
 * @Date: 2024-06-11 11:09:50
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-06-11 14:05:33
-->
<template>
  <div
    class="data-view-item-wrap ds-control data-view-no-padding dv-three-map"
    :style="{
      ...controlStyle,
      ...getCommonEnterAnimateStyle,
    }"
    v-loading="dataLoad"
    :element-loading-text="loadingText"
    :element-loading-spinner="loadingSpinner"
    :element-loading-background="loadingBackground"
  >
    <div ref="map" class="dv-three-map-canvas"></div>
    <div ref="tooltip" class="dv-three-tooltip"></div>
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
    <!-- 返回按钮 -->
    <div class="back-three-map" @click="backMapFn" :style="backStyle" v-if="showBack">
      <template v-if="isDesign">
        <DsfIcon name="zuo" :style="{ fontSize: backStyle.fontSize }" />
        {{ area.showName }}
      </template>
      <template v-else>
        <slot name="back-btn" :data="mapList">
          <DsfIcon name="zuo" :style="{ fontSize: backStyle.fontSize }" />
          {{ mapList[mapList.length - 2].name }}
        </slot>
      </template>
    </div>
    <div class="design-tip" v-if="isDesign">
      <p>按住Ctrl键+鼠标右键调整初始视角</p>
    </div>
  </div>
</template>
<script>
import ThreeMap from "./ThreeMap.js";
import defaultOptions from "_dataview/output/three/options/threeOption.js";
import dataAndGraphRelationMixin from "_dataview/mixins/dataAndGraphRelationMixin.js";
import { eventTemp } from "_dataview/output/utils/relativeEvent";
const staticDataKeyDic = {
  name: "名称",
  adcode: "行政编码",
  value: "值",
  startPoint: "起点（飞行线）",
  endPoint: "终点（飞行线）",
};
let staticData = [
  {
    name: "四川省",
    adcode: "510000",
    value: "100",
    startPoint: "510000",
    endPoint: "110000",
  },
  {
    name: "北京",
    adcode: "110000",
    value: "200",
    startPoint: "",
    endPoint: "",
  },
  {
    name: "上海",
    adcode: "310000",
    value: "200",
    startPoint: "310000",
    endPoint: "110000",
  },
  {
    name: "湖南",
    adcode: "430000",
    value: "100",
    startPoint: "430000",
    endPoint: "110000",
  },
];
export default dsf.component({
  name: "DsfDataViewThreeMap",
  ctrlCaption: "基础3D地图",
  mixins: [$mixins.dataView, dataAndGraphRelationMixin],
  props: {
    //加载
    area: {
      type: Object,
      default() {
        return {
          area: "100000",
          showName: "中国",
          url: "",
          // 自定义上传列表
          areaList: [],
        };
      },
    },
    isDown: {
      type: Boolean,
      default: false,
    },
    backText: {
      type: Object,
      default() {
        return {
          fontFamily: "Microsoft Yahei", // 字体
          fontSize: "12px", // 字号
          color: "#FFFFFF", // 颜色
          fontWeight: "normal", // 加醋
          fontStyle: "normal", // 斜体
          textDecoration: "none", // 下划线
          margin: [0, 0, 0, 0], // 外边距
          algin: {
            vAlign: "top",
            hAlign: "left",
          },
        };
      },
    },
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
          dblclick: {
            relatives: [],
            fn: eventTemp,
          },
          back: {
            relatives: [],
            fn: eventTemp,
          },
        };
      },
    },
    // 延迟渲染
    delayRender: {
      type: Number,
      default: 0,
    },
    //风格对应组件key
    styleMapKey: {
      type: String,
      default: "threeMap",
    },
  },
  data() {
    return {
      mapJson: null,
      // 组件类型
      componentType: "threeMap",
      //地图列表
      mapList: [],
      // 是否下钻
      isInHole: false,
      isCtrl: false,
    };
  },
  computed: {
    showBack() {
      return (this.isDesign && this.isDown) || this.mapList.length > 1;
    },
    backStyle() {
      let {
        fontSize,
        margin,
        color,
        algin: { vAlign, hAlign },
      } = this.backText;
      let style = {
        color,
        margin: dsf.dataview.utils.transformArrayPx(margin),
        fontSize: dsf.dataview.utils.transformPx(fontSize),
      };
      switch (vAlign) {
        case "top":
          style.top = 0;
          break;
        case "middle":
          style.top = "50%";
          style.transform = "translateY(-50%)";
          break;
        case "bottom":
          style.bottom = 0;
          break;
      }
      switch (hAlign) {
        case "left":
          style.left = 0;
          break;
        case "center":
          style.left = "50%";
          style.transform = style.transform + "translateX(-50%)";
          break;
        case "right":
          style.right = 0;
          break;
      }
      return style;
    },
    range() {
      return this.threeOptions.itemStyle.range;
    },
    // 视觉映射样式
    getVisualMapItemStyle() {
      const { range } = this.threeOptions.itemStyle;
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
      const { range } = this.threeOptions.itemStyle;
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
  watch: {
    area: {
      handler(val) {
        this.$nextTick(() => {
          if (this.isDesign) {
            const { area, showName, url } = this.area;
            if (url) {
              this.threeOptions.map = url;
              this.threeOptions.mapName = showName;
            } else {
              this.threeOptions.map = area;
              this.threeOptions.mapName = showName;
            }

            this.map &&
              this.map.registerMap(this.threeOptions.map, this.threeOptions.config).then((mapJson) => {
                this.mapJson = mapJson;
                this.init();
              });
          }
        });
      },
      deep: true,
    },
  },
  created() {
    //兼容 areaList 列表
    const area = this.area;
    const { url, showName } = area;
    if (Array.isArray(url)) {
      this.$set(area, "areaList", url);
      const urlItem = url.find((it) => it.text == showName);
      area.url = urlItem ? urlItem.value : "";
      this.$emit("update:area", area);
    }

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
        const threeOptions = args.threeOptions;
        this.$emit("update:threeOptions", threeOptions);
        //在option 获取之后执行
        setTimeout(() => {
          this.middleWareData(this.serviceData);
        });
      },
      this
    );
  },
  mounted() {
    document.addEventListener("keydown", this.keyBoard, false);
    document.addEventListener("keyup", this.keyBoardUp, false);
  },
  methods: {
    styleConfigCallback(style) {
      dsf.mix(true, this.threeOptions, style);
      this.mapJson && this.reset();
    },
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
    //地图返回
    backMapFn() {
      if (this.isDesign) return false;
      this.mapList.pop();
      let o = this.mapList[this.mapList.length - 1];
      let code = o.value;
      let mapName = o.name;
      this.threeOptions.map = code;
      this.threeOptions.mapName = mapName;
      this.isInHole = true;
      this.reset();
      this.loadBackMapEvents(o);
    },
    loadBackMapEvents(data) {
      let { fn } = this.eventRelativeDeal.back;
      this.currentComponentData = data;
      this.handleCommonEmit(fn, data);
    },
    setCamera(x, y, z) {
      this.map && this.map.setCamera(x, y, z);
    },
    getCamera() {
      this.map && this.map.getCamera();
    },
    setConfig(depth, scale = 100) {
      this.threeOptions.config.depth = depth;
      this.threeOptions.config.scale = scale;
      this.reset();
    },
    /**
     * @Description 地图下钻
     * @param{String} code 切换地图的标识-行政编码
     * @param{String} mapName 地图名称
     */
    handleInChangeMap(code, mapName) {
      if (this.map) {
        // 找出自定义列表的地图列表
        const areaList = this.area.areaList || [];
        const item = areaList.find((it) => it.code === code || it.text === code);
        code = item ? item.value : code;

        this.isInHole = true;

        // 注册地图--初始化
        this.map.registerMap(code, this.threeOptions.config).then((mapJson) => {
          //返回列表
          this.mapList.push({
            name: mapName,
            value: code,
          });

          this.mapJson = mapJson;
          this.threeOptions.map = code;
          this.threeOptions.mapName = mapName || code;
          this.init();
        });
      }
    },
    /**
     * @Description 地图切换
     * @param{String} code 切换地图的标识-行政编码/地址
     * @param{String} mapName 地图名称
     */
    handleChangeMap(code, mapName) {
      if (this.map) {
        // 找出自定义列表的地图列表
        const areaList = this.area.areaList;
        const item = areaList.find((it) => it.code === code || it.text === code);
        code = item ? item.value : code;

        //切换地图不属于下钻
        this.isInHole = false;
        // 清空下钻列表
        this.mapList = [];
        // 注册地图--初始化
        this.map.registerMap(code, this.threeOptions.config).then((mapJson) => {
          this.mapJson = mapJson;
          this.threeOptions.map = code;
          this.threeOptions.mapName = mapName || code;
          this.init();
        });
      }
    },
    getVisualMapColorStyle(color) {
      let style = {};
      style.backgroundColor = color.color;
      return style;
    },

    /**
     * ai 大模型输出数据处理
     * @param {Array} describe 字段描述信息
     * @param {Array} data 数据
     */
    dataModelAnalysis({ describe, data, title }) {
      const dictionary = {};
      describe.forEach(({ title, field }) => {
        dictionary[field] = title;
      });
      const threeOptions = this.threeOptions;
      const range = threeOptions.itemStyle.range;
      range.show = true;

      threeOptions.series = [];
      threeOptions.texture.show = false;
      threeOptions.districtRelation = "district";
      threeOptions.seriesName = title;

      const features = this.mapJson.features;
      if (!Array.isArray(features)) return false;
      try {
        const districtNames = features.map((it) => {
          return [it.properties.name, it.properties.adcode];
        });
        const districtField = describe[0].field;
        threeOptions.nameRelation = districtField;
        for (let i = 1; i < describe.length; i++) {
          const key = describe[i].field;
          const res = dsf.dataview.utils.matchNumberAndSuffix(data[0][key]);
          if (res && isFinite(res.number)) {
            let max = void 0;
            let min = void 0;
            data.forEach((it) => {
              const res = dsf.dataview.utils.matchNumberAndSuffix(it[key]);
              const value = res ? res.number : 0;
              it.value = value;
              it[key + "_unit"] = res.unit || "";
              dictionary.value = "值";
              dictionary[key + "_unit"] = dictionary[key] + "_单位";

              max = max == undefined ? value : Math.max(max, value);
              min = min == undefined ? value : Math.min(min, value);
            });
            if (min && max) {
              range.min = min;
              range.max = max + min;
            }
            threeOptions.valueRelation = "value";
            break;
          }
        }

        // 认为字符串开头两个字符 能够和 districtNames 开头两个字符匹配 则认为是相同
        data.forEach((it) => {
          const name = it[districtField];
          const item = districtNames.find((_) => _[0].startsWith(name.substr(0, 2)));
          if (item) {
            it.district = item[1];
          }
        });
        dictionary.district = "行政编码";
        // 处理成Excel
        const excelData = dsf.dataview.utils.transformToExcelData(data, dictionary);
        this.excelData = excelData;
        this.$emit("update:excelData", excelData);
      } catch (error) {
        console.warn(`error-${error}`);
      }
    },

    dynamicMapAnalysis(data) {
      const { nameRelation, valueRelation, districtRelation, series } = this.threeOptions;
      const mapData = [];
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
      this.threeOptions.data = mapData;

      series.forEach((it) => {
        const startRelation = it.startRelation || "startPoint";
        const endRelation = it.endRelation || "endPoint";
        let districtRelation = it.districtRelation || "adcode";
        let nameRelation = it.nameRelation || "name";
        let valueRelation = it.valueRelation || "value";

        const seriesData = [];
        data.forEach((item) => {
          if (it.type == "flight") {
            if (item[startRelation] && item[endRelation]) {
              let start = item[startRelation];
              let end = item[endRelation];

              if (dsf.isString(start) && ~start.indexOf(",")) {
                start = start.split(",");
              }
              if (dsf.isString(end) && ~end.indexOf(",")) {
                end = end.split(",");
              }

              seriesData.push({
                start,
                end,
              });
            }
          } else {
            if (item[districtRelation]) {
              let name = nameRelation ? item[nameRelation] : undefined;
              let district = item[districtRelation];
              if (dsf.isString(district) && ~district.indexOf(",")) {
                district = district.split(",");
              }
              const itData = {
                ...item,
                district,
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
      setTimeout(() => {
        this.map = new ThreeMap(this.$refs.map, this.$refs.tooltip, { isDesign: this.isDesign });

        // ai 大模型
        if (this.modelArgs && this.modelArgs.district) {
          this.area.area = this.modelArgs.district;
          this.area.showName = this.modelArgs.title;
        }
        const { area, showName, url } = this.area;
        // 存在url 按照url 解析
        if (url) {
          this.threeOptions.map = url;
          this.threeOptions.mapName = showName;
        } else {
          this.threeOptions.map = area;
          this.threeOptions.mapName = showName;
        }
        //放入地图列表
        this.mapList.push({
          name: showName,
          value: this.threeOptions.map,
        });

        this.map.registerMap(this.threeOptions.map, this.threeOptions.config).then((mapJson) => {
          this.mapJson = mapJson;
          this.init();
        });
      }, this.delayRender);
    },
    //创建随机地图数据
    createdDataRandom(mapJson, type) {
      let res = [];
      let features = mapJson.features;
      if (type === "flight") {
        features.slice(0, 10).forEach((it) => {
          res.push(it.properties.adcode);
        });
        let end = res.slice(-1)[0];
        let line = [];
        for (let i = 0; i < res.length - 1; i++) {
          line.push({
            start: res[i],
            end: end,
          });
        }
        return line;
      } else {
        features.slice(0, 10).forEach((it) => {
          res.push({
            district: it.properties.adcode,
            name: it.properties.name,
            value: parseInt(1000 * Math.random()),
          });
        });
        return res;
      }
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
        this.map.off("dblclick");
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

      this.map.on("dblclick", (data) => {
        if (this.$listeners["three-dblclick"]) {
          this.$dispatch("three-dblclick", data);
        }
        this.loadDblClickEvents(data);
      });
      const options = _.cloneDeep(this.threeOptions);
      //处理底座图片前缀
      if (options.foundation && options.foundation.show && options.foundation.image != "default") {
        options.foundation.image = options.foundation.image;
      }
      // 是否强刷新
      const refresh = !this.isInHole;

      this.map.setOption(options, refresh);
      this.updateOptionsDesigner();
    },

    /**
     * 更新设计器内容
     */
    updateOptionsDesigner() {
      if (!this.isDesign) return false;
      const threeOptions = this.threeOptions;
      const threeString = dsf.dataview.utils.objectToString(threeOptions, true);
      this.$emit("update:threeOptions", threeOptions);
      this.$emit("update:threeString", threeString);
    },
    //双击依赖组件关联方法
    loadDblClickEvents(data) {
      let { fn } = this.eventRelativeDeal.dblclick;
      this.currentComponentData = data;
      this.handleCommonEmit(fn, data);
    },

    resize() {
      this.map && this.map.resize();
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
@import "_dataview/assets/styles/share/components/threeMap.scss";
</style>
