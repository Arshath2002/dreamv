<!--
 * @Description: gis地图
 * @Author: zhanghang
 * @Date: 2023-09-05 12:03:21
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-06-18 15:53:46
-->
<template>
  <div
    class="data-view-item-wrap ds-control data-view-no-padding dsf-dv-gis data-view-parent-slot-wrap"
    v-loading="loadingMap"
    :element-loading-text="loadingText"
    :element-loading-spinner="loadingSpinner"
    :element-loading-background="loadingBackground"
    :style="{
      ...getCommonEnterAnimateStyle,
    }"
  >
    <div ref="mapBox" class="map" v-if="mapContainer"></div>
    <!-- 图列 -->
    <div class="dsf-dv-gis-legend" :style="legendStyle">
      <template v-for="(item, index) in legendList">
        <div class="legend-item" :key="index" v-if="item.legend.show">
          <Shape :info="item"></Shape>
          <div class="name">{{ item.name }}</div>
        </div>
      </template>
    </div>
    <!-- 视觉映射 -->
    <div class="gis-visualmap-wrap">
      <div class="gis-visualmap" :style="getVisualMapItemStyle(item)" v-for="item in visualMapList" :key="item.id">
        <div class="gis-visualmap-name">
          {{ item.currentOptions.seriesName }}
        </div>
        <div class="gis-visualmap-gradient" v-if="item.range.mode == 'range'">
          <div class="gradient" :style="getVisualMapColumnStyle(item)"></div>
          <div class="high">
            <div>{{ item.visualMap.maxText }}</div>
            <div>{{ item.range.max }}</div>
          </div>
          <div class="low">
            <div>{{ item.visualMap.minText }}</div>
            <div>{{ item.range.min }}</div>
          </div>
        </div>
        <div class="gis-visualmap-color-group" v-else-if="item.range.mode == 'separate'">
          <div class="gis-visualmap-color" v-for="(color, colorIndex) in item.range.rules" :key="colorIndex">
            <div class="color" :style="getVisualMapColorStyle(color)"></div>
            <div class="name">{{ color.label }}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- gis运行一张图 -->
    <viewPartVue class="gis-viewpart" ref="viewPart" v-if="!isDesign && viewPartPath && openGisPic" :gisVm="self" :path.sync="viewPartPath" />
    <!-- 右上角插槽 -->
    <div
      class="slot-top-right"
      v-if="isSlotTopRight"
      :style="slotTopRightStyle"
      slot-name="top-right"
      :class="{
        'slot-common-block-wrap': isDesign,
      }"
    >
      <slot name="top-right"></slot>
    </div>
    <!-- 右下角插槽 -->
    <div
      class="slot-bottom-right"
      v-if="isSlotBottomRight"
      :style="slotBottomRightStyle"
      slot-name="bottom-right"
      :class="{
        'slot-common-block-wrap': isDesign,
      }"
    >
      <slot name="bottom-right"></slot>
    </div>
  </div>
</template>
<script>
import { mapClickMapping } from "_dataview/output/gis/gisConfig.js";
import DsfDataViewGisMap from "./DsfDataViewGisMap.js";

import gisMixin from "./gisMixin.js";
import viewPartVue from "./viewPart.vue";

import Shape from "./legend/shape.vue";
import slotPageManage from "_dataview/mixins/slotPageManage.js";
import { gisRelativeEventsTemp } from "_dataview/output/utils/relativeEvent.js";
// 模型点位配置
import createIcon from "_dataview/share/components/gis/options/icon.js";
import { createCommonTextStyle } from "_dataview/output/config/commonConfig";
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
];
//柯里化函数
const currying = function (fn, context, len) {
  let args = [];
  return function res(...rest) {
    args = [...args, ...rest];
    if (args.length >= len) {
      return fn.apply(context, args);
    } else {
      return res;
    }
  };
};

export default dsf.component({
  name: "DsfDataViewGis",
  ctrlCaption: "gis组件",
  mixins: [gisMixin, slotPageManage],
  components: {
    viewPartVue,
    Shape,
  },
  props: {
    //风格对应组件key
    styleMapKey: {
      type: String,
      default: "gis",
    },
    //tooltip字段样式显示规则
    fieldsStyleRules: {
      type: Array,
      default() {
        return [];
      },
    },
    slots: {
      type: Array,
      default() {
        return [
          {
            name: "default",
            controls: [],
          },
          {
            name: "top-left",
            controls: [],
          },
          {
            name: "bottom-left",
            controls: [],
          },
          {
            name: "top-right",
            controls: [],
          },
          {
            name: "bottom-right",
            controls: [],
          },
        ];
      },
    },
    //是否开启一张图运行,开启一张图设置暂未开发
    openGisPic: {
      type: Boolean,
      default: false,
    },
    //一张图入口地址
    enterPath: {
      type: String,
      default: "",
    },
    //静态数据
    staticData: {
      type: Array,
      default: () => staticData,
    },
    //表格数据
    excelData: {
      type: Array,
      default: () => {
        return dsf.dataview.utils.transformToExcelData(staticData, staticDataKeyDic);
      },
    },
    //图层配置
    layerStyles: {
      type: Object,
      default: () => {
        return {};
      },
    },
    //图层配置字符串
    layerStylesString: {
      type: String,
      default: "",
    },
    //地图类型
    mapType: {
      type: String,
      default: "AMap",
    },
    //地图缩放级别
    zoom: {
      type: Number,
      default: 5,
    },
    isCustomMapStyle: {
      type: Boolean,
      default: false,
    },
    customStyleUrl: {
      type: String,
      default: "",
    },
    //俯角
    pitch: {
      type: Number,
      default: 0,
    },
    //旋转角度
    rotation: {
      type: Number,
      default: 0,
    },
    //地图中心点
    center: {
      type: Array,
      default() {
        return [108.948024, 34.263161];
      },
    },
    //地图元素
    features: {
      type: Array,
      default: () => ["bg", "road", "building", "point"],
    },
    //地图风格
    mapStyle: {
      type: String,
      default: "amap://styles/normal",
    },
    //设计器中地图加载完成标识
    designerLoadMap: {
      type: Boolean,
      default: false,
    },
    //事件依赖
    eventRelativeDeal: {
      type: Object,
      default() {
        return gisRelativeEventsTemp;
      },
    },
    legend: {
      type: Object,
      default() {
        return {
          position: ["20", "", "", "20"],
          direction: "horizontal",
          textStyle: createCommonTextStyle(),
        };
      },
    },
    //MineMap配置
    MineMapConfig: {
      type: Object,
      default() {
        return {
          //  MineMap根域名地址
          map_domainUrl: "//minedata.com.cn",
          // MineMap矢量数据服务根域名地址
          map_dataDomainUrl: "//datahive.minedata.com.cn",
          // MineMap矢量数据服务新规范根域名地址
          map_serverDomainUrl: "//datahive.minedata.com.cn",
          // MineMap底图雪碧图地址
          map_spriteUrl: "//minedata.com.cn/minemapapi/v2.1.0/sprite/sprite",
          // MineMap后台服务根地址
          map_serviceUrl: "//mineservice.minedata.com.cn/service",
          // 搜索服务地址
          mineMapSearchUrl: "https://minedata.com.cn/service/",
          // 凭证
          key: "16d99f3896e64fa7a003293e6bcf39fa",
        };
      },
    },
    //高德配置
    AMapConfig: {
      type: Object,
      default() {
        return {
          securityJsCode: "290ddc4b0d33be7bc9b354bc6a4ca614",
          key: "6f025e700cbacbb0bb866712d20bb35c",
        };
      },
    },
    // 百度配置
    BMapConfig: {
      type: Object,
      default() {
        return {
          bMapWebAK: "m0dQea7My30koZPTEeVk0KlIkUkdtUpG",
          bMapServiceAK: "WmXjQ8epF2u3w5XsSyxze4OoPBuhzzSO",
        };
      },
    },
  },
  computed: {
    self() {
      return this;
    },
    legendStyle() {
      const { position = [], direction, textStyle = {} } = this.legend;
      const [top, right, bottom, left] = position;
      const style = {
        top: dsf.dataview.utils.transformPx(top),
        right: dsf.dataview.utils.transformPx(right),
        bottom: dsf.dataview.utils.transformPx(bottom),
        left: dsf.dataview.utils.transformPx(left),
        ...dsf.dataview.utils.transformTextStyle(textStyle),
      };
      let x = 0;
      let y = 0;
      if (top === "center") {
        style.top = "50%";
        y = "-50%";
      }
      if (left === "center") {
        style.left = "50%";
        x = "-50%";
      }
      style.transform = `translate(${x}, ${y})`;
      if (direction === "horizontal") {
        style.flexDirection = "row";
      } else {
        style.flexDirection = "column";
      }

      return style;
    },
  },
  watch: {
    collectLayers: {
      handler(v) {
        this.setLegend();
        this.setVisualMap();
      },
      deep: true,
    },
    MineMapConfig: {
      handler(v) {
        window.map_domainUrl = v.map_domainUrl;
        window.map_dataDomainUrl = v.map_dataDomainUrl;
        window.map_serverDomainUrl = v.map_serverDomainUrl;
        window.map_spriteUrl = v.map_spriteUrl;
        window.map_serviceUrl = v.map_serviceUrl;
        window.mineMapSearchUrl = v.mineMapSearchUrl;
        window.mineMapKey = v.key;
      },
      immediate: true,
      deep: true,
    },
    AMapConfig: {
      handler(v) {
        window.securityJsCode = v.securityJsCode;
        window.amapKey = v.key;
      },
      immediate: true,
      deep: true,
    },
    BMapConfig: {
      handler(v) {
        window.bMapWebAK = v.bMapWebAK;
        window.bMapServiceAK = v.bMapServiceAK;
      },
      immediate: true,
      deep: true,
    },
    viewPartPath(path) {
      //更新当前路径
      let params = dsf.mix({}, this.$route.query, {
        currentPath: path,
      });
      //更新url添加id参数
      this.$router.replace({
        path: this.$route.path,
        query: params,
      });
    },
    //地图来源切换
    mapType(v) {
      this.$emit("update:designerLoadMap", false);
      this._DsfDataViewGisMap && this._DsfDataViewGisMap.destroy();
      this.mapContainer = false;
      this._DsfDataViewGisMap = null;

      setTimeout(() => {
        this.mapContainer = true;
        this.$nextTick(() => {
          this.beforeInit();
        });
      });
    },
    //风格切换
    mapStyle(v) {
      if (!this.isCustomMapStyle) {
        this._DsfDataViewGisMap && this._DsfDataViewGisMap.setMapStyle(v);
      }
    },
    //地图要素切换
    features(v) {
      this._DsfDataViewGisMap && this._DsfDataViewGisMap.setFeatures(v);
    },
    customStyleUrl(v) {
      if (this.isCustomMapStyle) {
        this._DsfDataViewGisMap && this._DsfDataViewGisMap.setMapStyle(v);
      }
    },
  },
  data() {
    return {
      debounceTimer: null,
      mapContainer: true,
      loadingBackground: "rgba(0, 0, 0, 0.4)",
      //Gis运行一张图
      viewPartPath: "",
      //地图当前状态--默认加载状态
      mapStatus: "load",
      // 组件类型
      componentType: "gis",
      //加载状态
      loadingMap: true,
      //地图加载完成标识
      isLoadMap: false,
      //收集显示的图层
      collectLayers: [],
      //区域点击事件
      polygonClickEvent: () => {},
      //gisMap加载完成事件
      mapLoadEvent: () => {},
      // 图例
      legendList: [],
      // 视觉映射
      visualMapList: [],
      cacheCallbacks: [],
    };
  },
  beforeDestroy() {
    //事件全部移除
    dsf.emit.$remove("GISLoad", window);
    this.destroyClickMapEvent();
    this._DsfDataViewGisMap && this._DsfDataViewGisMap.destroy();
    this._DsfDataViewGisMap = null;
  },
  created() {
    // 新增的图层之后能监听到
    this.compatibleOldRelativeEvents();

    this.$emit("update:designerLoadMap", false);

    //开启一张图运行
    if (this.openGisPic && !this.isDesign) {
      let currentPath = this.$route.query.currentPath;
      this.viewPartPath = currentPath || this.enterPath;
    }

    // layerStylesString 获取 layerStylesString 作为图层对象
    if (this.layerStylesString) {
      const layerStylesString = this.layerStylesString;

      let layerStyles = dsf.eval(layerStylesString);
      for (let key in this.layerStyles) {
        Reflect.deleteProperty(this.layerStyles, key);
      }
      Object.assign(this.layerStyles, layerStyles);
      this.$emit("update:layerStyles", layerStyles);
    }

    //伪代码需要
    this.clickMapEvent();

    //地图加载完成事件
    this.mapLoadEvent = () => {
      this.loadingMap = false;
      this.isLoadMap = true;
      while (this.cacheCallbacks.length) {
        const cb = this.cacheCallbacks.pop();
        cb();
        console.log("执行");
      }
      this.init();
      if (this.isDesign) {
        this.$emit("update:designerLoadMap", true);
      }
    };
    //地图加载完成
    dsf.emit.$on("GISLoad", this.mapLoadEvent, window);

    dsf.emit.$on(
      "updateGisLayer",
      (args) => {
        console.log("接受");
        // layers
        const layers = args.layers;
        const layerStylesString = dsf.dataview.utils.objectToString(layers, true);
        this.$emit("update:layerStyles", layers);
        this.$emit("update:layerStylesString", layerStylesString);
        //在option 获取之后执行
        setTimeout(this.reset);
      },
      this
    );
  },
  methods: {
    styleConfigCallback(style) {
      const { theme, ...properties } = style;
      const layerStyles = this.layerStyles;
      Object.values(layerStyles).forEach((it) => {
        dsf.mix(true, it, properties);
      });
      const themeUrl = theme[this.mapType];
      this.$emit("update:mapStyle", themeUrl);

      const callback = () => {
        this._DsfDataViewGisMap.setMapStyle(themeUrl);
      };

      if (this.isLoadMap) {
        this.reset();
        this._DsfDataViewGisMap.setMapStyle(themeUrl);
      } else {
        this.cacheCallbacks.push(callback);
      }
    },
    compatibleOldRelativeEvents() {
      let event = _.cloneDeep(gisRelativeEventsTemp);
      Object.keys(this.eventRelativeDeal).forEach((key) => {
        event[key] = this.eventRelativeDeal[key];
      });
      this.$emit("update:eventRelativeDeal", event);
    },
    clickMapEvent() {
      Object.keys(mapClickMapping).forEach((key) => {
        //区域点击事件
        let eventObj = mapClickMapping[key];
        let listenNameStr = eventObj.listenNameStr;
        let listenFnStr = eventObj.listenFnStr;
        let clickEvent = eventObj.clickEvent;
        this[listenFnStr] = (data) => {
          this.loadDistrictClickEvents(data, clickEvent);
        };
        //地图区域点击
        dsf.emit.$on(listenNameStr, this[listenFnStr], window);
      });
    },
    destroyClickMapEvent() {
      Object.keys(mapClickMapping).forEach((key) => {
        //区域点击事件
        let eventObj = mapClickMapping[key];
        let listenNameStr = eventObj.listenNameStr;
        //地图区域点击
        dsf.emit.$remove(listenNameStr, window);
      });
    },
    beforeInit() {
      const { offsetHeight, offsetWidth } = this.$refs.mapBox;
      if (offsetHeight === 0 || offsetWidth === 0) return false;
      let { center, zoom, pitch, rotation, mapStyle, features, mapType, isCustomMapStyle, customStyleUrl } = this;
      let nowMapStyle = mapStyle;
      if (isCustomMapStyle) {
        nowMapStyle = customStyleUrl;
      }
      this._DsfDataViewGisMap = new DsfDataViewGisMap(
        this.$refs.mapBox,
        {
          center,
          zoom,
          pitch,
          rotation,
          features,
          mapStyle: nowMapStyle,
        },
        mapType,
        this
      );
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
      const hasCoordinate = ~describe.findIndex((it) => it.field === "coordinate");
      // 包含坐标点
      if (hasCoordinate) {
        try {
          dictionary.lng = "经度";
          dictionary.lat = "维度";
          data.forEach((it) => {
            const coordinate = it.coordinate;
            const lng = coordinate.split(",")[0];
            const lat = coordinate.split(",")[1];
            it.lng = lng;
            it.lat = lat;
          });
          const options = dsf.mix(true, {}, createIcon());
          const dataConfig = options.dataConfig;
          dataConfig.latRelation = "lat";
          dataConfig.lngRelation = "lng";
          dataConfig.dataType = "lnglat";
          // 处理数据
          const filterDescribe = describe.filter((it) => it.field != "coordinate");
          const name = filterDescribe[0].field;
          dataConfig.nameRelation = name;

          const type = "icon";
          let id = `${type}_${dsf.uuid(6)}`;
          options[type].id = id;
          // 适配当前视野窗口
          options.fitView = true;
          this.$set(this.layerStyles, id, options);
        } catch (error) {
          console.warn(`error-${error}`);
        }
      }

      // 处理成Excel
      const excelData = dsf.dataview.utils.transformToExcelData(data, dictionary);
      this.excelData.length = 0;
      dsf.mix(true, this.excelData, excelData);
      this.$emit("update:excelData", excelData);
    },
    //数据分析方法
    dataAnalysis(data = []) {
      this.data = data;
      this.collectLayers = [];
      //当前地图状态
      let mapStatus = this.mapStatus;
      let layerStyles = this.layerStyles;

      let keys = Object.keys(layerStyles);
      for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        //图层样式
        let layerStyle = layerStyles[key];
        //图层数据配置
        let config = layerStyle.dataConfig;
        //不是对应地图图层状态的图层不加载
        if (config.status !== mapStatus) continue;
        //设置图层数据
        this.setLayerData(key, data);
      }

      this.setLegend();
      this.setVisualMap();

      if (this.isDesign) {
        const layerStylesString = dsf.dataview.utils.objectToString(layerStyles, true);
        this.$emit("update:layerStyles", layerStyles);
        this.$emit("update:layerStylesString", layerStylesString);
      }
    },

    //设置图层数据 图层id 图层数据
    setLayerData(layerId, data = []) {
      //图层样式
      let layerStyle = this.layerStyles[layerId];
      if (!layerStyle) return false;
      let collectLayers = this.collectLayers;
      if (!collectLayers.find((it) => it.layerId === layerId)) {
        //收集显示图层
        this.collectLayers.push({
          layerId,
          layerStyle,
          show: true,
        });
      }

      //图层类型
      let seriesType = layerStyle.seriesType;
      let level = layerStyle.level || "district";
      //图层数据配置
      let config = layerStyle.dataConfig;
      //数据类型
      let dataType = config.dataType;
      //删除图层
      this.handleDeleteMapLayer(layerId);

      let { adCodeRelation, nameRelation, valueRelation, lngRelation, latRelation, startRelation, endRelation, districtRelation } = config;
      let extraData = [];
      //如果是数组做数据映射
      if (Array.isArray(data)) {
        extraData = data.map((it) => {
          let { name, value, adcode, lng, lat, startPoint, endPoint, districtArr } = it;
          it.name = it[nameRelation] ? it[nameRelation] : name;
          //使用geojson 数据名称
          if (!it.name) {
            Reflect.deleteProperty(it, "name");
          }
          it.value = it[valueRelation] ? it[valueRelation] : value;
          it.adcode = it[adCodeRelation] ? it[adCodeRelation] : adcode;
          it.lng = it[lngRelation] ? it[lngRelation] : lng;
          it.lat = it[latRelation] ? it[latRelation] : lat;
          it.startPoint = it[startRelation] ? it[startRelation] : startPoint;
          it.endPoint = it[endRelation] ? it[endRelation] : endPoint;
          it.districtArr = it[districtRelation] ? it[districtRelation] : districtArr || [];
          return {
            ...it,
          };
        });
      }

      switch (dataType) {
        //加载Geo数据图层
        case "geo":
          this.addGeoDataLayer(layerId, data, layerStyle, seriesType);
          break;
        //加载行政编码数图层
        case "code":
          this.addCodeDataLayer(layerId, extraData, layerStyle, seriesType, config.districtCode);
          break;
        //加载经纬度数据
        case "lnglat":
          this.addLngLatDataLayer(layerId, extraData, layerStyle, seriesType);
          break;
        //特殊图层
        case "particularCode":
          this.addCodeParticularDataLayer(layerId, extraData, layerStyle, level, config.districtCode);
          break;
      }
    },
    //加载Geo数据图层
    addGeoDataLayer(id, geo, layerStyle, seriesType) {
      //如果是图层id
      if (typeof layerStyle === "string") {
        let layerStyles = this.layerStyles;
        //如果改图层样式不存在则使用默认的样式
        layerStyle = layerStyles[layerStyle] || {};
      }
      if (!geo) return false;
      switch (seriesType) {
        case "polygon":
          this._DsfDataViewGisMap.addPolygonLayer(id, geo, [], layerStyle);
          break;
        case "point":
          this._DsfDataViewGisMap.addPointLayer(id, geo, [], layerStyle);
          break;
        case "heatMap":
          this._DsfDataViewGisMap.addHeatMapLayerLayer(id, geo, [], layerStyle);
          break;
        case "scatter":
          this._DsfDataViewGisMap.addScatterLayer(id, geo, [], layerStyle);
          break;
        case "pulseLink":
          this._DsfDataViewGisMap.addPulseLinkLayer(id, geo, [], layerStyle);
          break;
        case "flatBar":
          this._DsfDataViewGisMap.addFlatBarLayer(id, geo, [], layerStyle);
          break;
        case "icon":
          this._DsfDataViewGisMap.addIconLayer(id, geo, [], layerStyle);
          break;
      }
    },
    /**
     * @description 加载特殊行政编码图层
     * @param {string} id 图层id 必填
     * @param {boolean} data 图层数据 必填
     * @param {object|string} layerStyle 图层样式，可用设计器中样式id
     * @param {string} level 编码层级
     * @param {string} code 行政区域编码 polygon面图层使用
     * @param {string} options 伪代码传过来的属性
     * @return {无}
     */
    addCodeParticularDataLayer(id, data, layerStyle, level, code) {
      //如果是图层id
      if (typeof layerStyle === "string") {
        let layerStyles = this.layerStyles;
        //如果改图层样式不存在则使用默认的样式
        layerStyle = layerStyles[layerStyle] || {};
      }
      if (!data) return false;
      this._DsfDataViewGisMap.addParticularPolygonLayerByCode(id, code, level, layerStyle, data, undefined);
    },
    /**
     * @description 加载行政编码图层
     * @param {string} id 图层id 必填
     * @param {boolean} data 图层数据 必填
     * @param {object|string} layerStyle 图层样式，可用设计器中样式id
     * @param {string} seriesType 图层类型 point polygon heatMap scatter flatBar
     * @param {string} code 行政区域编码 polygon面图层使用
     * @param {string} options 伪代码传过来的属性
     * @return {无}
     */
    addCodeDataLayer(id, data, layerStyle, seriesType, code, options) {
      //如果是图层id
      if (typeof layerStyle === "string") {
        let layerStyles = this.layerStyles;
        //如果改图层样式不存在则使用默认的样式
        layerStyle = layerStyles[layerStyle] || {};
      }
      if (!data) return false;
      let tolerance = layerStyle.dataConfig.tolerance;
      let arrData = data;
      //柯里化函数
      const addPointLayerByCode = currying(this._DsfDataViewGisMap.addPointLayerByCode, this._DsfDataViewGisMap, 4);
      //延迟执行
      addPointLayerByCode(id, data, layerStyle);

      switch (seriesType) {
        case "polygon":
          this._DsfDataViewGisMap.addPolygonLayerByCode(id, code, layerStyle, data, undefined, tolerance);
          break;
        case "point":
          addPointLayerByCode("point");
          break;
        case "heatMap":
          addPointLayerByCode("heatMap");
          break;
        case "scatter":
          addPointLayerByCode("scatter");
          break;
        case "pulseLink":
          if (dsf.isObject(data[0])) {
            arrData = data.map((it) => [it.startPoint, it.endPoint]);
          }
          this._DsfDataViewGisMap.addPulseLinkLayerByCode(id, arrData, layerStyle);
          break;
        case "flatBar":
          addPointLayerByCode("flatBar", [], {}, options);
          break;
        case "icon":
          addPointLayerByCode("icon");
          break;
      }
    },
    /**
     * @description 加载经纬度图层
     * @param {string} id 图层id 必填
     * @param {boolean} data 图层数据 必填
     * @param {object|string} layerStyle 图层样式，可用设计器中样式id
     * @param {string} seriesType 图层类型 point polygon heatMap scatter flatBar
     * @param {Object} useOptions 用于区别柱体类型等属性参照options
     * @return {无}
     */
    addLngLatDataLayer(id, data, layerStyle, seriesType, useOptions = {}) {
      //如果是图层id
      if (typeof layerStyle === "string") {
        let layerStyles = this.layerStyles;
        //如果改图层样式不存在则使用默认的样式
        layerStyle = layerStyles[layerStyle] || {};
      }
      if (!data) return false;
      let arrData = data;

      const addPointLayerByLngLat = currying(this._DsfDataViewGisMap.addPointLayerByLngLat, this._DsfDataViewGisMap, 4);
      addPointLayerByLngLat(id, data, layerStyle);

      switch (seriesType) {
        case "polygon":
          this._DsfDataViewGisMap.addPolygonLayerByLngLat(id, arrData, layerStyle);
          break;
        case "point":
          addPointLayerByLngLat("point");
          break;
        case "heatMap":
          addPointLayerByLngLat("heatMap");
          break;
        case "scatter":
          addPointLayerByLngLat("scatter");
          break;
        case "pulseLink":
          if (dsf.isObject(data[0])) {
            arrData = data.map((it) => [it.startPoint, it.endPoint]);
          }
          //[[[],[]]]
          this._DsfDataViewGisMap.addPulseLinkLayerByLngLat(id, arrData, layerStyle);
          break;
        case "flatBar":
          addPointLayerByLngLat("flatBar", [], {}, useOptions);
          break;
        case "icon":
          addPointLayerByLngLat("icon");
          break;
      }
    },
    //查询全国行政区域列表
    queryDistrictListByCode(adcode, deep) {
      if (!this._DsfDataViewGisMap) {
        return Promise.resolve([]);
      }
      return this._DsfDataViewGisMap.queryDistrictListByCode(adcode, deep);
    },
    //重绘
    reset() {
      let data = this.data;
      this.dataAnalysis(data);
    },
    // 获取当前地图类型
    getMapType() {
      return this._DsfDataViewGisMap.getMapType();
    },
    // 设置图例
    setLegend() {
      let legendList = [];
      let { collectLayers, layerStyles } = this;
      for (let item of collectLayers) {
        let layerStyle = layerStyles[item.layerId];
        if (!layerStyle) return;
        let seriesType = layerStyle.seriesType;
        let currentOptions = layerStyle[seriesType];
        if (item.show && layerStyle?.legend?.show) {
          let legendColor = this.getLegendColor(seriesType, currentOptions);
          let legendColorOld = layerStyle.legend.itemStyle.legendColor;
          if (legendColorOld && (typeof legendColorOld === "string" || (Array.isArray(legendColorOld) && legendColorOld.length))) {
            legendColor = legendColorOld;
          }
          let legend = dsf.mix(true, {}, layerStyle.legend, {
            itemStyle: { legendColor },
          });
          legendList.push({
            id: item.layerId,
            type: seriesType,
            legend,
            name: currentOptions.seriesName,
            layerStyle: layerStyle,
            currentOptions: currentOptions,
          });
        }
      }
      this.$set(this, "legendList", legendList);
    },
    getLegendColor(type, options) {
      if (["polygon", "flatBar"].includes(type)) {
        return options.itemStyle.topColor;
      } else if (type === "heatMap") {
        return Object.values(options.itemStyle.gradient);
      } else if (type === "pulseLink") {
        return options.itemStyle.lineColors[0];
      } else {
        return options.itemStyle.color;
      }
    },
    // 设置视觉映射
    setVisualMap() {
      let visualMapList = [];
      let { collectLayers, layerStyles } = this;
      for (let item of collectLayers) {
        let layerStyle = layerStyles[item.layerId];
        if (!layerStyle) return;
        let seriesType = layerStyle.seriesType;
        let currentOptions = layerStyle[seriesType];

        // 单独处理热力图
        let range = {};
        if (seriesType == "heatMap") {
          range = {
            show: true,
            mode: "separate",
            rules: [],
          };
          for (let key in currentOptions.itemStyle.gradient) {
            range.rules.push({
              color: currentOptions.itemStyle.gradient[key],
              label: key,
            });
          }
        } else {
          range = currentOptions.itemStyle?.range;
        }
        if (item.show && range?.show && currentOptions.itemStyle?.visualMap?.show) {
          visualMapList.push({
            id: item.layerId,
            range: range,
            visualMap: currentOptions.itemStyle.visualMap,
            layerStyle: layerStyle,
            currentOptions: currentOptions,
          });
        }
      }
      this.$set(this, "visualMapList", visualMapList);
    },
    // 视觉映射样式
    getVisualMapItemStyle(item) {
      let { range, visualMap } = item;
      const textStyle = dsf.dataview.utils.transformTextStyle(visualMap);
      return {
        ...textStyle,
        top: dsf.dataview.utils.transformPx(visualMap.postion[0]),
        right: dsf.dataview.utils.transformPx(visualMap.postion[1]),
        bottom: dsf.dataview.utils.transformPx(visualMap.postion[2]),
        left: dsf.dataview.utils.transformPx(visualMap.postion[3]),
      };
    },
    // 视觉映射渐变样式
    getVisualMapColumnStyle(item) {
      let { range } = item;
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
    getVisualMapColorStyle(color) {
      let style = {};
      style.backgroundColor = color.color;
      return style;
    },
    resize() {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        if (this._DsfDataViewGisMap) {
          this._DsfDataViewGisMap.resize();
        } else {
          this.beforeInit();
        }
      }, 500);
    },
  },
  design: {
    metadata: {
      create() {
        if (this._DsfDataViewGisMap) {
          let result = this._DsfDataViewGisMap && this._DsfDataViewGisMap.getMapProperties();
          const { zoom, center, pitch, rotation } = result;
          this.zoom = zoom;
          this.center = center;
          this.pitch = pitch;
          this.rotation = rotation;
        }
      },
    },
  },
});
</script>
<style lang="scss">
@import "_dataview/assets/styles/share/components/DsfDataViewGis.scss";
</style>
