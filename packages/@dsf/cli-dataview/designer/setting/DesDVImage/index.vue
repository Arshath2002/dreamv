<!--
 * @Description: 公用图片属性设置
 * @Author: shenah
 * @Date: 2025-02-20 14:35:22
 * @LastEditors: shenah
 * @LastEditTime: 2025-02-27 17:24:54
-->

<template>
  <div class="hover-attr-wrap des-dv-image-config">
    <el-tabs v-model="activeName" type="card" class="image-tabs">
      <el-tab-pane label="图片样式" name="style" v-if="!config.noStyle">
        <ImageStyle :form="form" @updateData="updateData" :config="config"></ImageStyle>
      </el-tab-pane>
      <el-tab-pane label="图片动效" name="effect" v-if="config.isEffect">
        <ImageAnimation :form="form" @updateData="updateData"></ImageAnimation>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import ImageStyle from "./imageStyle.vue";
import ImageAnimation from "./imageAnimation.vue";
import imageMixin from "./imageMixin";
export default {
  name: "DesDVImageConfig",
  props: {
    currentData: {
      type: Object,
      default: () => ({}),
    },
    owner: {
      type: Object,
      default: () => ({}),
    },
    config: {
      type: Object,
      default: () => ({}),
    },
  },
  mixins: [imageMixin],
  components: {
    ImageStyle,
    ImageAnimation,
  },
  data() {
    return {
      activeName: this.config.noStyle ? "effect" : "style",
    };
  },
  created() {
  },
  methods: {
    updateData(obj) {
      this.$emit("change", obj);
    },
  },
};
</script>
<style lang="scss">
@import "_dataview/assets/styles/designer/DesDVImageConfig.scss";
</style>
