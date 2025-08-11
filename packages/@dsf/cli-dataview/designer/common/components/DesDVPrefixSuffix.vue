<!--
 * @Description: 前后缀(文字、图片、icon)
 * @Author: shenah
 * @Date: 2024-04-19 15:24:51
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-02-14 16:35:24
-->

<template>
  <div class="ds-prefix-suffix">
    <div class="ds-designer-property property-item">
      <div class="property-item-name" :style="propertyItemNameTitle">
        {{ currentConfig.title }}
      </div>
      <DesDVSwitch v-model="currentData.defaultConfig.flag"></DesDVSwitch>
    </div>
    <template v-if="currentData.defaultConfig.flag">
      <div class="ds-designer-property property-item" style="margin-left: 30px">
        <div class="property-item-name">形式：</div>
        <DesDVRadioGroup :data="{ dictionary: prefixSuffixTypeOptions }" v-model="currentData.defaultConfig.type"></DesDVRadioGroup>
      </div>
      <!-- 默认内容 -->
      <template v-if="currentData.defaultConfig.type === 'text'">
        <div class="ds-designer-property property-item" style="margin-left: 30px">
          <div class="property-item-name">内容：</div>
          <el-input v-model="currentData.defaultConfig.text.content" class="data-view-text" placeholder="请输入" />
        </div>
        <div class="ds-designer-property property-item" style="margin-left: 30px">
          <div class="property-item-name">样式：</div>
          <DesDVTextStyle
            v-model="currentData.defaultConfig.text"
            :config="{
              picker: {
                type: 'color',
              },
            }"
          ></DesDVTextStyle>
        </div>
      </template>
      <!-- 默认图标 -->
      <template v-else-if="currentData.defaultConfig.type === 'icon'">
        <div class="ds-designer-property property-item" style="margin-left: 30px">
          <div class="property-item-name">图标：</div>
          <DesDVMoreIcon v-model="currentData.defaultConfig.icon.icon"></DesDVMoreIcon>
        </div>
        <div class="ds-designer-property property-item" style="margin-left: 30px">
          <div class="property-item-name">图标字号：</div>
          <DesDVPixel
            v-model="currentData.defaultConfig.icon.fontSize"
            :options="[
              {
                value: 'px',
                label: 'px',
              },
            ]"
          ></DesDVPixel>
        </div>
        <div class="ds-designer-property property-item" style="margin-left: 30px">
          <div class="property-item-name">图标颜色：</div>
          <DesDVColorPicker
            v-model="currentData.defaultConfig.icon.color"
            :config="{
              type: 'color',
            }"
          ></DesDVColorPicker>
        </div>
      </template>
      <!-- 默认图片 -->
      <template v-else-if="currentData.defaultConfig.type === 'image'">
        <div class="ds-designer-property property-item" style="margin-left: 30px">
          <div class="property-item-name">图片：</div>
          <DesDVMoreImg
            v-model="currentData.defaultConfig.image.image"
            :config="{
              backgroundTypes: [],
            }"
          ></DesDVMoreImg>
        </div>
        <div class="ds-designer-property property-item float-one-row" style="margin-left: 30px">
          <div class="property-item-name">宽：</div>
          <DesDVPixel v-model="currentData.defaultConfig.image.width"></DesDVPixel>
        </div>
        <div class="ds-designer-property property-item float-one-row">
          <div class="property-item-name">高：</div>
          <DesDVPixel v-model="currentData.defaultConfig.image.height"></DesDVPixel>
        </div>
      </template>
      <div class="ds-designer-property property-item" style="margin-left: 30px">
        <div class="property-item-name">间距：</div>
        <DesDVNumber :config="{ min: 0, unit: 'px' }" v-model="currentData.defaultConfig.space" />
      </div>
      <dsfButtonDialog
        class="property-item"
        @click="setPrefixSuffixRule()"
        style="margin-left: 30px"
        :hasValue="ruleHasValue"
        :config="{
          buttonText: '规则样式',
        }"
      >
      </dsfButtonDialog>
    </template>
  </div>
</template>
<script>
import dsfButtonDialog from "_dataview/designer/common/components/dsfButton.vue";
import propertyMixin from "./propertyMixin.js";
import { prefixSuffixTypeOptions, createPrefixSuffixConFig } from "_dataview/output/config/prefixSuffixConFig";
export default {
  name: "DesDVPrefixSuffix",
  components: {
    dsfButtonDialog,
  },
  mixins: [propertyMixin],
  props: {
    value: {
      type: Object,
    },
    config: {
      type: Object,
    },
    owner: {
      type: Object,
    },
  },
  data() {
    return {
      prefixSuffixTypeOptions,
      defaultConfig: {
        title: "",
      },
      currentData: {},
    };
  },
  computed: {
    propertyItemNameTitle() {
      let style = {
        ...this.currentConfig.textCss,
      };
      return style;
    },
    ruleHasValue() {
      return this.currentData.ruleList.length > 0;
    },
  },
  watch: {
    currentData: {
      handler() {
        this.changeValue();
      },
      deep: true,
    },
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
      let defaultConfig = createPrefixSuffixConFig();
      this.currentData = dsf.mix({}, defaultConfig, this.value);
    },
    setPrefixSuffixRule() {
      let self = this;
      this.$openDialog({
        title: this.currentConfig.title,
        content: "DesDVUniversalRuleConfig",
        params: {
          currentData: this.currentData.ruleList,
          owner: this.owner,
          config: {
            typeOptions: [
              {
                label: "文字",
                value: "text",
                config: {
                  hiddenPosition: true,
                  hiddenContent: false,
                },
              },
              {
                label: "图标",
                value: "icon",
                config: {
                  hiddenPosition: true,
                },
              },
              {
                label: "图片",
                value: "image",
                config: {
                  hiddenPosition: true,
                },
              },
            ],
          },
        },
        width: "1200px",
        height: "60vh",
        btns: [
          {
            text: "确定",
            handler(res) {
              if (res && res.yes) {
                let i = res.yes();
                self.$set(self.currentData, "ruleList", i);
              }
            },
          },
          {
            text: "取消",
          },
        ],
      });
    },
    changeValue() {
      this.$emit("change", this.currentData);
      this.$emit("input", this.currentData);
    },
  },
};
</script>
<style lang="scss">
@import "_dataview/assets/styles/designer/common/commonProperty/border.scss";
</style>
