<!--
 * @Editor: zhanghang
 * @Description: 
 * @Date: 2024-06-06 09:48:36
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-07-21 18:06:14
-->
<template>
  <div class="des-dv-chart-edit-container">
    <SettingDataOrigin class="data-setting" :owner="owner" @update-field-list="clearMapFieldList"></SettingDataOrigin>
    <div class="right">
      <el-scrollbar class="right-scroller">
        <div class="map-relation__item">
          <div class="map-relation__item-name">
            <div class="item-type">平行坐标系</div>
            <div class="item-name">[{{ !chartOptions.hasNameRelation ? chartOptions.series[0].name : chartOptions.seriesNameRelation }}]</div>
            <span class="item-name margin-right">：开启映射</span>
            <DesDVSwitch v-model="chartOptions.hasNameRelation" />
          </div>
        </div>
        <div class="map-relation__item">
          <div class="map-relation__item-input wrapper">
            <div class="cell-item">
              <div class="config-title">系列名称</div>
              <SelectInput v-if="!chartOptions.hasNameRelation" v-model="chartOptions.series[0].name" :mapFieldList="[]" />
              <SelectInput v-else v-model="chartOptions.seriesNameRelation" :mapFieldList="mapFieldList" />
            </div>
          </div>
        </div>
        <h3 class="title">坐标维度</h3>
        <el-row v-for="(item, index) in chartOptions.parallelAxis" :key="index">
          <el-col :span="6" :offset="1" class="cell-item-particular">
            <div class="config-title">名称</div>
            <SelectInput v-model="item.name" :mapFieldList="[]" />
          </el-col>
          <el-col :span="6" :offset="1" class="cell-item-particular">
            <div class="config-title">字段</div>
            <SelectInput v-model="item.valueRelation" :mapFieldList="mapFieldList" />
          </el-col>
          <el-col :span="5" :offset="1" class="cell-item-particular">
            <div class="config-title">类型</div>
            <el-select size="small" v-model="item.type" placeholder="请选择">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
          </el-col>
          <el-col :span="3" :offset="1" class="cell-item-particular">
            <div class="des-dv-icon-add" @click="addAxis(index)">
              <i class="add-btn el-icon-plus"></i>
            </div>
            <div class="des-dv-icon-add" v-if="chartOptions.parallelAxis.length > 1" @click="deleteAxis(index)">
              <i class="add-btn el-icon-minus"></i>
            </div>
          </el-col>
        </el-row>
      </el-scrollbar>
    </div>
  </div>
</template>
<script>
import chartsHelper from "../graph/chartsHelper";
import createAxis from "_dataview/output/chartDefault/defaultParallelAxis.js";
const SelectInput = Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_private" */ "../graph/selectInput.vue"));
const SettingDataOrigin = Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_private" */ "../settingDataOrigin.vue"));
export default {
  name: "DesDVParallelRelation",
  mixins: [$mixins.propertyDialogSetting, chartsHelper],
  components: { SelectInput, SettingDataOrigin },
  data() {
    return {
      options: [
        {
          label: "数值",
          value: "value",
        },
        {
          label: "类目",
          value: "category",
        },
      ],
    };
  },
  methods: {
    clearMapFieldList() {},
    addAxis(index) {
      this.chartOptions.parallelAxis.splice(index + 1, 0, {
        dim: "",
        type: "value",
        name: "axis",
        defineMax: false,
        defineMin: false,
        valueRelation: "",
        ...createAxis(),
      });
      this.sortAxis();
    },
    deleteAxis(index) {
      this.chartOptions.parallelAxis.splice(index, 1);
      this.sortAxis();
    },
    sortAxis() {
      this.chartOptions.parallelAxis.forEach((it, index) => {
        it.dim = index;
      });
    },
  },
};
</script>
<style lang="scss">
@import "_dataview/assets/styles/designer/DesDVMapRelation.scss";
</style>
