<!--
 * @Editor: zhanghang
 * @Description: 
 * @Date: 2025-05-23 16:56:30
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-06-06 18:34:12
-->
<template>
  <div class="ds-video-upload" :class="{ active: value.src }" @click="openUploadDialog">
    <video ref="player" :src="value.src" autoplay loop muted></video>
    <i class="add-btn el-icon-plus"></i>
    <DsfIcon class="del-icon" name="close" @click.stop="removeVideo" v-if="value.src"></DsfIcon>
  </div>
</template>

<script>
export default {
  name: "DesDVVideoUploadDialog",
  props: {
    value: {
      type: Object,
      default() {
        return {
          src: "",
          static: false,
        };
      },
    },
  },
  data() {
    return {
      defaultValue: {
        src: "",
        static: true,
      },
    };
  },
  methods: {
    changeValue(val) {
      let data = val || this.defaultValue;
      this.$emit("input", data);
      this.$emit("change", data);
    },
    openUploadDialog() {
      const self = this;
      this.$openDialog({
        params: { currentData: this.value },
        ...this.$attrs.config,
        btns: [
          {
            text: "确定",
            handler: (res) => {
              let result = res.yes();
              self.changeValue(result);
            },
          },
          {
            text: "重置",
            handler: (res) => {
              self.changeValue();
            },
          },
        ],
      });
    },
    removeVideo() {
      this.changeValue();
    },
  },
};
</script>

<style lang="scss">
@import "_dataview/assets/styles/designer/DesDVVideoUpload.scss";
</style>
