<!--
 * @Editor: zhanghang
 * @Description: 
 * @Date: 2025-04-17 13:42:44
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-05-28 17:10:50
-->
<template>
  <component
    :key="__context__.props.designId"
    :dataType="componentProps.dataType"
    :excelData="componentProps.excelData"
    :is="__context__.props.ctrlName"
    ref="ctrl"
    :is-design="__hasDesign__"
    v-bind.sync="__context__.props"
  >
    <template v-for="slot in __context__.props.slots" v-slot:[slot.name]>
      <ComponentTree v-for="child in slot.controls" :key="child.designId" :component-props="getChildProps(child)" :is-design="__hasDesign__"></ComponentTree>
    </template>
  </component>
</template>
<script>
export default {
  name: "ComponentTree",
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
      return false;
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
  methods: {
    getChildProps(child) {
      const res = dsf.mix(true, {}, child);
      res.excelData = this.componentProps.excelData;
      res.dataType = this.componentProps.dataType;
      return res;
    },
  },
};
</script>
