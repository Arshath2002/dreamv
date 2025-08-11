<template>
  <div class="des-dv-data-font-style-rules des-dv-universal-rule-config">
    <!-- 规则列表 -->
    <template v-if="tableData.length">
      <div class="rule-list-wrap">
        <dsf-virtual-scroll>
          <transition-group name="move-up-down">
            <div class="rule-value-item-all rule-value-item mb20" v-for="(item, index) in tableData" :key="item.uuid">
              <div class="label-text">触发规则{{ index + 1 }}：</div>
              <div class="content">
                <!-- 选择条件 -->
                <div class="condition-item-wrap">
                  <SelectInput v-model="item.valueName" :mapFieldList="filterMapFieldList" class="condition-item" size="small" placeholder="字段" />
                  <el-select v-model="item.rule" @change="changeRule(item)" class="condition-item" size="small" placeholder="选择规则">
                    <el-option v-for="one in ruleOptions" :key="one.value" :label="one.label" :value="one.value"></el-option>
                  </el-select>
                  <el-input v-if="item.rule !== 'none' && item.rule !== 'notEmpty'" size="small" v-model="item.threshold" class="condition-item large-width"> </el-input>
                  <div class="content-btn-list">
                    <dsf-button title="上移" size="small" btn-style="icon-text" icon="shang" @click="moveOne(tableData, index, 'up')" v-if="index !== 0" />
                    <dsf-button title="下移" size="small" btn-style="icon-text" icon="xia" @click="moveOne(tableData, index, 'down')" v-if="index !== tableData.length - 1" />
                    <dsf-button title="删除" size="small" btn-style="icon-text" icon="delete" class="del-btn" @click="remove(item)" />
                  </div>
                </div>
                <!-- 样式 -->
                <div class="text-style-item rule-value-item">
                  <div class="label-text">样式：</div>
                  <DesDVTextStyle
                    style="width: 240px"
                    v-model="item.style"
                    :config="{
                      picker: {
                        type: 'color',
                      },
                      isShowShadow: false,
                    }"
                  ></DesDVTextStyle>
                </div>
              </div>
            </div>
          </transition-group>
        </dsf-virtual-scroll>
      </div>
    </template>
    <dsf-empty-data v-else description="暂无规则" class="no-data" />
    <!-- 按钮列表 -->
    <div class="btn-list">
      <el-button size="small" type="text" icon="el-icon-plus" @click="add"> 新增触发规则 </el-button>
    </div>
  </div>
</template>
<script>
import SelectInput from "./graph/selectInput.vue";
import { createFieldFontStyleRules } from "_dataview/output/config/commonConfig";
export default {
  name: "DesDVDataFontStyleRules",
  mixins: [$mixins.propertyDialogSetting],
  props: {
    rules: {
      type: Array,
      default() {
        return [];
      },
    },
    mapFieldList: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  components: { SelectInput },
  computed: {
    fontFamilyList() {
      return dsf.dataview.designer.fonts;
    },
    filterMapFieldList() {
      const mapFieldList = this.owner ? this.owner.$children[0].getDesignerMapFieldList() : this.mapFieldList;
      return _.uniqBy(mapFieldList, "value");
    },
  },
  data() {
    return {
      tableData: [],
      //规则
      ruleOptions: [
        {
          label: "无规则",
          value: "none",
        },
        {
          label: "等于",
          value: "equalTo",
        },
        {
          label: "不等于",
          value: "notEqualTo",
        },
        {
          label: "小于",
          value: "lessThan",
        },
        {
          label: "小于等于",
          value: "lessThanOrEqual",
        },
        {
          label: "大于",
          value: "greaterThan",
        },
        {
          label: "大于等于",
          value: "greaterThanOrEqual",
        },
        {
          label: "开头匹配",
          value: "start",
        },
        {
          label: "结尾匹配",
          value: "last",
        },
        {
          label: "模糊匹配",
          value: "involve",
        },
        {
          label: "不为空",
          value: "notEmpty",
        },
      ],
    };
  },
  created() {
    console.log("owner", this.owner, this.currentData);
    const currentData = this.currentData ? this.currentData : this.rules;
    let rules = currentData.map((item) => ({
      ...item,
      uuid: item.uuid || dsf.uuid(),
    }));

    this.tableData = dsf.mix(true, [], rules);
    if (!this.tableData.length) {
      this.add();
    }
  },
  methods: {
    add() {
      const rule = createFieldFontStyleRules();
      this.tableData.push(rule);
    },
    changeRule(row) {
      row.threshold = "";
    },
    remove(row) {
      let index = this.tableData.findIndex((ite) => ite === row);
      if (index >= 0) {
        this.tableData.splice(index, 1);
      }
    },
    moveOne(arr, index, direction) {
      let newArr = dsf.dataview.utils.moveOneArray(arr, index, direction);
      this.tableData = newArr;
    },
    yes() {
      return this.tableData || [];
    },
  },
};
</script>
<style lang="scss">
@import "_dataview/assets/styles/designer/DesDVDataFontStyleRules.scss";
</style>
