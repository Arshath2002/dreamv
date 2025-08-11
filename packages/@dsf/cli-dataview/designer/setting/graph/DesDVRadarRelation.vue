<!--
 * @Description: 雷达图映射字段
 * @Author: shenah
 * @Date: 2024-05-09 10:49:46
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-07-21 17:08:19
-->

<template>
  <div class="des-dv-chart-edit-container">
    <SettingDataOrigin class="data-setting" :owner="owner" @update-field-list="clearMapFieldList"></SettingDataOrigin>
    <div class="right">
      <el-scrollbar class="right-scroller">
        <div class="nav-btn__wrapper mt10">
          <div class="nav-btn__wrapper-item" @click="addItem">增加系列</div>
        </div>
        <div class="map-relation__item">
          <div class="map-relation__item-input">
            <div class="cell-item">
              <div class="config-title">顶点</div>
              <SelectInput v-model="chartOptions.series[0].radarKey" :mapFieldList="mapFieldList" />
            </div>
          </div>
        </div>
        <div class="map-relation__item" v-for="(item, index) in chartOptions.series[0].data" :key="`s_${index}`">
          <div class="delete-series" @click="deleteSeries(index)">
            <DsfIcon name="del1" />
          </div>
          <div class="map-relation__item-name">
            <div class="item-type">雷达图</div>
            <div class="item-name">[{{ !item.hasNameRelation ? item.name : item.seriesNameRelation }}]</div>
            <span class="item-name margin-right">：开启映射</span>
            <DesDVSwitch v-model="item.hasNameRelation" />
          </div>
          <div class="map-relation__item-input">
            <div class="cell-item">
              <div class="config-title first">系列名称</div>
              <SelectInput v-if="!item.hasNameRelation" v-model="item.name" :mapFieldList="[]" />
              <SelectInput v-else v-model="item.seriesNameRelation" :mapFieldList="mapFieldList" />
            </div>
            <div class="cell-item">
              <div class="config-title">值</div>
              <SelectInput v-model="item.valueRelation" :mapFieldList="mapFieldList" />
            </div>
          </div>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>
<script>
import chartsHelper from "../graph/chartsHelper";
import { createRadarSeries } from "_dataview/output/chartDefault/createRadar.js";
const SelectInput = Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_private" */ "../graph/selectInput.vue"));
const SettingDataOrigin = Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_private" */ "../settingDataOrigin.vue"));
export default {
  name: "DesDVPieRelation",
  mixins: [$mixins.propertyDialogSetting, chartsHelper],
  components: {
    SettingDataOrigin,
    SelectInput,
  },
  computed: {},
  methods: {
    deleteSeries(index) {
      this.chartOptions.series[0].data.splice(index, 1);
      this.chartOptions.legend.data.splice(index, 1);
    },

    //添加系列
    addItem() {
      const seriesItem = this.chartOptions.series[0];
      const colors = this.chartOptions.color;
      const color = colors[seriesItem.data.length % colors.length] || "rgba(0,0,0,1)";
      const newData = createRadarSeries().data[0];
      newData.name = `示例_${Math.random().toString(16).slice(12)}`;
      newData.value = 200 + Math.ceil(Math.random() * 1000);
      newData.areaStyle = {
        color: "rgba(255,255,255,0)",
      };
      newData.itemStyle.color = color;
      newData.lineStyle.color = color;
      seriesItem.data.push(newData);

      this.chartOptions.legend.data = seriesItem.data.map((d) => d.name);
    },
    clearMapFieldList() {
   
    },
    yes() {
      //处理图表chart字符串
      this.dealChartOption(this.owner);
      return this.chartOptions;
    },
  },
};
</script>

<style lang="scss">
@import "_dataview/assets/styles/designer/DesDVMapRelation.scss";
</style>
