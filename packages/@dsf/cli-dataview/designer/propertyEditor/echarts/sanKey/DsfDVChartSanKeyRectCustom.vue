<!--
 * @Description: 自定义节点的添加
 * @Author: shenah
 * @Date: 2024-05-07 15:39:28
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-02-14 16:39:27
-->

<template>
  <div class="des-dv-universal-rule-config">
    <!-- 规则列表 -->
    <template v-if="length">
      <div class="rule-list-wrap">
        <dsf-virtual-scroll>
          <div class="rule-value-item-all rule-value-item mb20" v-for="(item, id) in customData" :key="id">
            <div class="label-text">名称：</div>
            <div class="content">
              <div class="condition-item-wrap">
                <DesDVSelect
                  v-model="item.itemStyle.nodeName"
                  :data="{ dictionary: filterDataList }"
                  :fieldMap="{
                    text: 'name',
                    value: 'name',
                  }"
                  :config="{
                    size: 'small',
                  }"
                  @change="changeNodeName($event, item)"
                ></DesDVSelect>
                <div class="content-btn-list">
                  <DsfIcon class="common-btn-icon del-icon" name="delete" @click="delOne(id)"></DsfIcon>
                </div>
              </div>
              <div class="rule-value-item aic">
                <div class="label-text">矩形颜色：</div>
                <DesDVColorPicker
                  :config="{
                    type: 'color',
                  }"
                  v-model="item.itemStyle.color"
                />
              </div>
              <div class="rule-value-item aic">
                <div class="label-text">矩形边框：</div>
                <DesDVSwitch :value="item.itemStyle.borderWidth !== 0" @change="changeBorder($event, item)" />
              </div>
              <!-- 边框 -->
              <template v-if="item.itemStyle.borderWidth !== 0">
                <div class="rule-value-inner" style="margin-left: 30px">
                  <div class="rule-value-inner-item">
                    <div class="label-text">类型：</div>
                    <DesDVRadioGroup
                      :data="{ dictionary: borderTypeList }"
                      :fieldMap="{
                        text: 'label',
                        value: 'value',
                      }"
                      v-model="item.itemStyle.borderType"
                    />
                  </div>
                  <div class="rule-value-inner-item">
                    <div class="label-text">线宽：</div>
                    <DesDVNumber v-model="item.itemStyle.borderWidth" />
                  </div>
                  <div class="rule-value-inner-item">
                    <div class="label-text">颜色：</div>
                    <DesDVColorPicker
                      :config="{
                        type: 'color',
                      }"
                      v-model="item.itemStyle.borderColor"
                    />
                  </div>
                </div>
              </template>
              <div class="rule-value-item aic">
                <div class="label-text">标签：</div>
                <DesDVSwitch v-model="item.label.show" />
              </div>
              <!-- 标签 -->
              <template v-if="item.label.show">
                <div class="rule-value-item aic" style="margin-left: 30px">
                  <div class="label-text">自定义位置：</div>
                  <DesDVSwitch v-model="item.label.customPosition" @change="changePositionFlag($event, item)" />
                </div>
                <div class="rule-value-inner" style="margin-left: 30px">
                  <template v-if="item.label.customPosition">
                    <div class="rule-value-inner-item">
                      <div class="label-text">位移X：</div>
                      <DesDVPixel
                        :options="[
                          {
                            label: 'fx',
                            value: '',
                          },
                        ]"
                        v-model="item.label.position[0]"
                      ></DesDVPixel>
                    </div>
                    <div class="rule-value-inner-item">
                      <div class="label-text">Y：</div>
                      <DesDVPixel
                        :options="[
                          {
                            label: 'fx',
                            value: '',
                          },
                        ]"
                        v-model="item.label.position[1]"
                      ></DesDVPixel>
                    </div>
                  </template>
                  <div class="rule-value-inner-item" v-else>
                    <div class="label-text">位置：</div>
                    <DesDVSelect
                      v-model="item.label.position"
                      :data="{ dictionary: labelPosition }"
                      :config="{
                        size: 'small',
                      }"
                      :fieldMap="{
                        text: 'label',
                        value: 'value',
                      }"
                    ></DesDVSelect>
                  </div>
                  <div class="rule-value-inner-item">
                    <div class="label-text">内容：</div>
                    <el-input v-model="item.label.formatter" placeholder="请输入" @change="changeLabel($event, item)" size="small" />
                    <DesDVToolTipsIcon
                      :data="{
                        desc: '{a}=系列名; {b}=数据名; {c}=数据值;',
                      }"
                    ></DesDVToolTipsIcon>
                  </div>
                  <div class="rule-value-inner-item">
                    <div class="label-text">字体：</div>
                    <DesDVPixel
                      v-model="item.label.fontSize"
                      :options="[
                        {
                          label: 'fx',
                          value: '',
                        },
                        {
                          label: 'px',
                          value: 'px',
                        },
                      ]"
                    ></DesDVPixel>
                    <DesDVColorPicker
                      style="margin-left: 10px"
                      :config="{
                        type: 'color',
                        noInput: true,
                      }"
                      v-model="item.label.color"
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
    <div class="btn-list" v-if="filterDataList.length">
      <el-button size="small" type="text" icon="el-icon-plus" @click="addCustom"> 新增 </el-button>
    </div>
  </div>
</template>

<script>
import customMixin from "./customMixin";
export default {
  name: "DsfDVChartSanKeyRectCustom",
  mixins: [$mixins.propertyDialogSetting, customMixin],
  components: {},
  data() {
    return {
      labelTemplate: {
        show: true,
        customPosition: false,
        position: "right",
        color: "#fff",
        fontSize: "12",
        formatter: "{b}",
        nodeName: "",
        customList: [],
      },
      itemStyleTemplate: {
        color: null,
        borderColor: "#aaa",
        borderWidth: 1,
        borderType: "solid",
        opacity: 1,
        isCustom: false,
        nodeName: "",
        customList: [],
      },
      customData: {},
    };
  },
  props: {
    dataList: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    length() {
      return Object.keys(this.customData).length;
    },
    filterDataList() {
      let hasNameList = [];
      Object.keys(this.customData).forEach((key) => {
        let obj = this.customData[key];
        hasNameList.push(obj.label.nodeName);
      });
      return this.dataList.filter((item) => hasNameList.indexOf(item.name) === -1);
    },
  },
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
      let labelCustom = this.currentData.label.customList || [];
      let reactCustom = this.currentData.itemStyle.customList || [];
      this.createOneAttr(customData, labelCustom, "label");
      this.createOneAttr(customData, reactCustom, "itemStyle");
      Object.keys(customData).forEach((key) => {
        let nodeObj = customData[key];
        nodeObj.label = dsf.mix(true, {}, this.labelTemplate, nodeObj.label);
        nodeObj.itemStyle = dsf.mix(true, {}, this.itemStyleTemplate, nodeObj.itemStyle);
        nodeObj.label.nodeName = nodeObj.label.nodeName ? nodeObj.label.nodeName : nodeObj.itemStyle.nodeName;
        nodeObj.itemStyle.nodeName = nodeObj.itemStyle.nodeName ? nodeObj.itemStyle.nodeName : nodeObj.label.nodeName;
        result[dsf.uuid(8)] = nodeObj;
      });
      this.customData = _.cloneDeep(result);
    },
    createOneAttr(obj, list, attr) {
      list.forEach((item) => {
        let name = item.nodeName;
        if (name) {
          if (!obj[name]) {
            obj[name] = {};
          }
          obj[name][attr] = item;
        }
      });
    },
    changeNodeName(val, item) {
      item.label.nodeName = val;
    },
    changeBorder(val, item) {
      let width = val ? 1 : 0;
      item.itemStyle.borderWidth = width;
    },
    changePositionFlag(val, item) {
      if (val) {
        item.label.position = [0, 0];
      } else {
        item.label.position = "right";
      }
    },
    changeLabel(val, item) {
      if (typeof val === "string" && val.trim()) {
        item.label.formatter = val;
      } else {
        item.label.formatter = null;
      }
    },
    addCustom() {
      this.$set(this.customData, dsf.uuid(8), {
        itemStyle: _.cloneDeep(this.itemStyleTemplate),
        label: _.cloneDeep(this.labelTemplate),
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
        let labelObj = nowData.label;
        let itemStyleObj = nowData.itemStyle;
        if (labelObj.nodeName && itemStyleObj.nodeName) {
          labelList.push(labelObj);
          reactList.push(itemStyleObj);
          if (itemStyleObj.color === "") {
            itemStyleObj.color = null;
          }
        }
      });
      return {
        labelCustomList: labelList,
        itemStyleCustomList: reactList,
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
