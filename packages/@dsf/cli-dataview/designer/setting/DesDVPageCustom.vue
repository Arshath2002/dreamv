<!--
 * @Description: 分页自定义
 * @Author: shenah
 * @Date: 2024-02-02 17:29:54
 * @LastEditors: shenah
 * @LastEditTime: 2024-02-04 10:28:25
-->

<template>
  <div class="data-view-setting-page-custom">
    <el-table
      ref="table"
      :border="true"
      :data="tableList"
      row-key="value"
    >
      <el-table-column
        label="按钮名称"
        prop="name"
        header-align="center"
        align="center"
      >
      </el-table-column>
      <el-table-column
        label="显示"
        header-align="center"
        align="center"
      >
        <template v-slot:default="scope">
          <el-radio-group v-model="scope.row.show">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        header-align="center"
        align="center"
      >
        <template v-slot:default="scope">
          <DsfButton
            :size="'small'"
            title="上移"
            icon="shang"
            btn-style="icon-text"
            style="min-width: auto; margin-left: 5px"
            @click="up(scope)"
          ></DsfButton>
          <DsfButton
            :size="'small'"
            title="下移"
            icon="xia"
            btn-style="icon-text"
            style="min-width: auto; margin-left: 5px"
            @click="down(scope)"
          ></DsfButton>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  name: "DesDVPageCustom",
  mixins: [$mixins.propertyDialogSetting],
  data() {
    return {
      tableList: [],
    };
  },
  mounted() {
    this.tableList = this.currentData;
  },
  methods: {
    up(scope) {
      if (scope.$index > 0) {
        let curr = this.tableList[scope.$index];
        let currIndex = scope.$index;
        dsf.array.remove(this.tableList, curr);
        this.tableList.splice(currIndex - 1, 0, curr);
      }
    },
    down(scope) {
      if (this.tableList.length - 1 > scope.$index) {
        let curr = this.tableList[scope.$index];
        let currIndex = scope.$index;
        dsf.array.remove(this.tableList, curr);
        this.tableList.splice(currIndex + 1, 0, curr);
      }
    },
    yes() {
      return this.tableList;
    },
  },
};
</script>
