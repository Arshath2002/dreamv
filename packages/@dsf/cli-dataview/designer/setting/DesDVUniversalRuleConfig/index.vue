<!--
 * @Description: 通用规则配置(生成不同配置)
 * @Author: shenah
 * @Date: 2024-04-15 10:02:59
 * @LastEditors: shenah
 * @LastEditTime: 2024-09-11 10:24:23
-->

<template>
  <div
    class="des-dv-universal-rule-config-wrap"
    style="width: 100%;height: 100%;"
  >
    <UniversalRuleConfig
      :currentData="currentData"
      :config="config"
      :owner="owner"
      ref="universalRuleConfigRef"
    ></UniversalRuleConfig>
  </div>
</template>
<script>
import UniversalRuleConfig from "./universalRuleConfig.vue";
export default {
  name: "DesDVUniversalRuleConfig",
  mixins: [$mixins.propertyDialogSetting],
  components: {
    UniversalRuleConfig
  },
  props: {},
  data() {
    return {

    };
  },
  created() {

  },
  methods: {
    yes() {
      return this.$refs.universalRuleConfigRef.yes();
    },
  },
};
</script>
<style lang="scss">
</style>
