<!--
 * @Editor: zhanghang
 * @Description: 
 * @Date: 2024-05-30 14:54:07
 * @LastEditors: zhanghang
 * @LastEditTime: 2024-05-30 16:20:11
-->
<template>
  <div class="des-dv-chart-edit-container">
    <SettingDataOrigin class="data-setting" :owner="owner" @update-field-list="clearMapFieldList"></SettingDataOrigin>
    <div class="right">
      <el-scrollbar class="right-scroller">
        <div class="map-relation__item">
          <div class="map-relation__item-input">
            <div class="cell-item">
              <div class="config-title">是否树结构数据</div>
              <el-switch class="des-dv-switch" :disabled="owner.dataType === 'excel'" v-model="owner.isTreeData"> </el-switch>
            </div>
          </div>
        </div>
        <div class="map-relation__item" v-for="(item, index) in chartOptions.series" :key="`s_${index}`">
          <div class="map-relation__item-name">
            <div class="item-name">[{{ !item.hasNameRelation ? item.name : item.seriesNameRelation }}]</div>
            <span class="item-name margin-right">：开启映射</span>
            <DesDVSwitch v-model="item.hasNameRelation" />
          </div>

          <div class="map-relation__item-input wrapper">
            <div class="cell-item">
              <div class="config-title">系列名称</div>
              <SelectInput v-if="!item.hasNameRelation" v-model="item.name" :mapFieldList="[]" />
              <SelectInput v-else v-model="item.seriesNameRelation" :mapFieldList="mapFieldList" />
            </div>
            <div class="cell-item">
              <div class="config-title">标签字段</div>
              <SelectInput v-model="item.nameRelation" :mapFieldList="mapFieldList" />
            </div>
            <div class="cell-item">
              <div class="config-title">数值字段</div>
              <SelectInput v-model="item.valueRelation" :mapFieldList="mapFieldList" />
            </div>
            <!-- 平铺结构 -->
            <template v-if="!owner.isTreeData">
              <div class="cell-item">
                <div class="config-title">主键字段</div>
                <SelectInput v-model="item.idRelation" :mapFieldList="mapFieldList" />
              </div>
              <div class="cell-item">
                <div class="config-title">父键字段</div>
                <SelectInput v-model="item.pidRelation" :mapFieldList="mapFieldList" />
              </div>
              <div class="cell-item">
                <div class="config-title">顶层主键</div>
                <SelectInput v-model="item.rootId" :mapFieldList="[]" />
              </div>
            </template>
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
  name: "DesDVSunburstRelation",
  mixins: [$mixins.propertyDialogSetting, chartsHelper],
  components: { SelectInput, SettingDataOrigin },
  methods: {
    clearMapFieldList() {
      this.$nextTick(() => {
        this.mapFieldList = this.owner.$children[0].getDesignerMapFieldList();
        let newOption = dsf.eval(this.owner.chartString);
        this.chartOptions.series.map((item, index) => {
          if (newOption.series[index]) {
            this.$set(item, "valueRelation", newOption.series[index].valueRelation);
            this.$set(item, "nameRelation", newOption.series[index].nameRelation);
          }
        });
      });
    },
  },
};
</script>
<style lang="scss">
@import "_dataview/assets/styles/designer/DesDVMapRelation.scss";
</style>
