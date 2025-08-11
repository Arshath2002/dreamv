<!--
 * @Description: 行间设置
 * @Author: shenah
 * @Date: 2024-09-11 09:48:41
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-02-12 18:27:59
-->


<template>
  <div class="des-dv-line-space-setting">
    <div class="info-wrap">
      <div class="info-item">
        <div class="info-label">行间间隔</div>
        <DesDVNumber
          :config="{ unit: 'px',min:0 }"
          v-model="info.space"
        />
      </div>
    </div>
    <UniversalRuleConfig
      :currentData="info.list"
      :config="config"
      :owner="owner"
      ref="universalRuleConfigRef"
    >
    </UniversalRuleConfig>
  </div>
</template>
<script>
import UniversalRuleConfig from "./DesDVUniversalRuleConfig/universalRuleConfig.vue";
export default {
  name: "DesDVLineSpace",
  mixins: [$mixins.propertyDialogSetting],
  components: { UniversalRuleConfig },
  data() {
    return {
      info: {
        list: [],
      },
    };
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
      this.info = _.cloneDeep(this.currentData);
    },
    yes() {
      let list = this.$refs.universalRuleConfigRef.yes();
      return {
        ...this.info,
        list
      }
    },
  },
};
</script>
