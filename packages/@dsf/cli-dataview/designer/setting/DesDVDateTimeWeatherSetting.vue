<template>
  <div class="des-dv-fontstyle-rules dynamic-field-style-expend-style-item">
    <el-container>
      <el-header>
        <div style="text-align: right; height: auto; margin: 0px -20px">
          <DsfButton @click="add">新增显示</DsfButton>
        </div>
      </el-header>
      <el-main style="padding: 0px">
        <el-table :data="tableData" border>
          <el-table-column :prop="'value'" :label="'日期天气类型'">
            <template v-slot:default="scope">
              <SelectInput style="width: 220px" v-model="scope.row.value" :mapFieldList="TYPES" />
            </template>
          </el-table-column>
          <!-- 只有时间日期有该类型 -->
          <el-table-column :prop="'format'" :label="'展示形式'">
            <template v-slot:default="scope">
              <el-select
                v-if="
                  ['YMD-HMS', 'YMD', 'YM', 'HM', 'HMS'].includes(
                    scope.row.value
                  )
                "
                v-model="scope.row.format"
                size="small"
              >
                <el-option
                  v-for="item in getFormatOptions(scope.row)"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column :label="'操作'" width="120px">
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
                :disabled="tableData.length <= 1"
                :size="'small'"
                title="删除"
                icon="guanbi2"
                btn-style="icon-text"
                style="min-width: auto; margin-left: 5px"
                @click="remove(scope.row)"
              ></DsfButton>
              <DsfButton
                :disabled="scope.$index === 0"
                :size="'small'"
                title="上移"
                icon="shang"
                btn-style="icon-text"
                style="min-width: auto; margin-left: 5px"
                @click="up(scope)"
              ></DsfButton>
              <DsfButton
                :disabled="scope.$index === tableData.length - 1"
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
  </div>
</template>
<script>
const SelectInput = Vue.defineAsyncComponent(() =>
  import(
    /* webpackChunkName: "dataview_design_private" */ "./graph/selectInput.vue"
  )
);
export default {
  name: "DesDVDateTimeWeatherSetting",
  mixins: [$mixins.propertyDialogSetting],
  components: { SelectInput },
  data() {
    return {
      TYPES: [],
      FORMAT: new Map(),
    };
  },
  created() {
    const vm = this.owner.$children[0];
    this.defaultStyle = vm.cellStyle;
    this.tableData = dsf.mix(true, [], this.currentData);
    this.TYPES = vm.TYPES;
    this.FORMAT = vm.FORMAT;
  },
  methods: {
    createRule() {
      return {
        id: dsf.uuid(),
        value: "YMD-HMS",
        format: "yyyy-mm-dd hh:ii:ss",
        style: {
          ...this.defaultStyle,
        },
      };
    },
    add() {
      this.tableData.push(this.createRule());
    },
    getFormatOptions(item) {
      let list = this.FORMAT.get(item.value);
      if (list) {
        if (!list.find((it) => it.value == item.format)) {
          item.format = list[0].value;
        }
        return list;
      }
      return [];
    },
    insert(scope) {
      this.tableData.splice(scope.$index + 1, 0, this.createRule());
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
