<!--
 * @Description: 大屏富文本编辑器 jodit 版本
 * @Author: zhanghang
 * @Date: 2023-12-29 14:10:49
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-05-30 09:44:14
-->
<template>
  <div class="des-dv-editor-plus">
    <!-- 先注释,后面如果放出来再说 -->
    <!-- <div class="editor-bg-set">
      编辑器主题：&nbsp;
      <el-switch
        active-value="default"
        inactive-value="dark"
        v-model="editorTheme"
        active-text="浅色"
        inactive-text="深色"
      ></el-switch>
    </div> -->
    <div ref="editor" class="editor"></div>
  </div>
</template>
<script>
// 官网地址 https://xdsoft.net/
export default {
  name: "DesDVEditorPlus",
  props: {
    useStyle: {
      type: Object,
      default: () => ({}),
    },
    owner: {
      type: Object,
      default() {
        return {};
      },
    },
    value: {
      type: String,
      default: "",
    },
    config: {
      type: Object,
      default() {
        return {};
      },
    },
    theme: {
      type: String,
      default: "default",
    },
  },
  computed: {
    editorTheme: {
      get() {
        return this.theme;
      },
      set(v) {
        this.$emit("update:theme", v);
        this.owner.editorTheme = v;
      },
    },
    filesArgs() {
      return dsf.dataview.utils.getDataViewUploadFilesArgs.call(this, this.staticFile);
    },
    uploadAction() {
      return this.filesArgs.url;
    },
    headers() {
      return this.filesArgs.headers;
    },
    extendData() {
      return this.filesArgs.extraData;
    },
  },
  data() {
    const uploader = {
      url: this.uploadAction,
      insertImageAsBase64URI: false,
      imagesExtensions: ["jpg", "png", "jpeg", "gif"],
      isSuccess: function (e) {
        //上传成功插入图片
        const image = this.jodit.selection.j.createInside.element("img");
        image.setAttribute("src", dsf.url.getFilePath(e.data));
        this.jodit.selection.insertNode(image, {
          width: image.width,
          height: image.height,
        });
        return true;
      },
      error: function (e) {
        this.jodit.events.fire("errorMessage", e.message, "error", 4e3);
      },
    };
    return {
      staticFile: false,
      defaultConfig: {
        uploader,
        zIndex: 10,
        language: "zh_cn",
        theme: this.theme,
        controls: {
          font: {
            list: {
              "": "Default",
              "宋体,SimSun": "宋体",
              "'Microsoft YaHei'": "微软雅黑",
              "黑体,SimHei": "黑体",
              "隶书,SimLi": "隶书",
              "仿宋,FangSong_GB2312,FangSong": "仿宋",
              "Tahoma,Geneva,sans-serif": "Tahoma",
              "Verdana,Geneva,sans-serif": "Verdana",
            },
          },
        },
        i18n: {
          //将语言版本设置为中文后仍然还有部分显示的英文改为中文，左面的key为页面上显示的英文，value则是需要对应显示的中文，目前支持19种语言
          zh_cn: {
            //简体中文
            top: "上",
            right: "右",
            bottom: "下",
            left: "左",
            Title: "标题",
            Link: "链接",
            "Line height": "行高",
          },
        },
        width: "100%",
        height: 500,
        buttonsMD: [],
        buttonsSM: [],
        buttonsXS: [],
        buttons: [],
        extraButtons: [
          "source",
          "bold",
          "italic",
          "underline",
          "strikethrough",
          "eraser",
          "ul",
          "ol",
          "font",
          "fontsize",
          "paragraph",
          "superscript",
          "subscript",
          "image",
          "lineHeight",
          "cut",
          "copy",
          "paste",
          "hr",
          "table",
          "link",
          "indent",
          "outdent",
          "left",
          "center",
          "right",
          "brush",
          "undo",
          "redo",
          "fullsize",
        ],
      },
    };
  },
  mounted() {
    this.loadScript().then(() => {
      this.initEditor();
      $(this.$el).find(".jodit-container").find(".jodit-wysiwyg").css(this.useStyle);
    });
  },
  beforeDestroy() {
    this.editor?.destruct();
  },
  watch: {
    theme(n, o) {
      if (this.$el) {
        $(this.$el).find(".jodit-container").removeClass(`jodit_theme_${o}`);
        $(this.$el).find(".jodit-container").addClass(`jodit_theme_${n}`);
        if (this.editor) {
          this.editor.o.theme = n;
        }
      }
    },
  },
  methods: {
    loadScript() {
      if (window.Jodit) {
        return Promise.resolve();
      } else {
        return new Promise((resolve) => {
          this.$http
            .importFiles([this.$getWebPath("static/js/libs/jodit/jodit.min.css", __DSF_DATAVIEW_PATH__), this.$getWebPath("static/js/libs/jodit/jodit.min.js", __DSF_DATAVIEW_PATH__)])
            .then(() => {
              resolve();
            });
        });
      }
    },
    //初始化
    initEditor() {
      //如果存在，先摧毁
      if (this.editor) {
        this.editor.destruct();
      }
      const config = dsf.mix(true, {}, this.defaultConfig, this.config);
      this.editor = new Jodit(this.$refs.editor, config);
      this.editor.value = this.value;
    },
    yes() {
      return this.editor.value;
    },
  },
};
</script>
<style lang="scss">
@import "_dataview/assets/styles/designer/DesDvEditorPlus.scss";
.jodit-popup {
  z-index: 10000001 !important;
}
</style>
