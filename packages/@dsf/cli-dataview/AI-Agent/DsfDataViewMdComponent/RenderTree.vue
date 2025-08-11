<!--
 * @Editor: zhanghang
 * @Description: 
 * @Date: 2025-04-17 13:42:44
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-04-30 17:18:01
-->
<template>
  <component :key="__context__.props.designId" :is="__context__.props.ctrlName" ref="ctrl" :is-design="__hasDesign__" v-bind.sync="__context__.props">
    <template v-for="slot in __context__.props.slots" v-slot:[slot.name]>
      <RenderTree v-for="child in slot.controls" :key="child.designId" :component-props="child" :is-design="__hasDesign__"></RenderTree>
    </template>
  </component>
</template>
<script>
export default {
  name: "RenderTree",
  inheritAttrs: false,
  props: {
    //组件属性
    componentProps: {
      type: Object,
      default() {
        return null;
      },
    },
  },
  data() {
    return {
      $layoutContext: {
        props: null,
        root: null,
        parent: null,
        controls: {},
      },
    };
  },
  computed: {
    __context__() {
      return this.$data.$layoutContext;
    },
    __hasDesign__() {
      return true;
    },
  },
  watch: {
    componentProps: {
      handler() {
        this.__context__.props = this.componentProps;
      },
      deep: true,
    },
  },
  created() {
    this.__context__.props = this.componentProps;
  },
};
</script>
