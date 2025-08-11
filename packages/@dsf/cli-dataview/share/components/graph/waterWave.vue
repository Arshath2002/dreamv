<template>
  <div
    class="data-view-item-wrap ds-control dsf-dv-graph data-view-water-wave data-view-no-padding ds-chart"
    :style="controlOuterStyle"
    v-loading="dataLoad"
    :element-loading-text="loadingText"
    :element-loading-spinner="loadingSpinner"
    :element-loading-background="loadingBackground"
  >
    <div
      class="chart data-view-common-bg-effect"
      ref="chart"
      v-chart-nodata="!hasData"
    ></div>
  </div>
</template>
<script>
import defaultOptions from "_dataview/output/chartDefault/waterWave.js";
import graph from "_dataview/mixins/graph.js";

const staticDataKeyDic = {
  name: "名称",
  value: "值",
};
const staticData = [
  {
    value: "55",
    name: "剩余水量",
  },
];
export default dsf.component({
  name: "DsfDataViewWaterWave",
  ctrlCaption: "水波图",
  mixins: [$mixins.dataView, graph],
  props: {
    //自定义配置总览
    chart: {
      type: Object,
      default() {
        return defaultOptions;
      },
    },
    excelData: {
      type: Array,
      default: () => {
        return dsf.dataview.utils.transformToExcelData(
          staticData,
          staticDataKeyDic
        );
      },
    },
    staticData: {
      type: Array,
      default: () => staticData,
    },
    mapRelations: {
      type: Array,
      default() {
        return [
          {
            text: "名称",
            value: "name",
            map: "name",
            hideDigit: true,
          },
          {
            text: "值",
            value: "value",
            map: "value",
            hideDigit: true,
          },
        ];
      },
    },
  },
  watch: {},
  data() {
    return {
      cacheDataStyle: {},
      data: [],
    };
  },
  methods: {
    beforeInit() {
      this.loadEcharts(this)
        .then(() => {
          this.loadEChartsLiquidfill(() => {
            this.initEcharts();
            this.init();
          });
        })
        .catch((ex) => {
          dsf.error(ex);
        });
    },
    loadEChartsLiquidfill(callback) {
      if (window.echartsWordcloudFlag) {
        callback?.();
      } else {
        let loadFileHttp = dsf.dataview.utils.importFiles(
          [
            this.$getWebPath(
              "static/js/libs/echarts/echarts-liquidfill.min.js",
              __DSF_DATAVIEW_PATH__
            ),
          ],
          () => {
            window.echartsWordcloudFlag = true;
            callback?.();
          },
          (err) => {
            console.error(err);
            dsf.layer.message("加载echarts-liquidfill文件报错", false);
          },
          () => {
            this.addNowRequestFileList(loadFileHttp, true);
          }
        );
        this.addNowRequestFileList(loadFileHttp);
      }
    },
    // 接口映射解析
    dynamicMapAnalysis(data, chart = this.chart) {
      let allSeries = _.cloneDeep(chart.series)
      _.each(allSeries, (it) => {
        let nameRelation = it.nameRelation || "name";
        let valueRelation = it.valueRelation || "value";
        let seriesRelation = it.seriesRelation || "示例"
        it.nameRelation = nameRelation;
        it.valueRelation = valueRelation;
        it.seriesRelation = seriesRelation;
        let it_val = []
        data.forEach((item, index) => {
          if (index === 0) {
            it.name = item[seriesRelation] ? item[seriesRelation] : seriesRelation
          }
          if (item[nameRelation] != undefined) {
            let name = nameRelation ? item[nameRelation] : valueRelation;
            it_val.push({
              ...item,
              name: name,
              _value: item[valueRelation],
              value:
                Number(item[valueRelation] ? item[valueRelation] : 0) / 100,
            });
          }
        })
        it.data = it_val
      })
      this.$set(chart, 'series', allSeries)
      this.$set(chart.title, "text", allSeries?.[0]?.data?.[0]?.name || "");
      this.data = data;
    },
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

      if (this.$listeners['interceptOptions']) {
        this.$dispatch('interceptOptions', { chart: this.chart, vm: this })
      } else {
        this.reset();
      }
    },
    handleKeepZeroLabel() {
      this.chart.series.forEach((item) => {
        let valueField = item.valueRelation;
        let filterOne = this.findFilterDecimalData(valueField);
        let formatterHtml =
          item.label.formatterHtml || `@[dsf.math.mul(value,100).toNumber()]%`;
        if (formatterHtml) {
          let data = _.cloneDeep(item.data[0]);
          let val = data[valueField];
          if (filterOne) {
            data[valueField] = dsf.isNumber(val)
              ? (val * 100).toFixed(filterOne.threshold)
              : val;
          }
          item.label.formatter = this.$replace(formatterHtml, data);
        }
      });
    },
  },
});
</script>
