<!--
 * @Description: border类型属性
 * @Author: shenah
 * @Date: 2024-03-11 09:20:16
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-02-13 10:44:35
-->

<template>
  <div class="ds-border-attr">
    <div class="ds-border-attr-main-wrap" :style="mainWrapStyle">
      <div class="main-item" v-if="borderOptions.length">
        <div class="border-select">
          <div class="border-item-wrap" v-for="(item, index) in borderOptions" :key="item.value" :class="getBorderItemWrapClass(item, index)" @click="itemClick(item)">
            <div class="border-item" :class="getBorderItemClass(item)"></div>
          </div>
        </div>
        <div class="des-text border-text">
          {{ currentConfig.borderDes }}
        </div>
      </div>
      <div class="main-item" v-if="isShowStyle">
        <DesDVNumber
          v-model="currentData.commonBorderWidth"
          @change="changeStyle"
          :config="{
            unit: 'px',
          }"
        />
        <div class="des-text">宽度</div>
      </div>
    </div>
    <template v-if="isShowStyle">
      <div class="left-right-flex">
        <div class="label">颜色：</div>
        <DesDVColorPicker
          v-model="currentData.commonBorderColor"
          :config="{
            type: 'color',
          }"
          @change="changeStyle"
        ></DesDVColorPicker>
      </div>
      <div class="left-right-flex no-margin-bottom">
        <div class="label">类型：</div>
        <el-radio-group v-model="currentData.commonBorderStyle" size="small" @change="changeStyle">
          <el-radio-button size="small" :label="item.value" v-for="item in borderStyleOptions" :key="item.value">
            {{ item.label }}
          </el-radio-button>
        </el-radio-group>
      </div>
    </template>
  </div>
</template>
<script>
import ColorSet from "_dataview/designer/setting/graph/config/tool/colorSet.vue";
import DesDVColorPicker from "./colorPicker/index.vue";
import propertyMixin from "./propertyMixin.js";
export default {
  name: "DesDVBorder",
  components: { ColorSet, DesDVColorPicker },
  mixins: [propertyMixin],
  props: {
    value: {
      type: Object,
    },
    config: {
      type: Object,
    },
  },
  data() {
    return {
      defaultConfig: {
        isShowAll: true,
        isShowTop: true,
        isShowRight: true,
        isShowBottom: true,
        isShowLeft: true,
        isDisabledAll: false,
        isDisabledTop: false,
        isDisabledRight: false,
        isDisabledBottom: false,
        isDisabledLeft: false,
        borderDes: "边框",
      },
      borderStyleOptions: [
        {
          label: "实线",
          value: "solid",
        },
        {
          label: "虚线",
          value: "dashed",
        },
      ],
      allBorderOptions: [
        {
          class: "border-all",
          value: "all",
          flag: false,
          show: true,
        },
        {
          class: "border-top",
          value: "top",
          flag: false,
          show: true,
        },
        {
          class: "border-right",
          value: "right",
          flag: false,
          show: true,
        },
        {
          class: "border-bottom",
          value: "bottom",
          flag: false,
          show: true,
        },
        {
          class: "border-left",
          value: "left",
          flag: false,
          show: true,
        },
      ],
      borderOptions: [],
      defaultBorderAttr: {
        commonBorderWidth: 1,
        commonBorderColor: "#333",
        commonBorderStyle: "solid",
      },
      currentData: {},
    };
  },
  computed: {
    mainWrapStyle() {
      let style = {};
      if (!this.borderOptions.length) {
        style.justifyContent = "flex-start";
      }
      return style;
    },
    isShowStyle() {
      return this.borderOptions.some((item) => item.flag);
    },
  },
  watch: {
    value: {
      handler() {
        this.initData();
      },
      deep: true,
      immediate: true,
    },
  },
  created() {
    this.initData();
  },
  methods: {
    // 解析border
    analyzeBorder(str, defaultObj) {
      let obj = {
        ...defaultObj,
      };
      let isHasWord = false;
      let nowWord = "";
      let colorType = "";
      if (typeof str !== "string") {
        str = "";
      }
      let newStr = str.trim();
      let arr = newStr.split("");
      arr.forEach((str, index) => {
        let nowStr = str.trim();
        if (colorType === "") {
          if (isHasWord && (nowStr === "" || index === arr.length - 1)) {
            if (index === arr.length - 1) {
              nowWord += nowStr;
            }
            isHasWord = false;
            let keyStr = this.judgeType(nowWord);
            if (keyStr) {
              obj[keyStr] = nowWord;
            }
            nowWord = "";
          }
        } else if (colorType === "colorRgb") {
          if (nowStr === ")" && isHasWord) {
            nowWord += nowStr;
            isHasWord = false;
            colorType = "";
            let keyStr = this.judgeType(nowWord);
            if (keyStr) {
              obj[keyStr] = nowWord;
            }
            nowWord = "";
          }
        }

        if (nowStr) {
          isHasWord = true;
          nowWord += nowStr;
        }
        if (colorType === "colorRgb" && nowStr === "") {
          nowWord += " ";
        }
        if (nowWord === "rgb") {
          colorType = "colorRgb";
        }
      });
      obj.commonBorderWidth = parseInt(obj.commonBorderWidth);
      return obj;
    },
    judgeType(str) {
      let nowStr = str?.trim() || "";
      let noNumStr = nowStr.replace(/[0-9]/g, "");
      let borderStyleArr = ["solid", "dotted", "dashed"];
      let borderWidthArr = ["px", "rem"];
      if (borderStyleArr.indexOf(nowStr) > -1) {
        return "commonBorderStyle";
      } else if (borderWidthArr.includes(noNumStr)) {
        return "commonBorderWidth";
      } else if (this.isColor(nowStr)) {
        return "commonBorderColor";
      }
      return null;
    },
    isColor(str) {
      const s = new Option().style;
      s.color = str;
      return s.color !== "";
    },
    initData() {
      this.borderOptions = this.allBorderOptions.filter((item) => {
        let val = `isShow${_.capitalize(item.value)}`;
        return this.currentConfig[val];
      });
      let newVal = this.getCssTransformHump(this.value);
      let obj = {
        commonBorderWidth: newVal.commonBorderWidth || this.defaultBorderAttr.commonBorderWidth,
        commonBorderColor: newVal.commonBorderColor || this.defaultBorderAttr.commonBorderColor,
        commonBorderStyle: newVal.commonBorderStyle || this.defaultBorderAttr.commonBorderStyle,
      };
      let arr = Object.keys(newVal);
      let oneAttr = arr[0];
      if (oneAttr) {
        obj = this.analyzeBorder(newVal[oneAttr], obj);
        this.getActive(arr);
      }
      this.currentData = obj;
    },
    getBorderItemWrapClass(item, index) {
      let str = "";

      let disabled = this.currentConfig[`isDisabled${_.capitalize(item.value)}`];
      let one = this.borderOptions[index + 1] || {};
      if (item.flag) {
        str += "active";
      }
      if (one.flag) {
        str += " no-line";
      }
      if (item.flag && one.flag) {
        str += " no-right-border";
      }
      if (disabled) {
        str += " disabled";
      }
      return str;
    },
    getBorderItemClass(item) {
      return item.class;
    },
    // 转换属性
    getCssTransformHump(obj) {
      if (!obj) {
        return {};
      }
      let target = {};
      Object.keys(obj).forEach((str) => {
        const newStr = str.replace(/-(\w)/g, (match, p1) => p1.toUpperCase());
        target[newStr] = obj[str];
      });
      return target;
    },
    getActive(arr) {
      arr.forEach((key) => {
        let nowKey = _.lowerCase(key.replace("border", "").trim());
        let newKey = nowKey === "" ? "all" : nowKey;
        let one = this.borderOptions.find((item) => item.value === newKey);
        if (one) {
          one.flag = true;
        }
      });
    },
    itemClick(item) {
      let disabled = this.currentConfig[`isDisabled${_.capitalize(item.value)}`];
      if (disabled) {
        return;
      }
      item.flag = !item.flag;
      this.borderOptions.forEach((nowItem) => {
        if (item.value === "all") {
          if (nowItem.value !== "all") {
            nowItem.flag = false;
          }
        } else {
          if (nowItem.value === "all") {
            nowItem.flag = false;
          }
        }
      });
      this.changeStyle();
    },
    changeStyle() {
      let style = this.getBorderStyle();
      this.$emit("input", style);
      this.$emit("change", style);
    },
    getBorderStyle() {
      let currentData = this.currentData;
      let borderColor = currentData.commonBorderColor;
      let borderStyle = currentData.commonBorderStyle;
      let commonBorderWidth = currentData.commonBorderWidth;
      let style = {
        commonBorderColor: borderColor,
        commonBorderStyle: borderStyle,
        commonBorderWidth: commonBorderWidth,
      };
      let arr = this.borderOptions.filter((item) => item.flag);
      let attr = `${commonBorderWidth}px ${borderStyle} ${borderColor}`;
      arr.forEach((item) => {
        if (item.value === "all") {
          style.border = attr;
        } else {
          style[`border${_.capitalize(item.value)}`] = attr;
        }
      });
      return style;
    },
  },
};
</script>
<style lang="scss">
@import "_dataview/assets/styles/designer/common/commonProperty/border.scss";
</style>
