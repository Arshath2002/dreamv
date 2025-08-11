<!--
 * @Editor: zhanghang
 * @Description: 组件树
 * @Date: 2024-11-14 18:03:43
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-01-17 14:26:41
-->
<template>
  <div class="des-dv-left-layout-grids-tree">
    <template v-for="item in data">
      <div :title="item.label" :id="'item-label-' + item.designId" :key="item.designId" class="des-dv-left-layout-grids-tree-item">
        <div class="des-dv-left-layout-grids-tree-item__label label-wrapper" :class="{ 'is-root': isRoot }">
          <DsfIcon v-if="item.children.length" class="indicator" name="xiajiantou" @click.stop="doClosed(item)" />
          <div @click="componentClick(item)" :class="{ 'is-active': activeItemId === item.designId }" class="label-text">
            <span :title="item.label">{{ item.label }}</span>
            <DsfIcon class="common-icon" v-if="item.showRelation" name="dv-icon-shandian" />
            <DsfIcon class="common-icon" v-if="item.showAnimate" name="dv-icon-bim_donghua" />
            <DsfIcon class="delete-icon" @click.stop="deleteComponents(item)" name="delete" />
          </div>
        </div>
        <template v-if="item.children.length">
          <DesDVLeftLayoutGridsTree :activeItemId="activeItemId" v-on="$listeners" :data="item.children" />
        </template>
      </div>
    </template>
  </div>
</template>
<script>
export default {
  name: "DesDVLeftLayoutGridsTree",
  props: {
    isRoot: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Array,
      require: true,
    },
    // 选中组件的designerId
    activeItemId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      hoverComponent: null,
    };
  },
  methods: {
    /**
     * 组件点击事件
     * @param {Object} item 组件信息
     */
    componentClick(item) {
      this.$emit("componentClick", item);
    },
    /**
     * 删除组件
     * @param {Object} item 组件信息
     */
    deleteComponents(item) {
      this.$emit("deleteComponents", item);
    },
    /**
     * @Description 展开关闭方法
     * @param {Object} item 组件对象
     */
    doClosed(item) {
      let itemEl = document.querySelector(`#item-label-${item.designId}`);
      if (itemEl.classList.contains("closed")) {
        itemEl.classList.remove("closed");
      } else {
        itemEl.classList.add("closed");
      }
    },
  },
};
</script>
