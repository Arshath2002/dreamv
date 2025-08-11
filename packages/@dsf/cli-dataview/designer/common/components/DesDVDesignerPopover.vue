<!--
 * @Description: 属性公用按钮悬浮框
 * @Author: shenah
 * @Date: 2025-02-11 14:04:53
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-06-30 17:45:01
-->

<template>
  <el-popover placement="top" ref="popover" :width="attrData.config.width" trigger="manual" popper-class="dsf-dv-designer-popover" v-model="visible" @show="show" @after-leave="hide">
    <div class="designer-user-popover" :style="designerUserPopoverStyle">
      <div class="designer-user-header">
        <div class="title"></div>
        <DsfIcon name="close" class="popover-close" @click.stop="closePopover"></DsfIcon>
      </div>
      <component
        :is="attrData.config.content"
        v-bind:owner="owner"
        v-bind:currentData="dataValue"
        v-bind:config="componentConfig"
        @change="changeData"
        ref="component"
        class="designer-user-custom-component"
      ></component>
    </div>
    <template v-if="attrData.config.buttonType === 'icon'">
      <DsfIcon slot="reference" :name="getIconConfig.icon" :title="getIconConfig.title" :style="getIconConfig" @click.stop="iconClick"></DsfIcon>
    </template>
    <div slot="reference" class="data-view-dialog-btn" @click.stop="iconClick" v-else>
      <div class="text">
        <el-badge :is-dot="!!hasValue" type="primary" class="common-property-badge button-badge">
          {{ attrData.config.buttonText || "设置" }}
        </el-badge>
      </div>
      <DsfIcon name="shezhi" class="dialog-icon" :style="{ color: hasValue ? 'var(--t--normal)' : 'inherit' }"></DsfIcon>
    </div>
  </el-popover>
</template>
<script>
export default {
  name: "DesDVDesignerPopover",

  props: {
    attrData: {
      type: Object,
      default() {
        return null;
      },
    },
    owner: {
      type: Object,
      default() {
        return null;
      },
    },
    componentConfig: {
      type: Object,
    },
    dataValue: {},
  },
  data() {
    return {
      visible: false,
      hasValue: true, // 这里先为true
    };
  },
  computed: {
    designerUserPopoverStyle() {
      let style = {};
      if (this.attrData.config.height) {
        style.height = dsf.dataview.utils.transformPx(this.attrData.config.height);
      }
      return style;
    },
    getIconConfig() {
      let iconConfig = this.attrData.config.iconConfig || {
        icon: "sehzhi",
      };
      return iconConfig;
    },
  },
  mounted() {
    document.querySelector("#app").addEventListener("click", this.handleClickOutside);
  },
  beforeDestroy() {
    document.querySelector("#app").removeEventListener("click", this.handleClickOutside);
  },
  methods: {
    handleClickOutside(e) {
      if (this.$refs.component && !this.$refs.component.$el.contains(e.target) && this.visible) {
        this.closePopover();
      }
    },
    closePopover() {
      this.visible = false;
    },
    iconClick() {
      this.visible = !this.visible;
    },
    // 对外提供打开弹窗
    openPopover() {
      this.visible = true;
    },
    changeData(val) {
      this.$emit("input", val);
      this.$emit("change", val);
    },
    show() {
      this.$emit("showPopover");
    },
    hide() {
      this.$emit("hidePopover");
    },
  },
};
</script>
