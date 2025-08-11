<!--
 * @Description: 图文组件指标
 * @Author: shenah
 * @Date: 2024-04-09 11:29:56
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-06-16 09:56:06
-->
<template>
  <div class="dsf-index-key-trades-style">
    <template v-if="list.length">
      <!-- 字段显示列表 -->
      <div class="dy-text-list">
        <div class="dy-text-item" :class="dyTextItemClass(item)" v-for="(item, index) in list" :key="item.uuid" @click="itemClick(item, index)">
          <div class="text">指标{{ index + 1 }}</div>
          <div class="desc">{{ getDesc(item) }}</div>
        </div>
      </div>
      <!-- 属性显示 -->
      <div v-if="form" :key="form.uuid">
        <template>
          <div class="ds-designer-property property-item">
            <div class="property-item-name">排列：</div>
            <DesDVSelect @change="changeValue" v-model="form.layoutMethods" :data="{ dictionary: layoutMethodsOptions }"></DesDVSelect>
          </div>
          <!-- 名称 -->
          <template v-if="form.title">
            <div class="ds-designer-property property-item">
              <div class="property-item-name">名称样式:</div>
              <div class="property-item-desc-tip">[{{ getFieldName(form.title) }}]</div>
            </div>
            <div class="ds-designer-property property-item">
              <div class="property-item-name" style="margin-left: 30px">样式：</div>
              <DesDVTextStyle
                v-model="form.style"
                @change="nameStyleChange"
                :config="{
                  colorStringField: 'nameColor',
                  fontWeightField: 'nameFontWeight',
                  fontStyleField: 'nameFontStyle',
                  textDecorationField: 'nameTextDecoration',
                  fontSizeField: 'nameFontSize',
                  fontFamilyField: 'nameFontFamily',
                  textShadowField: 'nameTextShadow',
                }"
              ></DesDVTextStyle>
            </div>
            <div class="ds-designer-property property-item">
              <div class="property-item-name" style="margin-left: 30px; opacity: 0">样式：</div>
              <DesDVTextAlign
                v-model="form.style.nameTextAlign"
                :config="{
                  isShowVAlign: false,
                  hMapData: [
                    { mapName: 'left', mapKey: 'left' },
                    { mapName: 'center', mapKey: 'center' },
                    { mapName: 'right', mapKey: 'right' },
                  ],
                  iconType: 'textContent',
                }"
                @change="alignChange(...arguments, 'nameTextAlign')"
              >
              </DesDVTextAlign>
            </div>
            <div class="ds-designer-property property-item">
              <div class="property-item-name" style="margin-left: 30px">文字行数：</div>
              <DesDVNumber
                v-model="form.style.lineNum"
                @change="changeValue"
                :config="{
                  unit: '行',
                }"
              ></DesDVNumber>
              <DesDVToolTipsIcon
                :data="{
                  desc: '字数较少时设置无效。字数过多时，设置展示行数',
                }"
              ></DesDVToolTipsIcon>
            </div>
            <div class="ds-designer-property property-item">
              <div class="property-item-name" style="margin-left: 30px">换行：</div>
              <DesDVNumber
                v-model="form.style.lineBreak"
                @change="changeValue"
                :config="{
                  unit: '字',
                }"
              ></DesDVNumber>
              <DesDVToolTipsIcon
                :data="{
                  desc: '设置文字个数，截断换行展示。',
                }"
              ></DesDVToolTipsIcon>
            </div>
            <div class="ds-designer-property property-item">
              <div class="property-item-name" style="margin-left: 30px">行间距：</div>
              <DesDVSelect v-model="form.style.lineHeight" @change="changeValue" :data="{ dictionary: lineHeightOptions }"></DesDVSelect>
            </div>
            <div class="ds-designer-property property-item">
              <div class="property-item-name" style="margin-left: 30px">外边距：</div>
              <DesDVMargins
                :value="[
                  form.style.nameMarginTop ? form.style.nameMarginTop : form.style.valueMarginTop,
                  form.style.nameMarginRight ? form.style.nameMarginRight : form.style.valueMarginRight,
                  form.style.nameMarginBottom ? form.style.nameMarginBottom : form.style.valueMarginBottom,
                  form.style.nameMarginLeft ? form.style.nameMarginLeft : form.style.valueMarginLeft,
                ]"
                @change="(val) => marginChange(val, 'nameMargin')"
              />
            </div>
            <div class="ds-designer-property property-item">
              <div class="property-item-name" style="margin-left: 30px; min-width: 0"></div>
              <dsfButtonDialog
                @click="
                  ruleSelect(form, {
                    key: 'name',
                  })
                "
                :hasValue="rowHasValue('name')"
                :config="{
                  buttonText: '规则样式',
                }"
              >
              </dsfButtonDialog>
            </div>
            <div class="ds-designer-property property-item">
              <DesDVHorizonLine></DesDVHorizonLine>
            </div>
          </template>
          <!-- 值 -->
          <template v-if="form.field">
            <div class="ds-designer-property property-item">
              <div class="property-item-name">值样式:</div>
              <div class="property-item-desc-tip">[{{ getFieldName(form.field) }}]</div>
            </div>
            <div class="ds-designer-property property-item">
              <div class="property-item-name" style="margin-left: 30px">样式：</div>
              <DesDVTextStyle
                v-model="form.style"
                @change="valueStyleChange"
                :config="{
                  colorStringField: 'valueColor',
                  fontWeightField: 'valueFontWeight',
                  fontStyleField: 'valueFontStyle',
                  textDecorationField: 'valueTextDecoration',
                  fontSizeField: 'valueFontSize',
                  fontFamilyField: 'valueFontFamily',
                  textShadowField: 'valueTextShadow',
                }"
              ></DesDVTextStyle>
            </div>
            <div class="ds-designer-property property-item">
              <div class="property-item-name" style="margin-left: 30px">外边距：</div>
              <DesDVMargins
                :value="[form.style.valueMarginTop, form.style.valueMarginRight, form.style.valueMarginBottom, form.style.valueMarginLeft]"
                @change="(val) => marginChange(val, 'valueMargin')"
              />
            </div>
            <div class="ds-designer-property property-item">
              <div class="property-item-name" style="margin-left: 30px; min-width: 0"></div>
              <dsfButtonDialog
                @click="
                  ruleSelect(form, {
                    key: 'value',
                  })
                "
                :hasValue="rowHasValue('value')"
                :config="{
                  buttonText: '规则样式',
                }"
              >
              </dsfButtonDialog>
            </div>
            <div class="ds-designer-property property-item">
              <div class="property-item-name" style="margin-left: 30px; min-width: 0"></div>
              <DesDVDesignerPopover
                v-model="form.style.digitalWholeConfig"
                :attrData="{
                  config: {
                    content: 'DesDVScrollDigitalConfig',
                    width: '300',
                    buttonText: '翻牌器',
                  },
                }"
                :dataValue="form.style.digitalWholeConfig"
                @change="digitalWholeConfigChange"
              />
            </div>
            <div class="ds-designer-property property-item float-one-row">
              <div class="property-item-name" style="margin-left: 60px">柱体：</div>
              <DesDVSwitch @change="changeValue" v-model="form.style.isBar"></DesDVSwitch>
            </div>
            <template v-if="form.style.isBar">
              <div class="ds-designer-property property-item float-one-row ml10">
                <dsfButtonDialog
                  @click="selectBar"
                  :hasValue="true"
                  :config="{
                    buttonText: '配置',
                  }"
                >
                </dsfButtonDialog>
              </div>
            </template>
            <div class="ds-designer-property property-item">
              <DesDVHorizonLine></DesDVHorizonLine>
            </div>
          </template>
          <!-- 单位样式 -->
          <template v-if="form.unit">
            <div class="ds-designer-property property-item">
              <div class="property-item-name">单位样式:</div>
              <div class="property-item-desc-tip">[{{ getFieldName(form.unit) }}]</div>
            </div>
            <div class="ds-designer-property property-item">
              <div class="property-item-name" style="margin-left: 30px">样式：</div>
              <DesDVTextStyle
                v-model="form.style"
                @change="changeValue"
                :config="{
                  colorStringField: 'unitColor',
                  fontWeightField: 'unitFontWeight',
                  fontStyleField: 'unitFontStyle',
                  textDecorationField: 'unitTextDecoration',
                  fontSizeField: 'unitFontSize',
                  fontFamilyField: 'unitFontFamily',
                  textShadowField: 'unitTextShadow',
                }"
              ></DesDVTextStyle>
            </div>
            <div class="ds-designer-property property-item">
              <div class="property-item-name" style="margin-left: 30px">间距：</div>
              <DesDVNumber
                v-model="form.style.unitGap"
                @change="changeValue"
                :config="{
                  unit: 'px',
                }"
              ></DesDVNumber>
            </div>
            <div class="ds-designer-property property-item">
              <div class="property-item-name" style="margin-left: 30px; min-width: 0"></div>
              <dsfButtonDialog
                @click="
                  ruleSelect(form, {
                    key: 'unit',
                  })
                "
                :hasValue="rowHasValue('unit')"
                :config="{
                  buttonText: '规则样式',
                }"
              >
              </dsfButtonDialog>
            </div>
            <div class="ds-designer-property property-item">
              <DesDVHorizonLine></DesDVHorizonLine>
            </div>
          </template>
          <!-- 整体 -->
          <div class="ds-designer-property property-item">
            <div class="property-item-name">对齐方式：</div>
            <DesDVTextAlign
              v-model="form.style.align"
              :config="{
                isShowVAlign: false,
                hMapData: [
                  { mapName: 'flex-start', mapKey: 'left' },
                  { mapName: 'center', mapKey: 'center' },
                  { mapName: 'flex-end', mapKey: 'right' },
                ],
              }"
              @change="alignChange(...arguments, 'align')"
            ></DesDVTextAlign>
            <DesDVTextAlign
              v-model="form.style.verticalAlign"
              :config="{
                isShowHAlign: false,
                vMapData: [
                  { mapName: 'flex-start', mapKey: 'top' },
                  { mapName: 'center', mapKey: 'middle' },
                  { mapName: 'flex-end', mapKey: 'bottom' },
                ],
              }"
              @change="alignChange(...arguments, 'verticalAlign')"
            ></DesDVTextAlign>
          </div>
          <div class="ds-designer-property property-item float-one-row">
            <div class="property-item-name">位移X：</div>
            <DesDVNumber
              v-model="form.style.relativeLeft"
              @change="changeValue"
              :config="{
                unit: 'px',
              }"
            ></DesDVNumber>
          </div>
          <div class="ds-designer-property property-item float-one-row ml20">
            <div class="property-item-name">Y：</div>
            <DesDVNumber
              v-model="form.style.relativeTop"
              @change="changeValue"
              :config="{
                unit: 'px',
              }"
            ></DesDVNumber>
          </div>
        </template>
      </div>
    </template>
    <template v-else>
      <dsf-empty-data description="暂无数据" />
    </template>
  </div>
</template>

<script>
import dsfButtonDialog from "_dataview/designer/common/components/dsfButton.vue";
const CommonBarConfigSetting = Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_private" */ "_dataview/designer/setting/commonBarConfigSetting.vue"));

export default {
  name: "DesDVIndexKeyTradesStyle",
  props: {
    value: {
      type: Object,
    },
    owner: {
      type: Object,
    },
  },
  components: {
    dsfButtonDialog,
  },
  watch: {
    value(v) {
      this.initData();
    },
  },
  computed: {
    mapFieldList() {
      return this.owner.$children[0].designerMapFieldList;
    },
    dyTextItemClass(self) {
      return (row) => {
        let str = "";
        if (row.uuid === self.form?.uuid) {
          str += " active";
        }
        return str;
      };
    },
    rowHasValue() {
      return (field) => {
        const rule = this.form[`${field}RuleList`];
        return rule && rule.length > 0;
      };
    },
  },
  data() {
    return {
      lineHeightOptions: [
        {
          text: "默认",
          value: "normal",
        },
        {
          text: "1.2倍",
          value: "1.2em",
        },
        {
          text: "1.5倍",
          value: "1.5em",
        },
        {
          text: "2倍",
          value: "2em",
        },
      ],
      layoutMethodsOptions: [
        {
          text: "25%",
          value: 6,
        },
        {
          text: "34%",
          value: 8,
        },
        {
          text: "50%",
          value: 12,
        },
        {
          text: "66%",
          value: 15,
        },
        {
          text: "75%",
          value: 18,
        },
        {
          text: "100%",
          value: 24,
        },
      ],
      curIndex: 0,
      list: [],
      form: null,
    };
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
      if (this.value) {
        this.list = this.value;
        if (this.list.length < this.curIndex + 1) {
          this.curIndex = 0;
        }
        this.form = this.list[this.curIndex];
      }
    },
    getDesc(row) {
      let titleText = this.getFieldName(row.title);
      let valueText = this.getFieldName(row.field);
      let unitValue = this.getFieldName(row.unit);
      return `[${titleText}，${valueText}，${unitValue}]`;
    },
    itemClick(row, index) {
      if (!this.form || this.form.uuid !== row.uuid) {
        this.curIndex = index;
        this.$set(this, "form", this.list[index]);
        this.changeValue();
      }
    },
    changeValue() {
      this.$emit("input", this.value);
      this.$emit("change", this.value);
    },
    marginChange(val, type) {
      let topField = `${type}Top`;
      let rightField = `${type}Right`;
      let bottomField = `${type}Bottom`;
      let leftField = `${type}Left`;
      this.$set(this.form.style, topField, val[0]);
      this.$set(this.form.style, rightField, val[1]);
      this.$set(this.form.style, bottomField, val[2]);
      this.$set(this.form.style, leftField, val[3]);

      this.changeValue();
    },
    nameStyleChange(val) {
      this.$set(this.form, "style", val);
      this.$set(this.form, "nameColor", val.nameColor);
      this.$set(this.form, "nameFontSize", val.nameFontSize);

      this.changeValue();
    },
    valueStyleChange(val) {
      let color = val.valueColor;
      let fontSize = val.valueFontSize;
      this.form.style = val;
      this.form.valueColor = color;
      this.form.style.digitalWholeConfig.color = color;
      this.form.style.digitalWholeConfig.fontWeight = val.valueFontWeight;
      this.form.style.digitalWholeConfig.fontStyle = val.valueFontStyle;
      this.form.style.digitalWholeConfig.fontFamily = val.valueFontFamily;
      this.form.valueFontSize = fontSize;
      this.form.style.digitalWholeConfig.fontSize = fontSize;

      this.changeValue();
    },
    ruleSelect(row, fieldRow) {
      let self = this;
      let field = fieldRow.key;
      let typeOptions =
        field === "unit"
          ? [
              {
                label: "文字",
                value: "text",
                config: {
                  picker: {
                    type: "both",
                  },
                },
              },
            ]
          : [
              {
                label: "文字",
                value: "text",
                config: {
                  picker: {
                    type: "both",
                  },
                },
              },
              {
                label: "图标",
                value: "icon",
              },
              {
                label: "图片",
                value: "image",
              },
            ];
      this.$openDialog({
        title: field === "name" ? "名称规则" : "值规则",
        content: "DesDVUniversalRuleConfig",
        params: {
          currentData: row[`${field}RuleList`],
          owner: this.owner,
          config: {
            typeOptions,
          },
        },
        width: "1100px",
        height: "60vh",
        btns: [
          {
            text: "确定",
            handler(res) {
              if (res && res.yes) {
                let i = res.yes();
                row[`${field}RuleList`] = i;
                self.changeValue();
              }
            },
          },
          {
            text: "取消",
          },
        ],
      });
    },
    selectBar() {
      let self = this;
      this.$openDialog({
        title: "柱体配置",
        content: CommonBarConfigSetting,
        width: "800px",
        height: "400px",
        params: {
          owner: this.owner,
          currentData: this.form.style.barConfig,
        },
        btns: [
          {
            text: "确定",
            handler: (res) => {
              let result = res.yes();
              if (result) {
                self.form.style.barConfig = result;
                this.changeValue();
              }
            },
          },
          {
            text: "取消",
            handler: () => {},
          },
        ],
      });
    },
    digitalWholeConfigChange(val) {
      this.$set(this.form.style, "digitalWholeConfig", val);
      this.$set(this.form, "valueFontSize", val.fontSize);
      this.$set(this.form, "valueColor", val.color);
      this.$set(this.form.style, "valueFontSize", val.fontSize);
      this.$set(this.form.style, "valueColor", val.color);
      this.$set(this.form, "valueFontWeight", val.isFontBold ? "bold" : "");
      this.$set(this.form.style, "valueFontWeight", val.isFontBold ? "bold" : "");
      this.changeValue();
    },
    alignChange(val, field) {
      this.form.style[field] = val;
      this.changeValue();
    },
    getFieldName(field) {
      let one = this.mapFieldList.find((item) => item.value === field) || {};
      return one.name ? one.name : field ? field : "无";
    },
  },
};
</script>
<style lang="scss">
@import "_dataview/assets/styles/designer/common/commonProperty/dsfIndexKeyTradesStyle.scss";
</style>
