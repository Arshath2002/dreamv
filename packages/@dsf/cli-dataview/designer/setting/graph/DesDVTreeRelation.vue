<!--
 * @Editor: zhanghang
 * @Description: 
 * @Date: 2024-04-26 17:19:02
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-07-21 18:00:35
-->
<template>
  <div class="des-dv-chart-edit-container">
    <SettingDataOrigin class="data-setting" :owner="owner"></SettingDataOrigin>
    <div class="right">
      <el-scrollbar class="right-scroller">
        <div class="ds-key-relation map-relation__item">
          <div class="map-relation__item-input">
            <div class="cell-item">
              <div class="config-title">主键字段</div>
              <SelectInput v-model="keyField" :mapFieldList="mapFieldList" @change="changeKeyField" />
            </div>
            <div class="cell-item">
              <div class="config-title">父主键字段</div>
              <SelectInput v-model="ParentKeyField" :mapFieldList="mapFieldList" @change="changeParentKeyField" />
            </div>
          </div>
        </div>
        <div class="map-relation__item" v-for="(item, index) in chartOptions.series" :key="`s_${index}`">
          <div class="map-relation__item-name">
            <div class="item-type">树图</div>
            <div class="item-name">[{{ !item.hasNameRelation ? item.name : item.seriesNameRelation }}]</div>
            <span class="item-name margin-right">：开启映射</span>
            <DesDVSwitch v-model="item.hasNameRelation" />
          </div>
          <div class="map-relation__item-input">
            <div class="cell-item">
              <!-- 仪表盘 -->
              <div class="config-title first">系列名称</div>
              <SelectInput v-if="!item.hasNameRelation" v-model="item.name" :mapFieldList="[]" />
              <SelectInput v-else v-model="item.seriesNameRelation" :mapFieldList="mapFieldList" />
            </div>
            <div class="cell-item">
              <div class="config-title">名称</div>
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
import chartsHelper from "./chartsHelper";
const SelectInput = Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_private" */ "./selectInput.vue"));
const SettingDataOrigin = Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_private" */ "../settingDataOrigin.vue"));
export default {
  name: "DesDVTreeRelation",
  mixins: [$mixins.propertyDialogSetting, chartsHelper],
  components: { SettingDataOrigin, SelectInput },
  data() {
    return {
      keyField: "keyId",
      ParentKeyField: "keyPid",
    };
  },
  methods: {
    clearMapFieldList() {

    },
    changeKeyField(val) {
      this.owner.keyId = val;
    },
    changeParentKeyField(val) {
      this.owner.keyPid = val;
    },
  },
};
</script>
<style lang="scss">
@import "_dataview/assets/styles/designer/DesDVMapRelation.scss";
</style>
