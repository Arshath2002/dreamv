<!--
 * @Editor: zhanghang
 * @Description: 菜单迭代组件
 * @Date: 2024-10-14 17:14:30
 * @LastEditors: zhanghang
 * @LastEditTime: 2024-10-16 18:50:35
-->
<template>
  <div class="svg-gauge-menu">
    <svgGaugeItem
      ref="svgGaugeItem"
      v-bind="{ ...getStyles }"
      :activeMenu="activeMenu"
      :isRoot="level === 0"
      :level="level"
      :innerRadius="innerRadius"
      :radius="outRadius"
      :menus="currentMenus"
      :avgAngle="avgAngle / ratio"
      :offset="offset * ratio"
      v-on="$listeners"
    />
    <template v-if="findActiveChildren && findActiveChildren.children">
      <svgGaugeMenu
        ref="svgGaugeMenu"
        :styles="styles"
        :activeMenu="activeMenu"
        :innerRadius="outRadius"
        :avgAngle="avgAngle"
        :offset="offset"
        :singleMenuLen="singleMenuLen"
        :level="level + 1"
        :menusWidths="menusWidths"
        :menus="findActiveChildren.children"
        v-on="$listeners"
      />
    </template>
  </div>
</template>
<script>
import svgGaugeItem from "./svgGaugeItem.vue";
export default {
  name: "svgGaugeMenu",
  components: { svgGaugeItem },
  props: {
    // 激活菜单id
    activeMenu: {
      type: Array,
      default() {
        return [];
      },
    },
    // 树形菜单结构
    menus: {
      type: Array,
      require: true,
    },
    // 内径
    innerRadius: {
      type: Number,
      require: true,
    },
    // 层级
    level: {
      type: Number,
      default: 0,
    },
    // 菜单宽度
    menusWidths: {
      type: Array,
      default() {
        return [70, 60];
      },
    },
    // 根部单个菜单角度
    avgAngle: {
      type: Number,
      require: true,
    },
    // 中心偏移
    offset: {
      type: Number,
      require: 0.5,
    },
    // 子集菜单个数
    singleMenuLen: {
      type: Array,
      default() {
        return [1, 3];
      },
    },
    // 菜单样式
    styles: {
      type: Array,
      require: true,
    },
  },
  computed: {
    getStyles() {
      const { styles, level } = this;
      let style = styles[level];
      if (!style) {
        style = styles[styles.length - 1];
      }
      return style;
    },
    menuIds() {
      return this.currentMenus.map((it) => it.id);
    },
    findActiveChildren() {
      const active = this.activeMenu[this.level];
      if (active) {
        const activeId = active.id;
        return this.menus.find((it) => it.id === activeId);
      }
      return null;
    },
    currentMenus() {
      const menus = this.menus.map((it) => {
        const { children, ...properties } = it;
        return properties;
      });
      return menus;
    },
    // 获取外径
    outRadius() {
      const { menusWidths, level, innerRadius } = this;
      const width = menusWidths[level] || menusWidths[menusWidths.length - 1];
      return innerRadius + width;
    },
    ratio() {
      const { level, singleMenuLen } = this;
      return singleMenuLen[level] || singleMenuLen[singleMenuLen.length - 1] || 1;
    },
  },
  methods: {
    renderMenu() {
      this.$refs.svgGaugeItem.init();
      this.$refs.svgGaugeMenu && this.$refs.svgGaugeMenu.renderMenu();
    },
  },
};
</script>
