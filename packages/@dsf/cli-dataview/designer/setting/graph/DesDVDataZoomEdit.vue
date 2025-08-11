<!--
 * @Description: 类目轴单独的弹窗(类目轴的组件已经单独提取出来,以后如果加到可视化配置里面也方便加)
 * @Author: shenah
 * @Date: 2023-06-28 10:50:12
 * @LastEditors: zhanghang
 * @LastEditTime: 2023-09-26 13:41:05
-->

<template>
  <div class="ds-dv-chart-edit-container chart-edit-container">
    <DataZoom :options="dataZoomInfo"></DataZoom>
  </div>
</template>
<script>
import DataZoom from "./config/dataZoom.vue"

export default {
  name: "DesDVDataZoomEdit",
  mixins: [$mixins.propertyDialogSetting],
  components: {
    DataZoom,
  },
  data() {
    return {
      dataZoomInfo: {},
    };
  },
  created() {
    this.dataZoomInfo = this.currentData;
  },
  computed: {},
  methods: {
    yes() {
      return this.dataZoomInfo;
    },
  },
};
</script>
