<!--
 * @Description: 
 * @Author: zhanghang
 * @Date: 2022-09-16 17:11:57
 * @LastEditors: zhanghang
 * @LastEditTime: 2024-11-28 14:39:45
-->
<template>
  <div
    class="data-view-item-wrap dsf-decorate ds-control data-view-rotate-1 data-view-no-padding"
    :style="controlHeight"
  >
    <div class="data-view-item-wrap-inner-box" :ref="ref" :style="controlStyle">
      <div class="semi_arc e4" :style="reactorStyle">
        <div class="semi_arc_2 e4_1" :style="borderStyle1">
          <div class="counterspin4" :style="borderStyle2"></div>
        </div>
      </div>

      <div
        class="rotate-content"
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
  name: "DsfDataViewRotate2",
  ctrlCaption: "旋转2",
  mixins: [$mixins.dataView, border],
  props: {
    mainColor: {
      type: String,
      default: "#02feff",
    },
    comType: {
      type: String,
      default: "dsf.dataviewrotate2",
    },
  },
  computed: {
    getSize() {
      let { realWidth, realHeight } = this;

      return realWidth > realHeight ? realHeight - 12 : realWidth - 12;
    },
    reactorStyle() {
      let { getSize, mainColor } = this;
      return {
        width: getSize + "px",
        height: getSize + "px",
        border: `6px solid ${mainColor} `,
      };
    },
    borderStyle1() {
      let { mainColor, fade, rgbToHex } = this;
      if (mainColor.startsWith("rgb")) {
        mainColor = rgbToHex(mainColor);
      }

      return {
        borderLeft: "5px solid transparent",
        borderRight: "5px solid transparent",
        borderTop: `5px solid ${fade(mainColor, 30)}`,
        borderBottom: `5px solid ${fade(mainColor, 30)}`,
      };
    },
    borderStyle2() {
      let { mainColor, fade, rgbToHex } = this;
      if (mainColor.startsWith("rgb")) {
        mainColor = rgbToHex(mainColor);
      }
      return {
        borderLeft: "5px solid transparent",
        borderRight: "5px solid transparent",
        borderTop: `5px solid ${fade(mainColor, 60)}`,
        borderBottom: `5px solid ${fade(mainColor, 60)}`,
      };
    },
  },
  data() {
    return {
      ref: "rotate",
    };
  },
  mounted() {
    this.resize();
  },
});
</script>
<style lang="scss">
 @import "_dataview/assets/styles/share/components/decorate.scss";
</style>