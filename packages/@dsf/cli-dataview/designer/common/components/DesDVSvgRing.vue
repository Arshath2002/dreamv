<!--
 * @Editor: zhanghang
 * @Description: 
 * @Date: 2024-05-29 09:37:41
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-02-13 14:56:36
-->
<template>
  <div class="des-dv-svg-ring">
    <div class="svg-ring-item" style="display: flex; align-items: center; margin-bottom: 5px" v-for="(item, index) in valueColors" :key="item.id">
      <DesDVMoreModeColor style="margin-bottom:0" v-model="item.color" @change="dataValueChange($event, index)" :config="config" />
      <div class="des-dv-icon-add" @click="addItem(index, item.color)"><i class="add-btn el-icon-plus"></i></div>
      <div class="des-dv-icon-add" @click="deleteItem(index)" v-if="value.length > 1"><i class="add-btn el-icon-minus"></i></div>
    </div>
  </div>
</template>
<script>

export default {
  name: "DesDVSvgRing",
  model: {
    prop: "value",
    event: "change",
  },
  props: {
    value: {
      type: Array,
      require: true,
    },
  },
  data() {
    return {
      config: {
        limit: 4,
        allowDelete: false,
      },
      valueColors: [],
    };
  },
  created() {
    this.valueColors = this.value.map((it) => {
      let res = {
        id: dsf.uuid(),
        color: it,
      };
      return res;
    });
  },
  methods: {
    addItem(index, item) {
      const valueColors = this.valueColors;
      valueColors.splice(index + 1, 0, [...item]);
      const value = valueColors.map((it) => it.color);
      this.$emit("change", value);
    },
    deleteItem(index) {
      const valueColors = this.valueColors;
      valueColors.splice(index, 1);
      const value = valueColors.map((it) => it.color);
      this.$emit("change", value);
    },
    dataValueChange(val, index) {
      this.$set(this.valueColors[index], "color", val);
      const value = this.valueColors.map((it) => it.color);
      this.$emit("change", value);
    },
  },
};
</script>
