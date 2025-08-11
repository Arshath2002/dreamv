<template>
  <div>
    <DsfButton
      type="primary"
      :dialogType="data.dialogType"
      :disabled="disabled"
      @click="clickHandler"
      class="data-view-dialog-common-btn"
      style="width: auto; height: auto"
      v-if="data.config.showBtnType === 'common'"
      size="small"
    >
      {{ data.text }}
    </DsfButton>
    <div @click="clickHandler" class="data-view-dialog-btn" v-else>
      <div class="text">
        <el-badge :is-dot="!!hasValue" type="primary" class="common-property-badge button-badge">
          {{ data.config.buttonText || "设置" }}
        </el-badge>
      </div>
      <i class="dialog-icon el-icon-s-tools" :style="{ color: hasValue ? 'var(--t--normal)' : 'inherit' }"></i>
    </div>
    <el-drawer
      class="des-dv-drawer__wrapper"
      custom-class="des-dv-drawer"
      v-if="isDrawer"
      :title="config.title"
      :size="640"
      :show-close="false"
      :modal="false"
      :append-to-body="true"
      :visible="drawerVisible"
      :direction="'rtl'"
      :withHeader="!!config.title"
      :destroy-on-close="true"
    >
      <div class="des-dv-drawer__content">
        <component ref="content" :is="config.content" v-bind="config.params || {}" :designer="designer" :current-data="currentData" :owner="owner" :config="config"></component>
      </div>
      <div class="des-dv-drawer__footer">
        <DsfButton text="确定" @click="sure" />
        <DsfButton v-if="config.isClear" type="plain" :text="config.isClear === true ? '清空' : config.isClear" @click="clear" />
        <DsfButton v-if="config.hasCancel" text="取消" type="plain" @click="close" />
      </div>
    </el-drawer>
  </div>
</template>
<script>
export default {
  name: "DesDVDialog",
  inject: {
    $designer: {
      default: null,
    },
    $properties: {
      default: null,
    },
    $designerRight: {
      default: null,
    },
  },
  // eslint-disable-next-line vue/require-prop-types
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
      default() {
        return null;
      },
    },
    value: {
      type: [Object, Array, Number, String, Date],
      default() {
        return null;
      },
    },
    owner: {
      type: Object,
      default() {
        return null;
      },
    },
    isMobile: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      dialogVisible: false,
      width: "50%",
      hasValue: false,
      drawerVisible: false,
    };
  },
  beforeDestroy() {
    this.isDrawer && (this.$designer.shrink = false);
  },
  computed: {
    // 是否以抽屉形式打开
    isDrawer() {
      // 要求运行在大屏中且type==="drawer"
      return this.$designer.layoutType === "dataview" && this.config.type == "drawer";
    },
    designer() {
      return this.$designer;
    },
    config() {
      return this.data.config || {};
    },
    currentData() {
      let currentData = {};
      if (dsf.type(this.value) == "array") {
        currentData = dsf.mix(true, [], this.value);
      } else if (dsf.type(this.value) == "object") {
        currentData = dsf.mix(true, {}, this.value);
      } else {
        currentData = this.value;
      }
      return currentData;
    },
  },
  watch: {
    dialogVisible(to) {
      this.$emit("visible-change", to);
    },
    drawerVisible(to) {
      this.isDrawer && (this.$designer.shrink = to);
    },
  },
  created() {
    // 初始化有值状态标志
    this.hasValue = this.judgeHasValue(this.value);

    const config = this.config;
    config.hasCancel = config.hasCancel === undefined ? true : config.hasCancel;
    config.clearClose = config.clearClose === undefined ? true : config.clearClose;
  },
  methods: {
    async sure() {
      let value = null;
      if (this.$refs.content) {
        if (this.$refs.content.validate() !== false) {
          if (this.$refs.content.yes) {
            value = await this.$refs.content.yes();
            // 更新有值状态标志
            this.hasValue = this.judgeHasValue(value);
          }
          this.drawerVisible = false;
          this.$nextTick(() => {
            this.$emit("change", value);
          });
        }
      }
    },
    async clear() {
      let value = null;
      const config = this.config;
      if (this.$refs.content) {
        if (this.$refs.content.clear) {
          value = await this.$refs.content.clear();
        }
        // 清空可以不关闭弹框
        config.clearClose && (this.drawerVisible = false);

        this.$nextTick(() => {
          this.$emit("change", value);
        });
      }
    },
    close() {
      this.drawerVisible = false;
    },

    judgeHasValue(value) {
      let { valueExpress } = this.config;
      if (valueExpress && dsf.isObject(value)) {
        return this.$eval(valueExpress, value);
      }
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return !!value;
    },
    clickHandler(e) {
      if (this.isDrawer) {
        this.drawerVisible = true;
        return false;
      }
      const designer = this.$designer;
      this.dialogVisible = true;
      let _this = this;
      let owner = this.owner;
      const config = this.config;

      let isMobile = designer.mobile;
      let title = config.title;
      let content = config.content;
      let width = config.width;
      let height = config.height;
      let top = config.top;
      let overflow = config.overflow;
      let skin = config.class;

      let currentData = {};
      if (dsf.type(this.value) == "array") {
        currentData = dsf.mix(true, [], this.value);
      } else if (dsf.type(this.value) == "object") {
        currentData = dsf.mix(true, {}, this.value);
      } else {
        currentData = this.value;
      }

      let app = window.document.querySelector("#app");
      let router = this.$router || app?.__vue__?.$options.router || options.router;
      let store = this.$store || app?.__vue__?.$options.store || options.store;
      let i18n = this.$i18n || app?.__vue__?.$options.i18n || options.i18n;
      var Dialog = Vue.extend({
        router,
        store: store,
        i18n: i18n,
        // var Dialog = dsf.global.Vue.extend({
        data: function () {
          return {
            dialogVisible: true,
            //标题
            title: title || "设置",
            //组件名称
            content: content,
            config: config,
            //将当前值得副本传递给弹出框内部的组件
            currentData,
            width: width || "50%",
            height: height || "auto",
            top: top || "10vh",
            destroyOnClose: true,
            owner: owner,
            isMobile: isMobile,
            overflow: overflow || "auto",
            params: config.params || {},
            skin: skin || "",
            designer: designer,
          };
        },
        watch: {
          dialogVisible(to) {
            _this.dialogVisible = to;
          },
        },
        created() {},
        methods: {
          async sure() {
            let value = null;
            if (this.$refs.content) {
              if (this.$refs.content.validate() !== false) {
                if (this.$refs.content.yes) {
                  value = await this.$refs.content.yes();
                  // 更新有值状态标志
                  _this.hasValue = _this.judgeHasValue(value);
                }
                this.dialogVisible = false;
                this.$nextTick(() => {
                  _this.$emit("change", value);
                });
              }
            }
          },
          async clear() {
            let value = null;
            if (this.$refs.content) {
              if (this.$refs.content.clear) {
                value = await this.$refs.content.clear();
              }
              // 清空可以不关闭弹框
              this.config.clearClose && (this.dialogVisible = false);

              this.$nextTick(() => {
                _this.$emit("change", value);
              });
            }
          },
          close() {
            this.dialogVisible = false;
          },
          cancel() {
            if (component) {
              component = null;
            }
            window.setTimeout(() => {
              this.$destroy();
            }, 0);
          },
        },
        template: `<DsfDialog :class='skin' :title="title" :visible.sync="dialogVisible" :width="width" :top="top" :close-on-click-modal="false" :append-to-body="true"  @close="close" @closed="cancel" >
                    <div :style="{'height':height,'overflow':(overflow||'auto')}">
                     <component :is="content"  v-bind="params" :designer="designer" :is-mobile="designer.mobile" :current-data="currentData" :owner="owner" :config="config" ref="content"></component>
                    </div>
                    <template v-slot:footer>
                      <DsfButton text="确定" @click="sure" />
                      <DsfButton v-if="config.isClear" type="plain" :text="config.isClear === true ? '清空' : config.isClear" @click="clear" />
                      <DsfButton v-if="config.hasCancel" text="取消" type="plain" @click="close"/>
                    </template>
                  </DsfDialog>`,
      });
      let component = new Dialog().$mount();
    },
  },
};
</script>
