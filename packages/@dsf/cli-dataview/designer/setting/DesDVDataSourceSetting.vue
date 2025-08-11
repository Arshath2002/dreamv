<template>
  <div class="ds-dv-enum-editor-item">
    <div class="ds-dv-enum-editor-item-left" :class="{ fill: hideRight }">
      <dsf-tree-select
        :tree-data="treeData"
        :node-key="'ID'"
        :node-name="'label'"
        :loading="treeLoading"
        :default-checked-key="defaultCheckedKey"
        search-control
        default-expand-all
        @choose-node="chooseNode"
      />
    </div>
    <div class="ds-dv-enum-editor-item-main">
      <div style="height: calc(100% - 32px)">
        <el-table
          v-if="showTable"
          ref="singleTable"
          border
          stripe
          height="100%"
          style="width: 100%"
          row-key="value"
          default-expand-all
          highlight-current-row
          :data="tableList"
          :empty-text="radioNode ? (loading ? '数据加载中...' : emptyText) : '请选择数据源'"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        >
          <el-table-column v-if="loading || !tableFiled.length" label="序号" />
          <el-table-column v-else type="index" :index="startIndex + 1" label="序号" width="60" align="center" />
          <template v-for="filed in tableFiled">
            <el-table-column :key="filed.code" :prop="filed.code" :label="filed.name" min-width="224" />
          </template>
        </el-table>
      </div>
      <div class="ds-dv-enum-editor-item-main-pagination">
        <el-pagination :current-page="pageNum" :page-size="pageSize" :pager-count="5" :total="total" layout="total, prev, pager, next, jumper" background small @current-change="changeData" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "DesDVDataSourceSetting",
  mixins: [$mixins.propertyDialogSetting],
  props: {
    emptyText: {
      type: String,
      default: "暂无数据",
    },
    // 是否返回结果
    needList: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showTable: true,
      loading: true,
      treeLoading: false,
      defaultCheckedKey: "",
      radioNode: null,
      pageSize: 10,
      pageNum: 1,
      total: 0,
      treeData: [],
      tableFiled: [],
      tableList: [],
    };
  },
  watch: {
    "radioNode._id"(to, from) {
      this.pageNum = 1;
      if (to !== from && to) {
        this.tablePost();
      }
    },
    loading() {
      this.showTable = false;
      this.$nextTick(() => {
        this.showTable = true;
        this.$nextTick(() => {
          this.$refs.singleTable.doLayout();
        });
      });
    },
  },
  computed: {
    startIndex() {
      return this.pageNum * this.pageSize - this.pageSize;
    },
  },
  created() {
    this.postData();
    let current = this.currentData;
    const { code, label } = current;

    if (code) {
      this.radioNode = {
        label,
        ID: code,
      };
      this.defaultCheckedKey = current.code;
    }
  },
  mounted() {
    this.$refs.singleTable.doLayout();
  },
  methods: {
    changeData(val) {
      this.pageNum = val;
      this.getTableData();
    },
    chooseNode(node) {
      this.radioNode = node;
    },
    dataFormat({ _id, name, ID, type_value, children }) {
      const obj = {
        _id,
        label: name,
        ID,
        nocheck: type_value !== "3" && type_value !== "8" && type_value !== "20",
        iconSkin: "",
      };
      if (children) {
        obj.children = children.map((v) => this.dataFormat(v));
      } else if (obj.nocheck) {
        obj.iconSkin = "_special";
      }
      return obj;
    },
    postData() {
      this.treeLoading = true;
      const gid = dsf.config.setting_dataview_ds_gid || "e31357e71e2e43d5b1205fccdcd9d83b.868b115a7ef04f6b872e30ba9d986e0a.92efb46d10b746b69660a4adfdd79f57";
      const url = `/rm/list?type=directory,ds&rmGid=${gid}`;
      this.$http
        .get(dsf.url.getWebPath(url, $$webRoot.platform), {
          namespace: "",
        })
        .done((data) => {
          if (data.success) {
            let treeData = data.data.map((v) => this.dataFormat(v));
            let res = treeData;

            this.treeData = res;
          } else {
            dsf.layer.message("请求异常！", false);
          }
        })
        .always(() => {
          this.treeLoading = false;
        });
    },
    getTableData() {
      const dbSourceURL = dsf.url.getWebPath("resource/list/data", $$webRoot.dataview);
      const namespace = (this.designer && this.designer.nameSpace) || "";
      const pageName = (this.designer && this.designer.pageName) || "";
      const { pageNum, pageSize, radioNode } = this;
      const requestParams = {
        namespace,
        pageName,
        order: JSON.stringify([]),
        filter: JSON.stringify([]),
        pageNum,
        pageSize,
        dataRmId: radioNode.ID,
        dataviewQuery: JSON.stringify([]),
      };
      return this.$http.get(dbSourceURL, requestParams).done((response) => {
        const { success, data } = response;
        if (success) {
          this.total = data.count;
          this.tableList = data.data;
        } else {
          return [];
        }
      });
    },
    tablePost() {
      this.loading = true;
      this.tableFiled = [];
      const rmId = this.radioNode._id;
      const rmURL = dsf.url.getWebPath("dbsource/rmId", $$webRoot.platform);
      return Promise.all([this.$http.get(rmURL, { rmId }), this.getTableData()])
        .then(([{ data }]) => {
          if (!data.success) {
            dsf.layer.message("请求异常", false);
            return;
          }
          return { fields: data.data };
        })
        .then(({ fields }) => {
          fields = _.filter(fields[0].metadata, (f) => f.code != "_id");
          this.tableFiled = fields;
        })
        .catch((err) => {
          console.log("err", err);
          dsf.layer.message(err?.massage || "请求异常", false);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    yes() {
      const { radioNode, needList, tableList } = this;
      if (radioNode) {
        const { ID, _id, label = "未知数据源" } = radioNode;
        const data = {
          _id,
          label,
          code: ID,
          fields: this.tableFiled,
        };
        if (needList) {
          data.tableList = tableList;
        }
        return data;
      } else {
        return {
          _id: "",
          code: "",
          label: "",
          fields: this.tableFiled,
        };
      }
    },
  },
};
</script>
<style lang="scss">
@import "_dataview/assets/styles/designer/DesDVDataSourceSetting.scss";
</style>
