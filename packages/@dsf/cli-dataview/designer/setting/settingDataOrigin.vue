<!--
 * @Description: 数据来源
 * @Author: zhanghang
 * @Date: 2023-05-09 13:49:38
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-06-18 11:18:42
-->
<template>
  <div class="des-dv-data-origin des-dv-data-origin-border">
    <Collapse v-model="activeCollapse" @change="getActiveCollapse" :isShowIcon="isShowIcon">
      <el-scrollbar class="ds-scroll scroll-collapse-item" style="height: 100%">
        <CollapseItem name="数据设置" data="dataSet" :isShowIcon="isShowIcon">
          <div class="des-dv-data-origin-card">
            <!-- 是否显示数据来源分类 -->
            <template v-if="showDataClass">
              <div class="card-item card-item-row">
                <span class="card-item-common">数据来源</span>
                <el-select size="small" v-model="dataType" placeholder="数据来源">
                  <el-option :label="op.text" :value="op.value" v-for="op in options" :key="op.value"></el-option>
                </el-select>
              </div>
              <div class="card-item card-item-border" @click="openStaticData" v-if="dataType === 'static'">
                <el-link type="primary">
                  <el-badge :is-dot="isHasStatic" type="primary" class="common-property-badge"> 设置静态数据 </el-badge>
                </el-link>
              </div>
              <template v-else-if="dataType === 'interface'">
                <div class="card-item card-item-row">
                  <span class="card-item-common">请求方式</span>
                  <el-select size="small" v-model="interfaceMethod" placeholder="请求方式">
                    <el-option :label="op.text" :value="op.value" v-for="op in httpMethods" :key="op.value"></el-option>
                  </el-select>
                </div>
                <div class="card-item card-item-row">
                  <span class="card-item-common">是否为JSON格式</span>
                  <el-switch v-model="interInterfaceHttpJSONFlag" size="small"></el-switch>
                </div>
                <div class="card-item card-item-column request-method">
                  <span class="card-item-common">数据路径</span>
                  <el-input v-model="dataURL" size="small" placeholder="请输入数据路径" style="width: 100%">
                    <span v-if="dataURL" slot="suffix" @click="sendRequest"> 发送请求 </span>
                  </el-input>
                </div>
              </template>

              <div class="card-item card-item-border" @click="openExcel" v-else-if="dataType === 'excel'">
                <el-link type="primary">
                  <el-badge :is-dot="isHasExcelData" type="primary" class="common-property-badge"> 表格数据设置 </el-badge>
                </el-link>
              </div>
              <div class="card-item card-item-border" @click="openDataSource" v-else-if="dataType === 'datasource'">
                <el-link type="primary">
                  <el-badge :is-dot="!!this.owner.dataSource._id" type="primary" class="common-property-badge"> 数据源选择 </el-badge>
                </el-link>
              </div>
              <div class="card-item card-item-border" @click="openCombineData" v-else-if="dataType === 'combineTable'">
                <el-link type="primary">
                  <el-badge :is-dot="!!owner.combineTable.id" type="primary" class="common-property-badge">
                    {{ businessData.map((it) => it.value).includes("dg_resource") ? "资源选择" : "综合数据选择" }}
                  </el-badge>
                </el-link>
              </div>
              <template v-if="['interface', 'combineTable', 'datasource'].includes(dataType)">
                <div class="card-item card-item-border" @click="openParams">
                  <el-link type="primary">
                    <el-badge :is-dot="isHasDataParams" type="primary" class="common-property-badge"> 数据传参设置 </el-badge>
                  </el-link>
                </div>
                <div class="card-item card-item-border" @click="openDataDivide">
                  <el-link type="primary">
                    <el-badge :is-dot="isHasDataDivide" type="primary" class="common-property-badge"> 数据自定义设置 </el-badge>
                  </el-link>
                </div>
                <div class="card-item card-item-border" @click="openReplaceText">
                  <el-link type="primary">
                    <el-badge :is-dot="isHasDataReplaceText" type="primary" class="common-property-badge"> 数据文本替换设置 </el-badge>
                  </el-link>
                </div>
              </template>
              <template v-if="dataType !== 'static'">
                <div class="card-item card-item-border" @click="openFilterCondition">
                  <el-link type="primary">
                    <el-badge :is-dot="this.owner.dealDataList.length > 0" type="primary" class="common-property-badge"> 数据过滤条件设置 </el-badge>
                  </el-link>
                </div>
              </template>
            </template>
            <div class="card-item">
              <span>页面数据集</span>
              <el-scrollbar
                class="des-dv-data-origin-scroller"
                :style="{
                  height: !showDataClass ? '480px' : '200px',
                }"
              >
                <el-tree :check-strictly="true" :default-expanded-keys="defaultExpandedKeys" :data="pageDataSource" node-key="nodeKey" ref="tree" highlight-current :props="defaultProps">
                  <span @click.stop class="custom-tree-node" slot-scope="{ node }">
                    <!-- 数据目录 -->
                    <span v-if="node.data.is_folder === 1">
                      <i :class="getTreeIcon(node)"></i>
                      {{ node.label }}
                    </span>
                    <!-- 数据表 -->
                    <span v-if="node.data.is_folder === 0" class="custom-tree-node-content-wrap">
                      <div class="custom-tree-node-content">
                        <el-checkbox @click.stop @change="change($event, node.data)" :value="isChecked(node.data)">
                          <i :class="getTreeIcon(node)"></i>
                          {{ node.type === "datasource" ? "数据源" : "" }}
                          <span :title="node.data.label" v-if="!node.data.isEdit"> {{ node.data.label }}</span>
                          <input @blur="node.data.isEdit = false" class="input-node" @change="changeLabel(node.data)" v-if="node.data.isEdit" v-model="node.data.label" />
                        </el-checkbox>
                        <DsfIcon class="edit-icon" name="bianjisekuai" v-if="!node.data.isExotic" @click.stop="node.data.isEdit = !node.data.isEdit"></DsfIcon>
                        <DsfIcon class="del-icon" name="del1" v-if="!isChecked(node.data) && !node.data.isExotic" @click.stop="deleteDataSource(node, pageDataSource)"></DsfIcon>
                      </div>
                    </span>
                    <!-- 数据表字段 -->
                    <span class="custom-tree-node-label" v-else-if="node.data.isField">
                      <i :class="getTreeIcon(node)"></i>
                      <span :title="node.label">{{ node.label }}</span>
                    </span>
                  </span>
                </el-tree>
              </el-scrollbar>
            </div>
          </div>
        </CollapseItem>
        <slot></slot>
      </el-scrollbar>
    </Collapse>
  </div>
</template>
<script>
import CollapseItem from "./graph/config/tool/collapseItem.vue";
import Collapse from "./graph/config/tool/collapse.vue";

const DesDVDataSourceSetting = Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_private" */ "./DesDVDataSourceSetting.vue"));
const asyncConfigAttachRequestParams = Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_private" */ "./configAttachRequestParams.vue"));
const DataFilterCondition = Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_private" */ "./dataFilterCondition"));
const CombineTableSetting = Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_private" */ "./combineTableSetting.vue"));
const DataConfigEdit = Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_private" */ "./dataConfigEdit.vue"));
const dataReplaceText = Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_private" */ "./dataReplaceText.vue"));
const excelData = Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_private" */ "./excelData.vue"));
const excelLuckySheetEdit = Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_private" */ "./dataDivideSetting.vue"));
export default {
  name: "SettingDataOrigin",
  mixins: [$mixins.propertyDialogSetting],
  props: {
    isShowIcon: {
      type: Boolean,
      default: true,
    },
    // 组件
    owner: {
      typeof: Object,
      default() {
        return {};
      },
    },
  },
  components: {
    CollapseItem,
    Collapse,
  },
  computed: {
    // 是否显示数据来源分类
    showDataClass() {
      if (this.$route.query.fromModeId) return false;
      return true;
    },
    //数据类型
    dataType: {
      get() {
        return this.owner.dataType;
      },
      set(v) {
        this.owner.dataType = v;
      },
    },
    interInterfaceHttpJSONFlag: {
      get() {
        return this.owner.interInterfaceHttpJSONFlag;
      },
      set(v) {
        this.owner.interInterfaceHttpJSONFlag = v;
      },
    },
    //请求方式
    interfaceMethod: {
      get() {
        return this.owner.interfaceMethod;
      },
      set(v) {
        this.owner.interfaceMethod = v;
      },
    },
    interfaceHttpConfig: {
      get() {
        return this.owner.interfaceHttpConfig;
      },
      set(v) {
        this.owner.interfaceHttpConfig = v;
      },
    },
    //数据路径
    dataURL: {
      get() {
        return this.owner.dataURL;
      },
      set(v) {
        this.owner.dataURL = v;
      },
    },
    pageDataSource() {
      return this.owner.$designer.designerDataSources || [];
    },
    businessData() {
      return this.owner.$designer.businessData || [];
    },
    dataResources() {
      return this.owner.$designer.dataResources || [];
    },
    options() {
      let opts = [
        {
          text: "静态",
          value: "static",
        },
        {
          text: "表格",
          value: "excel",
        },
        {
          text: "接口",
          value: "interface",
        },
        {
          text: "数据源",
          value: "datasource",
        },
        {
          text: "业务数据",
          value: "combineTable",
        },
      ];

      const dataResources = this.dataResources;
      if (dataResources.length) {
        opts = opts.filter((it) => dataResources.includes(it.value));
      }
             
      return opts;
    },
    isHasDataParams() {
      let vm = this.owner;
      var nowMap = this.dataParamsMapField[vm.dataType] || {};
      let headerKey = nowMap.headers?.key || "";
      let paramsKey = nowMap.params?.key || "";
      let headerParamList = vm[headerKey] || [];
      let paramsParamList = vm[paramsKey] || [];
      return headerParamList.length > 0 || paramsParamList.length > 0;
    },
    isHasDataDivide() {
      let vm = this.owner;
      let dataDivideSet = vm.dataDivideSet || [];
      let flag = this.twoArrayHasValue(dataDivideSet);
      return flag;
    },
    isHasDataReplaceText() {
      let dataReplaceText = this.owner.dataReplaceText || [];
      let flag = this.twoArrayHasValue(dataReplaceText);
      return flag;
    },
    isHasExcelData() {
      let excelData = this.owner.excelData || [];
      let newList = excelData.slice(2);
      let flag = this.twoArrayHasValue(newList);
      return flag;
    },
    isHasStatic() {
      const staticData = this.owner.staticData;
      return Array.isArray(staticData) ? staticData.length > 0 : true;
    },
  },
  data() {
    return {
      defaultExpandedKeys: [],
      activeCollapse: ["dataSet"],
      defaultProps: {
        children: "children",
        label: "label",
      },
      httpMethods: [
        {
          text: "GET",
          value: "get",
        },
        {
          text: "POST",
          value: "post",
        },
      ],
      dataParamsMapField: {
        datasource: {
          params: {
            name: "数据传参",
            key: "dataSourceParams",
          },
          headers: {
            name: "请求头参数",
            key: "dataSourceHeaders",
          },
        },
        combineTable: {
          params: {
            name: "数据传参",
            key: "combineTableParams",
          },
          headers: {
            name: "请求头参数",
            key: "combineTableHeaders",
          },
        },
        interface: {
          params: {
            name: "数据传参",
            key: "configAttachRequestParams",
          },
          headers: {
            name: "请求头参数",
            key: "configAttachRequestHeaders",
          },
        },
      },
    };
  },
  created() {
    const options = this.options;
    const dataType = this.owner.dataType;
    // 如果数据来源没有在配置的数据来源列表中
    if (!options.find((it) => it.value === dataType)) {
      this.owner.dataType = options[0].value;
    }

    // 默认展开 目录------start
    const defaultExpandedKeys = this.defaultExpandedKeys || [];
    function dp(data) {
      data.forEach((it) => {
        if (it.is_folder === 1) {
          defaultExpandedKeys.push(it.nodeKey);
        }
        if (it.children && it.children.length) {
          dp(it.children);
        }
      });
    }
    dp(this.pageDataSource);
    this.defaultExpandedKeys = defaultExpandedKeys;
    // 默认展开 目录------end
  },
  methods: {
    change(check, data) {
      if (check) {
        this.owner.dataType = data.type;
        switch (data.type) {
          case "interface":
            this.owner.dataURL = data.url;
            //切换数据来源
            dsf.emit.$emit(
              "changeDataSource",
              {
                dataType: "interface",
                fields: data.mapFieldList,
                interface: data.origin,
                interfaceParams: data.params,
              },
              [this.owner.$children[0]]
            );
            break;
          case "datasource":
            //切换数据来源
            dsf.emit.$emit(
              "changeDataSource",
              {
                dataType: "datasource",
                fields: data.mapFieldList,
                dataSource: data.origin,
                dataSourceParams: data.params,
              },
              [this.owner.$children[0]]
            );
            break;
          case "combineTable":
            dsf.emit.$emit(
              "changeDataSource",
              {
                dataType: "combineTable",
                fields: data.mapFieldList,
                combineTable: data.origin,
                combineTableParams: data.params,
              },
              [this.owner.$children[0]]
            );
            break;
        }
      }
    },
    isChecked(node) {
      let nodeKey = node.id;
      //综合表存在重复的情况
      if (node.type === "combineTable") {
        nodeKey = nodeKey + "-" + node.label;
      }
      let owner = this.owner;
      let dataType = owner.dataType;
      let _nowKey = "";
      switch (dataType) {
        case "interface":
          _nowKey = owner.interface._id;
          break;
        case "datasource":
          _nowKey = owner.dataSource._id;
          break;
        case "combineTable":
          _nowKey = owner.combineTable.id + "-" + owner.combineTable.name;
      }
      return _nowKey === nodeKey;
    },
    //打开静态数据设置
    openStaticData() {
      this.openDialog(
        DataConfigEdit,
        {
          owner: this.owner,
          currentData: this.owner.staticData,
        },
        (res) => {
          this.owner.staticData = res.yes();
        }
      );
    },
    //打开数据源选择
    openDataSource() {
      const dataSource = this.owner.dataSource;
      this.openDialog(
        DesDVDataSourceSetting,
        {
          designer: this.owner.$designer,
          owner: this.owner,
          currentData: dataSource,
        },
        (res) => {
          const dataSource = res.yes();
          this.owner.dataSource = dataSource;
          let fields = dataSource.fields.map((it) => ({
            ...it,
            value: it.code,
          }));
          this.owner.datasourceMapFieldList = fields;
          const vm = this.owner.$children[0];
          setTimeout(vm.init);
          //重新加载映射字段
          this.$emit("update-field-list");
        }
      );
    },
    //打开综合表数据
    openCombineData() {
      const pageName = this.owner.$designer.pageName;
      const nameSpace = this.owner.$designer.nameSpace;

      this.openDialog(
        CombineTableSetting,
        {
          owner: this.owner,
          businessData: this.businessData,
          currentData: this.owner.combineTable,
          pageName,
          nameSpace,
        },
        async (res) => {
          const data = await res.yes();
          if (data) {
            this.owner.combineTable = data;
            //重新加载映射字段
            this.$emit("update-field-list");
            setTimeout(this.owner.init);
          } else {
            return false;
          }
        },
        "1300px",
        "70vh",
        "10px"
      );
    },
    //打开表格数据设置
    openExcel() {
      this.openDialog(
        excelData,
        {
          owner: this.owner,
          currentData: this.owner.excelData,
        },
        (res) => {
          // 记录前两行数据
          const key1 = this.owner.excelData[0] + this.owner.excelData[1];
          this.owner.excelData = res.yes();
          // 有更新，重新加载映射字段
          if (key1 !== this.owner.excelData[0] + this.owner.excelData[1]) {
            this.$emit("update-field-list");
          }
        }
      );
    },
    //打开附加参数设置
    openParams() {
      let vm = this.owner;
      var nowMap = this.dataParamsMapField[vm.dataType] || {};
      let currentData = [];
      Object.keys(nowMap).forEach((key) => {
        var obj = nowMap[key];
        currentData.push({
          name: obj.name,
          list: vm[obj.key],
          key: obj.key,
        });
      });
      this.openDialog(
        asyncConfigAttachRequestParams,
        {
          owner: vm,
          currentData,
        },
        (res) => {
          let params = res.yes();
          let flags = [];
          params.forEach((item) => {
            let flag = _.isEqual(vm[item.key], item.list);
            flags.push(flag);
            vm[item.key] = item.list;
          });
          let resultFlag = flags.every(Boolean);
          if (!resultFlag) {
            this.$nextTick(() => {
              vm.init();
            });
          }
        },
        "1000px"
      );
    },
    //打开数据处理弹窗，添加数据处理规则；
    openFilterCondition() {
      this.openDialog(
        DataFilterCondition,
        {
          owner: this.owner,
          currentData: this.owner,
        },
        (res) => {
          this.owner.dealDataList = res.yes();
        },
        "1000px"
      );
    },
    //打开替换文本配置
    openReplaceText() {
      this.openDialog(
        dataReplaceText,
        {
          owner: this.owner,
        },
        (res) => {
          this.owner.dataReplaceText = res.yes();
        },
        "800px",
        "400px"
      );
    },
    //打开数据拆分设置
    openDataDivide() {
      this.$openDialog({
        title: "设置",
        content: excelLuckySheetEdit,
        width: "1200px",
        height: "50vh",
        top: "15vh",
        params: {
          owner: this.owner,
          currentData: this.owner.dataDivideSet,
        },
        btns: [
          {
            text: "确定",
            handler: (res) => {
              this.owner.dataDivideSet = res.yes();
            },
          },
          {
            text: "清空",
            handler: (res) => {
              res.emptyData();
              return false;
            },
          },
          {
            text: "取消",
          },
        ],
      });
    },
    //打开弹框
    openDialog(content, params, cb, w = "1200px", h = "60vh", top = "15vh") {
      return this.$openDialog({
        title: "设置",
        content: content,
        width: w,
        height: h,
        top,
        params,
        btns: [
          {
            text: "确定",
            handler(res) {
              return cb(res);
            },
          },
          {
            text: "取消",
          },
        ],
      });
    },
    getTreeIcon(node) {
      if (node.isLeaf) {
        return "dsf-icon-ziyuan1 leaf-color";
      } else if (node.data.is_folder === 1) {
        return "dsf-icon-wenjianjia1 root-color";
      }
      return "dsf-icon-table root-color";
    },
    // 得到控制面板的值
    getActiveCollapse(value) {
      if (this.owner.chart && Array.isArray(value)) {
        this.owner.chart.dataSetCollapse = value;
      }
    },
    // 发送数据请求
    sendRequest() {
      if (this.owner.interface) {
        this.owner.interface.label = "";
      }
      this?.owner?.init();
    },

    // 修改数据源label
    changeLabel(data) {
      const type = data.type;
      const label = data.label;
      const origin = data.origin;
      if (type === "combineTable") {
        origin.name = label;
      } else {
        origin.label = label;
      }
    },
    // 删除数据源
    deleteDataSource(node, data) {
      this.$confirm("是否删除该数据来源？").then(() => {
        const index = data.findIndex((d) => d.nodeKey === node.data.nodeKey);
        if (index > -1) {
          data.splice(index, 1);
        }

        this.deleteAllDataSource(node);
      });
    },
    getAllMethodsIds(obj) {
      let ids = [];
      ids.push(obj.interface._id);
      ids.push(obj.dataSource._id);
      ids.push(obj.combineTable.id + "-" + obj.combineTable.name);
      return ids.filter(Boolean);
    },
    deleteAllDataSource(node) {
      // 删除所有相关的数据源,并把相应的组件弄成静态数据
      let vm = this.owner.$children[0];
      let nodeKey = node.data.nodeKey;
      let comps = this.owner.$designer.designerDataMappingComps;
      comps.forEach((nowVm) => {
        let allIds = this.getAllMethodsIds(nowVm);
        if (vm !== nowVm && allIds.indexOf(nodeKey) > -1) {
          nowVm.$emit("update:dataType", "excel");
        }
      });
    },
    twoArrayHasValue(arr) {
      let flag = false;
      for (let i = 0; i < arr.length; i++) {
        let one = arr[i];
        if (Array.isArray(one)) {
          flag = one.some((item) => item !== undefined && item !== null && item !== "");
          if (flag) {
            break;
          }
        }
      }
      return flag;
    },
  },
};
</script>
<style lang="scss">
@import "_dataview/assets/styles/designer/SettingDataOrigin.scss";
</style>
