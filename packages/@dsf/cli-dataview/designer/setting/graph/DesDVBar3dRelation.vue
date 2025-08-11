<!--
 * @Editor: zhanghang
 * @Description: 
 * @Date: 2024-04-26 17:19:02
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-07-21 18:17:35
-->
<template>
  <div class="des-dv-chart-edit-container">
    <SettingDataOrigin class="data-setting" :owner="owner" @update-field-list="clearMapFieldList"></SettingDataOrigin>
    <div class="right">
      <el-scrollbar class="right-scroller">
        <div class="nav-btn__wrapper">
          <div class="nav-btn__wrapper-item" v-for="it in seriesItems" :key="it.value" @click="addItem(it.value)">{{ it.name }}</div>
        </div>
        <div class="map-relation__item" v-for="(it, index) in category" :key="index">
          <div class="map-relation__item-input">
            <div class="cell-item">
              <div class="config-title">类目轴</div>
              <SelectInput v-model="it.nameRelation" :mapFieldList="mapFieldList" />
            </div>
          </div>
        </div>
        <div class="map-relation__item" v-for="(item, index) in chartOptions.series" :key="`s_${index}`">
          <div class="delete-series" @click="deleteSeries(index)">
            <DsfIcon name="del1"></DsfIcon>
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
import { createBar3dSeries } from "_dataview/output/chartDefault/createBar3d.js";
import { createLineSeries } from "_dataview/output/chartDefault/createLine.js";
const SelectInput = Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_private" */ "../graph/selectInput.vue"));
const SettingDataOrigin = Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_private" */ "../settingDataOrigin.vue"));
export default {
  name: "DesDVBar3dRelation",
  mixins: [$mixins.propertyDialogSetting, chartsHelper],
  components: { SettingDataOrigin, SelectInput },
  props: ["config"],
  computed: {
    category() {
      return this.chartOptions.xAxis[0].type === "category" ? this.chartOptions.xAxis : this.chartOptions.yAxis;
    },
    seriesItems() {
      return [
        {
          name: "增加折线",
          value: "line",
        },
        {
          name: "增加圆柱",
          value: "clinder",
        },
        {
          name: "增加立方体",
          value: "cube",
        },
        {
          name: "增加柱泡图",
          value: "barbubble",
        },
        {
          name: "增加矩形",
          value: "rect",
        },
        {
          name: "增加圆锥",
          value: "cone",
        },
      ];
    },
  },
  methods: {
    deleteSeries(index) {
      this.chartOptions.series.splice(index, 1);
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
        let newCategory = this.chartOptions.xAxis[0].type === "category" ? newOption.xAxis : newOption.yAxis;
        this.category.map((item, index) => {
          if (newCategory[index]) {
            this.$set(item, "nameRelation", newCategory[index].nameRelation);
          }
        });
      });
    },
    //添加系列
    addItem(type) {
      let name = "";
      switch (type) {
        case "line":
          name = "折线";
          break;
        case "clinder":
          name = "圆柱";
          break;
        case "cube":
          name = "立方体";
          break;
        case "barbubble":
          name = "柱泡";
          break;
        case "rect":
          name = "矩形";
          break;
        case "cone":
          name = "圆锥";
          break;
        default:
          break;
      }
      let arr = [];
      for (let i = 0; i < 7; i++) {
        arr.push(Math.ceil(200 + Math.random() * 1200));
      }
      name = name + Math.random().toString(16).slice(12);
      const color = this.getNextColor();
      const seriesItem = type === "line" ? createLineSeries(name, color) : createBar3dSeries(name, type);
      seriesItem.name = name;
      seriesItem.data = arr;
      seriesItem.nameRelation = name;
      this.chartOptions.series.push(seriesItem);
    },
    getTypeName(item) {
      let name = "";
      if (item.type === "custom" && item.shape) {
        switch (item.shape) {
          case "clinder":
            name = "圆柱";
            break;
          case "cube":
            name = "立方体";
            break;
          case "barbubble":
            name = "柱泡";
            break;
          case "rect":
            name = "矩形";
            break;
          case "cone":
            name = "圆锥";
            break;
          default:
            break;
        }
      } else {
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
      }
      return name;
    },
  },
};
</script>
<style lang="scss">
@import "_dataview/assets/styles/designer/DesDVMapRelation.scss";
</style>
