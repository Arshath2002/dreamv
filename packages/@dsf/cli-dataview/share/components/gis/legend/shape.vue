<!--
 * @Description: 图例不同的形状生成
 * @Author: shenah
 * @Date: 2023-10-23 09:56:42
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-06-13 11:20:08
-->
<template>
  <div class="shape" :style="getShapeStyle">
    <!-- marker -->
    <div class="point-attr" v-if="info.type === 'point'" :style="getCommonStyle"></div>
    <!-- 动效点 -->
    <div class="scatter point-attr" v-else-if="info.type === 'scatter'" :style="getCommonStyle"></div>
    <!-- 热力图 -->
    <div class="heat" v-else-if="info.type === 'heatMap'" :style="getCommonStyle"></div>
    <!-- 柱子 -->
    <div class="flat-bar" v-else-if="info.type === 'flatBar'">
      <div class="flat-bar-box">
        <div class="cube cube1" :style="getCommonStyle"></div>
        <div class="cube cube2" :style="getCommonStyle"></div>
        <div class="cube cube3" :style="getCommonStyle"></div>
      </div>
    </div>
    <!-- 六边形 -->
    <div class="hexagon" v-else-if="info.type === 'hexagons'">
      <div class="main1 tool" :style="getCommonStyle"></div>
      <div class="main2 tool" :style="getCommonStyle"></div>
      <div class="main3 tool" :style="getCommonStyle"></div>
    </div>
    <!-- 面 -->
    <div class="polygon" v-else-if="info.type === 'polygon'" :style="getCommonStyle"></div>
    <!-- 飞行线 -->
    <DsfIcon class="pulseLink" name="fasong2" :style="getCommonStyle" v-else-if="info.type === 'pulseLink'"></DsfIcon>
    <!-- 图例 -->
    <img class="icon-img" v-else-if="info.type === 'icon'" :src="getImgSrc" />
  </div>
</template>

<script>
import defaultMarker from "_dataview/assets/img/gis/default-marker.png";
export default {
  name: "shape",
  data() {
    return {};
  },
  props: {
    info: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    getImgSrc() {
      let icon = this.info.currentOptions.itemStyle.icon;
      if (icon&&icon!="default") {
        return icon
      }
      return defaultMarker;
    },
    getCommonStyle() {
      let style = {};
      let color = this.info.legend.itemStyle.legendColor;
      if (typeof color === "string") {
        if (this.info.type === "pulseLink") {
          style.color = color;
        } else {
          style.backgroundColor = color;
        }
      } else if (Array.isArray(color)) {
        style.background = `radial-gradient(${color.join(",")})`;
      }
      return style;
    },
    getShapeStyle() {
      let style = {};
      if (this.info.type === "flatBar") {
        style.marginRight = "14px";
      } else if (this.info.type === "hexagons") {
        style.marginRight = "16px";
      }
      return style;
    },
  },
};
</script>
