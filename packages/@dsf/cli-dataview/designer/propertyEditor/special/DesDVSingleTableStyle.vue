<!--
 * @Description: 特殊属性:表格单列
 * @Author: shenah
 * @Date: 2024-03-21 18:02:47
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-06-05 10:43:04
-->

<template>
  <div class="dsf-single-table-style">
    <!-- 树形 -->
    <el-tree
      class="single-table-tree"
      ref="tree"
      :data="treeData"
      :highlight-current="true"
      :expand-on-click-node="false"
      :render-after-expand="true"
      :default-expand-all="true"
      node-key="id"
      :current-node-key="currentNodeKey"
      :props="defaultProps"
      @node-click="nodeClick"
    >
      <span slot-scope="{ node, data }" class="custom-tree-node">
        <span :class="`tree-label${data.id}`">
          {{ node.label }}
        </span>
        <span class="field-name" v-if="data.map">[{{ data.map }}]</span>
      </span>
    </el-tree>
    <!-- 属性 -->
    <div v-if="form" :key="form.id">
      <div class="ds-designer-property property-item float-one-row">
        <div class="property-item-name">列宽：</div>
        <DesDVRadioGroup :data="{ dictionary: colOptions }" v-model="widthType" @change="widthTypeChange"></DesDVRadioGroup>
      </div>
      <div class="ds-designer-property property-item float-one-row ml10" v-if="widthType === 'fixed'">
        <DesDVPixel v-model="form.width"></DesDVPixel>
      </div>
      <template v-if="newHeaderConfig.isShowHeader">
        <div class="ds-designer-property property-item">
          <div class="property-item-name">表头：</div>
          <DesDVTextStyle
            v-model="form"
            :config="{
              fontFamilyField: 'headerFontFamily',
              fontSizeField: 'headerFontSize',
              colorStringField: 'headerColor',
              fontWeightField: 'headerFontWeight',
              fontStyleField: 'headerFontStyle',
              textShadowField: 'headerTextShadow',
              textDecorationField: 'headerTextDecoration',
            }"
          ></DesDVTextStyle>
        </div>
        <div class="ds-designer-property property-item">
          <div class="property-item-name" style="opacity: 0">表头：</div>
          <DesDVTextAlign
            :value="{
              hAlign: form.headerAlign,
            }"
            :config="{
              isShowVAlign: false,
              iconType: 'textContent',
            }"
            @change="alignChange(...arguments, 'headerAlign')"
          ></DesDVTextAlign>
        </div>
        <!-- 排序 -->
        <template v-if="isShowSort">
          <div class="ds-designer-property property-item">
            <div class="property-item-name">排序</div>
            <DesDVSwitch v-model="form.isSort"></DesDVSwitch>
          </div>
          <template v-if="form.isSort">
            <!-- 排序图标 -->
            <div class="ds-designer-property property-item">
              <div class="property-item-name" style="margin-left: 60px">排序图标：</div>
              <DesDVRadioGroup :data="{ dictionary: sortOptions }" v-model="form.filterIcon"></DesDVRadioGroup>
            </div>
            <!-- 默认颜色 -->
            <div class="ds-designer-property property-item">
              <div class="property-item-name" style="margin-left: 60px">默认颜色：</div>
              <DesDVColorPicker
                v-model="form.sortDefaultColor"
                :config="{
                  type: 'color',
                }"
              ></DesDVColorPicker>
            </div>

            <!-- 排序颜色 -->
            <div class="ds-designer-property property-item">
              <div class="property-item-name" style="margin-left: 60px">排序颜色：</div>
              <DesDVColorPicker
                v-model="form.sortColor"
                :config="{
                  type: 'color',
                }"
              ></DesDVColorPicker>
            </div>
            <div class="ds-designer-property property-item">
              <div class="property-item-name" style="margin-left: 60px">表头高亮：</div>
              <DesDVSwitch v-model="form.sortIsHighlight"></DesDVSwitch>
            </div>
            <div class="ds-designer-property property-item" v-if="form.sortIsHighlight">
              <div class="property-item-name" style="margin-left: 80px">表头高亮：</div>
              <DesDVColorPicker v-model="form.sortHighlight"></DesDVColorPicker>
            </div>
            <div class="ds-designer-property property-item">
              <DesDVHorizonLine></DesDVHorizonLine>
            </div>
          </template>
        </template>
      </template>
      <!-- 内容样式 -->
      <div class="ds-designer-property property-item">
        <div class="property-item-name">内容：</div>
        <DesDVTextStyle v-model="form" @change="contentStyleChange" :config="{}"></DesDVTextStyle>
      </div>
      <div class="ds-designer-property property-item">
        <div class="property-item-name" style="opacity: 0">内容：</div>
        <DesDVTextAlign
          :value="{
            hAlign: form.align,
          }"
          :config="{
            isShowVAlign: false,
            iconType: 'textContent',
          }"
          @change="alignChange(...arguments, 'align')"
        ></DesDVTextAlign>
      </div>
      <div class="ds-designer-property property-item">
        <div class="property-item-name" style="opacity: 0">内容：</div>
        <dsfButtonDialog
          @click="setPrefixSuffixRule"
          style="margin: 0 4px 0 0"
          :hasValue="ruleHasValue('dataRuleList')"
          :config="{
            buttonText: '规则样式',
          }"
        >
        </dsfButtonDialog>
        <dsfButtonDialog
          @click="setIndentRules"
          style="margin: 0 4px 0 0"
          :hasValue="ruleHasValue('indentRules')"
          :config="{
            buttonText: '行缩进',
          }"
        >
        </dsfButtonDialog>
      </div>
      <div class="ds-designer-property property-item" v-if="isShowPadding">
        <div class="property-item-name">内边距：</div>
        <DesDVMargins v-model="form.commonPadding" />
      </div>
      <div class="ds-designer-property property-item">
        <div class="property-item-name">悬浮提示</div>
        <DesDVSwitch v-model="form.isCssTitle"></DesDVSwitch>
      </div>
      <div class="ds-designer-property property-item">
        <div class="property-item-name">柱体</div>
        <DesDVSwitch v-model="form.isBar" @change="barChange"></DesDVSwitch>
      </div>
      <template v-if="form.isBar">
        <div class="ds-designer-property property-item">
          <div class="property-item-name" style="margin-left: 30px">间距：</div>
          <DesDVPixel v-model="form.barSpace"></DesDVPixel>
          <dsfButtonDialog
            @click="settingBar"
            style="margin: 2px 0 0 4px"
            :hasValue="ruleHasValue('barInfo')"
            :config="{
              buttonText: '柱体配置',
            }"
          >
          </dsfButtonDialog>
        </div>
        <div class="ds-designer-property property-item">
          <DesDVHorizonLine></DesDVHorizonLine>
        </div>
      </template>

      <template v-if="!form.isBar">
        <!-- 内容前缀 -->
        <DesDVPrefixSuffix
          v-model="form.prefixConfig"
          :owner="owner"
          :config="{
            title: '内容前缀',
          }"
        >
        </DesDVPrefixSuffix>
        <!-- 内容后缀 -->
        <DesDVPrefixSuffix
          v-model="form.suffixConfig"
          :owner="owner"
          :config="{
            title: '内容后缀',
          }"
        >
        </DesDVPrefixSuffix>
      </template>
    </div>
  </div>
</template>

<script>
import dsfButtonDialog from "_dataview/designer/common/components/dsfButton.vue";
const TableBarSetting = Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_private" */ "_dataview/designer/setting/tableBarSetting.vue"));
const TableIndentSetting = Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_private" */ "_dataview/designer/setting/tableIndentSetting.vue"));
export default {
  name: "DesDVSingleTableStyle",
  props: {
    value: {
      type: Array,
    },
    owner: {
      type: Object,
    },
    mapFieldList: {
      type: Array,
    },
    config: {
      type: Object,
    },
    tabActive: {
      type: String,
    },
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    dsfButtonDialog,
  },
  watch: {
    value: {
      handler() {
        this.initData();
      },
      deep: true,
    },
    form: {
      handler(val, oldVal) {
        if (val && oldVal && val.id === oldVal?.id) {
          this.changeValue();
        }
      },
      deep: true,
    },
    "form.width"(val) {
      if (typeof val === "string") {
        val.trim() === "auto" ? (this.widthType = "auto") : (this.widthType = "fixed");
      } else {
        this.widthType = "fixed";
      }
    },
  },
  computed: {
    newHeaderConfig() {
      return this.getVm().newHeaderConfig;
    },
    isShowSort() {
      let treeRef = this.$refs.tree;
      if (treeRef) {
        let node = treeRef.getCurrentNode();
        return !node.children?.length;
      }
      return false;
    },
    isShowPadding() {
      let config = this.config;
      if (this.data.config) {
        config = this.data.config;
      }
      return config && config.componentType === "largeTable";
    },
    ruleHasValue: (self) => {
      return (type) => {
        let obj = self.form[type];
        if (obj?.length) {
          return true;
        }
        return false;
      };
    },
  },
  data() {
    return {
      currentNodeKey: "",
      attributes: [],
      defaultProps: {
        children: "children",
        label: "label",
      },
      colOptions: [
        {
          text: "自适应",
          value: "auto",
        },
        {
          text: "固定",
          value: "fixed",
        },
      ],
      sortOptions: [
        {
          text: "箭头",
          value: "arrow",
        },
        {
          text: "筛选",
          value: "filter",
        },
      ],
      treeData: [],
      form: null,
      widthType: "auto",
    };
  },
  created() {
    this.initAttributes();
    this.initData();
    this.selectDefault();
  },
  methods: {
    initAttributes() {
      // this.attributes = _.cloneDeep(tableAttributes);
    },
    selectDefault() {
      if (this.treeData.length && !this.form) {
        this.$nextTick(() => {
          this.$refs.tree.setCurrentKey(this.treeData[0].id);
          this.nodeClick(this.treeData[0]);
        });
      }
    },
    initData() {
      let nowVal = this.value;
      if (!nowVal) {
        return;
      }
      if (nowVal.__changeType__ === "tablePop") {
        this.form = null;
        nowVal.__changeType__ = "singleStyle";
        setTimeout(() => {
          this.selectDefault();
        });
      }
      nowVal.forEach((it) => {
        it.id = it.id ? it.id : dsf.uuid();
      });
      this.treeData = nowVal;
    },
    nodeClick(data) {
      this.currentNodeKey = data.id;
      this.form = data;
    },
    changeValue() {
      let val = this.treeData;
      this.$emit("input", val);
      this.$emit("change", val);
    },
    widthTypeChange(val) {
      if (val === "auto") {
        this.form.width = "auto";
      } else {
        this.form.width = "30%";
      }
    },
    alignChange(val, field) {
      this.form[field] = val.hAlign;
    },
    getVm() {
      return this.owner.$children[0];
    },
    setPrefixSuffixRule() {
      let self = this;
      this.$openDialog({
        title: "数据规则",
        content: "DesDVUniversalRuleConfig",
        params: {
          currentData: this.form.dataRuleList,
          owner: this.owner,
          config: {
            typeOptions: [
              {
                label: "文字",
                value: "text",
                config: {
                  picker: {
                    type: "both",
                  },
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
                self.form.dataRuleList = i;
              }
            },
          },
          {
            text: "取消",
          },
        ],
      });
    },
    settingBar() {
      let self = this;
      this.$openDialog({
        title: "柱体配置",
        content: TableBarSetting,
        params: {
          mapFieldList: this.mapFieldList,
          currentData: this.form.barInfo,
          owner: this.owner,
        },
        width: "980px",
        height: "60vh",
        btns: [
          {
            text: "确定",
            handler(res) {
              if (res && res.yes) {
                let i = res.yes();
                if (i) {
                  self.form.barInfo = i;
                }
              }
            },
          },
          {
            text: "取消",
          },
        ],
      });
    },
    //设置缩进规则
    setIndentRules() {
      let self = this;
      this.$openDialog({
        title: "行缩进配置",
        content: TableIndentSetting,
        params: {
          mapFieldList: this.mapFieldList,
          currentData: this.form.indentRules || [],
        },
        width: "800px",
        height: "400px",
        btns: [
          {
            text: "确定",
            handler(res) {
              self.form.indentRules = res.yes();
            },
          },
          {
            text: "取消",
          },
        ],
      });
    },
    contentStyleChange(val) {
      if (this.form.dataRuleConfig) {
        this.form.dataRuleConfig.defaultForm.color = val.color;
        this.form.dataRuleConfig.defaultForm.fontWeight = val.fontWeight === "bold" ? "bold" : 400;
        this.form.dataRuleConfig.defaultForm.fontSize = val.fontSize;
      }
    },
    barChange(val) {
      if (val) {
        let map = this.form.map;
        this.form.barInfo.forEach((bar) => {
          bar.field = map;
          bar.fieldSuffix = map;
        });
      }
    },
  },
};
</script>
<style lang="scss">
@import "_dataview/assets/styles/designer/common/commonProperty/DesDVSingleTableStyle.scss";
</style>
