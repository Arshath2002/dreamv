<template>
  <div class="dataview-table-setting">
    <div class="data-source">
      <SettingDataOrigin
        :owner="owner"
        @update-field-list="clearMapFieldList"
      ></SettingDataOrigin>
    </div>
    <div class="left">
      <div class="design-column-edit">
        <dsf-virtual-scroll>
          <el-tree
            ref="tree"
            :data="treeData"
            :highlight-current="true"
            :expand-on-click-node="false"
            :render-after-expand="true"
            :default-expand-all="true"
            node-key="id"
            :props="defaultProps"
            @node-click="nodeClick"
          >
            <span slot-scope="{ node, data }" class="custom-tree-node">
              <span :class="`tree-label${data.id}`">
                {{ node.label }}
              </span>
              <span>
                <dsf-button
                  title="添加子项"
                  size="small"
                  btn-style="icon-text"
                  icon="hao"
                  @click.stop="append(data)"
                />
                <template v-if="!data.isRoot">
                  <dsf-button
                    title="删除"
                    size="small"
                    btn-style="icon-text"
                    icon="guanbi2"
                    @click.stop="remove(node)"
                  />
                  <dsf-button
                    title="上移"
                    size="small"
                    btn-style="icon-text"
                    icon="shang"
                    @click.stop="up(node)"
                  />
                  <dsf-button
                    title="下移"
                    size="small"
                    btn-style="icon-text"
                    icon="xia"
                    @click.stop="down(node)"
                  />
                </template>
                <template v-else>
                  <dsf-button
                    title="删除"
                    size="small"
                    btn-style="icon-text"
                    icon="guanbi2"
                    style="color: #c0c0c0"
                  />
                  <dsf-button
                    title="上移"
                    size="small"
                    btn-style="icon-text"
                    icon="shang"
                    style="color: #c0c0c0"
                  />
                  <dsf-button
                    title="下移"
                    size="small"
                    btn-style="icon-text"
                    icon="xia"
                    style="color: #c0c0c0"
                  />
                </template>
              </span>
            </span>
          </el-tree>
        </dsf-virtual-scroll>
      </div>
      <div class="show-line"></div>
      <div class="data-form-wrap">
        <dsf-virtual-scroll>
          <el-form
            ref="form"
            :model="form"
            label-width="150px"
            class="data-form"
          >
            <el-row>
              <el-col :span="12">
                <el-form-item label="表头名称" size="small">
                  <el-input
                    v-model="form.label"
                    :disabled="form.notLastLevel"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item>
                  <template #label>
                    <span>
                      <span>列映射字段</span>
                      <el-popover
                        placement="top"
                        title="提示"
                        trigger="hover"
                        content="该映射字段可作为排序基准"
                      >
                        <i
                          slot="reference"
                          class="el-icon-question"
                          style="
                            color: #409eff;
                            cursor: pointer;
                            margin-left: 6px;
                          "
                        ></i>
                      </el-popover>
                    </span>
                  </template>
                  <SelectInput
                    :key="form.id"
                    v-model="form.map"
                    :mapFieldList="mapFieldList"
                    :disabled="form.readOnly"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="值单位换算">
                  <el-select
                    v-model="form.unitTransform"
                    class="common-width"
                    :disabled="form.readOnly"
                  >
                    <el-option label="无" value=""></el-option>
                    <el-option
                      :label="it.text"
                      v-for="it in unitList"
                      :key="it.value"
                      :value="it.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="千分位分割">
                  <DesDVSwitch
                    v-model="form.isThousandths"
                    :disabled="form.readOnly"
                  ></DesDVSwitch>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="小数位数">
                  <DesDVNumber
                    :inputDisabled="form.readOnly"
                    v-model="form.digit"
                    :config="{}"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="保留小数0">
                  <DesDVSwitch
                    v-model="form.keepZero"
                    :disabled="form.readOnly"
                  ></DesDVSwitch>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="表头插槽">
                  <el-input
                    v-model="form.headerSlotName"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="内容插槽">
                  <el-input v-model="form.slotName" :disabled="form.readOnly" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </dsf-virtual-scroll>
      </div>
    </div>
  </div>
</template>
<script>
import { createTableHeadData } from "_dataview/output/config/tableConfig.js";
import dataAnalysisOptionHelper from "./dataAnalysisOptionHelper";
const SettingDataOrigin = Vue.defineAsyncComponent(() =>
  import(
    /* webpackChunkName: "dataview_design_private" */ "./settingDataOrigin.vue"
  )
);
const CommonAttrItem = Vue.defineAsyncComponent(() =>
  import(
    /* webpackChunkName: "dataview_design_private" */ "./commonAttrItem.vue"
  )
);

export default {
  name: "DesDVTableEdit",
  mixins: [$mixins.propertyDialogSetting, dataAnalysisOptionHelper],
  components: { SettingDataOrigin, CommonAttrItem, },
  data() {
    return {
      componentType: "",
      treeData: [
        {
          id: dsf.uuid(),
          label: "表头",
          isRoot: true,
          level: -1,
          children: [],
        },
      ],
      defaultProps: {
        children: "children",
        label: "label",
      },
      form: null,
      formNode: null,
      formDisabled: createTableHeadData({
        headerFontFamily: "",
        fontFamily: "",
      }),
    };
  },
  created() {
    this.form = this.formDisabled;
    this.currentData.forEach((it) => {
      it.id = it.id ? it.id : dsf.uuid();
    });
    this.currentData.__changeType__ = "tablePop";
    this.treeData[0].children = this.currentData;
    this.oldDataType = this.owner.dataType;
    this.componentType = this.config.params.componentType;
  },
  computed: {
    unitList() {
      let obj = dsf.dataview.units;
      return Object.keys(obj).map((key) => ({
        text: obj[key],
        value: key,
      }));
    },
  },
  methods: {
    nodeClick(data, Node) {
      if (!data.isRoot) {
        this.compatibleAttr(data);
        this.form = data;
        this.formNode = Node;
      } else {
        let temp = _.cloneDeep(this.formDisabled);
        temp.notLastLevel = true;
        this.form = temp;
        this.formNode = null;
      }
    },
    compatibleAttr(data) {
      // 这段不能删除
      if (data.children && data.children.length > 0) {
        data.readOnly = true;
      } else {
        data.readOnly = false;
      }
    },
    append(parentData = this.treeData[0]) {
      let newColumn = createTableHeadData({
        headerFontFamily: "",
        fontFamily: "",
      });
      newColumn.label = "新建列";
      if (!parentData.children) {
        this.$set(parentData, "children", []);
      }
      this.$set(parentData, "readOnly", true);
      parentData.children.push(newColumn);
    },
    remove(node) {
      let parentNode = node.parent;
      dsf.array.remove(parentNode.data.children, node.data);
    },
    up(node) {
      sort.call(this, node, "up");
    },
    down(node) {
      sort.call(this, node, "down");
    },
    beforeSub() {
      let list = this.treeData[0].children;
      list.forEach((item) => {
        let map = item.map;
        if (item.isBar) {
          // 是柱体
          let barInfoArr = item.barInfo;
          barInfoArr.forEach((bar) => {
            bar.field = map;
            bar.fieldSuffix = map;
          });
        }
      });
      return list;
    },
    yes() {
      this.beforeYes();
      return this.beforeSub();
    },
    clearMapFieldList() {
      if (!(this.owner.dataType === "excel" && this.oldDataType === "excel")) {
        this.treeData[0].children.forEach((item) => {
          item.map = "";
        });
      }
      this.oldDataType = this.owner.dataType;
    },
  },
};
function sort(node, type) {
  let parentNode = node.parent;
  let index = parentNode.childNodes.indexOf(node);
  let mark =
    type == "up" ? index > 0 : index <= parentNode.childNodes.length - 1;
  if (mark) {
    let targetIndex = type == "up" ? index - 1 : index + 1;
    let target = parentNode.childNodes[targetIndex];
    this.$set(parentNode.data.children, targetIndex, node.data);
    this.$set(parentNode.data.children, index, target.data);
    this.$set(parentNode.childNodes, targetIndex, node);
    this.$set(parentNode.childNodes, index, target);
  }
}
</script>
