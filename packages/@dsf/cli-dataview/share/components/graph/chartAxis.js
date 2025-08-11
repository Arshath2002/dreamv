/*
 * @Description:
 * @Author: zhanghang
 * @Date: 2023-04-11 14:18:13
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-04-11 18:42:04
 */
import lineAddMarkLine from "_dataview/mixins/lineAddMarkLine.js";
import { createBarSeries } from "_dataview/output/chartDefault/createBar.js";
import { createLineSeries } from "_dataview/output/chartDefault/createLine.js";
import { createYAxis } from "_dataview/output/chartDefault/yaxis.js";

const seriesMap = {
  line: createLineSeries,
  bar: createBarSeries,
};
export default {
  mixins: [lineAddMarkLine],
  data() {
    return {
      otherEvents: ["设置目标线", "删除目标线", "设置动态图表"],
    };
  },
  methods: {
    /**
     * 合并折线柱状
     * @param {*} mergeArgs -ai大模型吐出数据
     */
    mergeSeries(mergeArgs) {
      const { data, describe } = mergeArgs;
      const { res, mapList } = dsf.dataview.utils.transformExcelDataToJSON(this.excelData);
      const dictionary = {};
      const extra = [];
      describe.slice(1).forEach(({ title, field }) => {
        let counter = 1;
        let key = field;
        while (mapList.find((it) => it.value === key)) {
          key = `${key}${counter}`;
          counter++;
        }
        if (key != field || !mapList.find((it) => it.value === key)) {
          data.forEach((it) => {
            const value = it[field];
            Reflect.deleteProperty(it, field);
            const res = dsf.dataview.utils.matchNumberAndSuffix(value);

            if (res && isFinite(res.number)) {
              it[key] = res.number;
              // 新增列
              if (!res.unit) return;
              const uKey = key + "_unit";
              it[uKey] = res.unit;
              dictionary[uKey] = dictionary[key] + "_单位";
            }
          });
        }
        extra.push({ name: title, value: key });
        mapList.push({ name: title, value: key });
      });
      mapList.forEach(({ name, value }) => {
        dictionary[value] = name;
      });

      const chartOptions = this.chart;
      const isYValue = chartOptions.yAxis[0].type === "value" ? true : false;
      const values = isYValue ? chartOptions.yAxis : chartOptions.xAxis;
      const series = chartOptions.series;
      const typeIndex = {};

      series.forEach((it) => {
        typeIndex[it.type] = isYValue ? it.yAxisIndex : it.xAxisIndex;
      });

      // 单条轴
      if (values.length === 1) {
        const position = values[0].position;
        const pos = { top: "bottom", right: "left", bottom: "top", left: "right" };
        const p = pos[position] || "right";
        const axis = createYAxis();
        axis.position = p;
        values.push(axis);
      }
      extra.forEach(({ name, value }) => {
        const type = mergeArgs.type;
        const createSeries = seriesMap[type];
        if (!createSeries) return;
        const series = createSeries(name, this.getNextColor());
        series.valueRelation = value;
        if (isYValue) {
          series.yAxisIndex = typeIndex[type] === undefined ? 1 : typeIndex[type];
        } else {
          series.xAxisIndex = typeIndex[type] === undefined ? 1 : typeIndex[type];
        }
        chartOptions.series.push(series);
      });

      // 处理成Excel
      this.excelData = dsf.dataview.utils.transformToExcelData(dsf.mix(true, [], res, data), dictionary);
    },

    /**
     *  设置 坐标轴名称
     * @param {*} chart
     * @param {*} data
     */
    setAxisName(chart = this.chart, data) {
      //Y轴名称映射
      chart.yAxis.forEach((it) => {
        if (it.nameRelation && it.nameShow) {
          const relation = data[0]?.[it.nameRelation];
          it.name = relation ? relation : it.nameRelation;
        } else {
          it.name = it.name || "";
        }
      });
      //X轴名称映射
      chart.xAxis.forEach((it) => {
        if (it.nameRelation && it.nameShow) {
          const relation = data[0]?.[it.nameRelation];
          it.name = relation ? relation : it.nameRelation;
        } else {
          it.name = it.name || "";
        }
      });
    },

    //类目轴名称分割
    splitCategory() {
      if (!this.chart) return false;
      if (this.splitName) {
        let category = this.chart.xAxis[0];
        if (category.type != "category") {
          category = this.chart.yAxis[0];
        }
        let data = category.data;
        data.forEach((it, index) => {
          if (typeof it === "string") {
            it = it.replace(/\n/g, "");
            let $it = "";
            while (it.length) {
              $it += it.substr(0, this.splitName) + "\n";
              it = it.substring(this.splitName);
            }
            category.data[index] = $it;
          }
        });
      } else {
        let category = this.chart.xAxis[0];
        if (category.type != "category") {
          category = this.chart.yAxis[0];
        }
        let data = category.data;
        if (data && dsf.isArray(data)) {
          data.forEach((it, index) => {
            if (typeof it === "string") {
              it = it.replace(/\n/g, "");
              category.data[index] = it;
            }
          });
        }
      }
    },
    // 增加目标线
    handleSetTargetLine(name, type, label, color = "#F7B500") {
      if (this.chartObj) {
        let series = this.chart.series;
        let self = this;
        series.forEach((it) => {
          if (!it.markLine) {
            it.markLine = {
              symbol: "none",
              data: [],
            };
          }

          if (it.name === name) {
            let markLineItem = {
              //目标线标识
              targetLine: true,
              name: label,
              label: {
                show: true,
                position: "insideEndTop",
                formatter(params) {
                  return label ? self.$replace(label, params) : params.value;
                },
              },
              lineStyle: {
                color: color,
              },
            };

            if (/\d+/g.test(String(type))) {
              markLineItem.yAxis = type;
            } else {
              markLineItem.type = type;
            }
            it.markLine.data.push(markLineItem);
          }
        });
        this.reset();
      }
    },
    //删除目标线
    handleDeletTargetLine(name) {
      if (this.chartObj) {
        let series = this.chart.series;
        series.forEach((it) => {
          let markLine = it.markLine;
          if (it.name === name && markLine) {
            markLine.data = markLine.data.filter((item) => !item.targetLine);
          }
        });
        this.reset();
      }
    },
  },
};
