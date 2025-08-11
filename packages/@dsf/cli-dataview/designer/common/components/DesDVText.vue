<template>
  <div class="el-input is-disabled data-view-text" v-if="disabled" tabindex="-1" @keydown.stop>
    <div class="el-input__inner">{{ bindValue }}</div>
  </div>
  <el-input
    v-else
    class="data-view-text"
    :type="config.type || 'input'"
    :rows="config.rows || 2"
    v-model="bindValue"
    v-input-num-key-arrow="config.numKeyArrow || false"
    :disabled="disabled"
    placeholder="请输入"
    @change="dataValueChange"
  >
  </el-input>
</template>
<script>
export default {
  name: "DesDVText",
  mixins: [$mixins.designerPropertyItem],
  methods: {
    dataValueChange() {
      this.$emit("change", this.bindValue);
    },
  },
};
</script>
