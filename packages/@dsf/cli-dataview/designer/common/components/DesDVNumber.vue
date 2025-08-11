<!--
 * @Editor: zhanghang
 * @Description: 
 * @Date: 2024-04-22 11:51:27
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-02-14 17:35:35
-->
<template>
  <div class="data-view-dsf-number" @mouseout="mouseControl(false)" @mouseover="mouseControl(true)">
    <span role="button" class="dsf-number__increase" v-if="showControls" @click="inCrease">
      <i class="el-icon-caret-bottom"></i>
    </span>
    <span role="button" class="dsf-number__decrease" v-if="showControls" @click="deCrease">
      <i class="el-icon-caret-top"></i>
    </span>
    <el-input
      type="number"
      :min="config.min"
      :step="config.step || 1"
      :disabled="inputDisabled"
      :value="dataValue"
      @input="changeValue"
      ref="inputNumber"
      :class="{ 'dsf-number-focus': showControls }"
      size="small"
    >
      <template v-if="!showControls" slot="suffix">{{ config.unit || "" }}</template>
    </el-input>
  </div>
</template>

<script>
export default {
  name: "DesDVNumber",
  model: {
    prop: "value",
    event: "change",
  },
  props: {
    value: {
      type: [Number, String],
      default: 0,
    },
    inputDisabled: {
      type: Boolean,
      default: false,
    },
    config: {
      type: Object,
      default() {
        return {};
      },
    },
    data: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  watch: {
    value: {
      handler(v) {
        this.dataValue = v;
      },
      immediate: true,
    },
    dataValue(val) {
      const regex = /^-?\d*\.?\d*$/; // 只允许输入数字、小数点和负号
      if (!regex.test(val)) {
        return false;
      }
      let config = this.config;
      if (this.data.config) {
        config = this.data.config;
      }

      if (config.min != undefined && val < config.min) {
        val = config.min;
      }
      this.$emit("change", Number(val));
    },
  },
  data() {
    return {
      dataValue: 0,
      showControls: false,
      isInput: false,
    };
  },
  methods: {
    changeValue(val) {
      const regex = /^-?\d*\.?\d*$/; // 只允许输入数字、小数点和负号
      if (!regex.test(val)) {
        return false;
      }
      this.dataValue = val;
    },
    inCrease() {
      let config = this.config;
      if (this.data.config) {
        config = this.data.config;
      }

      const step = config.step || 1;
      const min = config.min;

      let dataValue = this.dataValue;
      dataValue -= Number(step);
      let len = 0;
      if ((step + "").indexOf(".") > -1) {
        len = (step + "").split(".")[1].length;
      }
      this.dataValue = dataValue < min ? min : dataValue.toFixed(len);
    },
    deCrease() {
      let config = this.config;
      if (this.data.config) {
        config = this.data.config;
      }
      const step = config.step || 1;
      this.dataValue = +this.dataValue;
      this.dataValue += Number(step);
      let len = 0;
      if ((step + "").indexOf(".") > -1) {
        len = (step + "").split(".")[1].length;
      }
      this.dataValue = this.dataValue.toFixed(len);
    },
    mouseControl(flag) {
      this.mouseDebounce(flag);
    },
    mouseDebounce: _.debounce(function (flag) {
      this.showControls = flag;
    }, 100),
  },
};
</script>
<style lang="scss">
@import "_dataview/assets/styles/designer/common/commonProperty/number.scss";
</style>
