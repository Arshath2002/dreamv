<!--
 * @Description: svg画三棱锥
 * @Author: shenah
 * @Date: 2024-01-19 15:26:03
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-02-18 16:05:59
-->

<template>
  <div
    class="data-view-item-wrap ds-control data-view-svg-three-pyramid data-view-no-padding data-view-common-bg-effect"
    :style="controlOuterStyle"
    v-loading="dataLoad"
    :element-loading-text="loadingText"
    :element-loading-spinner="loadingSpinner"
    :element-loading-background="loadingBackground"
  >
    <dsf-empty-data v-if="!hasData"></dsf-empty-data>
    <!-- svg  -->
    <svg ref="svgRef" class="three-svg" @click="clickSvg"></svg>
    <!-- 文字 -->
    <div class="text-item" v-for="(item, index) in data" :key="index" :style="textItemStyle(item, index)">
      <div class="text" :style="textStyle">
        {{ getValue(item, valueFormat) }}
      </div>
      <div class="line" :style="lineStyle"></div>
    </div>
    <!-- 图例 -->
    <div class="three-pyramid-legend" :style="threePyramidLegendStyle" v-if="config.isShowLegend">
      <div
        class="legend-item"
        v-for="(item, index) in data"
        :key="index"
        @click="legendClick(item)"
        :class="{
          'no-active': !item.isShow,
        }"
      >
        <div class="legend-name" :style="legendNameStyle">
          {{ item.name }}
        </div>
        <div class="bg-color" :style="bgColorStyle(index)"></div>
      </div>
    </div>
  </div>
</template>
<script>
import dataAnalysis from "_dataview/mixins/dataAnalysis.js";
import { createDefaultThreePyramidConfig } from "_dataview/output/chartDefault/threePyramid.js";
import defaultBackground from "_dataview/share/components/common/backgroundDefault.js";
const staticDataKeyDic = {
  name: "名称",
  value: "百分比",
};
const staticData = [
  {
    name: "A类",
    value: 5,
  },
  {
    name: "B类",
    value: 10,
  },
  {
    name: "C类",
    value: 15,
  },
  {
    name: "D类",
    value: 20,
  },
  {
    name: "E类",
    value: 25,
  },
  {
    name: "F类",
    value: 25,
  },
];
export default dsf.component({
  name: "DsfDataViewThreePyramid",
  ctrlCaption: "圆三棱锥",
  mixins: [$mixins.dataView, dataAnalysis],
  components: {},
  props: {
    //风格对应组件key
    styleMapKey: {
      type: String,
      default: "threePyramid",
    },
    padding: {
      type: Array,
      default: () => [0, 10, 0, 10],
    },
    config: {
      type: Object,
      default: () => createDefaultThreePyramidConfig(),
    },
    valueFormat: {
      type: String,
      default: "@[value]%",
    },
    angle: {
      type: Number,
      default: 30,
    },
    staticData: {
      type: Array,
      default: () => staticData,
    },
    excelData: {
      type: Array,
      default: () => {
        return dsf.dataview.utils.transformToExcelData(staticData, staticDataKeyDic);
      },
    },
    mapRelations: {
      type: Array,
      default() {
        return [
          {
            text: "名称字段",
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
    // 整体背景
    controlBackgroundConfig: {
      type: Object,
      default() {
        return { ...defaultBackground };
      },
    },
  },
  computed: {
    legendNameStyle() {
      if (dsf.isEmptyObject(this.config?.legendTextConfig)) {
        return {};
      }
      let { fontFamily, fontSize, color, fontWeight, fontStyle, textDecoration } = this.config.legendTextConfig;
      if (color === "theme") {
        color = "@main";
      }

      return {
        fontSize: dsf.dataview.utils.transformPx(fontSize),
        color,
        fontFamily,
        fontWeight,
        fontStyle,
        textDecoration,
      };
    },
    lineStyle() {
      return {
        backgroundColor: this.config.textLineColor,
      };
    },
    textStyle() {
      if (dsf.isEmptyObject(this.config?.contentTextConfig)) {
        return {};
      }
      let { fontFamily, fontSize, color, fontWeight, fontStyle, textDecoration } = this.config.contentTextConfig;

      return {
        fontSize: dsf.dataview.utils.transformPx(fontSize),
        color,
        fontFamily,
        fontWeight,
        fontStyle,
        textDecoration,
      };
    },
    threePyramidLegendStyle() {
      let position = this.config.legendPosition;
      let style = {
        [position]: 0,
        flexDirection: this.config.legendDirection,
        alignItems: "center",
      };
      if (["top", "bottom"].indexOf(position) > -1) {
        style.width = "100%";
        style.left = 0;
        style.justifyContent = this.config.legendDirectionH;
      } else {
        style.alignItems = position === "left" ? "flex-start" : "flex-end";
        style.alignContent = position === "left" ? "flex-start" : "flex-end";
        style.height = "100%";
        style.top = 0;
        style.justifyContent = this.config.legendDirectionV;
      }
      return style;
    },
  },
  watch: {
    controlOuterStyle() {
      this.resize();
    },
    config: {
      handler() {
        if (this.isDesign) {
          this.middleWareData();
        }
      },
      deep: true,
    },
    padding: {
      handler() {
        if (this.isDesign) {
          this.middleWareData();
        }
      },
      deep: true,
    },
    angle() {
      if (this.isDesign) {
        this.middleWareData();
      }
    },
    staticData() {
      if (this.isDesign) {
        this.middleWareData();
      }
    },
  },
  data() {
    return {
      svgW: 0,
      svgH: 0,
      topHeight: 0,
      defaultTextConfig: {
        fontFamily: "Microsoft Yahei", // 字体
        fontSize: "20px", // 字号
        color: "rgba(1,132,148,1)", // 颜色
        fontWeight: "normal", // 加醋
        fontStyle: "normal", // 斜体
        textDecoration: "none", // 下划线
      },
    };
  },
  created() {
    // 为了兼容以后新增属性
    this.initTextConfig();
    this.$emit("update:config", {
      ...createDefaultThreePyramidConfig(),
      ...this.config,
    });
  },
  methods: {
    // 复制组件样式
    copyComponentStyle() {
      return {
        _props: this.getComponentStyle(),
        // 固定为数组格式，按主、次顺序
        textStyles: [this.textStyle, this.legendNameStyle],
        backgrounds: [this.controlBackgroundConfig],
      };
    },
    // 粘贴组件样式
    pasteComponentStyle(config) {
      let groups = this.$designer.attributesGroup.filter((it) => !/数据|属性|插槽/.test(it.name));
      if (config._props.ctrlName !== this.ctrlName) {
        const { textStyles = [], backgrounds = [] } = config;
        groups = groups.filter((it) => /布局|背景|边框设置|入场动画/.test(it.name));
        this.updateComponentStyle("config.contentTextConfig", textStyles[0]);
        this.updateComponentStyle("config.legendTextConfig", textStyles[1]);
        this.updateComponentStyle("controlBackgroundConfig", backgrounds[0]);
      }
      this.setComponentStyle(groups, config._props);
    },
    initTextConfig() {
      let props = [
        {
          newName: "contentTextConfig",
          maps: [
            {
              form: "textFontFamily",
              to: "fontFamily",
            },
            {
              form: "textFontSize",
              to: "fontSize",
            },
            {
              form: "textColor",
              to: "color",
            },
          ],
        },
        {
          newName: "legendTextConfig",
          maps: [
            {
              form: "legendFontFamily",
              to: "fontFamily",
            },
            {
              form: "legendFontSize",
              to: "fontSize",
            },
            {
              form: "legendColor",
              to: "color",
            },
          ],
        },
      ];
      _.each(props, (item) => {
        let textConfig = this.config[item.newName];
        if (!textConfig || dsf.isEmptyObject(textConfig)) {
          textConfig = dsf.mix(true, {}, this.defaultTextConfig);
          _.each(item.maps, (it) => {
            let form = this.config[it.form];
            if (form) {
              textConfig[it.to] = form;
            }
          });
        }
        this.$set(this.config, item.newName, {});
        for (let key in textConfig) {
          this.$set(this.config[item.newName], key, textConfig[key]);
        }
      });
    },
    textItemStyle(row, index) {
      if (row.itemHeight) {
        let paddingTop = this.padding[0] * 1;
        let paddingLeft = this.padding[4] * 1;
        let paddingRight = this.padding[1] * 1;
        paddingTop = typeof paddingTop === "number" ? paddingTop : 0;
        paddingLeft = typeof paddingLeft === "number" ? paddingLeft : 0;
        paddingRight = typeof paddingRight === "number" ? paddingRight : 0;
        let topHeight = this.topHeight + paddingTop;
        let y = row.startPointY + row.itemHeight / 2 + topHeight;
        let x = this.svgW / 2;
        let style = {
          width: `${x}px`,
          top: `${y}px`,
        };
        let flag = index % 2;
        if (["top", "bottom"].indexOf(this.config.legendPosition) > -1) {
          if (flag) {
            style.right = `${paddingRight}px`;
            style.flexDirection = "row-reverse";
          } else {
            style.left = `${paddingLeft}px`;
          }
        } else {
          if (this.config.legendPosition === "left") {
            style.right = `${paddingRight}px`;
            style.flexDirection = "row-reverse";
          } else {
            style.left = `${paddingLeft}px`;
          }
        }
        return style;
      }
      return {};
    },
    clickSvg(e) {
      if (!this.isDesign) {
        let target = e.target;
        let index = target.getAttribute("data-oldIndex") * 1;
        if (typeof index === "number") {
          let data = this.data[index];
          this.loadClickEvents(data);
        }
      }
    },
    legendClick(row) {
      if (!this.isDesign) {
        row.isShow = !row.isShow;
        this.changeRanger(this.data);
      }
    },
    bgColorStyle(index) {
      let color = this.getArrColor(this.config.itemColorArr, index);
      return {
        backgroundColor: color,
      };
    },
    /**
     * ai 大模型输出数据处理
     * @param {Array} describe 字段描述信息
     * @param {Array} data 数据
     */
    dataModelAnalysis({ describe, data }) {
      const dictionary = describe.reduce((o, it) => ((o[it.field] = it.title), o), {});
      const [dimension, ...rest] = describe;
      this.mapRelations[0] = {
        map: dimension.field,
        value: dimension.field,
        text: dimension.title,
        hideDigit: true,
      }
      try {
        let valueKey = dictionary.value ? "value" : null;
        let valueUnit = "";
        if (data.length) {
          if (!dictionary.value) {
            for (let i = 0; i < rest.length; i++) {
              const key = rest[i].field;
              // 选取字段
              const res = dsf.dataview.utils.matchNumberAndSuffix(data[0][key]);
              if (res && isFinite(res.number)) {
                if (!valueKey) {
                  valueKey = key;
                  dictionary.value = "值";
                }
              }
              // 处理数据
              if (valueKey) {
                data.forEach((it) => {
                  const valueItem = dsf.dataview.utils.matchNumberAndSuffix(it[valueKey]);
                  it.value = valueItem.number;
                  if (valueItem.unit) {
                    valueUnit = valueItem.unit;
                    it.value_unit = valueUnit;
                    dictionary.value_unit = dictionary.value + "_单位";
                  }
                });
                data.sort((a, b) => a.value - b.value);
                break;
              }
            }
          } else {
            const keys = rest.map(it => it.field);
            data.forEach((it) => {
              keys.forEach((key) => {
                const res = dsf.dataview.utils.matchNumberAndSuffix(it[key]);
                if (res && isFinite(res.number)) {
                  it[key] = res.number;
                  // 新增列
                  if (!res.unit) return;
                  const uKey = key + "_unit";
                  it[uKey] = res.unit;
                  dictionary[uKey] = dictionary[key] + "_单位";
                }
              });
            });
          }
        }
        this.valueFormat = `@[value]${valueUnit || ""}`;
      } catch (error) {
        console.warn(`error${error}`);
      }
      // 处理成Excel
      const excelData = dsf.dataview.utils.transformToExcelData(data, dictionary);
      this.excelData.length = 0;
      dsf.mix(true, this.excelData, excelData);
      this.$emit("update:excelData", excelData);
    },
    dataAnalysis(data) {
      //暂无数据
      if (!data.length) {
        this.hasData = false;
        return false;
      }
      let nowData = data;
      if (eval(this.dynamicRules) || this.dataType) {
        let mapRelations = this.mapRelations;
        let name = mapRelations[0].map || "name";
        let value = mapRelations[1].map || "value";
        nowData = data.map((it, index) => {
          let nowValue = this.handleMapRelationNum(it[value], mapRelations[1]);
          return {
            ...it,
            isShow: true,
            oldIndex: index,
            name: it[name],
            value: nowValue,
          };
        });
      } else {
        nowData = data.map((item, index) => ({
          ...item,
          oldIndex: index,
          isShow: true,
        }));
      }
      setTimeout(() => {
        this.changeRanger(nowData);
      });
    },
    changeRanger(data) {
      this.$nextTick(() => {
        let filterData = data.filter((item) => item.isShow);
        // 清空svg
        let svgEl = this.$refs.svgRef;
        if (svgEl) {
          svgEl.innerHTML = "";
          let svgW = svgEl.clientWidth;
          let svgH = svgEl.clientHeight;
          this.svgW = svgW;
          this.svgH = svgH;
          let totalNum = filterData.length;
          let distance = this.config.distance;
          //  总间距
          let totalDistance = distance * (totalNum - 1);
          // 剩余的高度以比例分高度
          let overHeight = svgH - totalDistance;
          // 目前算法均分
          let eachHeight = _.round(overHeight / totalNum, 2);
          let elArr = [];
          // 真实占有的高度画出图形的高度
          filterData.forEach((item, index) => {
            if (index === 0) {
              // 生成顶端的三角形
              item.startPointY = 0;
              item.itemHeight = eachHeight;
              elArr.push(this.createThree(item));
            } else {
              // 生成不规则图形
              let beforeStartPointY = filterData[index - 1].startPointY;
              if (index === 1) {
                item.startPointY = beforeStartPointY + distance + eachHeight;
              } else {
                item.startPointY = beforeStartPointY + distance + eachHeight / 2;
              }
              item.itemHeight = eachHeight / 2;
              elArr.push(this.createIrregular(item));
            }
          });
          // 因为层级倒序生成
          this.createSvgContent(svgEl, elArr);
          this.data = data;
        }
      });
    },
    createThree(row) {
      let pathEl = this.createSvgTag("path");
      let index = row.oldIndex;
      let color = this.getArrColor(this.config.itemColorArr, index);
      let svgW = this.svgW;
      let xCenter = svgW / 2;
      let height = row.itemHeight;
      let width = _.round(this.getTan(this.angle) * height, 2);
      let hypotenuse = this.getHypotenuse(width, height);
      // 计算第一个三角锥的三个点坐标,以中心点为顶点为a,b,c(顺时针)
      let aPoint = `${xCenter} 0`;
      let bPoint = `${xCenter + width} ${height}`;
      let CPoint = `${xCenter - width} ${height}`;
      let d = `M ${aPoint} L ${CPoint} M ${aPoint} L ${bPoint} A ${hypotenuse * 2} ${hypotenuse * 2} 0 0 1 ${CPoint}`;
      pathEl.setAttribute("d", d);
      pathEl.setAttribute("stroke-width", 1);
      pathEl.setAttribute("stroke", color);
      pathEl.setAttribute("fill", color);
      pathEl.setAttribute("data-oldIndex", index);
      return [pathEl];
    },
    /**
     * @name: 创建不规则图形
     * @param {*} row
     * @param {*} index
     * @param {*} rowHeight
     * @return {*}
     */
    createIrregular(row) {
      let svgW = this.svgW;
      let index = row.oldIndex;
      let color = this.getArrColor(this.config.itemColorArr, index);
      let circleColor = this.getArrColor(this.config.itemCircleColorArr, index - 1);
      let xCenter = svgW / 2;
      let startPointY = row.startPointY;
      let height = row.itemHeight;
      // 创建一个path
      let pathCircleEl = this.createSvgTag("path");
      let pathOtherEl = this.createSvgTag("path");
      let pathCircleW = _.round(this.getTan(this.angle) * startPointY, 2);
      let pathElOtherW = _.round(this.getTan(this.angle) * (row.itemHeight + startPointY), 2);
      let aPoint = `${xCenter + pathCircleW} ${startPointY}`;
      let bPoint = `${xCenter - pathCircleW} ${startPointY}`;
      let cPoint = `${xCenter + pathElOtherW} ${startPointY + height}`;
      let dPoint = `${xCenter - pathElOtherW} ${startPointY + height}`;
      let pathCircleD = `M ${bPoint} a ${pathCircleW} ${pathCircleW / 6} 180 1 1 0 1 z`;
      pathCircleEl.setAttribute("d", pathCircleD);
      pathCircleEl.setAttribute("stroke-width", 1);
      pathCircleEl.setAttribute("stroke", circleColor);
      pathCircleEl.setAttribute("fill", circleColor);
      pathCircleEl.setAttribute("data-oldIndex", index);

      let pathOtherD = `M ${dPoint} a ${pathElOtherW} ${pathElOtherW / 6} 180 1 1 0 1 z  M ${aPoint} L ${cPoint}  L ${dPoint} L ${bPoint} z`;
      pathOtherEl.setAttribute("d", pathOtherD);
      pathOtherEl.setAttribute("stroke-width", 1);
      pathOtherEl.setAttribute("stroke", color);
      pathOtherEl.setAttribute("fill", color);
      pathOtherEl.setAttribute("data-oldIndex", index);
      return [pathOtherEl, pathCircleEl];
    },
    createSvgContent(svgEl, arr) {
      let gEl = this.createSvgTag("g");
      arr.reverse().forEach((elArr) => {
        elArr.forEach((el) => {
          gEl.appendChild(el);
        });
      });
      svgEl.appendChild(gEl);
      let height = this.svgH;
      const bbox = gEl.getBBox();
      const gHeight = bbox.height;
      const topHeight = (height - gHeight) / 2;
      this.topHeight = topHeight;
      gEl.style.transform = `translate(0, ${topHeight}px)`;
    },
    // 创建svg标签
    createSvgTag(tag) {
      return document.createElementNS("http://www.w3.org/2000/svg", tag);
    },
    getTan(angle) {
      const rad = (angle * Math.PI) / 180;
      return Math.tan(rad);
    },
    getHypotenuse(w, h) {
      return Math.sqrt(w * w + h * h);
    },
    getArrColor(colorArr, index) {
      return colorArr[index] || _.last(colorArr);
    },
    getValue(data, textTitle) {
      let v = this.$expressParams(data);
      return this.$replace(textTitle, v);
    },
    resize() {
      if (!this.isDesign) {
        this.middleWareData();
      }
    },
    styleConfigCallback(style, themeObj) {
      let config = style.config;
      let itemColorArr = config.itemColorArr.call(this, themeObj);
      let itemCircleColorArr = config.itemCircleColorArr.call(this, themeObj);
      this.config.itemColorArr = itemColorArr;
      this.config.itemCircleColorArr = itemCircleColorArr;
      this.$emit("update:config", this.config);
    },
  },
});
</script>
<style lang="scss">
@import "_dataview/assets/styles/share/components/threePyramid.scss";
</style>
