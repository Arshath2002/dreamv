<template>
  <el-container class="ds-super-search-enum-items" style="height: 100%">
    <el-main style="padding: 0px; height: 100%; overflow: hidden">
      <el-form ref="form" :inline="true" :model="formData" label-width="100px"></el-form>
      <el-tabs class="tabs" v-model="activeName" style="height: 100%">
        <el-tab-pane label="静态数据" name="static">
          <div style="height: 100%; overflow: auto">
            <div style="margin-bottom: 5px; float: right">
              <dsf-button size="small" icon="hao" @click="addRow"> 增加 </dsf-button>
              <dsf-button size="small" icon="guanbi2" type="plain"> 清空 </dsf-button>
            </div>
            <el-table :data="values.static" border>
              <el-table-column label="名称">
                <template v-slot:default="scope">
                  <el-input v-model="scope.row.text" placeholder="选项文本"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="值">
                <template v-slot:default="scope">
                  <el-input v-model="scope.row.value" placeholder="多个值用;分割"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template v-slot:default="scope">
                  <dsf-button title="删除" size="small" btn-style="icon-text" icon="guanbi2" @click.stop="remove(scope.row)"></dsf-button>
                  <dsf-button title="上移" size="small" btn-style="icon-text" icon="shang" @click.stop="up(scope.row)"></dsf-button>
                  <dsf-button title="下移" size="small" btn-style="icon-text" icon="xia" @click.stop="down(scope.row)"></dsf-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
        <el-tab-pane v-if="item.model != 'treeselect'" label="数据字典" name="dict">
          <div style="height: 100%">
            <DesDictDataSelect style="height: 100%; overflow: hidden" v-model="values.dict"></DesDictDataSelect>
          </div>
        </el-tab-pane>
        <el-tab-pane v-if="item.model != 'treeselect'" label="数据源" name="dbsource">
          <div style="height: 100%; overflow: hidden">
            <DesDVDbDataSelect style="height: 100%; overflow: hidden" v-model="values.dbsource"></DesDVDbDataSelect>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-main>
  </el-container>
</template>

<script>
import DesDVDbDataSelect from "./DesDVDbDataSelect.vue";
export default {
  name: "advancedQueryEnums",
  mixins: [$mixins.propertyDialogSetting],
  components: { DesDVDbDataSelect },
  props: {
    item: {
      type: Object,
      default() {
        return {};
      },
    },
    currentData: {
      type: Object,
      default() {
        return null;
      },
    },
    searchItems: {
      type: Array,
      default() {
        return [];
      },
    },
    isMobile: Boolean,
  },
  data() {
    return {
      formData: {
        rel: "",
        operator: "eq",
      },
      activeName: "static",
      values: {
        static: [],
        dict: { key: null, node: null },
        dbsource: { key: null, node: null },
      },
    };
  },
  created() {
    let { activeName, values } = dsf.mix(true, {}, this.currentData);
    this.activeName = activeName;
    this.values = values;
  },
  methods: {
    yes() {
      let activeName = this.activeName;
      let values = this.values;
      return {
        activeName,
        values,
      };
    },
    addRow() {
      this.values.static.push({});
    },
    remove(row) {
      dsf.array.remove(this.values.static, row);
    },
    up(row) {
      let index = _.findIndex(this.values.static, (r) => r == row);
      if (index > 0) {
        let targetRow = this.values.static[index - 1];
        this.$set(this.values.static, index - 1, row);
        this.$set(this.values.static, index, targetRow);
      }
    },
    down(row) {
      let index = _.findIndex(this.values.static, (r) => r == row);
      if (index < this.values.static.length - 1) {
        let targetRow = this.values.static[index + 1];
        this.$set(this.values.static, index + 1, row);
        this.$set(this.values.static, index, targetRow);
      }
    },
  },
};
</script>
