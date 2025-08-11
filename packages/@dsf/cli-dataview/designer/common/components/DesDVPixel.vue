<template>
  <div class="data-view-dv-dsf-pixel" @mouseout="mouseControl(false)" @mouseover="mouseControl(true)">
    <el-dropdown class="dsf-pixel-select" placement="bottom" :disabled="options.length < 2">
      <span :style="{ fontStyle: !unit ? 'italic' : '' }">
        {{ unit | unitText }}
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item v-for="(item, idx) in options" :key="idx" @click.native="unitChange(item.value)">
          {{ item.label }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-input
      ref="pixel"
      @mousewheel.native.prevent="mouseWheel"
      :type="type"
      :disabled="inputDisabled"
      v-model="dataValue"
      @change="changeValue"
      :class="{ 'dsf-number-focus': isFocus }"
      size="small"
    >
    </el-input>
  </div>
</template>
<script>
export default {
  name: "DesDVPixel",
  model: {
    prop: "value",
    event: "change",
  },
  filters: {
    unitText(str) {
      return str || "fx";
    },
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
    options: {
      type: Array,
      default() {
        return [
          {
            value: "%",
            label: "%",
          },
          {
            value: "px",
            label: "px",
          },
          {
            value: "",
            label: "fx",
          },
        ];
      },
    },
  },
  watch: {
    value: {
      handler(v) {
        let val = parseFloat(v);

        let str = String(v).replace(/(^-)?[\d\.]*/, "");
        let unit = this.options.find((it) => it.value === str);
        this.unit = unit ? unit.value : "";

        if (v === this.unit) {
          v = "";
        }
        if (isFinite(val) && this.unit) {
          this.dataValue = val;
        } else {
          this.dataValue = v;
        }
      },
      immediate: true,
    },
    dataValue: {
      handler(v) {
        let value = this.dataValue;
        let val = parseFloat(value);
        if (!isFinite(val) && value) {
          this.unit = "";
        }
        if (this.unit !== "") {
          value = value + this.unit;
        }
        this.$emit("change", value);
      },
    },
  },
  data() {
    return {
      dataValue: null,
      unit: "",
      isFocus: false,
      type: "text",
    };
  },
  mounted() {},
  methods: {
    mouseWheel(event) {
      if (this.type != "number") {
        return;
      }
      event.stopPropagation();
      const delta = event.wheelDelta || -event.deltaY;
      const increment = delta > 0 ? 1 : -1;
      this.dataValue = Number(this.dataValue) + increment;
    },
    changeValue() {
      if (this.dataValue === "" && this.unit !== "") this.dataValue = 0;
    },
    mouseControl(flag) {
      this.mouseDebounce(flag);
    },
    mouseDebounce: _.debounce(function (flag) {
      this.isFocus = flag;
    }, 100),
    unitChange(val) {
      this.unit = val;
      if (this.unit !== "") {
        if (isNaN(parseFloat(this.dataValue))) {
          this.dataValue = 0;
        }
        this.type = "number";
      } else {
        this.type = "";
      }
      this.updateValue();
    },
    updateValue() {
      let value = this.dataValue;
      if (this.unit !== "") value += this.unit;
      this.$emit("change", value);
    },
  },
};
</script>
<style lang="scss">
@import "_dataview/assets/styles/designer/common/commonProperty/pixel.scss";
</style>
