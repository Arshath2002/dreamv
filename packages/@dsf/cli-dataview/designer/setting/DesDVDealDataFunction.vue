<!--
 * @Description: 自定义公式函数
 * @Author: zhanghang
 * @Date: 2021-07-21 14:43:48
 * @LastEditors: zhanghang
 * @LastEditTime: 2024-11-08 15:19:58
-->
<template>
  <div class="custom-func-edit">
    <DsfMonacoCustom ref="editor" height="370" width="100%" theme="vs-dark" language="javascript" @editLoaded="editorLoaded" :loadTipCustom="loadTipCustom" :loadTip="loadTip"></DsfMonacoCustom>
  </div>
</template>
<script>
export default {
  name: "DesDVDealDataFunction",
  mixins: [$mixins.propertyDialogSetting],
  data() {
    return {
      functionContainer: "",
      loadTip: {
        type: "local", // 支持local/jupyter 两种方式
        isOpenTip: true, // 是否开启提示
        localLanguage: ["javascript"], // 本地支持语言
      },
    };
  },
  created() {
    this.functionContainer = this.currentData;
  },
  methods: {
    // 自定义提示
    loadTipCustom(model, position, code) {
      if (this.config.type !== "initPage") {
        return {
          suggestions: [],
        };
      }
      const lastCode = code.substring(code.length - 1);
      if (lastCode === "@") {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn - 1,
          endColumn: word.endColumn,
        };

        let globalVariable = ["全局参数", "路径参数"];
        let suggestions = globalVariable.map((variable) => {
          return {
            label: variable,
            kind: monaco.languages.CompletionItemKind.Function,
            filterText: `@-${variable.split("").join("-")}`,
            insertText: variable,
            range: range,
          };
        });
        return {
          suggestions: suggestions,
        };
      }
      return {
        suggestions: [],
      };
    },

    yes() {
      return this.$refs["editor"].getValue();
    },
    editorLoaded(editerInstance) {
      this.$nextTick(() => {
        editerInstance.setValue(this.functionContainer);
        editerInstance.trigger("anyString", "editor.action.formatDocument");
      });
    },
  },
};
</script>
