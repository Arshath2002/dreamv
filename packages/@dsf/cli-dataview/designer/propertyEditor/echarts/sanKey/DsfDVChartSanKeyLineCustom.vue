<!--
 * @Description: 自定义关系边
 * @Author: shenah
 * @Date: 2024-05-08 10:14:10
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-02-14 16:26:46
-->

<template>
  <div class="des-dv-universal-rule-config">
    <!-- 规则列表 -->
    <template v-if="length">
      <div class="rule-list-wrap">
        <dsf-virtual-scroll>
          <div class="rule-value-item-all rule-value-item mb20" v-for="(item, id) in customData" :key="id">
            <div class="content">
              <div class="condition-item-wrap">
                <div class="rule-value-inner">
                  <div class="rule-value-inner-item">
                    <div class="label-text">源节点名称：</div>
                    <DesDVSelect
                      v-model="item.lineStyle.sourceNodeName"
                      :data="{ dictionary: dataList }"
                      :fieldMap="{
                        text: 'name',
                        value: 'name',
                      }"
                      :config="{
                        size: 'small',
                      }"
                      @change="changeNodeName($event, item, 'sourceNodeName')"
                    ></DesDVSelect>
                  </div>
                  <div class="rule-value-inner-item">
                    <div class="label-text">目标节点名称：</div>
                    <DesDVSelect
                      v-model="item.lineStyle.targetNodeName"
                      :data="{ dictionary: dataList }"
                      :fieldMap="{
                        text: 'name',
                        value: 'name',
                      }"
                      :config="{
                        size: 'small',
                      }"
                      @change="changeNodeName($event, item, 'targetNodeName')"
                    ></DesDVSelect>
                  </div>
                </div>
                <div class="content-btn-list">
                  <DsfIcon class="common-btn-icon del-icon" name="delete" @click="delOne(id)"></DsfIcon>
                </div>
              </div>
              <div class="rule-value-inner">
                <div class="rule-value-inner-item">
                  <div class="label-text">边的颜色：</div>
                  <DesDVRadioGroup
                    :data="{ dictionary: borderColorTypeOptions }"
                    :fieldMap="{
                      text: 'label',
                      value: 'value',
                    }"
                    v-model="item.lineStyle.isCustomColor"
                    @change="changeCustomColor($event, item)"
                  />
                </div>
                <div class="rule-value-inner-item">
                  <template v-if="item.lineStyle.isCustomColor">
                    <DesDVColorPicker :config="bothConfig" v-model="item.lineStyle.itemLineColor" @change="changeItemLineColor($event, item)" />
                  </template>
                  <template v-else>
                    <DesDVSelect
                      v-model="item.lineStyle.color"
                      :data="{ dictionary: colorDesList }"
                      :config="{
                        size: 'small',
                      }"
                      :fieldMap="{
                        text: 'label',
                        value: 'value',
                      }"
                    ></DesDVSelect>
                  </template>
                </div>
                <div class="rule-value-inner-item" style="margin: 0 20px">
                  <div class="label-text">透明度：</div>
                  <DesDVNumber v-model="item.lineStyle.opacity" />
                </div>
              </div>
              <div class="rule-value-item aic">
                <div class="label-text">边的曲度：</div>
                <DesDVNumber v-model="item.lineStyle.curveness" />
              </div>
              <div class="rule-value-item aic">
                <div class="label-text">关系边标签：</div>
                <DesDVSwitch v-model="item.edgeLabel.show" />
              </div>
              <!-- 标签 -->
              <template v-if="item.edgeLabel.show">
                <div class="rule-value-inner" style="margin-left: 30px">
                  <div class="rule-value-inner-item">
                    <div class="label-text">内容：</div>
                    <el-input v-model="item.edgeLabel.formatter" placeholder="请输入" @change="changeLabel($event, item)" size="small" />
                    <DesDVToolTipsIcon
                      :data="{
                        desc: '{a}=系列名; {b}=数据名; {c}=数据值;',
                      }"
                    ></DesDVToolTipsIcon>
                  </div>
                  <div class="rule-value-inner-item">
                    <div class="label-text">字体：</div>
                    <DesDVPixel v-model="item.edgeLabel.fontSize" :options="fontSizeUnitOptions"></DesDVPixel>
                    <DesDVColorPicker
                      style="margin-left: 10px"
                      :config="{
                        ...colorConfig,
                        noInput: true,
                      }"
                      v-model="item.edgeLabel.color"
                    />
                  </div>
                </div>
              </template>
            </div>
          </div>
        </dsf-virtual-scroll>
      </div>
    </template>
    <dsf-empty-data v-else description="暂无规则" class="no-data" />
    <!-- 按钮列表 -->
    <div class="btn-list">
      <el-button size="small" type="text" icon="el-icon-plus" @click="addCustom"> 新增 </el-button>
    </div>
  </div>
</template>

<script>
import { sanKeyBorderColorTypeOptions, sanKeyColorDesList } from "../attrConfig";
import customMixin from "./customMixin";
export default {
  name: "DsfDVChartSanKeyLineCustom",
  mixins: [$mixins.propertyDialogSetting, customMixin],
  components: {},
  data() {
    return {
      edgeLabelTemplate: {
        show: false,
        formatter: "{c}",
        color: "#fff",
        fontSize: "12",
        sourceNodeName: "",
        targetNodeName: "",
        customList: [],
      },
      lineStyleTemplate: {
        isCustomColor: false,
        color: "gradient",
        opacity: 0.2,
        curveness: 0.5,
        sourceNodeName: null,
        targetNodeName: null,
        customList: [],
      },
      borderColorTypeOptions: sanKeyBorderColorTypeOptions,
      colorDesList: sanKeyColorDesList,
    };
  },
  props: {},
  computed: {},
  created() {
    this.initData();
  },
  methods: {
    initData() {
      this.handleCustomData();
      if (!Object.keys(this.customData).length) {
        this.addCustom();
      }
    },
    handleCustomData() {
      let customData = {};
      let result = {};
      let edgeLabelCustom = this.currentData.edgeLabel.customList || [];
      let lineStyleCustom = this.currentData.lineStyle.customList || [];
      // 处理颜色
      lineStyleCustom.forEach((item) => {
        if (item.startColor) {
          delete item.startColor;
          delete item.endColor;
          delete item.isShade;
        }
        if (item.isCustomColor && item.color) {
          item.itemLineColor = dsf.dataview.utils.convertChartToCSSColor(item.color);
        }
      });
      this.createOneAttr(customData, edgeLabelCustom, "edgeLabel");
      this.createOneAttr(customData, lineStyleCustom, "lineStyle");
      Object.keys(customData).forEach((key) => {
        let nodeObj = customData[key];
        nodeObj.edgeLabel = dsf.mix(true, {}, this.edgeLabelTemplate, nodeObj.edgeLabel);
        nodeObj.lineStyle = dsf.mix(true, {}, this.lineStyleTemplate, nodeObj.lineStyle);
        this.handleName(nodeObj, "edgeLabel", "lineStyle", "sourceNodeName");
        this.handleName(nodeObj, "lineStyle", "edgeLabel", "sourceNodeName");
        this.handleName(nodeObj, "edgeLabel", "lineStyle", "targetNodeName");
        this.handleName(nodeObj, "lineStyle", "edgeLabel", "targetNodeName");
        result[dsf.uuid(8)] = nodeObj;
      });
      this.customData = _.cloneDeep(result);
    },
    handleName(node, oneStyleField, twoStyleField, valueField) {
      node[oneStyleField][valueField] = node[oneStyleField][valueField] ? node[oneStyleField][valueField] : node[twoStyleField][valueField];
    },
    createOneAttr(obj, list, attr) {
      list.forEach((item) => {
        let sourceNodeName = item.sourceNodeName;
        let targetNodeName = item.targetNodeName;
        let key = `${sourceNodeName}^_^${targetNodeName}`;
        if (sourceNodeName && targetNodeName) {
          if (!obj[key]) {
            obj[key] = {};
          }
          obj[key][attr] = item;
        }
      });
    },
    changeNodeName(val, item, key) {
      item.edgeLabel[key] = val;
    },
    changeCustomColor(val, item) {
      if (val) {
        this.$set(item, "itemLineColor", `linear-gradient(90deg,#5470c6 0%, #5470c6 100%)`);
      } else {
        item.lineStyle.color = "gradient";
      }
    },
    changeItemLineColor(val, item) {
      const color = dsf.dataview.utils.convertCSSToEChartsColor(val);
      item.lineStyle.color = color;
    },
    changeLabel(val, item) {
      if (typeof val === "string" && val.trim()) {
        item.edgeLabel.formatter = val;
      } else {
        item.edgeLabel.formatter = null;
      }
    },
    addCustom() {
      this.$set(this.customData, dsf.uuid(8), {
        lineStyle: _.cloneDeep(this.lineStyleTemplate),
        edgeLabel: _.cloneDeep(this.edgeLabelTemplate),
      });
    },
    delOne(id) {
      this.$delete(this.customData, id);
    },
    beforeYse() {
      let obj = _.cloneDeep(this.customData);
      let labelList = [];
      let reactList = [];
      Object.keys(obj).forEach((key) => {
        let nowData = obj[key];
        let edgeLabelObj = nowData.edgeLabel;
        let lineStyleObj = nowData.lineStyle;
        if (edgeLabelObj.sourceNodeName && edgeLabelObj.targetNodeName && lineStyleObj.sourceNodeName && lineStyleObj.targetNodeName) {
          labelList.push(edgeLabelObj);
          reactList.push(lineStyleObj);
          if (lineStyleObj.color === "") {
            lineStyleObj.color = null;
          }
        }
      });
      return {
        edgeLabelCustomList: labelList,
        lineStyleCustomList: reactList,
      };
    },
    yes() {
      let obj = this.beforeYse();
      return obj;
    },
  },
};
</script>
<style lang="scss">
@import "_dataview/assets/styles/designer/DesDVUniversalRuleConfig.scss";
</style>
