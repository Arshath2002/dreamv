<!--
 * @Author: liuhu@dreamdt.cn
 * @Date: 2023-07-21 16:00:41
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-06-23 10:16:24
-->
<template>
  <div class="des-dv-custom-collapse-item-container">
    <div class="custom-collapse-item__header">
      <div class="item__header-left" @click="handleCollapseClick">
        <i class="el-icon-caret-bottom icon-size" v-if="isActive"></i>
        <i class="el-icon-caret-right icon-size" v-else></i>

        <span>{{ name }}</span>
      </div>
      <div class="slot-right">
        <slot name="header-right"></slot>
      </div>
    </div>
    <div class="custom-collapse-item__content" :class="{ active: isActive }">
      <slot></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: "CollapseItem",
  props: {
    name: {
      props: [String, Number],
      default: "",
    },
    data: {
      props: String,
      default: "",
    },
  },
  inject: ["collapse"],
  computed: {
    isActive() {
      return this.collapse.activeNames.indexOf(this.data) > -1;
    },
  },
  methods: {
    handleCollapseClick() {
      if (!this.data) {
        return;
      }
      if (this.collapse.handleItemClick) {
        this.collapse.handleItemClick(this.data);
      }
    },
  },
};
</script>
