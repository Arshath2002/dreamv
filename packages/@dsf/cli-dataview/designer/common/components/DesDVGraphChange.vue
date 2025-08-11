<!--
 * @Editor: zhanghang
 * @Description: 
 * @Date: 2025-05-23 16:56:29
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-06-18 14:00:36
-->
<template>
  <div class="des-dv-change-graph">
    <div class="change-collapse-item" v-for="(group, index) in graphsTemplates" :key="index">
      <div class="change-collapse-item__header" @click="group.isExtend = !group.isExtend">{{ group.title }}（{{ group.items.length }}）</div>
      <div class="change-collapse-item__content">
        <div class="graph-item" @click="changeGraph(it)" v-for="it in group.items" :key="it.id">
          <el-image fit="contain" lazy :src="it.data.thumbnail | imgDVFormat"></el-image>
          <div class="name">{{ it.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "DesDVGraphChange",
  inject: {
    $designer: {
      default: null,
    },
    $properties: {
      default: null,
    },
    $designerRight: {
      default: null,
    },
  },
  props: {
    owner: {
      type: Object,
      default() {
        return null;
      },
    },
  },
  computed: {
    graphsTemplates: {
      get() {
        return this.$designer.graphsTemplates || [];
      },
    },
  },
  methods: {
    changeGraph(group) {
      this.owner.$children[0].changeGraph(group);
    },
  },
};
</script>
