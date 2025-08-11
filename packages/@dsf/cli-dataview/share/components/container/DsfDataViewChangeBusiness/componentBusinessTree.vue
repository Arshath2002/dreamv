<!--
 * @Editor: zhanghang
 * @Description: 
 * @Date: 2025-02-24 14:10:32
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-02-24 18:30:20
-->
<template>
  <component :is="__context__.props.ctrlName" ref="ctrl" :is-design="__hasDesign__" v-bind.sync="__context__.props">
    <template v-for="slot in __context__.props.slots" v-slot:[slot.name]>
      <component-business-tree v-for="child in slot.controls" :key="child.designId" :component-props="child" :is-design="__hasDesign__"></component-business-tree>
    </template>
  </component>
</template>
<script>
export default {
  name: "componentBusinessTree",
  props: {
    // 组件属性
    componentProps: {
      type: Object,
      default() {
        return null;
      },
    },
    isDesign: {
      type: Boolean,
      require: true,
    },
  },
  computed: {
    __hasDesign__() {
      return this.isDesign;
    },
    __context__() {
      return this.layoutContext;
    },
  },
  data() {
    return {
      layoutContext: {
        props: null,
        controls: {},
      },
    };
  },
  watch: {
    componentProps: {
      handler() {
        this.__context__.props = this.componentProps;
      },
    },
  },
  created() {
    this.__context__.props = this.componentProps;
  },
  methods: {
    resize() {
      this.$refs.ctrl&& this.$refs.ctrl.resize && this.$refs.ctrl.resize();
    },
  },
};
</script>
