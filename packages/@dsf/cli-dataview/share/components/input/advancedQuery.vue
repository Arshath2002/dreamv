<!--
 * @Description: 
 * @Author: zhanghang
 * @Date: 2024-01-19 10:44:29
 * @LastEditors: shenah
 * @LastEditTime: 2025-02-14 14:10:43
-->
<template>
  <div
    class="dv-advanced-query-wrapper data-view-select-theme data-view-item-wrap data-view-no-padding ds-control data-view-common-bg-effect"
    :style="controlOuterStyle"
  >
    <el-form :label-position="labelPosition" :inline="true" :label-width="labelWidth" :size="size" class="query-form" :style="queryFormStyle">
      <el-row>
        <el-col :span="item.performanceItem.layout * 1" v-for="(item, index) in formItems" :key="index">
          <!-- 文本框 -->
          <template v-if="item.fieldItem.fieldType === 'text'">
            <el-form-item :label="item.performanceItem.label">
              <div class="advanced-input-wrapper">
                <el-select
                  class="operation-select-input"
                  v-if="item.performanceItem.showOperation"
                  :size="size"
                  v-model="variable[item._id].op"
                  :popper-class="`data-view-select-theme__popper ${themeStyleName}`"
                >
                  <el-option :value="it.value" :label="it.label" v-for="(it, index) in getOperateSymbol(item)" :key="index"></el-option>
                </el-select>
                <el-input :placeholder="item.performanceItem.placeholder" :size="size" v-model="variable[item._id].value" clearable></el-input>
              </div>
            </el-form-item>
          </template>
          <!-- 数字 -->
          <template v-if="item.fieldItem.fieldType === 'number'">
            <el-form-item :label="item.performanceItem.label">
              <div class="advanced-input-wrapper">
                <el-select
                  class="operation-select-input"
                  v-if="item.performanceItem.showOperation"
                  :size="size"
                  @change="changeTextArray($event, item._id)"
                  v-model="variable[item._id].op"
                  :popper-class="`data-view-select-theme__popper ${themeStyleName}`"
                >
                  <el-option :value="it.value" :label="it.label" v-for="(it, index) in getOperateSymbol(item)" :key="index"></el-option>
                </el-select>
                <div class="number-range" v-if="variable[item._id].op === 'B'">
                  <el-input @input="inputHandle(0, item._id)" v-model.trim="variable[item._id].value[0]" :placeholder="separatePlaceHolder(item, 0)" :size="size" clearable></el-input>
                  <span class="separate-span">至</span>
                  <el-input @input="inputHandle(1, item._id)" v-model.trim="variable[item._id].value[1]" :placeholder="separatePlaceHolder(item)" :size="size" clearable></el-input>
                </div>
                <el-input v-else @input="inputHandle(undefined, item._id)" :placeholder="item.performanceItem.placeholder" :size="size" v-model.trim="variable[item._id].value" clearable></el-input>
              </div>
            </el-form-item>
          </template>
          <!-- 枚举类型 -->
          <template v-if="item.fieldItem.fieldType === 'enum'">
            <el-form-item :label="item.performanceItem.label">
              <!-- 下拉框形式 -->
              <template v-if="item.performanceItem.performance === 'select'">
                <el-select :size="size" :multiple="item.fieldItem.op !== 'E'" v-model="variable[item._id].value" :popper-class="`data-view-select-theme__popper ${themeStyleName}`" clearable>
                  <el-option :value="it.value" :label="it.text" v-for="(it, index) in getItems(item)" :key="index"></el-option>
                </el-select>
              </template>

              <!-- 选择块 -->
              <template v-if="item.performanceItem.performance === 'selectBox'">
                <div
                  :size="size"
                  class="el-tab-wrapper query-tab-box"
                  :class="{ 'has-collapse': item.performanceItem.hasCollapse }"
                  :style="{
                    height: !item.performanceItem.hasCollapse || item.performanceItem.isExtend ? 'auto' : getTabHeight,
                  }"
                >
                  <div class="tag-wrapper">
                    <el-tag @click="selectCheck(item, it.value)" :size="size" v-for="it in getItems(item)" :key="it.value" :class="isSelected(item, it.value)">
                      {{ it.text }}
                    </el-tag>
                  </div>
                </div>
                <div v-if="item.performanceItem.hasCollapse" @click="changeExtend(item)" class="extend-btn">
                  <DsfIcon v-if="item.performanceItem.isExtend" name="shang1" />
                  <DsfIcon v-else name="xia1" />
                </div>
              </template>
            </el-form-item>
          </template>
          <!-- 日期类型 -->
          <template v-if="item.fieldItem.fieldType === 'date'">
            <el-form-item :label="item.performanceItem.label">
              <!-- 年月日时分秒 -->
              <template v-if="item.performanceItem.performance === 'ymds'">
                <div class="el-tab-wrapper">
                  <el-date-picker
                    v-if="item.fieldItem.op !== 'B'"
                    :size="size"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    v-model="variable[item._id].value"
                    :placeholder="item.performanceItem.placeholder"
                    :popper-class="`data-view-select-theme__popper ${themeStyleName}`"
                    type="datetime"
                  ></el-date-picker>
                  <el-date-picker
                    v-else
                    :size="size"
                    range-separator="至"
                    v-model="variable[item._id].value"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :start-placeholder="separatePlaceHolder(item, 0)"
                    :end-placeholder="separatePlaceHolder(item, 1)"
                    :popper-class="`data-view-select-theme__popper ${themeStyleName}`"
                    type="datetimerange"
                  ></el-date-picker>
                </div>
              </template>
              <!-- 年月日 -->
              <template v-if="item.performanceItem.performance === 'ymd'">
                <div class="el-tab-wrapper">
                  <el-date-picker
                    v-if="item.fieldItem.op !== 'B'"
                    :size="size"
                    value-format="yyyy-MM-dd"
                    v-model="variable[item._id].value"
                    :placeholder="item.performanceItem.placeholder"
                    :popper-class="`data-view-select-theme__popper ${themeStyleName}`"
                    type="date"
                  ></el-date-picker>
                  <el-date-picker
                    v-else
                    :size="size"
                    range-separator="至"
                    v-model="variable[item._id].value"
                    value-format="yyyy-MM-dd"
                    :start-placeholder="separatePlaceHolder(item, 0)"
                    :end-placeholder="separatePlaceHolder(item, 1)"
                    :popper-class="`data-view-select-theme__popper ${themeStyleName}`"
                    type="daterange"
                  ></el-date-picker>
                </div>
              </template>
              <!-- 年月 -->
              <template v-if="item.performanceItem.performance === 'ym'">
                <div class="el-tab-wrapper">
                  <el-date-picker
                    v-if="item.fieldItem.op !== 'B'"
                    :size="size"
                    value-format="yyyy-MM"
                    :placeholder="item.performanceItem.placeholder"
                    v-model="variable[item._id].value"
                    :popper-class="`data-view-select-theme__popper ${themeStyleName}`"
                    type="month"
                  ></el-date-picker>
                  <el-date-picker
                    v-else
                    :size="size"
                    range-separator="至"
                    v-model="variable[item._id].value"
                    value-format="yyyy-MM"
                    type="monthrange"
                    :start-placeholder="separatePlaceHolder(item, 0)"
                    :end-placeholder="separatePlaceHolder(item, 1)"
                    :popper-class="`data-view-select-theme__popper ${themeStyleName}`"
                  ></el-date-picker>
                </div>
              </template>
              <!-- 年 -->
              <template v-if="item.performanceItem.performance === 'y'">
                <div class="el-tab-wrapper">
                  <el-date-picker
                    v-if="item.fieldItem.op !== 'B'"
                    :size="size"
                    value-format="yyyy"
                    v-model="variable[item._id].value"
                    :popper-class="`data-view-select-theme__popper ${themeStyleName}`"
                    type="year"
                  ></el-date-picker>
                  <el-date-picker
                    v-else
                    :size="size"
                    range-separator="至"
                    v-model="variable[item._id].value"
                    value-format="yyyy"
                    :placeholder="item.performanceItem.placeholder"
                    :start-placeholder="separatePlaceHolder(item, 0)"
                    :end-placeholder="separatePlaceHolder(item, 1)"
                    :popper-class="`data-view-select-theme__popper ${themeStyleName}`"
                    type="yearrange"
                  ></el-date-picker>
                </div>
              </template>
            </el-form-item>
          </template>
          <!-- 季月年类型 -->
          <template v-if="item.fieldItem.fieldType === 'period'">
            <el-form-item :label="item.performanceItem.label">
              <DsfSuperSearchPeriod
                :values.sync="variable[item._id].value"
                :chooseType="item.performanceItem.performance.toUpperCase()"
                :is-range="item.fieldItem.op === 'B' ? true : false"
                :item="{ placeholder: item.performanceItem.placeholder }"
                :popper-class="`data-view-select-theme__popper ${themeStyleName}`"
                clearable
              ></DsfSuperSearchPeriod>
            </el-form-item>
          </template>
        </el-col>
        <!-- 按钮组 -->
        <el-col v-if="hasBtn" :span="btnLayout * 1">
          <el-form-item>
            <label class="el-form-item__label" :style="{ width: labelWidth }"></label>
            <el-button v-if="hasBtn" class="query-btn" :size="size" @click="getQuery">
              {{ queryBtnText }}
            </el-button>
            <el-button class="reset-btn" v-if="hasResetBtn" :size="size" @click="resetQuery">
              {{ resetBtnText }}
            </el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import { dataTypes, operationTypes } from "./advancedQueryTypes.js";
import defaultBackground from "_dataview/share/components/common/backgroundDefault.js";
const defaultItem = {
  //该字段表现对象
  performanceItem: {
    isExtend: false, //收起咱开按钮
    hasCollapse: false, //是否折叠
    performance: "textbox", //显示方式
    showOperation: false, //是否显示操作符
    layout: "12", //布局
    placeholder: "", //提示
    label: "", //名称
    formatter: "", //格式化 给时间格式预留字段
    defaultValue: "", //默认值
  },
  //字段条件对象 用来组装condition
  fieldItem: {
    //值
    value: "",
    //字段对应-大屏字段
    field: [""],
    //操作符
    op: "E",
    //字段类型
    fieldType: "text",
  },
  //数据来源配置
  dataSourceSetting: {
    //数据源名称映射字段
    textMap: "",
    //数据源值映射字段
    valueMap: "",
  },
  //数据来源配置-只考虑字典和静态
  source: {
    activeName: "static",
    values: {
      static: [],
      dict: { key: null, node: null },
      dbsource: { key: null, node: null },
    },
  },
  //附加
  attach: {},
};
import theme from "_dataview/mixins/moreThemeMixin.js";
import { createCommonTextStyle } from "_dataview/output/config/commonConfig";
export default dsf.component({
  name: "DsfDataViewAdvancedQuery",
  ctrlCaption: "高级查询",
  mixins: [$mixins.dataView, theme],
  props: {
    padding: {
      type: Array,
      default: () => [8, 6, 8, 6],
    },
    // 风格
    styleMapKey: {
      type: String,
      default: "advancedQuery",
    },
    //表单组件大小
    size: {
      type: String,
      default: "small",
    },
    labelStyle: {
      type: Object,
      default: () =>
        createCommonTextStyle({
          fontSize: "16",
        }),
    },
    //标签宽度
    labelWidth: {
      type: String,
      default: "80px",
    },
    //标签的对齐方式
    labelPosition: {
      type: String,
      default: "right",
    },
    //查询按钮
    hasBtn: {
      type: Boolean,
      default: true,
    },
    height: {
      type: String,
      default: "auto",
    },
    inputHeight: {
      type: String,
      default: "40px",
    },
    //重置按钮
    hasResetBtn: {
      type: Boolean,
      default: false,
    },
    queryBtnText: {
      type: String,
      default: "查询",
    },
    resetBtnText: {
      type: String,
      default: "重置",
    },
    //按钮组布局
    btnLayout: {
      type: String,
      default: "24",
    },
    //触发方式-按钮触发
    trigger: {
      type: String,
      default: "btn",
    },
    //表单组件
    formItems: {
      type: Array,
      default() {
        return [];
      },
    },
    //绑定的查询的组件
    bindComponents: {
      type: Object,
      default() {
        return {};
      },
    },
    // 整体背景
    controlBackgroundConfig: {
      type: Object,
      default() {
        return { ...defaultBackground };
      },
    },
  },
  data() {
    return {
      componentType: "advancedQuery",
      debounceTimer: null,
      dataTypes,
      operationTypes,
      defaultItem,
      realFormItems: [],
      //变量空间
      variable: {},
      //枚举选项
      items: {},
    };
  },
  created() {
    this.initVariable();
  },
  computed: {
    getTabHeight() {
      return this.size === "large" ? "38px" : "32px";
    },
    queryFormStyle() {
      let textStyle = dsf.dataview.utils.transformTextStyle(this.labelStyle);
      let style = {
        height: dsf.dataview.utils.transformPx(this.inputHeight),
      };
      Object.keys(textStyle).forEach((key) => {
        style[`--label-${key}`] = textStyle[key];
      });
      return style;
    },
  },
  watch: {
    formItems: {
      handler() {
        if (this.isDesign) {
          this.initVariable();
        }
      },
      deep: true,
    },
    variable: {
      handler() {
        if (!this.isDesign && this.trigger === "auto") {
          clearTimeout(this.debounceTimer);
          this.debounceTimer = setTimeout(() => {
            this.getQuery();
          }, 500);
        }
      },
      deep: true,
    },
  },
  methods: {
    // 复制组件样式
    copyComponentStyle() {
      return {
        _props: this.getComponentStyle(),
        // 固定为数组格式，按主、次顺序
        textStyles: [this.labelStyle],
        backgrounds: [this.controlBackgroundConfig],
      };
    },
    // 粘贴组件样式
    pasteComponentStyle(config) {
      let groups = this.$designer.attributesGroup.filter(it => !/数据|属性|插槽/.test(it.name));
      if (config._props.ctrlName !== this.ctrlName) {
        groups = groups.filter(it => /布局|边框设置|背景|入场动画/.test(it.name));
        const { textStyles = [], backgrounds = [] } = config;
        this.updateComponentStyle("labelStyle", textStyles[0]);
        this.updateComponentStyle("controlBackgroundConfig", backgrounds[0]);
      }
      this.setComponentStyle(groups, config._props);
    },
    //构建查询数据
    establishQueryData() {
      const comps = this.bindComponents;
      const res = {};
      Object.keys(comps).forEach((key) => {
        const query = {};
        const conditions = comps[key].conditions;
        conditions.forEach((it) => {
          if (this.variable[it._id]) {
            const value = this.variable[it._id].value;
            //取修改过后的字段
            const fields = it.field.split(",");
            fields.forEach((field) => {
              // Array.isArray(value) ? value : [value];
              query[field] = value;
            });
          }
        });

        res[key] = query;
      });
      return res;
    },
    // 构造组件附加查询条件
    establishQueryConditions() {
      const comps = this.bindComponents;
      const res = {};
      //映射接口数据类型
      const typeMap = new Map([
        ["text", "string"],
        ["number", "number"],
        ["enum", "string"],
        ["date", "date"],
        ["period", "date"],
      ]);
      Object.keys(comps).forEach((key) => {
        //默认逻辑与
        const result = {
          logic: "and",
          items: [],
        };
        const conditions = comps[key].conditions;
        conditions.forEach((it) => {
          if (this.variable[it._id]) {
            const value = this.variable[it._id].value;
            const op = this.variable[it._id].op;
            //取修改过后的字段
            const fields = it.field.split(",");
            const fieldType = this.variable[it._id].fieldType;
            const targets = [];
            fields.forEach((field) => {
              targets.push({
                name: field,
                type: typeMap.get(fieldType),
              });
            });
            let condition = {
              value,
              targets,
              op,
            };

            result.items.push(condition);
          }
        });

        res[key] = [result];
      });
      return res;
    },
    initVariable() {
      //构造
      this.formItems.forEach((item) => {
        const _id = item._id;
        const fieldItem = dsf.mix(true, {}, item.fieldItem);
        //设置默认值
        const value = item.performanceItem.defaultValue;
        const op = fieldItem.op;
        if (op === "B") {
          fieldItem.value = [value.split(",")[0], value.split(",")[1] || ""];
        } else {
          fieldItem.value = value;
        }

        this.$set(this.variable, _id, dsf.mix(true, {}, fieldItem));

        //枚举选项-获取选项
        if (item.fieldItem.fieldType === "enum") {
          const activeName = item.source.activeName;
          const values = item.source.values;
          switch (activeName) {
            case "dict":
              let id = values.dict.key;
              this.dictItems(id);
              break;
            case "dbsource":
              let key = values.dbsource.key;
              this.dbSourceItems(key, item.dataSourceSetting);
              break;
          }
        }
      });
    },
    //获取枚举选项
    getItems(item) {
      let activeName = item.source.activeName;
      let values = item.source.values;
      let options = [];
      switch (activeName) {
        case "static":
          options = values.static;
          break;
        case "dict":
          options = this.items[values.dict.key] || [];
          break;
        case "dbsource":
          options = this.items[values.dbsource.key] || [];
          break;
      }
      return options;
    },
    inputHandle(index, field) {
      if (dsf.isDef(index)) {
        this.$set(this.variable[field].value, index, this.clearNoNumber(this.variable[field].value[index]));
      } else {
        this.variable[field].value = this.clearNoNumber(this.variable[field].value);
      }
    },
    clearNoNumber(v) {
      v = v.replace(/^\.+|[^\d.]/g, (s1) => {
        if (s1 == "-") {
          return s1;
        }
        return "";
      });
      return v;
    },
    //切换搜索和收起
    changeExtend(item) {
      let extend = Boolean(!item.performanceItem.isExtend);
      this.$set(item.performanceItem, "isExtend", extend);
    },
    //切换数组和文本值
    changeTextArray(op, field) {
      const value = this.variable[field].value;
      if (op === "B") {
        this.variable[field].value = [value, value];
      } else {
        this.variable[field].value = Array.isArray(value) ? value[0] : value;
      }
    },
    //获取字典数据
    dictItems(id) {
      const url = dsf.url.getWebPath(`dict/getList/${id}`, $$webRoot.platform);
      this.$http.get(url).done((data) => {
        if (data.success) {
          this.$set(this.items, id, data.data);
        } else {
          dsf.layer.message("请求异常！", false);
        }
      });
    },
    //获取数据源数据
    dbSourceItems(rmId, item) {
      const dbSourceURL =  dsf.url.getWebPath("meta/tree/dbSource", $$webRoot.platform);
      this.$http
        .get(dbSourceURL, {
          rmId,
        })
        .done((data) => {
          if (data.success) {
            let text = item.textMap || "text";
            let value = item.valueMap || "value";
            const list = data.data.map((it) => {
              return {
                text: it[text],
                value: it[value],
              };
            });
            this.$set(this.items, rmId, list);
          } else {
            dsf.layer.message("请求异常！", false);
          }
        });
    },
    //获取数据类型的操作符号
    getOperateSymbol(row) {
      let fieldType = row.fieldItem.fieldType;
      let options = [];
      switch (fieldType) {
        case "text":
          options = this.operationTypes.get("text");
          break;
        case "number":
          options = this.operationTypes.get("number");
          break;
        case "enum":
          options = this.operationTypes.get("enum");
          break;
        case "date":
          options = this.operationTypes.get("date");
          break;
        case "datetime":
          options = this.operationTypes.get("date");
          break;
        case "period":
          options = this.operationTypes.get("date");
          break;
      }
      return options;
    },
    //触发查询
    getQuery() {
      if (this.isDesign) return false;
      let conditions = this.establishQueryConditions();
      if (this.$page && this.$page.$parent) {
        let page = this.$page.$parent;
        Object.keys(conditions).forEach((ref) => {
          const vm = page.$refs[ref];
          vm && dsf.emit.$emit("advancedQuery", conditions[ref], [vm]);
        });
      }
    },
    //重置
    resetQuery() {
      if (this.isDesign) return false;
      Object.keys(this.variable).forEach((key) => {
        const item = this.variable[key];
        if (item.op === "B") {
          item.value = ["", ""];
        } else {
          item.value = "";
        }
      });
    },
    selectCheck(item, value) {
      if (item.fieldItem.op == "E") {
        if (this.variable[item._id].value === value) {
          this.variable[item._id].value = "";
        } else {
          this.variable[item._id].value = value;
        }
        return false;
      }
      if (!this.variable[item._id].value) {
        this.variable[item._id].value = [];
      }
      let index = this.variable[item._id].value.findIndex((it) => it === value);
      if (~index) {
        this.variable[item._id].value.splice(index, 1);
      } else {
        this.variable[item._id].value.push(value);
      }
    },
    isSelected(item, value) {
      return this.variable[item._id].value.includes(value) ? "active" : "plain";
    },
    separatePlaceHolder(item, index) {
      let holders = item.performanceItem.placeholder.split(",");
      return holders[index] || holders[0];
    },
  },
});
</script>
<style lang="scss">
@import "_dataview/assets/styles/share/components/advancedQuery.scss";
</style>
