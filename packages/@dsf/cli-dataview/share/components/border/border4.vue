<!--
 * @Description: 
 * @Author: zhanghang
 * @Date: 2022-07-21 10:45:52
 * @LastEditors: zhanghang
 * @LastEditTime: 2022-09-22 11:05:41
-->
<template>
  <div
    class="data-view-item-wrap ds-control view-border-4 data-view-no-padding view-border-common"
    :style="controlHeight"
  >
    <div class="data-view-item-wrap-inner-box" :ref="ref" :style="controlStyle">
      <svg
        :class="`view-border-svg-container ${reverse && 'view-reverse'}`"
        :width="realWidth"
        :height="realHeight"
      >
        <polygon
          :fill="backgroundColor"
          :points="`
        ${realWidth - 15}, 22 170, 22 150, 7 40, 7 28, 21 32, 24
        16, 42 16, ${realHeight - 32} 41, ${realHeight - 7} ${realWidth - 15}, ${realHeight - 7}
      `" />
        <polyline
          class="view-bb4-line-1"
          :stroke="mainColor"
          :points="`145, ${realHeight - 5} 40, ${realHeight - 5} 10, ${realHeight - 35}
          10, 40 40, 5 150, 5 170, 20 ${realWidth - 15}, 20`"
        />
        <polyline
          :stroke="viceColor"
          class="view-bb4-line-2"
          :points="`245, ${realHeight - 1} 36, ${realHeight - 1} 14, ${realHeight - 23}
          14, ${realHeight - 100}`"
        />

        <polyline
          class="view-bb4-line-3"
          :stroke="mainColor"
          :points="`7, ${realHeight - 40} 7, ${realHeight - 75}`"
        />
        <polyline
          class="view-bb4-line-4"
          :stroke="mainColor"
          :points="`28, 24 13, 41 13, 64`"
        />
        <polyline
          class="view-bb4-line-5"
          :stroke="mainColor"
          :points="`5, 45 5, 140`"
        />
        <polyline
          class="view-bb4-line-6"
          :stroke="viceColor"
          :points="`14, 75 14, 180`"
        />
        <polyline
          class="view-bb4-line-7"
          :stroke="viceColor"
          :points="`55, 11 147, 11 167, 26 250, 26`"
        />
        <polyline
          class="view-bb4-line-8"
          :stroke="viceColor"
          :points="`158, 5 173, 16`"
        />
        <polyline
          class="view-bb4-line-9"
          :stroke="mainColor"
          :points="`200, 17 ${realWidth - 10}, 17`"
        />
        <polyline
          class="view-bb4-line-10"
          :stroke="viceColor"
          :points="`385, 17 ${realWidth - 10}, 17`"
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
  name: "DsfDataViewBorder4",
  ctrlCaption: "边框组件4",
  mixins: [$mixins.dataView, border],
  props: {
    reverse: {
      type: Boolean,
      default: false,
    },
    comType:{
      type:String,
      default:'dsf.dataviewborder4'
    }
  },
  data() {
    return {
      ref: "view-border-4",
    };
  }
});
</script>
<style lang="scss">
 @import "_dataview/assets/styles/share/components/border.scss";
</style>