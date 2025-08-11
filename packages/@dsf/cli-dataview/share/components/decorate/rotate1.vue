<!--
 * @Description: 
 * @Author: zhanghang
 * @Date: 2022-09-16 17:11:57
 * @LastEditors: shenah
 * @LastEditTime: 2024-09-06 08:56:59
-->
<template>
  <div class="data-view-item-wrap dsf-decorate ds-control data-view-rotate-1 data-view-no-padding" :style="controlHeight">
    <div class="data-view-item-wrap-inner-box" :ref="ref" :style="controlStyle">
      <div class="arc-reactor" :style="reactorStyle">
        <div class="case-container" :style="caseStyle">
          <div class="e7">
            <div class="semi-arc-3 e5-1">
              <div class="semi-arc-3 e5-2">
                <div class="semi-arc-3 e5-3">
                  <div class="semi-arc-3 e5-4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ul class="marks">
          <li
            v-for="item in 60"
            :key="item"
            :style="{
              transform: `rotate(${item * 6}deg) translateY(${getSize / 2}px)`,
            }"
          ></li>
        </ul>
        <div class="core2"></div>
      </div>
      <div class="rotate-content" :style="controlInnerStyle" slot-name="default">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
<script>
import border from "_dataview/mixins/border.js";
export default dsf.component({
  name: "DsfDataViewRotate1",
  ctrlCaption: "旋转1",
  mixins: [$mixins.dataView, border],
  props: {
    comType: {
      type: String,
      default: "dsf.dataviewrotate1",
    },
  },
  computed: {
    getSize() {
      let { realWidth, realHeight } = this;

      return realWidth > realHeight ? realHeight - 60 : realWidth - 60;
    },
    reactorStyle() {
      let { getSize } = this;
      return {
        width: getSize + "px",
        height: getSize + "px",
      };
    },
    caseStyle() {
      let { getSize } = this;
      return {
        width: getSize * 0.9 + "px",
        height: getSize * 0.9 + "px",
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
  watch: {},
  methods: {},
});
</script>
<style lang="scss">
 @import "_dataview/assets/styles/share/components/decorate.scss";
</style>


