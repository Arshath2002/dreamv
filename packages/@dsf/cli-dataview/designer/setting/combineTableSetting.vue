<!--
 * @Description: 
 * @Author: zhanghang
 * @Date: 2023-03-30 14:55:45
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-06-18 11:13:49
-->
<template>
  <el-tabs v-model="activeName" class="combine-table-setting" type="border-card">
    <el-tab-pane :label="hasLedger.alias || hasLedger.text" name="combineLedger" v-if="hasLedger">
      <DsfMacroQuery :macroProps="{ autoLoadData: true }" ref="combineTable" :defaultBaseInfo="defaultBaseInfo" :showInterfaceButton="true" />
    </el-tab-pane>
    <el-tab-pane :label="hasReport.alias || hasReport.text" name="combineReport" v-if="hasReport">
      <DsfViewPart ref="combineReport" :path="`/pc/am/product/resourcetab?table=false&model=false&classValue=2,3&pn=${pageName}&ns=${nameSpace}&isSjcp=1`"></DsfViewPart>
    </el-tab-pane>
    <el-tab-pane :label="hasResource.alias || hasResource.text" name="resourceClass" v-if="hasResource">
      <DsfViewPart ref="resourceClass" path="/pc/dg/govern/catalog/tree?seltype=dataview&isview=1"></DsfViewPart>
      <DsfDmOlap ref="olap" :isBackstage="true"></DsfDmOlap>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
export default {
  name: "combineTableSetting",
  mixins: [$mixins.propertyDialogSetting],
  props: {
    pageName: {
      type: String,
      default: "",
    },
    nameSpace: {
      type: String,
      default: "",
    },
    businessData: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      activeName: "combineLedger",
      defaultBaseInfo: null,
      id: "",
      combineTable: {},

      combineLedgerURL: "/macrodata/kiv/queryMetadataTableData",
      combineReportURL: "/macrodata/kiv/queryLayoutRangeTableData",
      combineResourceURL: "/dm/manage/data/detail",
    };
  },
  created() {
    let { active, id, params } = this.currentData;

    this.id = id || JSON.stringify(params);

    const activeMap = [
      ["combineLedger", this.hasLedger],
      ["combineReport", this.hasReport],
      ["resourceClass", this.hasResource],
    ];
    const hasActive = activeMap.find((it) => it[0] === active);
    if (hasActive && !hasActive[1]) {
      let len = 0;
      while (len <= 2) {
        if (activeMap[len][1]) {
          active = activeMap[len][0];
          break;
        }
        len++;
      }
    }

    this.activeName = active;
    this.defaultBaseInfo = params;
  },
  computed: {
    //拥有综合台账
    hasLedger() {
      const dg_ledger = this.businessData.find((it) => it.value === "dg_ledger");
      if (dg_ledger) {
        return dg_ledger;
      }
      return null;
    },
    //拥有综合报表
    hasReport() {
      const dg_report = this.businessData.find((it) => it.value === "dg_report");
      if (dg_report) {
        return dg_report;
      }
      return null;
    },
    //拥有资源目录
    hasResource() {
      const dg_resource = this.businessData.find((it) => it.value === "dg_resource");
      const dm_resource = this.businessData.find((it) => it.value === "dm_resource");

      if (dg_resource && dm_resource) {
        return dg_resource.ds_order > dm_resource.ds_order ? dg_resource : dm_resource;
      }
      if (dg_resource) return dg_resource;
      if (dm_resource) return dm_resource;
      return null;
    },
  },
  methods: {
    transformParams(params) {
      let res = [];
      Object.keys(params).forEach((key) => {
        let value = params[key];
        let valueKey = Array.isArray(value) || (typeof value == "object" && value != null) ? JSON.stringify(value) : value;
        res.push({
          origin: "text",
          queryKey: key,
          valueKey,
          designValue: valueKey,
        });
      });
      return res;
    },

    /**
     * 打开综合报表
     *
     */
    openReportDialog(id, name, header, latestVersion) {
      let vm = this.owner;
      let self = this;
      return new Promise((resolve) => {
        this.$openDialog({
          title: "综合/汇总报表",
          width: "85%",
          height: "70vh",
          content: "MacroReportEditor",
          params: {
            datastorage: header.kivTable,
            dataVersion: latestVersion,
            dataVersions: [
              {
                CODE: latestVersion,
                NAME: latestVersion,
              },
            ],
            id: id,
            buttons: [],
          },
          btns: [
            {
              text: "选中部分",
              handler: async (res) => {
                let $$macroGrid = res.getMacroGrid();
                let macroGridParams = $$macroGrid.getMetaSelectRange();
                let params = {
                  layoutId: id,
                  header,
                  version: latestVersion,
                  ...macroGridParams,
                };
                vm.combineTableParams = self.transformParams(params);
                const result = await this.confirmSetting(name);
                resolve(result);
              },
            },
            {
              text: "全选",
              handler: async (res) => {
                let $$macroGrid = res.getMacroGrid();
                let frozen = $$macroGrid.frozens[0];
                $$macroGrid.sheet.setSelection(
                  frozen.row + frozen.rowCount,
                  frozen.col + frozen.colCount,
                  frozen.rowEnd - frozen.row - frozen.rowCount + 1,
                  frozen.colEnd - frozen.col - frozen.colCount + 1
                );
                let macroGridParams = $$macroGrid.getMetaSelectRange();
                let params = {
                  layoutId: id,
                  header,
                  version: latestVersion,
                  ...macroGridParams,
                };
                vm.combineTableParams = self.transformParams(params);

                const result = await this.confirmSetting(name);
                resolve(result);
              },
            },
            {
              text: "取消",
              handler() {
                resolve();
              },
            },
          ],
        });
      });
    },
    confirmSetting(name) {
      const combineTable = this.combineTable;
      let params = {
        name: name || "",
      };
      return new Promise((resolve) => {
        this.$openDialog({
          showClose: false,
          title: "综合数据集重命名",
          width: "300px",
          height: "100px",
          template: `
         <el-input
                key="input_1"
                v-model="params.name"
                placeholder="请输入综合数据集名称"
                style="width: 260px"
              ></el-input>
         `,
          btnPosition: "bottom",
          params,
          btns: [
            {
              text: "确认",
              handler: () => {
                combineTable.name = params.name || "综合表";
                resolve(combineTable);
              },
            },
            {
              text: "暂不设置",
              handler: () => {
                if (!combineTable.name) {
                  combineTable.name = params.name || "综合表";
                }
                resolve(combineTable);
              },
            },
          ],
        });
      });
    },

    /**
     * 打开数据加工
     * @param {Object} combineTable
     */
    openDataProcessing(combineTable, id) {
      return new Promise((resolve) => {
        this.$openDialog({
          showClose: false,
          title: "数据加工",
          width: "1200px",
          height: "60vh",
          content: "",
          btnPosition: "bottom",
          params: {
            path: `/pc/dp/manage/data/resultlist?modeId=${id}`,
          },
          btns: [
            {
              text: "确定",
              handler: async (res) => {
                let item = await res.yes();
                item = Array.isArray(item) ? item[0] : item;
                if (!item) {
                  resolve();
                  return false;
                }
                const result = await this.confirmSetting(combineTable.name);
                this.owner.combineTableParams = this.transformParams({
                  id: item._id,
                  pageSize: 15,
                  pageNum: 1,
                });
                resolve(result);
              },
            },
            {
              text: "取消",
              handler() {
                resolve();
              },
            },
          ],
        });
      });
    },
    yes() {
      let activeName = this.activeName;
      let id = this.id;
      let combineTable = {
        active: activeName,
        id,
      };
      this.combineTable = combineTable;
      // 综合台账
      if (activeName == "combineLedger") {
        let info = this.$refs.combineTable.getReturnValue();
        let params = info.baseInfo;

        params.header = {
          kivTable: info.datastorage,
          dataScale: info.precision,
        };

        this.owner.combineTableParams = this.transformParams(params);

        if (params.indicators.length) {
          let name = params.indicators[0].NAME;
          combineTable.name = name;
        }
        let indicators = params.indicators.map((it) => it.CODE).join("-");
        combineTable.id = indicators;
        combineTable.url = this.combineLedgerURL;

        return this.confirmSetting(combineTable.name);
        // 综合/汇总报表
      } else if (activeName == "combineReport") {
        combineTable.url = this.combineReportURL;
        const view = this.$refs.combineReport;
        let header = null;

        let latestVersion = "";
        if (view.$refs.view) {
          const { selected, type } = view.$refs.view.getSjcpSelectData();
          let checked = null;
          if (selected) {
            checked = dsf.isArray(selected) ? selected : [selected];
          }
          if (checked && checked.length) {
            header = {
              kivTable: checked[0]["kivTable"],
            };
            latestVersion = checked[0]["resourcemanage_datacure_resourcedire_statistic_listdb.viewVersionId"];
            let id = checked[0]["resourcemanage_datacure_resourcedire_statistic_listdb.dsbi_md_report_id"];
            let name = checked[0]["resourcemanage_datacure_resourcedire_statistic_listdb.stat_tab_name"];
            combineTable.id = id;
            combineTable.name = name;
          }
        }

        if (combineTable.id) {
          return this.openReportDialog(combineTable.id, combineTable.name, header, latestVersion);
        } else {
          return combineTable;
        }
        //资源目录
      } else if (activeName == "resourceClass") {
        combineTable.url = this.combineResourceURL;
        const view = this.$refs.resourceClass;
        if (view.$refs.view) {
          const res = view.$refs.view.yes();
          if (res && res[0]) {
            const check = res[0];
            const { name = "综合数据", type, id } = check;
            combineTable.name = name;
            const map = {
              govern_model: 1,
              table: 2,
              dataadhoc: 5,
              dataolap: 6,
            };
            const _type = map[type] ? map[type] : type;
            // 如果是olap 分析数据需要转换一次
            if (_type == 6) {
              if (this.$refs.olap) {
                return new Promise((resolve) => {
                  this.$refs.olap.saveBodyDataById(id, [], ({ id, name }) => {
                    combineTable.id = id;
                    combineTable.name = name;
                    this.owner.combineTableParams = this.transformParams({
                      id: id,
                      type: 2,
                      pageSize: 15,
                      pageNum: 1,
                    });
                    resolve(combineTable);
                  });
                });
              }
              // 数据加工
            } else if (_type === "datadp") {
              //数据加工
              combineTable.url = "/dp/query/result/details";
              return this.openDataProcessing(combineTable, id);
            } else {
              combineTable.id = id;
              this.owner.combineTableParams = this.transformParams({
                id,
                type: _type,
                pageSize: 15,
                pageNum: 1,
              });
              return this.confirmSetting(name);
            }
          } else {
            dsf.layer.message("请先勾选数据！", false);
          }
        }
      }
      return combineTable;
    },
  },
};
</script>
