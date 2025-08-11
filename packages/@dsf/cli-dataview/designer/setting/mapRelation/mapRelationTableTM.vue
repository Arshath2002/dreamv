<!--
 * @Description: 映射字段table的模板
 * @Author: shenah
 * @Date: 2023-05-19 16:07:36
 * @LastEditors: shenah
 * @LastEditTime: 2024-09-18 09:24:44
-->

<template>
  <div class="data-view-map-relation-table-wrap">
    <div class="header">
      <div>{{ title }}</div>
      <div class="btns" v-if="type === 'dynamic'">
        <el-button size="small" type="primary" @click="addOne">添加</el-button>
      </div>
    </div>
    <el-table
      ref="table"
      :data="optionsList"
      row-key="uuid"
      class="table"
      style="width: 100%; height: 100%"
      size="small"
      border
      :height="height"
    >
      <el-table-column :label="getLabel('text')">
        <template v-slot="scope">
          <template v-if="scope.row.textEdit">
            <SelectInput
              v-model="scope.row.text"
              :mapFieldList="mapFieldList"
            />
          </template>
          <template v-else>
            <span v-if="scope.row.require" class="red-point">*</span>
            {{ scope.row.text }}
          </template>
        </template>
      </el-table-column>
      <el-table-column label="映射字段">
        <template v-slot="scope">
          <SelectInput v-model="scope.row.map" :mapFieldList="mapFieldList" />
        </template>
      </el-table-column>
      <el-table-column label="附加名称" v-if="config.hasAttach" min-width="130">
        <template v-slot="scope">
          <el-input v-model="scope.row.attach"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="是否显示" v-if="config.hasAttach" min-width="130">
        <template v-slot="scope">
          <el-radio-group v-model="scope.row.show">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="90" v-if="type === 'dynamic'">
        <template v-slot="scope">
          <el-button size="small" @click="removeOne(scope)" type="danger">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import dataAnalysisOptionHelper from "../dataAnalysisOptionHelper.js";
export default {
  name: "mapRelationTableTM",
  mixins: [dataAnalysisOptionHelper],
  model: {
    prop: "value",
    event: "change",
  },
  props: {
    height: {
      type: String,
      default: "100%",
    },
    owner: {
      require: true,
    },
    config: {
      require: true,
    },
    value: {
      require: true,
    },
    title: {
      typeof: String,
      default: "",
    },
    tableColumn: {
      type: Object,
      default: () => ({}),
    },
    type: {
      type: String,
      default: "common",
    },
  },
  data() {
    return {
      colShowObjFlag: {
        showDigit: true,
      },
      optionsList: [],
    };
  },
  watch: {
    optionsList: {
      handler(val) {
        this.$emit("change", val);
      },
      deep: true,
    },
    value: {
      handler(val) {
        let hideDigitColFlag = false;
        val.forEach((item) => {
          if (!item.hideDigit) {
            hideDigitColFlag = true;
          }
        });
        this.colShowObjFlag.showDigit = hideDigitColFlag;
        this.optionsList = val;
      },
      immediate: true,
      deep: true,
    },
  },
  mounted() {},
  methods: {
    getLabel(field) {
      return this.tableColumn[field]?.name || "字段";
    },
    addOne() {
      let one = {
        text: "",
        value: "",
        map: "",
      };
      if (!this.colShowObjFlag.showDigit) {
        one.hideDigit = true;
      }
      if (this.type === "dynamic") {
        one.textEdit = true;
      }
      this.optionsList.push(one);
    },
    removeOne(scope) {
      dsf.array.remove(this.optionsList, scope.row);
    },
    clearMapFieldList() {
      this.$emit("clearMapFieldList");
    },
  },
};
</script>
<style lang="scss">
@import "_dataview/assets/styles/designer/mapRelationTableTM.scss";
</style>