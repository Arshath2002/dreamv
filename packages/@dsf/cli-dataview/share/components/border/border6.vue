<!--
 * @Description: 
 * @Author: zhanghang
 * @Date: 2022-07-21 10:45:52
 * @LastEditors: zhanghang
 * @LastEditTime: 2022-09-22 11:05:50
-->
<template>
  <div
    class="data-view-item-wrap ds-control view-border-6 data-view-no-padding view-border-common"
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
        9, 7 ${realWidth - 9}, 7 ${realWidth - 9}, ${realHeight - 7} 9, ${
            realHeight - 7
          }
      `"
        />
        <circle :fill="viceColor" cx="5" cy="5" r="2" />
        <circle :fill="viceColor" :cx="realWidth - 5" cy="5" r="2" />
        <circle
          :fill="viceColor"
          :cx="realWidth - 5"
          :cy="realHeight - 5"
          r="2"
        />
        <circle :fill="viceColor" cx="5" :cy="realHeight - 5" r="2" />
        <polyline :stroke="mainColor" :points="`10, 4 ${realWidth - 10}, 4`" />
        <polyline
          :stroke="mainColor"
          :points="`10, ${realHeight - 4} ${realWidth - 10}, ${realHeight - 4}`"
        />
        <polyline :stroke="mainColor" :points="`5, 70 5, ${realHeight - 70}`" />
        <polyline
          :stroke="mainColor"
          :points="`${realWidth - 5}, 70 ${realWidth - 5}, ${realHeight - 70}`"
        />
        <polyline :stroke="mainColor" :points="`3, 10, 3, 50`" />
        <polyline :stroke="mainColor" :points="`7, 30 7, 80`" />
        <polyline
          :stroke="mainColor"
          :points="`${realWidth - 3}, 10 ${realWidth - 3}, 50`"
        />
        <polyline
          :stroke="mainColor"
          :points="`${realWidth - 7}, 30 ${realWidth - 7}, 80`"
        />
        <polyline
          :stroke="mainColor"
          :points="`3, ${realHeight - 10} 3, ${realHeight - 50}`"
        />
        <polyline
          :stroke="mainColor"
          :points="`7, ${realHeight - 30} 7, ${realHeight - 80}`"
        />
        <polyline
          :stroke="mainColor"
          :points="`${realWidth - 3}, ${realHeight - 10} ${realWidth - 3}, ${
            realHeight - 50
          }`"
        />
        <polyline
          :stroke="mainColor"
          :points="`${realWidth - 7}, ${realHeight - 30} ${realWidth - 7}, ${
            realHeight - 80
          }`"
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
  name: "DsfDataViewBorder6",
  ctrlCaption: "边框组件6",
  mixins: [$mixins.dataView, border],
  props: {
    comType: {
      type: String,
      default: "dsf.dataviewborder6",
    },
  },
  data() {
    return {
      ref: "view-border-6",
    };
  },
});
</script>
<style lang="scss">
@import "_dataview/assets/styles/share/components/border.scss";
</style>
