<!--
 * @Description: 颜色系列增加
 * @Author: shenah
 * @Date: 2024-09-12 14:15:38
 * @LastEditors: shenah
 * @LastEditTime: 2024-09-12 16:50:19
-->


<template>
  <div class="des-dv-custom-color-series">
    <div class="header-title">
      <DsfButton
        @click="add"
        style="margin-bottom: 20px;"
        size="small"
        v-if="isAdd"
      >新增</DsfButton>
    </div>
    <el-table
      ref="table"
      class="ds-table"
      :border="true"
      :data="info.colorList"
    >
      <el-table-column
        label="颜色序号"
        :header-align="'center'"
        :align="'center'"
        width="80"
        type="index"
      >
      </el-table-column>
      <el-table-column
        label="颜色"
        :header-align="'center'"
        :align="'center'"
      >
        <template v-slot:default="scope">
          <DesDVColorPicker
            v-model="scope.row[2]"
            :config="{
              type: 'color',
            }"
            @change="changeColor($event,scope.row)"
          ></DesDVColorPicker>
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
            v-if="isAdd"
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
            v-if="isUp(scope.$index)"
            style="min-width: auto; margin-left: 5px"
            @click="up(scope)"
          ></DsfButton>
          <DsfButton
            :size="'small'"
            title="下移"
            icon="xia"
            btn-style="icon-text"
            v-if="isDown(scope.$index)"
            style="min-width: auto; margin-left: 5px"
            @click="down(scope)"
          ></DsfButton>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import threeTool from "_dataview/output/utils/threeTool.js";

export default {
  name: "CustomColorSeries",
  mixins: [$mixins.propertyDialogSetting],


  data() {
    return {
      info: {
        id: "",
        colorList: [],
      }
    }
  },
  created() {
    this.initData();
  },
  computed: {
    isAdd() {
      return this.info.colorList.length < 9
    },
    isUp() {
      return (index) => {
        return index !== 0
      }
    },
    isDown() {
      return (index) => {
        return this.info.colorList.length - 1 !== index;
      }
    },
  },
  methods: {
    initData() {
      if (!this.currentData) {
        this.info = {
          id: `custom${dsf.uuid(8)}`,
          colorList: [],
        }
      } else {
        this.info = _.cloneDeep(this.currentData);
      }
    },
    changeColor(val, row) {
      row[0] = threeTool.transColorOpacity(val, 0.2);
      row[1] = threeTool.transColorOpacity(val, 0.6);
    },
    createOne() {
      return ["rgba(3,16,48,0.2)", "rgba(3,16,48,0.6)", "rgba(3,16,48,1)"];
    },
    add() {
      // 新增
      this.info.colorList.push(this.createOne());
    },
    insert(scope) {
      // 插入
      this.info.colorList.splice(scope.$index + 1, 0, this.createOne());
    },
    deleted(scope) {
      dsf.array.remove(this.info.colorList, scope.row);
    },
    up(scope) {
      if (scope.$index > 0) {
        let curr = this.info.colorList[scope.$index];
        let currIndex = scope.$index;
        dsf.array.remove(this.info.colorList, curr);
        this.info.colorList.splice(currIndex - 1, 0, curr);
      }
    },
    down(scope) {
      if (this.info.colorList.length - 1 > scope.$index) {
        let curr = this.info.colorList[scope.$index];
        let currIndex = scope.$index;
        dsf.array.remove(this.info.colorList, curr);
        this.info.colorList.splice(currIndex + 1, 0, curr);
      }
    },
    yes() {
      return this.info;
    },
  },
};
</script>
