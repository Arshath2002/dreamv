<!--
 * @Description: 
 * @Author: zhanghang
 * @Date: 2022-09-27 10:18:49
 * @LastEditors: shenah
 * @LastEditTime: 2024-11-07 11:30:44
-->
<template>
  <div class="dsf_decorate_decorateEight dsf-decorate data-view-item-wrap ds-control data-view-no-padding" :style="controlHeight">
    <div class="svgboxs" :ref="ref" :style="controlStyle">
      <svg :width="realWidth" :height="realHeight">
        <polyline :stroke="mainColor" stroke-width="2" fill="transparent" :points="`0, 0 ${realHeight / 4 - realHeight / 10}, ${realHeight / 2}`" />
        <polyline :stroke="mainColor" stroke-width="2" fill="transparent" :points="`${realHeight / 10}, 0 ${realHeight / 4}, ${realHeight / 2} ${realWidth}, ${realHeight / 2}`" />
        <polyline :stroke="viceColor" fill="transparent" stroke-width="3" :points="`0, ${realHeight - 3}, ${realHeight}, ${realHeight - 3}`" />
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
  name: "DsfDataViewDecorateEight",
  ctrlCaption: "装饰8",
  mixins: [$mixins.dataView, border],
  props: {
    comType: {
      type: String,
      default: "dsf.dataviewdecorateeight",
    },
  },
  data() {
    return {
      ref: "decoration-8",
    };
  },
});
</script>
<style lang="scss">
 @import "_dataview/assets/styles/share/components/decorate.scss";
</style>
