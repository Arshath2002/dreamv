/*
 * @Description: 文本相关的伪代码
 * @Author: shenah
 * @Date: 2023-04-19 09:19:42
 * @LastEditors: shenah
 * @LastEditTime: 2025-01-21 15:45:13
 */
import { eventTemp } from "_dataview/output/utils/relativeEvent";
import { createCommonTextStyle } from "_dataview/output/config/commonConfig";
import mouseEvents from "./mouseEvents";
export default {
  mixins: [mouseEvents],
  props: {
    // 主标题
    title: {
      type: String,
      default: "xxxx标题",
    },
    // 主标题样式
    titleTextStyle: {
      type: Object,
      default: () => createCommonTextStyle(),
    },
    titleTextAlign: {
      type: Object,
      default() {
        return {
          vAlign: "middle",
          hAlign: "left",
        };
      },
    },
    titleMargin: {
      type: Array,
      default: () => [0, 0, 0, 0],
    },
    // 主标题边距
    titlePadding: {
      type: Array,
      default: () => [0, 0, 0, 0],
    },
    showSubTitle: {
      type: Boolean,
      default: false,
    },
    subTitle: {
      type: String,
      default: "",
    },
    // 副标题样式
    subTitleTextStyle: {
      type: Object,
      default: () => createCommonTextStyle(),
    },
    subTitlePadding: {
      type: Array,
      default: () => [0, 0, 0, 0],
    },
    //存在事件依赖
    hasEventRelative: {
      type: Boolean,
      default: true,
    },
    //事件依赖
    eventRelativeDeal: {
      type: Object,
      default() {
        return {
          mounted: {
            relatives: [],
            fn: eventTemp,
          },
          click: {
            relatives: [],
            fn: eventTemp,
          },
          // 鼠标移入事件
          mouseenter: {
            relatives: [],
            fn: eventTemp,
          },
          // 鼠标移出事件
          mouseleave: {
            relatives: [],
            fn: eventTemp,
          },
        };
      },
    },
  },
  data() {
    return {
      componentType: "text",
      textAlignMap: {
        top: "flex-start",
        middle: "center",
        bottom: "flex-end",
        left: "flex-start",
        right: "flex-end",
        center: "center",
        "flex-start": "flex-start",
        "flex-end": "flex-end",
      },
    };
  },
  computed: {
    mainTitleStyle() {
      let titleStyle = this.getTitleStyle(
        this.titleTextStyle,
        this.titlePadding
      );
      let style = {
        ...titleStyle,
        margin: dsf.dataview.utils.transformArrayPx(this.titleMargin),
      };
      if (dsf.dataview.utils.isCursorPointer([this.eventRelativeDeal.click])) {
        style["cursor"] = "pointer";
      }
      return style;
    },
    subTitleStyle() {
      return this.getTitleStyle(this.subTitleTextStyle, this.subTitlePadding);
    },
    analysisTitle(){
      return this.dataviewAnalysisSpecialVar(this.title);
    },
    analysisSubTitle(){
      return this.dataviewAnalysisSpecialVar(this.subTitle);
    }
  },
  created() {
    this.compatibleProp();
    this.downwardCompatible();
  },
  mounted() {
    this.$nextTick(() => {
      this.handleEventScope();
      //触发初始化完成
      this.loadMountedEvents();
    });
  },
  methods: {
    // 兼容之前
    compatibleProp() {
      let eventRelativeDeal = _.cloneDeep(this.eventRelativeDeal);
      if (!eventRelativeDeal.mounted) {
        eventRelativeDeal = dsf.mix(
          true,
          { mounted: { relatives: [], fn: eventTemp } },
          eventRelativeDeal
        );
      }
      this.$emit("update:eventRelativeDeal", eventRelativeDeal);
    },
    //标题点击事件
    clickItem(e, text) {
      this.$dispatch("clickItem", text);
      this.loadClickEvents(text, e);
    },
    //依赖组件关联方法
    loadClickEvents(data, e) {
      let { fn } = this.eventRelativeDeal.click;
      this.handleCommonEmit(fn, data, e);
    },
    //初始化事件
    loadMountedEvents() {
      if (this.isDesign) return false;
      try {
        let { mounted } = this.eventRelativeDeal;
        if (mounted && mounted.fn) {
          const fn = mounted.fn;
          this.handleCommonEmit(fn, null);
        }
      } catch (e) {
        console.error(e);
      }
    },
    setTitleEvent(str) {
      if (str) {
        this.$emit("update:title", str);
      }
      return this;
    },
    setSubTitleEvent(str) {
      if (str) {
        this.$emit("update:subTitle", str);
      }
      return this;
    },
    getTitleStyle(textStyle, padding) {
      const style = dsf.dataview.utils.transformTextStyle(textStyle);
      style.padding = dsf.dataview.utils.transformArrayPx(padding);

      return style;
    },
    // 向下兼容
    downwardCompatible() {
      if (this.$attrs.titleColor) {
        // isTextGradient titleGradient
        const titleStyle = createCommonTextStyle({
          color: this.$attrs.titleColor,
          fontFamily: this.$attrs.titleFontFamily,
          fontSize: this.$attrs.titleFontSize,
          fontWeight: this.$attrs.titleIsBold ? "bold" : "normal",
        });
        const titleAlign = {
          hAlign: this.$attrs.titleHAlign || "left",
          vAlign: "middle",
        };
        const subtitleStyle = createCommonTextStyle({
          colorObj: this.$attrs.subTitleColor,
          fontSize: this.$attrs.subTitleFontSize,
          fontWeight: this.$attrs.subTitleIsBold ? "bold" : "normal",
        });

        this.$emit("update:titleTextStyle", titleStyle);
        this.$emit("update:titleTextAlign", titleAlign);
        this.$emit("update:subTitleTextStyle", subtitleStyle);
      }
    },
  },
};
