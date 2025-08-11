<!--
 * @Description: 
 * @Author: zhanghang
 * @Date: 2022-09-26 10:23:13
 * @LastEditors: zhanghang
 * @LastEditTime: 2023-11-14 17:02:04
-->
<template>
  <div
    class="dsf_decorate_decorateSeven dsf-decorate data-view-item-wrap ds-control data-view-no-padding"
    :style="{
      ...controlStyle,
      ...getCommonEnterAnimateStyle,
    }">
    <div class="svgbox" :ref="ref">
      <svg :width="graphW" :height="graphW">
        <polyline stroke-width="4" fill="transparent" :stroke="mainColor" :points="`${graphW / 2}, 0 ${graphW - graphW / 10}, ${graphW / 2} ${graphW / 2}, ${graphW}`" />
        <polyline stroke-width="2" fill="transparent" :stroke="viceColor" :points="`${graphW / 10}, 0 ${graphW / 2}, ${graphW / 2} ${graphW / 10}, ${graphW}`" />
      </svg>
      <svg :width="graphW" :height="graphW">
        <polyline stroke-width="4" fill="transparent" :stroke="mainColor" :points="`${graphW / 2}, 0 ${graphW / 10}, ${graphW / 2} ${graphW / 2}, ${graphW}`" />
        <polyline stroke-width="2" fill="transparent" :stroke="viceColor" :points="`${graphW - graphW / 10}, 0 ${graphW / 2}, ${graphW / 2} ${graphW - graphW / 10}, ${graphW}`" />
      </svg>
    </div>

    <div
      class="decorate-slot-content"
      :style="controlInnerStyle"
      slot-name="default"
    >
      <slot></slot>
    </div>
  </div>
</template>
<script>
import border from "_dataview/mixins/border.js";
export default dsf.component({
  name: "DsfDataViewDecorateSeven",
  ctrlCaption: "装饰7",
  mixins: [$mixins.dataView, border],
  props: {
    graphW: {
      type: Number,
      default: 22,
    },
    comType: {
      type: String,
      default: "dsf.dataviewdecorateseven",
    },
  },
  data() {
    return {
      ref: "decoration-7",
    };
  },

});
</script>
<style lang="scss">
 @import "_dataview/assets/styles/share/components/decorate.scss";
</style>
