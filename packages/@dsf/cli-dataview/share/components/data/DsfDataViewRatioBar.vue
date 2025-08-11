<template>
  <div
    class="dsf-dv-ratio-bar ds-control data-view-item-wrap data-view-no-padding"
    ref="ratio-bar"
    :style="ratioBarStyle"
    v-loading="dataLoad"
    :element-loading-text="loadingText"
    :element-loading-spinner="loadingSpinner"
    :element-loading-background="loadingBackground"
  >
    <dsf-empty-data v-if="!hasData"></dsf-empty-data>
    <div
      class="ratio-bar-box data-view-common-bg-effect"
      v-else
    >
      <div class="ratio-bar-content">
        <div class="ratio-bar-title">
          <div
            class="title-item"
            v-for="(item, index) in data"
            @mouseenter="(e) => handleMouseEnter(item, e)"
            @mouseleave="(e) => handleMouseLeave(item, e)"
            @click="clickItem($event, item,'title')"
            :key="index"
            :style="titleStyle"
          >
            <span v-html="getContent(item)"></span>
          </div>
        </div>
        <div class="ratio-bar-bar">
          <div
            class="bar-item"
            v-for="(item, index) in data"
            @mouseenter="(e) => handleMouseEnter(item, e)"
            @mouseleave="(e) => handleMouseLeave(item, e)"
            @click="clickItem($event, item,'bar')"
            :ref="'barItem'"
            :key="index"
            :style="getBarStyle(item, index)"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
const staticDataKeyDic = {
  name: "名称",
  value: "值",
};
let staticData = [
  {
    name: "省内比例",
    value: 60,
  },
  {
    name: "省外比例",
    value: 40,
  },
];
import { createCommonTextStyle } from "_dataview/output/config/commonConfig.js";
import dataAnalysis from "_dataview/mixins/dataAnalysis.js";
import createBackground from "_dataview/output/config/backgroundExtend.js";
export default dsf.component({
  name: "DsfDataViewRatioBar",
  ctrlCaption: "占比条",
  mixins: [$mixins.dataView, dataAnalysis],
  props: {
    //风格对应组件key
    styleMapKey: {
      type: String,
      default: "dataviewRatioBar",
    },
    // 静态数据
    staticData: {
      type: Array,
      default: () => staticData,
    },
    height: {
      type: String,
      default: "auto",
    },
    padding: {
      type: Array,
      default: () => [10, 25, 10, 25],
    },
    titleTextStyle: {
      type: Object,
      default: () => createCommonTextStyle({ color: "#dcf0ff", fontSize: "14" }),
    },
    richTextContent: {
      type: String,
      default: '<label contenteditable="false" class="tag" real-value="name">name</label>  <label contenteditable="false" class="tag" real-value="value">value</label>%',
    },
     backgroundConfig: {
      type: Object,
      default: () => createBackground(),
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
            digit: 0,
            keepZero: true,
          },
        ];
      },
    },
    barMargin: {
      type: Array,
      default: () => [5, 5, 5, 0],
    },
    // 占比颜色设置
    barBackgroundColorList: {
      type: Array,
      default() {
        return ["#2A76FB", "#37D7BB"];
      },
    },
    // 占比高度
    barHeight: {
      type: String,
      default: "12",
    },
    // 数值显示类型
    valueShowType: {
      type: String,
      default: "percent",
    },
    fieldsStyleRules: {
      type: Array,
      default() {
        return [
          {
            valueName: "value",
            rule: "none",
            threshold: "",
            style: {
              fontFamily: "Microsoft Yahei",
              fontSize: "20px",
              color: "rgba(65, 223, 125, 1)",
              fontStyle: "normal",
              fontWeight: "bold",
            },
          },
        ];
      },
    },
    //表格数据默认
    excelData: {
      type: Array,
      default: () => {
        return dsf.dataview.utils.transformToExcelData(staticData, staticDataKeyDic);
      },
    },
  },
  data() {
    return {
      data: [],
      setTimeoutFn: {
        animat: null,
      },
    };
  },
  computed: {
    titleStyle() {
      let style = {
        ...dsf.dataview.utils.transformTextStyle(this.titleTextStyle),
        ...this.eventCursorPointerStyle
      };
      return style;
    },
    ratioBarStyle() {
      return {
        ...this.controlStyle,
        ...this.dvBackgroundFormat(this.backgroundConfig, {
          isBgInfoVar: true,
        }),
        ...this.getCommonEnterAnimateStyle,
        ...this.getBoxShadowConfig(true),
      };
    },
  },
  watch: {
    staticData() {
      this.init();
    },
  },
  beforeDestroy() {
    this.clearTimeoutFn();
  },
  methods: {
    // 复制组件样式
    copyComponentStyle() {
      return {
        _props: this.getComponentStyle(),
        // 固定为数组格式，按主、次顺序
        textStyles: [this.titleTextStyle],
        backgrounds: [this.backgroundConfig],
      };
    },
    // 粘贴组件样式
    pasteComponentStyle(config) {
      let groups = this.$designer.attributesGroup.filter(it => !/数据|属性|插槽/.test(it.name));
      if (config._props.ctrlName !== this.ctrlName) {
        groups = groups.filter(it => /布局|背景|边框设置|入场动画/.test(it.name));
        const { textStyles = [], backgrounds = [] } = config;
        this.updateComponentStyle("titleTextStyle", textStyles[0]);
        this.updateComponentStyle("backgroundConfig", backgrounds[0]);
      }
      this.setComponentStyle(groups, config._props);
    },
    dataAnalysis(data) {
      if (!data.length) {
        this.hasData = false;
        return false;
      }
      let $data = data;
      if (eval(this.dynamicRules)) {
        let namekey = this.mapRelations[0].map;
        let valuekey = this.mapRelations[1].map;
        $data = data.map((it) => {
          return {
            name: it[namekey],
            value: it[valuekey],
          };
        });
      }
      // 计算比例
      let sum = $data.reduce(function (prev, cur) {
        return cur.value * 1 + prev * 1;
      }, 0);
      this.data = $data.map((it) => {
        return {
          ...it,
          percent: (it.value * 100) / sum,
        };
      });
      // 处理总比例不满100
      let percentSum = this.data.reduce(function (pre, curr) {
        return curr.percent + pre;
      }, 0);
      this.data[0].percent = 100 - (percentSum - this.data[0].percent);
      this.animat();
    },
    clickItem(evt, item, type) {
      item.clickType = type;
      this.$dispatch("clickItem", item);
      this.loadClickEvents(item, evt);
    },
    getBarStyle(item, index) {
      let { barMargin, barBackgroundColorList, barHeight } = this;
      let style = {
        margin: barMargin.join("px ") + "px",
        // width: `${item.percent}%`,
        height: dsf.dataview.utils.transformPx(barHeight),
        backgroundColor: barBackgroundColorList[index] || "#dddddd",
        ...this.eventCursorPointerStyle
      };
      return style;
    },
    animat() {
      this.$nextTick(() => {
        this.setTimeoutFn.animat = setTimeout(() => {
          let domBarItem = this.$refs.barItem;
          _.each(domBarItem, (item, index) => {
            item.style.width = this.data[index].percent + "%";
          });
        }, 0);
      });
    },
    clearTimeoutFn() {
      for (let key in this.setTimeoutFn) {
        clearTimeout(this.setTimeoutFn[key]);
      }
    },
    getContent(item) {
      if (dsf.isObject(item)) {
        let digit = 0;
        let keepZero = true;
        let obj = _.cloneDeep(item);
        this.mapRelations.forEach((item) => {
          if (item.digit && item.keepZero) {
            digit = item.digit;
            keepZero = item.keepZero;
          }
        });
        if (this.valueShowType === "percent") {
          obj.value = obj.percent;
        }
        obj.value = dsf.dataview.utils.handleDecimal(obj.value, digit, keepZero);
        var html = dsf.dataview.utils.analyzeToolTipHTMLAttr(this.richTextContent, obj, "textBox", [], this.fieldsStyleRules);
        return html;
      } else {
        return "";
      }
    },
  },
});
</script>
<style lang="scss">
 @import "_dataview/assets/styles/share/components/DsfDataViewRatioBar.scss";
</style>
