<!--
 * @Description: 
 * @Author: zhanghang
 * @Date: 2022-09-26 10:23:13
 * @LastEditors: zhanghang
 * @LastEditTime: 2023-04-17 15:26:25
-->
<template>
  <div class="dsf_decorate_decorateTen dsf-decorate data-view-item-wrap ds-control data-view-no-padding" :style="controlHeight">
    <div class="svgboxs" :ref="ref" :style="controlStyle">
      <svg :ref="ref" :width="realWidth" :height="realHeight">
        <polyline :stroke="viceColor" stroke-width="2" :points="`0, ${realHeight / 2} ${realWidth}, ${realHeight / 2}`" />

        <polyline :stroke="mainColor" stroke-width="2" :points="`5, ${realHeight / 2} ${realWidth * 0.2 - 3}, ${realHeight / 2}`" :stroke-dasharray="`0, ${realWidth * 0.2}`" fill="freeze">
          <animate :id="animationId2" attributeName="stroke-dasharray" :values="`0, ${realWidth * 0.2};${realWidth * 0.2}, 0;`" :dur="dur" :begin="`${animationId1}.end`" fill="freeze" />
          <animate attributeName="stroke-dasharray" :values="`${realWidth * 0.2}, 0;0, ${realWidth * 0.2}`" dur="0.01s" :begin="`${animationId7}.end`" fill="freeze" />
        </polyline>

        <polyline :stroke="mainColor" stroke-width="2" :points="`${realWidth * 0.2 + 3}, ${realHeight / 2} ${realWidth * 0.8 - 3}, ${realHeight / 2}`" :stroke-dasharray="`0, ${realWidth * 0.6}`">
          <animate :id="animationId4" attributeName="stroke-dasharray" :values="`0, ${realWidth * 0.6};${realWidth * 0.6}, 0`" :dur="dur" :begin="`${animationId3}.end + 1s`" fill="freeze" />
          <animate attributeName="stroke-dasharray" :values="`${realWidth * 0.6}, 0;0, ${realWidth * 0.6}`" dur="0.01s" :begin="`${animationId7}.end`" fill="freeze" />
        </polyline>

        <polyline :stroke="mainColor" stroke-width="2" :points="`${realWidth * 0.8 + 3}, ${realHeight / 2} ${realWidth - 5}, ${realHeight / 2}`" :stroke-dasharray="`0, ${realWidth * 0.2}`">
          <animate :id="animationId6" attributeName="stroke-dasharray" :values="`0, ${realWidth * 0.2};${realWidth * 0.2}, 0`" :dur="dur" :begin="`${animationId5}.end + 1s`" fill="freeze" />
          <animate attributeName="stroke-dasharray" :values="`${realWidth * 0.2}, 0;0, ${realWidth * 0.3}`" dur="0.01s" :begin="`${animationId7}.end`" fill="freeze" />
        </polyline>

        <circle cx="2" :cy="realHeight / 2" r="2" :fill="viceColor">
          <animate :id="animationId1" attributeName="fill" :values="`${viceColor};${mainColor}`" :begin="`0s;${animationId7}.end`" dur="0.3s" fill="freeze" />
        </circle>

        <circle :cx="realWidth * 0.2" :cy="realHeight / 2" r="2" :fill="viceColor">
          <animate :id="animationId3" attributeName="fill" :values="`${viceColor};${mainColor}`" :begin="`${animationId2}.end`" dur="0.3s" fill="freeze" />
          <animate attributeName="fill" :values="`${viceColor};${viceColor}`" dur="0.01s" :begin="`${animationId7}.end`" fill="freeze" />
        </circle>

        <circle :cx="realWidth * 0.8" :cy="realHeight / 2" r="2" :fill="viceColor">
          <animate :id="animationId5" attributeName="fill" :values="`${viceColor};${mainColor}`" :begin="`${animationId4}.end`" dur="0.3s" fill="freeze" />
          <animate attributeName="fill" :values="`${viceColor};${viceColor}`" dur="0.01s" :begin="`${animationId7}.end`" fill="freeze" />
        </circle>

        <circle :cx="realWidth - 2" :cy="realHeight / 2" r="2" :fill="viceColor">
          <animate :id="animationId7" attributeName="fill" :values="`${viceColor};${mainColor}`" :begin="`${animationId6}.end`" dur="0.3s" fill="freeze" />
          <animate attributeName="fill" :values="`${viceColor};${viceColor}`" dur="0.01s" :begin="`${animationId7}.end`" fill="freeze" />
        </circle>
      </svg>
    </div>
    <div class="decorate-slot-content" :style="controlInnerStyle" slot-name="default">
      <slot></slot>
    </div>
  </div>
</template>
<script>
import border from "_dataview/mixins/border.js";
export default dsf.component({
  name: "DsfDataViewDecorateTen",
  ctrlCaption: "装饰10",
   mixins: [$mixins.dataView, border],
  props: {
    dur: {
      type: String,
      default: "3s",
    },
    comType: {
      type: String,
      default: "dsf.dataviewdecorateten",
    },
  },
  data() {
    const id = dsf.uuid();
    return {
      ref: "decoration-10",
      animationId1: `d10ani1${id}`,
      animationId2: `d10ani2${id}`,
      animationId3: `d10ani3${id}`,
      animationId4: `d10ani4${id}`,
      animationId5: `d10ani5${id}`,
      animationId6: `d10ani6${id}`,
      animationId7: `d10ani7${id}`,
    };
  },

  watch: {
    dur() {
      this.resize();
    },
  },
});
</script>
<style lang="scss">
 @import "_dataview/assets/styles/share/components/decorate.scss";
</style>