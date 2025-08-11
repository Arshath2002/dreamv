<!--
 * @Description: 饼图配置
 * @Author: shenah
 * @Date: 2024-04-26 15:05:24
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-01-03 13:59:14
-->

<template>
  <div class="des-dv-chart-edit-container">
    <SettingDataOrigin class="data-setting" :owner="owner" @update-field-list="clearMapFieldList"></SettingDataOrigin>
    <div class="right">
      <el-scrollbar class="right-scroller">
        <div class="nav-btn__wrapper" v-if="!config.is3d">
          <div class="nav-btn__wrapper-item" @click="addItem">增加饼图</div>
        </div>
        <div class="map-relation__item" v-for="(item, index) in chartOptions.series" :key="`s_${index}`">
          <div v-if="!config.is3d" class="delete-series" @click="deleteSeries(index)">
            <DsfIcon name="del1" />
          </div>
          <div class="map-relation__item-name">
            <div class="item-type">饼图</div>
            <div class="item-name">[{{ !item.hasNameRelation ? item.name : item.seriesNameRelation }}]</div>
            <span class="item-name margin-right">：开启映射</span>
            <DesDVSwitch v-model="item.hasNameRelation" />
          </div>
          <div class="map-relation__item-input">
            <div class="cell-item">
              <div class="config-title first">系列名称</div>
              <SelectInput v-if="!item.hasNameRelation" v-model="item.name" :mapFieldList="[]" />
              <SelectInput v-else v-model="item.seriesNameRelation" :mapFieldList="mapFieldList" :defaultValue="true" />
            </div>
            <div class="cell-item">
              <div class="config-title">类目名称</div>
              <SelectInput v-model="item.nameRelation" :mapFieldList="mapFieldList" />
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
import { createPieSeries } from "_dataview/output/chartDefault/createPie.js";
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
      this.chartOptions.series.splice(index, 1);
    },
    //添加系列
    addItem() {
      const seriesName = `示例_${Math.random().toString(16).slice(12)}`;
      const seriesItem = createPieSeries(seriesName);
      this.chartOptions.series.push(seriesItem);
    },
    clearMapFieldList() {
      this.$nextTick(() => {
        this.mapFieldList = this.owner.$children[0].getDesignerMapFieldList();
        let newOption = dsf.eval(this.owner.chartString);
        this.chartOptions.series.map((item, index) => {
          if (newOption.series[index]) {
            this.$set(item, "valueRelation", newOption.series[index].valueRelation);
            this.$set(item, "nameRelation", newOption.series[index].nameRelation);
            this.$set(item, "seriesRelation", newOption.series[index].seriesRelation);
          }
        });
      });
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
