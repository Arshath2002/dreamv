<template>
  <div
    class="dsf_period_picker data-view-item-wrap ds-control data-view-no-padding"
    :style="controlHeight"
  >
    <ds-date-picker
      ref="datepicker"
      v-model="value2"
      :type="pickerType"
      :period-type="chooseType"
      :format="format"
      :value-format="valueFormat"
      :picker-options="mPicker || pickerOptions"
      :disabled="disabled"
      :clearable="clearable"
      range-separator="至"
      start-placeholder="开始时间"
      end-placeholder="结束时间"
      :editable="false"
      @change="change"
    >
    </ds-date-picker>
    <div v-if="showSvgShade" class="svgShade" @click="clickIcon"></div>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      t="1681631458426"
      class="icon"
      viewBox="0 0 1024 1024"
      version="1.1"
      p-id="4309"
      width="14"
      height="14"
    >
      <path
        d="M514.56 962.56C267.776 962.56 66.56 761.344 66.56 514.56S267.776 66.56 514.56 66.56 962.56 267.776 962.56 514.56 761.344 962.56 514.56 962.56z m0-834.56C301.568 128 128 301.568 128 514.56S301.568 901.12 514.56 901.12s386.56-173.568 386.56-386.56S727.552 128 514.56 128z"
        p-id="4310"
        fill="#1167F1"
      />
      <path
        d="M737.28 482.816H291.84c-15.36 0-28.16-12.8-28.16-28.16s12.8-28.16 28.16-28.16h445.44c15.36 0 28.16 12.8 28.16 28.16s-12.8 28.16-28.16 28.16z"
        p-id="4311"
        fill="#1167F1"
      />
      <path
        d="M615.936 293.376l141.312 141.312c10.752 10.752 10.752 28.672 0 39.936-10.752 10.752-28.672 10.752-39.936 0l-141.312-141.312c-10.752-10.752-10.752-28.672 0-39.936 11.264-10.752 29.184-10.752 39.936 0zM311.808 555.008L453.12 696.32c10.752 10.752 10.752 28.672 0 39.936-10.752 10.752-28.672 10.752-39.936 0l-141.312-141.312c-10.752-10.752-10.752-28.672 0-39.936s28.672-11.264 39.936 0z"
        p-id="4312"
        fill="#1167F1"
      />
      <path
        d="M737.28 603.136H291.84c-15.36 0-28.16-12.8-28.16-28.16s12.8-28.16 28.16-28.16h445.44c15.36 0 28.16 12.8 28.16 28.16s-12.8 28.16-28.16 28.16z"
        p-id="4313"
        fill="#1167F1"
      />
    </svg>
    <span v-show="all" class="all" @click.stop="alllabelClick">{{ all }}</span>
  </div>
</template>
<script>
import { createDatePicker } from "./date-picker";

const ElDatePicker = ELEMENT.DatePicker;
const DsDatePicker = createDatePicker(ElDatePicker);
import border from "_dataview/mixins/border.js";
export default dsf.component({
  name: "DsfDataViewPeriodPicker",
  mixins: [$mixins.dataView,border],
  ctrlCaption: "季年旬",
  components: {
    DsDatePicker,
  },
  props: {
    chooseType: {
      type: String,
      default: "MD",
    },
    value: {
      type: [String, Array, Date],
      default: "",
    },
    range: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    // 是否显示清除按钮
    clearable: {
      type: Boolean,
      default: true,
    },
    //用于二次开发的 pickerOptions
    mPicker: {
      type: Object,
      required: false,
    },
    DT_value: Number,
    metadata: {
      type: Object,
      default() {
        return dsf.metadata.get("date-picker-meta-data");
      },
    },
    iconFun: {
      type: Function,
      default() {
        return () => {};
      },
    },
    showSvgShade: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      // 本地写死
      formats: {
        HY: "yyyy年M半年",
        SS: "yyyy年第M季度",
        MD: "yyyy年MM月dd旬",
      },
      valueFormats: {
        HY: "yyyy-MM-dd HH:mm:ss",
        SS: "yyyy-MM-dd HH:mm:ss",
        MD: "yyyy-MM-dd HH:mm:ss",
      },
      value2: this.value,
    };
  },
  watch: {
    value(to, ov) {
      this.initValue(to);
    },
    value2() {
      this.$emit("input", this.value2);
    },
  },
  computed: {
    format() {
      return this.formats[this.chooseType];
    },
    valueFormat() {
      return this.valueFormats[this.chooseType];
    },
    pickerType() {
      if (this.range) {
        return "monthrange";
      }
      if (this.chooseType == "YY") {
        return "year";
      }
      if (this.chooseType == "MD") {
        return "date";
      }
      return "month";
    },
    pickerOptions() {
      return {
        disabledDate: (time) => {
          if (this.DT_value === -1) {
            return false;
          }
          if (this.DT_value === 0) {
            return true;
          }
          return false;
        },
      };
    },
    all() {
      return this.value2 ? "" : "全部";
    },
  },
  methods: {
    initValue(v) {
      this.value2 = v;
    },
    change(v) {
      this.$dispatch("change", v);
    },
    alllabelClick() {
      this.$refs.datepicker.focus();
    },
    clickIcon() {
      this.iconFun(this);
    },
  },
});
</script>
<style lang="scss">
 @import "_dataview/assets/styles/share/components/periodPicker.scss";
</style>
