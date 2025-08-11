<template>
  <el-container>
    <el-header style="padding: 10px 0px; text-align: right">
      <DsfButton @click="add">新增一屏</DsfButton>
    </el-header>
    <el-main style="padding: 0px">
      <el-table ref="table" class="ds-table" :border="true" :data="tableData" :row-class-name="tableRowClassName">
        <el-table-column label="幻灯片名称" :header-align="'center'" :align="'center'">
          <template v-slot:default="scope">
            <el-input v-model="scope.row.label"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="插槽标识" :header-align="'center'" :align="'center'">
          <template v-slot:default="scope">
            <el-input v-model="scope.row.name"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" :header-align="'center'" :align="'center'" :width="160">
          <template v-slot:default="scope">
            <DsfButton :size="'small'" title="插入" icon="hao" btn-style="icon-text" style="min-width: auto; margin-left: 5px" @click="insert(scope)"></DsfButton>
            <DsfButton :size="'small'" title="删除" icon="guanbi2" btn-style="icon-text" v-if="tableData.length > 1" style="min-width: auto; margin-left: 5px" @click="deleted(scope)"></DsfButton>
            <DsfButton :size="'small'" title="上移" icon="shang" btn-style="icon-text" style="min-width: auto; margin-left: 5px" @click="up(scope)"></DsfButton>
            <DsfButton :size="'small'" title="下移" icon="xia" btn-style="icon-text" style="min-width: auto; margin-left: 5px" @click="down(scope)"></DsfButton>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>
</template>
<script>
export default {
  name: "DesDVCarouselEdit",
  mixins: [$mixins.propertyDialogSetting],
  data() {
    return {
      tableData: [],
      names: [],
    };
  },
  created() {
    let slots = this.currentData;

    this.tableData = slots;
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      let res = "";
      if (row.name) {
        this.names[rowIndex] = "";
        let i = this.names.indexOf(row.name);
        if (i != -1 && i < rowIndex) {
          res = "warning-row";
        }
        this.names[rowIndex] = row.name;
      }
      return res;
    },
    newSlot() {
      let len = this.tableData.length;
      return {
        label: "carousel_" + (len + 1),
        name: "carousel_" + (len + 1),
        controls: [],
        error: false,
      };
    },
    add() {
      // 新增
      this.tableData.push(this.newSlot());
    },
    insert(scope) {
      // 插入
      this.tableData.splice(scope.$index + 1, 0, this.newTab());
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
    validate() {
      for (let i in this.tableData) {
        this.tableData[i]["name"] = this.tableData[i]["name"] || dsf.uuid();
        let index = this.names.indexOf(this.tableData[i]["name"]);
        if (index != -1 && index < i) {
          dsf.layer.message("请解决重复标识", false);
          return false;
        }
      }
      return true;
    },
    yes() {
      return [...this.tableData];
    },
    checkMaxSpan(row, key) {
      row[key] = dsf.isNumber(row[key]) ? Number(row[key]) : null;
      if (row[key] && row[key] > 24) {
        row[key] = 24;
      }
      if (row[key] && row[key] < 0) {
        row[key] = null;
      }
    },
  },
};
</script>
