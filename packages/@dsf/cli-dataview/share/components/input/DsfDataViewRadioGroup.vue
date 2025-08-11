<!--
 * @Description: 
 * @Author: zhanghang
 * @Date: 2023-04-11 14:18:13
 * @LastEditors: shenah
 * @LastEditTime: 2025-03-18 13:53:35
-->
<!--  单选组  -->
<template>
  <div
    class="dsf-dv-container-radiogroup ds-control data-view-item-wrap data-view-no-padding data-view-common-bg-effect"
    :style="controlOuterStyle"
  >
    <div :style="getRadioVariable" v-if="typeSwitch == 1">
      <div v-if="!multiple" class="v-radios-content radios-content" ref="radioBox">
        <label
          class="name-left"
          v-if="nameTextStyle.isShow"
          :style="labelStyle"
        >
          {{ nameTextStyle.content }}
        </label>
        <el-radio-group :class="{ 'radio-box': barType == 2 }" v-model="value" @change="changeItem">
          <el-radio v-for="(it, index) in dataItems" :key="index" :label="it.value">
            <span :style="value == it.value ? selectFontStyle : fontStyle">
              {{ it.text }}
            </span>
          </el-radio>
        </el-radio-group>
      </div>
      <div v-else class="v-radios-content radios-content" ref="radioBox">
        <label
          class="name-left"
          v-if="nameTextStyle.isShow"
          :style="labelStyle"
        >
          {{ nameTextStyle.content }}
        </label>
        <el-checkbox-group :class="{ 'radio-box': barType == 2 }" v-model="value" @change="changeItem">
          <el-checkbox v-for="(it, index) in dataItems" :key="index" :label="it.value">
            <span :style="getCheckBoxTextStyle(it)">{{ it.text }}</span>
          </el-checkbox>
        </el-checkbox-group>
      </div>
    </div>
    <div v-else :class="['radios-content', 'type-switch' + typeSwitch]" ref="radioBox" :style="hRadiosContentStyle">
      <div v-for="(it, index) in dataItems" :key="index" class="radio" :style="[radios2ItemStyle, value.indexOf(it.value) != -1 && radios2ItemActiveStyle]" @click="handleClick(it)">
        {{ it.text }}
      </div>
    </div>
  </div>
</template>
<script>
import mixins from "./mixins";
import { createCommonTextStyle } from "_dataview/output/config/commonConfig";
import defaultBackground from "_dataview/share/components/common/backgroundDefault.js";
export default dsf.component({
  name: "DsfDataViewRadioGroup",
  ctrlCaption: "单选组",
  mixins: [$mixins.dataView, mixins],
  props: {
    //风格
    styleMapKey: {
      type: String,
      default: "dataviewRadioGroup",
    },
    padding: {
      type: Array,
      default: () => [8, 6, 8, 6],
    },
    textStyle: {
      type: Object,
      default: () =>
        createCommonTextStyle({
          fontSize: "16",
        }),
    },
    //无实际意义,仅控制设计器属性
    designSwitch: {
      type: String,
      default: "1",
    },
    //默认边框色
    borderColor: {
      type: String,
      default: "#DCDFE6",
    },
    //默认背景色
    bgColor: {
      type: String,
      default: "#FFF",
    },
    borderActColor: {
      type: String,
      default: "#409EFF",
    },

    bgActColor: {
      type: String,
      default: "#035293",
    },

    barType: {
      type: String,
      default: "1",
    },
    textActColor: {
      type: String,
      default: "#00BAFF",
    },
    textColor: {
      type: String,
      default: "#ddd",
    },
    height: {
      type: String,
      default: "auto",
    },
    inputHeight: {
      type: String,
      default: "40",
    },
    // 默认值
    defaultValue: {
      type: [String, Number],
      default: "",
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    // 类型切换:块级 start
    typeSwitch: {
      type: String,
      default: "1",
    },
    itemRadius: {
      type: Array,
      default: () => [0, 0, 0, 0],
    },
    itemMargin: {
      type: Array,
      default: () => [0, 0, 0, 0],
    },
    itemPadding: {
      type: Array,
      default: () => [2, 5, 2, 5],
    },
    itemWidth: {
      type: String,
      default: "auto",
    },
    defaultBackgroundConfig: {
      type: Object,
      default() {
        return { ...defaultBackground };
      },
    },
    clickBackgroundConfig: {
      type: Object,
      default() {
        return { ...defaultBackground };
      },
    },
    // 整体背景
    controlBackgroundConfig: {
      type: Object,
      default() {
        return { ...defaultBackground };
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
    }
  },
  computed: {
    labelStyle() {
      return dsf.dataview.utils.transformTextStyle(this.nameTextStyle);
    },
    //选择框模式的颜色变量
    getRadioVariable() {
      let { borderColor, bgColor, borderActColor, bgActColor,inputHeight } = this;
      return {
        "--dv-comp-default-border-color": borderColor,
        "--dv-comp-default-background-color": bgColor,
        "--dv-comp-ac-border-color": borderActColor,
        "--dv-comp-ac-background-color": bgActColor,
        height: dsf.dataview.utils.transformPx(inputHeight),
      };
    },
    hRadiosContentStyle(){
      return {
        height: dsf.dataview.utils.transformPx(this.inputHeight),
      };
    },
    fontStyle() {
      return dsf.dataview.utils.transformTextStyle(this.textStyle);
    },
    selectFontStyle() {
      let textStyle = dsf.mix(true, {}, this.textStyle);
      textStyle.color = this.textActColor;
      return dsf.dataview.utils.transformTextStyle(textStyle);
    },
    radios2ItemStyle() {
      let { itemPadding, itemMargin, textStyle, itemWidth, itemRadius, defaultBackgroundConfig } = this;
      let backgroundObj = this.dvBackgroundFormat(defaultBackgroundConfig) || {};
      textStyle = dsf.dataview.utils.transformTextStyle(textStyle);
      return {
        ...textStyle,
        padding: dsf.dataview.utils.transformArrayPx(itemPadding),
        margin: dsf.dataview.utils.transformArrayPx(itemMargin),
        borderRadius: dsf.dataview.utils.transformArrayPx(itemRadius),
        width: itemWidth == "auto" ? "auto" : dsf.dataview.utils.transformPx(itemWidth),
        ...backgroundObj,
      };
    },
    radios2ItemActiveStyle() {
      let backgroundObj = this.dvBackgroundFormat(this.clickBackgroundConfig) || {};
      let textStyle = dsf.mix(true, {}, this.textStyle);
      textStyle.color = this.textActColor;
      textStyle = dsf.dataview.utils.transformTextStyle(textStyle);
      return {
        ...textStyle,
        ...backgroundObj,
      };
    },
  },
  data() {
    return {
      value: "",
      getValue: [],
    };
  },
  created() {
    this.initData();
    //向下兼容
    this.downwardCompatible();
  },
  mounted() {
    //加载完成依赖事件-----start
    let defaultValue = this.defaultValue;
    if (this.multiple) {
      defaultValue = this.defaultValue.split(",");
    }
    this.value = defaultValue;
    if (!this.isDesign) {
      let data = Array.isArray(this.value) ? this.value : [this.value];
      this.$nextTick(() => {
        this.loadCompleteEvents(data);
      });
    }
    //加载完成依赖事件-----end
  },
  methods: {
    // 复制组件样式
    copyComponentStyle() {
      return {
        _props: this.getComponentStyle(),
        // 固定为数组格式，按主、次顺序
        textStyles: [this.textStyle],
        backgrounds: [this.controlBackgroundConfig],
      };
    },
    // 粘贴组件样式
    pasteComponentStyle(config) {
      let groups = this.$designer.attributesGroup.filter(it => !/数据|属性|插槽/.test(it.name));
      if (config._props.ctrlName !== this.ctrlName) {
        groups = groups.filter(it => /布局|边框设置|背景|入场动画/.test(it.name));
        const { textStyles = [], backgrounds = [] } = config;
        this.updateComponentStyle("textStyle", textStyles[0]);
        this.updateComponentStyle("controlBackgroundConfig", backgrounds[0]);
      }
      this.setComponentStyle(groups, config._props);
    },
    downwardCompatible() {
      if (this.$attrs.textColor) {
        const textStyle = createCommonTextStyle({
          color: this.$attrs.titleColor,
          fontSize: this.fontSize,
        });
        this.$emit("update:textStyle", textStyle);
      }
    },
    getCheckBoxTextStyle(it) {
      let flag = this.value?.indexOf(it.value) > -1;
      if (flag) {
        return this.selectFontStyle;
      }
      return this.fontStyle;
    },
    handleClick(item) {
      this.$dispatch("clickItem", item);
      if (this.multiple) {
        let index = this.value?.indexOf(item.value);
        if (index >= 0) {
          let $value = _.remove(this.value, (it, i) => {
            return i != index;
          });
          this.value = $value;
        } else {
          this.value?.push(item.value);
        }
      } else {
        this.value = item.value;
      }
      this.changeItem(item.value);
    },
    handleGetValue() {
      return this.getValue;
    },
    handleGetValueName() {
      let getValue = this.handleGetValue();
      let arr = [];
      this.dataItems.forEach((item) => {
        const val = item.value;
        if (getValue.includes(val)) {
          arr.push(item.text);
        }
      });
      return arr;
    },
  },
});
</script>
<style lang="scss">
@import "_dataview/assets/styles/share/components/radiogroup.scss";
</style>
