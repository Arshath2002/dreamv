<!--
 * @Description: 自定义图表配置编辑器
 * @Author: zhanghang
 * @Date: 2021-07-21 14:43:48
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-05-27 14:59:47
-->
<template>
  <div class="des-dv-custom-chart-edit">
    <div class="des-dv-custom-chart-edit__header" v-if="config.type === 'drawer'">
      <DsfButton icon="icon-yunhang" size="small" @click="runCode">运行</DsfButton>
      <span><DsfIcon name="dsf-icon-zitidaima" @click="formatCode" title="格式化" /></span>
    </div>
    <MonacoEditor ref="editor" class="des-dv-custom-chart-edit__monaco" height="100%" width="100%" :language="'javascript'" @mounted="editorLoaded"></MonacoEditor>
  </div>
</template>
<script>
export default {
  name: "DesDVCustomThreeEdit",
  mixins: [$mixins.propertyDialogSetting],
  props: {
    // 支持抽屉模式
    config: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      tmp: "",
    };
  },
  created() {
    let threeOptions = dsf.mix(true, {}, this.currentData);
    let threeString = this.owner.threeString;
    if (threeString) {
      threeOptions = threeString;
    } else {
      threeOptions = dsf.dataview.utils.objectToString(threeOptions, true);
    }

    let tmp = `(function () {
  return ${threeOptions}
})()`;

    this.tmp = tmp;
  },
  methods: {
    yes() {
      let code = this.$refs["editor"].getContent();

      let threeOptions = eval(code);

      this.owner.threeString = dsf.dataview.utils.objectToString(threeOptions, true);
      setTimeout(() => {
        this.owner.reset();
        this.$nextTick(() => {
          dsf.emit.$emit("updatePropertyThree", {}, [this.owner.$children[0]]);
        });
      }, 0);

      return threeOptions;
    },
    runCode() {
      const code = this.$refs["editor"].getContent();
      const threeOptions = eval(code);
      this.owner.threeString = dsf.dataview.utils.objectToString(threeOptions, true);
      this.owner.threeOptions = threeOptions;
      this.$nextTick(() => {
        this.owner.reset();
        dsf.emit.$emit("updatePropertyThree", {}, [this.owner.$children[0]]);
      });
    },
    formatCode() {
      try {
        let { editor } = this.$refs["editor"];
        editor.trigger("anyString", "editor.action.formatDocument");
      } catch (error) {
        console.log(error);
      }
    },
    editorLoaded() {
      this.$nextTick(() => {
        let str = this.tmp;
        let { editor } = this.$refs["editor"];
        this.$refs["editor"].setContent(str);
        editor.trigger("anyString", "editor.action.formatDocument");
      });
    },
  },
};
</script>
<style lang="scss">
@import "_dataview/assets/styles/designer/DesDVCustomChartEdit.scss";
</style>
