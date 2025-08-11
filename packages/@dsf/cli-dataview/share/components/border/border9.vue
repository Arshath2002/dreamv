<!--
 * @Description: 
 * @Author: zhanghang
 * @Date: 2022-07-21 10:45:52
 * @LastEditors: zhanghang
 * @LastEditTime: 2022-09-22 11:06:00
-->
<template>
  <div
    class="data-view-item-wrap ds-control view-border-9 data-view-no-padding view-border-common"
    :style="controlHeight"
  >
    <div class="data-view-item-wrap-inner-box" :ref="ref" :style="controlStyle">
      <svg
        class="view-border-svg-container"
        :width="realWidth"
        :height="realHeight"
      >
        <defs>
          <linearGradient :id="gradientId" x1="0%" y1="0%" x2="100%" y2="100%">
            <animate
              attributeName="x1"
              values="0%;100%;0%"
              dur="10s"
              begin="0s"
              repeatCount="indefinite"
            />

            <animate
              attributeName="x2"
              values="100%;0%;100%"
              dur="10s"
              begin="0s"
              repeatCount="indefinite"
            />

            <stop offset="0%" :stop-color="mainColor">
              <animate
                attributeName="stop-color"
                :values="`${mainColor};${viceColor};${mainColor}`"
                dur="10s"
                begin="0s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="100%" :stop-color="viceColor">
              <animate
                attributeName="stop-color"
                :values="`${viceColor};${mainColor};${viceColor}`"
                dur="10s"
                begin="0s"
                repeatCount="indefinite"
              />
            </stop>
          </linearGradient>

          <mask :id="maskId">
            <polyline
              stroke="#fff"
              stroke-width="3"
              fill="transparent"
              :points="`8, ${realHeight * 0.4} 8, 3, ${realWidth * 0.4 + 7}, 3`"
            />
            <polyline
              fill="#fff"
              :points="`8, ${realHeight * 0.15} 8, 3, ${realWidth * 0.1 + 7}, 3
              ${realWidth * 0.1}, 8 14, 8 14, ${realHeight * 0.15 - 7}
            `"
            />

            <polyline
              stroke="#fff"
              stroke-width="3"
              fill="transparent"
              :points="`${realWidth * 0.5}, 3 ${realWidth - 3}, 3, ${
                realWidth - 3
              }, ${realHeight * 0.25}`"
            />
            <polyline
              fill="#fff"
              :points="`
              ${realWidth * 0.52}, 3 ${realWidth * 0.58}, 3
              ${realWidth * 0.58 - 7}, 9 ${realWidth * 0.52 + 7}, 9
            `"
            />
            <polyline
              fill="#fff"
              :points="`
              ${realWidth * 0.9}, 3 ${realWidth - 3}, 3 ${realWidth - 3}, ${
                realHeight * 0.1
              }
              ${realWidth - 9}, ${realHeight * 0.1 - 7} ${realWidth - 9}, 9 ${
                realWidth * 0.9 + 7
              }, 9
            `"
            />

            <polyline
              stroke="#fff"
              stroke-width="3"
              fill="transparent"
              :points="`8, ${realHeight * 0.5} 8, ${realHeight - 3} ${
                realWidth * 0.3 + 7
              }, ${realHeight - 3}`"
            />
            <polyline
              fill="#fff"
              :points="`
              8, ${realHeight * 0.55} 8, ${realHeight * 0.7}
              2, ${realHeight * 0.7 - 7} 2, ${realHeight * 0.55 + 7}
            `"
            />

            <polyline
              stroke="#fff"
              stroke-width="3"
              fill="transparent"
              :points="`${realWidth * 0.35}, ${realHeight - 3} ${
                realWidth - 3
              }, ${realHeight - 3} ${realWidth - 3}, ${realHeight * 0.35}`"
            />
            <polyline
              fill="#fff"
              :points="`
              ${realWidth * 0.92}, ${realHeight - 3} ${realWidth - 3}, ${
                realHeight - 3
              } ${realWidth - 3}, ${realHeight * 0.8}
              ${realWidth - 9}, ${realHeight * 0.8 + 7} ${realWidth - 9}, ${
                realHeight - 9
              } ${realWidth * 0.92 + 7}, ${realHeight - 9}
            `"
            />
          </mask>
        </defs>

        <polygon
          :fill="backgroundColor"
          :points="`
        15, 9 ${realWidth * 0.1 + 1}, 9 ${realWidth * 0.1 + 4}, 6 ${
            realWidth * 0.52 + 2
          }, 6
        ${realWidth * 0.52 + 6}, 10 ${realWidth * 0.58 - 7}, 10 ${
            realWidth * 0.58 - 2
          }, 6
        ${realWidth * 0.9 + 2}, 6 ${realWidth * 0.9 + 6}, 10 ${
            realWidth - 10
          }, 10 ${realWidth - 10}, ${realHeight * 0.1 - 6}
        ${realWidth - 6}, ${realHeight * 0.1 - 1} ${realWidth - 6}, ${
            realHeight * 0.8 + 1
          } ${realWidth - 10}, ${realHeight * 0.8 + 6}
        ${realWidth - 10}, ${realHeight - 10} ${realWidth * 0.92 + 7}, ${
            realHeight - 10
          }  ${realWidth * 0.92 + 2}, ${realHeight - 6}
        11, ${realHeight - 6} 11, ${realHeight * 0.15 - 2} 15, ${
            realHeight * 0.15 - 7
          }
      `"
        />

        <rect
          x="0"
          y="0"
          :width="realWidth"
          :height="realHeight"
          :fill="`url(#${gradientId})`"
          :mask="`url(#${maskId})`"
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
  name: "DsfDataViewBorder9",
  ctrlCaption: "边框组件9",
  mixins: [$mixins.dataView, border],
  props: {
    comType: {
      type: String,
      default: "dsf.dataviewborder9",
    },
  },
  data() {
    const id = dsf.uuid(32);
    return {
      ref: "view-border-9",
      gradientId: `border-box-9-gradient-${id}`,
      maskId: `border-box-9-mask-${id}`,
    };
  },
});
</script>
<style lang="scss">
@import "_dataview/assets/styles/share/components/border.scss";
</style>
