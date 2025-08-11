<!--
 * @Description: 有底色的选择icon
 * @Author: shenah
 * @Date: 2023-03-23 19:59:14
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-04-03 17:15:47
-->

<template>
  <div
    class="dsf-dv-icon-rate data-view-item-wrap ds-control data-view-no-padding"
    v-loading="dataLoad"
    :element-loading-text="loadingText"
    :element-loading-spinner="loadingSpinner"
    :element-loading-background="loadingBackground"
    :style="dsfDvIconRateStyle"
  >
    <dsf-empty-data v-if="!hasData"></dsf-empty-data>
    <el-scrollbar class="dsf-dv-icon-rate-wrapper data-view-common-bg-effect" v-else>
      <div class="icon-rate-items" ref="iconRateItems">
        <div
          class="icon-rate-item"
          :class="rateItemClass"
          :style="rateItemStyle"
          @mouseenter="(e) => handleMouseEnter(item, e)"
          @mouseleave="(e) => handleMouseLeave(item, e)"
          @click="itemClick($event, item)"
          v-for="(item, index) in data"
          :key="item.keyId"
        >
          <!-- 横向排列 -->
          <template v-if="layoutType === 'hor'">
            <div class="name" :style="getLabelStyle(item, index)" :title="item.name">
              {{ getValueFormatter(nameFormatter, item) }}
            </div>
            <el-rate
              v-if="thingShowType === 'icon'"
              class="icon-rate-base"
              :value="item.showRate"
              :colors="[getRuleColor(item, index), getRuleColor(item, index), getRuleColor(item, index)]"
              disabled
              :disabled-void-color="thingBaseColor"
              :disabled-void-icon-class="getIcons(index)[0]"
              :icon-classes="getIcons(index)"
              :max="max"
              :style="getRateStyle"
            ></el-rate>
            <!-- 线条模式 -->
            <div class="icon-rate-base" v-else>
              <svgLine
                :dash="[lineTextStyle.width, lineTextStyle.gap]"
                :height="lineTextStyle.height"
                :rate="(item.showRate * 100) / max"
                :color="getRuleColor(item, index)"
                :baseColor="thingBaseColor"
                :animateConfig="animateConfig"
                :id="index"
              />
            </div>
            <div class="number" :style="getValueStyle(item, index)">
              {{ getValueFormatter(valueFormatter, item) }}
            </div>
          </template>
          <!-- 纵向排列 -->
          <template v-else>
            <div :style="lineMarginStyle" class="vec-wrap">
              <!-- 自定义纵向插槽 -->
              <slot :row="item" :rowIndex="index" :name="vecSlotName ? vecSlotName : 'default'">
                <div class="name-value-percent-wrapper">
                  <div class="name" :style="getLabelStyle(item, index)">
                    {{ getValueFormatter(nameFormatter, item) }}
                  </div>
                  <div class="value" :style="getValueStyle(item, index)">
                    {{ getValueFormatter(valueFormatter, item) }}
                  </div>
                </div>
              </slot>
              <el-rate
                v-if="thingShowType === 'icon'"
                class="icon-rate-base"
                :value="item.showRate"
                :colors="[getRuleColor(item, index), getRuleColor(item, index), getRuleColor(item, index)]"
                disabled
                :disabled-void-color="thingBaseColor"
                :disabled-void-icon-class="getIcons(index)[0]"
                :icon-classes="getIcons(index)"
                :max="max"
                :style="getRateStyle"
              ></el-rate>
              <!-- 线条模式 -->
              <div class="icon-rate-base" v-else>
                <svgLine
                  :dash="[lineTextStyle.width, lineTextStyle.gap]"
                  :height="lineTextStyle.height"
                  :rate="(item.showRate * 100) / max"
                  :color="getRuleColor(item, index)"
                  :baseColor="thingBaseColor"
                  :animateConfig="animateConfig"
                  :id="index"
                />
              </div>
            </div>
          </template>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
const staticDataKeyDic = {
  name: "名称",
  value: "数值",
  percent: "占比",
  unit: "单位",
};
const staticData = [
  {
    name: "成都",
    value: 100,
    percent: "20",
    unit: "万",
  },
  {
    name: "北京",
    value: 300,
    percent: "40",
    unit: "万",
  },
  {
    name: "上海",
    value: 800,
    percent: "50",
    unit: "万",
  },
  {
    name: "四川",
    value: 900,
    percent: "79",
    unit: "万",
  },
  {
    name: "双流",
    value: 60,
    percent: "10",
    unit: "万",
  },
  {
    name: "天津",
    value: 67,
    percent: "10",
    unit: "万",
  },
];

import svgLine from "./common/svgLine.vue";
import universalRuleMixin from "_dataview/mixins/universalRuleMixin";
import dataAnalysis from "_dataview/mixins/dataAnalysis.js";
export default dsf.component({
  name: "DsfDataViewIconRate",
  ctrlCaption: "图标排名",
  mixins: [$mixins.dataView, dataAnalysis, universalRuleMixin],
  provide() {
    return {
      resizeCount: this.resizeCount,
    };
  },
  components: {
    svgLine,
  },
  props: {
    padding: {
      type: Array,
      default: () => [15, 15, 15, 15],
    },
    animateConfig: {
      type: Object,
      default: () => ({
        flag: true,
        dur: 3000,
      }),
    },
    vecSlotName: {
      type: String,
      default: "",
    },
    colorRuleList: {
      type: Array,
      default: () => [],
    },
    //风格对应组件key
    styleMapKey: {
      type: String,
      default: "dataviewIconRate",
    },
    backgroundConfig: {
      type: Object,
      default: () => ({
        active: "page",
        pattern: {
          image: "",
          size: "100% 100%",
          repeat: "no-repeat",
          position: "left center",
        },
      }),
    },
    nameTextStyle: {
      type: Object,
      default: () => ({
        width: "50px",
        fontSize: "18px",
        color: "#DCF0FF",
        fontFamily: "",
        fontWeight: "normal",
        fontStyle: "normal",
        textDecoration: "none",
        hAlign: "center",
        margin: [0, 10, 0, 10],
      }),
    },
    valueTextStyle: {
      type: Object,
      default: () => ({
        width: "50px",
        fontSize: "18px",
        color: "#DCF0FF",
        fontFamily: "",
        fontWeight: "normal",
        fontStyle: "normal",
        textDecoration: "none",
        hAlign: "right",
        margin: [0, 10, 0, 10],
      }),
    },
    thingShowType: {
      type: String,
      default: "line", // "line","icon"
    },
    thingBaseColor: {
      type: String,
      default: "rgba(71, 71, 71, 0.3)",
    },
    lineTextStyle: {
      type: Object,
      default: () => ({
        width: "4px",
        height: "20px",
        gap: "4px",
      }),
    },
    nameFormatter: {
      type: String,
      default: "@[name]",
    },
    valueFormatter: {
      type: String,
      default: "@[value] @[unit]",
    },
    isScroll: {
      type: Boolean,
      default: false,
    },
    scrollSpeed: {
      type: [Number, String],
      default: 0.4,
    },
    //名称-值-比例 图标 排列方式 hor横向 vec 纵向
    layoutType: {
      type: String,
      default: "hor",
    },
    //每行高度
    rowHeight: {
      type: String,
      default: "30px",
    },
    //两行时候上下边距
    lineMargin: {
      type: [String, Number],
      default: "6",
    },
    // 标签颜色是否依赖图标颜色
    colorIsRelative: {
      type: Boolean,
      default: true,
    },
    icons: {
      type: Array,
      default: () => ["user1"],
    },
    //图标大小
    iconSize: {
      typeof: Number,
      default: 16,
    },
    colors: {
      type: Array,
      default: () => ["#47e7d2", "#3AA8FF"],
    },
    openAutoCalcRatio: {
      type: Boolean,
      default: true,
    },
    staticData: {
      type: Array,
      default: () => staticData,
    },
    sortInfo: {
      type: String,
      default: "desc",
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
            text: "名称",
            value: "name",
            map: "name",
            hideDigit: true,
          },
          {
            text: "数值",
            value: "value",
            map: "value",
            hideDigit: true,
          },
          {
            text: "占比",
            value: "percent",
            map: "percent",
            hideDigit: true,
          },
          {
            text: "单位",
            value: "unit",
            map: "unit",
          },
        ];
      },
    },
  },
  computed: {
    dsfDvIconRateStyle() {
      return {
        ...this.controlStyle,
        ...this.dvBackgroundFormat(this.backgroundConfig, {
          isBgInfoVar: true,
        }),
        ...this.getCommonEnterAnimateStyle,
        ...this.getBoxShadowConfig(true),
      };
    },
    rateItemClass() {
      return this.layoutType;
    },
    rateItemStyle() {
      let style = {
        "min-height": height,
        ...this.eventCursorPointerStyle,
      };
      let { rowHeight } = this;
      const height = dsf.dataview.utils.transformPx(rowHeight);
      if (this.layoutType === "hor") {
        style.marginBottom = this.lineMarginStyle.marginBottom;
      }
      return style;
    },
    lineMarginStyle() {
      return {
        marginBottom: dsf.dataview.utils.transformPx(this.lineMargin),
      };
    },
    getRateStyle() {
      return {
        "font-size": dsf.dataview.utils.transformPx(this.iconSize),
      };
    },
  },
  watch: {
    //排列方式改变
    layoutType() {
      this.isDesign && this.$nextTick(this.onResize);
    },
    animateConfig: {
      handler() {
        const data = _.cloneDeep(this.serviceData);
        this.dataAnalysis(data);
      },
      deep: true,
    },
    isScroll() {
      this.$nextTick(this.animation);
    },
    rowHeight() {
      this.isDesign && this.$nextTick(this.animation);
    },
    sortInfo() {
      const data = _.cloneDeep(this.serviceData);
      this.dataAnalysis(data);
    },
    staticData(val) {
      this.dataAnalysis(val);
    },
    iconSize() {
      this.$nextTick(this.getRelWidth);
    },
    openAutoCalcRatio() {
      const data = _.cloneDeep(this.serviceData);
      this.dataAnalysis(data);
    },
  },
  data() {
    return {
      //resize 记录器
      resizeCount: {
        count: 0,
      },
      //动画
      animationHandler: null,
      scrollTop: 0,
      //动画状态
      animateStatus: false,

      resizeFc: null,
      clickTimer: null,
      max: 5,
      maxCount: 0,
      residentWidth: "auto",
      data: [],
    };
  },
  created() {
    this.compatibleProp();
    this.resizeFc = _.debounce(() => {
      this.onResize();
    }, 200);
    window.addEventListener("resize", this.resizeFc);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resizeFc);
    this.stopAnimation();
  },
  methods: {
    // 复制组件样式
    copyComponentStyle() {
      return {
        _props: this.getComponentStyle(),
        // 固定为数组格式，按主、次顺序
        textStyles: [this.nameTextStyle, this.valueTextStyle],
        backgrounds: [this.backgroundConfig],
        colorScheme: this.colors,
      };
    },
    // 粘贴组件样式
    pasteComponentStyle(config) {
      let groups = this.$designer.attributesGroup.filter((it) => !/数据|属性|插槽/.test(it.name));
      if (config._props.ctrlName !== this.ctrlName) {
        groups = groups.filter((it) => /布局|边框设置|滚动设置|背景|入场动画/.test(it.name));
        const { textStyles = [], backgrounds = [], colorScheme } = config;
        this.updateComponentStyle("nameTextStyle", textStyles[0]);
        this.updateComponentStyle("valueTextStyle", textStyles[1]);
        this.updateComponentStyle("backgroundConfig", backgrounds[0]);
        this.updateComponentStyle("colors", colorScheme);
      }
      this.setComponentStyle(groups, config._props);
    },
    compatibleProp() {
      // 兼容
      if (this.$attrs.nameFontSize) {
        this.nameTextStyle.fontSize = this.$attrs.nameFontSize;
        this.nameTextStyle.color = this.$attrs.nameColor;
        this.nameTextStyle.width = this.$attrs.nameWidth;
        let nameMargin = this.$attrs.labelMargin;
        this.nameTextStyle.margin = [0, nameMargin[0], 0, nameMargin[1]];

        //值
        this.valueTextStyle.color = this.$attrs.nameColor;
        this.valueTextStyle.fontSize = this.$attrs.numFontSize;
        this.valueTextStyle.width = this.$attrs.numWidth;
        let valueMargin = this.$attrs.valueMargin;
        this.nameTextStyle.margin = [0, valueMargin[0], 0, valueMargin[1]];

        // 图标线条
        this.thingShowType = this.$attrs.isIcon ? "icon" : "line";
        this.thingBaseColor = this.$attrs.iconBaseColor;
        this.lineTextStyle.width = this.$attrs.lineWidth;
        this.lineTextStyle.height = this.$attrs.lineHeight;
        this.lineTextStyle.gap = this.$attrs.lineGap;

        this.$emit("update:thingShowType", this.thingShowType);
        this.$emit("update:thingBaseColor", this.thingBaseColor);
        this.$emit("update:nameTextStyle", this.nameTextStyle);
        this.$emit("update:valueTextStyle", this.valueTextStyle);
        this.$emit("update:lineTextStyle", this.lineTextStyle);
      }
    },
    getValueFormatter(str, data) {
      return this.$replace(str, data);
    },
    //添加滚动事件监听
    addScrollerEvents() {
      let el = this.getScrollerEl();
      el.addEventListener("mousewheel", this.mousewheelListenerEvent);
      el.addEventListener("mouseover", this.mouseOverListenerEvent);
      el.addEventListener("mouseleave", this.mouseLeaveListenerEvent);
    },
    //移除滚动事件监听
    removeScrollerEvents() {
      let el = this.getScrollerEl();
      el.removeEventListener("mousewheel", this.mousewheelListenerEvent);
      el.removeEventListener("mouseover", this.mouseOverListenerEvent);
      el.removeEventListener("mouseleave", this.mouseLeaveListenerEvent);
    },
    mouseOverListenerEvent(e) {
      this.animateStatus = false;
    },
    mouseLeaveListenerEvent(e) {
      this.$nextTick(() => {
        this.animateStatus = true;
        this.animation(false);
      });
    },
    //鼠标滚动操作
    mousewheelListenerEvent(e) {
      this.animateStatus = false;
      this.scrollTop = this.scrollTop + e.deltaY;
      e.stopPropagation();
    },
    //停止滚动
    stopAnimation() {
      this.removeScrollerEvents();
      cancelAnimationFrame(this.animationHandler);
    },
    resetAnimation() {
      let el = this.getScrollerEl();
      if (el) {
        el.scrollTop = 0;
        this.scrollTop = 0;
      }
    },
    getLabelStyle(item, index) {
      let { layoutType, colorIsRelative, nameTextStyle } = this;
      let style = {
        margin: dsf.dataview.utils.transformArrayPx(nameTextStyle.margin),
        color: nameTextStyle.color,
        fontSize: dsf.dataview.utils.transformPx(nameTextStyle.fontSize),
        fontWeight: nameTextStyle.fontWeight,
        textDecoration: nameTextStyle.textDecoration,
        fontStyle: nameTextStyle.fontStyle,
        fontFamily: nameTextStyle.fontFamily,
        textAlign: nameTextStyle.hAlign,
      };
      if (layoutType === "hor") {
        style.width = dsf.dataview.utils.transformPx(nameTextStyle.width);
      }
      if (colorIsRelative) {
        dsf.mix(style, dsf.dataview.utils.getTextColor(this.colors[index] || _.last(this.colors)));
      }
      let ruleObj = this.handleUniversalRule(item, this.colorRuleList);
      if (ruleObj.text) {
        dsf.mix(style, ruleObj.text);
      }
      return style;
    },
    getValueStyle(item, index) {
      let { layoutType, colorIsRelative, valueTextStyle } = this;
      let style = {
        margin: dsf.dataview.utils.transformArrayPx(valueTextStyle.margin),
        color: valueTextStyle.color,
        fontSize: dsf.dataview.utils.transformPx(valueTextStyle.fontSize),
        fontWeight: valueTextStyle.fontWeight,
        textDecoration: valueTextStyle.textDecoration,
        fontStyle: valueTextStyle.fontStyle,
        fontFamily: valueTextStyle.fontFamily,
        textAlign: valueTextStyle.hAlign,
      };
      if (layoutType === "hor") {
        style.width = dsf.dataview.utils.transformPx(this.valueTextStyle.width);
      }
      if (colorIsRelative) {
        dsf.mix(style, dsf.dataview.utils.getTextColor(this.colors[index] || _.last(this.colors)));
      }
      let ruleObj = this.handleUniversalRule(item, this.colorRuleList);
      if (ruleObj.text) {
        dsf.mix(style, ruleObj.text);
      }
      return style;
    },
    getRuleColor(item, index) {
      let color = this.colors[index] || _.last(this.colors);
      let ruleObj = this.handleUniversalRule(item, this.colorRuleList);
      if (ruleObj.color) {
        color = ruleObj.color.color;
      }
      return color;
    },
    getIcons(index) {
      let icons = this.icons;
      let currentIcon = icons[index];
      let lastIcon = _.last(icons);
      currentIcon = currentIcon ? currentIcon : lastIcon;
      const iconClass = dsf.icons.getClassName(currentIcon);
      let select = new Array(3).fill(iconClass.fullName);
      return select;
    },
    getRelWidth() {
      setTimeout(() => {
        let el = this.$refs.iconRateItems;
        if (el) {
          let width = $(el).find(".icon-rate-base").width();
          let rateWidth = parseInt(this.iconSize) + 4;
          let max = Math.floor(width / rateWidth);
          if (max > 0) {
            this.max = max;
          }
          this.data = this.calcMaxShowRate(this.data);
        }
      });
    },

    /**
     * ai 大模型输出数据处理
     * @param {Array} describe 字段描述信息
     * @param {Array} data 数据
     */
    dataModelAnalysis({ describe, data }) {
      const dictionary = {};
      const keys = [];
      const mapRelations = this.mapRelations;
      describe.forEach(({ title, field }, index) => {
        dictionary[field] = title;
        // 使用第一个字段作位名称key
        if (index === 0) {
          mapRelations[0].map = field;
        }
        keys.push([field, title]);
      });
      try {
        const item = data[0];
        if (item) {
          // 构造数据字段
          for (let i = 1; i < keys.length; i++) {
            const key = keys[i][0];
            const title = keys[i][1];
            const value = dsf.dataview.utils.matchNumberAndSuffix(item[key]);
            if (value && value.number) {
              const unit = value.unit;
              data = data.map((it) => {
                const value = dsf.dataview.utils.matchNumberAndSuffix(it[key]);
                return {
                  ...it,
                  value: value.number,
                  unit: unit
                };
              });
              this.$emit("changeTitle", title);
              break;
            }
          }
          dictionary.value = "值";
          dictionary.unit = "单位";
        }
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
      if (!data.length) {
        this.hasData = false;
        return;
      }
      if (eval(this.dynamicRules) || this.dataType === "excel") {
        this.handleData(data);
      } else {
        if (this.$listeners["interceptOptions"]) {
          this.$dispatch("interceptOptions", { data: data, vm: this });
        } else {
          this.handleData(data);
        }
      }
    },
    handleData(data) {
      const flag = this.isDesign && this.dataType === "static";
      const mapRelations = this.mapRelations;
      const nameKey = flag ? "name" : mapRelations[0].map;
      const valueKey = flag ? "value" : mapRelations[1].map;
      const percentKey = flag ? "percent" : mapRelations[2]?.map || "percent";
      const unitKey = flag ? "unit" : mapRelations[3]?.map || "unit";

      // 是否自动计算
      const dealNumber = (value) => {
        return String(value).replace(/[^\d.-]/g, "") * 1;
      };

      const value = data.map((it) => dealNumber(it[valueKey]));
      const min = Math.min(...value) || 0;
      const minAbs = Math.abs(min);
      const max = Math.max(...value) || 0;
      const maxCount = max;

      let resData = data.map((it, index) => {
        let percent = it[percentKey];
        const value = it[valueKey];
        const name = it[nameKey];
        const unit = it[unitKey] || "";

        if (this.openAutoCalcRatio || percent === void 0) {
          percent = (dealNumber(value) / maxCount).toFixed(2) * 100;
        }

        return {
          ...it,
          keyId: dsf.uuid(8),
          name,
          value,
          percent,
          unit,
          color: this.calcColor(index),
        };
      });
      this.maxCount = maxCount;
      resData = this.calcMaxShowRate(resData);
      this.data = this.handleSort(this.sortInfo, resData);

      this.$nextTick(() => {
        this.getRelWidth();
        this.animation();
      });
    },
    calcMaxShowRate(data) {
      data.forEach((item) => {
        let showRate = this.maxCount ? _.round((this.max / this.maxCount) * item.value, 1) : 0;
        if (!this.openAutoCalcRatio) {
          showRate = dsf.isNumber(item.percent) ? _.round((this.max * item.percent) / 100, 1) : 0;
        }
        item.showRate = showRate;
      });
      return data;
    },
    handleSort(val, data) {
      let res = [];
      if (val === "default") {
        res = data;
      } else {
        res = _.orderBy(data, "value", val);
      }
      return res;
    },
    calcColor(dataIndex) {
      let length = this.colors.length;
      let index = dataIndex > length - 1 ? length - 1 : dataIndex;
      let color = this.colors[index];
      return [color, color, color];
    },
    itemClick(evt, item) {
      clearTimeout(this.clickTimer);
      this.clickTimer = setTimeout(() => {
        this.$dispatch("clickItem", item);
        this.loadClickEvents(item, evt);
      }, 300);
    },
    onResize() {
      this.$nextTick(() => {
        this.getRelWidth();
        this.animation();

        this.resizeCount.count++;
      });
    },
    //获取滚动元素
    getScrollerEl() {
      let el = this.$el.querySelector(".el-scrollbar__wrap");
      return el;
    },
    //动画属性
    animation(isFresh = true) {
      // 停止动画
      this.stopAnimation();
      if (isFresh) {
        //重置动画属性
        this.resetAnimation();
      }
      this.$nextTick(() => {
        let el = this.getScrollerEl();
        //开启滚动
        if (this.isScroll && el.scrollHeight > el.clientHeight) {
          //开启事件监听
          this.addScrollerEvents();
          //开启动画
          this.animateStatus = true;
          const _requestAnimationFrame = () => {
            cancelAnimationFrame(this.animationHandler);
            this.animationHandler = requestAnimationFrame(() => {
              let scrollHeight = el.scrollHeight;
              let scrollTop = this.scrollTop + Number(this.scrollSpeed);
              //20 是为了停留在底部久点
              if (scrollTop + el.clientHeight >= scrollHeight + 20) {
                this.resetAnimation();
              } else {
                el.scrollTop = scrollTop;
                this.scrollTop = scrollTop;
              }
              if (this.animateStatus && el.scrollHeight > el.clientHeight) {
                _requestAnimationFrame();
              }
            });
          };
          _requestAnimationFrame();
        }
      });
    },
  },
});
</script>
<style lang="scss">
@import "_dataview/assets/styles/share/components/iconRate.scss";
</style>
