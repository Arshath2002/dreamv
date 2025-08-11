// 地图图形设置，以及工具函数定义
export default {
  methods: {
    /**
     * data{base:[]，scatter:[],effectScatter:[]}-分别代表基础地图数据，撒点数据，动效撒点数据 静态数据
     */
    // 接口映射解析
    dynamicMapAnalysis(data, chart = this.chart) {
      let series = chart.series;
      series.forEach((it) => {
        const hasNameRelation = it.hasNameRelation;
        const nameRelation = it.type == "lines" ? it.startRelation || "start" : it.nameRelation || "name";
        const valueRelation = it.type == "lines" ? it.endRelation || "end" : it.valueRelation || "value";
        const seriesNameRelation = it.seriesNameRelation;

        let valData = [];
        data.forEach((item, index) => {
          if (index == 0 && hasNameRelation && item[seriesNameRelation]) {
            it.name = item[seriesNameRelation];
          }

          if (it.type == "lines") {
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
          case "map":
            it.data = valData;
            break;
          // 矩形、圆柱、立方体走的也是这个数据增加逻辑
          case "scatter":
            this.addScatter(valData, it.name, chart);
            break;
          case "effectScatter":
            this.addScatter(valData, it.name, chart);
            break;
          case "lines":
            this.addFlyLine(valData, it.name, chart);
            break;
        }
      });
    },
    /**
     * 分别代表基础地图数据，撒点数据，动效撒点数据,飞行线
     */
    dataAnalysis(data = []) {
      this.data = data;
      this.dynamicMapAnalysis(data);

      if (this.$listeners["interceptOptions"]) {
        this.$dispatch("interceptOptions", { chart: this.chart, vm: this });
      } else {
        this.reset();
      }
    },
    // 图形处理函数
    getMapCustomSeries(options) {
      const map = [];
      // 清空掉拼接图形的series层, seriesLayer属性作为拼接图形标志
      // 清空除热力图之外的数据
      options.forEach((it) => {
        if (it.type === "map" || it.type === "lines") {
          map.push(it);
          return;
        }
        if (it.seriesLayer) {
          return;
        }
        map.push(it);
      });
      // options = options.filter(it => !it.seriesLayer);
      // options = options.filter(it => it.data.length);
      options = map;
      // 已经保存的模板中，增加默认配置;
      options.forEach((it) => {
        if (dsf.isUnDef(it.barGap) && !!it.shape) {
          it.barGap = 0;
        }
      });
      // total，需要被纳入中心点计算的图形
      const [total, barGap, widths] = options.reduce(
        (before, item) => {
          let [count, distance, widths] = before;
          if (item.shape && this.isMapSpecialShape(item.shape)) {
            return [count + 1, item.barGap, [...widths, +("" + item.barWidth).replace(/[^0-9]/g, "")]];
          }
          return [count, distance, widths];
        },
        [0, 0, []]
      );
      let count = 0;
      return options.reduce((arr, item, idx) => {
        item.total = total;
        item.curIdx = idx - count;
        item.widths = widths;
        item.shapeWidth = +("" + item.barWidth).replace(/[^0-9]/g, "");
        item.shapeDistance = +("" + barGap).replace(/[^0-9]/g, "");
        const type = item.shape || item.type;
        // 目标数据源处理
        let series = null;
        switch (type) {
          case "rect":
            series = this.getMapShapeRect(item);
            break;
          case "cube":
            series = this.getMapShapeCube(item);
            break;
          case "clinder":
            series = this.getMapShapeClinder(item);
            break;
          case "scatter":
            series = this.getMapShapeScatter(item);
            count++;
            break;
          case "effectScatter":
            series = this.getMapShapeEffectScatter(item);
            count++;
            break;
          default:
            count++;
            series = item;
        }
        const tempArr = Array.isArray(series) ? series : [series];
        return arr.concat(tempArr);
      }, []);
    },
    isMapSpecialShape(shape) {
      //shape： map: 地图， scatter: 撒点，effectScatter: 动效撒点； rect：长方形；cube: 立方体；clinder: 圆柱；pie: 圆环；
      return ["rect", "cube", "clinder"].includes(shape);
    },
    // 立方体
    getMapShapeCube(item) {
      // 构造正面
      const { data, baseValue, total, curIdx, shapeWidth, shapeDistance, widths, itemStyle } = item;
      const offsetMap = this.dealMapShapeDataOffset(widths, 0, shapeDistance, total);
      // 地图数据需要按照scatter结构数据解析
      const caculateData = data.map((item) => item.value[2]);
      const shapeData = this.dealMapShapeDataHeight(caculateData, baseValue);
      item.symbol = "rect";
      item.data = data.map((item, idx) => ({
        ...item,
        symbolSize: [shapeWidth, shapeData[idx]],
        symbolOffset: [offsetMap[curIdx], -0.5 * shapeData[idx]],
      }));
      item.emphasis = {
        disabled: true,
      };
      const shapeSereis = [item];
      for (let i = 0; i < 2; i++) {
        const layerItem = _.clone(item);
        // 使用菱形拼接顶部
        layerItem.symbol = i === 0 ? "rect" : "diamond";
        layerItem.itemStyle = {
          color: itemStyle.color,
        };
        // layerItem.z = item.z + curIdx*2 + 1;
        layerItem.seriesLayer = true;
        layerItem.tooltip = {
          show: false,
        };
        layerItem.label = {
          show: false,
        };
        layerItem.data = data.map((item, idx) => {
          return {
            ...item,
            symbolOffset: [offsetMap[curIdx], i == 0 ? -0.5 * shapeData[idx] : -shapeData[idx]],
            symbolSize: shapeData[idx] === 0 ? 0 : i === 0 ? [0.5, shapeData[idx]] : [shapeWidth, shapeWidth * 0.4],
          };
        });
        shapeSereis.push(layerItem);
      }
      return shapeSereis;
    },
    // 圆柱
    getMapShapeClinder(item) {
      // 构造正面
      const { data, baseValue, total, curIdx, shapeWidth, shapeDistance, widths, itemStyle } = item;
      const offsetMap = this.dealMapShapeDataOffset(widths, 0, shapeDistance, total);
      // 地图数据需要按照scatter结构数据解析
      const caculateData = data.map((item) => item.value[2]);
      const shapeData = this.dealMapShapeDataHeight(caculateData, baseValue);
      item.symbol = "rect";
      item.data = data.map((item, idx) => ({
        ...item,
        symbolSize: [shapeWidth, shapeData[idx]],
        symbolOffset: [offsetMap[curIdx], -0.5 * shapeData[idx]],
      }));
      item.emphasis = {
        disabled: true,
      };
      const shapeSereis = [item];
      for (let i = 0; i < 2; i++) {
        const layerItem = _.clone(item);
        // 需要将立体圆面设置为
        layerItem.symbol = "circle";
        layerItem.seriesLayer = true;
        layerItem.itemStyle = {
          color: itemStyle.color,
        };
        // layerItem.z = item.z + curIdx*2 + 1;
        // 是否设置颗粒感动效
        if (layerItem.particles && i === 0) {
          layerItem.type = "effectScatter";
          layerItem.effectType = "ripple";
          layerItem.showEffectOn = "render";
          layerItem.rippleEffect = {
            color: itemStyle.color,
            period: 4,
            scale: 5,
            brushType: "stroke",
          };
        }
        layerItem.tooltip = {
          show: false,
        };
        layerItem.label = {
          show: false,
        };
        layerItem.data = data.map((item, idx) => {
          return {
            ...item,
            symbolSize: shapeData[idx] === 0 ? 0 : [shapeWidth, shapeWidth * 0.4], // 宽高比：1：0.4
            symbolOffset: [offsetMap[curIdx], i == 0 ? 0 : -shapeData[idx]],
          };
        });
        shapeSereis.push(layerItem);
      }
      return shapeSereis;
    },
    // 正方形
    getMapShapeRect(item) {
      const { data, baseValue, total, curIdx, shapeWidth, shapeDistance, widths } = item;
      const offsetMap = this.dealMapShapeDataOffset(widths, 0, shapeDistance, total);
      // 地图数据需要按照scatter结构数据解析
      const caculateData = data.map((item) => item.value[2]);
      const shapeData = this.dealMapShapeDataHeight(caculateData, baseValue);
      item.data = data.map((item, idx) => ({
        ...item,
        symbolSize: [shapeWidth, shapeData[idx]],
        symbolOffset: [offsetMap[curIdx], -0.5 * shapeData[idx]],
      }));
      return item;
    },
    // 散点图
    getMapShapeScatter(item) {
      // 是否存在基准值
      if (!item.baseValue) {
        item.baseValue = 12;
      }
      item.isBaseValue = !!item.isBaseValue;
      item.data = this.dealScatterDataSymbolSize(item);
      return item;
    },
    getMapShapeEffectScatter(item) {
      // 是否存在基准值
      if (!item.baseValue) {
        item.baseValue = 12;
      }
      item.isBaseValue = !!item.isBaseValue;
      item.data = this.dealScatterDataSymbolSize(item);
      return item;
    },
    // 工具函数
    // 得到数据高度，选择最高值作为基准值，data层面
    dealMapShapeDataHeight(data = [], baseValue) {
      if (!data || !data.length) {
        // 当前数据传入不正确
        return;
      }
      // 最大值基准值
      const count =
        data.reduce((count, item) => {
          let value = item === undefined ? 0 : item.value || item;
          value = parseFloat(value);
          if (isNaN(value)) {
            return count;
          }
          return Math.max(count, value);
        }, 0) || 1;

      return data.map((item) => {
        let value = item === undefined ? 0 : item.value || item;
        value = parseFloat(value);
        return Math.round((value / count) * baseValue);
      });
    },
    // 得到数据偏移，series层面
    dealMapShapeDataOffset(widths, point, distance, total) {
      // 中心点像素点： point
      // 柱子之间的距离: distance
      // 柱子的宽度：widths
      // 总数： total
      const isOdd = total % 2 === 0,
        mid = Math.floor(total / 2);
      const offsetMap = [];
      // 加上间距
      widths = widths.map((item) => item + 0.5 * distance);

      function distanceNotOdd(idx, mid, widths, point) {
        // 当前柱子是中心点
        if (idx === mid) {
          return 0;
        }
        const map = idx < mid ? widths.slice(idx, mid + 1) : widths.slice(mid);
        const count = map.reduce((count, item, index) => {
          if (index === 0 || index === map.length - 1) {
            return count + 0.5 * item;
          }
          return count + item;
        }, 0);
        return idx < mid ? point - count : point + count;
      }
      function distanceIsOdd(idx, mid, widths, point) {
        // 当前柱子是中心点
        if (idx === mid || idx === mid - 1) {
          return idx - mid < 0 ? point - 0.5 * widths[idx] : point + 0.5 * widths[idx];
        }
        const map = idx < mid ? widths.slice(idx, mid) : widths.slice(mid);
        const count = map.reduce((count, item, index) => {
          if (idx < mid && index === 0) {
            return count + 0.5 * item;
          }
          if (idx > mid && index === map.length - 1) {
            return count + 0.5 * item;
          }
          return count + item;
        }, 0);
        return idx < mid ? point - count : point + count;
      }

      for (let i = 0; i < total; i++) {
        if (isOdd) {
          // 偶数情况下计算方式
          offsetMap.push(distanceIsOdd(i, mid, widths, point));
        } else {
          // 奇数情况下计算方式
          offsetMap.push(distanceNotOdd(i, mid, widths, point));
        }
      }
      return offsetMap;
    },
    // 获取默认默认值函数
    getMapShapeDefault(type) {
      let defaultData = {
        name: "正方形撒点2",
        type: "scatter",
        coordinateSystem: "geo",
        barGap: 0,
        barWidth: 19,
        baseValue: 50,
        symbol: "circle",
        //数据名称映射
        nameRelation: "",
        //数据值映射
        valueRelation: "",
        symbolSize: 10,
        symbolOffset: [0, 0],
        large: true,
        tooltip: {
          formatter: function (params) {
            return params.data.name + "：" + params.data.value[2];
          },
        },
        label: {
          formatter: function (params) {
            return params.data.name + "：" + params.data.value[2];
          },
          show: false,
          position: "inside",
          distance: 5,
          color: "#fff",
          fontSize: 12,
          offset: [0, 0],
        },
        itemStyle: {
          color: "blue",
        },
        data: [],
        animationDurationUpdate: 0,
      };

      // 默认添加图形样式
      const specialShapeData = {
        barGap: 0,
        barWidth: 19,
        baseValue: 50,
      };

      // 动效点设置项
      const effectParams = {
        effectType: "ripple",
        showEffectOn: "render",
        rippleEffect: {
          color: "#ddb926",
          period: 4,
          scale: 2.5,
          brushType: "stroke",
        },
      };

      switch (type) {
        case "cube":
          defaultData = { ...defaultData, ...specialShapeData };
          defaultData.symbol = "rect";
          defaultData.shape = "cube";
          break;
        case "clinder":
          defaultData = { ...defaultData, ...specialShapeData };
          defaultData.symbol = "rect";
          defaultData.shape = "clinder";
          break;
        case "rect":
          defaultData = { ...defaultData, ...specialShapeData };
          defaultData.shape = "rect";
          defaultData.symbol = "rect";
          break;
        case "effectScatter":
          defaultData = { ...defaultData, ...effectParams };
          defaultData.type = "effectScatter";
          break;
        case "scatter":
          defaultData.isBaseValue = false;
          break;
        default:
          break;
      }
      return defaultData;
    },
    // 散点大小计算方式, base表示当前最大数据的size
    dealScatterDataSymbolSize(params) {
      const { data, baseValue = 12, isBaseValue = false, symbolSize = 12 } = params;
      // 散点取数据的方式
      const caculateData = data.map((item) => item.value[2]);
      const total = caculateData.reduce((max, item) => {
        let value = parseFloat(item);
        if (isNaN(value)) {
          value = 0;
        }
        return Math.max(max, value);
      }, 0);

      return data.map((item, idx) => {
        let value = parseFloat(caculateData[idx]);
        if (isNaN(value)) {
          value = 0;
        }
        return {
          ...item,
          symbolSize: isBaseValue ? Math.round((value / total) * baseValue) : symbolSize,
        };
      });
    },
  },
};
