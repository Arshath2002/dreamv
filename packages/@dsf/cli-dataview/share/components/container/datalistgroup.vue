<!--
 * @Description: 
 * @Author: zhanghang
 * @Date: 2023-04-27 18:18:59
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-02-07 18:04:01
-->
<template>
  <div
    class="dsf-dv-list-group data-view-item-wrap ds-control data-view-no-padding"
    :style="{
      ...controlStyle,
      ...getCommonEnterAnimateStyle,
    }"
  >
    <div class="item-box">
      <div
        class="item"
        v-for="(d, index) in listData"
        :key="d.name"
        :style="itemStyle(index)"
      >
        <div
          class="list-group-slot-content"
          :slot-name="d.name"
        >
          <slot :name="d.name"></slot>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
var listData = [
  {
    width: "40%",
    height: "100px",
    name: "list-group-0",
    margin: [0, 0, 0, 0],
    controls: [],
  },
  {
    width: "60%",
    height: "100px",
    name: "list-group-1",
    margin: [0, 0, 0, 0],
    controls: [],
  },
  {
    width: "60%",
    height: "100px",
    name: "list-group-2",
    margin: [0, 0, 0, 0],
    controls: [],
  },
  {
    width: "40%",
    height: "150px",
    name: "list-group-3",
    margin: [0, 0, 0, 0],
    controls: [],
  },
];
export default dsf.component({
  name: "DsfDataListGroup",
  ctrlCaption: "自定义分组",
  mixins: [$mixins.dataView],
  props: {
    // 布局设置
    listData: {
      type: Array,
      default() {
        return _.cloneDeep(listData);
      },
    },
    height: {
      type: String,
      default: "100%",
    },
    slots: {
      type: Array,
      default: function () {
        return listData;
      },
    },
  },
  methods: {
    itemStyle(index) {
      let item = this.listData[index];
      let { width, height, margin } = item;
      let _margin = "";
      if (margin) {
        for (let i = 0; i < margin.length; i++) {
          let it = margin[i];
          _margin += dsf.dataview.utils.transformPx(it) + " ";
        }
      }
      let itemStyle = {
        margin: _margin,
        width: dsf.dataview.utils.transformPx(width, false),
        height: dsf.dataview.utils.transformPx(height, false),
      };
      if (this.isDesign) {
        itemStyle["border"] = "1px dashed #ddd";
      }
      return itemStyle;
    },
  },
});
</script>
<style lang="scss">
 @import "_dataview/assets/styles/share/components/DsfDataListGroup.scss";
</style>
