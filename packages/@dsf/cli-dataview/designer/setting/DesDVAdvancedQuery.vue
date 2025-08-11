<!--
 * @Description: 高级查询
 * @Author: zhanghang
 * @Date: 2024-01-19 13:43:55
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-01-02 18:13:28
-->
<template>
  <el-container class="des-dv-setting-advanced-query">
    <el-aside width="20%" class="des-dv-setting-advanced-query-side">
      <div class="fields-list">
        <DsfVirtualScroll>
          <div class="fields-item" @click="setCurrentRow(it)" :class="{ selected: it === activeRow }" v-for="it in tableData" :key="it.field">
            <p>
              标签名：
              <span>{{ it.performanceItem.label }}</span>
            </p>
            <p>
              大屏参数字段：
              <span>{{ it.fieldItem.field.join(",") }}</span>
            </p>
          </div>
        </DsfVirtualScroll>
      </div>
    </el-aside>
    <el-main ref="table-wrapper" class="des-dv-setting-advanced-query-main">
      <el-header>
        <div style="text-align: right; height: auto; margin: 0px -20px">
          <DsfButton @click="add">新增查询条件</DsfButton>
        </div>
      </el-header>
      <el-table ref="table" :data="tableData" @row-click="rowClick" :tree-props="{ children: 'children' }" highlight-current-row border stripe>
        <el-table-column type="index" label="#" width="50" align="center"></el-table-column>
        <el-table-column label="配置" header-align="center">
          <template v-slot:default="{ row }">
            <el-form :model="row" :inline="true" class="demo-form-inline" size="mini" label-width="100px">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="名称">
                    <el-input v-model="row.performanceItem.label"></el-input>
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="字段类型">
                    <el-select v-model="row.fieldItem.fieldType" @change="searchTypeChange($event, row)">
                      <el-option v-for="op in dataTypes" :key="op.value" :value="op.value" :label="op.label"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="显示方式">
                    <!-- 枚举类型 -->
                    <el-select v-if="row.fieldItem.fieldType == 'enum'" @change="changeType($event, row)" v-model="row.performanceItem.performance">
                      <el-option value="select" label="下拉框"></el-option>
                      <el-option value="selectBox" label="选择框"></el-option>
                    </el-select>
                    <!-- 文本类型 -->
                    <el-select v-if="row.fieldItem.fieldType == 'text'" v-model="row.performanceItem.performance">
                      <el-option :value="'textbox'" label="文本框"></el-option>
                    </el-select>
                    <!-- 数字类型 -->
                    <el-select v-if="row.fieldItem.fieldType == 'number'" v-model="row.performanceItem.performance">
                      <el-option :value="'textbox'" label="文本框"></el-option>
                    </el-select>
                    <!-- 日期类型 -->
                    <el-select v-if="row.fieldItem.fieldType == 'date'" v-model="row.performanceItem.performance">
                      <el-option :value="'ymds'" label="年月日时分秒"></el-option>
                      <el-option :value="'ymd'" label="年月日"></el-option>
                      <el-option :value="'ym'" label="年月"></el-option>
                      <el-option :value="'y'" label="年"></el-option>
                    </el-select>
                    <!-- 季月年类型 -->
                    <el-select v-if="row.fieldItem.fieldType === 'period'" v-model="row.performanceItem.performance">
                      <el-option :value="'hy'" label="半年"></el-option>
                      <el-option :value="'ss'" label="季度"></el-option>
                      <el-option :value="'md'" label="旬"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="操作符">
                    <el-select v-model="row.fieldItem.op">
                      <el-option :value="it.value" :label="it.label" v-for="(it, index) in getOperateSymbol(row)" :key="index"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="布局">
                    <el-select :disabled="row.performanceItem.performance === 'selectBox'" v-model="row.performanceItem.layout">
                      <el-option value="24" label="整行"></el-option>
                      <el-option value="12" label="1/2"></el-option>
                      <el-option value="8" label="1/3"></el-option>
                      <el-option value="6" label="1/4"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="提示文字">
                    <el-input v-model="row.performanceItem.placeholder" placeholder="请输入"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12" v-if="['number', 'text'].includes(row.fieldItem.fieldType)">
                  <el-form-item label="显示操作">
                    <el-radio-group v-model="row.performanceItem.showOperation">
                      <el-radio :label="true">是</el-radio>
                      <el-radio :label="false">否</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="12" v-if="row.performanceItem.performance === 'selectBox'">
                  <el-form-item label="是否折叠">
                    <el-radio-group v-model="row.performanceItem.hasCollapse">
                      <el-radio :label="true">是</el-radio>
                      <el-radio :label="false">否</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="默认值">
                    <el-input v-model="row.performanceItem.defaultValue"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12" v-if="row.source.activeName === 'dbsource'">
                  <el-form-item label="文本映射">
                    <SelectInput v-model="row.dataSourceSetting.textMap" :mapFieldList="getMapFieldList(row)" />
                  </el-form-item>
                </el-col>
                <el-col :span="12" v-if="row.source.activeName === 'dbsource'">
                  <el-form-item label="值映射">
                    <SelectInput v-model="row.dataSourceSetting.valueMap" :mapFieldList="getMapFieldList(row)" />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="字段名称">
                    <el-input class="field-input" :value="it" v-for="(it, index) in row.fieldItem.field" :key="index" @input="changeField($event, row.fieldItem.field, index)"></el-input>
                    <DsfIcon @click="addField(row.fieldItem.field)" class="op-symbol" name="jia"/>
                    <DsfIcon @click="deleteField(row.fieldItem.field)" v-if="row.fieldItem.field.length > 1" name="jian" class="op-symbol" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130px" align="center" header-align="center">
          <template v-slot:default="{ row, $index }">
            <template>
              <dsf-button v-if="row.fieldItem.fieldType === 'enum'" title="选项配置" size="small" btn-style="icon-text" icon="shezhi" @click.stop="settingEnumItems(row)"></dsf-button>
              <dsf-button title="插入" size="small" btn-style="icon-text" icon="hao" @click.stop="insert($index)"></dsf-button>
              <dsf-button title="上移" size="small" btn-style="icon-text" icon="shang" @click.stop="up(row)"></dsf-button>
              <dsf-button title="下移" size="small" btn-style="icon-text" icon="xia" @click.stop="down(row)"></dsf-button>
              <dsf-button title="删除" size="small" btn-style="icon-text" icon="guanbi2" @click.stop="remove(row)"></dsf-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>
</template>
<script>
const advancedQueryEnums = Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_private" */ "./advancedQueryEnums.vue"));
const SelectInput = Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_private" */ "./graph/selectInput.vue"));
export default {
  name: "DesDVAdvancedQuery",
  mixins: [$mixins.propertyDialogSetting],
  components: { SelectInput },
  data() {
    return {
      options: [],
      tableData: [],
      //数据类型
      dataTypes: [],
      //数据类型的操作符映射表
      operationTypes: new Map(),
      //激活的当前项
      activeRow: null,
      vm: null,
      //数据源映射对象
      fieldMap: {},
    };
  },
  created() {
    this.tableData = dsf.mix(true, [], this.currentData);

    this.tableData.forEach((it) => {
      if (it.source.activeName === "dbsource") {
        this.dbSourceItems(it.source.values.dbsource.key);
      }
    });
    this.vm = this.owner.$children[0];
    this.options = this.vm.performanceTypes;
    this.dataTypes = this.vm.dataTypes;
    this.operationTypes = this.vm.operationTypes;
  },
  methods: {
    //修改数据类型
    changeType(v, row) {
      if (v === "selectBox") {
        row.performanceItem.layout = "24";
      }
    },
    //修改字段名称
    changeField(val, fields, index) {
      fields[index] = val;
      this.$set(fields, index, val);
    },
    //添加字段
    addField(fields) {
      fields.push("");
    },
    //删除字段名称
    deleteField(fields) {
      fields.pop();
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
    //改变字段类型
    searchTypeChange(v, row) {
      row.fieldItem.op = "E";
      switch (v) {
        case "text":
          row.performanceItem.performance = "textbox";
          break;
        case "number":
          row.performanceItem.performance = "textbox";
          break;
        case "enum":
          row.performanceItem.performance = "select";
          break;
        case "date":
          row.performanceItem.performance = "ymd";
          break;
        case "period":
          row.performanceItem.performance = "hy";
          break;
      }
    },
    rowClick(row) {
      this.activeRow = row;
    },
    setCurrentRow(it) {
      this.$refs.table.setCurrentRow(it);
      this.activeRow = it;
      this.$nextTick(() => {
        const el = this.$refs["table-wrapper"].$el;
        const current = el.querySelector(".current-row");
        el.scrollTo({
          top: current.offsetTop,
          behavior: "smooth",
        });
      });
    },
    //获取数据源数据
    dbSourceItems(rmId) {
      if (!rmId) return;
      const dbSourceURL =  dsf.url.getWebPath("meta/tree/dbSource", $$webRoot.platform);
      this.$http
        .get(dbSourceURL, {
          rmId,
        })
        .done((data) => {
          if (data.success) {
            if (data.data.length) {
              if (!this.fieldMap[rmId]) {
                const list = Object.keys(data.data[0]).map((it) => {
                  return {
                    name: it,
                    value: it,
                  };
                });
                this.$set(this.fieldMap, rmId, list);
              }
            }
          } else {
            dsf.layer.message("请求异常！", false);
          }
        });
    },
    //数据源映射列表
    getMapFieldList(item) {
      const key = item.source.values.dbsource.key;
      return this.fieldMap[key] || [];
    },
    yes() {
      return this.tableData;
    },
    //是否含有提示
    hasPlaceHolder(item) {
      return item.type != "selectBox";
    },
    settingEnumItems(row) {
      this.$openDialog({
        title: "选项设置",
        content: advancedQueryEnums,
        height: "60vh",
        width: "700px",
        params: {
          item: row,
          currentData: row.source,
        },
        btns: [
          {
            text: "确定",
            handler: (res) => {
              let result = res.yes();
              row.source = result;
              if (result.activeName === "dbsource") {
                this.dbSourceItems(result.values.dbsource.key, row);
              }
            },
          },
          {
            text: "取消",
          },
        ],
      });
    },
    insert(index) {
      const defaultItem = this.owner.$children[0].defaultItem;
      //唯一键
      defaultItem._id = dsf.uuid();
      this.tableData.splice(index + 1, 0, dsf.mix(true, {}, defaultItem));
    },
    add() {
      const defaultItem = this.owner.$children[0].defaultItem;
      //唯一键
      defaultItem._id = dsf.uuid();
      this.tableData.push(dsf.mix(true, {}, defaultItem));
    },
    remove(row) {
      dsf.array.remove(this.tableData, row);
    },

    up(row) {
      let index = _.findIndex(this.tableData, (r) => r == row);
      if (index > 0) {
        let targetRow = this.tableData[index - 1];
        this.$set(this.tableData, index - 1, row);
        this.$set(this.tableData, index, targetRow);
      }
    },
    down(row) {
      let index = _.findIndex(this.tableData, (r) => r == row);
      if (index < this.tableData.length - 1) {
        let targetRow = this.tableData[index + 1];
        this.$set(this.tableData, index + 1, row);
        this.$set(this.tableData, index, targetRow);
      }
    },
  },
};
</script>
<style lang="scss">
@import "_dataview/assets/styles/designer/DesDVAdvancedQuery.scss";
</style>
