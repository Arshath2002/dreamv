<template>
  <div class="des-dv-map-piecewise">
    <div class="piecewise-item" v-for="(item, index) in pieces" :key="index">
      <DesDVColorPicker v-model="item.color" :config="{ type: 'color' }" @change="changeSingleColor($event, item)">
        <template v-slot="{ openPopover }">
          <div class="color-icon-item" :style="moreModeColorItemStyle(item)" @click="openPopover"></div>
        </template>
      </DesDVColorPicker>
      <span style="white-space: nowrap">分段值：</span>
      <el-input class="map-piecewise-input" :value="pieceRange[index]" @input="changeRangeValue(index, $event)" style="width: 60px" type="number" size="small" placeholder="请输入"></el-input>
      <span style="white-space: nowrap">标签值：</span>
      <el-input class="map-piecewise-input" v-model="item.label" @change="changeLabel($event, item)" style="width: 70px" size="small" placeholder="请输入"></el-input>
      <div v-if="!index" class="des-dv-icon-add " @click="addRangePiece">
        <i class="add-btn el-icon-plus"></i>
      </div>
      <div v-else class="des-dv-icon-add " @click="removeRangePiece(index)">
        <i class="add-btn el-icon-minus"></i>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "piecewise",
  props: {
    pieces: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {};
  },
  computed: {
    pieceRange() {
      return this.pieces.map((it) => it.gte);
    },
    lastRangePiece() {
      if (this.pieces && this.pieces.length) {
        return this.pieces[this.pieces.length - 1];
      } else {
        return null;
      }
    },
  },
  methods: {
    changeLabel($event){
      this.$emit("change", this.pieces);
    },
    changeRangeValue(index, value) {
      if (index > 0 && index < this.pieceRange.length) {
        this.pieces[index - 1].lt = +value;
      }
      this.pieces[index].gte = +value;
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
        this.lastRangePiece.lt = this.lastRangePiece.gte + 100;
        const piece = {
          gte: this.lastRangePiece.lt,
          color: this.randColor(),
        };
        this.pieces.push(piece);
      } else {
        this.pieces.push({
          gte: 0,
          lt: 100,
          color: this.randColor(),
        });
      }
      this.$emit("change", this.pieces);
    },
    removeRangePiece(index) {
      const last = this.pieces[index - 1];
      const piece = this.pieces[index];
      if (index < this.pieces.length - 1) {
        last.lt = piece.lt;
        this.pieces[index + 1].gte = piece.lt;
      } else {
        delete last.lt;
      }
      this.pieces.splice(index, 1);
      this.$emit("change", this.pieces);
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