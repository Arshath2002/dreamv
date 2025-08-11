<!--
 * @Description: 动画选择
 * @Author: shenah
 * @Date: 2024-08-08 09:56:04
 * @LastEditors: shenah
 * @LastEditTime: 2024-08-21 17:43:51
-->

<template>
  <el-select
    :value="currentData"
    multiple
    :popper-append-to-body="true"
    :disabled="disabled"
    placeholder="请选择动画"
    @change="changeValue"
    class="data-view-select"
    :size="currentConfig.size"
  >
    <el-option
      v-for="(option, $index) in animationOptions"
      :key="$index"
      :label="option.label"
      :value="option.value"
      :disabled="option.disabled"
    ></el-option>
  </el-select>
</template>
<script>
import propertyMixin from "./propertyMixin.js";
import { createAnimationOptions } from "_dataview/output/config/backgroundExtend.js";
export default {
  name: "dsfAnimationSelect",
  components: {},
  mixins: [propertyMixin],
  props: {
    value: {
      type: [Array, Object],
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      defaultConfig: {
        size: undefined,
      },
      // 动画下拉选,value对应animate.scss声明的变量
      animationOptions: createAnimationOptions(),
      currentData: null,
    };
  },
  computed: {},
  watch: {},
  created() {
    this.initData();
  },
  methods: {
    initData() {
      this.currentData = this.filterData(this.value);
    },
    filterData(arr) {
      if (!Array.isArray(arr)) {
        return [];
      }
      let rotateArr = ["dvJumpUpDown", "dvClockwiseRotate", "dvNotClockwiseRotate"];
      let result = arr.filter(str => !rotateArr.includes(str));
      let hasRotate = false;
      const isClockwiseSelected = arr.includes("dvClockwiseRotate");
      const isNotClockwiseSelected = arr.includes("dvNotClockwiseRotate");
      const dvJumpUpDownSelected = arr.includes("dvJumpUpDown");
      if (arr.includes("")) {
        //目前去掉无
        result = [""];
      } else if (isClockwiseSelected) {
        // 只选择了 "顺时针旋转"
        result.push("dvClockwiseRotate");
        hasRotate = true;
      } else if (isNotClockwiseSelected) {
        // 只选择了 "逆时针旋转"
        result.push("dvNotClockwiseRotate");
        hasRotate = true;
      } else if (dvJumpUpDownSelected) {
        result.push("dvJumpUpDown");
        hasRotate = true;
      }
      this.animationOptions.forEach(item => {
        if (hasRotate && rotateArr.includes(item.value) && !result.includes(item.value)) {
          item.disabled = true;
        } else {
          item.disabled = false;
        }
      })
      return result;

    },
    changeValue(val) {
      let result = this.filterData(val);
      this.currentData = result;
      this.$emit("change", result);
      this.$emit("input", result);
    },
  },
};
</script>
<style lang="scss"></style>
