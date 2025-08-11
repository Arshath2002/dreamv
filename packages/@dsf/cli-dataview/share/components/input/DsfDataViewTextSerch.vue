<template>
  <div
    class="dsf-dv-text-search data-view-item-wrap ds-control data-view-no-padding data-view-common-bg-effect"
    :class="[relationStyle ? 'data-view-select-theme' : 'not-relation']"
    :style="textSearchStyle"
  >
    <div :style="controlStyle" class="text-search-inner">
      <label
        class="name-left"
        v-if="nameTextStyle.isShow"
        :style="labelStyle"
      >
        {{ nameTextStyle.content }}
      </label>
      <el-autocomplete
        v-model="state"
        :fetch-suggestions="querySearch"
        :placeholder="placeholder"
        :trigger-on-focus="false"
        @select="searchText"
        @change="searchText"
        :style="getElAutoStyle"
        @focus="handleFocus"
        @blur="handleBlur"
        class="text-search"
      >
        <i
          v-if="iconPosition === 'before'"
          slot="prefix"
          class="el-icon-search el-input__icon search-icon-prefix-suffix"
          :style="getIconStyle"
          @click="handleClick"
        ></i>
        <template slot-scope="{ item }">
          <div class="name">{{ item.text }}</div>
        </template>
        <i
          slot="suffix"
          class="el-icon-search el-input__icon search-icon-prefix-suffix"
          :style="getIconStyle"
          @click="handleClick"
          v-if="iconPosition === 'after'"
        ></i>
      </el-autocomplete>
    </div>
  </div>
</template>
<script>
import { eventTemp } from "_dataview/output/utils/relativeEvent";
import { createCommonTextStyle } from "_dataview/output/config/commonConfig";
import defaultBackground from "_dataview/share/components/common/backgroundDefault.js";
export default dsf.component({
  name: "DsfDataViewTextSerch",
  ctrlCaption: "搜索框",
  mixins: [$mixins.dataView],
  props: {
    relationStyle: {
      type: Boolean,
      default: true,
    },
    //风格
    styleMapKey: {
      type: String,
      default: "dataviewTextSearch",
    },
    //存在事件依赖
    hasEventRelative: {
      type: Boolean,
      default: true,
    },
    contentTextStyle: {
      type: Object,
      default() {
        return createCommonTextStyle({
          fontSize: "16",
        });
      },
    },
    textAlign: {
      type: Object,
      default() {
        return {
          hAlign: "center",
        };
      },
    },
    //事件依赖
    eventRelativeDeal: {
      type: Object,
      default() {
        return {
          search: {
            relatives: [],
            fn: eventTemp,
          },
        };
      },
    },
    placeholder: {
      type: String,
      default: "请输入",
    },
    height: {
      type: String,
      default: "auto",
    },
    inputWidth: {
      type: String,
      default: "100%",
    },
    inputHeight: {
      type: String,
      default: "40px",
    },
    padding: {
      type: Array,
      default: () => [8, 6, 8, 6],
    },
    iconPosition: {
      type: String,
      default: "after",
    },
    iconColor: {
      type: String,
      default: "",
    },
    borderConfig: {
      type: Object,
      default: () => ({
        border: "1px solid #117bdd",
      }),
    },
    focusBorderColor: {
      type: String,
      default: "",
    },
    items: {
      type: Array,
      default() {
        return [];
      },
    },
    borderRadius: {
      type: Array,
      default: () => [0, 0, 0, 0],
    },
    contentBgColor: {
      type: String,
      default: "rgba(255,255,255,0)",
    },
    // 背景
    controlBackgroundConfig: {
      type: Object,
      default() {
        return defaultBackground;
      },
    },
    nameTextStyle: {
      type: Object,
      default: () => ({
        isShow: false,
        content: "名称：",
        fontSize: "16",
        fontFamily: "Microsoft Yahei",
        fontWeight: "normal",
        fontStyle: "normal",
        color: "#fff",
      }),
    },
  },
  data() {
    return {
      value: [],
      isFocus: false,
      restaurants: [],
      state: "",
      componentType: "search",
    };
  },
  mounted() {
    this.compatibleProp();
    this.$nextTick(() => {
      this.handleEventScope();
    });
    this.restaurants = this.items;
  },
  watch: {
    inputHeight: {
      handler(val) {
        if (typeof val === "string" && val.includes("%")) {
          this.$emit("update:height", "100%");
        } else {
          this.$emit("update:height", "auto");
        }
      },
      immediate: true,
    },
  },
  computed: {
    labelStyle() {
      return dsf.dataview.utils.transformTextStyle(this.nameTextStyle);
    },
    textSearchStyle() {
      let style = {
        ...this.getCommonEnterAnimateStyle,
        ...this.dvBackgroundFormat(this.controlBackgroundConfig, {
          isBgInfoVar: true,
        }),
        ...this.getBoxShadowConfig(true),
        ...this.marginAndPadding,
        height: dsf.dataview.utils.transformPx(this.height),
      };
      return style;
    },
    controlStyle() {
      let { textAlign, inputHeight, contentTextStyle } = this;
      contentTextStyle = dsf.dataview.utils.transformTextStyle(
        contentTextStyle
      );
      return {
        textAlign: textAlign.hAlign,
        height: dsf.dataview.utils.transformPx(inputHeight),
        ...contentTextStyle,
      };
    },
    getElAutoStyle() {
      let { borderRadius, relationStyle, isFocus, focusBorderColor } = this;
      const { styleThemeVariable } = this.$page;
      let customThemeStyle = relationStyle
        ? {}
        : { backgroundColor: this.contentBgColor };
      let style = {
        ...this.borderConfig,
        color: "inherit", // 继承 controlStyle
        width: dsf.dataview.utils.transformPx(this.inputWidth),
        ...customThemeStyle,
      };
      style.borderColor =
        isFocus && !relationStyle &&focusBorderColor
          ? focusBorderColor
          : (isFocus && styleThemeVariable["--dv-active-input-border-color"]) ||
            this.borderConfig.commonBorderColor;
      borderRadius = dsf.dataview.utils.transformArrayPx(borderRadius);
      style.borderRadius = relationStyle
        ? "var(--dv-input-border-radius)"
        : borderRadius;
      if (this.inputHeight.includes("%")) {
        style.height = "100%";
      }
      if(!relationStyle){
        style['--dv-active-input-border-color'] = focusBorderColor;
      }
      return style;
    },
    getIconStyle() {
      let style = {
        color: this.iconColor,
      };
      if (dsf.dataview.utils.isCursorPointer([this.eventRelativeDeal.search])) {
        style["cursor"] = "pointer";
      }
      return style;
    },
  },
  methods: {
    // 复制组件样式
    copyComponentStyle() {
      const _props = this.getComponentStyle();
      _props.height = this.inputHeight;
      _props.width = this.inputWidth;
      return {
        _props,
        // 固定为数组格式，按主、次顺序
        textStyles: [this.contentTextStyle],
        backgrounds: [this.controlBackgroundConfig],
      };
    },
    // 粘贴组件样式
    pasteComponentStyle(config) {
      let groups = this.$designer.attributesGroup.filter(
        (it) => !/数据|属性|插槽/.test(it.name)
      );
      if (config._props.ctrlName !== this.ctrlName) {
        groups = groups.filter((it) =>
          /布局|边框设置|背景|入场动画/.test(it.name)
        );
        const { textStyles = [], backgrounds = [], _props = {} } = config;
        this.updateComponentStyle("contentTextStyle", textStyles[0]);
        this.updateComponentStyle("inputHeight", _props.height);
        this.updateComponentStyle("inputWidth", _props.width);
        this.updateComponentStyle("controlBackgroundConfig", backgrounds[0]);
      }
      this.setComponentStyle(groups, config._props);
    },
    compatibleProp() {
      this.compatibleBorderProp();
      this.compatibleTextStyleProp();
    },
    compatibleTextStyleProp() {
      if (this.$attrs.color) {
        const contentTextStyle = createCommonTextStyle({
          color: this.$attrs.color,
          fontFamily: this.$attrs.fontFamily || "Microsoft Yahei",
          fontSize: this.$attrs.fontSize,
          fontWeight: this.$attrs.isBold ? "bold" : "normal",
        });
        const textAlign = {
          hAlign: this.$attrs.align || "left",
        };

        this.$emit("update:contentTextStyle", contentTextStyle);
        this.$emit("update:textAlign", textAlign);
      }
    },
    compatibleBorderProp() {
      let isShowBorder = this.$attrs.isborder;
      let borderWidth = "1";
      let isBorderSolid = "solid";
      let borderColor = this.$attrs.borderColor;
      if (isShowBorder) {
        let borderStyle = isBorderSolid ? "solid" : "dashed";
        this.$emit("update:borderConfig", {
          border: `${borderWidth}px ${borderStyle} ${borderColor}`,
        });
      }
    },
    querySearch(queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString
        ? restaurants.filter(this.createStateFilter(queryString))
        : restaurants;
      cb(results);
    },
    createStateFilter(queryString) {
      return (state) => {
        return (
          state.text.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      };
    },
    handleFocus() {
      this.isFocus = true;
    },
    handleClick() {
      if (!this.hasSearch && !this.isDesign) {
        this.searchText();
      }
    },
    handleBlur() {
      this.isFocus = false;
      if (!this.isDesign) {
        this.hasSearch = true;
        setTimeout(() => {
          this.hasSearch = false;
        },500);
      }
    },
    searchText() {
      //search依赖事件-----start
      if (!this.isDesign) {
        let data = this.state;
        this.loadChangeEvents(data);
      }
      //search依赖事件-----end
    },
    loadChangeEvents(data) {
      try {
        let { fn } = this.eventRelativeDeal.search;
        this.currentComponentData = data;
        this.handleCommonEmit(fn, data);
      } catch (e) {
        console.error(e);
      }
    },
  },
});
</script>
<style lang="scss">
@import "_dataview/assets/styles/share/components/textSearch.scss";
</style>
