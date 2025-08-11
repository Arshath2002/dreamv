<template>
  <div
    class="dsf-dv-text-roll ds-control dsf-dv-item-wrap data-view-no-padding"
    ref="text-roll"
    :style="controlStyle"
    v-loading="dataLoad"
    :element-loading-text="loadingText"
    :element-loading-spinner="loadingSpinner"
    :element-loading-background="loadingBackground"
  >
    <div class="text-roll-outer" @click="clickItem" @mouseover="mouseover" @mouseleave="mouseleave">
      <div :style="textRollItemStyle" class="scroll-item" v-html="contentHtml"></div>
    </div>
  </div>
</template>
<script>
const staticDataKeyDic = {
  text: "名称",
};
let staticData = [
  {
    text: "大屏可视化滚动文本演示",
  },
];
import { createCommonTextStyle } from "_dataview/output/config/commonConfig.js";
import dataAnalysis from "_dataview/mixins/dataAnalysis.js";
export default dsf.component({
  name: "DsfDataViewTextRoll",
  ctrlCaption: "滚动文本",
  mixins: [$mixins.dataView, dataAnalysis],
  props: {
    // 静态数据
    staticData: {
      type: Array,
      default: () => staticData,
    },
    height: {
      type: String,
      default: "auto",
    },
    titleTextStyle: {
      type: Object,
      default: () => createCommonTextStyle({ color: "#dcf0ff", fontSize: "16" }),
    },
    padding: {
      type: Array,
      default: () => [10, 10, 10, 10],
    },
    //文本字段规则
    fieldsStyleRules: {
      type: Array,
      default() {
        return [];
      },
    },
    textContent: {
      type: String,
      default: "@[text]",
    },
    // 是否开启动画
    isAnimate: {
      type: Boolean,
      default: true,
    },
    // 延迟滚动时间
    delayTime: {
      type: Number,
      default: 1000,
    },
    // 移动速度
    speed: {
      type: Number,
      default: 10,
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
      contentHtml: "",
      position: 0,
      isPause: false,
      lastTime: 0,
      delaySumTime: 0,
      animationId: null,
    };
  },
  computed: {
    textRollItemStyle() {
      const { titleTextStyle, eventCursorPointerStyle, position } = this;
      return {
        ...dsf.dataview.utils.transformTextStyle(titleTextStyle),
        ...eventCursorPointerStyle,
        transform: `translateX(-${position}%)`,
      };
    },
  },
  watch: {
    staticData() {
      this.init();
    },
    isAnimate() {
      this.startAnimate();
    },
    speed() {
      this.startAnimate();
    },
    delayTime() {
      this.startAnimate();
    },
    textContent() {
      this.init();
    },
    fieldsStyleRules: {
      handler() {
        this.init();
      },
    },
  },
  beforeDestroy() {
    this.animationId && cancelAnimationFrame(this.animationId);
  },
  methods: {
    // 复制组件样式
    copyComponentStyle() {
      return {
        _props: this.getComponentStyle(),
        // 固定为数组格式，按主、次顺序
        textStyles: [this.titleTextStyle],
      };
    },
    // 粘贴组件样式
    pasteComponentStyle(config) {
      let groups = this.$designer.attributesGroup.filter((it) => !/数据|属性|插槽/.test(it.name));
      groups = groups.filter((it) => /布局|边框设置|背景|入场动画/.test(it.name));
      const { textStyles = [] } = config;
      this.updateComponentStyle("titleTextStyle", textStyles[0]);
    },
    mouseleave(evt) {
      this.handleMouseLeave(this.data, evt);
      this.playAnimate();
    },
    mouseover(evt) {
      this.handleMouseEnter(this.data, evt);
      this.pauseAnimate();
    },
    dataAnalysis(data = []) {
      this.data = data;
      const item = data[0] || {};
      const res = {};
      const fieldsStyleRules = this.fieldsStyleRules;
      Object.keys(item).forEach((key) => {
        //找出匹配的样式规则
        const rules = fieldsStyleRules.filter((it) => it.valueName == key);
        const style = dsf.dataview.utils.calculateStyle(rules, item);

        if (style) {
          res[key] = `<span style='${style}'>${item[key]}</span>`;
        } else {
          res[key] = item[key];
        }
      });
      this.contentHtml = this.$replace(this.textContent, res);

      this.startAnimate();
    },
    clickItem(evt) {
      this.$dispatch("clickItem", this.data);
      this.loadClickEvents(this.data, evt);
    },
    resetAnimate() {
      this.animationId && cancelAnimationFrame(this.animationId);
      this.position = 0;
      this.lastTime = 0;
      this.delaySumTime = 0;
      this.animationId = null;
      this.isPause = false;
    },
    pauseAnimate() {
      this.isPause = true;
    },
    playAnimate() {
      if (!this.isAnimate) return false;
      this.isPause = false;
      this.lastTime = 0;
      this.animationId = requestAnimationFrame(this.animate);
    },
    startAnimate() {
      this.resetAnimate();
      if (!this.isAnimate) return false;
      this.animationId = requestAnimationFrame(this.animate);
    },
    animate(timestamp) {
      if (this.isPause) return false;
      if (!this.lastTime) this.lastTime = timestamp;
      const { speed, position } = this;
      // 延迟时间
      this.delaySumTime = this.delaySumTime + (timestamp - this.lastTime);
      // 计算时间差（秒）
      const deltaTimes = (timestamp - this.lastTime) / 1000;
      this.lastTime = timestamp;

      if (this.position == 0 && this.delaySumTime < this.delayTime) {
        this.animationId = requestAnimationFrame(this.animate);
        return false;
      }

      // 更新位置（保持在0-100范围内）
      this.position = position + speed * deltaTimes;
      if (this.position >= 100) {
        this.position = 0;
        this.delaySumTime = 0;
      }

      this.animationId = requestAnimationFrame(this.animate);
    },
  },
});
</script>
<style lang="scss">
@import "_dataview/assets/styles/share/components/DsfDataViewTextRoll.scss";
</style>
