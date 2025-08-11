<!--
 * @Description: 
 * @Author: zhanghang
 * @Date: 2022-07-21 10:45:52
 * @LastEditors: zhanghang
 * @LastEditTime: 2023-11-06 14:21:48
-->
<template>
  <div
    class="data-view-item-wrap ds-control view-border-1 data-view-no-padding view-border-common"
    :style="controlHeight"
  >
    <div class="data-view-item-wrap-inner-box" :style="controlStyle" :ref="ref">
      <svg class="border" :width="realWidth" :height="realHeight">
        <polygon
          :fill="backgroundColor"
          :points="`10, 27 10, ${realHeight - 27} 13, ${realHeight - 24} 13, ${
            realHeight - 21
          } 24, ${realHeight - 11}
      38, ${realHeight - 11} 41, ${realHeight - 8} 73, ${realHeight - 8} 75, ${
            realHeight - 10
          } 81, ${realHeight - 10}
      85, ${realHeight - 6} ${realWidth - 85}, ${realHeight - 6} ${realWidth - 81}, ${
            realHeight - 10
          } ${realWidth - 75}, ${realHeight - 10}
      ${realWidth - 73}, ${realHeight - 8} ${realWidth - 41}, ${realHeight - 8} ${
            realWidth - 38
          }, ${realHeight - 11}
      ${realWidth - 24}, ${realHeight - 11} ${realWidth - 13}, ${realHeight - 21} ${
            realWidth - 13
          }, ${realHeight - 24}
      ${realWidth - 10}, ${realHeight - 27} ${realWidth - 10}, 27 ${realWidth - 13}, 25 ${
            realWidth - 13
          }, 21
      ${realWidth - 24}, 11 ${realWidth - 38}, 11 ${realWidth - 41}, 8 ${realWidth - 73}, 8 ${
            realWidth - 75
          }, 10
      ${realWidth - 81}, 10 ${
            realWidth - 85
          }, 6 85, 6 81, 10 75, 10 73, 8 41, 8 38, 11 24, 11 13, 21 13, 24`"
        />
      </svg>
      <svg
        width="150px"
        height="150px"
        :key="item"
        v-for="item in border"
        :class="`${item} border`"
      >
        <polygon
          :fill="mainColor"
          points="6,66 6,18 12,12 18,12 24,6 27,6 30,9 36,9 39,6 84,6 81,9 75,9 73.2,7 40.8,7 37.8,10.2 24,10.2 12,21 12,24 9,27 9,51 7.8,54 7.8,63"
        >
          <animate
            v-if="blink"
            attributeName="fill"
            :values="`${mainColor};${viceColor};${mainColor}`"
            :dur="`${dur}s`"
            begin="0s"
            repeatCount="indefinite"
          />
        </polygon>
        <polygon
          :fill="viceColor"
          points="27.599999999999998,4.8 38.4,4.8 35.4,7.8 30.599999999999998,7.8"
        >
          <animate
            v-if="blink"
            attributeName="fill"
            :values="`${viceColor};${mainColor};${viceColor}`"
            :dur="`${dur}s`"
            begin="0s"
            repeatCount="indefinite"
          />
        </polygon>
        <polygon
          :fill="mainColor"
          points="9,54 9,63 7.199999999999999,66 7.199999999999999,75 7.8,78 7.8,110 8.4,110 8.4,66 9.6,66 9.6,54"
        >
          <animate
            v-if="blink"
            attributeName="fill"
            :values="`${mainColor};${viceColor};transparent`"
            :dur="`${dur}s`"
            begin="0s"
            repeatCount="indefinite"
          />
        </polygon>
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
  name: "DsfDataViewBorder1",
  ctrlCaption: "边框组件1",
  mixins: [$mixins.dataView,border],
  props:{
    comType:{
      type:String,
      default:'dsf.dataviewborder1'
    }
  },
  data() {
    return {
      ref: "view-border-1",
      border: ["left-top", "right-top", "left-bottom", "right-bottom"],
    };
  },
});
</script>
<style lang="scss">
 @import "_dataview/assets/styles/share/components/border.scss";
</style>
