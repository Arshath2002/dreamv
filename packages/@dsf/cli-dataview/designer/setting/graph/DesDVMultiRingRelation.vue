<!--
 * @Description: 多圆环映射字段
 * @Author: shenah
 * @Date: 2024-05-06 14:53:35
 * @LastEditors: shenah
 * @LastEditTime: 2024-05-06 14:54:01
-->



<template>
  <div class="des-dv-chart-edit-container">
    <SettingDataOrigin class="data-setting" :owner="owner" @update-field-list="clearMapFieldList"></SettingDataOrigin>
    <div class="right">
      <el-scrollbar class="right-scroller">
        <div class="map-relation__item no-border-bottom no-margin">
          <div class="map-relation__item-input map-relation__item_column">
            <div class="cell-item">
              <div class="config-title first">名称</div>
              <SelectInput v-model="chartOptions.mapOptions.nameRelation" :mapFieldList="mapFieldList" />
            </div>
            <div class="cell-item">
              <div class="config-title first">数值</div>
              <SelectInput v-model="chartOptions.mapOptions.valueRelation" :mapFieldList="mapFieldList" :defaultValue="true" />
            </div>
            <div class="cell-item">
              <div class="config-title first">百分比</div>
              <SelectInput v-model="chartOptions.mapOptions.percentRelation" :mapFieldList="mapFieldList" :defaultValue="true" />
            </div>
            <div class="cell-item">
              <div class="config-title first">分类字段(堆叠)</div>
              <SelectInput v-model="chartOptions.mapOptions.categoryRelation" :mapFieldList="mapFieldList" :defaultValue="true" />
            </div>
          </div>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>
<script>
import chartsHelper from '../graph/chartsHelper'
const SelectInput = Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_private" */ '../graph/selectInput.vue'))
const SettingDataOrigin = Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_private" */ '../settingDataOrigin.vue'))
export default {
  name: 'DesDVMultiRingRelation',
  mixins: [$mixins.propertyDialogSetting, chartsHelper],
  components: {
    SettingDataOrigin,
    SelectInput,
  },
  computed: {},
  methods: {
    clearMapFieldList() {
      this.$nextTick(() => {
        this.mapFieldList = this.owner.$children[0].getDesignerMapFieldList()
        let newOption = dsf.eval(this.owner.chartString)
        if (newOption.mapOptions) {
          this.$set(this.chartOptions.mapOptions, 'valueRelation', newOption.mapOptions.valueRelation)
          this.$set(this.chartOptions.mapOptions, 'nameRelation', newOption.mapOptions.nameRelation)
          this.$set(this.chartOptions.mapOptions, 'percentRelation', newOption.mapOptions.percentRelation)
          this.$set(this.chartOptions.mapOptions, 'categoryRelation', newOption.mapOptions.categoryRelation)
        }
      })
    },
    yes() {
      //处理图表chart字符串
      this.dealChartOption(this.owner)
      return this.chartOptions
    },
  },
}
</script>

<style lang="scss">
@import '_dataview/assets/styles/designer/DesDVMapRelation.scss';
</style>
