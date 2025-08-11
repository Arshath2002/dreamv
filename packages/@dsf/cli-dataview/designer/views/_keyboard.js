import createBackground from "_dataview/output/config/backgroundExtend.js";

/**
 * @name： 将文本复制到剪贴版
 * @param {String} copyContext
 */
const textToClipboard = function (copyContext, message = "复制成功") {
  if (navigator?.clipboard?.writeText) {
    navigator?.clipboard?.writeText(copyContext).then(() => {
      dsf.layer.message(message);
    });
  }
  //否则使用兼容方式操作，该操作的缺点就是不能复制大量内容否则浏览器会崩溃
  else {
    let textarea = document.createElement("input");
    document.body.append(textarea);
    textarea.value = copyContext;
    textarea.focus();
    textarea.selectionStart = 0;
    textarea.selectionEnd = textarea.value.length;
    document.execCommand("copy", false, null);
    dsf.layer.message(message);
    window.setTimeout(() => {
      textarea.remove();
    }, 200);
  }
};

const STYLE = "DATAVIEW:STYLE-";

export default {
  beforeDestroy() {
    document.removeEventListener("keydown", this.watchKeyDown, true);
    // document.removeEventListener("keyup", this.dataviewWatchKeyUp);
  },
  created() {
    document.addEventListener("keydown", this.watchKeyDown, true);
    // document.addEventListener("keyup", this.dataviewWatchKeyUp);
  },
  methods: {
    hasDialog() {
      const dialogs = $("div[role='dialog']");
      let hasDialog = false;
      for (let i = 0; i < dialogs.length; i++) {
        if ($(dialogs[i]).is(":visible")) {
          hasDialog = true;
        }
      }

      return hasDialog;
    },
    watchKeyDown(evt) {
      let activeElement = document.activeElement;
      //如果聚焦再可编辑元素则按正常操作
      if (dsf.isElementEditable(activeElement) || this.openDrag) {
        return;
      }

      const components = [];
      const selectComponents = this.getSelectionComponents();
      this.selectComponentsSort.forEach((it) => {
        const comp = selectComponents.find((comp) => comp._uid == it);
        if (comp) {
          components.push(comp);
        }
      });
      if (!components.length) return false;
      // 需要操作的组件样式
      const component = components[0];

      if (evt.ctrlKey || evt.metaKey) {
        //ctrl+s 保存页面
        if (evt.keyCode == 83) {
          evt.preventDefault();
          if (this.tpl) {
            this.saveLayoutToTemplate();
          } else {
            this.dataViewSaveLayout();
          }
          //  CTRL+B 事件
        } else if (evt.keyCode === 66) {
          evt.preventDefault(); //阻止浏览器默认事件
          if (dsf.isFunction(component.copyComponentStyle)) {
            const data = component.copyComponentStyle();
            if (data) {
              const text = STYLE + JSON.stringify(data);
              textToClipboard(text, "复制组件样式成功！");
            }
          }
          // CTRL + Q 关联组件
        } else if (evt.keyCode === 81) {
          evt.preventDefault();
          const hasDialog = this.hasDialog();
          if (hasDialog) return false;

          const hasRelationComps = components.filter((it) => it.hasEventRelative);
          if (hasRelationComps.length < 2) return false;

          const owner = hasRelationComps[0];
          const relativeList = hasRelationComps;
          this.$openDialog({
            title: "组件依赖设置",
            content: "DesDVEventEditor",
            width: "1200px",
            height: "60vh",
            params: {
              designer: this,
              owner,
              relativeList: relativeList,
              currentData: owner.eventRelativeDeal,
            },
            btns: [
              {
                text: "确定",
                handler(res) {
                  owner.eventRelativeDeal = res.yes();
                },
              },
              {
                text: "取消",
                handler() {},
              },
            ],
          });
        }
        // D A 快捷键
      } else {
        const hasDialog = this.hasDialog();
        if (hasDialog) return false;
        if (component) {
          // 按键D，打开映射字段
          if (evt.keyCode == 68 && component.dataType) {
            $("a[dialogtype=relation]").length && $("a[dialogtype=relation]")[0].click();
            // 按键A 打开依赖列表
          } else if (evt.keyCode == 65 && component.eventRelativeDeal) {
            this.$openDialog({
              title: "组件依赖设置",
              content: "DesDVEventEditor",
              width: "1200px",
              height: "60vh",
              params: {
                designer: this,
                owner: component,
                currentData: component.eventRelativeDeal,
              },
              btns: [
                {
                  text: "确定",
                  handler(res) {
                    component.eventRelativeDeal = res.yes();
                  },
                },
                {
                  text: "取消",
                  handler() {},
                },
              ],
            });
          }
        }
      }
    },
    // 拦截产品自定义粘贴
    async $interceptProductPaste(res) {
      const components = [];
      const selectComponents = this.getSelectionComponents();
      this.selectComponentsSort.forEach((it) => {
        const comp = selectComponents.find((comp) => comp._uid == it);
        if (comp) {
          components.push(comp);
        }
      });
      if (!components.length) return false;
      if (res && res.indexOf(STYLE) >= 0) {
        const len = STYLE.length;
        const dataText = res.substr(len);
        const data = JSON.parse(dataText);
        components.forEach((component) => {
          if (dsf.isFunction(component.pasteComponentStyle)) {
            component.pasteComponentStyle(data);
          }
        });
        setTimeout(this.recordPageChange.bind(this), 100);
      }
    },
    // 拦截 图片粘贴
    async $interceptImagePaste(html) {
      let img = $(html);
      let src = img.attr("src");
      let url = "";

      // 如果是base64图片
      if (src && src.indexOf("data:image") == 0) {
        const blob = dsf.dataview.utils.base64ToBlob(src);
        const { url: path, getFilePath } = dsf.dataview.utils.getDataViewUploadFilesArgs.call(this, false);

        url = await this.$http
          .upload(path, {
            files: blob,
          })
          .done(({ success, data }) => {
            if (success && data.length > 0) {
              return getFilePath(data);
            }
          });

        // 如果是普通图片
      } else {
        url = src;
      }
      if (!url) {
        return dsf.layer.message("粘贴失败", false);
      }
      let selectControls = this.$el.querySelectorAll(".ds-control-selected");
      if (selectControls.length == 1) {
        let com = selectControls[0].__vue__;
        // 如果选中的是图片容器
        if (com.ctrlName === "DsfDataViewImage") {
          const backgroundConfig = com.backgroundConfig;
          backgroundConfig.active = "custom";
          if (!backgroundConfig.custom) {
            const backgroundExtend = createBackground();
            const custom = backgroundExtend.custom;
            custom.image = url;
            backgroundConfig.custom = custom;
          } else {
            backgroundConfig.custom.image = url;
            com.backgroundConfig = { ...backgroundConfig };
          }
          dsf.layer.message("粘贴完成");
          // 构造图片容器
        } else {
          const imageContainer = await this.loadImageContainer(url);
          await this.$copyComponetToTarget([imageContainer]);
          dsf.layer.message("粘贴完成");
        }
      }
    },
    loadImageContainer(url) {
      const code = "dsf.dataviewimage";
      const backgroundExtend = createBackground();
      const custom = backgroundExtend.custom;
      custom.image = url;
      const props = {
        backgroundConfig: {
          active: "custom",
          custom,
        },
      };
      return new Promise((resolve, reject) => {
        let com = dsf.checkAsyncComponent(code);
        if (com) {
          dsf.requestAsyncComponents(com).then((c) => {
            let dataviewImage = this.createComponent(code, props);
            resolve(dataviewImage);
          });
        } else {
          let dataviewImage = this.createComponent(code, props);
          resolve(dataviewImage);
        }
      });
    },
  },
};
