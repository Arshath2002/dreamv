<template>
  <el-container>
    <el-header>
      <div style="text-align: right; height: auto; margin: 0px -20px">
        <DsfButton @click="add">新增</DsfButton>
      </div>
    </el-header>
    <el-main style="padding: 0px">
      <el-table :data="tableData" border>
        <el-table-column :prop="'code'" :label="'字段名'">
          <template v-slot:default="scope">
            <SelectInput
              v-model="scope.row.valueName"
              :mapFieldList="ownerMapFieldList"
            />
          </template>
        </el-table-column>
        <el-table-column :prop="'rule'" :label="'筛选规则'" width="160px">
          <template v-slot:default="scope">
            <el-select
              @change="changeRule(scope.row)"
              v-model="scope.row.rule"
              size="small"
            >
              <el-option
                v-for="item in ruleOptions"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column :prop="'threshold'" :label="'规则阈值'">
          <template v-slot:default="scope">
            <el-input size="small" v-model="scope.row.threshold"></el-input>
          </template>
        </el-table-column>
        <el-table-column :prop="'indent'" :label="'缩进值'">
          <template v-slot:default="scope">
            <el-input size="small" v-model="scope.row.indent"></el-input>
          </template>
        </el-table-column>
        <el-table-column :label="'操作'" width="80px">
          <template v-slot:default="scope">
            <el-link type="primary" @click="remove(scope.row)">删除</el-link>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>
</template>
<script>
import SelectInput from "./graph/selectInput.vue";
export default {
  name: "TableIndentSetting",
  mixins: [$mixins.propertyDialogSetting],
  props: {
    mapFieldList: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  components: {
    SelectInput,
  },
  computed: {
    ownerMapFieldList() {
      return [{ name: "行数", value: "index" }, ...this.mapFieldList];
    },
  },
  data() {
    return {
      ruleOptions: [
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
          label: "模糊匹配",
          value: "involve",
        },
        {
          label: "不为空",
          value: "notEmpty",
        },
      ],
      tableData: [],
    };
  },
  created() {
    let indentRules = this.currentData;
    this.tableData = _.cloneDeep(indentRules);
  },
  methods: {
    add() {
      this.tableData.push({
        //规则名
        rule: "equalTo",
        //规则字段
        valueName: "",
        //规则值
        threshold: "",
        //规则缩进值
        indent: "",
      });
    },
    changeRule(row) {
      row.threshold = "";
      row.indent = "";
    },
    remove(row) {
      let index = this.tableData.findIndex((ite) => ite === row);
      if (index >= 0) {
        this.tableData.splice(index, 1);
      }
    },
    yes() {
      return this.tableData || [];
    },
  },
};
</script>
