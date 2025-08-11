<!--
 * @Description: 地球仪
 * @Author: shenah
 * @Date: 2024-07-23 09:32:42
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-06-11 14:26:26
-->

<template>
  <div
    class="data-view-item-wrap ds-control data-view-map data-view-no-padding ds-chart data-view-parent-slot-wrap"
    :style="{
      ...controlStyle,
      ...getCommonEnterAnimateStyle,
    }"
    v-loading="dataLoad"
    :element-loading-text="loadingText"
    :element-loading-spinner="loadingSpinner"
    :element-loading-background="loadingBackground"
  >
    <template v-for="(item, _idx) in slotAttrMap">
      <div
        :key="_idx"
        v-if="item.isDisplay"
        :style="item.nameStyle"
        :slot-name="item.slotName"
        :class="{
          'slot-common-block-wrap': isDesign,
          [item.className]: true,
        }"
      >
        <slot :name="item.slotName"></slot>
      </div>
    </template>
    <div class="chart" ref="chart"></div>
    <slot></slot>
  </div>
</template>
<script>
import {createGlobeMap} from "_dataview/output/mapDefault/globeMap/globeMap.js";
import slotPageManage from "_dataview/mixins/slotPageManage.js";
import utils from "_dataview/output/utils/gis.js";
import globeMap from "_dataview/mixins/globeMap.js";
const staticDataKeyDic = {
  name: "名称",
  value: "人口(万)",
  start: "起点",
  end: "终点",
};
const staticData = [
  {
    name: "中国",
    value: 1000,
    start: "中国",
    end: "朝鲜",
  },
  {
    name: "印度",
    value: 1400,
    start: "印度",
    end: "朝鲜",
  },
  {
    name: "阿富汗",
    value: 999,
    start: "阿富汗",
    end: "印度",
  },
  {
    name: "日本",
    value: 1388,
    start: "中国",
    end: "日本",
  },
  {
    name: "越南",
    value: 352,
    start: "越南",
    end: "日本",
  },
];

export default dsf.component({
  name: "DsfDataViewGlobeMap",
  ctrlCaption: "地球3D",
  mixins: [$mixins.dataView, globeMap, slotPageManage],
  props: {
    //自定义配置总览
    chart: {
      type: Object,
      default() {
        return createGlobeMap();
      },
    },
    staticData: {
      type: Array,
      default() {
        return staticData;
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
            name: "top-right",
            controls: [],
          },
          {
            name: "bottom-left",
            controls: [],
          },
          {
            name: "bottom-right",
            controls: [],
          },
        ];
      },
    },
    excelData: {
      type: Array,
      default: () => {
        return dsf.dataview.utils.transformToExcelData(staticData, staticDataKeyDic);
      },
    },
  },
  data() {
    return {
      baseTextureCanvas: null,
      componentType: "globeMap",
    };
  },
  beforeDestroy() {
    this.chartObj && this.chartObj.dispose();
    dsf.emit.$remove("loadEChartsGl", this);
  },
  methods: {
    /**
     * @name: 初始化之前加载资源
     */
    beforeInit() {
      this.loadEcharts(this)
        .then(() => {
          //加载webGL
          this.loadEChartsGl(this).then(() => {
            this.registerMap().then(() => {
              //这里需要注册完地图在初始化容器
              this.initEcharts();
              this.init();
            });
          });
        })
        .catch((ex) => {
          dsf.error(ex);
        });
    },
    /**
     * @name: 加载webGl的包
     * @param {*} tag
     * @return {*}
     */
    loadEChartsGl(tag) {
      return new Promise((resolve, reject) => {
        if (!window.echartsGlobeMap) {
          dsf.emit.$on(
            "loadEChartsGl",
            () => {
              window.echartsGlobeMap = true;
              //加载完成
              resolve();
            },
            tag
          );
          if (!window.dataViewEchartsGlLoad) {
            window.dataViewEchartsGlLoad = true;
            let loadFileHttp = dsf.dataview.utils.importFiles(
              [this.$getWebPath("static/js/libs/echarts/echarts-gl.min.2.0.8.js", __DSF_DATAVIEW_PATH__)],
              () => {
                dsf.emit.$emit("loadEChartsGl");
              },
              (err) => {
                dsf.layer.message("加载echarts-gl相关文件报错", false);
                reject(err);
              },
              () => {
                this.addNowRequestFileList(loadFileHttp, true);
              }
            );
            this.addNowRequestFileList(loadFileHttp);
          }
          return;
        }
        //加载完成
        resolve();
      });
    },
    /**
     * @name: 注册数据世界地图
     * @param {*} area 区域名称世界地图
     */
    registerMap() {
      const url = this.$getWebPath(`static/js/libs/three/geoJson/world.json`, __DSF_DATAVIEW_PATH__);
      return this.loadMap(url);
    },
    loadMap(url) {
      return this.dsf.http.get(url, {}).done((mapjson) => {
        this.mapjson = mapjson;
        let echarts = window.$echarts || window.echarts;
        echarts.registerMap("world", mapjson);
        this.chart.baseTextureOptions.series[0].map = "world";
        //设计器下更新chartString
        if (this.isDesign) {
          //这里将chart 转化为 chartString
          let o = dsf.dataview.utils.objectToString(this.chart, true);
          this.$emit("update:chartString", o);
        }
        //计算中心坐标点
        let features = this.mapjson.features;
        let coordMap = new Map();
        //地理信息点位
        features.forEach((it) => {
          //存在中心点位
          if (it.properties.cp) {
            coordMap.set(it.properties.name, it.properties.cp);
          } else if (it.geometry.type) {
            let type = it.geometry.type;
            let polygons = [];
            if (type == "MultiPolygon") {
              polygons = it.geometry.coordinates[0];
            } else if (type == "Polygon") {
              polygons = it.geometry.coordinates;
            }
            if (Array.isArray(polygons[0]) && polygons.length) {
              polygons = utils.polygon(polygons);
              let re = utils.centroid(polygons);
              coordMap.set(it.properties.name, re.geometry.coordinates);
            }
          }
        });
        this.coordMap = coordMap;
      });
    },
    // 接口映射解析
    dynamicMapAnalysis(data, chart = this.chart) {
      const series = chart.series;
      series.forEach((it) => {
        const nameRelation = it.type == "lines3D" ? it.startRelation || "start" : it.nameRelation || "name";
        const valueRelation = it.type == "lines3D" ? it.endRelation || "end" : it.valueRelation || "value";
        const seriesNameRelation = it.seriesNameRelation;
        const hasNameRelation = it.hasNameRelation;

        let valData = [];
        data.forEach((item, index) => {
           if (index == 0 && hasNameRelation && item[seriesNameRelation]) {
            it.name = item[seriesNameRelation];
          }
          if (it.type == "lines3D") {
            let start = nameRelation ? item[nameRelation] : nameRelation;
            let end = valueRelation ? item[valueRelation] : valueRelation;
            valData.push([start, end]);
          } else {
            if (item[valueRelation] != undefined) {
              let name = nameRelation ? item[nameRelation] : nameRelation;
              valData.push({
                ...item,
                name: name,
                value: item[valueRelation],
              });
            }
          }
        });
        switch (it.type) {
          case "lines3D":
            this.addFlyLine(valData, it.name, chart);
            break;
          case "scatter3D":
            this.addScatter(valData, it.name, chart);
            break;
        }
      });
      // 区域数据的加载
      this.areaHotData(data, chart);
    },
    dataAnalysis(data) {
      this.data = data;
      this.dynamicMapAnalysis(data);

      if (this.$listeners["interceptOptions"]) {
        this.$dispatch("interceptOptions", { chart: this.chart, vm: this });
      } else {
        this.reset();
      }
    },
    /**
     * @name: 因为后面生成的echarts对象为特殊对象graph里面有对属性的递归处理(会造成栈溢出)
     * @param {*} chart 配置对象
     */
    beforeSpecialSetOption(chart) {
      this.createBaseTexture(chart);
      chart.series.forEach((item) => {
        if (item.type === "scatter3D") {
          item.data.forEach((oneData) => {
            let x = item.symbolOffset[0];
            let y = item.symbolOffset[1];
            let val = oneData.value;
            oneData.value = [val[0] + x, val[1] + y, val[2]];
            this.getMapShapeScatter(item);
          });
        }
      });
    },
    /**
     * @description: bindChartContext transformNumber 这两个方法会查找当前的属性如果是echarts对象的话会造成内存溢出
     * @return {*}
     */
    afterSpecialSetOption() {
      if (typeof this.chart.globe.baseTexture === "object") {
        this.chart.globe.baseTexture = "";
      }
    },
    /**
     * @name: 利用echarts创建基本纹理
     * @param {*} chart
     */
    createBaseTexture(chart) {
      if (chart.globe.baseTextureType === "default") {
        let baseTextureOptions = chart.baseTextureOptions;
        if (this.baseTextureCanvas) {
          this.baseTextureCanvas.clear();
        } else {
          let canvas = document.createElement("canvas");
          this.baseTextureCanvas = echarts.init(canvas, null, {
            width: 4096,
            height: 2048,
          });
        }
        this.baseTextureCanvas.setOption(baseTextureOptions, true);
        chart.globe.baseTexture = this.baseTextureCanvas;
      }
    },
    // 重写风格改变
    styleConfigCallback(styleObj) {
      this.handleStyleChangeVisualMap(styleObj.visualMap, this.chart.baseTextureOptions);
      this.handleStyleChangeSeries(styleObj, this.chart.baseTextureOptions);
      this.reset();
      this.chartString = dsf.dataview.utils.objectToString(this.chart, true);
      dsf.emit.$emit("updatePropertyChart", {}, this);
    },
  },
});
</script>
