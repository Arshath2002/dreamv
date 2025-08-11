<template>
  <el-container class="dsf-dv-data-filter-condition">
    <el-header class="header">
      <div class="btn-list">
        <el-button
          type="text"
          icon="el-icon-plus"
          @click="add('equalTo')"
          class="add-btn"
        >根据字段过滤
        </el-button>
        <el-button
          type="text"
          icon="el-icon-plus"
          @click="add('intercept')"
          class="add-btn"
        >数据量限制
        </el-button>
        <el-button
          type="text"
          icon="el-icon-plus"
          @click="add('selectNotEmpty')"
          class="add-btn"
        >去除空数据
        </el-button>
        <el-button
          type="text"
          icon="el-icon-plus"
          @click="add('custom')"
          class="add-btn"
        >自定义
        </el-button>
      </div>
      <div class="tip">列表顺序决定数据处理的先后顺序</div>
    </el-header>
    <el-main class="main">
      <template v-if="!tableData.length">
        <dsf-empty-data class="no-data" />
      </template>
      <template v-else>
        <div
          class="condition-item-wrap"
          v-for="(item, index) in tableData"
          :key="index"
        >
          <div class="btn-list">
            <el-button
              class="common-btn"
              type="text"
              @click="moveOne(index, 'up')"
              v-if="index > 0"
              icon="el-icon-top"
            >
            </el-button>
            <el-button
              class="common-btn"
              type="text"
              @click="moveOne(index, 'down')"
              v-if="index < tableData.length - 1"
              icon="el-icon-bottom"
            >
            </el-button>
            <el-button
              class="common-btn"
              type="text"
              @click="remove(item)"
              icon="el-icon-delete"
            >
            </el-button>
          </div>
          <!-- 去除空数据 -->
          <template v-if="item.rule === 'selectNotEmpty'">
            <el-row class="condition-item-value">
              <el-col :span="4">
                <div>去除空数据</div>
              </el-col>
            </el-row>
          </template>
          <!-- 自定义类型 -->
          <template v-else-if="item.rule === 'custom'">
            <el-row class="condition-item-value">
              <el-col :span="4">
                <div>自定义</div>
              </el-col>
              <el-col :span="16" :offset="1">
                <el-input
                  placeholder="请输入"
                  v-model="item.threshold"
                  size="small"
                ></el-input>
              </el-col>
            </el-row>
          </template>
          <!-- 数据量限制 -->
          <template v-else-if="item.rule === 'intercept'">
            <el-row class="condition-item-value">
              <el-col :span="4">
                <div>数据量限制</div>
              </el-col>
              <el-col :span="16" :offset="1">
                <el-row class="common-space">
                  <el-col :span="6">
                    <div>起始下标值(包含)</div>
                  </el-col>
                  <el-col :span="1">
                    <div style="visibility: hidden">-</div>
                  </el-col>
                  <el-col :span="6">
                    <div>结束下标值(不包含)</div>
                  </el-col>
                </el-row>
                <el-row class="flex-aic">
                  <el-col :span="6">
                    <el-input-number
                      placeholder="请输入"
                      v-model="item.startVal"
                      size="small"
                      :controls="false"
                      :precision="0"
                      class="input-number"
                    ></el-input-number>
                  </el-col>
                  <el-col :span="1">
                    <div class="line">-</div>
                  </el-col>
                  <el-col :span="6">
                    <el-input-number
                      placeholder="请输入"
                      v-model="item.endVal"
                      size="small"
                      :controls="false"
                      :precision="0"
                      class="input-number"
                    ></el-input-number>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
          <!-- 字段 -->
          <template v-else>
            <el-row class="common-space">
              <el-col :span="4">
                <div>字段名</div>
              </el-col>
              <el-col :span="4" :offset="1">
                <div>规则</div>
              </el-col>
              <!-- 保留小数 -->
              <template v-if="item.rule === 'decimal'">
                <el-col :span="4" :offset="1">
                  <div>小数位数</div>
                </el-col>
                <el-col :span="4" :offset="1">
                  <div>末尾保留0</div>
                </el-col>
              </template>
              <!-- 单位转化 -->
              <template v-else-if="item.rule === 'unitConvert'">
                <el-col :span="4" :offset="1">
                  <div>转化单位</div>
                </el-col>
                <el-col :span="4" :offset="1">
                  <div>转化后小数</div>
                </el-col>
                <el-col :span="4" :offset="1">
                  <div>末尾保留0</div>
                </el-col>
              </template>
              <!-- 普通类型 -->
              <template v-else>
                <el-col :span="4" :offset="1"> </el-col>
              </template>
            </el-row>
            <el-row class="condition-item-value">
              <el-col :span="4">
                <SelectInput
                  v-model="item.valueName"
                  :mapFieldList="mapFieldList"
                />
              </el-col>
              <el-col :span="4" :offset="1">
                <el-select
                  @change="changeRule(item)"
                  v-model="item.rule"
                  size="small"
                  filterable
                >
                  <el-option
                    v-for="oneRule in ruleFieldList"
                    :key="oneRule.value"
                    :value="oneRule.value"
                    :label="oneRule.label"
                  ></el-option>
                </el-select>
              </el-col>
              <!-- 保留小数 -->
              <template v-if="item.rule === 'decimal'">
                <el-col :span="4" :offset="1">
                  <el-input-number
                    placeholder="请输入"
                    v-model="item.threshold"
                    size="small"
                    :controls="false"
                    :precision="0"
                    class="input-number"
                  ></el-input-number>
                </el-col>
                <el-col :span="4" :offset="1">
                  <el-switch
                    v-model="item.keepZero"
                    size="small"
                    class="switch-style"
                  ></el-switch>
                </el-col>
              </template>
              <!-- 单位转化 -->
              <template v-else-if="item.rule === 'unitConvert'">
                <el-col :span="4" :offset="1">
                  <el-select
                    @change="changeRule(item)"
                    v-model="item.unitCode"
                    size="small"
                    filterable
                  >
                    <el-option
                      v-for="oneRule in unitOptions"
                      :key="oneRule.value"
                      :value="oneRule.value"
                      :label="oneRule.label"
                    ></el-option>
                  </el-select>
                </el-col>
                <el-col :span="4" :offset="1">
                  <el-select
                    @change="changeRule(item)"
                    v-model="item.keepUnitDecimal"
                    size="small"
                    filterable
                  >
                    <el-option
                      v-for="oneRule in unitDecimalOptions"
                      :key="oneRule.value"
                      :value="oneRule.value"
                      :label="oneRule.label"
                    ></el-option>
                  </el-select>
                </el-col>
                <el-col :span="4" :offset="1">
                  <el-switch
                    v-model="item.keepZero"
                    size="small"
                    class="switch-style"
                  ></el-switch>
                </el-col>
              </template>
              <!-- 普通类型 -->
              <template v-else>
                <el-col :span="4" :offset="1" v-if="showCommonValue(item)">
                  <el-input
                    placeholder="请输入"
                    v-model="item.threshold"
                    size="small"
                  ></el-input>
                </el-col>
              </template>
            </el-row>
          </template>
        </div>
      </template>
    </el-main>
  </el-container>
</template>
<script>
import { unitValueMap } from "_dataview/output/config/commonConfig.js";
import SelectInput from "./graph/selectInput.vue";
export default {
  name: "DataFilterCondition",
  mixins: [$mixins.propertyDialogSetting],
  components: {
    SelectInput,
  },
  computed: {
    ruleFieldList() {
      return this.ruleOptions.filter(
        (item) =>
          ["intercept", "selectNotEmpty", "custom"].indexOf(item.value) === -1
      );
    },
  },
  data() {
    return {
      ruleOptions: [
        {
          label: "等于",
          value: "equalTo",
        },
        {
          label: "不等于",
          value: "notEqualTo",
        },
        {
          label: "小于",
          value: "lessThan",
        },
        {
          label: "小于等于",
          value: "lessThanOrEqual",
        },
        {
          label: "大于",
          value: "greaterThan",
        },
        {
          label: "大于等于",
          value: "greaterThanOrEqual",
        },
        {
          label: "保留小数",
          value: "decimal",
        },
        {
          label: "开头匹配",
          value: "start",
        },
        {
          label: "结尾匹配",
          value: "last",
        },
        {
          label: "模糊匹配",
          value: "involve",
        },
        {
          label: "数据量限制",
          value: "intercept",
        },
        {
          label: "去除空数据",
          value: "selectNotEmpty",
        },
        {
          label: "不为空",
          value: "notEmpty",
        },
        {
          label: "去空格",
          value: "spliceEmpty",
        },
        {
          label: "单位转化",
          value: "unitConvert",
        },
        {
          label: "自定义",
          value: "custom",
        },
        {
          label: "升序",
          value: "asc",
        },
        {
          label: "降序",
          value: "desc",
        },
      ],
      tableData: [],
      mapFieldList: [],
      unitOptions: [],
      unitDecimalOptions: [
        {
          label: "不处理",
          value: "",
        },
        {
          label: "整数",
          value: 0,
        },
        {
          label: "保留一位",
          value: 1,
        },
        {
          label: "保留两位",
          value: 2,
        },
        {
          label: "保留三位",
          value: 3,
        },
      ],
    };
  },
  created() {
    let owner = this.currentData;
    this.tableData = this.handleInitData(owner.dealDataList);
    let mapFieldList = [];
    //数据拆分
    let divideDataMapList = owner.getDivideDataMapList;
    switch (owner.dataType) {
      case "excel":
        mapFieldList = owner.excelMapFieldList;
        break;
      case "interface":
        mapFieldList = divideDataMapList.length
          ? divideDataMapList
          : owner.interfaceMapFieldList;
        break;
      case "datasource":
        mapFieldList = divideDataMapList.length
          ? divideDataMapList
          : owner.datasourceMapFieldList;
        break;
      case "combineTable":
        mapFieldList = divideDataMapList.length
          ? divideDataMapList
          : owner.mapFieldList;
        break;
    }
    this.mapFieldList = mapFieldList;

    this.unitOptions = Object.keys(unitValueMap).map((key) => ({
      label: unitValueMap[key],
      value: key,
    }));
  },
  methods: {
    handleInitData(list) {
      let nowList = _.cloneDeep(list);
      return nowList.map((item) => {
        if (item.rule === "intercept") {
          let flag = item.startVal === undefined;
          if (flag) {
            let [startVal = null, endVal = null] = item.threshold.split(",");
            item.startVal = startVal;
            item.endVal = endVal;
          }
        }
        let obj = {
          ...item,
          keepZero: item.keepZero === undefined ? false : item.keepZero,
          startVal: item.startVal === undefined ? null : item.startVal,
          endVal: item.endVal === undefined ? null : item.endVal,
        };
        return obj;
      });
    },
    add(ruleType) {
      let obj = {
        rule: ruleType,
        valueName: "",
        threshold: "",
        keepZero: false,
        unitCode: "10", // 单位转化的值
        keepUnitDecimal: "", // 单位转化时保留的位数
        startVal: "", // 起始下标值
        endVal: "", // 结束下标值
      };
      this.tableData.push(obj);
    },
    showCommonValue(row) {
      let arr = ["notEmpty", "spliceEmpty", "asc", "desc"];
      return arr.indexOf(row.rule) === -1;
    },
    changeRule(row) {
      row.threshold = "";
    },
    remove(row) {
      let index = this.tableData.findIndex((ite) => ite === row);
      if (index >= 0) {
        this.tableData.splice(index, 1);
      }
    },
    moveOne(index, direction) {
      let arr = dsf.dataview.utils.moveOneArray(
        this.tableData,
        index,
        direction
      );
      this.tableData = arr;
    },
    yes() {
      return this.tableData || [];
    },
  },
};
</script>
<style lang="scss">
@import "_dataview/assets/styles/designer/dataFilterCondition.scss";
</style>
