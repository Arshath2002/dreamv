<!--
 * @Description: 柱图控件
 * @Author: zhanghang
 * @Date: 2021-07-27 13:46:03
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-07-22 09:52:05
-->
<template>
  <div
    class="data-view-item-wrap ds-control data-view-map data-view-no-padding ds-chart data-view-parent-slot-wrap"
    :style="{
      ...controlStyle,
      ...getCommonEnterAnimateStyle,
    }"
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
import { createFlyMap } from "_dataview/output/mapDefault/flyLineMap.js";
import slotPageManage from "_dataview/mixins/slotPageManage.js";
import mapCustom from "_dataview/mixins/mapCustom.js";
import map from "_dataview/mixins/map.js";
const staticDataKeyDic = {
  start: "起点",
  end: "终点",
};
const staticData = [
  {
    start: "北京",
    end: "上海",
  },
  {
    start: "北京",
    end: "四川",
  },
  {
    start: "北京",
    end: "西藏",
  },
  {
    start: "北京",
    end: "青海",
  },
];

export default dsf.component({
  name: "DsfDataViewFlyLineMap",
  ctrlCaption: "飞行地图",
  mixins: [$mixins.dataView, map, mapCustom, slotPageManage],
  props: {
    //自定义配置总览
    chart: {
      type: Object,
      default() {
        return createFlyMap();
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
    defaultSeries: {
      type: String,
      default: "1",
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

  methods: {
    getDefaultData() {
      return createFlyMap();
    },
  },
});
</script>
