<!--
 * @Description:基础地图字段映射配置
 * @Author: zhanghang
 * @Date: 2021-07-28 14:38:59
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-07-21 18:25:32
-->
<template>
  <div class="des-dv-chart-edit-container">
    <SettingDataOrigin class="data-setting" :owner="owner" @update-field-list="clearMapFieldList"></SettingDataOrigin>
    <div class="right">
      <el-scrollbar class="right-scroller">
        <div class="nav-btn__wrapper">
          <div class="nav-btn__wrapper-item" @click="addItem('bar')">增加柱体</div>
          <div class="nav-btn__wrapper-item" @click="addItem('scatter')">增加散点</div>
          <div class="nav-btn__wrapper-item" @click="addItem('line')">增加折线</div>
        </div>
        <div class="map-relation__item">
          <div class="map-relation__item-input">
            <div class="cell-item">
              <div class="config-title">类目轴</div>
              <SelectInput v-model="category.nameRelation" :mapFieldList="mapFieldList" />
            </div>
          </div>
        </div>
        <div class="map-relation__item" v-for="(item, index) in chartOptions.series" :key="`s_${index}`">
          <div class="delete-series" @click="deleteSeries(index)">
            <DsfIcon name="del1" />
          </div>
          <div class="map-relation__item-name">
            <div class="item-type">{{ getTypeName(item) }}</div>
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
import defaultCreate from "_dataview/output/chartDefault/defaultPolar.js";
const SelectInput = Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_private" */ "../graph/selectInput.vue"));
const SettingDataOrigin = Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_private" */ "../settingDataOrigin.vue"));
export default {
  name: "DesDVPolarRelation",
  mixins: [$mixins.propertyDialogSetting, chartsHelper],
  components: {
    SettingDataOrigin,
    SelectInput,
  },
  computed: {
    category() {
      return this.chartOptions.angleAxis.type === "category" ? this.chartOptions.angleAxis : this.chartOptions.radiusAxis;
    },
  },
  methods: {
    deleteSeries(index) {
      this.chartOptions.series.splice(index, 1);
    },
    getTypeName(item) {
      let name = "";
      switch (item.type) {
        case "bar":
          name = "柱体";
          break;
        case "line":
          name = "折线";
          break;
        case "scatter":
          name = "散点";
          break;
      }
      return name;
    },
    //添加系列
    addItem(type) {
      let name = "";
      switch (type) {
        case "scatter":
          name = "散点";
          break;
        case "bar":
          name = "柱体";
          break;
        case "line":
          name = "折线";
          break;
        default:
          break;
      }
      name = name + Math.random().toString(16).slice(12);
      const data = defaultCreate(name, this.getNextColor(), type);
      data.name = name;
      data.nameRelation = name;
      this.chartOptions.series.push(data);
    },
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
        let newCategory = this.chartOptions.angleAxis.type === "category" ? newCategory.angleAxis : newCategory.radiusAxis;
        this.$set(this.category, "nameRelation", newCategory.nameRelation);
      });
    },
  },
};
</script>

<style lang="scss">
@import "_dataview/assets/styles/designer/DesDVMapRelation.scss";
</style>
