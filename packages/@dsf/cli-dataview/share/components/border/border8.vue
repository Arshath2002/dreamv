<!--
 * @Description: 
 * @Author: zhanghang
 * @Date: 2022-07-21 10:45:52
 * @LastEditors: zhanghang
 * @LastEditTime: 2024-01-15 14:57:49
-->
<template>
  <div
    class="data-view-item-wrap ds-control view-border-8 data-view-no-padding view-border-common"
    :style="controlHeight"
  >
    <div class="data-view-item-wrap-inner-box" :ref="ref" :style="controlStyle">
      <svg
        class="view-border-svg-container"
        :width="realWidth"
        :height="realHeight"
      >
        <defs>
          <path :id="path" :d="pathD" fill="transparent" />
          <radialGradient :id="gradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#fff" stop-opacity="1" />
            <stop offset="100%" stop-color="#fff" stop-opacity="0" />
          </radialGradient>

          <mask :id="mask">
            <circle cx="0" cy="0" r="150" :fill="`url(#${gradient})`">
              <animateMotion
                :dur="`${dur}s`"
                :path="pathD"
                rotate="auto"
                repeatCount="indefinite"
              />
            </circle>
          </mask>
        </defs>
        <use :stroke="mainColor" stroke-width="1" :xlink:href="`#${path}`" />
        <polygon
          :fill="backgroundColor"
          :points="`5, 5 ${realWidth - 5}, 5 ${realWidth - 5} ${
            realHeight - 5
          } 5, ${realHeight - 5}`"
        />
        <use
          :stroke="viceColor"
          stroke-width="3"
          :xlink:href="`#${path}`"
          :mask="`url(#${mask})`"
        >
          <animate
            attributeName="stroke-dasharray"
            :from="`0, ${length}`"
            :to="`${length}, 0`"
            :dur="`${dur}s`"
            repeatCount="indefinite"
          />
        </use>
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
  name: "DsfDataViewBorder8",
  ctrlCaption: "边框组件8",
  mixins: [$mixins.dataView, border],
  props: {
    reverse: {
      type: Boolean,
      default: false,
    },
    dur: {
      type: [String, Number],
      default: 3,
    },
    comType: {
      type: String,
      default: "dsf.dataviewborder8",
    },
  },
  data() {
    const id = dsf.uuid(32);
    return {
      ref: "view-border-8",
      path: `border-box-8-path-${id}`,
      gradient: `border-box-8-gradient-${id}`,
      mask: `border-box-8-mask-${id}`,
    };
  },
  computed: {
    length() {
      const { realWidth, realHeight } = this;
      return (realWidth + realHeight - 5) * 2;
    },
    pathD() {
      const { reverse, realWidth, realHeight } = this;

      if (reverse)
        return `M 2.5, 2.5 L 2.5, ${realHeight - 2.5} L ${realWidth - 2.5}, ${
          realHeight - 2.5
        } L ${realWidth - 2.5}, 2.5 L 2.5, 2.5`;

      return `M2.5, 2.5 L${realWidth - 2.5}, 2.5 L${realWidth - 2.5}, ${
        realHeight - 2.5
      } L2.5, ${realHeight - 2.5} L2.5, 2.5`;
    },
  },
});
</script>
<style lang="scss">
 @import "_dataview/assets/styles/share/components/border.scss";
</style>