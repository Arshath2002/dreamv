<!--
 * @Editor: zhanghang 可视化标尺
 * @Description: 
 * @Date: 2024-03-13 10:58:04
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-05-28 09:59:42
-->
<template>
  <div ref="designerPanel" v-loading.fullscreen.lock="loading" class="ds-designer" :class="[mobile ? 'mobile' : 'pc']">
    <div class="designer-head">
      <div class="designer_tools">
        <slot name="top"></slot>
      </div>
    </div>
    <div class="designer-content">
      <div class="designer-center">
        <slot name="nav"></slot>
        <div class="designer-left" v-show="showLeft">
          <slot name="left"></slot>
        </div>
        <DsfDVDesignerContainer class="designer-page" v-bind="$props" v-on="$listeners">
          <slot></slot>
        </DsfDVDesignerContainer>
        <div class="designer-right" v-show="showRight">
          <slot name="right"></slot>
        </div>
      </div>
    </div>
    <slot name="append"></slot>
    <DsfIagentGlobalAiChat class="dsf-dv-ai-chat" :navMenuList="navMenuList" />
  </div>
</template>

<script>
import DsfDVDesignerContainer from "./designerContainer/index";
export default {
  name: "DsfDVDesignerFrame",
  components: {
    DsfDVDesignerContainer,
  },
  props: {
    showLeft: {
      type: Boolean,
      default: true,
    },
    showRight: {
      type: Boolean,
      default: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    mobile: {
      type: Boolean,
      default: false,
    },
    // 禁用缩放
    disableScale: {
      type: Boolean,
      default() {
        return !this.$route.query.all;
      },
    },
    // 禁用旋转
    disableRotate: {
      type: Boolean,
      default() {
        return !this.$route.query.all;
      },
    },
    // 设备列表
    deviceList: {
      type: Array,
      default() {
        return [];
      },
    },
    // 默认设备
    defaultDevice: {
      type: Object,
      default: null,
    },
  },
  data() {
    const { agentCode = "", currentChatId = "" } = this.$route.query;
    return {
      navMenuList: [
        {
          path: `/pc/ai/dv-ai?agentCode=${agentCode}&currentChatId=${currentChatId}`,
          name: "大屏AI",
          icon: "iagent-icon-zhushou",
        },
      ],
    };
  },
};
</script>
