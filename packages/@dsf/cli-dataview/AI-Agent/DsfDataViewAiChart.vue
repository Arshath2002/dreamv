<!--
 * @Editor: zhanghang
 * @Description: 
 * @Date: 2025-03-18 18:17:28
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-05-20 19:16:56
-->
<template>
  <DsfIagentAiChat
    ref="DsfIagentAiChat"
    :agentCode="agentCode"
    :historyDefaultCurrentChatId="historyDefaultCurrentChatId"
    :welcomeMsg="welcomeMsg"
    @create-chat="resetRecommend"
    @change-chat="resetRecommend"
  >
    <template #header-right>
      <slot name="header-right" />
    </template>
    <template #textbox-top="{ sizeStatus }">
      <!-- 推荐组件列表 -->
      <RecommendComponentList ref="recommend" :contentWidth="sizeStatus == 'mini' ? 300 : 600" />
    </template>
  </DsfIagentAiChat>
</template>
<script>
import RecommendComponentList from "./components/RecommendComponentList.vue";
export default {
  name: "DsfDataViewAiChart",
  components: { RecommendComponentList },
  data() {
    return {
      welcomeMsg: "我可以帮你快速生成图表和大屏，请把你的任务交给我吧~",
      agentCode: "dataview_ai_designer",
      historyDefaultCurrentChatId: "",
    };
  },
  methods: {
    resetRecommend() {
      this.$refs.recommend && this.$refs.recommend.reset();
    },
    sendMsg(...args) {
      this.$refs.DsfIagentAiChat.sendMsg(...args)
    },
  },
  created() {
    const { agentCode = "", currentChatId = "" } = this.$route.query;
    if (agentCode) {
      this.agentCode = agentCode;
      this.historyDefaultCurrentChatId = currentChatId;
      this.$ai.foldDialog(false);
    }
  },
};
</script>
<style lang="scss">
@import "./style.scss";
</style>
