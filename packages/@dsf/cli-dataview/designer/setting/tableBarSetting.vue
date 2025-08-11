<!--
 * @Description: 表格柱体详情设置
 * @Author: shenah
 * @Date: 2023-04-24 19:21:14
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-02-13 10:06:00
-->
<template>
  <div class="des-dv-table-bar-setting">
    <div class="header-title">
      <div class="btn-list">
        <el-button size="small" type="text" icon="el-icon-plus" @click="addBarConfig"> 添加柱体 </el-button>
      </div>
    </div>
    <el-card class="common-card" v-for="(item, index) in list" :key="item.id">
      <div slot="header" class="title">
        <div class="left-title">第{{ index + 1 }}项</div>
        <div v-if="list.length > 1">
          <el-button size="small" icon="el-icon-delete" @click="removeBar(index)"></el-button>
        </div>
      </div>
      <el-form :inline="true" :show-message="false" label-width="120px" size="small">
        <el-form-item class="common-form-item">
          <span slot="label" class="label-tip-wrap">
            <span>柱体字段映射</span>
            <el-tooltip class="item" effect="dark" content="用于表格、数据源、接口、综合表" placement="top">
              <i class="el-icon-warning-outline tip-icon"></i>
            </el-tooltip>
          </span>
          <SelectInput class="common-width" v-model="item.field" :mapFieldList="mapFieldList" />
        </el-form-item>
        <el-form-item class="common-form-item" style="margin-left: 90px">
          <span slot="label" class="label-tip-wrap">
            <span>计算百分比</span>
            <el-tooltip class="item" effect="dark" placement="top">
              <i class="el-icon-warning-outline tip-icon"></i>
              <template #content>
                <div>
                  <div style="margin-bottom: 10px">自动计算时：数据中最大的数值作为100%,其余自动计算</div>
                  <div>不自动计算时：数据直接作为百分比数据展示</div>
                </div>
              </template>
            </el-tooltip>
          </span>
          <DesDVSwitch v-model="item.isAutoCalc"></DesDVSwitch>
        </el-form-item>
        <el-form-item class="common-form-item" label="最小百分比">
          <div class="common-width">
            <DesDVNumber
              v-model="item.minBarPercent"
              :config="{
                unit: '%',
                min: 2,
                max: 20,
              }"
            />
          </div>
        </el-form-item>
        <div>
          <el-form-item label="柱体高度" class="common-form-item">
            <div class="common-width">
              <DesDVPixel v-model="item.height" />
            </div>
          </el-form-item>
          <el-form-item label="柱体宽度" class="common-form-item" style="margin-left: 84px">
            <div class="common-width">
              <DesDVPixel v-model="item.width" />
            </div>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="光点动效" class="common-form-item">
            <DesDVRadioGroup :data="{ dictionary: pointOptions }" v-model="item.pointType"></DesDVRadioGroup>
          </el-form-item>
          <template v-if="item.pointType !== 'no'">
            <el-form-item label="光点颜色" class="common-form-item" style="margin-left: 110px">
              <DesDVColorPicker
                v-model="item.pointColor"
                :config="{
                  type: 'color',
                }"
              ></DesDVColorPicker>
            </el-form-item>
            <template v-if="item.pointType === 'point'">
              <el-form-item label="底色" class="common-form-item">
                <DesDVColorPicker
                  v-model="item.pointBaseColor"
                  :config="{
                    type: 'color',
                  }"
                ></DesDVColorPicker>
              </el-form-item>
              <el-form-item label="呼吸效果" class="common-form-item" style="margin-left: 14px">
                <DesDVSwitch v-model="item.isPointBreathe"></DesDVSwitch>
              </el-form-item>
            </template>
          </template>
        </div>
        <div>
          <el-form-item label="动画" class="common-form-item">
            <DesDVSwitch v-model="item.animation.flag"></DesDVSwitch>
          </el-form-item>
          <el-form-item label="动画时长" class="common-form-item" style="margin-left: 240px" v-if="item.animation.flag">
            <DesDVNumber
              v-model="item.animation.duration"
              :config="{
                unit: 's',
                min: 1,
              }"
            />
          </el-form-item>
        </div>
        <div>
          <el-form-item label="柱体底色" class="common-form-item">
            <DesDVColorPicker
              v-model="item.barBaseColor"
              :config="{
                type: 'color',
              }"
            ></DesDVColorPicker>
          </el-form-item>
          <el-form-item label="柱体颜色" class="common-form-item">
            <DesDVColorPicker v-model="item.barBgColor"></DesDVColorPicker>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="边框圆角" class="common-form-item">
            <DesDVBorderRadius class="two-common-width" v-model="item.borderRadius" @change="(val) => borderRadiusChange(val, item)"> </DesDVBorderRadius>
          </el-form-item>
          <el-form-item label="" class="common-form-item">
            <dsfButtonDialog
              style="margin: 0 0 0 24px"
              class="common-width"
              @click="ruleSet(item, index, 'bgColorRuleList')"
              :hasValue="ruleHasValue(item.bgColorRuleList)"
              :config="{
                buttonText: '柱体规则样式',
              }"
            >
            </dsfButtonDialog>
          </el-form-item>
        </div>
        <el-form-item class="common-form-item" label="展示后缀">
          <DesDVSwitch v-model="item.showValue"></DesDVSwitch>
        </el-form-item>
        <template v-if="item.showValue">
          <div style="margin-left: 30px">
            <el-form-item label="样式" class="common-form-item">
              <DesDVTextStyle
                v-model="item.suffixRuleConfig.defaultConfig.text"
                :config="{
                  picker: {
                    type: 'color',
                  },
                }"
                style="width: 240px"
              ></DesDVTextStyle>
            </el-form-item>
          </div>
          <div style="margin-left: 30px">
            <el-form-item label="位置" class="common-form-item">
              <DesDVRadioGroup  :data="{ dictionary: barTextPositionOptions }"  v-model="item.barTextPosition"></DesDVRadioGroup>
            </el-form-item>
            <el-form-item label="位置" class="common-form-item label-transparent" v-if="item.barTextPosition === 'barInner'">
              <DesDVTextAlign
                v-model="item.barTextInnerAlign"
                :config="{
                  isShowVAlign: false,
                }"
                style="width: 160px; height: 28px"
                @change="alignChange(...arguments, item, 'barTextInnerAlign')"
              ></DesDVTextAlign>
            </el-form-item>
          </div>
          <div style="margin-left: 30px">
            <el-form-item label="展示字段" class="common-form-item">
              <SelectInput class="common-width" v-model="item.fieldSuffix" :mapFieldList="mapFieldList" />
            </el-form-item>
            <el-form-item label="单位字段" class="common-form-item" style="position: relative; left: 54px">
              <SelectInput class="common-width" v-model="item.unitField" :mapFieldList="mapFieldList" />
            </el-form-item>
            <el-form-item label="后缀配置" class="common-form-item label-transparent">
              <dsfButtonDialog
                style="margin: 0 0 0 0"
                @click="ruleSet(item, index, 'suffixRuleConfig')"
                :hasValue="ruleHasValue(item.suffixRuleConfig.ruleList)"
                :config="{
                  buttonText: '后缀规则',
                }"
              >
              </dsfButtonDialog>
            </el-form-item>
          </div>
        </template>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import { createOneTableBar } from "_dataview/output/config/tableBarConfig";
import SelectInput from "./graph/selectInput.vue";
import dsfButtonDialog from "_dataview/designer/common/components/dsfButton.vue";
export default {
  name: "TableBarSetting",
  mixins: [$mixins.propertyDialogSetting],
  props: {
    mapFieldList: {
      require: true,
    },
    owner: {
      type: Object,
    },
  },
  components: {
    SelectInput,
    dsfButtonDialog,
  },
  data() {
    return {
      pointOptions: [
        {
          text: "无",
          value: "no",
        },
        {
          text: "竖线",
          value: "line",
        },
        {
          text: "光点",
          value: "point",
        },
      ],
      booleanOptions: [
        {
          label: "是",
          value: true,
        },
        {
          label: "否",
          value: false,
        },
      ],
      barTextPositionOptions: [
        {
          text: "柱体右侧",
          value: "barRight",
        },
        {
          text: "柱体内侧",
          value: "barInner",
        },
      ],
      list: [],
    };
  },
  created() {
    this.initData();
  },
  computed: {
    ruleHasValue: () => {
      return (list) => {
        return list.length > 0;
      };
    },
  },
  methods: {
    initData() {
      let baseObj = createOneTableBar();
      let list = _.cloneDeep(this.currentData);
      if (!Array.isArray(list)) {
        list.bgColors = baseObj.bgColors;
        list.baseBgColors = baseObj.baseBgColors;
        let obj = {
          ...createOneTableBar(),
          ...list,
        };
        list = [obj];
      }
      for (let i = 0; i < list.length; i++) {
        list[i] = {
          ...createOneTableBar(),
          ...list[i],
        };
        this.handleOneData(list[i], baseObj);
      }
      this.list = list;
    },
    borderRadiusChange(val, row) {
      row.borderRadius = val;
    },
    handleOneData(config, baseObj) {
      if (Array.isArray(config.bgColors)) {
        let isGradient = config.isGradient;
        let one = config.bgColors[0];
        let two = config.bgColors[1];
        if (isGradient) {
          config.barBgColor = `linear-gradient(90deg,${one} 0% ,${two} 100%)`;
        } else {
          config.barBgColor = one;
        }
        delete config.bgColors;
        delete config.isGradient;
      }
      if (Array.isArray(config.baseBgColors)) {
        let baseColor = config.baseBgColors[0] || baseObj.barBaseColor;
        config.barBaseColor = baseColor;
        delete config.baseBgColors;
      }
    },
    ruleSet(row, index, field) {
      let title = "颜色";
      let currentData = row[field];
      let typeOptions = [
        {
          label: "色值",
          value: "color",
        },
      ];
      if (field === "suffixRuleConfig") {
        currentData = row[field].ruleList;
        typeOptions = [
          {
            label: "文字",
            value: "text",
            config: {
              hiddenPosition: true,
              hiddenContent: true,
            },
          },
        ];
        title = "后缀";
      }
      let params = {
        currentData: currentData,
        owner: this.owner,
        config: {
          typeOptions,
        },
      };
      this.$openDialog({
        title: `第${index + 1}柱体${title}设置`,
        content: "DesDVUniversalRuleConfig",
        params,
        width: "1200px",
        height: "60vh",
        btns: [
          {
            text: "确定",
            handler(res) {
              if (res && res.yes) {
                let i = res.yes();
                if (field === "suffixRuleConfig") {
                  row[field].ruleList = i;
                } else {
                  row[field] = i;
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
    addBarConfig() {
      let obj = createOneTableBar();
      this.handleOneData(obj);
      this.list.push(obj);
    },
    removeBar(index) {
      this.list.splice(index, 1);
    },
    alignChange(val, item, field) {
      item[field] = val;
    },
    beforeYes() {
      // 处理数据
      let list = _.cloneDeep(this.list);
      return list;
    },
    yes() {
      let arr = this.beforeYes();
      return arr;
    },
  },
};
</script>
<style lang="scss">
@import "_dataview/assets/styles/designer/tableBarSetting.scss";
</style>
