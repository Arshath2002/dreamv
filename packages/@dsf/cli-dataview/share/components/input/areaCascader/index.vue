<!--
 * @Description: 行政区划级联
 * @Author: shenah
 * @Date: 2024-11-18 09:48:17
 * @LastEditors: shenah
 * @LastEditTime: 2025-02-14 14:10:14
-->

<template>
  <div
    class="data-view-area-cascader data-view-item-wrap ds-control data-view-no-padding data-view-common-bg-effect"
    :style="areaCascaderStyle"
    :class="[relationStyle ? 'data-view-select-theme' : 'not-relation']">
    <div class="inner-area-cascader data-view-common-bg-effect" :style="innerAreaCascaderStyle">
      <div class="area-label" v-if="isShowName" :style="areaLabelStyle">
        {{ nameContent }}
      </div>
      <DropdownWrapper
        :isDesign="isDesign"
        ref="dropdownWrapper"
        class="el-select-wrap"
        max-height="295px"
        height="295px"
        lazy
        :style="elSelectWrapStyle"
        @visible-change="visibleChange"
        :visibleArrow="false"
        :dropClass="['data-view-select-theme__popper', themeStyleName].join(' ')
        ">
        <template #default>
          <el-input-pro
            ref="reference"
            :value="selectedText"
            :placeholder="placeholder"
            :autocomplete="autocomplete"
            :validate-event="false"
            :class="{ 'is-focus': popperVisible }"
            @focus="handleFocus"
            @blur="handleBlur"
            @keydown.native.esc.stop.prevent="popperVisible = false"
            @keydown.native.tab="popperVisible = false"
            @mouseenter.native="inputHovering = true"
            @mouseleave.native="inputHovering = false"
            :title="selectedText"
            :style="elInputProStyle">
            <template slot="prefix" v-if="$slots.prefix">
              <slot name="prefix"></slot>
            </template>
            <template slot="suffix">
              <i
                v-if="inputHovering && showCloseCopy"
                class="el-select__caret el-input__icon el-icon-circle-close"
                @click.stop="handleClearClick"></i>
              <i
                v-show="!inputHovering || !showCloseCopy"
                :class="[
                  'el-select__caret',
                  'el-input__icon',
                  'el-icon-' + iconClass,
                ]"></i>
            </template>
          </el-input-pro>
        </template>
        <template #dropdown>
          <AreaCascaderPanel
            ref="panel"
            :accuracy="accuracy"
            :code-rule="codeRule"
            :super-code="realSuperCode"
            :area-version="areaVersion"
            :lazy-load-data="lazyLoadData"
            :check-strictly="checkStrictly"
            :show-super-select="showSuperSelect"
            :options-text-field="optionsTextField"
            :selected-text-field="selectedTextField"
            @hook:mounted="panelMounted"
            @change="handleChange" />
        </template>
      </DropdownWrapper>
    </div>
  </div>
</template>

<script>
const defaultCustomThemeStyle = {
  "--dv-select-dropdown-bg": "rgba(23,23,23,1)",
  "--dv-select-dropdown-border-radius": "10px 10px 10px 10px",
  "--dv-select-dropdown-text-color": "rgba(255,255,255,1)",
  "--dv-active-select-dropdown-bg": "rgba(255,255,255,0.1)",
  "--dv-active-multiple-dropdown-text-color": "rgba(236,189,99,1)",
  "--dv-select-dropdown-bg-box-shadow": "none",
  "--dv-select-dropdown-border-color": "rgba(255,255,255,0)",
  "--dv-select-dropdown-arrow-display": "none",
  "--dv-select-dropdown-scrollbar-color": "rgba(255,255,255,0)",
};
import { eventTemp } from "_dataview/output/utils/relativeEvent";
import { createCommonTextStyle } from "_dataview/output/config/commonConfig";
import { getValuesByLastValue } from "_dataview/output/config/areaCascaderConfig";
import AreaCascaderPanel from "./areaCascaderPanel.vue";
import DropdownWrapper from "./dropdownWrapper.vue";
import themeMixin from "_dataview/mixins/moreThemeMixin.js";
export default dsf.component({
  name: "DsfDataViewAreaCascader",
  ctrlCaption: "行政区划",
  mixins: [$mixins.dataView, themeMixin],
  props: {
    //风格对应组件key
    styleMapKey: {
      type: String,
      default: "areaCascader",
    },
    customThemeStyle: {
      type: Object,
      default: () => defaultCustomThemeStyle,
    },
    borderConfig: {
      type: Object,
      default: () => ({
        border: "1px solid #DCDFE6",
        commonBorderWidth: 1,
        commonBorderColor: "#DCDFE6",
        commonBorderStyle: "solid",
      }),
    },
    borderRadius: {
      type: Array,
      default() {
        return [0, 0, 0, 0];
      },
    },
    height: {
      type: String,
      default: "auto",
    },
    padding: {
      type: Array,
      default: () => [8, 6, 8, 6],
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
    align: {
      type: String,
      default: "center",
    },
    vAlign: {
      type: String,
      default: "flex-start",
    },
    isShowName: {
      type: Boolean,
      default: true,
    },
    nameContent: {
      type: String,
      default: "行政区划：",
    },
    nameTextStyle: {
      type: Object,
      default: () =>
        createCommonTextStyle({
          fontSize: "16",
        }),
    },
    selectWidth: {
      type: String,
      default: "200",
    },
    selectTextStyle: {
      type: Object,
      default: () => ({
        fontSize: "16",
        fontFamily: "Microsoft Yahei",
        fontWeight: "normal",
        fontStyle: "normal",
      }),
    },
    selectHeight: {
      type: String,
      default: "40",
    },
    placeholder: {
      type: String,
      default: "请选择",
    },
    // 顶部编码
    superCode: {
      type: String,
      default: "000000000000",
    },
    // 精确度，选择到第几级: 0-省、1-市、2-区县、3-街道、4-村居
    accuracy: {
      type: Number,
      default: 2,
    },
    autocomplete: {
      type: String,
      default: "off",
    },
    // 选项中显示的文本字段
    optionsTextField: {
      type: String,
      default: "name",
    },
    //选中时显示的值
    selectedTextField: {
      type: String,
      default: "dsfa_area_id",
    },
    // 输入框中是否显示选中值的完整路径
    showAllLevels: {
      type: Boolean,
      default: true,
    },
    // 是否可选择任意一级
    checkStrictly: {
      type: Boolean,
      default: false,
    },
    // 编码规则
    codeRule: {
      type: Object,
      default() {
        return {
          rootCode: "000000000000", // 根节点编码
          isFull: false, // 是否填充0
          inferCode: null, // 推导编码的方法，默认为空
        };
      },
    },
    isMakeupZero: {
      type: Boolean,
      default: true,
    },
    // 懒加载自定义方法, 参数（node, params, resolve）
    lazyLoadData: {
      type: Function,
      default: null,
    },
    // 是否显示父级选项
    showSuperSelect: {
      type: Boolean,
      default: false,
    },
    // 用户默认值
    userValue: {
      type: Object,
      default: null,
    },
    // 区划版本
    areaVersion: {
      type: [String, Number],
      required: false,
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
          //数据点击事件
          change: {
            relatives: [],
            fn: eventTemp,
          },
        };
      },
    },
  },
  components: {
    AreaCascaderPanel,
    DropdownWrapper,
  },
  data() {
    return {
      popperVisible: false,
      softFocus: false,
      inputHovering: false,
      valueCopy: {},
      componentType: "cascader",
    };
  },
  computed: {
    areaCascaderStyle() {
      return {
        width: dsf.dataview.utils.transformPx(this.width),
        height: dsf.dataview.utils.transformPx(this.height),
        ...this.marginAndPadding,
        ...this.dvBackgroundFormat(this.backgroundConfig, {
          isBgInfoVar: true,
        }),
        ...this.getBoxShadowConfig(true),
        ...this.getCommonEnterAnimateStyle,
      };
    },
    innerAreaCascaderStyle() {
      let style = {
        justifyContent: this.align,
      };
      return style;
    },
    areaLabelStyle() {
      const textStyle = dsf.dataview.utils.transformTextStyle(
        this.nameTextStyle
      );
      let style = {
        ...textStyle,
      };
      return style;
    },
    elSelectWrapStyle() {
      const selectTextStyle = dsf.dataview.utils.transformTextStyle(
        this.selectTextStyle
      );
      let style = {
        width: dsf.dataview.utils.transformPx(this.selectWidth),
        height: dsf.dataview.utils.transformPx(this.selectHeight),
        ...selectTextStyle,
      };
      if (!this.relationStyle) {
        style["--dv-input-text-color"] = this.selectTextStyle.color;
      }
      return style;
    },
    elInputProStyle() {
      let borderRadius = dsf.dataview.utils.transformArrayPx(this.borderRadius);
      let style = {
        "--dv-input-border-radius": borderRadius,
      };
      if (!this.relationStyle) {
        style["--dv-input-border-width"] =
          this.borderConfig.commonBorderWidth + "px";
        style["--dv-input-border-color"] = this.borderConfig.commonBorderColor;
        style["--dv-input-border-style"] = this.borderConfig.commonBorderStyle;
      }
      return style;
    },
    realSuperCode() {
      let code = this.superCode.trim();
      if (
        !/^([\d\w]+\.)*[\d\w]+$/.test(code) ||
        code == this.codeRule.rootCode
      ) {
        return this.codeRule.rootCode;
      }
      code = code.split(".");
      if (code.length == 1) {
        code = getValuesByLastValue(code[0], this.codeRule);
      }
      return code.join(".");
    },
    rangeStart() {
      let codes = this.realSuperCode.split(".");
      let r = codes.length - 1;
      if (r > 0 && this.showSuperSelect) {
        r--;
      }
      return r;
    },
    rangeEnd() {
      let r = this.accuracy;
      return r > 4 ? 4 : r;
    },
    iconClass() {
      return this.popperVisible ? "arrow-up is-reverse" : "arrow-up";
    },
    // 对value值得value逆向解析出所有的key
    // 用于数据复现
    ids() {
      if (!this.valueCopy?.value) {
        return [];
      }
      return getValuesByLastValue(this.valueCopy.value, this.codeRule);
    },
    selectedText() {
      let val = this.valueCopy;
      if (this.selectedTextField === "alias") {
        return val?.alias || val?.text || "";
      }
      return val?.text || "";
    },
    showCloseCopy() {
      return !!this.selectedText;
    },
  },
  watch: {
    selectHeight: {
      handler(val) {
        if (val.includes("%")) {
          this.$emit("update:height", "100%");
        } else {
          this.$emit("update:height", "auto");
        }
      },
      immediate: true,
    },
    rangeStart: {
      handler(to) {
        if (to > this.rangeEnd) {
          this.$emit("update:accuracy", to);
        }
      },
      immediate: true,
    },
    rangeEnd: {
      handler(to) {
        if (to < this.rangeStart) {
          this.$emit("update:accuracy", this.rangeStart);
        }
      },
      immediate: true,
    },
  },
  mounted() {
    this.initUserValue();
    this.$nextTick(() => {
      this.handleEventScope();
    });
  },
  methods: {
    // 复制组件样式
    copyComponentStyle() {
      return {
        _props: this.getComponentStyle(),
        // 固定为数组格式，按主、次顺序
        textStyles: [this.nameTextStyle, this.selectTextStyle],
        backgrounds: [this.backgroundConfig],
      };
    },
    // 粘贴组件样式
    pasteComponentStyle(config) {
      let groups = this.$designer.attributesGroup.filter(it => !/数据|属性|插槽/.test(it.name));
      if (config._props.ctrlName !== this.ctrlName) {
        groups = groups.filter(it => /布局|边框设置|背景|入场动画/.test(it.name));
        const { textStyles = [], backgrounds = [] } = config;
        this.updateComponentStyle("nameTextStyle", textStyles[0]);
        this.updateComponentStyle("selectTextStyle", textStyles[1]);
        this.updateComponentStyle("backgroundConfig", backgrounds[0]);
      }
      this.setComponentStyle(groups, config._props);
    },
    getValuesByLastValue,
    initUserValue() {
      if (this.isDesign) {
        return;
      }
      let obj = this.userValue && this.userValue.value ? this.userValue : this.getDefaultValue();
      this.valueCopy = obj;
      this.currentComponentData = obj;
    },
    getDefaultValue() {
      let res = {
        text: "",
        alias: "",
        value: "",
        allValue: [],
        allText: [],
        allAlias: [],
      };
      return res;
    },
    panelMounted() { },
    visibleChange(visible) {
      if (visible) {
        let { rangeStart: s, rangeEnd: e } = this;
        let val = _.slice(this.ids, +s + 1, +e + 2);
        let panel = this.$refs.panel;
        if (panel) {
          panel.setValue(val);
          panel.scrollIntoView();
        } else {
          //
        }
      }
      this.popperVisible = visible;
    },
    handleFocus(event) {
      if (!this.softFocus) {
        if (this.automaticDropdown || this.filterable) {
          this.popperVisible = true;
        }
        this.$dispatch("focus", event);
      } else {
        this.softFocus = false;
      }
    },
    handleBlur(event) {
      setTimeout(() => {
        this.$dispatch("blur", event);
      }, 50);
      this.softFocus = false;
    },
    handleClearClick() {
      let res = this.getDefaultValue();
      this.valueCopy = res;
      this.$nextTick(() => {
        this.currentComponentData = res;
        this.$dispatch("change", res);
        this.loadChangeEvents(res);
      });
    },
    handleChange({ nodes, values }) {
      let res = this.getDefaultValue();
      if (values.length > 0) {
        let text = [],
          alias = [];
        _.each(nodes, ({ data }) => {
          text.push(data.name);
          alias.push(data.alias);
        });
        res = {
          text: this.showAllLevels ? text.join("-") : _.last(text),
          alias: this.showAllLevels ? text.join("-") : _.last(alias),
          value: _.last(values),
          allValue: values,
          allText: text,
          allAlias: alias,
        };
      }
      if (this.selectedTextField === "dsfa_area_id" && !this.isMakeupZero) {
        if (this.accuracy <= 2) {
          // 证明是6位
          res.value = res.value.slice(0, 6);
        } else if (this.accuracy === 3) {
          res.value = res.value.slice(0, 9);
        } else {
          res.value = res.value.slice(0, 12);
        }
      }
      if (res.value !== this.valueCopy.value) {
        this.$refs.dropdownWrapper.toggleDropDownVisible(false);
        this.valueCopy = res;
        this.$nextTick(() => {
          this.currentComponentData = res;
          this.$dispatch("change", res);
          this.loadChangeEvents(res);
        });
      }
    },
    //加载依赖组件关联方法
    loadChangeEvents(data) {
      try {
        let { fn } = this.eventRelativeDeal.change;
        this.currentComponentData = data;
        this.handleCommonEmit(fn, data);
      } catch (e) {
        console.error(e);
      }
    },
    specialAddStyle() {
      let nowConfig = dsf.mix(
        true,
        {},
        defaultCustomThemeStyle,
        this.customThemeStyle
      );
      nowConfig[
        "--dv-select-dropdown-border-radius"
      ] = dsf.dataview.utils.transformArrayPx(
        nowConfig["--dv-select-dropdown-border-radius"]
      );
      // if (!this.popperAppendToBody) {
      //   this.styleList = dsf.mix(true, {}, this.styleList, nowConfig);
      // }
      this.addStyle(nowConfig);
    },
  },
});
</script>
<style lang="scss">
@import "_dataview/assets/styles/share/components/areaCascader.scss";
</style>
