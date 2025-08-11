<!--
 * @Description:基础地图字段映射配置
 * @Author: zhanghang
 * @Date: 2021-07-28 14:38:59
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-07-22 10:30:47
-->
<template>
  <div class="des-dv-chart-edit-container">
    <SettingDataOrigin class="data-setting" :owner="owner" @update-field-list="clearMapFieldList"></SettingDataOrigin>
    <div class="right">
      <el-scrollbar class="right-scroller">
        <div class="nav-btn__wrapper">
          <div class="nav-btn__wrapper-item" @click="addScatter('scatter')">增加撒点</div>
          <div class="nav-btn__wrapper-item" @click="addScatter('clinder')">增加柱体</div>
          <div class="nav-btn__wrapper-item" @click="addFlyLine">增加飞行线</div>
          <div class="nav-btn__wrapper-item" :class="{ active: isVisual }" @click="changeVisual">展示热力图</div>
        </div>
        <div v-show="item.type != 'map' || (isVisual && item.type == 'map')" class="map-relation__item" v-for="(item, index) in chartOptions.series" :key="`s_${index}`">
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
            <template v-if="item.type === 'lines'">
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
import { createFlySeries } from "_dataview/output/mapDefault/flyLineSeries.js";
const SelectInput = Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_private" */ "../graph/selectInput.vue"));
const SettingDataOrigin = Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_private" */ "../settingDataOrigin.vue"));
export default {
  name: "DesDVBaseMapRelation",
  mixins: [$mixins.propertyDialogSetting, chartsHelper],
  components: {
    SettingDataOrigin,
    SelectInput,
  },
  computed: {
    isVisual: {
      get() {
        return !this.chartOptions.visualMap.seriesIndex;
      },
      set(val) {
        if (val) {
          this.chartOptions.visualMap.seriesIndex = 0;
          this.chartOptions.visualMap.show = true;
        } else {
          this.chartOptions.visualMap.seriesIndex = -1;
          this.chartOptions.visualMap.show = false;
        }
      },
    },
  },
  methods: {
    deleteSeries(index) {
      this.chartOptions.series.splice(index, 1);
    },
    getTypeName(item) {
      let name = "";
      switch (item.type) {
        case "map":
          name = "热力图";
          break;
        case "lines":
          name = "飞行线";
          break;
        case "effectScatter":
          name = "撒点";
          break;
        case "scatter":
          if (item.shape) {
            name = "柱体";
          } else {
            name = "撒点";
          }
          break;
      }
      return name;
    },
    //添加撒点图
    addScatter(type) {
      //如果是柱体-默认为圆柱
      const data = this.owner.getMapShapeDefault(type);
      let name = "";
      switch (type) {
        case "scatter":
          name = "撒点";
          break;
        case "clinder":
          name = "3d圆柱";
          break;
        default:
          break;
      }
      name = name + Math.random().toString(16).slice(12);
      data.name = name;
      data.seriesNameRelation = name;
      data.hasNameRelation = false;
      this.chartOptions.series.push(data);
    },
    //添加飞行线
    addFlyLine() {
      let name = "飞行线" + Math.random().toString(16).slice(12);
      const data = createFlySeries();
      data.name = name;
      data.seriesNameRelation = name;
      data.hasNameRelation = false;
      this.chartOptions.series.push(data);
    },
    //切换热力图
    changeVisual() {
      this.isVisual = !this.isVisual;
    },
    clearMapFieldList() {
      this.chartOptions.series.forEach((it) => {
        it.valueRelation = "";
        it.nameRelation = "";
      });
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
