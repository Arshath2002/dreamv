<template>
  <div
    class="dsf-dv-time-range data-view-item-wrap ds-control data-view-no-padding data-view-select-theme data-view-common-bg-effect"
    v-show="(!isDesign && show) || isDesign"
    :style="$slotStyle"
  >
    <div
      class="bar-inner"
      :class="'bar-align-' + align"
      :style="barInnerStyle"
    >
      <label
        class="name-left"
        v-if="nameTextStyle.isShow"
        :style="labelStyle"
      >
        {{ nameTextStyle.content }}
      </label>
      <el-tag
        v-show="labelShow"
        class="btn-item"
        v-for="it in reportTab.filter((it) => it.show)"
        :key="it.value"
        :class="{ active: activeBtnItem == it.value }"
        @click="checkBtnItems(it.value)"
        :style="getBtnItemStyle(it)"
      >
        {{ it.name }}
      </el-tag>
      <div class="select-box">
        <template v-if="activeBtnItem === 'year'">
          <dataviewDateRangePicker
            v-if="year.length === 2"
            :popper-class="popperClass"
            v-model="year"
            :style="dateThemeStyle"
            :editable="false"
            :clearable="false"
            customType="year"
            :prefix-icon="'el-icon-arrow-down'"
            type="monthrange"
            :value-format="commonValueFormat('year')"
            :format="commonShowFormat('year')"
            start-placeholder="开始年份"
            end-placeholder="结束年份"
            @change="changeRange"
            :key="`year${key}1`"
            :picker-options="{
              disabledDate: (params) => {
                return disabledDateFn(params, 'year');
              },
            }"
          />
          <el-date-picker
            v-else
            :key="`year${key}2`"
            :popper-class="popperClass"
            :style="dateThemeStyle"
            v-model="year[0]"
            :editable="false"
            :clearable="false"
            :prefix-icon="'el-icon-arrow-down'"
            type="year"
            :value-format="commonValueFormat('year')"
            :format="commonShowFormat('year')"
            placeholder="选择年份"
            @change="changeCommon"
            :picker-options="{
              disabledDate: (params) => {
                return disabledDateFn(params, 'year');
              },
            }"
          ></el-date-picker>
        </template>
        <template v-if="activeBtnItem === 'quarter'">
          <dataviewDateRangePicker
            v-if="quarter.length === 2"
            :popper-class="popperClass"
            :key="`quarter${key}1`"
            v-model="quarter"
            :style="dateThemeStyle"
            :editable="false"
            :clearable="false"
            customType="quarter"
            :prefix-icon="'el-icon-arrow-down'"
            type="monthrange"
            :value-format="commonValueFormat('quarter')"
            :format="commonShowFormat('quarter')"
            start-placeholder="开始季度"
            end-placeholder="结束季度"
            @change="changeRange"
            :picker-options="{
              disabledDate: (params) => {
                return disabledDateFn(params, 'quarter');
              },
            }"
          />
          <dataviewDateSinglePicker
            v-else
            :key="`quarter1${key}1`"
            :style="dateThemeStyle"
            :popper-class="popperClass"
            v-model="oneQuarter"
            :value-format="commonValueFormat('quarter')"
            :format="commonShowFormat('quarter')"
            customType="singleQuarter"
            :clearable="false"
            :prefix-icon="'el-icon-arrow-down'"
            type="month"
            @change="changeCommon"
            :picker-options="{
              disabledDate: (params) => {
                return disabledDateFn(params, 'quarter');
              },
            }"
          />
        </template>
        <template v-if="activeBtnItem === 'halfYear'">
          <dataviewDateRangePicker
            :popper-class="popperClass"
            v-if="halfYear.length === 2"
            :key="`halfYear${key}1`"
            v-model="halfYear"
            :style="dateThemeStyle"
            :editable="false"
            :clearable="false"
            customType="halfYear"
            :prefix-icon="'el-icon-arrow-down'"
            type="monthrange"
            :value-format="commonValueFormat('halfYear')"
            :format="commonShowFormat('halfYear')"
            start-placeholder="开始"
            end-placeholder="结束"
            @change="changeRange"
            :picker-options="{
              disabledDate: (params) => {
                return disabledDateFn(params, 'halfYear');
              },
            }"
          />
          <dataviewDateSinglePicker
            v-else
            :style="dateThemeStyle"
            :key="`halfYear1${key}1`"
            :popper-class="popperClass"
            v-model="oneHalfYear"
            :value-format="commonValueFormat('halfYear')"
            :format="commonShowFormat('halfYear')"
            customType="singleHalfYear"
            :clearable="false"
            :prefix-icon="'el-icon-arrow-down'"
            type="month"
            @change="changeCommon"
            :picker-options="{
              disabledDate: (params) => {
                return disabledDateFn(params, 'halfYear');
              },
            }"
          />
        </template>
        <template v-if="activeBtnItem === 'month'">
          <el-date-picker
            v-if="month.length === 2"
            :key="`month${key}1`"
            :popper-class="popperClass"
            v-model="month"
            :style="dateThemeStyle"
            :editable="false"
            :clearable="false"
            :value-format="commonValueFormat('month')"
            :format="commonShowFormat('month')"
            :prefix-icon="'el-icon-arrow-down'"
            type="monthrange"
            placeholder="选择月"
            start-placeholder="开始"
            end-placeholder="结束"
            @change="changeRange"
            :picker-options="{
              disabledDate: (params) => {
                return disabledDateFn(params, 'month');
              },
            }"
          ></el-date-picker>
          <el-date-picker
            v-else
            :popper-class="popperClass"
            :key="`month${key}2`"
            :style="dateThemeStyle"
            v-model="month[0]"
            :editable="false"
            :clearable="false"
            :prefix-icon="'el-icon-arrow-down'"
            type="month"
            :value-format="commonValueFormat('month')"
            :format="commonShowFormat('month')"
            placeholder="选择月份"
            @change="changeCommon"
            :picker-options="{
              disabledDate: (params) => {
                return disabledDateFn(params, 'month');
              },
            }"
          ></el-date-picker>
        </template>
        <template v-if="activeBtnItem === 'date'">
          <el-date-picker
            v-if="day.length === 2"
            :popper-class="popperClass"
            :key="`date${key}1`"
            :style="dateThemeStyle"
            v-model="day"
            :editable="false"
            :clearable="false"
            :value-format="commonValueFormat('date')"
            :format="commonShowFormat('date')"
            :prefix-icon="'el-icon-arrow-down'"
            type="daterange"
            placeholder="选择日期"
            @change="changeRange"
            :picker-options="{
              disabledDate: (params) => {
                return disabledDateFn(params, 'date');
              },
            }"
          ></el-date-picker>
          <el-date-picker
            v-else
            :popper-class="popperClass"
            :key="`date1${key}1`"
            :style="dateThemeStyle"
            v-model="day[0]"
            :editable="false"
            :clearable="false"
            :value-format="commonValueFormat('date')"
            :format="commonShowFormat('date')"
            :prefix-icon="'el-icon-arrow-down'"
            type="date"
            placeholder="选择日期"
            @change="changeCommon"
            :picker-options="{
              disabledDate: (params) => {
                return disabledDateFn(params, 'date');
              },
            }"
          ></el-date-picker>
        </template>
        <template v-if="activeBtnItem === 'periodMonth'">
          <dataviewDateRangePicker
            :popper-class="popperClass"
            v-if="periodMonth.length === 2"
            :key="`periodMonth${key}1`"
            v-model="periodMonth"
            :style="dateThemeStyle"
            :editable="false"
            :clearable="false"
            customType="rangePeriod"
            :prefix-icon="'el-icon-arrow-down'"
            type="daterange"
            :value-format="commonValueFormat('periodMonth')"
            :format="commonShowFormat('periodMonth')"
            start-placeholder="开始"
            end-placeholder="结束"
            @change="changeRange"
            class="el-date-editor--monthrange"
            :picker-options="{
              disabledDate: (params) => {
                return disabledDateFn(params, 'periodMonth');
              },
            }"
          />
          <dataviewDateSinglePicker
            v-else
            :style="dateThemeStyle"
            :key="`periodMonth${key}2`"
            :popper-class="popperClass"
            v-model="onePeriodMonth"
            :value-format="commonValueFormat('periodMonth')"
            :format="commonShowFormat('periodMonth')"
            customType="periodMonth"
            :clearable="false"
            :prefix-icon="'el-icon-arrow-down'"
            type="date"
            @change="changeCommon"
            :picker-options="{
              disabledDate: (params) => {
                return disabledDateFn(params, 'periodMonth');
              },
            }"
          />
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import { eventTemp } from "_dataview/output/utils/relativeEvent";
import dataviewDateRangePicker from "../common/el-date-picker/date-range-pick";
import dataviewDateSinglePicker from "../common/el-date-picker/date-single-pick";
import themeMixin from "_dataview/mixins/moreThemeMixin.js";
import { createCommonTextStyle } from "_dataview/output/config/commonConfig";
import defaultBackground from "_dataview/share/components/common/backgroundDefault.js";
import { month } from "javascript-time-ago/gradation";
const defaultCustomThemeStyle = {
  "--dv-input-bg": "rgba(255,255,255,0)",
  "--dv-input-border-radius": [0, 0, 0, 0],
  "--dv-input-text-color": "rgba(255,255,255,1)",
  "--dv-input-border-color": "rgba(247,181,0,0.5)",
  "--dv-active-input-border-color": "rgba(247,181,0,1)",
  "--dv-select-dropdown-bg": "rgba(23,23,23,1)",
  "--dv-select-dropdown-text-color": "rgba(255,255,255,1)",
  "--dv-more-theme-date-range-more-wrap-date": "rgba(236,189,99,0.5)",
  "--dv-more-theme-active-tag-color": "rgba(0,0,0,1)",
  "--dv-more-theme-active-tag-bg": "rgba(236,189,99,1)",
};

export default dsf.component({
  name: "DsfDataViewTimeRange",
  ctrlCaption: "时间范围",
  mixins: [$mixins.dataView, themeMixin],
  components: {
    dataviewDateRangePicker,
    dataviewDateSinglePicker,
  },
  props: {
    //风格
    styleMapKey: {
      type: String,
      default: "timeRange",
    },
    customThemeStyle: {
      type: Object,
      default: () => defaultCustomThemeStyle,
    },
    totalWidth: {
      type: String,
      default: "280",
    },
    timeTextStyle: {
      type: Object,
      default() {
        return createCommonTextStyle({
          fontSize: 16,
        });
      },
    },
    //默认
    dateActive: {
      type: String,
      default: "month",
    },
    //报告期设置
    reportTab: {
      type: Array,
      default() {
        return [
          {
            name: "年度",
            value: "year",
            show: true,
            suffix: "YY",
            defaultDate: "2023,2023",
            showFormat: "",
            separator: "",
          },
          {
            name: "季度",
            value: "quarter",
            show: false,
            suffix: "SS",
            defaultDate: "202301,202302",
            showFormat: "",
            separator: "",
          },
          {
            name: "进度",
            value: "month",
            show: true,
            suffix: "MM",
            defaultDate: "202301,202302",
            showFormat: "",
            separator: "",
          },
          {
            name: "半年",
            value: "halfYear",
            show: false,
            suffix: "HY",
            defaultDate: "202301,202302",
            showFormat: "",
            separator: "",
          },
          {
            name: "日期",
            value: "date",
            show: false,
            suffix: "",
            defaultDate: "20230101,20230102",
            showFormat: "",
            separator: "",
          },
          {
            name: "月旬",
            value: "periodMonth",
            show: false,
            suffix: "",
            defaultDate: "20230101,20230110",
            showFormat: "",
            separator: "",
          },
        ];
      },
    },
    height: {
      type: [String, Number],
      default: "auto",
    },
    inputHeight: {
      type: String,
      default: "40px",
    },
    align: {
      type: String,
      default: "left",
    },
    padding: {
      type: Array,
      default: () => [8, 6, 8, 6],
    },
    show: {
      type: Boolean,
      default: true,
    },
    labelShow: {
      type: Boolean,
      default: true,
    },
    //字体颜色是否依赖于风格
    fontDependent: {
      type: Boolean,
      default: true,
    },
    //背景是否依赖于风格
    backgroundDependent: {
      type: Boolean,
      default: true,
    },
    // 标签字体样式
    labelTextStyle: {
      type: Object,
      default() {
        return createCommonTextStyle({
          fontSize: 16,
        });
      },
    },
    //激活标签字体样式
    labelActiveTextStyle: {
      type: Object,
      default() {
        return createCommonTextStyle({
          fontSize: 16,
        });
      },
    },
    defaultBackground: {
      type: Object,
      default() {
        return { ...defaultBackground };
      },
    },
    activeBackground: {
      type: Object,
      default() {
        return { ...defaultBackground };
      },
    },
    //存在事件依赖
    hasEventRelative: {
      type: Boolean,
      default: true,
    },
    //事件依赖
    eventRelativeDeal: {
      type: Object,
      default() {
        return {
          change: {
            relatives: [],
            fn: eventTemp,
          },
        };
      },
    },
    // 整体背景
    controlBackgroundConfig: {
      type: Object,
      default() {
        return { ...defaultBackground };
      },
    },
    nameTextStyle: {
      type: Object,
      default: () => ({
        isShow: false,
        content: "时间：",
        fontSize: "16",
        fontFamily: "Microsoft Yahei",
        fontWeight: "normal",
        fontStyle: "normal",
        color: "#fff",
      }),
    },
  },
  data() {
    return {
      allowDateObj: {
        year: "",
        quarter: "",
        month: "",
        halfYear: "",
        date: "",
        periodMonth: "",
      },
      key: dsf.uuid(),
      activeBtnItem: this.dateActive,
      year: [],
      quarter: [],
      oneQuarter: "",
      oneHalfYear: "",
      onePeriodMonth: "",
      halfYear: [],
      month: [],
      day: [],
      periodMonth: [],
      componentType: "date",
    };
  },
  watch: {
    dateActive() {
      this.activeBtnItem = this.dateActive;
      this.changeDateEvent();
    },
    reportTab: {
      handler(v) {
        let isReset = false;
        v.forEach((item) => {
          if (item.value === this.dateActive) {
            if (!item.show) isReset = true;
          }
        });
        if (isReset) {
          for (let i = 0; i < v.length; i++) {
            if (v[i].show) {
              this.dateActive = v[i].value;
              break;
            }
          }
        }
        this.changeDateEvent();
      },
      deep: true,
    },
  },
  mounted() {
    //默认触发一次change 事件
    this.$nextTick(() => {
      this.handleEventScope();
      this.changeDateEvent();
    });
  },
  computed: {
    popperClass(){
      return `data-view-select-theme__popper ${this.themeStyleName}`
    },
    labelStyle() {
      return dsf.dataview.utils.transformTextStyle(this.nameTextStyle);
    },
    $slotStyle() {
      let nowConfig = this.specialAddStyle(false);
      return {
        ...nowConfig,
        ...this.controlOuterStyle,
      };
    },
    barInnerStyle(){
      let style = {
        height: dsf.dataview.utils.transformPx(this.inputHeight),
      }
      return style;
    },
    dateThemeStyle() {
      const timeTextStyle = dsf.dataview.utils.transformTextStyle(
        this.timeTextStyle
      );
      return {
        ...timeTextStyle,
        width: dsf.dataview.utils.transformPx(this.totalWidth, false),
      };
    },
    commonShowFormat() {
      return (type) => {
        let defaultFormatMap = {
          year: "yyyy年",
          quarter: "yyyy年MM季度",
          month: "yyyy年MM月",
          halfYear: "yyyy年M半年",
          date: "yyyy年MM月dd日",
          periodMonth: "yyyy年MM月dd",
        };
        let format = "";
        let defaultFormat = defaultFormatMap[type];
        let reportTab = this.reportTab;
        let current = reportTab.find((it) => it.value === type);
        if (current) {
          format = current.showFormat;
        }
        return format || defaultFormat;
      };
    },
    commonValueFormat() {
      return (type) => {
        let defaultFormatMap = {
          year: ["yyyy"],
          quarter: ["yyyy", "MM"],
          month: ["yyyy", "MM"],
          halfYear: ["yyyy", "MM"],
          date: ["yyyy", "MM", "dd"],
          periodMonth: ["yyyy", "MM", "dd"],
        };
        let reportTab = this.reportTab;
        let current = reportTab.find((it) => it.value === type);
        let separator = current.separator || "";
        let valueFormat = defaultFormatMap[type].join(separator);
        return valueFormat;
      };
    },
  },
  methods: {
    // 复制组件样式
    copyComponentStyle() {
      return {
        _props: this.getComponentStyle(),
        // 固定为数组格式，按主、次顺序
        textStyles: [this.labelTextStyle],
        backgrounds: [this.controlBackgroundConfig],
      };
    },
    // 粘贴组件样式
    pasteComponentStyle(config) {
      let groups = this.$designer.attributesGroup.filter(it => !/数据|属性|插槽/.test(it.name));
      if (config._props.ctrlName !== this.ctrlName) {
        groups = groups.filter(it => /布局|边框设置|背景|入场动画/.test(it.name));
        const { textStyles = [], textAligns = [], backgrounds = [] } = config;
        this.updateComponentStyle("labelTextStyle", textStyles[0]);
        this.updateComponentStyle("controlBackgroundConfig", backgrounds[0]);
      }
      this.setComponentStyle(groups, config._props);
    },
    getBtnItemStyle(row) {
      let defaultStyle = dsf.dataview.utils.transformTextStyle(
        this.labelTextStyle
      );
      let activeStyle = dsf.dataview.utils.transformTextStyle(
        this.labelActiveTextStyle
      );
      if (this.fontDependent) {
        Reflect.deleteProperty(defaultStyle, "color");
        Reflect.deleteProperty(activeStyle, "color");
      }
      if (!this.backgroundDependent) {
        const defaultBackground = this.dvBackgroundFormat(
          this.defaultBackground
        );
        const activeBackground = this.dvBackgroundFormat(this.activeBackground);
        defaultStyle = {
          ...defaultStyle,
          ...defaultBackground,
        };
        activeStyle = {
          ...activeStyle,
          ...activeBackground,
        };
      }

      if (row.value === this.activeBtnItem) {
        return activeStyle;
      }
      return defaultStyle;
    },
    //获取值
    handleGetValue() {
      return this.currentComponentData;
    },
    // 获取当前类型
    handleGetType() {
      return this.activeBtnItem;
    },
    handleActiveType(arr) {
      let str = arr[0] || "";
      let length = str.length;
      let year = str.slice(0, 4);
      let yearQ = str.slice(4, length);
      return {
        year,
        quarter: yearQ,
      };
    },
    changeDateEvent(reportTab = this.reportTab, isPseudo = false) {
      this.key = dsf.uuid();
      let activeBtnItem = this.activeBtnItem;
      let current = reportTab.find((it) => it.value == activeBtnItem);
      let separator = current.separator;
      let currentDate = current.defaultDate;
      let suffix = current.suffix;
      let data = "";
      let $currentDate = currentDate.split(",");
      $currentDate = this.handleSeparator($currentDate, separator);
      data = $currentDate.map((it) => it + suffix).join(",");
      switch (activeBtnItem) {
        case "year":
          this.year = $currentDate;
          break;
        case "halfYear":
          this.halfYear = $currentDate;
          if (this.halfYear.length === 1) {
            this.oneHalfYear = this.halfYear[0];
          }
          break;
        case "quarter":
          this.quarter = $currentDate;
          if (this.quarter.length === 1) {
            this.oneQuarter = this.quarter[0];
          }
          break;
        case "month":
          this.month = $currentDate;
          break;
        case "date":
          this.day = $currentDate;
          break;
        case "periodMonth":
          this.periodMonth = $currentDate;
          if (this.periodMonth.length === 1) {
            this.onePeriodMonth = this.periodMonth[0];
          }
          break;
      }
      if (!isPseudo) {
        this.loadChangeEvents(data);
      }
    },
    handleSeparator(currentDate, separator) {
      return currentDate.map((item) => {
        let one = item.slice(0, 4);
        let two = item.slice(4, 6);
        let three = item.slice(6, 8);
        let arr = [one, two, three];
        return arr.filter(Boolean).join(separator);
      });
    },
    getReportCurrent() {
      let activeBtnItem = this.activeBtnItem;
      let current = this.reportTab.find((it) => it.value == activeBtnItem);
      return current;
    },
    changeCommon(currentDate) {
      const { suffix } = this.getReportCurrent();
      let data = currentDate + suffix;
      this.loadChangeEvents(data);
    },
    changeOneCommon(val, type) {
      const { suffix } = this.getReportCurrent();
      let data = `${val}${this[type].quarter}${suffix}`;
      this.loadChangeEvents(data);
    },
    changeSelect(val, type) {
      const { suffix } = this.getReportCurrent();
      let data = `${this[type].year}${val}${suffix}`;
      this.loadChangeEvents(data);
    },
    changeRange(currentDate) {
      const { suffix } = this.getReportCurrent();
      let data = currentDate.map((it) => it + suffix).join(",");
      this.loadChangeEvents(data);
    },
    loadChangeEvents(data) {
      data = data.split(",");
      this.$emit("changeData", data);
      try {
        let { fn } = this.eventRelativeDeal.change;
        this.currentComponentData = data;
        this.handleCommonEmit(fn, data);
      } catch (e) {
        console.error(e);
      }
    },
    checkBtnItems(val) {
      if (this.activeBtnItem === val) {
        return;
      }
      this.activeBtnItem = val;
      this.changeDateEvent();
    },
    specialAddStyle(isInit = true) {
      if (this.relationStyle) {
        return {};
      }
      let nowConfig = dsf.mix(
        true,
        {},
        defaultCustomThemeStyle,
        this.customThemeStyle
      );
      nowConfig[
        "--dv-input-border-radius"
      ] = dsf.dataview.utils.transformArrayPx(
        nowConfig["--dv-input-border-radius"]
      );
      if (isInit) {
        this.$emit("update:customThemeStyle", nowConfig);
      }
      this.addStyle(nowConfig);
      return nowConfig;
    },
    // 设置当前值
    handleSetValue(type, val) {
      if (val && type === this.activeBtnItem) {
        let current = this.reportTab.find((it) => it.value == type);
        val = val + "";
        let separator = "";
        if (type !== "year" && val.includes("/")) {
          separator = "/";
          val = val.replaceAll("/", "");
        } else if (type !== "year" && val.includes("-")) {
          separator = "-";
          val = val.replaceAll("-", "");
        }
        if (current) {
          current.separator = separator;
          current.defaultDate = val;
          this.changeDateEvent(this.reportTab, true);
        }
      }
      return this;
    },
    // 只选择今年
    handleAllowNowYear(type) {
      let year = new Date().getFullYear();
      if (type === "year") {
        this.allowDateObj[type] = year + "";
      } else if (type === "quarter") {
        this.allowDateObj[type] = [[`${year}01`, `${year}04`]];
      } else if (type === "halfYear") {
        this.allowDateObj[type] = [[`${year}01`, `${year}02`]];
      } else if (type === "month") {
        this.allowDateObj[type] = [[`${year}01`, `${year}12`]];
      } else if (type === 'date') {
        this.allowDateObj[type] = [[`${year}0101`, `${year}1231`]];
      } else if (type === 'periodMonth') {
        this.allowDateObj[type] = [[`${year-1}1220`, `${year}1220`]];
      }
      return this;
    },
    // 自定义时间
    handleAllowCustomYear(type, val) {
      this.allowDateObj[type] = val;
      return this;
    },
    clearDisabled(type) {
      if (type) {
        this.allowDateObj[type] = "";
      } else {
        Object.keys(this.allowDateObj).forEach((key) => {
          this.allowDateObj[key] = "";
        });
      }
      return this;
    },
    addBeforeZero(str) {
      return str.toString().padStart(2, "0")
    },
    disabledDateFn(current, type) {
      let allowAny = this.allowDateObj[type];
      let isArray = Array.isArray(allowAny);
      let currentYear = current.getFullYear();
      let currentMoth = current.getMonth() + 1;
      let day = current.getDate();
      const formattedMonth = this.addBeforeZero(currentMoth);
      const formattedDay = this.addBeforeZero(day);
      if (!allowAny) {
        return false;
      }
      let diffVal = "";
      if (type === "year") {
        diffVal = currentYear;
      } else if (["quarter", "halfYear", "month"].indexOf(type) > -1) {
        diffVal = currentYear + formattedMonth;
      } else if (["date", "periodMonth"].indexOf(type) > -1) {
        diffVal = currentYear + formattedMonth + formattedDay;
      }
      if (typeof allowAny === "string") {
        return diffVal * 1 !== allowAny * 1;
      } else if (isArray) {
        let strArr = [];
        allowAny.forEach((item) => {
          if (typeof item === "string") {
            strArr.push(`${diffVal * 1} !== ${item * 1}`);
          } else if (Array.isArray(item)) {
            let before = item[0];
            let after = item[1];
            if (!before && after) {
              strArr.push(`(${diffVal}>${after})`);
            } else if (before && !after) {
              strArr.push(`(${diffVal}<${before})`);
            } else {
              strArr.push(`(${diffVal}<${before} || ${diffVal}>${after})`);
            }
          }
        });
        let result = "return " + strArr.join("&&");
        let flagFn = new Function(result);
        return flagFn();
      }
      return false;
    },
  },
});
</script>
<style lang="scss">
@import "_dataview/assets/styles/share/components/DsfDataViewTimeRange.scss";
</style>
