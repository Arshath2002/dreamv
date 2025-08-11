<!--
 * @Description: 
 * @Author: zhanghang
 * @Date: 2022-07-21 10:45:52
 * @LastEditors: zhanghang
 * @LastEditTime: 2024-01-15 14:59:08
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
        <defs>
          <filter :id="filterId" height="150%" width="150%" x="-25%" y="-25%">
            <feMorphology
              operator="dilate"
              radius="4"
              in="SourceAlpha"
              result="thicken"
            />
            <feGaussianBlur in="thicken" stdDeviation="3" result="blurred" />
            <feFlood :flood-color="viceColor" result="glowColor" />
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

        <polygon
          :fill="backgroundColor"
          :points="`
        20, 32 ${realWidth * 0.5 - titleWidth / 2}, 32 ${
            realWidth * 0.5 - titleWidth / 2 + 20
          }, 53
        ${realWidth * 0.5 + titleWidth / 2 - 20}, 53 ${
            realWidth * 0.5 + titleWidth / 2
          }, 32
        ${realWidth - 20}, 32 ${realWidth - 8}, 48 ${realWidth - 8}, ${
            realHeight - 25
          } ${realWidth - 20}, ${realHeight - 8}
        20, ${realHeight - 8} 8, ${realHeight - 25} 8, 50
      `"
        />
        <polyline
          :stroke="mainColor"
          :filter="`url(#${filterId})`"
          :points="`
          ${(realWidth - titleWidth) / 2}, 30
          20, 30 7, 50 7, ${50 + (realHeight - 167) / 2}
          13, ${55 + (realHeight - 167) / 2} 13, ${135 + (realHeight - 167) / 2}
          7, ${140 + (realHeight - 167) / 2} 7, ${realHeight - 27}
          20, ${realHeight - 7} ${realWidth - 20}, ${realHeight - 7} ${
            realWidth - 7
          }, ${realHeight - 27}
          ${realWidth - 7}, ${140 + (realHeight - 167) / 2} ${
            realWidth - 13
          }, ${135 + (realHeight - 167) / 2}
          ${realWidth - 13}, ${55 + (realHeight - 167) / 2} ${realWidth - 7}, ${
            50 + (realHeight - 167) / 2
          }
          ${realWidth - 7}, 50 ${realWidth - 20}, 30 ${
            (realWidth + titleWidth) / 2
          }, 30
          ${(realWidth + titleWidth) / 2 - 20}, 7 ${
            (realWidth - titleWidth) / 2 + 20
          }, 7
          ${(realWidth - titleWidth) / 2}, 30 ${
            (realWidth - titleWidth) / 2 + 20
          }, 52
          ${(realWidth + titleWidth) / 2 - 20}, 52 ${
            (realWidth + titleWidth) / 2
          }, 30
        `"
        />

        <polygon
          :stroke="mainColor"
          fill="transparent"
          :points="`
          ${(realWidth + titleWidth) / 2 - 5}, 30 ${
            (realWidth + titleWidth) / 2 - 21
          }, 11
          ${(realWidth + titleWidth) / 2 - 27}, 11 ${
            (realWidth + titleWidth) / 2 - 8
          }, 34
        `"
        />

        <polygon
          :stroke="mainColor"
          fill="transparent"
          :points="`
          ${(realWidth - titleWidth) / 2 + 5}, 30 ${
            (realWidth - titleWidth) / 2 + 22
          }, 49
          ${(realWidth - titleWidth) / 2 + 28}, 49 ${
            (realWidth - titleWidth) / 2 + 8
          }, 26
        `"
        />

        <polygon
          :stroke="mainColor"
          :fill="fade(viceColor, 30)"
          :filter="`url(#${filterId})`"
          :points="`
          ${(realWidth + titleWidth) / 2 - 11}, 37 ${
            (realWidth + titleWidth) / 2 - 32
          }, 11
          ${(realWidth - titleWidth) / 2 + 23}, 11 ${
            (realWidth - titleWidth) / 2 + 11
          }, 23
          ${(realWidth - titleWidth) / 2 + 33}, 49 ${
            (realWidth + titleWidth) / 2 - 22
          }, 49
        `"
        />

        <polygon
          :filter="`url(#${filterId})`"
          :fill="mainColor"
          opacity="1"
          :points="`
          ${(realWidth - titleWidth) / 2 - 10}, 37 ${
            (realWidth - titleWidth) / 2 - 31
          }, 37
          ${(realWidth - titleWidth) / 2 - 25}, 46 ${
            (realWidth - titleWidth) / 2 - 4
          }, 46
        `"
        >
          <animate
            attributeName="opacity"
            values="1;0.7;1"
            :dur="`${dur}s`"
            begin="0s"
            repeatCount="indefinite"
          />
        </polygon>

        <polygon
          :filter="`url(#${filterId})`"
          :fill="mainColor"
          opacity="0.7"
          :points="`
          ${(realWidth - titleWidth) / 2 - 40}, 37 ${
            (realWidth - titleWidth) / 2 - 61
          }, 37
          ${(realWidth - titleWidth) / 2 - 55}, 46 ${
            (realWidth - titleWidth) / 2 - 34
          }, 46
        `"
        >
          <animate
            attributeName="opacity"
            values="0.7;0.4;0.7"
            :dur="`${dur}s`"
            begin="0s"
            repeatCount="indefinite"
          />
        </polygon>

        <polygon
          :filter="`url(#${filterId})`"
          :fill="mainColor"
          opacity="0.5"
          :points="`
          ${(realWidth - titleWidth) / 2 - 70}, 37 ${
            (realWidth - titleWidth) / 2 - 91
          }, 37
          ${(realWidth - titleWidth) / 2 - 85}, 46 ${
            (realWidth - titleWidth) / 2 - 64
          }, 46
        `"
        >
          <animate
            attributeName="opacity"
            values="0.5;0.2;0.5"
            :dur="`${dur}s`"
            begin="0s"
            repeatCount="indefinite"
          />
        </polygon>

        <polygon
          :filter="`url(#${filterId})`"
          :fill="mainColor"
          opacity="1"
          :points="`
          ${(realWidth + titleWidth) / 2 + 30}, 37 ${
            (realWidth + titleWidth) / 2 + 9
          }, 37
          ${(realWidth + titleWidth) / 2 + 3}, 46 ${
            (realWidth + titleWidth) / 2 + 24
          }, 46
        `"
        >
          <animate
            attributeName="opacity"
            values="1;0.7;1"
            :dur="`${dur}s`"
            begin="0s"
            repeatCount="indefinite"
          />
        </polygon>

        <polygon
          :filter="`url(#${filterId})`"
          :fill="mainColor"
          opacity="0.7"
          :points="`
          ${(realWidth + titleWidth) / 2 + 60}, 37 ${
            (realWidth + titleWidth) / 2 + 39
          }, 37
          ${(realWidth + titleWidth) / 2 + 33}, 46 ${
            (realWidth + titleWidth) / 2 + 54
          }, 46
        `"
        >
          <animate
            attributeName="opacity"
            values="0.7;0.4;0.7"
            :dur="`${dur}s`"
            begin="0s"
            repeatCount="indefinite"
          />
        </polygon>

        <polygon
          :filter="`url(#${filterId})`"
          :fill="mainColor"
          opacity="0.5"
          :points="`
          ${(realWidth + titleWidth) / 2 + 90}, 37 ${
            (realWidth + titleWidth) / 2 + 69
          }, 37
          ${(realWidth + titleWidth) / 2 + 63}, 46 ${
            (realWidth + titleWidth) / 2 + 84
          }, 46
        `"
        >
          <animate
            attributeName="opacity"
            values="0.5;0.2;0.5"
            :dur="`${dur}s`"
            begin="0s"
            repeatCount="indefinite"
          />
        </polygon>

        <text
          class="dv-border-box-11-title"
          :x="`${realWidth / 2}`"
          y="32"
          fill="#fff"
          font-size="18"
          text-anchor="middle"
          dominant-baseline="middle"
        >
          {{ title }}
        </text>

        <polygon
          :fill="mainColor"
          :filter="`url(#${filterId})`"
          :points="`
          7, ${53 + (realHeight - 167) / 2} 11, ${57 + (realHeight - 167) / 2}
          11, ${133 + (realHeight - 167) / 2} 7, ${137 + (realHeight - 167) / 2}
        `"
        />

        <polygon
          :fill="mainColor"
          :filter="`url(#${filterId})`"
          :points="`
          ${realWidth - 7}, ${53 + (realHeight - 167) / 2} ${realWidth - 11}, ${
            57 + (realHeight - 167) / 2
          }
          ${realWidth - 11}, ${133 + (realHeight - 167) / 2} ${
            realWidth - 7
          }, ${137 + (realHeight - 167) / 2}
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
  name: "DsfDataViewBorder11",
  ctrlCaption: "边框组件11",
  mixins: [$mixins.dataView, border],
  props: {
    titleWidth: {
      type: Number,
      default: 250,
    },
    title: {
      type: String,
      default: "",
    },
    dur: {
      type: [String, Number],
      default: 2,
    },
    comType: {
      type: String,
      default: "dsf.dataviewborder11",
    },
  },
  data() {
    const id = dsf.uuid(32);
    return {
      ref: "view-border-11",
      filterId: `border-box-11-filterId-${id}`,
    };
  },
});
</script>
<style lang="scss">
 @import "_dataview/assets/styles/share/components/border.scss";
</style>