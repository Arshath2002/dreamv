<!--
 * @Description: 饼图控件
 * @Author: zhanghang
 * @Date: 2021-07-28 13:44:13
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-05-08 16:43:35
-->
<template>
  <div
    class="data-view-item-wrap ds-control dsf-dv-graph data-view-no-padding ds-chart data-view-parent-slot-wrap"
    :style="controlStyle"
    v-loading="dataLoad"
    :element-loading-text="loadingText"
    :element-loading-spinner="loadingSpinner"
    :element-loading-background="loadingBackground"
  >
    <div class="chart" ref="chart" v-chart-nodata="!hasData"></div>
    <div
      class="slot-custom-position"
      v-if="isSlotCustomPosition"
      :style="slotCustomPositionStyle"
      slot-name="custom-position"
      :class="{
        'slot-common-block-wrap': isDesign,
      }"
    >
      <slot name="custom-position"></slot>
    </div>
  </div>
</template>
<script>
import { createPie3d, createPie3dSeries } from "_dataview/output/chartDefault/createPie3d.js";

import slotPageManage from "_dataview/mixins/slotPageManage.js";
import graph from "_dataview/mixins/graph.js";
import { handleColor, ColorRegexp } from "_dataview/output/config/commonConfig";
const staticDataKeyDic = {
  name: "名称",
  value: "数量",
};
const staticData = [
  {
    name: "锦江区",
    value: "167",
  },
  {
    name: "成华区",
    value: "67",
  },
  {
    name: "武侯区",
    value: "123",
  },
  {
    name: "高新区",
    value: "55",
  },
  {
    name: "青羊区",
    value: "98",
  },
  {
    name: "双流区",
    value: "55",
  },
  {
    name: "郫都区",
    value: "98",
  },
];
export default dsf.component({
  name: "DsfDataViewPie3d",
  ctrlCaption: "饼状图表3D",
  mixins: [$mixins.dataView, graph, slotPageManage],
  props: {
    slots: {
      type: Array,
      default() {
        return [
          {
            name: "default",
            controls: [],
          },
          {
            name: "custom-position",
            controls: [],
          },
        ];
      },
    },
    staticData: {
      type: Array,
      default: () => staticData,
    },
    //自定义配置总览
    chart: {
      type: Object,
      default: createPie3d,
    },
    isOpenHeight: {
      type: Boolean,
      default: false,
    },
    excelData: {
      type: Array,
      default: () => {
        return dsf.dataview.utils.transformToExcelData(staticData, staticDataKeyDic);
      },
    },
    is3DCycle: {
      type: Boolean,
      default: false,
    },
    cycle3DTime: {
      type: Number,
      default: 3000,
    },
  },
  data() {
    return {
      cycle3DTimer: null,
      currentIndex: 0,
    };
  },
  watch: {
    isOpenHeight() {
      if (this.isDesign) {
        this.beforeInit();
      }
    },
    staticData: {
      handler() {
        this.$nextTick(this.init);
      },
      deep: true,
    },
    is3DCycle() {
      this.init();
    },
    cycle3DTime() {
      clearInterval(this.cycle3DTimer);
      this.init();
    },
  },
  methods: {
    // 复制字体样式，返回数组
    copyTextStyles() {
      return this.chart.series.map((_, i) => {
        return this.textStyleProxy(`series.${i}.dataLabels.style`);
      });
    },
    // 粘贴字体样式
    pasteTextStyles(textStyles) {
      if (textStyles && textStyles.length) {
        for (let i = 0; i < textStyles.length; i++) {
          // 字体不支持渐变，只取第一个色值
          const color = handleColor(textStyles[i].color);
          textStyles[i].color = color.replace(ColorRegexp, "$1");
          this.textStyleProxy(`series.${i}.dataLabels.style`, textStyles[i]);
        }
      }
    },
    // 复制组件样式
    copyComponentStyle() {
      // 收集通用属性
      return {
        _props: {
          ...this.getComponentStyle(),
          chart: this.chart,
        },
        // 固定为数组格式，按主、次顺序
        textStyles: this.copyTextStyles(),
        backgrounds: [this.controlBackgroundConfig],
      };
    },
    // 粘贴组件样式
    pasteComponentStyle(config) {
      function deepCopy(current, target, key = "chart") {
        if (!current || !target) return;
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
            if (seriesMap[type] && seriesMap[type].length) {
              const item = seriesMap[type].shift();
              deepCopy(current[i], item, key + "." + i);
            }
          }
          return;
        } else if (key === "chart.series.data") {
          // 裁剪多余的数据
          target = target.slice(0, current.length).map((item) => {
            return Object.keys(item)
              .filter((k) => /label|style|emphasis|blur|select|symbol|tooltip|color/i.test(k))
              .reduce((obj, it) => ((obj[it] = item[it]), obj), {});
          });
        }
        Object.keys(target).forEach((k) => {
          // markLine 特殊处理
          if (typeof current[k] === "object" && typeof target[k] === "object") {
            deepCopy(current[k], target[k], key + "." + k);
          } else if (typeof target[k] !== "function" && !/name|type|val|relation/gi.test(k)) {
            // 第一层属性不能无中生有
            if (key === "chart" && current[k] !== undefined) return;
            current[k] = target[k];
          }
        });
      }
      let groups = null;
      if (config._props.ctrlName === this.ctrlName) {
        groups = this.$designer.attributesGroup.filter((it) => !/数据|属性|插槽/.test(it.name));
        // 粘贴 chart 属性，方法内有校验，* 第二个参数区分 highchart 与 echarts 的 chart 对象
        deepCopy(this.chart, config._props.chart);
      } else {
        groups = this.$designer.attributesGroup.filter((it) => /布局|背景|边框设置|入场动画/.test(it.name));
        const { textStyles = [], backgrounds = [] } = config;
        this.pasteTextStyles(textStyles);
        this.updateComponentStyle("controlBackgroundConfig", backgrounds[0]);
      }
      this.setComponentStyle(groups, config._props);

      this.chartString = dsf.dataview.utils.objectToString(this.chart, true);
      this.$nextTick(() => this.reset());
    },
    beforeInit() {
      this.loadScript(() => {
        if (this.isOpenHeight) {
          this.wrap();
        }
        this.init();
      });
    },
    addItem(seriesRelation, nameRelation, valueRelation) {
      const series = createPie3dSeries({ name: seriesRelation, nameRelation, valueRelation });
      // series.name
      this.chart.series.push(series);
    },
    /**
     * ai 大模型输出数据处理
     * @param {Array} describe 字段描述信息
     * @param {Array} data 数据
     */
    dataModelAnalysis({ describe, data, options = {} }) {
      const chartOptions = this.chart;
      chartOptions.series = [];
      const [dimension, ...rest] = describe;
      const dictionary = describe.reduce((o, it) => ((o[it.field] = it.title), o), {});
      try {
        if (data.length) {
          for (let i = 0; i < rest.length; i++) {
            const key = rest[i].field;
            const res = dsf.dataview.utils.matchNumberAndSuffix(data[0][key]);
            if (res && isFinite(res.number)) {
              this.addItem(dimension.title, dimension.field, key);
              data.forEach((it) => {
                const val = dsf.dataview.utils.matchNumberAndSuffix(it[key]);
                it[key] = val ? val.number : 0;
              });
              break;
            }
          }
          this.$emit("changeTitle", dimension.title);
        }
      } catch (error) {
        console.warn(`error${error}`);
      }

      dsf.mix(true, chartOptions, options);

      // 处理成Excel
      const excelData = dsf.dataview.utils.transformToExcelData(data, dictionary);

      this.excelData.length = 0;
      dsf.mix(true, this.excelData, excelData);
      this.$emit("update:excelData", excelData);
    },
    // 接口映射解析
    dynamicMapAnalysis(data, chart = this.chart) {
      let series = chart.series[0];

      const item = data[0];
      const hasNameRelation = series.hasNameRelation;
      const seriesRelation = series.seriesRelation;
      if (hasNameRelation && item[seriesRelation]) {
        series.name = item[seriesRelation];
      }

      let nameRelation = series.nameRelation || "name";
      let valueRelation = series.valueRelation || "value";
      let depth = chart.series[0] ? chart.series[0].depth : 100;

      let quantity = 0;
      let total = 0;
      data.forEach((item) => {
        const value = item[valueRelation] ? item[valueRelation] : 0;
        total += value;
        quantity = Math.max(quantity, value);
      });

      const singleData = chart.series[0].singleData || [];
      chart.series[0].data = data.map((item, index) => {
        const colors = singleData.length ? singleData.map((it) => it.color) : chart.colors;
        const color = colors[index % colors.length];
        const value = item[valueRelation] ? item[valueRelation] : 0;
        return {
          name: item[nameRelation] ? item[nameRelation] : "undefined",
          color,
          y: Number(value),
          h: this.isOpenHeight ? parseInt((value / quantity) * depth) : depth,
          b: ((value / total) * 100).toFixed(1),
        };
      });
    },
    // 解析数据
    dataAnalysis(data) {
      if (!data) {
        if (this.$listeners["interceptOptions"]) {
          this.$dispatch("interceptOptions", { chart: this.chart, vm: this });
        } else {
          this.reset();
        }
        return false;
      }
      this.dynamicMapAnalysis(data);

      if (this.$listeners["interceptOptions"]) {
        this.$dispatch("interceptOptions", { chart: this.chart, vm: this });
      } else {
        this.reset();
      }
    },
    handleCycle() {
      this.currentIndex = 0;
      clearInterval(this.cycle3DTimer);
      if (this.is3DCycle) {
        let series = this.chartObj.series[0];
        let list = series.data;
        let points = series.points;
        this.cycle3DTimer = setInterval(() => {
          if (this.currentIndex === list.length) {
            this.currentIndex = 0;
          }
          series.data.forEach((ele, index) => {
            if (index === this.currentIndex) {
              ele.sliced = true;
              ele.selected = false;
              this.chartObj.tooltip.refresh(points[index]);
            } else {
              ele.sliced = false;
              ele.selected = false;
            }
          });
          this.currentIndex++;
          series.setData(list);
        }, this.cycle3DTime);
      }
    },
    wrap() {
      var each = Highcharts.each,
        round = Math.round,
        cos = Math.cos,
        sin = Math.sin,
        deg2rad = Math.deg2rad;
      Highcharts.wrap(Highcharts.seriesTypes.pie.prototype, "translate", function (proceed) {
        proceed.apply(this, [].slice.call(arguments, 1));
        // Do not do this if the chart is not 3D
        if (!this.chart.is3d()) {
          return;
        }
        var series = this,
          chart = series.chart,
          options = chart.options,
          seriesOptions = series.options,
          depth = seriesOptions.depth || 0,
          options3d = options.chart.options3d,
          alpha = options3d.alpha,
          beta = options3d.beta,
          z = seriesOptions.stacking ? (seriesOptions.stack || 0) * depth : series._i * depth;
        z += depth / 2;
        if (seriesOptions.grouping !== false) {
          z = 0;
        }

        each(series.data, function (point) {
          var shapeArgs = point.shapeArgs,
            angle;
          point.shapeType = "arc3d";
          var ran = point.options.h;
          shapeArgs.z = z;
          shapeArgs.depth = depth * 0.65 + ran;
          shapeArgs.alpha = alpha;
          shapeArgs.beta = beta;
          shapeArgs.center = series.center;
          shapeArgs.ran = ran;
          angle = (shapeArgs.end + shapeArgs.start) / 2;
          point.slicedTranslation = {
            translateX: round(cos(angle) * seriesOptions.slicedOffset * cos(alpha * deg2rad)),
            translateY: round(sin(angle) * seriesOptions.slicedOffset * cos(alpha * deg2rad)),
          };
        });
      });
      (function (H) {
        H.wrap(Highcharts.SVGRenderer.prototype, "arc3dPath", function (proceed) {
          // Run original proceed method
          var ret = proceed.apply(this, [].slice.call(arguments, 1));
          ret.zTop = (ret.zOut + 0.5) / 100;
          return ret;
        });
      })(Highcharts);
    },
    loadScript(callback) {
      if (window.Highcharts) {
        callback?.();
      } else {
        let loadFileHttp = dsf.dataview.utils.importFiles(
          [this.$getWebPath("static/js/libs/highcharts/highcharts.js", __DSF_DATAVIEW_PATH__), this.$getWebPath("static/js/libs/highcharts/highcharts-3d.js", __DSF_DATAVIEW_PATH__)],
          () => {
            callback?.();
          },
          (err) => {
            console.error(err);
            dsf.layer.message("加载highcharts文件报错", false);
          },
          () => {
            this.addNowRequestFileList(loadFileHttp, true);
          }
        );
        this.addNowRequestFileList(loadFileHttp);
      }
    },
    reset() {
      if (window.Highcharts) {
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

        let chart = this.$refs.chart;
        let chartOptions = _.cloneDeep(this.chart);
        let self = this;
        chartOptions.plotOptions.pie.events = {
          click(params) {
            self.loadClickEvents(params);
          },
        };
        // 特殊额外的钩子
        this.beforeSpecialSetOption(chartOptions, this);
        let chartObj = Highcharts.chart(chart, chartOptions);
        // 特殊额外的钩子
        this.afterSpecialSetOption(chart);
        this.chartObj = chartObj;
        this.chartString = dsf.dataview.utils.objectToString(this.chart, true);
        this.handleCycle();
        if (this.isOpenHeight) {
          this.initChartH();
        }
      }
    },
    beforeSpecialSetOption(chartOptions) {
      // 处理过滤条件保留0
      this.handleKeepZeroLabel(chartOptions);
    },
    handleKeepZeroLabel(chartOptions) {
      // 这里的options是克隆的所以不会改变原来的
      let series = chartOptions.series;
      series.forEach((item) => {
        let label = item.dataLabels;
        let labelFlag = false;
        let formatterType = typeof label?.format;
        if (label) {
          labelFlag = !label.format || typeof formatterType === "string";
        }
        let valueField = item.valueRelation;
        let filterOne = this.findFilterDecimalData(valueField);
        let filterFlag = !!filterOne;
        if (labelFlag && filterFlag) {
          label.temporaryCache = label.format;
          if (label.format) {
            let formatter = label.format;
            label.format = formatter.replace(/{point.y}/g, `{point.y:.${filterOne.threshold}f}`);
          }
        }
      });
    },
    resize() {
      if (window.Highcharts && this.chartObj) {
        this.chartObj.reflow();
        this.$nextTick(() => {
          if (this.isOpenHeight) {
            this.initChartH();
          }
        });
      }
    },
    initChartH() {
      let each = Highcharts.each,
        points = this.chartObj.series[0].points;
      each(points, function (p, i) {
        p.graphic.attr({
          translateY: -p.shapeArgs.ran,
        });
        p.graphic.side1.attr({
          translateY: -p.shapeArgs.ran,
        });
        p.graphic.side2.attr({
          translateY: -p.shapeArgs.ran,
        });
      });
    },
    styleConfigCallback(styleObj) {
      let itemColors = styleObj.commonStyle.colors;
      this.chart.colors = itemColors.map((it) => it[2]);
      if (styleObj.commonStyle?.pieColors) {
        itemColors = styleObj.commonStyle.pieColors;
      }
      const labelColor = styleObj.commonStyle.labelColor;
      // legend和title颜色值更改
      this.handleStyleChangeObjValue(
        [
          ["title.style.color", styleObj.title.labelColor],
          ["legend.itemStyle.color", styleObj.legend.labelColor],
        ],
        this.chart
      );
      let series = this.chart.series;
      const maxColorLength = itemColors.length;
      series.forEach((it) => {
        it.data.forEach((item, idx) => {
          let color = this.handleStyleArrGetColor(itemColors, idx);
          if (idx > maxColorLength - 1) {
            return;
          }
          item.color = color[2];
        });
        if (it.dataLabels && it.dataLabels.style) {
          it.dataLabels.style.color = labelColor;
        }
        it.singleData = this.chart.colors.map((newColor) => ({
          itemStyle: {
            color: newColor,
          },
        }));
      });
      this.chartString = dsf.dataview.utils.objectToString(this.chart, true);
      this.reset();
      dsf.emit.$emit("updateStyleChange", {}, [this]);
    },
  },
  beforeDestroy() {
    clearInterval(this.cycle3DTimer);
  },
});
</script>
