<!--
 * @Description: 
 * @Author: zhanghang
 * @Date: 2022-07-21 10:45:52
 * @LastEditors: zhanghang
 * @LastEditTime: 2022-09-22 11:05:46
-->
<template>
  <div
    class="data-view-item-wrap ds-control view-border-5 data-view-no-padding view-border-common"
    :style="controlHeight"
  >
    <div class="data-view-item-wrap-inner-box" :ref="ref" :style="controlStyle">
      <svg
        :class="`view-border-svg-container  ${reverse && 'view-reverse'}`"
        :width="realWidth"
        :height="realHeight"
      >
        <polygon
          :fill="backgroundColor"
          :points="`
        10, 22 ${realWidth - 22}, 22 ${realWidth - 22}, ${realHeight - 86} ${
            realWidth - 84
          }, ${realHeight - 24} 10, ${realHeight - 24}
      `"
        />
        <polyline
          class="view-bb5-line-1"
          :stroke="mainColor"
          :points="`8, 5 ${realWidth - 5}, 5 ${realWidth - 5}, ${
            realHeight - 100
          }
          ${realWidth - 100}, ${realHeight - 5} 8, ${realHeight - 5} 8, 5`"
        />
        <polyline
          class="view-bb5-line-2"
          :stroke="viceColor"
          :points="`3, 5 ${realWidth - 20}, 5 ${realWidth - 20}, ${
            realHeight - 60
          }
          ${realWidth - 74}, ${realHeight - 5} 3, ${realHeight - 5} 3, 5`"
        />
        <polyline
          class="view-bb5-line-3"
          :stroke="viceColor"
          :points="`50, 13 ${realWidth - 35}, 13`"
        />
        <polyline
          class="view-bb5-line-4"
          :stroke="viceColor"
          :points="`15, 20 ${realWidth - 35}, 20`"
        />
        <polyline
          class="view-bb5-line-5"
          :stroke="viceColor"
          :points="`15, ${realHeight - 20} ${realWidth - 110}, ${
            realHeight - 20
          }`"
        />
        <polyline
          class="view-bb5-line-6"
          :stroke="viceColor"
          :points="`15, ${realHeight - 13} ${realWidth - 110}, ${
            realHeight - 13
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
  name: "DsfDataViewBorder5",
  ctrlCaption: "边框组件5",
  mixins: [$mixins.dataView, border],
  props: {
    reverse: {
      type: Boolean,
      default: false,
    },
    comType: {
      type: String,
      default: "dsf.dataviewborder5",
    },
  },
  data() {
    return {
      ref: "view-border-5",
    };
  },
});
</script>
<style lang="scss">
 @import "_dataview/assets/styles/share/components/border.scss";
</style>