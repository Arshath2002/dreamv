<!--
 * @Description: 图例公用组件
 * @Author: shenah
 * @Date: 2023-10-23 09:29:29
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-06-13 11:19:17
-->

<template>
  <div class="dsf-dv-gis-legend">
    <template v-for="(item, index) in list">
      <div class="legend-item" :key="index" v-if="item.legend.show">
        <Shape :info="item" :hideColor="hideColor"></Shape>
        <div class="name" >{{ item.name }}</div>
      </div>
    </template>
  </div>
</template>

<script>
import Shape from "./shape.vue";
export default {
  name: "Legend",
  components: { Shape },
  data() {
    return {};
  },
  props: {
    hideColor: {
      type: String,
      default: "rgba(204,204,204,1)",
    },
    show: {
      type: Boolean,
      default: true,
    },
    //horizontal、vertical
    direction: {
      type: String,
      default: "horizontal",
    },
    /**
     * @param {String} name 名称
     * @param {String} type 图例的类型
     * point 点
     * scatter 动效点
     * heatMap 热力图
     * flatBar 立体柱
     * hexagons 六边形
     * polygon 面
     * @param {String} color 颜色
     * @param {String} textColor 文本颜色
     * @param {Boolean} show 是否展示
     */
    list: {
      type: Array,
      default: () => [],
    },
  },
};
</script>
