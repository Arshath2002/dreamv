<!--
 * @Description: 自定义图表配置编辑器
 * @Author: zhanghang
 * @Date: 2021-07-21 14:43:48
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-06-13 14:15:26
-->
<template>
  <div class="custom-chart-edit">
    <MonacoEditor ref="editor" height="100%" width="100%" :language="'javascript'" @mounted="editorLoaded"></MonacoEditor>
  </div>
</template>
<script>
export default {
  name: "DesDVCustomGisEdit",
  mixins: [$mixins.propertyDialogSetting],
  data() {
    return {
      tmp: "",
    };
  },
  created() {
    let layerStyles = dsf.mix(true, {}, this.currentData);
    let layerStylesString = this.owner.layerStylesString;
    if (layerStylesString) {
      layerStyles = layerStylesString;
    } else {
      layerStyles = dsf.dataview.utils.objectToString(layerStyles, true);
    }

    let tmp = `(function () {
  return ${layerStyles}
})()`;

    this.tmp = tmp;
  },
  methods: {
    yes() {
      let code = this.$refs["editor"].getContent();

      const layerStyles = eval(code);

      setTimeout(() => {
        let vm = this.owner.$children[0];
        if (vm && vm.middleWareData) {
          vm.middleWareData(vm.serviceData);
        }
      });

      return layerStyles;
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
