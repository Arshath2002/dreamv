<!--
 * @Editor: zhanghang
 * @Description: 
 * @Date: 2024-04-26 17:19:02
 * @LastEditors: shenah
 * @LastEditTime: 2024-07-22 09:35:39
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
          <div class="up-series" @click="moveOneSeries('up', index)">
            <DsfIcon name="shang" />
          </div>
          <div class="down-series" @click="moveOneSeries('down', index)">
            <DsfIcon name="xia" />
          </div>
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
            <div class="cell-item" v-if="item.type === 'scatter'">
              <div class="config-title first">标签</div>
              <SelectInput v-model="item.labelRelation" :mapFieldList="mapFieldList" />
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
import { createBarSeries } from "_dataview/output/chartDefault/createBar.js";
import { createLineSeries } from "_dataview/output/chartDefault/createLine.js";
import { createPictorialBarSeries } from "_dataview/output/chartDefault/createPictorialBar.js";
import { createScatterSeries } from "_dataview/output/chartDefault/createScatter.js";
const SelectInput = Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_private" */ "./selectInput.vue"));
const SettingDataOrigin = Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_private" */ "../settingDataOrigin.vue"));
export default {
  name: "DesDVScatterRelation",
  mixins: [$mixins.propertyDialogSetting, chartsHelper],
  components: { SettingDataOrigin, SelectInput },
  props: ["config"],
  computed: {
    category() {
      return this.chartOptions.xAxis[0].type === "category" ? this.chartOptions.xAxis : this.chartOptions.yAxis;
    },
    seriesItems() {
      let seriesItems = [];
      switch (this.config.axisType) {
        case "line":
          seriesItems = [
            {
              name: "增加折线",
              value: "line",
            },
          ];
          break;
        case "bar":
          seriesItems = [
            {
              name: "增加柱体",
              value: "bar",
            },
          ];
          break;
        case "pictorialBar":
          seriesItems = [
            {
              name: "增加柱体",
              value: "bar",
            },
            {
              name: "增加折线",
              value: "line",
            },
            {
              name: "增加象形图",
              value: "pictorialBar",
            },
          ];
          break;
        case "scatter":
          seriesItems = [
            {
              name: "增加柱体",
              value: "bar",
            },
            {
              name: "增加折线",
              value: "line",
            },
            {
              name: "增加散点",
              value: "scatter",
            },
          ];
          break;

        default:
          seriesItems = [
            {
              name: "增加柱体",
              value: "bar",
            },
            {
              name: "增加折线",
              value: "line",
            },
          ];
          break;
      }
      return seriesItems;
    },
  },
  methods: {
    moveOneSeries(direction, index) {
      let arr = dsf.dataview.utils.moveOneArray(this.chartOptions.series, index, direction, false);
      this.chartOptions.series = arr;
    },
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
            this.$set(item, "labelRelation", newOption.series[index].labelRelation);
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
      const color = this.getNextColor();
      let data = {};
      switch (type) {
        case "bar":
          name = "柱体";
          data = createBarSeries(name, color);
          break;
        case "line":
          name = "折线";
          data = createLineSeries(name, color);
          break;
        case "pictorialBar":
          name = "象形";
          data = createPictorialBarSeries(name, color);
          break;
        case "scatter":
          name = "散点";
          data = createScatterSeries(name, color);
          break;

        default:
          break;
      }
      name = name + Math.random().toString(16).slice(12);
      data.name = name;
      data.nameRelation = name;

      //构造随机数据
      data.data = data.data.map((it) => {
        if (dsf.isObject(it)) {
          it.value = Math.ceil(200 + Math.random() * 1200);
        } else {
          it = Math.ceil(200 + Math.random() * 1200);
        }
        return it;
      });
      this.chartOptions.series.push(data);
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
        case "pictorialBar":
          name = "象形图";
          break;
        case "scatter":
          name = "散点图";
          break;
      }
      return name;
    },
  },
};
</script>
<style lang="scss">
@import "_dataview/assets/styles/designer/DesDVMapRelation.scss";
</style>
