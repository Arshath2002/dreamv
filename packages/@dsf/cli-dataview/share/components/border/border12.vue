<!--
 * @Description: 
 * @Author: zhanghang
 * @Date: 2022-07-21 10:45:52
 * @LastEditors: zhanghang
 * @LastEditTime: 2022-09-22 11:06:09
-->
<template>
  <div
    class="data-view-item-wrap ds-control view-border-12 data-view-no-padding view-border-common"
    :style="controlHeight"
  >
    <div class="data-view-item-wrap-inner-box" :style="controlStyle" :ref="ref">
      <svg
        class="view-border-svg-container"
        :width="realWidth"
        :height="realHeight"
      >
        <defs>
          <filter :id="filterId" height="150%" width="150%" x="-25%" y="-25%">
            <feMorphology
              operator="dilate"
              radius="1"
              in="SourceAlpha"
              result="thicken"
            />
            <feGaussianBlur in="thicken" stdDeviation="2" result="blurred" />
            <feFlood :flood-color="fade(viceColor, 70)" result="glowColor">
              <animate
                attributeName="flood-color"
                :values="`
                ${fade(viceColor, 100)};
                ${fade(viceColor, 30)};
                ${fade(viceColor, 100)};
              `"
                :dur="`${dur}s`"
                begin="0s"
                repeatCount="indefinite"
              />
            </feFlood>
            <feComposite
              in="glowColor"
              in2="blurred"
              operator="in"
              result="softGlowColored"
            />
            <feMerge>
              <feMergeNode in="softGlowColored" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <path
          v-if="realWidth && realHeight"
          :fill="backgroundColor"
          stroke-realWidth="2"
          :stroke="mainColor"
          :d="`
          M15 5 L ${realWidth - 15} 5 Q ${realWidth - 5} 5, ${realWidth - 5} 15
          L ${realWidth - 5} ${realHeight - 15} Q ${realWidth - 5} ${
            realHeight - 5
          }, ${realWidth - 15} ${realHeight - 5}
          L 15, ${realHeight - 5} Q 5 ${realHeight - 5} 5 ${
            realHeight - 15
          } L 5 15
          Q 5 5 15 5
        `"
        />

        <path
          stroke-width="2"
          fill="transparent"
          stroke-linecap="round"
          :filter="`url(#${filterId})`"
          :stroke="viceColor"
          :d="`M 20 5 L 15 5 Q 5 5 5 15 L 5 20`"
        />

        <path
          stroke-width="2"
          fill="transparent"
          stroke-linecap="round"
          :filter="`url(#${filterId})`"
          :stroke="viceColor"
          :d="`M ${realWidth - 20} 5 L ${realWidth - 15} 5 Q ${
            realWidth - 5
          } 5 ${realWidth - 5} 15 L ${realWidth - 5} 20`"
        />

        <path
          stroke-width="2"
          fill="transparent"
          stroke-linecap="round"
          :filter="`url(#${filterId})`"
          :stroke="viceColor"
          :d="`
          M ${realWidth - 20} ${realHeight - 5} L ${realWidth - 15} ${
            realHeight - 5
          }
          Q ${realWidth - 5} ${realHeight - 5} ${realWidth - 5} ${
            realHeight - 15
          }
          L ${realWidth - 5} ${realHeight - 20}
        `"
        />

        <path
          stroke-width="2"
          fill="transparent"
          stroke-linecap="round"
          :filter="`url(#${filterId})`"
          :stroke="viceColor"
          :d="`
          M 20 ${realHeight - 5} L 15 ${realHeight - 5}
          Q 5 ${realHeight - 5} 5 ${realHeight - 15}
          L 5 ${realHeight - 20}
        `"
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
  name: "DsfDataViewBorder12",
  ctrlCaption: "边框组件12",
  mixins: [$mixins.dataView, border],
  props: {
    dur: {
      type: [String, Number],
      default: 2,
    },
    comType: {
      type: String,
      default: "dsf.dataviewborder12",
    },
  },
  data() {
    const id = dsf.uuid(32);
    return {
      ref: "view-border-12",
      filterId: `border-box-12-filterId-${id}`,
    };
  },
});
</script>
<style lang="scss">
 @import "_dataview/assets/styles/share/components/border.scss";
</style>