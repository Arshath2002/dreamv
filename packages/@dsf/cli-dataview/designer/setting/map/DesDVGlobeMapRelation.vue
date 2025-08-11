<!--
 * @Description: 地球仪映射配置
 * @Author: shenah
 * @Date: 2024-07-24 14:35:02
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-07-22 09:39:28
-->

<template>
  <div class="des-dv-chart-edit-container">
    <SettingDataOrigin class="data-setting" :owner="owner" @update-field-list="clearMapFieldList"></SettingDataOrigin>
    <div class="right">
      <el-scrollbar class="right-scroller">
        <div class="nav-btn__wrapper">
          <div class="nav-btn__wrapper-item" @click="addDataType('scatter3D')">增加散点</div>
          <div class="nav-btn__wrapper-item" @click="addDataType('lines3D')">增加飞行线</div>
        </div>
        <div class="map-relation__item">
          <div class="map-relation__item-name">
            <div class="item-type">区域</div>
            <div class="item-name">[{{ !areaSeries.hasNameRelation ? areaSeries.name : areaSeries.seriesNameRelation }}]</div>
            <span class="item-name margin-right">：开启映射</span>
            <DesDVSwitch v-model="areaSeries.hasNameRelation" />
          </div>
          <div class="map-relation__item-input">
            <div class="cell-item">
              <div class="config-title first">系列名称</div>
              <SelectInput v-if="!areaSeries.hasNameRelation" v-model="areaSeries.name" :mapFieldList="[]" />
              <SelectInput v-else v-model="areaSeries.seriesNameRelation" :mapFieldList="mapFieldList" />
            </div>
            <div class="cell-item first">
              <div class="config-title">地区</div>
              <SelectInput v-model="areaSeries.nameRelation" :mapFieldList="mapFieldList" />
            </div>
            <div class="cell-item first">
              <div class="config-title">值</div>
              <SelectInput v-model="areaSeries.valueRelation" :mapFieldList="mapFieldList" />
            </div>
          </div>
        </div>
        <div class="map-relation__item" v-for="(item, index) in chartOptions.series" :key="`s_${index}`">
          <div class="delete-series" @click="deleteSeries(index)" v-if="item.type != 'map'">
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
            <template v-if="item.type === 'lines3D'">
              <div class="cell-item">
                <div class="config-title">起点</div>
                <SelectInput v-model="item.startRelation" :mapFieldList="mapFieldList" />
              </div>
              <div class="cell-item">
                <div class="config-title">终点</div>
                <SelectInput v-model="item.endRelation" :mapFieldList="mapFieldList" />
              </div>
            </template>
            <template v-else>
              <div class="cell-item">
                <div class="config-title">地区</div>
                <SelectInput v-model="item.nameRelation" :mapFieldList="mapFieldList" />
              </div>
              <div class="cell-item">
                <div class="config-title">值</div>
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
import chartsHelper from "../graph/chartsHelper";
import { createFlySeries } from "_dataview/output/mapDefault/globeMap/flyLineSeries.js";
import { createScatter } from "_dataview/output/mapDefault/globeMap/scatter3DSeries.js";
const SelectInput = Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_private" */ "../graph/selectInput.vue"));
const SettingDataOrigin = Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_private" */ "../settingDataOrigin.vue"));
export default {
  name: "DesDVGlobeMapRelation",
  mixins: [$mixins.propertyDialogSetting, chartsHelper],
  components: {
    SettingDataOrigin,
    SelectInput,
  },
  computed: {
    areaSeries() {
      return this.chartOptions.baseTextureOptions.series[0];
    },
  },
  methods: {
    deleteSeries(index) {
      this.chartOptions.series.splice(index, 1);
    },
    getTypeName(item) {
      let name = "";
      switch (item.type) {
        case "lines":
          name = "飞行线";
          break;
        case "scatter3D":
          name = "散点";
          break;
      }
      return name;
    },
    addDataType(type) {
      let map = {
        scatter3D: {
          name: "散点",
          config: createScatter(),
        },
        lines3D: {
          name: "飞行线",
          config: createFlySeries(),
        },
      };
      let nowInfo = map[type];
      let name = nowInfo.name + Math.random().toString(16).slice(12);
      const data = nowInfo.config;
      data.name = name;
      data.seriesNameRelation = name;
      this.chartOptions.series.push(data);
    },
    clearMapFieldList() {
      this.chartOptions.series.forEach((it) => {
        it.valueRelation = "";
        it.nameRelation = "";
        if (it.type === "lines3D") {
          it.startRelation = "";
          it.endRelation = "";
        }
      });
      this.chartOptions.baseTextureOptions.series[0].nameRelation = "";
      this.chartOptions.baseTextureOptions.series[0].valueRelation = "";
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
