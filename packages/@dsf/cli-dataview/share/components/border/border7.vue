<!--
 * @Description: 
 * @Author: zhanghang
 * @Date: 2022-07-21 10:45:52
 * @LastEditors: zhanghang
 * @LastEditTime: 2022-09-22 11:05:53
-->
<template>
  <div
    class="data-view-item-wrap ds-control view-border-7 data-view-no-padding view-border-common"
    :style="controlHeight"
  >
    <div class="data-view-item-wrap-inner-box" :ref="ref" :style="controlStyle">
      <svg
        class="view-border-svg-container"
        :width="realWidth"
        :height="realHeight"
      >
        <polyline
          class="view-bb7-line-width-2"
          :stroke="mainColor"
          :points="`0, 25 0, 0 25, 0`"
        />
        <polyline
          class="view-bb7-line-width-2"
          :stroke="mainColor"
          :points="`${realWidth - 25}, 0 ${realWidth}, 0 ${realWidth}, 25`"
        />
        <polyline
          class="view-bb7-line-width-2"
          :stroke="mainColor"
          :points="`${
            realWidth - 25
          }, ${realHeight} ${realWidth}, ${realHeight} ${realWidth}, ${
            realHeight - 25
          }`"
        />
        <polyline
          class="view-bb7-line-width-2"
          :stroke="mainColor"
          :points="`0, ${realHeight - 25} 0, ${realHeight} 25, ${realHeight}`"
        />

        <polyline
          class="view-bb7-line-width-5"
          :stroke="viceColor"
          :points="`0, 10 0, 0 10, 0`"
        />
        <polyline
          class="view-bb7-line-width-5"
          :stroke="viceColor"
          :points="`${realWidth - 10}, 0 ${realWidth}, 0 ${realWidth}, 10`"
        />
        <polyline
          class="view-bb7-line-width-5"
          :stroke="viceColor"
          :points="`${
            realWidth - 10
          }, ${realHeight} ${realWidth}, ${realHeight} ${realWidth}, ${
            realHeight - 10
          }`"
        />
        <polyline
          class="view-bb7-line-width-5"
          :stroke="viceColor"
          :points="`0, ${realHeight - 10} 0, ${realHeight} 10, ${realHeight}`"
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
  name: "DsfDataViewBorder7",
  ctrlCaption: "边框组件7",
  mixins: [$mixins.dataView, border],
  props: {
    comType: {
      type: String,
      default: "dsf.dataviewborder7",
    },
  },
  data() {
    return {
      ref: "view-border-7",
    };
  },
  computed: {
    controlStyle() {
      let { margin, mainColor, viceColor, backgroundColor } = this;
      let style = {
        top: `${margin[0]}px`,
        right: `${margin[1]}px`,
        bottom: `${margin[2]}px`,
        left: `${margin[3]}px`,
        backgroundColor: `${backgroundColor}`,
        border: `1px solid ${viceColor}`,
        boxShadow: `inset 0 0 40px ${mainColor}`,
      };
      return style;
    },
  },
});
</script>
<style lang="scss">
 @import "_dataview/assets/styles/share/components/border.scss";
</style>