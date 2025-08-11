<!--
 * @Description: 
 * @Author: zhanghang
 * @Date: 2022-07-21 10:45:52
 * @LastEditors: shenah
 * @LastEditTime: 2024-09-06 09:09:48
-->
<template>
  <div
    class="data-view-item-wrap ds-control view-border-13 data-view-no-padding view-border-common"
    :style="controlHeight"
  >
    <div class="data-view-item-wrap-inner-box" :style="controlStyle" :ref="ref">
      <svg
        class="view-border-svg-container"
        :width="realWidth"
        :height="realHeight"
      >
        <path
          :fill="backgroundColor"
          :stroke="mainColor"
          :d="`
          M 5 20 L 5 10 L 12 3  L 60 3 L 68 10
          L ${realWidth - 20} 10 L ${realWidth - 5} 25
          L ${realWidth - 5} ${realHeight - 5} L 20 ${realHeight - 5}
          L 5 ${realHeight - 20} L 5 20
        `"
        />

        <path
          fill="transparent"
          stroke-width="3"
          stroke-linecap="round"
          stroke-dasharray="10, 5"
          :stroke="mainColor"
          :d="`M 16 9 L 61 9`"
        />

        <path
          fill="transparent"
          :stroke="viceColor"
          :d="`M 5 20 L 5 10 L 12 3  L 60 3 L 68 10`"
        />

        <path
          fill="transparent"
          :stroke="viceColor"
          :d="`M ${realWidth - 5} ${realHeight - 30} L ${realWidth - 5} ${
            realHeight - 5
          } L ${realWidth - 30} ${realHeight - 5}`"
        />
      </svg>

      <div
        class="border-box-content"
        :style="controlInnerStyle"
        slot-name="default"
      >
        <slot></slot>
      </div>
    </div>
  </div>
</template>
<script>
import border from "_dataview/mixins/border.js";
export default dsf.component({
  name: "DsfDataViewBorder13",
  ctrlCaption: "边框组件13",
  mixins: [$mixins.dataView, border],
  props: {
    comType: {
      type: String,
      default: "dsf.dataviewborder13",
    },
  },
  data() {
    return {
      ref: "view-border-13",
    };
  },
});
</script>
<style lang="scss">
@import "_dataview/assets/styles/share/components/border.scss";
</style>
