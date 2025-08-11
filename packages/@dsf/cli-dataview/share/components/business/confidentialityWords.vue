<template>
  <div class="dsf-dv-input-text-box ds-control" :style="controlStyle">
    <div class="confidentiality-text">
      <span v-if="isDesign">密级：</span>
      <span>{{ showText }}</span>
      <DsfIcon v-if="isStar" name="star_fill"></DsfIcon>
      <span v-if="showTime">{{ showTime }}</span>
    </div>
  </div>
</template>
<script>
export default dsf.component({
  name: "DsfDataViewConfidentialityWords",
  ctrlCaption: "保密级",
  mixins: [$mixins.dataView],
  props: {
    //密级标志
    confidentiality: {
      type: Boolean,
      default: true,
    },
    designShowMarkRemove: {
      type: Boolean,
      default: false,
    },
    // 字体颜色
    fontColor: {
      type: String,
      default: "#FF3017",
    },
    height: {
      type: String,
      default: "auto",
    },
    //秘密等级
    confidentialityLevel: {
      type: [String, Number],
      default: "",
    },
    //秘密文本
    confidentialityLevelText: {
      type: String,
      default: "",
    },
    //解密时间
    releaseSecretTime: {
      type: String,
      default: "",
    },
    hasSelect: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    marginAndPadding() {
      let { padding: paddingArray, margin: marginArray } = this;
      let padding = dsf.dataview.utils.transformArrayPx(paddingArray);
      if (this.isDesign) {
        marginArray = [0, marginArray[1], 0, marginArray[3]];
      }

      let margin = dsf.dataview.utils.transformArrayPx(marginArray);
      return {
        padding,
        margin,
      };
    },
    controlStyle() {
      let { height, marginAndPadding, fontColor } = this;
      let style = {
        ...marginAndPadding,
        color: fontColor,
      };
      if (!this.isDesign) {
        style.height = dsf.dataview.utils.transformPx(height);
      }
      return style;
    },
    isStar() {
      let confidentialityLevel = this.confidentialityLevel;
      return confidentialityLevel && confidentialityLevel != 20 && confidentialityLevel != -10;
    },
    showText() {
      if (this.confidentialityLevel == "-10") {
        return "密级数据异常";
      }
      return this.confidentialityLevelText;
    },
    showTime() {
      if (this.releaseSecretTime && typeof this.releaseSecretTime == "string") {
        return this.releaseSecretTime.substr(0, 10);
      }
      return this.releaseSecretTime;
    },
  },
  created() {
    if (this.isDesign) {
      this.getInfo();
    }
  },
  methods: {
    getInfo() {
      const pageName = this.$designer.pageName;
      const namespace = this.$designer.nameSpace;
      const url = dsf.url.getWebPath("rm/secret", $$webRoot.platform);
      this.$http
        .get(url, {
          namespace,
          pageName,
        })
        .done((res) => {
          if (res.success) {
            let result = res.data;

            let { dsSecurityLevelValue, dsSecurityLevelExpiryDate, dsSecurityLevelText } = result;
            this.$emit("update:confidentialityLevel", dsSecurityLevelValue);
            this.$emit("update:releaseSecretTime", dsSecurityLevelExpiryDate);
            this.$emit("update:confidentialityLevelText", dsSecurityLevelText);
          } else {
            dsf.layer.message(res.message, false);
          }
        });
    },
  },
});
</script>
<style lang="scss">
@import "_dataview/assets/styles/share/components/textBox.scss";
</style>
