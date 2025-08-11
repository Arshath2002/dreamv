<!--
 * @Editor: zhanghang
 * @Description: 
 * @Date: 2024-04-26 17:19:02
 * @LastEditors: zhanghang
 * @LastEditTime: 2024-05-07 18:25:58
-->
<template>
  <div class="des-dv-chart-edit-container">
    <SettingDataOrigin class="data-setting" :owner="owner" @update-field-list="clearMapFieldList"></SettingDataOrigin>
    <div class="right">
      <el-scrollbar class="right-scroller">
        <div class="map-relation__item">
          <div class="map-relation__item-input">
            <div class="cell-item">
              <div class="config-title">类目轴</div>
              <SelectInput v-model="category[0].nameRelation" :mapFieldList="mapFieldList" />
            </div>
          </div>
        </div>
        <div class="map-relation__item" v-for="(item, index) in chartOptions.series" :key="`s_${index}`">
          <div class="map-relation__item-name">
            <div class="item-type">柱体</div>
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
const SelectInput = Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_private" */ "../graph/selectInput.vue"));
const SettingDataOrigin = Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_private" */ "../settingDataOrigin.vue"));
export default {
  name: "DesDVDoubleBarRelation",
  mixins: [$mixins.propertyDialogSetting, chartsHelper],
  components: { SettingDataOrigin, SelectInput },
  props: ["config"],
  computed: {
    category() {
      return this.chartOptions.xAxis[0].type === "category" ? this.chartOptions.xAxis : this.chartOptions.yAxis;
    },
  },
  methods: {
    deleteSeries(index) {
      this.chartOptions.series.splice(index, 1);
    },
    clearMapFieldList() {
      this.$nextTick(() => {
        this.mapFieldList = this.owner.$children[0].getDesignerMapFieldList()
        let newOption = dsf.eval(this.owner.chartString)
        this.chartOptions.series.map((item, index) => {
          if (newOption.series[index]) {
            this.$set(item, 'valueRelation', newOption.series[index].valueRelation)
            this.$set(item, 'nameRelation', newOption.series[index].nameRelation)
          }
        })
      })
    },
  },
};
</script>
<style lang="scss">
@import "_dataview/assets/styles/designer/DesDVMapRelation.scss";
</style>
