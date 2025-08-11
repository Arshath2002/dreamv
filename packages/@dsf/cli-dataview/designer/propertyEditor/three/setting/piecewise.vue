<!--
 * @Editor: zhanghang
 * @Description: 
 * @Date: 2024-07-11 11:22:35
 * @LastEditors: zhanghang
 * @LastEditTime: 2024-07-11 11:34:27
-->
<template>
  <div class="des-dv-map-piecewise">
    <div class="piecewise-item" v-for="(item, index) in pieces" :key="index">
      <DesDVColorPicker v-model="item.color" :config="{ type: 'color' }" @change="changeSingleColor($event, item)">
        <template v-slot="{ openPopover }">
          <div class="color-icon-item" :style="moreModeColorItemStyle(item)" @click="openPopover"></div>
        </template>
      </DesDVColorPicker>
      <span style="white-space: nowrap">分段值：</span>
      <el-input class="map-piecewise-input" v-model="item.value" @change="changeValue" style="width: 60px" type="number" size="small" placeholder="请输入"></el-input>
      <span style="white-space: nowrap">标签值：</span>
      <el-input class="map-piecewise-input" v-model="item.label" @change="changeValue" style="width: 70px" size="small" placeholder="请输入"></el-input>
      <div v-if="!index" class="des-dv-icon-add" @click="addRangePiece">
        <i class="add-btn el-icon-plus"></i>
      </div>
      <div v-else class="des-dv-icon-add" @click="removeRangePiece(index)">
        <i class="add-btn el-icon-minus"></i>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  name: "threePiecewise",

  props: {
    pieces: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  computed: {
    lastRangePiece() {
      if (this.pieces && this.pieces.length) {
        return this.pieces[this.pieces.length - 1];
      } else {
        return null;
      }
    },
  },
  methods: {
    changeValue($event) {
      this.$emit("change", this.pieces);
    },
    moreModeColorItemStyle(item) {
      let style = {};
      style.background = item.color;
      return style;
    },
    changeSingleColor(color, item) {
      this.$set(item, "color", color);
      this.$emit("change", this.pieces);
    },
    addRangePiece() {
      if (this.pieces.length > 0) {
        const value = +this.lastRangePiece.value + 100;
        const piece = {
          value,
          label: `>=${value}`,
          color: this.randColor(),
        };
        this.pieces.push(piece);
      } else {
        this.pieces.push({
          value: 0,
          label: ">=0",
          color: this.randColor(),
        });
      }
       this.$emit("change", this.pieces);
    },
    removeRangePiece(index) {
      this.pieces.splice(index, 1);
    },
    // 随机rgb颜色
    randColor() {
      return "#" + Math.random().toString(16).slice(-6);
    },
  },
};
</script>
<style lang="scss">
@import "_dataview/assets/styles/designer/DesDVMapProperty.scss";
</style>
