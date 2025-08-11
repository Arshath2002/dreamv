/*
 * @Description:
 * @Author: zhanghang
 * @Date: 2023-03-31 17:08:38
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-07-23 15:21:25
 */
import graphEvent from "./graphEvent.js";
import dataAndGraphRelationMixin from "./dataAndGraphRelationMixin.js";
import dynamicCharts from "./dynamicCharts.js";
import styleOptions from "./styleOptions.js";
import { chartCommon } from "_dataview/output/utils/commonEvent.js";
import { handleColor, ColorRegexp } from "_dataview/output/config/commonConfig";
import defaultBackground from "_dataview/share/components/common/backgroundDefault.js";

export default {
  mixins: [graphEvent, dataAndGraphRelationMixin, dynamicCharts, styleOptions],
  props: {
    //风格对应组件key
    styleMapKey: {
      type: String,
      default: "dataviewGraph",
    },
    //tooltip字段样式显示规则
    fieldsStyleRules: {
      type: Array,
      default() {
        return [];
      },
    },
    //chart对象 字符串形式
    chartString: {
      type: String,
      default: "",
    },
    // 是否循环
    isCycle: {
      type: Boolean,
      default: false,
    },
    //循环时间
    cycleTime: {
      type: [String, Number],
      default: "3000",
    },
    //默认高亮项
    defaultHighLight: {
      type: Number,
      default: 8,
    },
    //部分图表滚动条
    dataZoom: {
      type: Boolean,
      default: false,
    },
    dataZoomInfo: {
      type: Object,
      default: () => ({
        backgroundColor: "rgba(0, 48, 98, 0.05)",
        fillerColor: "#018BFF",
        handleColor: "#cecece",
        width: "90%",
        height: "8",
        top: "auto",
        right: "20",
        left: "auto",
        bottom: "12",
      }),
    },
    dataZoomNumber: {
      type: Number,
      default: 8,
    },
    //是否开启类目轴标签是否自动旋转
    isDataZoomRotate: {
      type: Boolean,
      default: false,
    },
    //类目轴达到90deg要求最大的数量,默认类目轴data的数量
    dataZoomRotateMaxNumber: {
      type: Number,
      default: -1,
    },
    dataZoomStart: {
      type: Boolean,
      default: false,
    },
    dataZoomCustom: {
      type: Boolean,
      default: false,
    },
    splitName: {
      type: Number,
      default: 0,
    },
    controlBackgroundConfig: {
      type: Object,
      default() {
        return defaultBackground;
      },
    },
  },
  computed: {
    startCycle() {
      return this.isCycle && this.cycleTime > 0;
    },
    includeEvents() {
      let commonEvents = Object.keys(chartCommon);
      return [...commonEvents, ...this.otherEvents];
    },
    dataZoomOption() {
      let options = {
        type: "slider",
        show: true,
        textStyle: {
          color: "#DCF0FF",
        },
        orient: "horizontal",
        left: "auto",
        xAxisIndex: [0],
        borderColor: "none",
        fillerColor: "#018BFF",
        backgroundColor: "#003062",
        height: 8,
        handleIcon:
          "M512 512m-208 0a6.5 6.5 0 1 0 416 0 6.5 6.5 0 1 0-416 0Z M512 192C335.264 192 192 335.264 192 512c0 176.736 143.264 320 320 320s320-143.264 320-320C832 335.264 688.736 192 512 192zM512 800c-159.072 0-288-128.928-288-288 0-159.072 128.928-288 288-288s288 128.928 288 288C800 671.072 671.072 800 512 800z",
        handleColor: "#cecece",
        handleSize: 15,
        handleStyle: {
          borderColor: "#cecece",
        },
        showDetail: false,
        brushSelect: false,
        bottom: 12,
      };
      return {
        ...options,
        ...this.dataZoomInfo,
      };
    },
  },
  watch: {
    dataZoomCustom() {
      this.$nextTick(() => {
        if (this.isDesign) {
          this.middleWareData();
        }
      });
    },
    dataZoomStart() {
      this.$nextTick(() => {
        if (this.isDesign) {
          this.middleWareData();
        }
      });
    },
    dataZoomNumber() {
      this.$nextTick(() => {
        if (this.isDesign) {
          this.middleWareData();
        }
      });
    },

    dataZoomOption() {
      this.$nextTick(() => {
        if (this.isDesign) {
          this.middleWareData();
        }
      });
    },
    dataZoom: {
      handler(v) {
        if (this.isDesign) {
          this.middleWareData();
        }
      },
    },
    splitName() {
      if (this.isDesign) {
        this.middleWareData();
      }
    },
    cycleTime() {
      this.resetCallback();
    },
    isCycle() {
      this.resetCallback();
    },
  },
  data() {
    return {
      // 图表对象
      chartObj: null,
      timer: null,
      // 组件类型
      componentType: "chart",
      otherEvents: [],
    };
  },
  created() {
    // chartString 获取 chartString 作为chart
    if (this.chartString) {
      let chartString = this.chartString;
      let chart = dsf.eval(chartString);
      for (let key in this.chart) {
        Reflect.deleteProperty(this.chart, key);
      }
      Object.assign(this.chart, chart);
      this.$emit("update:chart", chart);
    } else {
      //这里将chart 转化为 chartString
      let o = dsf.dataview.utils.objectToString(this.chart, true);
      this.$emit("update:chartString", o);
    }
    dsf.emit.$on(
      "updateChart",
      (args) => {
        console.log("接受");
        // chart
        const chart = args.chart;
        this.$emit("update:chart", chart);
        //在option 获取之后执行
        setTimeout(() => {
          this.middleWareData(this.serviceData);
        });
      },
      this
    );
  },
  beforeDestroy() {
    dsf.emit.$remove("updateChart", this);
    dsf.emit.$remove("loadCharts", this);
    clearInterval(this.timer);
    this.chartObj && this.chartObj.dispose?.();
  },
  methods: {
    //获取下一个色值
    getNextColor() {
      const chartOptions = this.chart;
      const colors = chartOptions.color;
      const series = chartOptions.series;
      let len = series.length;
      let next = colors[len % colors.length];
      let exits = series.map((data) => data.itemStyle.color);
      let recurveIndex = 0;
      while (exits.includes(next) && recurveIndex < 50) {
        len++;
        recurveIndex++;
        next = colors[len % colors.length];
      }
      return next;
    },

    // 复制字体样式，返回数组
    copyTextStyles() {
      return this.chart.series.map((_, i) => {
        return this.textStyleProxy(`series.${i}.label`);
      });
    },
    // 粘贴字体样式，默认取 label 字体，个别特殊的在组件内单独实现
    pasteTextStyles(textStyles) {
      for (let i = 0; i < textStyles.length; i++) {
        // 字体不支持渐变，只取第一个色值
        const color = handleColor(textStyles[i].color);
        textStyles[i].color = color.replace(ColorRegexp, "$1");
        this.textStyleProxy(`series.${i}.label`, textStyles[i]);
      }
    },
    textStyleProxy(property, values = null) {
      const target = property.split(".").reduce((obj, key) => (obj ? obj[key] : null), this.chart);
      if (!target) return;
      const fontKeys = ["color", "fontSize", "fontWeight", "fontStyle"];
      if (values) {
        fontKeys.forEach((key) => {
          target[key] = values[key];
        });
      } else {
        return fontKeys.reduce((item, key) => {
          if (target[key] !== undefined) item[key] = target[key];
          return item;
        }, {});
      }
    },
    // 设置组件样式
    setComponentStyle(groups, props) {
      groups.forEach((group) => {
        group.attributes.forEach((attr) => {
          if (attr.bindControlAttr && !attr.noCopy) {
            this.updateComponentStyle(attr.bindControlAttr, null, props);
          } else if (attr.showType === "dv_chart_grid" && props.padding) {
            const grid = this.chart.grid;
            [grid.top, grid.right, grid.bottom, grid.left] = props.padding;
          }
        });
      });
    },
    // 复制组件样式
    copyComponentStyle() {
      return {
        _props: this.getComponentStyle(),
        chart: this.chart,
        // 固定为数组格式，按主、次顺序
        textStyles: this.copyTextStyles(),
        backgrounds: [this.controlBackgroundConfig],
      };
    },
    // 粘贴组件样式
    pasteComponentStyle(config) {
      const areSameComps = config._props.ctrlName === this.ctrlName;
      let groups = this.$designer.attributesGroup.filter((it) => !/数据|属性|插槽/.test(it.name));
      function deepCopy(current, target, key = "chart") {
        if (!current || !target || key === "chart.title.text") return;
        if (key === "chart.series") {
          // 匹配相同类型的 series
          const seriesMap = {};
          target.forEach((it) => {
            if (seriesMap[it.type]) {
              seriesMap[it.type].push(it);
            } else {
              seriesMap[it.type] = [it];
            }
          });
          for (let i = 0; i < current.length; i++) {
            const type = current[i].type;
            // custom 类型必须为相同组件
            if (type === "custom" && !areSameComps) continue;
            if (seriesMap[type] && seriesMap[type].length) {
              const item = seriesMap[type].shift();
              deepCopy(current[i], item, key + "." + i);
            }
          }
          return;
        } else if (/^chart.series.\d+.data$/.test(key)) {
          // 裁剪多余的数据，保留部分通用属性
          target = target.slice(0, current.length).map((item) => {
            return Object.keys(item)
              .filter((k) => /label|style|emphasis|blur|select|symbol|tooltip/i.test(k))
              .reduce((obj, it) => ((obj[it] = item[it]), obj), {});
          });
        } else if (/^chart.\wAxis.\d+.(data|mapRelation)$/.test(key)) {
          return;
        }
        Object.keys(target).forEach((k) => {
          if (typeof current[k] === "object" && typeof target[k] === "object" && k !== "markLine") {
            // markLine 特殊处理
            deepCopy(current[k], target[k], key + "." + k);
          } else if (typeof target[k] !== "function" && !/type|name|data|val|relation|AxisIndex/gi.test(k)) {
            // 第一层属性不能无中生有
            if (key === "chart" && current[k] !== undefined) return;
            current[k] = target[k];
          }
        });
      }
      if (!areSameComps) {
        const { textStyles = [], backgrounds = [] } = config;
        groups = groups.filter((it) => /布局|背景|边框设置|入场动画/.test(it.name));
        this.pasteTextStyles(textStyles);
        this.updateComponentStyle("controlBackgroundConfig", backgrounds[0]);
      }
      this.setComponentStyle(groups, config._props);

      // 粘贴 chart 属性，方法内有校验，* 第二个参数区分 highchart 与 echarts 的 chart 对象
      deepCopy(this.chart, config.chart);
      this.chartString = dsf.dataview.utils.objectToString(this.chart, true);
      this.$nextTick(() => this.init());
    },
    changeGraph(attributes) {
      dsf.layer.confirm("是否切换图表类型？").then(() => {
        attributes.customType = "graph";
        //获取动态的数据来源
        let { combineTable, dataSource, dataType, dataURL, mapFieldList, excelMapFieldList, excelData, datasourceMapFieldList, configAttachRequestParams, combineTableParams, dataSourceParams } = this;
        let comp = attributes.data;
        //数据源保留
        let common = false;
        if (comp) {
          let content = JSON.parse(comp.content);
          content.combineTable = combineTable;
          //添加风格属性--保留
          // content.isDesignerAdd = true

          content.dataSource = dataSource;
          content.dataURL = dataURL;
          content.dataType = dataType;
          content.excelData = excelData;
          content.excelMapFieldList = excelMapFieldList;
          content.mapFieldList = mapFieldList;
          content.datasourceMapFieldList = datasourceMapFieldList;
          content.configAttachRequestParams = configAttachRequestParams;
          content.combineTableParams = combineTableParams;
          content.dataSourceParams = dataSourceParams;

          if (content.ctrlType === this.ctrlType) {
            common = true;
            if (content.chartString) {
              const chart = dsf.eval(content.chartString);
              //先这样，后期单独处理每个图表组件
              this.chart.series?.forEach((it, index) => {
                chart.series[index] && (chart.series[index].nameRelation = it.nameRelation);
                chart.series[index] && (chart.series[index].valueRelation = it.valueRelation);
              });
              this.chart.xAxis?.forEach((it, index) => {
                chart.xAxis[index] && (chart.xAxis[index].nameRelation = it.nameRelation);
                chart.xAxis[index] && (chart.xAxis[index].valueRelation = it.valueRelation);
              });
              this.chart.yAxis?.forEach((it, index) => {
                chart.yAxis[index] && (chart.yAxis[index].nameRelation = it.nameRelation);
                chart.yAxis[index] && (chart.yAxis[index].valueRelation = it.valueRelation);
              });
              content.chartString = dsf.dataview.utils.objectToString(chart, true);
            }
          }
          comp.content = JSON.stringify(content);
        }

        this.$designer.changeSelectComp(attributes, null);
      });
    },
    //excel 数据处理
    dealExcelData() {},
    //标准数据解析-excel数据方式
    standardDataAnalysis() {},
    calculateDataZoom(chart = this.chart) {
      // 配置总览自定义不走删除dataZoom逻辑
      if (this.dataZoomCustom) {
        return;
      }
      //开启的
      if (this.dataZoom && chart.xAxis && chart.yAxis) {
        let xAxis = chart.xAxis[0];
        let yAxis = chart.yAxis[0];

        let dataZoom = dsf.mix(true, {}, this.dataZoomOption);

        let dataZoomW = dataZoom.width;
        let dataZoomH = dataZoom.height;
        if (xAxis.type === "category") {
          let category = xAxis;
          let categoryLength = category.data.length;
          dataZoom.xAxisIndex = [0];
          Reflect.deleteProperty(dataZoom, "yAxisIndex");
          // x轴类目轴
          if (this.dataZoomNumber < categoryLength) {
            const startIdx = this.dataZoomStart ? 0 : categoryLength - this.dataZoomNumber;
            const endIdx = this.dataZoomStart ? this.dataZoomNumber - 1 : categoryLength - 1;
            dataZoom.startValue = category.data[startIdx] + "";
            dataZoom.endValue = category.data[endIdx] + "";
            dataZoom.orient = "horizontal";
            dataZoom.width = dataZoomW;
            dataZoom.height = dataZoomH;
            chart.dataZoom = dataZoom;
          } else {
            Reflect.deleteProperty(chart, "dataZoom");
          }
        } else if (yAxis.type === "category") {
          let category = yAxis;
          let categoryLength = category.data.length;
          dataZoom.yAxisIndex = [0];
          Reflect.deleteProperty(dataZoom, "xAxisIndex");
          // y轴类目轴
          if (this.dataZoomNumber < categoryLength) {
            const startIdx = this.dataZoomStart ? 0 : categoryLength - this.dataZoomNumber;
            const endIdx = this.dataZoomStart ? this.dataZoomNumber - 1 : categoryLength - 1;
            dataZoom.startValue = category.data[startIdx];
            dataZoom.endValue = category.data[endIdx];
            dataZoom.orient = "vertical";
            dataZoom.width = dataZoomH;
            dataZoom.height = dataZoomW;
            chart.dataZoom = dataZoom;
          } else {
            Reflect.deleteProperty(chart, "dataZoom");
          }
        } else {
          Reflect.deleteProperty(chart, "dataZoom");
        }
      } else {
        Reflect.deleteProperty(chart, "dataZoom");
      }
    },
    beforeInit() {
      this.loadCharts(this)
        .then(() => {
          this.init();
        })
        .catch((ex) => {
          dsf.error(ex);
        });
    },
    loadCharts() {
      return this.loadEcharts(this)
        .then(() => {
          this.initEcharts();
        })
        .catch((ex) => {
          throw ex;
        });
    },
    initEcharts() {
      let echarts = window.$echarts || window.echarts;
      this.chartObj = echarts.init(this.$refs["chart"]);
    },
    loadEcharts(tag) {
      return new Promise((resolve, reject) => {
        if (!window.echarts && !window.$echarts) {
          /****观察者模式动态加载echarts script 标签，防止多次加载script   start******************/
          dsf.emit.$on(
            "loadCharts",
            () => {
              window.$echarts = window.echarts;
              //加载完成
              resolve();
            },
            tag
          );
          if (!window.echartsLoad) {
            window.echartsLoad = true;
            let loadFileHttp = dsf.dataview.utils.importFiles(
              [this.$getWebPath("static/js/libs/echarts/echarts.min.5.5.1.js", __DSF_DATAVIEW_PATH__)],
              () => {
                dsf.emit.$emit("loadCharts");
              },
              (err) => {
                dsf.layer.message("加载echarts文件报错", false);
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
    //过滤属性
    filterChartData(chart) {
      if (!this.isDesign) return false;
      const keys = ["timeline", "options"];

      // 走dataZoom配置，不走配置总览
      if (!this.dataZoomCustom) {
        keys.push("dataZoom");
      }

      keys.forEach((key) => {
        Reflect.deleteProperty(chart, key);
      });
      // 地图构造数据图层删除
      if (chart.geo) {
        chart.series = chart.series.filter((it) => !it.seriesLayer);
      }
      if (chart.globe && typeof chart.globe.baseTexture === "object") {
        chart.globe.baseTexture = "";
      }
    },
    addMarkLineToLine() {},
    /**
     * @description: 处理图表是否有数据
     */
    handleEchartsHasData() {
      let series = this.chart.series;
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
    },
    reset() {
      if (!this.chartObj || !this.chart) return false;
      this.chartObj.hideLoading();
      this.handleEchartsHasData();
      // 额外的钩子函数
      this.extraCallBack(this.chart, this);

      // 下面三个存在先后顺序，勿动
      this.addMarkLineToLine();
      this.calculateTimeline();
      this.splitCategory();
      this.calculateDataZoom();

      this.chartObj.clear();
      //这里给函数绑定组件对象 _bind
      this.bindChartContext(this.chart);
      //将数字字符串转换成number，---防止一些图标展示异常
      this.transformNumber(this.chart);
      // 特殊额外的钩子
      this.beforeSpecialSetOption(this.chart, this);

      if (!this.designerSave) {
        this.chartObj.setOption(this.chart, true);
      }
      // 特殊额外的钩子
      this.afterSpecialSetOption(this.chart);
      this.filterChartData(this.chart);

      // 更新设计器图表数据
      this.updateChartDesigner();

      setTimeout(this.resetCallback, 500);
    },

    /**
     * 更新设计器图表内容
     */
    updateChartDesigner() {
      if (!this.isDesign) return false;
      const chart = this.chart;
      const chartString = dsf.dataview.utils.objectToString(chart, true);
      this.$emit("update:chart", chart);
      this.$emit("update:chartString", chartString);
    },
    //渲染之前特殊属性的处理
    beforeSpecialSetOption() {
      // 处理过滤条件保留0
      this.handleKeepZeroLabel();
    },
    // 找出保留小数大于1的并且保留0的
    findFilterDecimalData(valueField) {
      let dealDataList = this.dealDataList;

      return _.findLast(dealDataList, (it) => it.valueName === valueField && it.rule === "decimal" && it.threshold > 0 && it.keepZero);
    },
    // 处理过滤条件保留0
    handleKeepZeroLabel() {
      const series = this.chart.series;
      if (!series || !series.length) return;
      const seriesTypeList = new Set(["pie", "bar", "line", "sunburst", "scatter", "treemap", "funnel", "pictorialBar", "custom", "graph"]);
      series.forEach((item) => {
        if (!seriesTypeList.has(item.type)) return;

        const { label, valueRelation } = item;
        if (!label) return;

        const filterOne = this.findFilterDecimalData(valueRelation);
        if (!filterOne) return;
        if (label.formatter && typeof label.formatter !== "string") {
          return;
        }
        label.temporaryCache = label.formatter;
        const threshold = filterOne.threshold;

        label.formatter = (param) => {
          const val = typeof param.value === "number" ? param.value.toFixed(threshold) : param.value;
          return label.temporaryCache
            ? label.temporaryCache
                .replace(/{a}/g, param.seriesName) // 系列名
                .replace(/{b}/g, param.name) // 数据名
                .replace(/{c}/g, val) // 数据值
            : item.type !== "sunburst"
            ? val
            : undefined;
        };
      });
    },
    // 渲染后特殊属性的处理
    afterSpecialSetOption() {
      this.handleFinishKeepZeroLabel();
    },
    // 处理渲染后保留0后的处理
    handleFinishKeepZeroLabel() {
      let series = this.chart.series;
      if (series && series.length) {
        series.forEach((item) => {
          let label = item.label;
          if (label && "temporaryCache" in label) {
            label.formatter = label.temporaryCache;
            delete label.temporaryCache;
            if (!label.formatter) {
              delete label.formatter;
            }
          }
        });
      }
    },
    transformNumber(item, key) {
      // 如果是data 中的数据不处理
      if (key === "data" || key == "dataZoom") {
        return false;
      }
      if (dsf.isObject(item) || Array.isArray(item)) {
        Object.keys(item).forEach((key) => {
          const it = item[key];
          if (dsf.isNumber(it) && typeof it === "string") {
            item[key] = Number(it);
          } else {
            this.transformNumber(it, key);
          }
        });
      }
    },
    //类目轴名称分割
    splitCategory() {},

    cycleHighlight(series) {
      clearInterval(this.timer);
      let chart = this.chartObj;
      const self = this;
      let curInd = -1;
      const len = series[0].data.length;
      let highSeries = [0];

      function highlight() {
        chart.dispatchAction({
          type: "downplay",
          seriesIndex: highSeries,
        });

        if (self.chart.tooltip.show) {
          chart.dispatchAction({
            type: "hideTip",
            seriesIndex: highSeries,
          });
        }

        curInd++;
        if (curInd === len) {
          curInd = 0;
        }
        chart.dispatchAction({
          type: "highlight",
          seriesIndex: highSeries,
          dataIndex: curInd,
        });

        if (self.chart.tooltip.show) {
          chart.dispatchAction({
            type: "showTip",
            seriesIndex: highSeries,
            dataIndex: curInd,
          });
        }
      }
      if (this.startCycle && len) {
        /*建立时间监听器*/
        highlight();
        this.timer = setInterval(highlight, this.cycleTime);
      }
    },
    //事件添加
    resetCallback() {
      let chart = this.chartObj;

      let series = this.chart.series;
      if (!series || series.length === 0) {
        return false;
      }
      try {
        chart.off("click");
        chart.off("dataZoom");
        chart.off("mouseover");
        chart.off("mouseout");
        chart.off("mousemove");
        chart.off("contextmenu");
      } catch (error) {
        console.log(error);
      }
      //循环高亮
      this.cycleHighlight(series);
      // 增加鼠标手势判断
      chart.on("mousemove", () => {
        let cursor = this.isEventCursorPointer ? "pointer" : "default";
        chart.getZr().setCursorStyle(cursor);
      });
      chart.on("mouseover", (params) => {
        clearInterval(this.timer);
        chart.dispatchAction({
          type: "downplay",
        });
        chart.dispatchAction({
          type: "hideTip",
        });
        chart.dispatchAction({
          type: "highlight",
          seriesIndex: params.seriesIndex,
          dataIndex: params.dataIndex,
        });

        if (this.chart.tooltip.show) {
          chart.dispatchAction({
            type: "showTip",
            seriesIndex: params.seriesIndex,
            dataIndex: params.dataIndex,
          });
        }
      });
      chart.on("mouseout", () => {
        chart.dispatchAction({
          type: "hideTip",
        });
        chart.dispatchAction({
          type: "downplay",
        });
        this.cycleHighlight(series);
      });
      chart.on("click", (params) => {
        if (this.$listeners["chart-click"]) {
          this.$dispatch("chart-click", params);
        }
        this.loadClickEvents(params);
      });
      chart &&
        chart.on("contextmenu", (params) => {
          //阻止默认的事件发生
          params.event.event.preventDefault(true);
          if (this.$listeners["chart-contextmenu"]) {
            this.$dispatch("chart-contextmenu", params);
          }
        });
      let currentRotate = 0;
      //图表监听缩放拖动
      chart.on("dataZoom", (params) => {
        let option = chart.getOption();
        if (!this.isDataZoomRotate || !option.dataZoom || option.xAxis[0].type != "category") return false;
        let length = option.xAxis[0].data.length;
        //不旋转占比
        let percent = parseInt((this.dataZoomNumber * 100) / length);
        // 设置最大旋转90deg 数量
        let maxPercent = this.dataZoomRotateMaxNumber > this.dataZoomNumber ? parseInt((100 * this.dataZoomRotateMaxNumber) / length) : 100;
        maxPercent = maxPercent > 100 ? 100 : maxPercent;
        //每次旋转的角度
        let _rotate = 90 / (maxPercent - percent);

        //当前占比
        let currentPercent = parseInt(params.end - params.start);
        let diff = currentPercent - percent;

        let _currentRotate = 0;
        if (diff > 0) {
          //最高旋转90deg
          _currentRotate = diff * _rotate > 90 ? 90 : diff * _rotate;
        }

        if (_currentRotate != currentRotate) {
          option.xAxis[0].axisLabel.rotate = _currentRotate;
          // chart.clear()
          chart.setOption(option);
          currentRotate = _currentRotate;
        }
      });
    },
    $resize() {
      this.chartObj && this.chartObj.resize();
    },
    //给chart对象bind this
    bindChartContext(chart) {
      if (typeof chart === "object" && chart != null) {
        Object.keys(chart).forEach((key) => {
          let value = chart[key];
          if (typeof value === "function") {
            const bind = value.bind(this);
            //解决函数bind 之后转字符串问题
            bind.toString = function () {
              return value.toString();
            };
            chart[key] = bind;
          } else {
            this.bindChartContext(value);
          }
        });
      }
    },
    // 额外的钩子函数, 组件在执行操作时,需要对charts做单属于组件的charts操作
    extraCallBack() {},
    resize() {
      this.$resize();
    },
  },
  // design: { // 暂时去掉
  //   metadata: {
  //     create() {
  //       this.designerSave = true;
  //       // 除了静态数据不保存数据
  //       if (this.dataType !== "static" && this.dynamicMapAnalysis) {
  //         // 清空数据
  //         this.dynamicMapAnalysis([]);
  //         const chartString = dsf.dataview.utils.objectToString(
  //           this.chart,
  //           true
  //         );
  //         this.chartString = chartString;
  //       }
  //       this.designerSave = false;
  //     },
  //   },
  // },
};
