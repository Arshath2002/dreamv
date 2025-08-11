<!--
 * @Description: 
 * @Author: zhanghang
 * @Date: 2023-03-23 14:00:44
 * @LastEditors: shenah
 * @LastEditTime: 2024-08-02 10:48:03
-->
<template>
  <el-container>

    <el-main style="padding:0px">
      <el-table
        ref="table"
        class="ds-table"
        :border="true"
        :data="tableData"
      >
        <el-table-column
          label="显示名称"
          :header-align="'center'"
          :align="'center'"
        >
          <template v-slot:default="scope">
            <el-input v-model="scope.row.name"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="标识"
          :header-align="'center'"
          :align="'center'"
          width="100"
        >
          <template v-slot:default="scope">
            <el-input
              v-model="scope.row.value"
              :disabled="true"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="是否显示"
          :header-align="'center'"
          :align="'center'"
          width="140"
        >
          <template v-slot:default="scope">
            <el-radio-group v-model="scope.row.show">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </template>
        </el-table-column>
        <el-table-column
          label="后缀"
          :header-align="'center'"
          :align="'center'"
          width="140"
        >
          <template v-slot:default="scope">
            <el-input v-model="scope.row.suffix"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="默认值"
          :header-align="'center'"
          :align="'center'"
        >
          <template v-slot:default="scope">
            <el-input v-model="scope.row.defaultDate"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="值分割符"
          :header-align="'center'"
          :align="'center'"
          width="120"
        >
          <template v-slot:default="scope">
            <el-select
              v-if="['quarter','month','halfYear','date','periodMonth'].indexOf(scope.row.value) > -1"
              v-model="scope.row.separator"
              placeholder="请选择"
            >
              <el-option
                v-for="item in separatorOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <!-- 先不做等提了需求在做 -->
        <!-- <el-table-column
          label="显示值格式"
          :header-align="'center'"
          :align="'center'"
        >
          <template #header>
            <div>
              <span>显示值格式</span>
              <el-tooltip
                class="item"
                effect="light"
                placement="bottom"
              >
                <template #content>
                  <el-table
                    :border="true"
                    :data="desList"
                    style="width: 300px;"
                  >
                    <el-table-column
                      label="标识"
                      header-align="center"
                      align="center"
                      prop="type"
                      width="80"
                    >
                    </el-table-column>
                    <el-table-column
                      label="字母意思"
                      header-align="center"
                      align="center"
                      prop="valueDes"
                    >
                    </el-table-column>
                    <el-table-column
                      label="例子"
                      header-align="center"
                      align="center"
                      prop="example"
                    >
                    </el-table-column>
                  </el-table>
                </template>
                <i
                  class="el-icon-warning-outline tip-icon"
                  style="cursor: pointer; margin-left: 4px;"
                ></i>
              </el-tooltip>
            </div>
          </template>
          <template v-slot:default="scope">
            <el-input v-model="scope.row.showFormat"></el-input>
          </template>
        </el-table-column> -->
        <el-table-column
          label="操作"
          :header-align="'center'"
          :align="'center'"
          :width="120"
        >
          <template v-slot:default="scope">
            <DsfButton
              :size="'small'"
              title="上移"
              icon="shang"
              btn-style="icon-text"
              style="min-width:auto;margin-left:5px"
              @click="up(scope)"
            ></DsfButton>
            <DsfButton
              :size="'small'"
              title="下移"
              icon="xia"
              btn-style="icon-text"
              style="min-width:auto;margin-left:5px"
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
  name: 'DesDVReportDateTabEdit',
  mixins: [$mixins.propertyDialogSetting],
  data() {
    return {
      tableData: [],
      names: [],
      separatorOptions: [
        {
          label: "无",
          value: "",
        },
        {
          label: "/",
          value: "/",
        },
        {
          label: "-",
          value: "-",
        }
      ],
      desList: [
        // 先不做等提了需求再弄
        {
          type: "year",
          valueDes: "yyyy代表年",
          example: "当你选择2022时yyyy年=>2022年",
        },
        {
          type: "quarter",
          valueDes: "yyyy代表年;MM代表季度",
          example: "当你选择202202时yyyy年MM季度=>2022年02季度",
        },
        {
          type: "halfYear",
          valueDes: "yyyy代表年;MM代表季度",
          example: "当你选择202202时yyyy年MM季度=>2022年02季度",
        }
      ]
    };
  },
  created() {
    let list = this.currentData || [];
    this.tableData = list.map(item => ({
      ...item,
      separator: item.separator || ""
    }))
  },
  methods: {
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

    yes() {
      return this.tableData;
    },

  }
};
</script>
