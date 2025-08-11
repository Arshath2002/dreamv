/*
 * @Description: 风格改变后相应的方法
 * @Author: shenah
 * @Date: 2023-06-06 16:17:47
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-05-23 11:26:19
 */

export default {
  methods: {
    styleConfigCallback(styleObj) {
      // 改变series
      // this.handleStyleChangeSeries(styleObj)
      // 改变options最外层的属性(不是特殊一些属性)
      // this.handleStyleChangeOptionAttr(styleObj);
      Object.keys(this.chart).forEach((key) => {
        switch (key) {
          case "xAxis":
          case "yAxis":
          case "radiusAxis":
          case "angleAxis":
          case "parallelAxis":
            this.handleStyleChangeAxis(styleObj.axis, key);
            break;
          case "radar":
            this.handleStyleChangeRadar(styleObj.axis);
            break;
          case "legend":
            this.handleStyleChangeObjValue([["textStyle.color", styleObj.legend.labelColor]], this.chart[key]);
            break;
          case "title":
            this.handleStyleChangeObjValue([["textStyle.color", styleObj.title.labelColor]], this.chart[key]);
            break;
          case "series":
            this.handleStyleChangeSeries(styleObj);
            break;
          case "visualMap":
            this.handleStyleChangeVisualMap(styleObj.visualMap);
        }
      });
      this.reset();
      dsf.emit.$emit("updateStyleChange", {}, [this]);
    },
    /**
     * @name: 处理Series
     * @param {*} styleObj 风格对象
     * @return {*}
     */
    handleStyleChangeSeries(styleObj, chart = this.chart) {
      let itemColors = styleObj.commonStyle.colors;
      let series = chart.series;
      chart.color = itemColors.map((item) => item[2]);
      const labelColor = styleObj.commonStyle.labelColor;

      // 组件内部自定义颜色更改方式，剥离开取色逻辑
      if (this.handleStyleChangeComponentSeries && dsf.isFunction(this.handleStyleChangeComponentSeries)) {
        this.handleStyleChangeComponentSeries({
          colors: itemColors,
          labelColor,
        });
        return;
      }
      series.forEach((it, index) => {
        const color = this.handleStyleArrGetColor(itemColors, index);
        switch (it.type) {
          case "candlestick": // k线
            this.handleStyleChangeObjValue(
              [
                ["itemStyle.color", color[2]],
                ["itemStyle.borderColor", color[2]],
                ["itemStyle.color0", color[1]],
                ["itemStyle.borderColor0", color[1]],
                ["itemStyle.borderColorDoji", color[2]],
              ],
              it
            );
            break;
          case "map": // 地图
            const { colors, labelColor: textColor, borderColor } = styleObj.map;
            this.handleStyleChangeObjValue(
              [
                ["itemStyle.areaColor", colors[0]],
                ["itemStyle.borderColor", borderColor],
                ["label.color", textColor],
              ],
              it
            );
            break;
          case "graph": // 关系图谱
            this.handleStyleChangeObjValue(
              [
                ["itemStyle.color", color[2]],
                ["label.color", labelColor],
                ["edgeLabel.textStyle.color", labelColor],
              ],
              it
            );
            it.categories.forEach((item, idx) => {
              const colorItem = this.handleStyleArrGetColor(itemColors, idx);
              this.handleStyleChangeObjValue(
                [
                  ["itemStyle.color", colorItem[2]],
                  ["label.color", labelColor],
                ],
                item
              );
            });
            break;
          case "wordCloud": // 词云
            this.handleStyleChangeObjValue(
              [
                ["textStyle.color", color[2]],
                ["textStyle.oldColor", color[2]],
                ["textStyle.copyTextShadowColor", color[1]],
              ],
              it
            );
            it.singleData = itemColors.map((color) => {
              return {
                textStyle: {
                  color: color[2],
                },
              };
            });
            break;
          case "gauge": // 仪表盘
            const gaugeColor = [
              [0.2, color[0]],
              [0.8, color[1]],
              [1, color[2]],
            ];
            this.handleStyleChangeObjValue(
              [
                ["axisLine.lineStyle.color", gaugeColor],
                ["axisLabel.color", labelColor],
                ["title.color", labelColor],
                ["detail.color", labelColor],
                ["pointer.itemStyle.color", color[2]],
              ],
              it
            );
            break;
          case "sunburst": // 旭日图
            const levels = it.levels;
            itemColors.forEach((color, index) => {
              if (!levels[index]) {
                this.$set(levels, index, {
                  itemStyle: {
                    color: color[2],
                  },
                });
              } else {
                levels[index].itemStyle.color = color[2];
              }
            });
            break;
          case "parallel": // 平行坐标系
            const parallelAxis = chart.parallelAxis;
            chart.singleData = itemColors.map((color) => ({
              itemStyle: {
                color: color[2],
              },
            }));
            parallelAxis.forEach((axis) => {
              axis.axisLine.lineStyle.color = itemColors[0][2];
              this.handleStyleChangeObjValue(
                [
                  ["axisLine.lineStyle.color", itemColors[0][2]],
                  ["axisLabel.color", itemColors[1][2]],
                ],
                axis
              );
            });
            break;

          case "radar": // 雷达图
            this.handleStyleChangeObjValue([["label.color", labelColor]], it);
            it.data.forEach((item, idx) => {
              const color = this.handleStyleArrGetColor(itemColors, idx);
              const renderMap = [
                ["itemStyle", [color[2], color[2]], true],
                ["label.color", labelColor],
                ["lineStyle.color", color[2]],
              ];
              this.handleStyleChangeObjValue(renderMap, item);
            });
            break;
        }

        // 饼状图、矩形树图、漏斗图
        if (["pie", "treemap", "funnel"].includes(it.type)) {
          this.handleStyleChangeObjValue([["label.color", labelColor]], it);
          it.data.forEach((item, idx) => {
            const color = this.handleStyleArrGetColor(itemColors, idx);
            const renderMap = [
              ["itemStyle", [color[2], color[2]], true],
              ["label.color", labelColor],
              ["lineStyle.color", color[2]],
            ];
            this.handleStyleChangeObjValue(renderMap, item);
          });

          it.singleData = itemColors.map((color) => ({
            itemStyle: {
              color: color[2],
            },
          }));
        }
        // 柱状图、3D柱状图、象形图、折线图、散点图、折柱图、极坐标
        if (["bar", "line", "custom", "pictorialBar", "scatter", "effectScatter"].includes(it.type)) {
          const color = this.handleStyleArrGetColor(itemColors, index);

          const colors = [color[2], color[2]];
          switch (it.type) {
            case "custom":
              colors[1] = color[0];
              break;
            case "bar":
              it.itemStyle.barColor = color[2];
              break;
          }
          if (this.ctrlName === "DsfDataViewBar3d") {
            it.itemStyle.cubeColors = color.map((item) => [item, item]);
          }
          this.handleStyleChangeObjValue(
            [
              ["itemStyle", colors, true],
              ["label.color", labelColor],
            ],
            it
          );
        }
      });
    },

    /**
     * @name: 处理成echarts相应的配置颜色
     * @param {Array|String} color
     * @return {ColorObj} {
     *  color:Object | String,
     *  startColor:String,
     *  endColor:String,
     *  isshade:Boolean,
     * }
     */
    handleStyleChangeSingleEChartsColor(color) {
      const [startColor, endColor] = color;
      if (startColor && endColor && startColor != endColor) {
        return {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 1,
                color: startColor,
              },
              {
                offset: 0,
                color: endColor,
              },
            ],
            global: false,
          },
        };
      } else {
        return {
          color: startColor || "#FFF",
        };
      }
    },
    /**
     * @name: 根据所有color与index找到相应的color
     * @param {Array} colors
     * @param {Number} index
     * @return {String | Array} "#fff" | ["#fff","aaa"]
     */
    handleStyleArrGetColor(colors, index) {
      const maxColorLength = colors.length;
      const color = colors[index % maxColorLength];
      return color;
    },

    // 雷达图坐标系
    handleStyleChangeRadar(styleObj, chart = this.chart) {
      const radar = dsf.isArray(chart.radar) ? chart.radar : [chart.radar];
      radar.forEach((it) => {
        this.handleStyleChangeObjValue(
          [
            ["name.textStyle.color", styleObj.labelColor],
            ["axisLine.lineStyle.color", styleObj.lineColor],
          ],
          it
        );
      });
    },
    // 坐标系数据解析方式
    handleStyleChangeAxis(styleObj, axisType, chart = this.chart) {
      if (!styleObj) {
        return;
      }
      const map = [
        ["axisLabel.color", styleObj.labelColor],
        ["axisLine.lineStyle.color", styleObj.lineColor],
        ["nameTextStyle.color", styleObj.labelColor],
      ];
      if (dsf.isArray(chart[axisType])) {
        // 按照数组解析
        chart[axisType].forEach((it) => {
          it = this.handleStyleChangeObjValue(map, it);
        });
      } else if (dsf.isObject(chart[axisType])) {
        // 按照对象解析
        chart[axisType] = this.handleStyleChangeObjValue(map, chart[axisType]);
      }
    },
    // 改变对象对应的属性值
    handleStyleChangeObjValue(map, target) {
      if (!Array.isArray(map) || !map.length) return target;

      map.forEach((it) => {
        // 跳出当前循环
        if (!it || !it.length) return;

        // isCover 为 false，表示直接赋值；isCover 为 true，表示覆盖
        let [key, value, isCover = false] = it;
        if (!key) return;
        const keys = ("" + key).split(".");
        let opt = target;

        for (let i = 0; i < keys.length; i++) {
          const k = keys[i];
          if (!opt) return;
          // if (!opt[k]) continue;
          if (i + 1 == keys.length) {
            if (isCover) {
              value = dsf.isObject(opt[k])
                ? {
                    ...opt[k],
                    ...this.handleStyleChangeSingleEChartsColor(value),
                  }
                : { [k]: value };
            }
            opt[k] = value;
          }
          opt = opt[k];
        }
      });
      return target;
    },
    // 改变热力图颜色色值
    handleStyleChangeVisualMap(styleVisualMap, chart = this.chart) {
      if (styleVisualMap) {
        let { colors, ...properties } = styleVisualMap;
        // 颜色是有深到浅色
        colors = [...colors].reverse();

        let chartVisualMap = chart.visualMap;
        // 改变渐变
        if (chartVisualMap.inRange?.length) {
          chartVisualMap.inRange = chartVisualMap.inRange.map((item, index) => {
            let nowColor = colors[index];
            if (typeof item === "string") {
              return nowColor || item;
            } else if (item && typeof item === "object") {
              item.color = nowColor || item.color;
            }
            return item;
          });
        } else if (chartVisualMap.inRange) {
          chartVisualMap.inRange.color = chartVisualMap.inRange.color.map((item, index) => colors[index] || item);
        }
        // 改变间隔(pieces貌似是地图自定义的属性)
        if (chartVisualMap.pieces?.length) {
          chartVisualMap.pieces.forEach((item, index) => {
            let nowColor = colors[index];
            item.color = nowColor || item.color;
          });
        }

        dsf.mix(true, chartVisualMap, properties);
      }
    },
  },
};
