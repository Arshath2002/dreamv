<!--
 * @Editor: zhanghang
 * @Description: 
 * @Date: 2025-05-19 15:56:51
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-07-15 11:45:41
-->
<template>
  <div class="dsf-dv-md-components">
    <template v-if="Array.isArray(options) && options.length">
      <DsfDataViewMdComponent ref="DsfDataViewMdComponent" :styleTheme="styleTheme" :options="it" v-for="it in options" :comp-key="it.compKey" :key="it.compKey" />
      <el-divider></el-divider>
      <div class="btn-box" v-if="hasBoard && options.length >= 2">
        <DsfButton size="mini" @click="createBoard">生成看板</DsfButton>
      </div>
    </template>
  </div>
</template>
<script>
import DsfDataViewMdComponent from "./DsfDataViewMdComponent.vue";
export default dsf.component({
  name: "DsfDataViewMdComponents",
  mixins: [$mixins.smartCard],
  ctrlCaption: "大屏AI图表",
  inject: ["$designer"],
  components: { DsfDataViewMdComponent },
  computed: {
    components() {
      if (typeof this.local.options.components === "string") {
        const result = [];
        this.local.options.components.replace(/(```json|json)[\s\S]*?(```)/gm, function (value) {
          value = value
            .replace(/^```\s*json|^\s*json/, "")
            .replace(/```/, "")
            .replace(/\\n/gm, "")
            .replace(/\\/gm, "")
            .replace(/\/\/.*/g, "");

          if (value) {
            result.push(...eval(value));
          }
        });

        return result;
      }

      return this.local.options.components || [];
    },
    defaultTheme() {
      return this.local.options.defaultTheme || "lanbai";
    },
  },
  data() {
    return {
      hasBoard: false,
      styleTheme: "",
      options: [],
    };
  },
  beforeDestroy() {
    this.unwatch?.();
  },
  created() {
    this.options = this.components.map((it) => {
      return { compKey: dsf.uuid(), ...it };
    });

    this.styleTheme = this.defaultTheme;
    if (this.$designer) {
      this.styleTheme = this.$designer.styleTheme;
      this.unwatch = this.$watch(
        () => {
          return this.$designer.styleTheme;
        },
        (styleTheme) => {
          this.$refs["DsfDataViewMdComponent"].forEach((it) => {
            it.changTheme(styleTheme);
          });
          this.styleTheme = styleTheme
        }
      );
    }
  },
  mounted() {
    const el = $(this.$el).closest(".ai-view")[0];
    if (el) {
      const ai = el.__vue__;
      // 只有在 大屏设计智能体下 才允许生成看板
      if (ai.agentCode === "dataview_ai_designer") {
        this.hasBoard = true;
      }
    }
  },
  methods: {
    createBoard() {
      const el = $(this.$el).closest(".ai-view")[0];
      if (el) {
        const ai = el.__vue__;
        ai.sendMsg({
          data: { query: "生成看板" },
        });
      }
    },
  },
});
</script>
<style lang="scss">
.dsf-dv-md-components {
  .el-divider--horizontal {
    margin: 10px 0;
  }
  .btn-box {
    .ds-button {
      background-color: var(--t--normal);
      color: #fff;
    }
  }
}
</style>
