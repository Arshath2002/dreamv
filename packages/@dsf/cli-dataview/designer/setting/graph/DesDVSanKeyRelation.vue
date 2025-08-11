<!--
 * @Description: 桑基图
 * @Author: shenah
 * @Date: 2024-05-07 09:55:34
 * @LastEditors: shenah
 * @LastEditTime: 2024-05-08 16:52:16
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
        <div class="map-relation__item no-border-bottom no-margin">
          <div
            class="map-relation__item-input map-relation__item_column"
            v-for="(item, index) in chartOptions.series"
            :key="`s_${index}`"
          >
            <div class="cell-item">
              <div class="config-title first common-width">
                <span class="red-point">*</span>
                源节点名称：
              </div>
              <SelectInput
                v-model="item.sourceRelation"
                :mapFieldList="mapFieldList"
              />
            </div>
            <div class="cell-item">
              <div class="config-title first common-width">
                <span class="red-point">*</span>
                目标节点名称：
              </div>
              <SelectInput
                v-model="item.targetRelation"
                :mapFieldList="mapFieldList"
                :defaultValue="true"
              />
            </div>
            <div class="cell-item">
              <div class="config-title first common-width">
                <span class="red-point">*</span>
                数值：
              </div>
              <SelectInput
                v-model="item.targetValueRelation"
                :mapFieldList="mapFieldList"
                :defaultValue="true"
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
  name: "DesDVSanKeyRelation",
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
            this.$set(item, 'sourceRelation', newOption.series[index].sourceRelation)
            this.$set(item, 'targetRelation', newOption.series[index].targetRelation)
            this.$set(item, 'targetValueRelation', newOption.series[index].targetValueRelation)
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
