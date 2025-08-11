/*
 * @Description: 图表mixins
 * @Author: zhanghang
 * @Date: 2021-07-27 14:01:59
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-07-18 10:34:23
 */
import graph from "./graph.js";
import { eventTemp } from "_dataview/output/utils/relativeEvent";
import { createCommonTextStyle } from "_dataview/output/config/commonConfig.js";
import utils from "_dataview/output/utils/gis.js";

export default {
  mixins: [graph],
  props: {
    //加载地图geo名称
    area: {
      type: Object,
      default() {
        return {
          area: "china",
          url: "",
          showName: "中国",
          // 自定义上传列表
          areaList: [],
        };
      },
    },
    modifyJSON: {
      type: Function,
      default: null,
    },
    isDown: {
      type: Boolean,
      default: false,
    },
    // 返回样式
    backTextConfig: {
      type: Object,
      default: () => ({}),
    },
    fontColor: {
      type: String,
      default: "#FFFFFF",
    },
    fontSize: {
      type: [String, Number],
      default: "12",
    },
    position: {
      type: Array,
      default: () => [0, 0, "auto", "auto"],
    },
    defaultSeries: {
      type: String,
      default: "0",
    },
    romLength: {
      type: [String, Number],
      default: 10,
    },
    scatterLength: {
      type: [String, Number],
      default: 3,
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
          load: {
            relatives: [],
            fn: eventTemp,
          },
          click: {
            relatives: [],
            fn: eventTemp,
          },
          dbclick: {
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
    mapName: {
      type: String,
      default: dsf.uuid(32),
    },
    mapButtonGroup: {
      type: Object,
      default: () => ({
        show: false,
        position: "top-right", // 位置
        buttonsSize: 20, // 大小
        buttonsColor: "#999", // 颜色
        buttonsDirection: "column", // 横向排布 row, 纵向排布 column
        borderColor: "#999",
        eidtSize: 0.1,
        buttons: [
          {
            icon: "icon-fangda",
            name: "放大",
          },
          {
            icon: "icon-suoxiao",
            name: "缩小",
          },
          {
            icon: "icon-shuaxin",
            name: "重置",
          },
        ],
      }),
    },
  },
  watch: {
    cycleTime() {
      this.resetCallback();
    },
    area: {
      handler() {
        this.$nextTick(() => {
          if (this.isDesign) {
            this.registerMap().then(this.init);
          }
        });
      },
      deep: true,
    },
  },
  data() {
    return {
      mapJsonMap: new Map(),
      // 图表对象
      chartObj: null,
      timer: null,
      // 组件类型
      componentType: "map",
      clickTimer: null,
      //地图列表
      mapNames: [],
      //当前地图name
      currentMapName: "",

      coordMap: new Map(),
      otherEvents: ["切换地图", "清除地图数据"],
      defaultBackTextConfig: createCommonTextStyle({
        margin: [0, 0, 0, 0], // 外边距
        algin: {
          vAlign: "top",
          hAlign: "left",
        },
      }),
    };
  },
  computed: {
    backStyle() {
      if (dsf.isEmptyObject(this.backTextConfig)) {
        return {};
      }
      let {
        fontSize,
        margin,
        color,
        algin: { vAlign, hAlign },
      } = this.backTextConfig;

      const style = {
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
          style.transform = "translateX(-50%)";
          break;
        case "right":
          style.right = 0;
          break;
      }
      return style;
    },
    showBack() {
      return (this.isDesign && this.isDown) || this.mapNames.length > 1;
    },
    mapButtonGroupAttr() {
      // position
      const { position, buttonsDirection, borderColor, buttonsSize, buttonsColor } = this.mapButtonGroup;
      this.mapButtonGroup.slotName = "slot-" + position;
      // 样式设置
      this.mapButtonGroup.slotParentStyle = {
        "flex-direction": buttonsDirection,
      };
      this.mapButtonGroup.slotChildStyle = {
        "border-color": borderColor,
      };
      this.mapButtonGroup.slotSpanStyle = {
        fontSize: dsf.dataview.utils.transformPx(buttonsSize),
        color: buttonsColor,
      };
      return this.mapButtonGroup;
    },
  },
  created() {
    let { backTextConfig } = this;
    if (!backTextConfig || dsf.isEmptyObject(backTextConfig)) {
      backTextConfig = dsf.mix(true, {}, this.defaultBackTextConfig);
      let { fontSize, fontColor, position } = this;
      if (fontSize) {
        backTextConfig.fontSize = fontSize;
      }
      if (fontColor) {
        backTextConfig.color = fontColor;
      }
      if (position) {
        backTextConfig.margin = position;
      }
    }
    for (let key in backTextConfig) {
      this.$set(this.backTextConfig, key, backTextConfig[key]);
    }
  },
  beforeDestroy() {
    this.chartObj && this.chartObj.dispose();
    this.timer && clearInterval(this.timer);
  },
  methods: {
    //地图返回
    backMapFn() {
      if (this.isDesign) return false;
      this.mapNames.pop();
      let o = this.mapNames[this.mapNames.length - 1];
      let mapName = o.value;
      this.currentMapName = mapName;
      this.chart.geo.map = mapName;
      this.chart.series[0].map = mapName;
      this.reset();
      this.loadbackMapEvents(o);
    },
    //双击依赖组件关联方法
    loaddbClickEvents(data) {
      let { fn } = this.eventRelativeDeal.dbclick;
      this.currentComponentData = data;
      this.handleCommonEmit(fn, data);
    },
    //返回地图
    loadbackMapEvents(data) {
      let { fn } = this.eventRelativeDeal.back;
      this.currentComponentData = data;
      this.handleCommonEmit(fn, data);
    },
    //地图切换
    handleChangeMap(code, showName) {
      // 找出自定义列表的地图列表
      const areaList = this.area.areaList || [];
      const item = areaList.find((it) => it.code === code || it.text === code);
      let url = item ? item.value : this.$getWebPath(`static/js/libs/three/geoJson/${code}.json`, __DSF_DATAVIEW_PATH__);
      let mapName = dsf.uuid(32);
      // 如果是中国地图 mapName 必须是china
      if (code === "china") {
        mapName = "china";
      }

      this.loadMap(url, mapName, showName).then(this.reset);
    },
    //删除地图数据
    handleDeleteMapData(name) {
      if (!name) {
        this.chart.series.forEach((item) => {
          item.data = [];
        });
        this.reset();
      }
      let item = this.chart.series.find((it) => it.name == name);
      if (item) {
        item.data = [];
        this.reset();
      }
    },
    //添加点位
    addScatter(data, seriesName, chart = this.chart) {
      let series = chart.series.find((it) => it.name == seriesName);
      if (!series) return false;

      series.data = data
        .map((it) => {
          let coordMap = this.coordMap;
          // 兼容坐标系
          if (typeof it.value === "string" && it.value.indexOf(",") > -1) {
            return {
              ...it,
              name: it.name,
              visualMap: false,
              value: it.value.split(","),
            };
          } else if (Array.isArray(it.value)) {
            return {
              ...it,
              name: it.name,
              visualMap: false,
              value: it.value,
            };
          }
          //过滤出有数值的数据
          if (coordMap.get(it.name) && it.value != "" && it.value != null) {
            return {
              ...it,
              name: it.name,
              visualMap: false,
              value: coordMap.get(it.name) ? coordMap.get(it.name).concat(it.value) : [],
            };
          } else {
            return null;
          }
        })
        .filter((it) => it);
    },
    //添加热力图
    addHeatMap(data) {
      this.chart.series[0].data = data;
    },

    //添加飞行线
    addFlyLine(data, seriesName, chart = this.chart) {
      let series = chart.series.find((it) => it.name == seriesName);
      if (!series) return false;
      series.data = data.map((it) => {
        let coordMap = this.coordMap;
        let start = coordMap.get(it[0]) ? coordMap.get(it[0]) : [];
        let end = coordMap.get(it[1]) ? coordMap.get(it[1]) : [];
        //兼容坐标系
        if (typeof it[0] == "string" && it[0].indexOf(",") > -1) {
          start = it[0].split(",");
        } else if (Array.isArray(it[0])) {
          start = it[0];
        }
        if (typeof it[1] == "string" && it[1].indexOf(",") > -1) {
          end = it[1].split(",");
        } else if (Array.isArray(it[1])) {
          end = it[1];
        }

        return {
          ...it,
          visualMap: false,
          coords: [start, end],
        };
      });
    },

    /**
     * ai 大模型输出数据处理
     * @param {Array} describe 字段描述信息
     * @param {Array} data 数据
     */
    dataModelAnalysis({ describe, data, title,options = {} }) {
      const dictionary = {};
      describe.forEach(({ title, field }) => {
        dictionary[field] = title;
      });
      const chartOptions = this.chart;
      chartOptions.series = chartOptions.series.slice(0, 1);
      const map = chartOptions.series[0];
      const visualMap = chartOptions.visualMap;
      visualMap.show = true;

      map.seriesName = title;

      const features = this.mapJsonMap.get(this.currentMapName).features;
      if (!Array.isArray(features)) return false;
      try {
        const districtNames = features.map((it) => {
          return [it.properties.name, it.properties.adcode];
        });
        const nameRelation = describe[0].field;
        map.nameRelation = nameRelation;
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
              visualMap.min = min;
              visualMap.max = max + min;
            }
            map.valueRelation = "value";
            break;
          }
        }

        // 认为字符串开头两个字符 能够和 districtNames 开头两个字符匹配 则认为是相同
        data.forEach((it) => {
          const name = it[nameRelation];
          const item = districtNames.find((_) => (_[0] + "").startsWith((name + "").substr(0, 2)) || name == _[1]);
          if (item) {
            it[nameRelation] = item[0];
          }
        });
        dictionary[nameRelation] = "地区名称";


        dsf.mix(true, chartOptions, options);
        // 处理成Excel
        const excelData = dsf.dataview.utils.transformToExcelData(data, dictionary);
        this.excelData.length = 0;
        dsf.mix(true, this.excelData, excelData);
        this.$emit("update:excelData", excelData);
      } catch (error) {
        console.warn(`error-${error}`);
      }
    },
    beforeInit() {
      this.loadEcharts(this)
        .then(() => {
          //注册地图
          this.registerMap().then(() => {
            //这里需要注册完地图在初始化容器
            this.initEcharts();

            this.init();
          });
        })
        .catch((ex) => {
          dsf.error(ex);
        });
    },
    registerMap() {
      // ai 大模型
      if (this.modelArgs && this.modelArgs.district) {
        const area = this.modelArgs.district;
        this.area.area = area == "100000" ? "china" : area;
        this.area.showName = this.modelArgs.title;
      }
      let { area, showName = dsf.uuid(32), url } = this.area;

      let mapName = dsf.uuid(32);

      // 如果是中国地图 mapName 必须是china
      if (area == "china" && !url) {
        mapName = "china";
      }
      if (!url) {
        url = this.$getWebPath(`static/js/libs/three/geoJson/${area}.json`, __DSF_DATAVIEW_PATH__);
      }
      return this.loadMap(url, mapName, showName);
    },

    loadMap(url, mapName, showName) {
      return this.dsf.http.get(url, {}).done((result) => {
        let echarts = window.$echarts || window.echarts;

        // 允许修改返回的地理geojson信息
        if (typeof this.modifyJSON === "function" && this.modifyJSON(result)) {
          result = this.modifyJSON(result);
        }

        echarts.registerMap(mapName, result);
        this.mapJsonMap.set(mapName, result);

        this.currentMapName = this.chart.geo.map = mapName;

        this.chart.series[0].map = mapName;

        //计算中心坐标点
        let features = result.features;
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

        //放入地图列表
        this.mapNames.push({
          name: showName || mapName,
          value: mapName,
        });
      });
    },
    //事件添加
    resetCallback() {
      let chart = this.chartObj;

      let series = this.chart.series;
      // 数据项目
      let index = this.defaultSeries;

      // 当前索引
      let curInd = 0;
      const len = series[index]?.data ? series[index].data.length : 0;

      let highSeries = [index];
      clearInterval(this.timer);
      if (this.isCycle && this.cycleTime > 0 && len) {
        /*建立时间监听器*/
        this.timer = setInterval(function () {
          chart.dispatchAction({
            type: "downplay",
            seriesIndex: highSeries,
          });
          chart.dispatchAction({
            type: "hideTip",
            seriesIndex: highSeries,
          });
          curInd++;
          if (curInd === len) {
            curInd = 0;
          }
          chart.dispatchAction({
            type: "highlight",
            seriesIndex: highSeries,
            dataIndex: curInd,
          });
          chart.dispatchAction({
            type: "showTip",
            seriesIndex: highSeries,
            dataIndex: curInd,
          });
        }, this.cycleTime);
      }
      try {
        chart.off("click");
        chart.off("dblclick");
        chart.off("georoam");
        chart.off("contextmenu");
      } catch (error) {
        console.log(error);
      }

      chart.on("click", (params) => {
        const name = params.name;
        clearTimeout(this.clickTimer);
        this.clickTimer = setTimeout(() => {
          // echarts 点击事件
          let item = null;
          if (Array.isArray(this.data)) {
            item = this.data.find((it) => it.name === params.name);
          }
          if (item) {
            params = item;
          }
          if (this.$listeners["chart-click"]) {
            this.$dispatch("chart-click", params);
          }
          const mapData = this.mapJsonMap.get(this.currentMapName);

          if (name && mapData) {
            const district = mapData.features.find((it) => it.properties.name === name);
            const code = district ? district.properties.adcode : "";
            params.code = code;
          }
          this.loadClickEvents(params);
        }, 500);
      });

      chart.on("dblclick", (params) => {
        const name = params.name;
        clearTimeout(this.clickTimer);
        let item = this.data?.find((it) => it.name === params.name);
        if (item) {
          params = item;
        }
        if (this.$listeners["chart-dblclick"]) {
          this.$dispatch("chart-dblclick", params);
        }

        const mapData = this.mapJsonMap.get(this.currentMapName);
        if (name && mapData) {
          const district = mapData.features.find((it) => it.properties.name === name);
          const code = district ? district.properties.adcode : "";
          params.code = code;
        }
        this.loaddbClickEvents(params);
      });
      chart &&
        chart.on("contextmenu", (params) => {
          //阻止默认的事件发生
          params.event.event.preventDefault(true);
          if (this.$listeners["chart-contextmenu"]) {
            this.$dispatch("chart-contextmenu", params);
          }
        });
      //geo 同步缩放
      chart.on("georoam", function (params) {
        var option = chart.getOption(); //获得option对象

        if (params.zoom != null && params.zoom != undefined) {
          //捕捉到缩放时
          option.geo[0].zoom = option.series[0].zoom; //下层geo的缩放等级跟着上层的map一起改变
          option.geo[0].center = option.series[0].center; //下层的geo的中心位置随着上层map一起改变
        } else {
          //捕捉到拖曳时
          option.geo[0].center = option.series[0].center; //下层的geo的中心位置随着上层map一起改变
        }
        chart.setOption(option); //设置option
      });
    },
    // 地图按钮点击事件处理
    handlemapButtonGroupClick(idx) {
      if (!this.chartObj) {
        return;
      }
      const option = this.chartObj.getOption(); //获得option对象
      const item = this.mapButtonGroupAttr.buttons[idx];
      const seriesMap = option.series.find((it) => it.type === "map");
      const geoMap = option.geo[0];
      // 不执行地图操作事件
      if (!seriesMap || !geoMap) {
        return;
      }
      const { name } = item;
      // 对zoom值做限定, 最小值不能小于0，最大值不能大于100
      switch (name) {
        case "放大":
          seriesMap.zoom += this.mapButtonGroupAttr.eidtSize;
          geoMap.zoom += this.mapButtonGroupAttr.eidtSize;
          if (geoMap.zoom > 100) {
            seriesMap.zoom = 100;
            geoMap.zoom = 100;
          }
          break;
        case "缩小":
          seriesMap.zoom -= this.mapButtonGroupAttr.eidtSize;
          geoMap.zoom -= this.mapButtonGroupAttr.eidtSize;
          if (geoMap.zoom <= 0) {
            seriesMap.zoom = 0.01;
            geoMap.zoom = 0.01;
          }
          break;
        case "重置":
          seriesMap.zoom = 1.1;
          geoMap.zoom = 1.1;
          break;
      }
      // 重绘地图
      this.chartObj.setOption(option);
    },

    //创建随机地图数据
    createdDataRandom(type) {
      let res = [];
      const data = this.mapJsonMap.get(this.currentMapName);
      const features = data ? data.features : [];
      if (type === "lines") {
        features.slice(0, 10).forEach((it) => {
          res.push(it.properties.name);
        });
        let end = res.slice(-1)[0];
        let line = [];
        for (let i = 0; i < res.length - 1; i++) {
          line.push([res[i], end]);
        }
        return line;
      } else {
        features.slice(0, 10).forEach((it) => {
          res.push({
            name: it.properties.name,
            value: parseInt(1000 * Math.random()),
          });
        });
        return res;
      }
    },
    extraCallBack(chart) {
      const series = this.getMapCustomSeries(_.cloneDeep(chart.series));
      const labelSeries = series.filter((it) => it.type === "scatter" || it.type === "map");
      labelSeries.forEach((it) => {
        const label = it.label;
        if (Array.isArray(label.formatters) && !label.isFormatter) {
          const formatter = label.formatters;
          const formatterString = JSON.stringify(formatter);
          let code = "";

          if (it.type === "scatter") {
            code = `var formatter = ${formatterString};
            var content = dsf.dataview.utils.labelStringToFunction(formatter,params,'scatter-map');
            return content;`;
          } else if (it.type === "map") {
            code = `var formatter = ${formatterString};
            var content = dsf.dataview.utils.labelStringToFunction(formatter,params);
            return content;`;
          }
          label.formatter = new Function("params", code);
        }
      });

      chart.series = series;
    },
  },
};
