<!--
 * @Description: 
 * @Author: zhanghang
 * @Date: 2022-10-25 09:44:02
 * @LastEditors: zhanghang
 * @LastEditTime: 2023-11-14 17:01:31
-->
<template>
  <div class="dsf_decorate_decorateEleven dsf-decorate data-view-item-wrap ds-control data-view-no-padding" :style="controlHeight">
    <div class="svgboxs" :ref="ref" :style="controlStyle">
      <svg :width="realWidth" :height="realHeight" class="svgcontent">
        <!-- 左上角 -->
        <polygon :fill="this.fade(viceColorFill, 10)" :stroke="viceColor" :points="`20 10, 25 4, 55 4 60 10`" />
        <!-- 左下角 -->
        <polygon :fill="this.fade(viceColorFill, 10)" :stroke="viceColor" :points="`20 ${realHeight - 10}, 25 ${realHeight - 4}, 55 ${realHeight - 4} 60 ${realHeight - 10}`" />
        <!-- 右上角 -->
        <polygon :fill="this.fade(viceColorFill, 10)" :stroke="viceColor" :points="`${realWidth - 20} 10, ${realWidth - 25} 4, ${realWidth - 55} 4 ${realWidth - 60} 10`" />
        <!-- 右下角 -->
        <polygon
          :fill="this.fade(viceColorFill, 10)"
          :stroke="viceColor"
          :points="`${realWidth - 20} ${realHeight - 10}, ${realWidth - 25} ${realHeight - 4}, ${realWidth - 55} ${realHeight - 4} ${realWidth - 60} ${realHeight - 10}`"
        />
        <!-- 中间大背景 -->
        <polygon
          :fill="this.fade(mainColorFill, 20)"
          :stroke="mainColor"
          :points="`
          20 10, 5 ${realHeight / 2} 20 ${realHeight - 10}
          ${realWidth - 20} ${realHeight - 10} ${realWidth - 5} ${realHeight / 2} ${realWidth - 20} 10
        `"
        />
        <!-- 中间大背景内 左线条 -->
        <polyline fill="transparent" :stroke="mainColorStroke" :points="`25 18, 15 ${realHeight / 2} 25 ${realHeight - 18}`" />
        <!-- 中间大背景内 右线条 -->
        <polyline fill="transparent" :stroke="mainColorStroke" :points="`${realWidth - 25} 18, ${realWidth - 15} ${realHeight / 2} ${realWidth - 25} ${realHeight - 18}`" />
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
  name: "DsfDataViewDecorateEleven",
  ctrlCaption: "装饰11",
  mixins: [$mixins.dataView, border],
  props: {
    comType: {
      type: String,
      default: "dsf.dataviewdecorateeleven",
    },
  },
  data() {

    return {
      ref: "decoration-11",
    };
  },

  computed: {
    mainColorFill() {
      if (this.mainColor.indexOf("rgba") > -1) {
        //额外得到一个透明度0.2的主颜色作为填充
        let val = this.mainColor.match(/(\d(\.\d+)?)+/g);
        val[3] = 0.2;
        return "rgba(" + val.toString() + ")";
      } else {
        return this.mainColor;
      }
    },
    mainColorStroke() {
      if (this.mainColor.indexOf("rgba") > -1) {
        //额外得到一个透明度0.72的主颜色作为左、右线条色
        let val = this.mainColor.match(/(\d(\.\d+)?)+/g);
        val[3] = 0.7;
        return "rgba(" + val.toString() + ")";
      } else {
        return this.mainColor;
      }
    },
    viceColorFill() {
      // console.log(this.mainColor);
      if (this.viceColor.indexOf("rgba") > -1) {
        //额外得到一个透明度0.1的副颜色作为填充
        let val = this.mainColor.match(/(\d(\.\d+)?)+/g);
        val[3] = 0.1;
        return "rgba(" + val.toString() + ")";
      } else {
        return this.viceColor;
      }
    },
  },
  watch: {},
});
</script>
<style lang="scss">
 @import "_dataview/assets/styles/share/components/decorate.scss";
</style>
