<!--
 * @Description:数字翻牌器
 * 兼容 config.prefix与 config.suffix FixFontSize(前后缀字号) 保留因为很多地方都在使用
 * @Author: zhanghang
 * @Date: 2022-08-02 11:17:18
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-06-27 17:03:21
-->

<template>
  <div
    class="data-view-item-wrap ds-control dsf-dv-scroll-digital data-view-no-padding"
    :style="controlStyleWrap"
    @click="clickItem"
    @mouseenter="(e) => handleMouseEnter({ startVal, endVal }, e)"
    @mouseleave="(e) => handleMouseLeave({ startVal, endVal }, e)"
    v-loading="dataLoad"
    :element-loading-text="loadingText"
    :element-loading-spinner="loadingSpinner"
    :element-loading-background="loadingBackground"
    :ref="componentRef"
  >
    <div
      class="dsf-dv-scroll-digital-inner data-view-common-bg-effect"
      :style="controlInnerStyle"
    >
      <slot
        name="default"
        :prefix="config.prefix"
        :data="displayValue"
        :suffix="config.suffix"
        :row="nowData"
        style="position: relative"
      >
        <div
          v-if="isTotalDigital"
          class="split-digital-item split-digital-item-total"
          :style="splitDigitalItemStyle"
        >
          <div
            class="split-digital-inner-item data-view-common-bg-effect"
            :style="splitTotalDigitalInnerItemStyle"
          >
            <slot
              name="prefix"
              :info="prefixConfig"
              :row="nowData"
              :config="config"
              v-if="prefixConfig.defaultConfig.flag && nowData"
            >
              <PrefixSuffixThing
                class="digital-prefix-suffix"
                :belongDvComp="dvComp"
                :config="prefixConfig"
                :row="nowData"
                :analysisRuleToDataField="analysisRuleToDataField"
                :analysisKeyToDataField="analysisKeyToDataField"
              ></PrefixSuffixThing>
              &nbsp;
            </slot>
            <div
              class="split-digital-item-num"
              :style="totalDigitalItemNumStyle"
            >
              {{ displayValue }}
            </div>
            <slot
              name="suffix"
              :info="suffixConfig"
              :row="nowData"
              :config="config"
              v-if="suffixConfig.defaultConfig.flag && nowData"
            >
              &nbsp;
              <PrefixSuffixThing
                class="digital-prefix-suffix"
                :belongDvComp="dvComp"
                :config="suffixConfig"
                :row="nowData"
                :analysisRuleToDataField="analysisRuleToDataField"
                :analysisKeyToDataField="analysisKeyToDataField"
              ></PrefixSuffixThing>
            </slot>
          </div>
        </div>
        <div
          class="split-digital"
          :style="{ 'justify-content': textAlign.hAlign }"
          v-else
        >
          <slot
            name="prefix"
            :info="prefixConfig"
            :row="nowData"
            :config="config"
            v-if="prefixConfig.defaultConfig.flag && nowData"
          >
            <PrefixSuffixThing
              class="digital-prefix-suffix"
              :belongDvComp="dvComp"
              :config="prefixConfig"
              :row="nowData"
              :analysisRuleToDataField="analysisRuleToDataField"
              :analysisKeyToDataField="analysisKeyToDataField"
            ></PrefixSuffixThing>
          </slot>
          <div
            :style="splitDigitalItemStyle"
            class="split-digital-item"
            :class="{
              'split-digital-symbol': !isNumber(item),
            }"
            v-for="(item, index) in splitValue"
            :key="index"
          >
            <div
              class="split-digital-inner-item"
              :class="{
                'data-view-common-bg-effect': dsf.isNumber(item),
              }"
              :style="splitDigitalInnerItemStyle(item)"
            >
              <div
                class="split-digital-item-num"
                :style="splitDigitalItemNumStyle(item)"
              >
                {{ item }}
              </div>
            </div>
          </div>
          <slot
            name="suffix"
            :info="suffixConfig"
            :row="nowData"
            :config="config"
            v-if="suffixConfig.defaultConfig.flag && nowData"
          >
            <PrefixSuffixThing
              class="digital-prefix-suffix"
              :config="suffixConfig"
              :row="nowData"
              :belongDvComp="dvComp"
              :analysisRuleToDataField="analysisRuleToDataField"
              :analysisKeyToDataField="analysisKeyToDataField"
            ></PrefixSuffixThing>
          </slot>
        </div>
      </slot>
    </div>
  </div>
</template>
<script>
import {
  requestAnimationFrame,
  cancelAnimationFrame,
} from "./requestAnimationFrame.js";
import { createCommonTextStyle } from "_dataview/output/config/commonConfig";
import universalRuleMixin from "_dataview/mixins/universalRuleMixin";
import PrefixSuffixThing from "_dataview/share/components/data/common/prefixSuffixThing";
import { createPrefixSuffixConFig } from "_dataview/output/config/prefixSuffixConFig";
const staticDataKeyDic = {
  startVal: "起始值",
  endVal: "结束值",
};
const staticData = {
  startVal: "0",
  endVal: "5201314",
};
import dataAnalysis from "_dataview/mixins/dataAnalysis.js";
export default dsf.component({
  name: "DsfDataViewScrollDigital",
  ctrlCaption: "数字翻牌器",
  components: {
    PrefixSuffixThing,
  },
  mixins: [$mixins.dataView, dataAnalysis, universalRuleMixin],
  props: {
    controlBackgroundConfig: {
      type: Object,
      default: () => ({
        active: "color",
        color: {
          type: "color",
          image: "",
          isTheme: false,
          theme: "main",
          value: "transparent",
        },
      }),
    },
    padding: {
      type: Array,
      default: () => [0, 0, 0, 0],
    },
    //单独设置数字样式--设计器展示用
    isSimpleSet: {
      type: Boolean,
      default: true,
    },
    // 翻牌器样式
    digitalStyle: {
      type: Object,
      default: () =>
        createCommonTextStyle({
          // 数字的宽度
          numberWidth: "auto",
        }),
    },
    staticData: {
      type: Object,
      default: () => staticData,
    },
    config: {
      type: Object,
      default() {
        return {
          duration: 3000,
          autoplay: true,
          prefix: "",
          suffix: "",
          useEasing: true,
        };
      },
    },
    isCycle: {
      type: Boolean,
      default: false,
    },
    cycleSpaceTime: {
      type: Number,
      default: 3000,
    },
    fontSize: {
      type: [String, Number],
      default: 50,
    },
    prefixConfig: {
      type: Object,
      default: () => createPrefixSuffixConFig(),
    },
    suffixConfig: {
      type: Object,
      default: () => createPrefixSuffixConFig(),
    },
    //分割符号
    separator: {
      type: String,
      default: "",
    },
    separatorColor: {
      type: String,
      default: "",
    },
    //数字背景设置
    singleBackgroundConfig: {
      type: Object,
      default: () => ({
        active: "color",
        color: {
          type: "linear",
          image:
            "linear-gradient(177deg, rgb(29, 105, 201) 0%, rgb(62, 162, 230) 100%)",
          isTheme: false,
          theme: "main",
          value: "rgba(136, 71, 71, 1)",
        },
      }),
    },
    //前后缀字体大小
    FixFontSize: {
      type: [String, Number],
      default: 32,
    },
    //是否整体滚动
    isTotalDigital: {
      type: Boolean,
      default: false,
    },
    textAlign: {
      type: Object,
      default() {
        return {
          hAlign: "center",
        };
      },
    },
    fontMargin: {
      type: Array,
      default: () => [0, 10, 0, 0],
    },
    fontPadding: {
      type: Array,
      default: () => [10, 12, 10, 12],
    },
    height: {
      type: String,
      default: "auto",
    },
    excelData: {
      type: Array,
      default: () => {
        return dsf.dataview.utils.transformToExcelData(
          [staticData],
          staticDataKeyDic
        );
      },
    },
    mapRelations: {
      type: Array,
      default() {
        return [
          {
            text: "起始值",
            value: "startVal",
            map: "startVal",
            hideDigit: true,
          },
          {
            text: "结束值",
            value: "endVal",
            map: "endVal",
            hideDigit: true,
          },
        ];
      },
    },
  },
  data() {
    return {
      decimals: 0,
      nowData: null,
      otherEvents: ["刷新", "还原数据", "显示", "隐藏", "替换数据"],
      localStartVal: 0,
      displayValue: this.formatNumber(0),
      componentRef: "data-view-scroll-digital",
      startVal: 0,
      endVal: 0,
      printVal: null,
      paused: false,
      localDuration: this.config.duration,
      startTime: null,
      timestamp: null,
      remaining: null,
      rAF: null,
      isFinish: true,
      cycleTimer: null,
    };
  },
  computed: {
    controlStyleWrap() {
      let controlStyle = this.controlStyle;
      return {
        ...controlStyle,
        "background-image": "none",
        "background-color": "none",
        animation: "none",
        ...this.dvBackgroundFormat(this.controlBackgroundConfig, {
          isBgInfoVar: true,
        }),
        ...this.eventCursorPointerStyle,
        ...this.getCommonEnterAnimateStyle,
        ...this.getBoxShadowConfig(true),
      };
    },
    controlInnerStyle() {
      return {};
    },
    totalDigitalItemNumStyle() {
      const { color, numberWidth } = this.digitalStyle;
      let colorStyle = dsf.dataview.utils.getTextColor(color);
      const style = {
        ...colorStyle,
         padding:dsf.dataview.utils.transformArrayPx(this.fontPadding)
      };

      if (numberWidth) {
        style.width = dsf.dataview.utils.transformPx(numberWidth);
      }
      return style;
    },
    splitDigitalItemNumStyle() {
      return (item) => {
        const isNumber = dsf.isNumber(item);
        const { color, numberWidth } = this.digitalStyle;
        const colorStyle = dsf.dataview.utils.getTextColor(color);
        const separatorColor = dsf.dataview.utils.getTextColor(this.separatorColor);
        const style = {
          ...colorStyle,
          ...(numberWidth ? { width: dsf.dataview.utils.transformPx(numberWidth) } : {}),
          ...(isNumber ? {} : separatorColor),
        };
        return style;
      };
    },

    countDown() {
      let { startVal, endVal } = this;
      return startVal > endVal;
    },
    splitValue() {
      return (this.displayValue + "").split("");
    },
    splitDigitalItemStyle() {
      let { fontMargin, singleBackgroundConfig, digitalStyle } = this;

      const fontFamily = digitalStyle.fontFamily;
      const fontSize = dsf.dataview.utils.transformPx(digitalStyle.fontSize);

      let background =
        this.dvBackgroundFormat(singleBackgroundConfig, {
          isBgInfoVar: true,
        }) || {};

      let margin = dsf.dataview.utils.transformArrayPx(fontMargin);

      const style = {
        margin,
        ...background,
        ...digitalStyle,
        fontFamily,
        fontSize,
      };
      return style;
    },
    splitDigitalInnerItemStyle() {
      return (item) => {
        let style = {
          padding: dsf.isNumber(item)
            ? dsf.dataview.utils.transformArrayPx(this.fontPadding)
            : 0,
        };
        return style;
      };
    },
    splitTotalDigitalInnerItemStyle() {
      let style = {
        padding: 0,
        justifyContent: this.textAlign.hAlign,
      };
      return style;
    },
  },
  watch: {
    "config.autoplay"() {
      this.init();
    },
    "config.duration"() {
      this.init();
    },
    prefixConfig: {
      handler() {
        this.init();
      },
      deep: true,
    },
    suffixConfig: {
      handler() {
        this.init();
      },
      deep: true,
    },
    staticData: {
      handler(v, o) {
        if (!_.isEqual(v, o)) {
          this.init();
        }
      },
    },
    separator() {
      this.init();
    },
    mapRelations: {
      handler(v) {
        this.init();
      },
    },
    isCycle() {
      this.init();
    },
    cycleSpaceTime() {
      this.init();
    },
  },
  methods: {
    // 复制组件样式
    copyComponentStyle() {
      return {
        _props: this.getComponentStyle(),
        // 固定为数组格式，按主、次顺序
        textStyles: [this.digitalStyle],
        textAligns: [this.textAlign],
        backgrounds: [this.controlBackgroundConfig, this.singleBackgroundConfig],
      };
    },
    // 粘贴组件样式
    pasteComponentStyle(config) {
      let groups = this.$designer.attributesGroup.filter(it => !/数据|属性|插槽/.test(it.name));
      if (config._props.ctrlName !== this.ctrlName) {
        groups = groups.filter(it => /布局|边框设置|背景|入场动画/.test(it.name));
        const { textStyles = [], textAligns = [], backgrounds = [] } = config;
        this.updateComponentStyle("digitalStyle", textStyles[0]);
        this.updateComponentStyle("textAlign", textAligns[0]);
        this.updateComponentStyle("controlBackgroundConfig", backgrounds[0]);
        this.updateComponentStyle("singleBackgroundConfig", backgrounds[1]);
      }
      this.setComponentStyle(groups, config._props);
    },
    clickItem(evt) {
      this.loadClickEvents(
        {
          startVal: this.startVal,
          endVal: this.endVal,
        },
        evt
      );
    },
    dataAnalysis(data) {
      if (
        (this.dataType === "combineTable" || this.dataType === "datasource") &&
        !this.isDesign
      ) {
        if (!data.length) {
          this.hasData = false;
          return false;
        }
      } else {
        if (Array.isArray(data)) {
          if (!data.length) {
            this.hasData = false;
            return false;
          }
        } else {
          if (!data || data.endVal === undefined) {
            this.hasData = false;
            return false;
          }
        }
      }
      if (eval(this.dynamicRules) || this.dataType === "excel") {
        let startKey = this.mapRelations[0].map;
        let endKey = this.mapRelations[1].map;
        if (endKey && Array.isArray(data)) {
          this.nowData = data[0];
          this.startVal = data[0][startKey] || 0;
          this.endVal = data[0][endKey];
        }
      } else {
        if (!data.startVal) {
          data.startVal = 0;
        }
        this.nowData = data;
        let { startVal, endVal } = data;
        this.startVal = startVal;
        this.endVal = endVal;
      }

      let endVal = this.endVal;
      if (isNaN(Number(endVal))) {
        endVal = 0;
      }
      endVal = String(endVal);
      let val = endVal.split(".");
      let decimals = val[1] ? val[1].length : 0;
      this.decimals = decimals;

      if (this.config.autoplay) {
        this.handleStart();
      } else {
        this.displayValue = this.formatNumber(this.endVal);
      }
    },
    handleStart() {
      clearInterval(this.cycleTimer);
      if (this.isCycle) {
        this.cycleTimer = setInterval(() => {
          this.start();
        }, this.config.duration + this.cycleSpaceTime);
      }
      this.start();
    },
    changeDataRender(obj) {
      let flag = false;
      if (Array.isArray(obj)) {
        let startVal = obj[0];
        let endVal = obj[1];
        if (startVal && endVal) {
          this.startVal = startVal;
          this.endVal = endVal;
          flag = true;
        } else if (startVal && !endVal) {
          this.startVal = 0;
          this.endVal = startVal;
          flag = true;
        } else {
          flag = false;
        }
      } else if (obj && typeof obj === "object") {
        let startVal = obj.startVal;
        let endVal = obj.endVal;
        if (startVal && endVal) {
          this.startVal = startVal;
          this.endVal = endVal;
          flag = true;
        }
      } else if (!isNaN(obj)) {
        this.startVal = 0;
        this.endVal = obj;
        flag = true;
      }
      if (flag) {
        if (this.config.autoplay) {
          this.handleStart();
        } else {
          this.displayValue = this.formatNumber(this.endVal);
        }
      }
    },
    start() {
      this.isFinish = false;
      this.localStartVal = this.startVal;
      this.startTime = null;
      this.localDuration = this.config.duration;
      this.paused = false;
      this.rAF = requestAnimationFrame(this.count);
    },
    pauseResume() {
      if (this.paused) {
        this.resume();
        this.paused = false;
      } else {
        this.pause();
        this.paused = true;
      }
    },
    pause() {
      cancelAnimationFrame(this.rAF);
    },
    resume() {
      this.startTime = null;
      this.localDuration = +this.remaining;
      this.localStartVal = +this.printVal;
      requestAnimationFrame(this.count);
    },
    reset() {
      this.startTime = null;
      const { startVal } = this;
      cancelAnimationFrame(this.rAF);
      this.displayValue = this.formatNumber(startVal);
    },
    count(timestamp) {
      let { endVal } = this;

      if (!this.startTime) this.startTime = timestamp;
      this.timestamp = timestamp;
      const progress = timestamp - this.startTime;
      this.remaining = this.localDuration - progress;

      if (this.countDown) {
        const printVal =
          this.localStartVal -
          (this.localStartVal - endVal) * (progress / this.localDuration);
        this.printVal = printVal < endVal ? endVal : printVal;
      } else {
        const printVal =
          this.localStartVal +
          (endVal - this.localStartVal) * (progress / this.localDuration);
        this.printVal = printVal > endVal ? endVal : printVal;
      }

      if (progress < this.localDuration) {
        this.rAF = requestAnimationFrame(this.count);
      } else {
        this.isFinish = true;
        this.$emit("callback");
      }
      this.displayValue = this.formatNumber(this.printVal);
    },
    isNumber(val) {
      return !isNaN(parseFloat(val));
    },
    formatNumber(num) {
      let { separator, decimals } = this;

      if (isNaN(Number(num))) {
        num = 0;
      }
      num = Number(num).toFixed(decimals);
      num += "";
      const x = num.split(".");
      let x1 = x[0];
      const x2 = x.length > 1 ? "." + x[1] : "";
      const rgx = /(\d+)(\d{3})/;
      if (separator && !this.isNumber(separator)) {
        while (rgx.test(x1)) {
          x1 = x1.replace(rgx, "$1" + separator + "$2");
        }
      }
      return x1 + x2;
    },
  },
  destroyed() {
    clearInterval(this.cycleTimer);
    cancelAnimationFrame(this.rAF);
  },
});
</script>
<style lang="scss">
 @import "_dataview/assets/styles/share/components/DsfDataViewScrollDigital.scss";
</style>
