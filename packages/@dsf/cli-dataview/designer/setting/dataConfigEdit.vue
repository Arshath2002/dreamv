<!--
 * @Description: 自定义图表配置编辑器
 * @Author: zhanghang
 * @Date: 2021-07-21 14:43:48
 * @LastEditors: shenah
 * @LastEditTime: 2023-09-20 18:45:21
-->
<template>
  <div class="data-view-config-edit">
    <MonacoEditor ref="editor" height="100%" width="100%" :language="'javascript'" @mounted="editorLoaded"></MonacoEditor>
  </div>
</template>
<script>
export default {
  name: "dataConfigEdit",
  mixins: [$mixins.propertyDialogSetting],
  data() {
    return {
      wholeOptions: {},
      tmp: ""
    };
  },
  created() {
    let wholeOptions = dsf.mix(true, Array.isArray(this.currentData) ? [] : {}, this.currentData);
    wholeOptions = JSON.stringify(wholeOptions, null, "\t");
    let tmp = `(function () {
  return ${wholeOptions}
})()`;

    this.tmp = tmp;
  },
  methods: {
    yes() {
      let code = this.$refs["editor"].getContent();

      this.wholeOptions = eval(code);

      return this.wholeOptions;
    },
    editorLoaded() {
      this.$nextTick(() => {
        let str = this.tmp;
        this.$refs["editor"].setContent(str);
      });
    }
  }
};
</script>
