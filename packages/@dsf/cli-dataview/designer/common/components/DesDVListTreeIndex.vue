<!--
 * @Editor: zhanghang
 * @Description: 
 * @Date: 2024-12-30 16:32:40
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-05-30 10:49:00
-->
<template>
  <div style="margin-top: 10px">
    <div class="ds-designer-property property-item">
      <div class="property-item-name">序号显示<span>： </span></div>
      <DesDVSwitch v-model="currentData.index" />
    </div>
    <template v-if="currentData.index">
      <div class="ds-designer-property property-item">
        <div class="property-item-name">表头名称<span>： </span></div>
        <el-input v-model="currentData.indexHeader" class="data-view-text" />
      </div>
      <div class="ds-designer-property property-item">
        <div class="property-item-name">表头宽<span>： </span></div>
        <DesDVNumber v-model="currentData.indexWidth" :config="{ unit: px }" />
      </div>

      <DesDVListTreeIndexItem v-for="(item, index) in settingData" @add="addData" @delete="deleteData(index)" :formData="item" @change="changeValue($event, index)" :serial="index + 1" :key="index" />
    </template>
  </div>
</template>
<script>


import DesDVListTreeIndexItem from "./DesDVListTreeIndexItem.vue";
export default {
  name: "DesDVListTreeIndex",
  components: {   DesDVListTreeIndexItem },
  props: {
    value: {
      type: Object,
      require: true,
    },
  },
  computed: {
    currentData() {
      return this.value;
    },
    settingData() {
      return this.value.setting;
    },
  },
  methods: {
    addData() {
      const last = this.settingData[this.settingData.length - 1];

      this.settingData.push(dsf.mix(true, {}, last));
      this.$emit("input", this.value);
      this.$emit("change", this.value);
    },
    deleteData(index) {
      dsf.layer.confirm("是否要删除？").then(() => {
        this.settingData.splice(index, 1);
        this.$emit("input", this.value);
        this.$emit("change", this.value);
      });
    },
    changeValue(item, index) {
      this.$set(this.settingData, index, item);
      this.$emit("input", this.value);
      this.$emit("change", this.value);
    },
  },
};
</script>
