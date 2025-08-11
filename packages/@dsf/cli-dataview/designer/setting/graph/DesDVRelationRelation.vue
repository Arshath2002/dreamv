<!--
 * @Editor: zhanghang
 * @Description: 关系图表映射
 * @Date: 2024-06-04 16:33:58
 * @LastEditors: zhanghang
 * @LastEditTime: 2024-06-04 16:45:28
-->
<template>
  <div class="des-dv-chart-edit-container">
    <SettingDataOrigin class="data-setting" :owner="owner" @update-field-list="clearMapFieldList"></SettingDataOrigin>
    <div class="right">
      <el-scrollbar class="right-scroller">
        <div class="map-relation__item" v-for="(item, index) in chartOptions.series" :key="`s_${index}`">
          <div class="map-relation__item-input wrapper">
            <div class="cell-item">
              <div class="config-title">节点名称</div>
              <SelectInput v-model="item.nameRelation" :mapFieldList="mapFieldList" />
            </div>
            <div class="cell-item">
              <div class="config-title">节点类目</div>
              <SelectInput v-model="item.categoryRelation" :mapFieldList="mapFieldList" />
            </div>
            <div class="cell-item">
              <div class="config-title">节点数值</div>
              <SelectInput v-model="item.valueRelation" :mapFieldList="mapFieldList" />
            </div>
            <div class="cell-item">
              <div class="config-title">开始节点</div>
              <SelectInput v-model="item.startRelation" :mapFieldList="mapFieldList" />
            </div>
            <div class="cell-item">
              <div class="config-title">结束节点</div>
              <SelectInput v-model="item.endRelation" :mapFieldList="mapFieldList" />
            </div>
            <div class="cell-item">
              <div class="config-title">节点关系</div>
              <SelectInput v-model="item.linkRelation" :mapFieldList="mapFieldList" />
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
  name: "DesDVRelationRelation",
  mixins: [$mixins.propertyDialogSetting, chartsHelper],
  components: { SelectInput, SettingDataOrigin },
  methods: {
    clearMapFieldList() {
       this.$nextTick(() => {
        this.mapFieldList = this.owner.$children[0].getDesignerMapFieldList()
        let newOption = dsf.eval(this.owner.chartString)
        this.chartOptions.series.map((item, index) => {
          if (newOption.series[index]) {
            this.$set(item, 'valueRelation', newOption.series[index].valueRelation)
            this.$set(item, 'nameRelation', newOption.series[index].nameRelation)
            this.$set(item, 'categoryRelation', newOption.series[index].categoryRelation)
            this.$set(item, 'startRelation', newOption.series[index].startRelation)
            this.$set(item, 'endRelation', newOption.series[index].endRelation)
            this.$set(item, 'linkRelation', newOption.series[index].linkRelation)
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
