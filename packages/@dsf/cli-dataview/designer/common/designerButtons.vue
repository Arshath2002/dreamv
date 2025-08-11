<!--
 * @Editor: zhanghang
 * @Description: 
 * @Date: 2024-03-15 09:08:16
 * @LastEditors: zhanghang
 * @LastEditTime: 2024-03-20 14:19:52
-->
<template>
  <div class="dv-designer-btn-wrapper">
    <div
      class="dsf-dv-designer-btn"
      v-for="(button, $index) in buttons"
      v-show="showButton(button)"
      :key="$index"
      :title="button.text"
      btn-style="icon-text"
      @click="button.handler($event, button)"
    >
      <div class="icon-box">
        <DsfIcon :name="button.icon" ></DsfIcon>
      </div>
      <p>{{ button.text }}</p>
    </div>
  </div>
</template>
<script>
export default {
  name: "DsfDvDesignerButtons",
  inject: {
    $designer: {
      default: null,
    },
  },
  props: {
    buttons: {
      type: Array,
      default() {
        return [];
      },
    },
    designer: {
      type: Object,
      default() {
        return null;
      },
    },
    showButton: {
      type: Function,
      default: dsf.noop,
    },
  },
  created() {
    this?.$designer?.renderTopButtons?.(this.buttons);
  },
  methods: {},
};
</script>
<style lang="scss">
@import "_dataview/assets/styles/designer/DsfDVDesignerButtons.scss";
</style>