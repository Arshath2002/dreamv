import { computePosition, shift, offset, flip, arrow } from "@floating-ui/dom";
import DsfDataviewPopupWindow from "_dataview/share/components/common/DsfDataviewPopupWindow.vue";
// 打开大屏悬浮框 reference Dom  tooltipDom
const createPopupDialog = function (options) {
  let app = window.document.querySelector("#app");
  const { offsetFormat = 0, style, hasArrow = true, fullPath, path, placement, isLeaveHide, arrowStyle, ...opts } = options;
  let openerVm = opts.openerVm ? opts.openerVm : this._isVue ? this : null;
  let router = this.$router || app?.__vue__?.$root?.$options?.router || opts.router;
  let store = this.$store || app?.__vue__?.$root?.$options?.store || opts.store;
  let i18n = this.$i18n || app?.__vue__?.$root?.$options?.i18n || opts.i18n;

  let service = openerVm ? openerVm.$service : {};
  let _self = window;

  const popupCompConfig = {
    router,
    store: store,
    i18n: i18n,
    provide() {
      return {
        $serviceInfo: service,
      };
    },
    beforeCreate() {
      if (openerVm && openerVm._routerRoot) {
        this._routerRoot = openerVm._routerRoot;
      } else {
        this._routerRoot = this._routerRoot = (this.$parent && this.$parent._routerRoot) || this;
      }
    },
    destroyed() {
      for (let k in this._data) {
        this._data[k] = null;
      }
      options = null;
      openerVm = null;
      app = null;
      router = null;
      store = null;
      i18n = null;
      _self = null;
      service = null;
      this._routerRoot = null;
    },
    ...DsfDataviewPopupWindow,
  };

  const PopupComp = Vue.extend(popupCompConfig);

  const popupInstance = new PopupComp({
    propsData: {
      styleConfig: style,
      path,
      fullPath,
      openerVm,
      isLeaveHide,
      hasArrow,
      arrowStyle,
      offsetFormat,
      placement,
    },
  }).$mount();

  let top = dsf.getTopWindow();
  top.document.body.appendChild(popupInstance.$el);
  return { popupInstance };
};
const showPopupDialog = function (referenceDom, popupInstance) {
  const offsetFormat = popupInstance.offsetFormat;
  const tooltipDom = popupInstance.$el;
  const hasArrow = popupInstance.hasArrow;
  const placement = popupInstance.placement;

  const middleware = [shift(), flip(), offset(offsetFormat)];
  let arrowEl = null;
  if (hasArrow) {
    arrowEl = tooltipDom.querySelector(".arrow");
    middleware.push(arrow({ element: arrowEl }));
  }

  computePosition(referenceDom, tooltipDom, {
    placement,
    middleware,
  }).then(({ x, y, middlewareData }) => {
    Object.assign(tooltipDom.style, {
      left: `${x}px`,
      top: `${y}px`,
    });
    if (middlewareData.arrow) {
      const { x, y } = middlewareData.arrow;
      const { placement } = middlewareData.offset;

      const offset = {
        left: x != null ? `${x}px` : "",
        top: y != null ? `${y}px` : "",
      };
      Object.assign(arrowEl.style);
      arrowEl.classList.remove(["top", "bottom", "left", "right"]);
      switch (placement) {
        case "top":
          offset.top = "100%";
          arrowEl.classList.add("bottom");
          break;
        case "bottom":
          arrowEl.classList.add("top");
          break;
        case "left":
          offset.left = "100%";
          arrowEl.classList.add("right");
          break;
        case "right":
          arrowEl.classList.add("left");
          break;
      }

      Object.assign(arrowEl.style, offset);
    }
  });
};
//大屏弹框
let dialogOpening = false;

const openDialog = function (options, style = {}, destroyed) {
  let height = options.height;
  if (!height) return false;
  let defaultContent = "DsfDataviewViewPart";
  if (!dialogOpening) {
    options = options || {};
    dialogOpening = true;
    let openerVm = options.openerVm ? options.openerVm : this._isVue ? this : null;
    let comp = null;
    if (options) {
      if (!options.template) {
        if (options.params && options.params.path && !options.content) {
          options.content = defaultContent;
        }
        if (options.content == defaultContent) {
          options.params.showModel = "full";
          options.params.isOpenDialog = true;
          options.params.forceUpdate = false;
        }
      }
    }

    let app = window.document.querySelector("#app");
    let docWidth = window.innerWidth;
    let docHeight = window.innerHeight;

    let width = options.width + "";
    let height = options.height + "";
    let marginTop = options.marginTop;
    let marginLeft = options.marginLeft;

    if (dsf.isNumber(width)) {
      marginLeft = marginLeft ? marginLeft : docWidth - width < 0 ? 0 : (docWidth - width) / 2 + "px";
      width = (width > docWidth ? docWidth : width) + "px";
    } else if (width.endsWith("%")) {
      width = parseFloat(width);
      marginLeft = marginLeft ? marginLeft : width > 100 ? 0 : (100 - width) / 2 + "%";
      width = width > 100 ? "100%" : width + "%";
    } else if (width.endsWith("vw")) {
      width = parseFloat(width);
      marginLeft = marginLeft ? marginLeft : width > 100 ? 0 : (100 - width) / 2 + "vw";
      width = width > 100 ? "100vw" : width + "vw";
    }

    if (dsf.isNumber(height)) {
      marginTop = marginTop ? marginTop : docHeight - height < 0 ? 0 : (docHeight - height) / 2 + "px";
      height = (height > docHeight ? docHeight : height) + "px";
    } else if (height.endsWith("%")) {
      height = parseFloat(height);
      marginTop = marginTop ? marginTop : height > 100 ? 0 : (100 - height) / 2 + "%";
      height = height > 100 ? "100%" : height + "%";
    } else if (height.endsWith("vh")) {
      height = parseFloat(height);
      marginTop = marginTop ? marginTop : height > 100 ? 0 : (100 - height) / 2 + "vh";
      height = height > 100 ? "100vh" : height + "vh";
    }

    // 页面缩放的标题栏大小暂时放在这里处理 -----------
    let scale = 1;
    try {
      scale = window.top.outerWidth && window.top.innerWidth ? window.top.outerWidth / window.top.innerWidth : 1;
    } catch (error) {
      scale = 1
    }
    const titleHeight = (parseInt(style.titleHeight) || 40) / scale;
    const { iconSize = 13, textStyle, titlePadding = [], iconPosition } = style;
    style.iconSize = parseInt(iconSize) / scale;
    style.titleHeight = titleHeight;
    style.titlePadding = Array.isArray(titlePadding) ? titlePadding.map((it) => (dsf.isNumber(it) ? it / scale : it)) : titlePadding;
    style.iconPosition = Array.isArray(iconPosition) ? iconPosition.map((it) => (dsf.isNumber(it) ? it / scale : it)) : iconPosition;
    textStyle.fontSize = parseInt(textStyle.fontSize || 18) / scale;
    // -----------

    const dialogContentHeight = dsf.isNumber(height) ? `${height - titleHeight}px` : `calc(${height} - ${titleHeight}px)`;

    let router = this.$router || app?.__vue__?.$root?.$options?.router || options.router;
    let store = this.$store || app?.__vue__?.$root?.$options?.store || options.store;
    let i18n = this.$i18n || app?.__vue__?.$root?.$options?.i18n || options.i18n;
    let service = openerVm ? openerVm.$service : {};
    let appRoot = router ? router.apps[0] : app.__vue__.$root;
    let _self = window;
    let component = null;
    let elConfig = {
      router,
      store: store,
      i18n: i18n,
      components: undefined,
      provide() {
        return {
          $serviceInfo: service,
        };
      },
      beforeCreate() {
        if (openerVm && openerVm._routerRoot) {
          this._routerRoot = openerVm._routerRoot;
        } else {
          this._routerRoot = this._routerRoot = (this.$parent && this.$parent._routerRoot) || this;
        }
      },
      data: function () {
        return {
          styleConfig: style,
          index: dsf.uuid(),
          dialogVisible: false,
          clearDialog: false,
          clearContent: false,
          //标题
          title: dsf.isDef(options.title) ? options.title : "",
          //组件名称
          content: options.content,
          width: width || "50%",
          height: dialogContentHeight || "auto",
          destroyOnClose: true,
          params: options.params || {},
          overflow: options.overflow || "auto",
          btns: [],
          events: options.event,
          fullscreen: options.fullscreen,
          openerVm: openerVm,
          dialogArgs: options.dialogArgs || null,
          top: marginTop,
          left: marginLeft,
          yes: options.yes || dsf.noop,
          showClose: dsf.isDef(options.showClose) ? options.showClose : true,
          modal: dsf.isDef(options.modal) ? options.modal : false,
          modalColor: options.modalColor || "",
          center: dsf.isDef(options.center) ? options.center : false,
          closed: options.closed || dsf.noop,
          customClass: options.customClass || "",
          draggable: true,
          /**
           * 弹窗自动关闭配置，可选值 close自动关闭，disabled:禁止路由切换，ignore：忽略除调用关闭方法或者手动关闭以外任何变化
           */
          autoCloseConfig: dsf.mix(true, {}, options.autoCloseConfig || {}, {
            //路由变化时配置
            routerChange: "close",
          }),
        };
      },
      computed: {
        options() {
          return options;
        },
      },
      created() {},
      mounted() {
        if (options.content == defaultContent || this.template) {
          this.$nextTick(() => {
            options.dialogLoaded && options.dialogLoaded(options.content == defaultContent ? this.$refs.content : null);
          });
        }
      },
      destroyed() {
        for (let k in this._data) {
          this._data[k] = null;
        }
        dsf.array.remove(appRoot?.$dialogAll || [], this);
        options = null;
        openerVm = null;
        app = null;
        router = null;
        store = null;
        i18n = null;
        _self = null;
        service = null;
        this._routerRoot = null;
        destroyed && destroyed();
      },
      methods: {
        async dialogSure(result) {
          await options.yes?.(this.$refs.content);
          this.close();
        },
        onDialogMounted() {
          this.dialogVisible = true;
        },
        onOpened() {
          let fn = options.onOpened;
          dsf.isFunction(fn) && fn();
          dsf.resizeComponent(this.$refs.instance);
        },
        close() {
          this.$refs?.instance?.close?.();
        },
        onClosed() {
          if (this.closed) {
            this.closed(this.$refs.content);
            options.onClosed?.();
          }
        },
        cancel() {
          let _this = this;
          if (component) {
            component = null;
          }
          this.$nextTick().then(() => {
            this.clearContent = true;
            let closeId = window.setTimeout(() => {
              closeId && window.clearTimeout(closeId);
              _this.$destroy();
              this.$nextTick().then(() => {
                if (_this._vnode) {
                  _this._vnode = null;
                }
                if (_this?.$el) {
                  _this.$el.__vue__ = null;
                }
                _this.$el = null;
                _this = null;
                //
                //处理一些el-dialog奇奇怪怪的内存泄漏问题
                try {
                  //chrome的bug，当一个被聚焦过的文本框被移除，会导致该文本框相关内存无法销毁，
                  //因为文本框节点又有parentNode引用父节点，从而导致一连串dom对象无法被释放
                  dsf.momoryRelease();
                } catch (ex) {
                  //todo
                }
              });
            }, 1000);
          });
        },
        contentReady() {},
      },
      template: `
      <DsfDataViewDialog
        v-if="!clearDialog"
        :key="index"
        ref="instance"
        class="ds-dialog-show-animation"
        :no-title="true"
        :styleConfig="styleConfig"
        :title="title" 
        :top="top"
        :left="left" 
        :index="index" 
        :options="options"
        :visible.sync="dialogVisible"
        :fullscreen="fullscreen" 
        :width="width"
        :height="height"
        :close-on-click-modal="false" 
        :append-to-body="true"
        :show-close="showClose" 
        :close-on-press-escape="false" 
        :dialog-args="dialogArgs"
        :modal="modal"
        :modalColor="modalColor"
        :center="center" 
        :opener-vm="openerVm" 
        :allow-draggable="draggable"
        @opened="onOpened"
        @close="onClosed"
        @closed="cancel"
        @hook:mounted="onDialogMounted">
        <div class="ds-dialog-content" ref="contentWrapper" :style="{'position':'relative','height':'100%'}">
          <template>
          ${
            options.template
              ? options.template
              : `<component 
              v-if="!clearContent"
              :key="'dialog-content-'+index"
              :is="content" 
              v-bind.sync="params" 
              ref="content" 
              v-on="events" 
              ${options.content == "DsfViewPart" ? '@ready="contentReady"' : ""}
              @dialog-yes="dialogSure">
            </component>`
          }
          </template>
        </div>
      </DsfDataViewDialog>`,
    };
    if (comp) {
      elConfig.components = {
        [options.content]: comp,
      };
    }
    if (options.btns) {
      _.each(options.btns, (btn) => {
        if (btn.handler) {
          btn.handler = btn.handler.bind(_self);
        }
      });
    }
    let top = dsf.getTopWindow();
    const Dialog = Vue.extend(elConfig);
    component = new Dialog({ el: document.createElement("div") });
    if (dsf.isUnDef(options.isTopOpen)) {
      options.isTopOpen === dsf.config.component.topOpenDialog || false;
    }
    if (options.isTopOpen === true) {
      if (top != _self) {
        let el = component.$el;
        let modal = el.previousElementSibling;
        top.document.body.appendChild(modal);
        top.document.body.appendChild(el);
        // component.dialogVisible=true;
      }
    }
    if (appRoot) {
      if (dsf.isUnDef(appRoot.$dialogAll)) {
        appRoot.$dialogAll = [];
      }
      appRoot.$dialogAll.push(component);
    }
    dialogOpening = false;
    return component;
  }
};

const layer = {
  openDialog,
  createPopupDialog,
  showPopupDialog,
};
export default layer;
