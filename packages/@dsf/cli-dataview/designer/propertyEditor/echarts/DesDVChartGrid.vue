<!--
 * @Editor: zhanghang
 * @Description: 
 * @Date: 2024-04-23 18:34:19
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-02-14 17:06:50
-->
<template>
  <div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name flex-center">外边距<span>： </span></div>
      <DesDVMargins v-model="getPadding" />
    </div>
  </div>
</template>
<script>
import mixin from "./mixin";
export default {
  name: "DesDVChartGrid",
  mixins: [mixin],
  computed: {
    getPadding: {
      get() {
        const isDouble = this.config ? this.config.isDouble : this.data.isDouble;
        if (isDouble) {
          const direction = this.owner.barDirection;
          const grid = this.chart.grid;
          if (direction === "topDown") {
            let top = grid[0].top;
            let left = grid[0].left;
            let right = grid[0].right;
            let bottom = grid[1].bottom;
            return [top, right, bottom, left];
          } else {
            let top = grid[0].top;
            let left = grid[0].left;
            let right = grid[1].right;
            let bottom = grid[0].bottom;
            return [top, right, bottom, left];
          }
        } else {
          let { top, right, bottom, left } = this.chart.grid;
          return [top, right, bottom, left];
        }
      },
      set(v) {
        let [top, right, bottom, left] = v;
         const isDouble = this.config ? this.config.isDouble : this.data.isDouble;
        if (isDouble) {
          const direction = this.owner.barDirection;
          if (direction === "topDown") {
            this.$set(this.chart.grid[0], "top", top);
            this.$set(this.chart.grid[0], "left", left);
            this.$set(this.chart.grid[1], "left", left);
            this.$set(this.chart.grid[0], "right", right);
            this.$set(this.chart.grid[1], "right", right);
            this.$set(this.chart.grid[1], "bottom", bottom);
          } else {
            this.$set(this.chart.grid[0], "top", top);
            this.$set(this.chart.grid[1], "top", top);
            this.$set(this.chart.grid[0], "bottom", bottom);
            this.$set(this.chart.grid[1], "bottom", bottom);
            this.$set(this.chart.grid[0], "left", left);
            this.$set(this.chart.grid[1], "right", right);
          }
        } else {
          this.$set(this.chart.grid, "top", top);
          this.$set(this.chart.grid, "right", right);
          this.$set(this.chart.grid, "bottom", bottom);
          this.$set(this.chart.grid, "left", left);
        }

        this._updateChart();
      },
    },
  },
};
</script>
