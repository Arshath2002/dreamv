<!--
 * @Description: 通用规则配置(生成不同配置)
 * @Author: shenah
 * @Date: 2024-04-15 10:02:59
 * @LastEditors: shenah
 * @LastEditTime: 2025-01-16 14:36:24
-->

<template>
  <div class="des-dv-universal-rule-config">
    <!-- 规则列表 -->
    <template v-if="ruleList.length">
      <div class="rule-list-wrap">
        <dsf-virtual-scroll>
          <transition-group name="move-up-down">
            <div
              class="rule-value-item-all rule-value-item mb20"
              v-for="(item, index) in ruleList"
              :key="item.id"
            >
              <div class="label-text">触发规则{{ index + 1 }}：</div>
              <div class="content">
                <!-- 选择条件 -->
                <div class="condition-item-wrap">
                  <SelectInput
                    v-model="item.ruleConfig.field"
                    :mapFieldList="mapFieldList"
                    class="condition-item"
                    size="small"
                    placeholder="字段"
                  />
                  <el-select
                    v-model="item.ruleConfig.condition"
                    class="condition-item"
                    size="small"
                    placeholder="选择规则"
                  >
                    <el-option
                      v-for="item in conditionOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                  <el-input
                    size="small"
                    v-model="item.ruleConfig.diffValue"
                    class="condition-item large-width"
                    placeholder="值"
                  ></el-input>
                  <!-- 旧的规则展示 -->
                  <span v-if="item.ruleConfig.oldRule">
                    <span class="label-text">老版规则：</span>
                    <span>
                      {{ item.ruleConfig.oldRule }}
                    </span>
                    <el-tooltip>
                      <div slot="content">提示：如需修改，请重新选择字段、规则、值</div>
                      <dsf-button
                        title="疑问"
                        size="small"
                        btn-style="icon-text"
                        icon="yiwen"
                        style="margin-left: 5px;"
                      />
                    </el-tooltip>
                  </span>
                  <div class="content-btn-list">
                    <dsf-button
                      title="上移"
                      size="small"
                      btn-style="icon-text"
                      icon="shang"
                      @click="moveOne(ruleList,index,'up')"
                      v-if="index !== 0"
                    />
                    <dsf-button
                      title="下移"
                      size="small"
                      btn-style="icon-text"
                      icon="xia"
                      @click="moveOne(ruleList,index,'down')"
                      v-if="index !== ruleList.length - 1"
                    />
                    <dsf-button
                      title="删除"
                      size="small"
                      btn-style="icon-text"
                      icon="delete"
                      class="del-btn"
                      @click="delOne(index)"
                    />
                  </div>
                </div>
                <div class="rule-value-item aic">
                  <div class="label-text">类型：</div>
                  <el-radio-group
                    v-model="item.type"
                    size="small"
                    @change="(val) => typeChange(val, item)"
                  >
                    <el-radio-button
                      v-for="item in typeOptions"
                      :key="item.value"
                      :label="item.value"
                    >
                      {{ item.label }}
                    </el-radio-button>
                  </el-radio-group>
                </div>
                <RuleTypeItem
                  v-model="item.attr"
                  :typeOptions="typeOptions"
                  :row="item"
                  :key="item.attr.id"
                ></RuleTypeItem>
              </div>
            </div>
          </transition-group>
      
        </dsf-virtual-scroll>
      </div>
    </template>
    <dsf-empty-data v-else description="暂无规则" class="no-data" />
    <!-- 按钮列表 -->
    <div class="btn-list">
      <el-button size="small" type="text" icon="el-icon-plus" @click="addRule"> 新增触发规则 </el-button>
    </div>
  </div>
</template>
<script>
import SelectInput from "../graph/selectInput.vue";
import RuleTypeItem from "./ruleTypeItem.vue";
import { ruleTypeList, createDefaultRuleTypeConfig } from "_dataview/output/config/universalRuleConfig";
export default {
  name: "UniversalRuleConfig",
  components: {
    SelectInput,
    RuleTypeItem,
  },
  props: {
    config: {
      type: Object,
      required: true,
    },
    currentData: {
      type: Array,
      default: () => [],
    },
    owner: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      conditionOptions: [
        {
          label: "等于",
          value: "==",
        },
        {
          label: "不等于",
          value: "!=",
        },
        {
          label: "小于",
          value: "<",
        },
        {
          label: "小于等于",
          value: "<=",
        },
        {
          label: "大于",
          value: ">",
        },
        {
          label: "大于等于",
          value: ">=",
        },
        {
          label: "整除",
          value: "%",
        },
        {
          label: "不整除",
          value: "!%",
        },
      ],
      mapFieldList: [],
      typeOptions: [],
      ruleList: [],
    };
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
      // 下拉选
      this.mapFieldList = this.owner.$children[0].getDesignerMapFieldList();
      // 初始化显示的类型项
      if (this.config.typeOptions?.length) {
        this.typeOptions = this.config.typeOptions;
      } else {
        // 显示所有
        this.typeOptions = _.cloneDeep(ruleTypeList);
      }
      this.ruleList = _.cloneDeep(this.currentData || []);
      if (!this.ruleList.length) {
        this.addRule();
      }
    },
    addRule() {
      let type = this.typeOptions[0]?.value;
      let one = createDefaultRuleTypeConfig(type);
      this.ruleList.push(one);
    },
    delOne(index) {
      this.ruleList.splice(index, 1);
    },
    typeChange(val, row) {
      let attrObj = createDefaultRuleTypeConfig(val).attr;
      row.attr = attrObj;
      // this.$set(row, "attr", attrObj);
    },
    beforeRule() {
      let list = _.cloneDeep(this.ruleList);
      let newList = [];
      list.forEach((item) => {
        let ruleConfig = item.ruleConfig;
        if (ruleConfig.field && ruleConfig.condition) {
          ruleConfig.oldRule = "";
          let flag = this.judgeAttr(item);
          if (flag) {
            newList.push(item);
          }
        } else if (ruleConfig.oldRule) {
          // 采用旧的
          ruleConfig.field = "";
          ruleConfig.condition = "";
          ruleConfig.diffValue = "";
          let flag = this.judgeAttr(item);
          if (flag) {
            newList.push(item);
          }
        }
      });
      return newList;
    },
    judgeAttr(item) {
      let flag = false;
      let type = item.type;
      let attr = item.attr;
      if (type === "color" || type === "text") {
        flag = true;
      } else if (type === "image" && attr.image && dsf.dataview.utils.compatiblePathToExtendShowImg(attr.image)) {
        flag = true;
      } else if (type === "icon" && attr.icon) {
        flag = true;
      } else if (type === "moreColor" && attr.colorList?.length) {
        flag = true;
      }
      return flag;
    },
    moveOne(arr, index, direction) {
      let newArr = dsf.dataview.utils.moveOneArray(arr, index, direction);
      this.ruleList = newArr;
    },
    yes() {
      let list = this.beforeRule();
      return list;
    },
  },
};
</script>
<style lang="scss">
@import "_dataview/assets/styles/designer/DesDVUniversalRuleConfig.scss";
</style>
