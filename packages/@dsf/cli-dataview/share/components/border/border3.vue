<!--
 * @Description: 
 * @Author: zhanghang
 * @Date: 2022-07-21 10:45:52
 * @LastEditors: zhanghang
 * @LastEditTime: 2024-01-15 14:56:10
-->
<template>
  <div
    class="data-view-item-wrap ds-control view-border-3 data-view-no-padding view-border-common"
    :style="controlHeight"
  >
    <div class="data-view-item-wrap-inner-box" :ref="ref" :style="controlStyle">
      <svg
        class="view-border-svg-container"
        :width="realWidth"
        :height="realHeight"
      >
        <polygon
          :fill="backgroundColor"
          :points="`
        23, 23 ${realWidth - 24}, 23 ${realWidth - 24}, ${
            realHeight - 24
          } 23, ${realHeight - 24}
      `"
        />
        <polyline
          class="view-bb3-line1"
          :stroke="mainColor"
          :points="`4, 4 ${realWidth - 22} ,4 ${realWidth - 22}, ${
            realHeight - 22
          } 4, ${realHeight - 22} 4, 4`"
        />
        <polyline
          class="view-bb3-line2"
          :stroke="viceColor"
          :points="`10, 10 ${realWidth - 16}, 10 ${realWidth - 16}, ${
            realHeight - 16
          } 10, ${realHeight - 16} 10, 10`"
        />
        <polyline
          class="view-bb3-line2"
          :stroke="viceColor"
          :points="`16, 16 ${realWidth - 10}, 16 ${realWidth - 10}, ${
            realHeight - 10
          } 16, ${realHeight - 10} 16, 16`"
        />
        <polyline
          class="view-bb3-line2"
          :stroke="viceColor"
          :points="`22, 22 ${realWidth - 4}, 22 ${realWidth - 4}, ${
            realHeight - 4
          } 22, ${realHeight - 4} 22, 22`"
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
  name: "DsfDataViewBorder3",
  ctrlCaption: "边框组件3",
  mixins: [$mixins.dataView, border],
  props: {
    comType: {
      type: String,
      default: "dsf.dataviewborder3",
    },
  },
  data() {
    return {
      ref: "view-border-3",
    };
  },
});
</script>
<style lang="scss">
 @import "_dataview/assets/styles/share/components/border.scss";
</style>