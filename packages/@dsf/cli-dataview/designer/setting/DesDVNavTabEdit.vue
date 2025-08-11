<template>
  <el-container>
    <el-header style="padding: 10px 0px; text-align: right">
      <DsfButton @click="add">新增页签</DsfButton>
    </el-header>
    <el-main style="padding: 0px">
      <el-table
        ref="table"
        class="ds-table"
        :border="true"
        :data="tableData"
        :row-class-name="tableRowClassName"
      >
        <el-table-column
          label="选项名称"
          :header-align="'center'"
          :align="'center'"
        >
          <template v-slot:default="scope">
            <el-input v-model="scope.row.title"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="标识"
          :header-align="'center'"
          :align="'center'"
        >
          <template v-slot:default="scope">
            <el-input v-model="scope.row.name"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="禁用"
          :header-align="'center'"
          :align="'center'"
        >
          <template v-slot:default="scope">
            <el-input
              v-model="scope.row.disable"
              placeholder="支持表达式"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="隐藏"
          :header-align="'center'"
          :align="'center'"
        >
          <template v-slot:default="scope">
            <el-input
              v-model.number="scope.row.isHide"
              placeholder="支持表达式"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column :header-align="'center'" :align="'center'">
          <template #header>
            <span>
              <span>懒加载</span>
              <el-tooltip effect="light" placement="bottom">
                <div slot="content">
                  <div style="margin-bottom: 10px">
                    开启：选中当前选项卡时才会加载其数据；
                  </div>
                  <div>关闭：页面加载时就加载完数据</div>
                </div>
                <DsfIcon
                  :class="[descStriking && 'desc-striking']"
                  style="margin-left: 5px; cursor: pointer"
                  name="bangzhuzhongxin"
                ></DsfIcon>
              </el-tooltip>
            </span>
          </template>
          <template v-slot:default="scope">
            <el-input
              v-model.number="scope.row.lazy"
              placeholder="支持表达式"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          :header-align="'center'"
          :align="'center'"
          :width="120"
        >
          <template v-slot:default="scope">
            <DsfButton
              :size="'small'"
              title="插入"
              icon="hao"
              btn-style="icon-text"
              style="min-width: auto; margin-left: 5px"
              @click="insert(scope)"
            ></DsfButton>
            <DsfButton
              :size="'small'"
              title="删除"
              icon="guanbi2"
              btn-style="icon-text"
              style="min-width: auto; margin-left: 5px"
              @click="deleted(scope)"
            ></DsfButton>
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
    </el-main>
  </el-container>
</template>
<script>
export default {
  name: "DesDVNavTabEdit",
  mixins: [$mixins.propertyDialogSetting],
  data() {
    return {
      tableData: [],
      names: [],
      stashSlots: [],
    };
  },
  created() {
    let slots = this.currentData;
    let tableData = [],
      stashSlots = [];
    slots.forEach((it) => {
      if (
        ["default", "header-top-left", "header-top-right"].includes(it.name)
      ) {
        stashSlots.push(it);
      } else {
        tableData.push(it);
      }
    });
    this.stashSlots = stashSlots;
    this.tableData = tableData || [this.newTab()];
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
    newTab() {
      return {
        title: "Tab" + (this.tableData.length + 1),
        name: null,
        disable: "false",
        isHide: "false",
        badge: null,
        lazy: "false",
        controls: [],
        error: false,
      };
    },
    add() {
      // 新增
      this.tableData.push(this.newTab());
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
      return [...this.stashSlots, ...this.tableData];
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
