<!--
 * @Description: 
 * @Author: zhanghang
 * @Date: 2022-07-21 10:45:52
 * @LastEditors: zhanghang
 * @LastEditTime: 2023-11-06 17:28:33
-->
<template>
  <div
    class="data-view-item-wrap ds-control view-border-2 data-view-no-padding view-border-common"
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
        7, 7 ${realWidth - 7}, 7 ${realWidth - 7}, ${realHeight - 7} 7, ${
            realHeight - 7
          }
      `"
        />

        <polyline
          :stroke="mainColor"
          :points="`2, 2 ${realWidth - 2} ,2 ${realWidth - 2}, ${
            realHeight - 2
          } 2, ${realHeight - 2} 2, 2`"
        />
        <polyline
          :stroke="viceColor"
          :points="`6, 6 ${realWidth - 6}, 6 ${realWidth - 6}, ${
            realHeight - 6
          } 6, ${realHeight - 6} 6, 6`"
        />
        <circle :fill="mainColor" cx="11" cy="11" r="1" />
        <circle :fill="mainColor" :cx="realWidth - 11" cy="11" r="1" />
        <circle
          :fill="mainColor"
          :cx="realWidth - 11"
          :cy="realHeight - 11"
          r="1"
        />
        <circle :fill="mainColor" cx="11" :cy="realHeight - 11" r="1" />
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
  name: "DsfDataViewBorder2",
  ctrlCaption: "边框组件2",
  mixins: [$mixins.dataView, border],
  props: {
    comType: {
      type: String,
      default: "dsf.dataviewborder2",
    },
  },
  data() {
    return {
      ref: "view-border-2",
    };
  },
});
</script>
<style lang="scss">
@import "_dataview/assets/styles/share/components/border.scss";
</style>
