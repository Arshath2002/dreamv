<!--
  * @Description: 
  * @Author: zhanghang
  * @Date: 2023-04-03 14:41:15
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-04-02 18:41:22
 -->
<template>
  <el-dropdown @command="(v) => handleCommand(v)" trigger="click" :disabled="!mapFieldList.length || disabled">
    <el-input
      :size="size"
      :value="relation"
      class="mtext"
      :placeholder="placeholder ? placeholder : readonly ? '请选择' : '请输入'"
      @input="handleRelationChange"
      :disabled="disabled"
      :readonly="readonly"
      :suffix-icon="readonly ? 'el-icon-arrow-down' : ''"
      :class="{ 'select-input': readonly }"
    >
    </el-input>
    <el-dropdown-menu class="des-dv-dropdown" slot="dropdown">
      <el-scrollbar style="height: 300px">
        <el-dropdown-item :command="item.value" style="width: 180px" v-for="item in mapFieldList" :key="item.value">
          {{ item.name }}
        </el-dropdown-item>
      </el-scrollbar>
    </el-dropdown-menu>
  </el-dropdown>
</template>
<script>
export default {
  name: "SelectInput",
  props: {
    value: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: "",
    },
    size: {
      type: String,
      default: "small",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    mapFieldList: {
      type: Array,
      default() {
        return [];
      },
    },
    defaultValue: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      relation: "",
    };
  },
  mounted() {
    // 初始化加载relation值
    this.handleCommand(this.value, true);
  },
  watch: {
    value(v) {
      // 初始化加载relation值
      this.handleCommand(v, true);
    },
    mapFieldList(v) {
      // 初始化加载relation值
      this.handleCommand(this.value, true);
    },
  },
  methods: {
    handleRelationChange(value) {
      const findValue = this.mapFieldList.find((it) => it.value == value || it.name == value);
      this.relation = findValue ? findValue.value : value;
      this.dispatch(this.relation);
    },
    handleCommand(value, initValue) {
      const findValue = this.mapFieldList.find((it) => it.value == value);
      this.relation = findValue ? findValue.name || findValue.value : value || "";
      if (dsf.isUnDef(initValue)) {
        this.dispatch(value);
      }
    },
    dispatch(value) {
      this.$emit("input", value);
      this.$emit("change", value);
    },
  },
};
</script>
