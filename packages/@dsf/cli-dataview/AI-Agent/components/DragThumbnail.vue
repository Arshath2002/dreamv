<!--
 * @Editor: zhanghang
 * @Description: 可拖拽缩略图
 * @Date: 2025-04-01 17:36:21
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-05-22 16:05:26
-->
<template>
  <div class="item ds-desinger-drag-component" :style="{ 'background-image': 'url(' + item.image + ')' }">
    <div v-if="item.dom" v-html="item.dom.outerHTML" :style="item.style"></div>
  </div>
</template>
<script>
export default {
  name: "DragThumbnail",
  inject: ["$designer"],
  props: {
    item: {
      type: Object,
      require: true,
    },
  },
  mounted() {
    this.initDrag();
  },
  methods: {
    initDrag() {
      if (!this.$designer) return;
      const chatBox = document.querySelector(".dsf-dv-ai-chat");
      const attrs = this.item.modelArgs;
      $(this.$el).draggable({
        addClasses: false,
        appendTo: this.$designer.$el,
        distance: 10,
        revert: "invalid",
        cursor: "move",
        containment: "window",
        cursorAt: {
          left: -20,
          top: -20,
        },
        helper: (evt) => {
          const code = getCtrlCodeByName(attrs.component);
          const source = $(evt.currentTarget);
          const attributes = {
            type: "control",
            isModelDrag: true,
            data: {
              code: code,
              props: {
                modelArgs: dsf.mix(true, {}, attrs),
              },
            },
          };
          let proxy = source.clone();
          proxy.addClass("proxy");
          proxy.data("data", {
            state: "add",
            attributes: attributes,
          });
          return proxy;
        },
        start: (evt) => {
          chatBox.classList.add("is-dragging");
          this.$designer.dragProxy.style = {};
          $(this.$designer.$el).addClass("designer-dragging");
          try {
            dsf.designer.broadcast(this.$designer, "clearMouseDownHandler", evt, null);
          } catch (ex) {
            //todo
          }
        },
        stop: () => {
          try {
            chatBox.classList.remove("is-dragging");
            this.$designer.dragProxy.show = false;
            this.$designer.dragProxy.class = "";
            this.$designer.dragProxy.style = {};
            this.$nextTick(() => {
              $(this.$designer.dragProxy_el).appendTo(this.$designer.$el);
            });
          } catch (ex) {
            //todo
          } finally {
            $(this.$designer.$el).removeClass("designer-dragging");
          }
        },
      });
    },
  },
};
const componentNameRE = /^(Dsf)(Mobile)?(\w+)/g;
function getCtrlCodeByName(name) {
  componentNameRE.lastIndex = 0;
  let code = componentNameRE.exec(name);
  let arr = [];
  if (code && code.length > 0) {
    for (let i = 1; i < code.length; i++) {
      if (code[i]) {
        arr.push(code[i].toLowerCase());
      }
    }
  }
  return arr.join(".");
}
</script>
