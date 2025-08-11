<!--
 * @Description: 雷达盘位置
 * @Author: shenah
 * @Date: 2024-05-09 16:46:02
 * @LastEditors: shenah
 * @LastEditTime: 2024-09-05 18:39:40
-->

<template>
  <div style="margin-top: 10px">
    <div class="ds-designer-property property-item float-one-row">
      <div class="property-item-name">位移X<span>： </span></div>
      <DesDVPixel
        :options="centerOptions"
        :value="series.center[0]"
        @change="changeItemValue($event, series.center, 0)"
      ></DesDVPixel>
    </div>
    <div class="ds-designer-property property-item float-one-row ml20">
      <div class="property-item-name">Y<span>： </span></div>
      <DesDVPixel
        :options="centerOptions"
        :value="series.center[1]"
        @change="changeItemValue($event, series.center, 1)"
      ></DesDVPixel>
    </div>
  </div>
</template>
<script>
import itemMixin from "../itemMixin";
export default {
  name: "DsfDVChartRadarPosition",
  mixins: [itemMixin],
  props: {
    series: {
      type: Object,
      require: true,
    },
  },
  data() {
    return {
      centerOptions: [
        {
          label: "%",
          value: "%",
        },
        {
          label: "无",
          value: "",
        },
      ],
    };
  },
  computed: {},
  created() {},
  methods: {},
};
</script>
