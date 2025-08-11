<!--
 * @Editor: zhanghang
 * @Description: 动态组件容器
 * @Date: 2025-06-10 09:38:34
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-06-10 16:33:21
-->

<template>
  <div
    class="dsf-dv-dynamic-group data-view-item-wrap ds-control"
    :style="{
      ...controlStyle,
      ...getCommonEnterAnimateStyle,
    }"
  >
    <dsf-virtual-scroll :class="[align.vAlign]" :isDesign="isDesign">
      <div :style="wrapStyle" class="component-wrap">
        <template v-if="isDesign">
          <div :style="itemStyle" class="component-wrap-item" v-for="item in slots" :key="item.name" :slot-name="item.name">
            <slot :name="item.name">
              <div class="empty-slot">
                {{ item.name }}
              </div>
            </slot>
          </div>
        </template>
        <template v-else>
          <div :style="itemStyle" class="component-wrap-item" v-for="(item, index) in data" :key="index">
            <template v-if="componentSlots[index % componentSlots.length] && componentSlots[index % componentSlots.length].controls">
              <ComponentTree v-for="child in componentSlots[index % componentSlots.length].controls" :key="child.designId" :component-props="getChildProps(child, item)" :is-design="isDesign" />
            </template>
          </div>
        </template>
      </div>
    </dsf-virtual-scroll>
  </div>
</template>
<script>
import dataAnalysis from "_dataview/mixins/dataAnalysis.js";
import ComponentTree from "_dataview/share/common/components/ComponentTree.vue";
import componentContainer from "./componentContainer.js";
const staticDataKeyDic = {
  name: "name",
  value: "value",
};
const staticData = [
  {
    name: "工业增加值",
    value: 148.6,
  },
  {
    name: "农业增加值",
    value: 168.6,
  },
  {
    name: "互联网增加值",
    value: 118.6,
  },
  {
    name: "房产增加值",
    value: 128.6,
  },
];
export default dsf.component({
  name: "DsfDataViewDynamicGroup",
  ctrlCaption: "动态组件容器",
  components: { ComponentTree },
  mixins: [$mixins.dataView, dataAnalysis, componentContainer],
  props: {
    // 内边距（上、右、下、左）
    padding: {
      type: Array,
      default() {
        return [15, 15, 15, 15];
      },
    },
    // 单元内边距
    innerPadding: {
      type: Array,
      default: () => [5, 5, 5, 5],
    },
    // 布局模式 fix 固定一行个数，size 固定大小
    sizeMode: {
      type: String,
      default: "fix",
    },
    // 固定一行个数
    fixNum: {
      type: Number,
      default: 4,
    },
    // 行高
    rowHeight: {
      type: String,
      default: "150",
    },
    // 固定大小
    size: {
      type: String,
      default: "150",
    },
    // 对齐方式
    align: {
      type: Object,
      default() {
        return {
          hAlign: "flex-start",
          vAlign: "top",
        };
      },
    },
    slots: {
      type: Array,
      default() {
        return [
          {
            label: "carousel_1",
            name: "carousel_1",
            controls: [],
          },
        ];
      },
    },
    // 静态数据
    staticData: {
      type: Array,
      default() {
        return staticData;
      },
    },
    // 表格数据
    excelData: {
      type: Array,
      default: () => {
        return dsf.dataview.utils.transformToExcelData(staticData, staticDataKeyDic);
      },
    },
  },
  computed: {
    itemStyle() {
      const { rowHeight, innerPadding, sizeMode, fixNum, size } = this;
      const padding = dsf.dataview.utils.transformArrayPx(innerPadding);
      const style = {
        height: dsf.dataview.utils.transformPx(rowHeight),
        padding,
      };
      // 固定个数
      if (sizeMode === "fix") {
        const property = (100 / fixNum).toFixed(2);
        style["width"] = `${property}%`;
      } else {
        const _size = dsf.dataview.utils.transformPx(size);
        style["width"] = `${_size}`;
      }
      return style;
    },
    wrapStyle() {
      const { align } = this;
      return {
        "justify-content": align.hAlign,
      };
    },
  },
  methods: {
    designerUpdateChildrenData() {
      this.updateCommonChildrenData();
    },
    dataAnalysis(data) {
      this.data = data;
      //设计器更新组件数据
      if (this.isDesign) {
        this.designerUpdateChildrenData();
      }
    },
  },
});
</script>
<style lang="scss">
@import "_dataview/assets/styles/share/components/DsfDataViewDynamicGroup.scss";
</style>
