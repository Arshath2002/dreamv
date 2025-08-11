<!--
 * @Description: 水波图图配置
 * @Author: dengqirui
 * @Date: 2024-07-25 15:45:24
 * @LastEditors: dengqirui
 * @LastEditTime: 2024-07-25 15:45:24
-->

<template>
  <div class="des-dv-chart-edit-container">
    <SettingDataOrigin
      class="data-setting"
      :owner="owner"
      @update-field-list="clearMapFieldList"
    ></SettingDataOrigin>
    <div class="right">
      <el-scrollbar class="right-scroller">
        <div
          class="map-relation__item"
          v-for="(item, index) in chartOptions.series"
          :key="`s_${index}`"
        >
          <div class="map-relation__item-input">
            <div class="cell-item">
              <div class="config-title">名称</div>
              <SelectInput
                v-model="item.nameRelation"
                :mapFieldList="mapFieldList"
              />
            </div>
            <div class="cell-item">
              <div class="config-title">值</div>
              <SelectInput
                v-model="item.valueRelation"
                :mapFieldList="mapFieldList"
              />
            </div>
          </div>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>
<script>
import chartsHelper from "../graph/chartsHelper";
import defaultWaterWave from "_dataview/output/chartDefault/waterWave.js";
const SelectInput = Vue.defineAsyncComponent(() =>
  import(
    /* webpackChunkName: "dataview_design_private" */ "../graph/selectInput.vue"
  )
);
const SettingDataOrigin = Vue.defineAsyncComponent(() =>
  import(
    /* webpackChunkName: "dataview_design_private" */ "../settingDataOrigin.vue"
  )
);
export default {
  name: "DesDVWaterWaveRelation",
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
        this.chartOptions.series.map((item, index) => {
          if (newOption.series[index]) {
            this.$set(item, 'valueRelation', newOption.series[index].valueRelation)
            this.$set(item, 'nameRelation', newOption.series[index].nameRelation)
          }
        })
      })
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
