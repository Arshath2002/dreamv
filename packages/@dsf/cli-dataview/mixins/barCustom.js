import { handleUniversalRule } from "_dataview/mixins/universalRuleMixin";
/**
 *@Description 注册立方体shape函数
 * @param {*} options
 */
const registerCube = (options) => {
  // 侧面宽度
  const WIDTH = +(options.width / 2).toFixed(1);
  // 斜角高度
  const OBLIQUE_ANGLE_HEIGHT = options.angle || 4;
  // 左侧面
  const leftShape = echarts.graphic.extendShape({
    shape: {
      x: 0,
      y: 0,
    },
    buildPath: function (ctx, shape) {
      // 当前柱子x,y 数据顶点。xAxisPoint当前柱子数据底部点
      const { by, x, y } = shape;
      const p1 = [x - WIDTH, y - OBLIQUE_ANGLE_HEIGHT];
      const p2 = [x - WIDTH, by - OBLIQUE_ANGLE_HEIGHT];
      const p3 = [x, by];
      const p4 = [x, y];

      ctx.moveTo(p1[0], p1[1]);
      ctx.lineTo(p2[0], p2[1]);
      ctx.lineTo(p3[0], p3[1]);
      ctx.lineTo(p4[0], p4[1]);
    },
  });
  // 右侧面
  const rightShape = echarts.graphic.extendShape({
    shape: {
      x: 0,
      y: 0,
    },
    buildPath: function (ctx, shape) {
      const { by, x, y } = shape;
      const p1 = [x, y];
      const p2 = [x, by];
      const p3 = [x + WIDTH, by - OBLIQUE_ANGLE_HEIGHT];
      const p4 = [x + WIDTH, y - OBLIQUE_ANGLE_HEIGHT];

      ctx.moveTo(p1[0], p1[1]);
      ctx.lineTo(p2[0], p2[1]);
      ctx.lineTo(p3[0], p3[1]);
      ctx.lineTo(p4[0], p4[1]);
    },
  });
  // 顶面
  const topShape = echarts.graphic.extendShape({
    shape: {
      x: 0,
      y: 0,
    },
    buildPath: function (ctx, shape) {
      // 当前柱子x,y 数据顶点
      const { x, y } = shape;

      const p1 = [x, y];
      const p2 = [x + WIDTH, y - OBLIQUE_ANGLE_HEIGHT];
      const p3 = [x, y - 2 * OBLIQUE_ANGLE_HEIGHT];
      const p4 = [x - WIDTH, y - OBLIQUE_ANGLE_HEIGHT];

      ctx.moveTo(p1[0], p1[1]);
      ctx.lineTo(p2[0], p2[1]);
      ctx.lineTo(p3[0], p3[1]);
      ctx.lineTo(p4[0], p4[1]);
    },
  });
  echarts.graphic.registerShape("CubeLeft", leftShape);
  echarts.graphic.registerShape("CubeRight", rightShape);
  echarts.graphic.registerShape("CubeTop", topShape);
};
export default {
  methods: {
    // 引入自定义图形处理方式
    getCustomSeries(options, context) {
      // 增加扩展参数的方法
      const commonExtension = [["singleData", []]];
      const barbubbleExtension = [
        ["isBottomCircle", false],
        ["isBaseValue", false],
        ["baseValue", 20],
        ["symbolSize", 20],
      ];
      // custom堆叠类型数据
      const stackType = {};

      options.forEach((it) => {
        let extensionMap = commonExtension.concat([]);
        switch (it.shape) {
          case "barbubble":
            extensionMap = extensionMap.concat(barbubbleExtension);
            break;
          default:
            break;
        }
        extensionMap.forEach((item) => {
          const [key, value] = item;
          if (it[key] === undefined) {
            it[key] = value;
          }
        });

        if (it.shape) {
          it.type = "custom";
          // 堆叠属性收集---start
          it.cacheId = dsf.uuid();
          if (it.stack) {
            if (stackType[it.shape]) {
              stackType[it.shape].push({
                data: it.data.map((_) => +_.value),
                cacheId: it.cacheId,
                seriesName: it.name,
              });
            } else {
              stackType[it.shape] = [
                {
                  data: it.data.map((_) => +_.value),
                  cacheId: it.cacheId,
                  seriesName: it.name,
                },
              ];
            }
          }
          // 堆叠属性收集---end
        }
      });
      // total，需要被纳入中心点计算的图形
      const [total, barGap, widths] = options.reduce(
        (before, item) => {
          let [count, distance, widths] = before;
          if (item.type === "custom") {
            return [count + 1, item.barGap, [...widths]];
          }
          return [count, distance, widths];
        },
        [0, 0, []]
      );
      let count = 0;
      return options.reduce((arr, item, idx) => {
        // 总数
        item.total = total;
        item.curIdx = idx - count;
        if (/\d+%$/.test(item.barWidth)) {
          const percent = parseFloat(item.barWidth) / 100;
          const percent2 = parseFloat(barGap) / 100;
          const boxWidth = context.chartObj.getDom().clientWidth - 20;
          item.seriesWidth = boxWidth / (item.data.length || 1) * percent;
          item.distance = boxWidth / (item.data.length || 1) * percent2;
        } else {
          item.seriesWidth = this.getStringToNumber(item.barWidth);
          item.distance = this.getStringToNumber(barGap);
        }
        widths.push(item.seriesWidth);
        item.widths = widths;

        let new_series = item;
        switch (item.shape) {
          case "clinder":
            new_series = this.getCylinder(item, stackType[item.shape]);
            break;
          case "cube":
            new_series = this.getCube(item, stackType[item.shape]);
            break;
          case "rect":
            new_series = this.getBarRect(item, stackType[item.shape]);
            break;
          case "barbubble":
            new_series = this.getBarBubble(item);
            break;
          case "cone":
            new_series = this.getCone(item);
            break;
          default:
            break;
        }
        if (!item.shape) {
          count++;
        }
        arr.push(new_series);
        return arr;
      }, []);
    },

    /**
     * @Description 圆柱参数处理
     * @param {*} item 配置项
     * @param {*} stackArray 堆叠数组
     */
    getCylinder(item, stackArray) {
      // 切换为圆柱需要改成的属性
      item.shape = "clinder";
      // 清除原有的绘制函数
      item.renderItem = null;
      return this.dimensionalSeries(item, stackArray);
    },

    /**
     * @Description 正方体参数处理
     * @param {*} item 配置项
     * @param {*} stackArray 堆叠数组
     */
    getCube(item, stackArray) {
      // 切换为正方体属性
      item.shape = "cube";
      // 清除原有的绘制函数
      item.renderItem = null;
      // 构造colors, seriesLabel, seriesName, seriesWidth
      const cubeColor = item.itemStyle.cubeColors;
      item.colors = cubeColor;
      item.itemStyle.color = {
        type: "linear",
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [
          {
            offset: 1,
            color: cubeColor[0][0], // 0% 处的颜色
          },
          {
            offset: 0,
            color: cubeColor[0][1], // 100% 处的颜色
          },
        ],
        global: false, // 缺省为 false
      };
      // echarts因为在此时已经注册在全局，因此可以使用
      return this.cubeSeries(item, stackArray);
    },
    /**
     * @Description 圆锥
     * @param {*} item 配置项
     * @returns
     */
    getCone(item) {
      // 切换为圆柱需要改成的属性
      item.shape = "cone";
      // 清除原有的绘制函数
      item.renderItem = null;
      return this.coneBarSeries(item);
    },
    // 柱泡图参数处理
    getBarBubble(item) {
      // 切换为柱泡图属性
      item.shape = "barbubble";
      // 清除原有的绘制函数
      item.renderItem = null;
      return this.barBubbleSeries(item, false);
    },
    // 正方形参数处理
    getBarRect(item, stackArray) {
      // 切换为正方形属性
      item.shape = "rect";

      // 清除原有的绘制函数
      item.renderItem = null;
      return this.rectSeries(item, stackArray);
    },
    // 获取中心点函数，长度， 相差的距离，实际的像素点, 宽度
    getOffsetDistance(widths, point, distance, total) {
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
    /**
     * @Description 自定义正方体
     * @param {*} item
     * @param {*} stacks 堆叠数组
     * @returns
     */
    cubeSeries(item, stacks) {
      let { data, yAxisIndex, seriesWidth, label, total, curIdx, distance, colors, widths, singleData = [] } = item;
      let ruleList = item.singleMoreDataRuleList || [];
      colors = colors.map((item) => ({
        type: "linear",
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [
          {
            offset: 1,
            color: item[0], // 0% 处的颜色
          },
          {
            offset: 0,
            color: item[1], // 100% 处的颜色
          },
        ],
        global: false, // 缺省为 false
      }));
      const width = +seriesWidth;
      let offsetY = Math.floor(width / 5) - 4 + 8; // 按照8作为基准值进行比例判断
      let offsetX = ((Math.floor(width / 5) - 4 + 8) * 3) / 4; // 按照3：4的比例模型

      //注册自定义形状
      registerCube({ width, angle: 4 });
      return {
        ...item,
        label: {
          ...label,
          offset: [offsetX, -(offsetY / 2)],
        },
        renderItem: (params, api) => {
          const index = params.dataIndex;
          let nowOneData = data[index] || {};
          let ruleObj = handleUniversalRule.call(this,nowOneData, ruleList);
          let ruleColor = null;
          if (ruleObj.moreColor) {
            let list = ruleObj.moreColor.colorList || [];
            if(list.length){
              ruleColor = list.map((color)=>{
                return dsf.dataview.utils.convertCSSToEChartsColor(color);
              });
            }
          }
          let singleColor = null;
          if (singleData[index]) {
            const singleItem = singleData[index].itemStyle.cubeColors;
            singleColor = singleItem.map((item) => ({
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 1,
                  color: item[0], // 0% 处的颜色
                },
                {
                  offset: 0,
                  color: item[1], // 100% 处的颜色
                },
              ],
              global: false, // 缺省为 false
            }));
          }
          const idx = api.value(0);
          const stackData = item.stack ? this._getStackData(stacks, item.cacheId) : [];
          const value = item.stack ? stackData[idx] || 0 : 0;

          // x 中心点x轴坐标，y 顶部y轴坐标
          const [x, y] = api.coord([api.value(0), api.value(1) + value]);
          // by 底部y轴坐标
          const [, by] = api.coord([api.value(0), 0 + value]);

          let fact_x = x;
          // 不是堆叠偏移
          if (!item.stack) {
            const cache = this.getOffsetDistance(widths, x, distance, total);
            fact_x = cache[curIdx] ? cache[curIdx] : fact_x;
          }
          let rel_colors = singleColor ? singleColor : colors;
          if(ruleColor){
            rel_colors = ruleColor;
          }
          return {
            type: "group",
            enterFrom: {
              y: by,
              opacity: 0,
              scaleY: 0,
            },
            children: [
              {
                type: "CubeLeft",
                z2: 2,
                shape: {
                  api,
                  xValue: api.value(0),
                  yValue: api.value(1),
                  x: fact_x,
                  y,
                  by,
                },
                style: api.style({
                  fill: rel_colors[0],
                }),
              },
              {
                type: "CubeRight",
                z2: 2,
                shape: {
                  api,
                  xValue: api.value(0),
                  yValue: api.value(1),
                  x: fact_x,
                  y,
                  by,
                },
                style: api.style({
                  fill: rel_colors[1],
                  text: "",
                }),
              },
              {
                type: "CubeTop",
                z2: 2,
                shape: {
                  api,
                  xValue: api.value(0),
                  yValue: api.value(1),
                  x: fact_x,
                  y,
                  by,
                },
                style: api.style({
                  fill: rel_colors[2],
                  text: "",
                }),
              },
            ],
          };
        },
        data: data,
        silent: true,
        zlevel: 0,
        yAxisIndex,
      };
    },
    /**
     * @Description 获取堆叠数字据
     * @param {*} stacks 堆叠数据
     * @param {*} cacheId 需计算堆叠的系列id
     * @returns
     */
    _getStackData(stacks, cacheId) {
      const options = this.chartObj.getOption();
      const legend = options.legend;
      const unselect = [];
      if (legend && legend[0] && legend[0].selected) {
        const selected = legend[0].selected;
        Object.keys(selected).forEach((key) => {
          if (selected[key] == false) {
            unselect.push(key);
          }
        });
      }

      const index = stacks.findIndex((s) => s.cacheId === cacheId);

      const stackData = stacks.slice(0, index).reduce((arr, item) => {
        if (unselect.includes(item.seriesName)) {
          arr = item.data.map((it, index) => {
            return arr[index] + 0;
          });
        } else {
          arr = item.data.map((it, index) => {
            return it + (arr[index] || 0);
          });
        }
        return arr;
      }, []);
      return stackData;
    },
    /**
     * @Description 自定义圆柱
     * @param {*} item
     * @param {*} stackArray 堆叠数组
     * @returns
     */
    dimensionalSeries(item, stacks) {
      let { data, yAxisIndex, seriesWidth, label, total, curIdx, distance, widths, singleData = [] } = item;
      let ruleList = item.singleDataRuleList || [];
      return {
        ...item,
        label: {
          ...label,
        },
        renderItem: (params, api) => {
          const index = params.dataIndex;
          let nowOneData = data[index] || {};
          let ruleObj = handleUniversalRule.call(this, nowOneData, ruleList);
          let ruleColor = null;
          if (ruleObj.color) {
            ruleColor = dsf.dataview.utils.convertCSSToEChartsColor(
              ruleObj.color.color
            );
          }
          let singleColor = null;
          if (singleData[index]) {
            const singleItem = singleData[index].itemStyle;
            singleColor = singleItem.color;
          }
          let colors = singleColor ? singleColor : api.style().fill;
          if(ruleColor){
            colors = ruleColor;
          }
          const idx = api.value(0);
          const stackData = item.stack ? this._getStackData(stacks, item.cacheId) : [];
          const value = item.stack ? stackData[idx] || 0 : 0;

          const [x, y] = api.coord([api.value(0), api.value(1) + value]);

          const [, by] = api.coord([api.value(0), 0 + value]);
          let width = seriesWidth / 2;

          let fact_x = x;
          // 不是堆叠偏移
          if (!item.stack) {
            const cache = this.getOffsetDistance(widths, x, distance, total);
            fact_x = cache[curIdx] ? cache[curIdx] : fact_x;
          }

          if (!api.value(1)) {
            width = 0;
          }
          return {
            type: "group",
            enterFrom: {
              y: by,
              opacity: 0,
              scaleY: 0,
            },
            children: [
              {
                type: "circle",
                scale: [1, 0.4],
                origin: [fact_x, by],
                z2: 2,
                shape: {
                  cx: fact_x,
                  cy: by,
                  r: width,
                },
                style: api.style({
                  fill: colors,
                  text: "",
                }),
              },
              {
                type: "circle",
                scale: [1, 0.4],
                origin: [fact_x, y],
                z2: 2,
                shape: {
                  cx: fact_x,
                  cy: y,
                  r: width,
                  // r0: 30,
                },
                style: api.style({
                  fill: colors,
                  text: "",
                }),
              },
              {
                type: "rect",
                origin: [fact_x, y],
                shape: {
                  x: fact_x - width,
                  y: api.value(1) > 0 ? y : by,
                  width: 2 * width,
                  height: Math.abs(y - by),
                  // r0: 30,
                },
                style: api.style({
                  fill: colors,
                }),
              },
            ],
          };
        },
        data: data,
        yAxisIndex,
      };
    },
    /**
     * @Description 自定义圆锥
     * @param {*} item
     * @returns
     */
    coneBarSeries(item) {
      let { data, yAxisIndex, seriesWidth, label, total, curIdx, distance, widths, singleData = [] } = item;
      let ruleList = item.singleDataRuleList || [];
      return {
        ...item,
        label: {
          ...label,
        },
        renderItem: (params, api) => {
          const index = params.dataIndex;
          let nowOneData = data[index] || {};
          let ruleObj = handleUniversalRule.call(this,nowOneData, ruleList);
          let ruleColor = null;
          if (ruleObj.color) {
            ruleColor = dsf.dataview.utils.convertCSSToEChartsColor(
              ruleObj.color.color
            );
          }
          let singleColor = null;
          if (singleData[index]) {
            const singleItem = singleData[index].itemStyle;
            singleColor = singleItem.color;
          }
          const [x, y] = api.coord([api.value(0), api.value(1)]);
          let colors = singleColor ? singleColor : api.style().fill;
          if(ruleColor){
            colors = ruleColor;
          }
          const [bx, by] = api.coord([api.value(0), 0]);
          let width = seriesWidth / 2;
          const cache = this.getOffsetDistance(widths, x, distance, total);
          const fact_x = cache[curIdx] || x;
          if (!api.value(1)) {
            width = 0;
          }
          // 多边形点集合
          const points = [
            [fact_x, y],
            [fact_x - width, by],
            [fact_x + width, by],
          ];
          return {
            type: "group",
            enterFrom: {
              y: by,
              opacity: 0,
              scaleY: 0,
            },
            transition: "shape",
            children: [
              {
                type: "polygon",
                // y: y,
                origin: [fact_x, y],
                z2: 2,
                shape: {
                  points,
                  // r0: 30,
                },
                style: api.style({
                  fill: colors,
                }),
              },
              {
                type: "circle",
                scale: [1, 0.4],
                origin: [fact_x, by],
                z2: 2,
                shape: {
                  cx: fact_x,
                  cy: by,
                  r: width,
                  // r0: 30,
                },
                style: api.style({
                  fill: colors,
                  text: "",
                }),
              },
            ],
          };
        },
        data: data,
        yAxisIndex,
      };
    },
    /**
     * @Description 自定义矩形
     * @param {*} item
     * @returns
     */
    rectSeries(item, stacks) {
      let { data, yAxisIndex, seriesWidth, label, total, curIdx, distance, widths, singleData = [] } = item;
      let ruleList = item.singleDataRuleList || [];
      return {
        ...item,
        label: {
          ...label,
        },
        renderItem: (params, api) => {
          const index = params.dataIndex;
          let nowOneData = data[index] || {};
          let ruleObj = handleUniversalRule.call(this,nowOneData, ruleList);
          let ruleColor = null;
          if (ruleObj.color) {
            ruleColor = dsf.dataview.utils.convertCSSToEChartsColor(
              ruleObj.color.color
            );
          }
          let singleColor = null;
          if (singleData[index]) {
            const singleItem = _.cloneDeep(singleData[index].itemStyle);
            singleColor = singleItem.color;
          }
          let colors = singleColor ? singleColor : api.style().fill;
          if(ruleColor){
            colors = ruleColor;
          }
          const idx = api.value(0);
          const stackData = item.stack ? this._getStackData(stacks, item.cacheId) : [];
          const value = item.stack ? stackData[idx] || 0 : 0;

          const [x, y] = api.coord([api.value(0), api.value(1) + value]);
          const [, by] = api.coord([api.value(0), 0 + value]);

          let width = seriesWidth / 2;

          let fact_x = x;
          // 不是堆叠偏移
          if (!item.stack) {
            const cache = this.getOffsetDistance(widths, x, distance, total);
            fact_x = cache[curIdx] ? cache[curIdx] : fact_x;
          }

          return {
            type: "group",
            enterFrom: {
              y: by,
              opacity: 0,
              scaleY: 0,
            },
            children: [
              {
                type: "rect",
                origin: [fact_x, y],
                shape: {
                  x: fact_x - width,
                  y: api.value(1) > 0 ? y : by,
                  width: 2 * width,
                  height: Math.abs(y - by),
                },
                style: api.style({
                  fill: colors,
                }),
              },
            ],
          };
        },
        data: data,
        yAxisIndex,
      };
    },
    /**
     * @Description 自定义柱泡图
     * @param {*} item
     * @returns
     */
    barBubbleSeries(item) {
      let { data, yAxisIndex, seriesWidth, label, total, curIdx, distance, widths, baseValue = 20, isBottomCircle = false, isBaseValue = false, symbolSize = 20, singleData = [] } = item;
      const sizeData = this.calculateBaseSeriesSize(data, baseValue);
      let ruleList = item.singleDataRuleList || [];
      return {
        ...item,
        label: {
          ...label,
        },
        renderItem: (params, api) => {
          const index = params.dataIndex;
          let nowOneData = data[index] || {};
          let ruleObj = handleUniversalRule.call(this,nowOneData, ruleList);
          let ruleColor = null;
          if (ruleObj.color) {
            ruleColor = dsf.dataview.utils.convertCSSToEChartsColor(
              ruleObj.color.color
            );
          }
          let singleColor = null;
          if (singleData[index]) {
            const singleItem = _.cloneDeep(singleData[index].itemStyle);
            singleColor = singleItem.color;
          }
          let colors = singleColor ? singleColor : api.style().fill;
          if(ruleColor){
            colors = ruleColor;
          }
          const [x, y] = api.coord([api.value(0), api.value(1)]);
          const [, by] = api.coord([api.value(0), 0]);
          let width = seriesWidth / 2;

          let circleWidth = isBaseValue ? sizeData[index] : symbolSize;

          const cache = this.getOffsetDistance(widths, x, distance, total);
          const fact_x = cache[curIdx] || x;
          const circlePosition = isBottomCircle ? [fact_x, by] : [fact_x, y];
          if (!api.value(1)) {
            width = 0;
            circleWidth = 0;
          }
          return {
            type: "group",
            enterFrom: {
              y: by,
              opacity: 0,
              scaleY: 0,
            },
            children: [
              {
                type: "circle",
                origin: circlePosition,
                z2: 2,
                shape: {
                  cx: fact_x,
                  cy: isBottomCircle ? by : y,
                  r: circleWidth,
                },
                style: api.style({
                  fill: colors,
                  text: "",
                }),
              },
              {
                type: "rect",
                origin: [fact_x, y],
                shape: {
                  x: fact_x - width,
                  y: api.value(1) > 0 ? y : by,
                  width: 2 * width,
                  height: Math.abs(y - by),
                },
                style: api.style({
                  fill: colors,
                }),
              },
            ],
          };
        },
        data: data,
        yAxisIndex,
      };
    },
    // color当前颜色，idx需要当前组
    smallColor(color, idx) {
      const start = tinycolor(color).toRgb();
      let count = 0;
      const result = [];
      while (count < idx) {
        count++;
        const temp = [];
        for (let i = 0; i < 2; i++) {
          const params = {
            r: Math.round(start.r - start.r * Math.random()),
            g: Math.round(start.g - start.g * Math.random()),
            b: Math.round(start.b - start.b * Math.random()),
          };
          temp.push(
            tinycolor(params)
              .desaturate(count * 10)
              .toHexString()
          );
        }
        result.push(temp);
      }
      return idx === 1 ? result[0] : result;
    },
    // 计算数据大小
    calculateBaseSeriesSize(data, baseValue) {
      // 计算大小时注意负数
      const max_value = data.reduce((max, it) => {
        if (dsf.isUnDef(it)) {
          return max;
        }
        const value = Math.abs(it.value || it);
        return Math.max(max, this.getStringToNumber(Math.abs(value)));
      }, 0);
      return data.map((it) => {
        if (dsf.isUnDef(it)) {
          return 0;
        }
        const value = Math.abs(it.value || it);
        return Math.round((value / max_value) * baseValue);
      });
    },
    getStringToNumber(string) {
      let value = parseFloat(string);
      if (isNaN(value)) {
        value = 0;
      }
      return value < 0 ? 2 * value : value;
    },
  },
};
