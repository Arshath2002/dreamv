<!--
 * @Description: 提取动态组件
 * @Author: shenah
 * @Date: 2024-02-04 16:34:12
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-03-31 16:02:30
-->

<template>
  <div class="dynamic-field-style">
    <div class="header-title">
      {{ title }}
      <DsfButton @click="add" v-if="operateRights.extra" size="small"> 新增 </DsfButton>
    </div>
    <el-table ref="table" class="ds-table" :border="true" :data="tableData" row-key="uuid" height="100%">
      <el-table-column label="序号" width="70" :header-align="'center'" :align="'center'">
        <template v-slot:default="scope"> 指标{{ scope.$index + 1 }} </template>
      </el-table-column>
      <el-table-column v-for="item in dynamicConfigs" :key="item.key" :label="item.name" :header-align="'center'" :align="'center'">
        <template v-slot:default="scope">
          <el-input size="small" v-model="scope.row[item.key]" v-if="item.type === 'input'" @change="inputChange($event, scope.row, item)"></el-input>
          <div v-else-if="item.type === 'text'">
            {{ scope.row[item.key] }}
          </div>
          <SelectInput v-else-if="item.type === 'fieldInput'" v-model="scope.row[item.key]" :mapFieldList="mapFieldList" />
        </template>
      </el-table-column>
      <el-table-column v-if="isOperateBtn" label="操作" :header-align="'center'" :align="'center'" :width="120">
        <template v-slot:default="scope">
          <DsfButton v-if="operateRights.insert" :size="'small'" title="插入" icon="hao" btn-style="icon-text" style="min-width: auto; margin-left: 5px" @click="insert(scope)"></DsfButton>
          <DsfButton v-if="operateRights.del" :size="'small'" title="删除" icon="guanbi2" btn-style="icon-text" style="min-width: auto; margin-left: 5px" @click="deleted(scope)"></DsfButton>
          <DsfButton v-if="operateRights.up" :size="'small'" title="上移" icon="shang" btn-style="icon-text" style="min-width: auto; margin-left: 5px" @click="up(scope)"></DsfButton>
          <DsfButton v-if="operateRights.down" :size="'small'" title="下移" icon="xia" btn-style="icon-text" style="min-width: auto; margin-left: 5px" @click="down(scope)"></DsfButton>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { dynamicFieldConfigList, operateRights, componentDynamicFieldConfigList } from "./defaultConfig";
import SelectInput from "../graph/selectInput.vue";
import { createOneExpendStyle } from "_dataview/output/config/dynamicFieldConfig";
import { createOneKeyTrades } from "_dataview/output/dynamicFieldStyleSetting/keytrades";

export default {
  name: "DynamicFieldStyle",
  components: { SelectInput },
  props: {
    title: {
      type: String,
      default: "",
    },
    config: {
      type: Object,
    },
    owner: {
      type: Object,
    },
    mapFieldList: {
      type: Array,
    },
    currentData: {
      type: Object,
    },
  },
  computed: {
    isOperateBtn() {
      return Object.values(this.operateRights).some(Boolean);
    },
    hasExpend() {
      return this.dynamicConfigs.some((item) => item.expand === "expand");
    },
  },
  data() {
    return {
      isHasDynamicConfigs: false,
      isHasOperateRights: false,
      originOperateRights: [],
      originDynamicConfigs: [],
      dynamicConfigs: [],
      operateRights: {},
      isDynamicMixins: false,
      tableData: [],
    };
  },
  created() {
    this.initConfig();
    this.initData();
  },
  methods: {
    initConfig() {
      // 初始化配置
      let isDynamicMixins = this.currentData.isDynamicMixins;
      let dynamic = componentDynamicFieldConfigList[this.config.componentType]; // 根据配置设置表格的
      let operate = this.currentData.operateRights;
      if (Array.isArray(dynamic)) {
        this.originDynamicConfigs = _.cloneDeep(dynamic);
        if (isDynamicMixins) {
          dynamic = [...dynamicFieldConfigList, ...dynamic];
        }
        this.isHasDynamicConfigs = true;
      } else {
        this.isHasDynamicConfigs = false;
        dynamic = dynamicFieldConfigList;
      }
      if (operate && typeof operate === "object") {
        this.isHasOperateRights = true;
        this.originOperateRights = _.cloneDeep(operate);
        operate = {
          ...operateRights,
          ...operate,
        };
      } else {
        this.isHasOperateRights = false;
        operate = operateRights;
      }
      this.dynamicConfigs = dynamic;
      this.operateRights = operate;
      this.isDynamicMixins = isDynamicMixins;
    },
    initData() {
      const { attachArr } = this.currentData;
      this.tableData = attachArr;
    },
    createOne() {
      let obj = this.dynamicCreateForm(this.dynamicConfigs);
      if (this.hasExpend) {
        obj.style = createOneExpendStyle();
      }
      if (this.config.componentType === "keytrades") {
        obj = createOneKeyTrades();
      }
      return obj;
    },
    dynamicCreateForm(arr) {
      // 动态生成form
      let obj = {
        uuid: dsf.uuid(),
      };
      arr.forEach((item) => {
        let defaultValue = "";
        if (item.type === "color") {
          defaultValue = null;
        } else if (["ruleColor", "ruleIcon"].indexOf(item.type) > -1) {
          defaultValue = {
            defaultValue: "",
            ruleList: [],
          };
        } else if (["prefix"].indexOf(item.type) > -1) {
          defaultValue = {
            defaultValue: "",
            selectType: "icon",
            ruleList: [],
          };
        } else if (item.type === "rule") {
          item.key.split(",").forEach((key) => {
            obj[key] = {
              defaultValue: "",
              ruleList: [],
            };
          });
        } else if (item.type === "layoutMethods") {
          defaultValue = 24;
        }
        obj[item.key] = defaultValue;
      });
      return obj;
    },
    // 根据主题色来映射对应的字段
    handleThemeOne(one) {
      return new Promise((resolve) => {
        // 根据主题色来增加
        let vm = this.owner.$children[0];
        let designerVm = vm.$designer;
        if (vm && designerVm) {
          const theme =  designerVm.getTheme();
          if (theme && this.config.componentType === "keytrades") {
            let nowStyleConfig = theme.style.dataviewKeyTrades;
            let nameColor = nowStyleConfig.attachObj.nameColor;
            let valueColor = nowStyleConfig.attachObj.valueColor;
            let unitColor = nowStyleConfig.attachObj.unitColor;
            // 名称
            one.nameColor = nameColor;
            one.style.nameColor = nameColor;
            one.style.valueColor = valueColor;
            if (one.style.digitalWholeConfig) {
              one.style.digitalWholeConfig.color = valueColor;
            }
            // 单位
            one.style.unitColor = unitColor;
          }
          resolve(one);
        } else {
          resolve(one);
        }
      });
    },
    add() {
      let one = this.createOne();
      this.handleThemeOne(one).then(() => {
        this.tableData.push(one);
      });
    },
    inputChange(val, row, attachItem) {
      if (row.style) {
        let key = attachItem.key;
        if (key === "nameFontSize") {
          row.style[key] = row[key];
        } else if (key === "valueFontSize") {
          row.style[key] = row[key];
          if (row.style.digitalWholeConfig) {
            row.style.digitalWholeConfig.fontSize = row[key];
          }
        }
      }
    },
    colorChange(val, row, attachItem) {
      if (row.style) {
        let key = attachItem.key;
        if (["nameColor"].indexOf(key) > -1) {
          row.style[key] = row[key];
          if (row.nameColorObj) {
            row.nameColorObj.defaultValue = row[key];
          }
        }
      }
    },
    expendStyleItemChange(val, row) {
      // 同时改变名称、值 颜色以及字号
      row.nameFontSize = val.nameFontSize;
      row.nameColor = val.nameColor;
      if (row.nameColorObj) {
        row.nameColorObj.defaultValue = val.nameColor;
      }
      row.valueFontSize = val.valueFontSize;
      row.valueColorObj = {
        ...row.valueColorObj,
        defaultValue: val.valueColor,
      };
    },
    handlePrefixSuffix(val, row, fieldRow) {
      row[fieldRow.key] = {
        defaultValue: "",
        selectType: val,
        ruleList: [],
      };
    },
    insert(scope) {
      // 插入
      let one = this.createOne();
      this.handleThemeOne(one).then((one) => {
        this.tableData.splice(scope.$index + 1, 0, one);
      });
    },
    deleted(scope) {
      dsf.array.remove(this.tableData, scope.row);
    },
    up(scope) {
      if (scope.$index > 0) {
        let curr = this.tableData[scope.$index];
        let currIndex = scope.$index;
        dsf.array.remove(this.tableData, curr);
        this.tableData.splice(currIndex - 1, 0, curr);
      }
    },
    down(scope) {
      if (this.tableData.length - 1 > scope.$index) {
        let curr = this.tableData[scope.$index];
        let currIndex = scope.$index;
        dsf.array.remove(this.tableData, curr);
        this.tableData.splice(currIndex + 1, 0, curr);
      }
    },
    findMustList(list) {
      return list.filter((item) => item.title || item.field);
    },
    getDynamicFieldStyleObj() {
      let obj = {
        attachArr: this.tableData,
      };
      this.tableData = this.findMustList(this.tableData);
      if (this.isHasDynamicConfigs) {
        obj.dynamicConfigs = this.originDynamicConfigs;
      }
      if (this.isHasOperateRights) {
        obj.operateRights = this.originOperateRights;
      }
      if (this.isDynamicMixins) {
        obj.isDynamicMixins = this.isDynamicMixins;
      }
      return obj;
    },
  },
};
</script>
