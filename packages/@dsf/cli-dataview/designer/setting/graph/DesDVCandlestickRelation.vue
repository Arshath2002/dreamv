<!--
 * @Description: K线图的映射关系
 * @Author: shenah
 * @Date: 2024-07-05 10:15:54
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-07-21 18:36:13
-->

<template>
  <div class="des-dv-chart-edit-container">
    <SettingDataOrigin class="data-setting" :owner="owner" @update-field-list="clearMapFieldList"></SettingDataOrigin>
    <div class="right">
      <el-scrollbar class="right-scroller">
        <div class="nav-btn__wrapper">
          <div class="nav-btn__wrapper-item" v-for="it in seriesItems" :key="it.value" @click="addItem(it.value)">
            {{ it.name }}
          </div>
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
          <div class="map-relation__item-input wrapper">
            <div class="cell-item">
              <div class="config-title first" style="width: 60px">系列名称</div>
              <SelectInput v-if="!item.hasNameRelation" v-model="item.name" :mapFieldList="[]" />
              <SelectInput v-else v-model="item.seriesNameRelation" :mapFieldList="mapFieldList" />
            </div>
            <template v-if="item.type === 'candlestick'">
              <div class="cell-item">
                <div class="config-title" style="width: 60px">开盘值</div>
                <SelectInput v-model="item.openRelation" :mapFieldList="mapFieldList" />
              </div>
              <div class="cell-item">
                <div class="config-title" style="width: 60px">收盘值</div>
                <SelectInput v-model="item.closeRelation" :mapFieldList="mapFieldList" />
              </div>
              <div class="cell-item">
                <div class="config-title" style="width: 60px">最低值</div>
                <SelectInput v-model="item.lowestRelation" :mapFieldList="mapFieldList" />
              </div>
              <div class="cell-item">
                <div class="config-title" style="width: 60px">最高值</div>
                <SelectInput v-model="item.highestRelation" :mapFieldList="mapFieldList" />
              </div>
            </template>
            <template v-else>
              <div class="cell-item">
                <div class="config-title" style="width: 60px">值</div>
                <SelectInput v-model="item.valueRelation" :mapFieldList="mapFieldList" />
              </div>
            </template>
          </div>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>
<script>
import chartsHelper from "./chartsHelper";
import { defaultCandlestick } from "_dataview/output/chartDefault/candlestick.js";
import { createLineSeries } from "_dataview/output/chartDefault/createLine.js";
const SelectInput = Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_private" */ "./selectInput.vue"));
const SettingDataOrigin = Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_private" */ "../settingDataOrigin.vue"));
export default {
  name: "DesDVCandlestickRelation",
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
          name: "增加K线",
          value: "candlestick",
        },
        {
          name: "增加折线",
          value: "line",
        },
      ];
    },
  },
  methods: {
    deleteSeries(index) {
      this.chartOptions.series.splice(index, 1);
    },
    clearMapFieldList() {

    },
    //添加系列
    addItem(type) {
      let name = "";
      const lineColor = this.getNextColor();
      const colors = this.getNewNextColor();
      let data = {};
      switch (type) {
        case "candlestick":
          name = "K线";
          data = defaultCandlestick(name, colors);
          break;
        case "line":
          name = "折线";
          data = createLineSeries(name, lineColor);
          break;
        default:
          break;
      }
      name = name + Math.random().toString(16).slice(12);
      data.name = name;
      data.nameRelation = name;
      //构造随机数据
      data.data = data.data.map((it) => {
        if (type === "candlestick") {
          let one = Math.ceil(20 + Math.random() * 1000);
          let two = Math.ceil(20 + Math.random() * 1000);
          let three = Math.ceil(20 + Math.random() * 1000);
          let four = Math.ceil(20 + Math.random() * 1000);
          let resultArr = [one, two, three, four];
          if (dsf.isObject(it)) {
            it.value = resultArr;
          } else {
            it = resultArr;
          }
        } else {
          if (dsf.isObject(it)) {
            it.value = Math.ceil(20 + Math.random() * 1000);
          } else {
            it = Math.ceil(20 + Math.random() * 1000);
          }
        }
        return it;
      });
      this.chartOptions.series.push(data);
    },
    getTypeName(item) {
      let name = "";
      switch (item.type) {
        case "candlestick":
          name = "K线";
          break;
        case "line":
          name = "折线";
          break;
      }
      return name;
    },
    getNewNextColor() {
      let colors = this.chartOptions.color;
      let colorLength = this.chartOptions.color.length;
      const series = this.chartOptions.series;
      let len = series.length;
      let next = colors[len] || colors[colorLength - 1];
      let next0 = colors[len + 1] || colors[colorLength - 1];
      return [next, next0];
    },
  },
};
</script>
<style lang="scss">
@import "_dataview/assets/styles/designer/DesDVMapRelation.scss";
</style>
