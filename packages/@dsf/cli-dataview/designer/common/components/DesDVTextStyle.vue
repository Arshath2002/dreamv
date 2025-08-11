<!--
 * @Description: 文字属性
 * @Author: shenah
 * @Date: 2024-02-26 14:17:29
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-02-13 18:02:25
-->

<template>
  <div class="ds-text-style">
    <!-- 图标列表 -->
    <div class="text-more-icon">
      <DsfWordColor v-model="currentData[currentConfig.colorStringField]" @change="colorChange" v-bind="config.picker" v-if="currentConfig.isShowColor"></DsfWordColor>
      <!-- 加粗 -->
      <DsfIcon
        title="字体加粗"
        v-if="currentConfig.isShowFontWeight"
        class="common-item"
        name="bold"
        :class="getActiveClass(currentConfig.fontWeightField)"
        @click="changeValue(currentConfig.fontWeightField)"
      ></DsfIcon>
      <!-- 斜体 -->
      <DsfIcon
        title="字体斜体"
        v-if="currentConfig.isShowItalics"
        class="common-item"
        name="jurassic_font-tilt"
        :class="getActiveClass(currentConfig.fontStyleField)"
        @click="changeValue(currentConfig.fontStyleField)"
      ></DsfIcon>
      <!-- 下划线 -->
      <DsfIcon
        v-if="currentConfig.isShowUnderline"
        title="字体下划线"
        class="common-item"
        name="Underline"
        :class="getActiveClass(currentConfig.textDecorationField)"
        @click="changeValue(currentConfig.textDecorationField)"
      ></DsfIcon>
      <svg
        style="margin-left: 5px; cursor: pointer"
        :class="{ 'active-icon': currentData[currentConfig.textShadowField] }"
        @click="selectShadowValue()"
        v-if="currentConfig.isShowShadow"
        width="16px"
        height="16px"
        viewBox="0 0 16 16"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
      >
        <title>字体阴影</title>
        <g id="页面-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
          <g id="字体阴影" fill="#9BA3AF">
            <rect id="矩形" x="0" y="0" width="12" height="2"></rect>
            <polygon id="矩形" points="5 2 7 2 7 14 5 14"></polygon>
            <polygon id="路径-11" opacity="0.3" points="7 0 12 0 16 4.64274818 16 16 11.5 16 7 14"></polygon>
          </g>
        </g>
      </svg>
    </div>
    <!-- 阴影设置 -->
    <div class="shadow-wrap" v-if="currentConfig.isShowShadow && currentData[currentConfig.textShadowField]">
      <span class="property-item-name">阴影设置：</span>
      <div class="shadow-offset">
        <DsfWordColor v-model="shadowColor" @change="shadowColorChange" type="color"></DsfWordColor>
        <span>X：</span>
        <DesDVNumber class="min" :config="{ unit: 'px' }" :value="shadowOffsetX | valueFilter" @change="changeShadowValue($event + 'px', 'shadowOffsetX')" />
        <span>Y：</span>
        <DesDVNumber class="min" :config="{ unit: 'px' }" :value="shadowOffsetY | valueFilter" @change="changeShadowValue($event + 'px', 'shadowOffsetY')" />
      </div>
      <div class="shadow-blur">
        <span style="flex-shrink: 0">模糊半径：</span>
        <el-input-number :max="20" :min="0" :value="shadowBlur | valueFilter" @change="changeShadowBlurValue" :precision="0" :controls="false" style="width: 40px; margin-right: 6px"></el-input-number>
        <el-slider :max="20" :value="shadowBlur | valueFilter" @input="changeShadowBlurValue"></el-slider>
      </div>
    </div>
    <!-- 字体,字号选择 -->
    <div class="font-wrap" :style="fontWrapStyle">
      <el-select size="small" v-model="currentData[currentConfig.fontFamilyField]" v-if="currentConfig.isShowFontFamily" @change="(val) => generalChange(val, currentConfig.fontFamilyField)">
        <el-option v-for="item in fonts" :key="item.value" :value="item.value" :label="item.text"></el-option>
      </el-select>
      <el-input
        v-if="currentConfig.isShowFontSize"
        placeholder="字号"
        v-model="currentData[currentConfig.fontSizeField]"
        class="font-size-input"
        size="small"
        @change="(val) => generalChange(val, currentConfig.fontSizeField)"
      />
    </div>
  </div>
</template>
<script>
import DsfWordColor from "./dsfWordColor.vue";
import propertyMixin from "./propertyMixin";
export default {
  name: "DesDVTextStyle",
  components: { DsfWordColor },
  mixins: [propertyMixin],
  model: {
    prop: "value",
    event: "change",
  },
  props: {
    value: {
      type: Object,
    },
  },
  filters: {
    valueFilter(val) {
      return +(val + "").replace(/px/g, "");
    },
  },
  data() {
    return {
      defaultConfig: {
        isShowColor: true,
        isShowFontWeight: true,
        isShowItalics: true,
        isShowUnderline: true,
        isShowFontFamily: true,
        isShowFontSize: true,
        isShowShadow: true,
        isMarginTop: true,
        colorStringField: "color",
        colorObjField: "colorObj",
        fontSizeField: "fontSize",
        fontWeightField: "fontWeight",
        fontStyleField: "fontStyle",
        textDecorationField: "textDecoration",
        textShadowField: "textShadow",
        fontFamilyField: "fontFamily",
      },
      specialStyleMap: {},
      defaultStyleMap: {},
      //阴影设置
      shadowColor: "#000",
      shadowBlur: "5px",
      shadowOffsetX: "5px",
      shadowOffsetY: "5px",

      fonts: [],
      currentData: {},
    };
  },
  computed: {
    getActiveClass: (self) => {
      return (field) => {
        let referenceValue = self.specialStyleMap[field];

        let nowVal = self.currentData[field];

        return nowVal === referenceValue ? "active-icon" : "";
      };
    },
    fontWrapStyle() {
      let style = {};
      let arr = [this.currentConfig.isShowColor, this.currentConfig.isShowFontWeight, this.currentConfig.isShowItalics, this.currentConfig.isShowUnderline];
      let flag = arr.every((any) => any === false);
      if (flag) {
        style.marginTop = 0;
      } else if (!this.currentConfig.isMarginTop) {
        style.marginTop = 0;
      }
      return style;
    },
  },
  watch: {
    value() {
      // 初始化值
      this.initData();
    },
  },
  created() {
    this.initFonts();
    this.initDefault();
    this.initData();
  },
  methods: {
    initFonts() {
      this.fonts = dsf.dataview.designer.fonts;
    },
    initDefault() {
      this.defaultStyleMap = {
        [this.currentConfig.fontWeightField]: "normal",
        [this.currentConfig.fontStyleField]: "normal",
        [this.currentConfig.textDecorationField]: "none",
      };
      this.specialStyleMap = {
        [this.currentConfig.fontWeightField]: "bold",
        [this.currentConfig.fontStyleField]: "italic",
        [this.currentConfig.textDecorationField]: "underline",
      };
    },
    initData() {
      if (!this.value) {
        return false;
      }

      Object.keys(this.defaultStyleMap).forEach((key) => {
        if (this.value[key] === undefined) {
          this.$set(this.value, key, null);
        }
        //如果是字体加粗转化成 bold
        if (key === this.currentConfig.fontWeightField) {
          const val = this.value[key];
          this.value[key] = ~["bold", "bolder"].indexOf(val) || val > 600 ? "bold" : "normal";
        }
      });
      // 处理颜色对象
      if (this.value[this.currentConfig.colorObjField]) {
        this.$set(this.value, this.currentConfig.colorStringField, this.value[this.currentConfig.colorObjField]);
        this.value[this.currentConfig.colorObjField] = null;
        delete this.value[this.currentConfig.colorObjField];
      }
      //处理阴影
      if (this.value[this.currentConfig.textShadowField]) {
        let textShadow = this.value[this.currentConfig.textShadowField];
        const reg = /(\d+(?:px)?)\s+(\d+(?:px)?)\s+(\d+(?:px)?)\s+(#.{3,6}|rgb[a]?\(.+\))/g;
        let res = reg.exec(textShadow);
        if (res && res.length) {
          this.shadowOffsetX = res[1];
          this.shadowOffsetY = res[2];
          this.shadowBlur = res[3];
          this.shadowColor = res[4];
        }
      }
      this.currentData = this.value;
    },
    colorChange(val) {
      this.currentData[this.currentConfig.colorStringField] = val;
      this.$emit("change", this.currentData);
    },
    changeValue(field) {
      let nowVal = this.currentData[field];
      if (nowVal === this.specialStyleMap[field]) {
        this.currentData[field] = this.defaultStyleMap[field];
      } else {
        this.currentData[field] = this.specialStyleMap[field];
      }
      this.$emit("change", this.currentData);
    },
    generalChange(val, field) {
      this.currentData[field] = val;
      this.$emit("change", this.currentData);
    },
    shadowColorChange(val) {
      this.shadowColor = val;
      this.shadowEmit();
    },
    changeShadowBlurValue(val) {
      this.shadowBlur = val + "px";
      this.shadowEmit();
    },
    changeShadowValue(val, key) {
      this[key] = val;
      this.shadowEmit();
    },
    selectShadowValue() {
      let textShadow = this.currentData[this.currentConfig.textShadowField];
      if (textShadow) {
        textShadow = "";
      } else {
        textShadow = "5px 5px 5px #000";
      }
      this.$set(this.currentData, this.currentConfig.textShadowField, textShadow);
      this.$emit("change", this.currentData);
    },
    shadowEmit() {
      let { shadowColor, shadowBlur, shadowOffsetX, shadowOffsetY } = this;
      shadowColor = shadowColor || "#000";
      shadowBlur = shadowBlur || "5px";
      shadowOffsetX = shadowOffsetX || "5px";
      shadowOffsetY = shadowOffsetY || "5px";

      const textShadow = `${shadowOffsetX} ${shadowOffsetY} ${shadowBlur} ${shadowColor}`;
      this.$set(this.currentData, this.currentConfig.textShadowField, textShadow);
      this.$emit("change", this.currentData);
    },
  },
};
</script>
