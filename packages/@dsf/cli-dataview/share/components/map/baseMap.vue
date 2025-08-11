<!--
 * @Description: 柱图控件
 * @Author: zhanghang
 * @Date: 2021-07-27 13:46:03
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-04-25 09:43:07
-->
<template>
  <div
    class="data-view-item-wrap ds-control data-view-map data-view-no-padding ds-chart data-view-parent-slot-wrap"
    :style="{
      ...controlStyle,
      ...getCommonEnterAnimateStyle,
    }"
    v-loading="dataLoad"
    :element-loading-text="loadingText"
    :element-loading-spinner="loadingSpinner"
    :element-loading-background="loadingBackground"
  >
    <template v-for="(item, _idx) in slotAttrMap">
      <div
        :key="_idx"
        v-if="item.isDisplay"
        :style="item.nameStyle"
        :slot-name="item.slotName"
        :class="{
          'slot-common-block-wrap': isDesign,
          [item.className]: true,
        }"
      >
        <slot :name="item.slotName"></slot>
      </div>
    </template>
    <div v-if="mapButtonGroupAttr.show" :class="mapButtonGroupAttr.slotName" class="button-group-connect-slot" :style="mapButtonGroupAttr.slotParentStyle">
      <div v-for="(item, idx) in mapButtonGroupAttr.buttons" class="button-group-connect-slot-item" :style="mapButtonGroupAttr.slotChildStyle" :key="idx" @click="handlemapButtonGroupClick(idx)">
        <DsfIcon :name="item.icon" :style="mapButtonGroupAttr.slotSpanStyle"></DsfIcon>
      </div>
    </div>
    <div class="back-map" @click="backMapFn" :style="backStyle" v-if="showBack">
      <template v-if="isDesign">
        <DsfIcon name="zuo" :style="{ fontSize: backStyle.fontSize }" />
      </template>
      <template v-else>
        <DsfIcon name="zuo" :style="{ fontSize: backStyle.fontSize }" />
        {{ mapNames[mapNames.length - 2].name }}
      </template>
    </div>
    <div class="chart" ref="chart"></div>
    <slot></slot>
  </div>
</template>
<script>
import { createMap } from "_dataview/output/mapDefault/baseMap.js";
import slotPageManage from "_dataview/mixins/slotPageManage.js";
import map from "_dataview/mixins/map.js";
import mapCustom from "_dataview/mixins/mapCustom.js";
const staticDataKeyDic = {
  name: "名称",
  value: "人口(万)",
  percent: "百分比",
};
const staticData = [
  {
    name: "北京",
    value: 320,
    percent: "20",
  },
  {
    name: "上海",
    value: 200,
    percent: "30",
  },
  {
    name: "四川",
    value: 9,
    percent: "55",
  },
  {
    name: "西藏",
    value: 30,
    percent: "79",
  },
  {
    name: "青海",
    value: 333,
    percent: "70",
  },
];

export default dsf.component({
  name: "DsfDataViewBaseMap",
  ctrlCaption: "基础地图",
  mixins: [$mixins.dataView, map, mapCustom, slotPageManage],
  props: {
    //自定义配置总览
    chart: {
      type: Object,
      default() {
        return createMap();
      },
    },

    slots: {
      type: Array,
      default() {
        return [
          {
            name: "default",
            controls: [],
          },
          {
            name: "top-left",
            controls: [],
          },
          {
            name: "top-right",
            controls: [],
          },
          {
            name: "bottom-left",
            controls: [],
          },
          {
            name: "bottom-right",
            controls: [],
          },
        ];
      },
    },
    excelData: {
      type: Array,
      default: () => {
        return dsf.dataview.utils.transformToExcelData(staticData, staticDataKeyDic);
      },
    },
    staticData: {
      type: Array,
      default() {
        return staticData;
      },
    },
  },
});
</script>
