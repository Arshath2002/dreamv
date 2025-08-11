<!--
 * @Description: 
 * @Author: zhanghang
 * @Date: 2022-07-21 10:45:52
 * @LastEditors: zhanghang
 * @LastEditTime: 2024-01-15 14:58:45
-->
<template>
  <div
    class="data-view-item-wrap ds-control view-border-11 data-view-no-padding view-border-common"
    :style="controlHeight"
  >
    <div class="data-view-item-wrap-inner-box" :style="controlStyle" :ref="ref">
      <svg
        class="view-border-svg-container"
        :width="realWidth"
        :height="realHeight"
      >
        <polygon
          :fill="backgroundColor"
          :points="`
        4, 0 ${realWidth - 4}, 0 ${realWidth}, 4 ${realWidth}, ${
            realHeight - 4
          } ${realWidth - 4}, ${realHeight}
        4, ${realHeight} 0, ${realHeight - 4} 0, 4
      `"
        />
      </svg>
      <svg
        width="150px"
        height="150px"
        :key="item"
        v-for="item in border"
        :class="`${item} view-border-svg-container`"
      >
        <polygon
          :fill="viceColor"
          points="40, 0 5, 0 0, 5 0, 16 3, 19 3, 7 7, 3 35, 3"
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
  name: "DsfDataViewBorder10",
  ctrlCaption: "边框组件10",
  mixins: [$mixins.dataView, border],
  props: {
    comType: {
      type: String,
      default: "dsf.dataviewborder10",
    },
  },
  data() {
    return {
      ref: "view-border-10",
      border: ["left-top", "right-top", "left-bottom", "right-bottom"],
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
        borderRadius: "6px",
        boxShadow: `inset 0 0 25px 3px ${mainColor}`,
      };
      return style;
    },
  },
});
</script>
<style lang="scss">
 @import "_dataview/assets/styles/share/components/border.scss";
</style>