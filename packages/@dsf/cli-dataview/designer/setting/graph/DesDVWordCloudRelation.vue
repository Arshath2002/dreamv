<!--
 * @Description: 词云映射字段
 * @Author: shenah
 * @Date: 2024-05-09 09:24:46
 * @LastEditors: shenah
 * @LastEditTime: 2024-05-09 09:27:36
-->

<template>
  <div class="des-dv-chart-edit-container">
    <SettingDataOrigin class="data-setting" :owner="owner" @update-field-list="clearMapFieldList"></SettingDataOrigin>
    <div class="right">
      <el-scrollbar class="right-scroller">
        <div class="map-relation__item no-border-bottom no-margin">
          <div class="map-relation__item-input map-relation__item_column">
            <div class="cell-item">
              <div class="config-title first common-width">
                <span class="red-point">*</span>
                名称：
              </div>
              <SelectInput v-model="chartOptions.nameRelation" :mapFieldList="mapFieldList" />
            </div>
            <div class="cell-item">
              <div class="config-title first common-width">
                <span class="red-point">*</span>
                值：
              </div>
              <SelectInput v-model="chartOptions.valueRelation" :mapFieldList="mapFieldList" />
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
  name: 'DesDVWordCloudRelation',
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
        this.$set(this.chartOptions, 'valueRelation', newOption.valueRelation)
        this.$set(this.chartOptions, 'nameRelation', newOption.nameRelation)
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
