<!--
 * @Description: 普通级联下拉选
 * @Author: shenah
 * @Date: 2024-11-20 09:16:16
 * @LastEditors: shenah
 * @LastEditTime: 2025-02-14 14:11:00
-->

<template>
  <div
    class="data-view-cascader data-view-item-wrap ds-control data-view-no-padding data-view-common-bg-effect"
    v-loading="dataLoad"
    :element-loading-text="loadingText"
    :element-loading-spinner="loadingSpinner"
    :element-loading-background="loadingBackground"
    :style="cascaderStyle"
    :class="[relationStyle ? 'data-view-select-theme' : 'not-relation']"
  >
    <div
      class="inner-cascader data-view-common-bg-effect"
      :style="innerCascaderStyle"
    >
      <div class="area-label" v-if="isShowName" :style="areaLabelStyle">
        {{ nameContent }}
      </div>
      <el-cascader
        ref="cascader"
        v-model="currentValue"
        :options="lazyFLag ? null : data"
        class="current-cascader"
        clearable
        :show-all-levels="showAllLevels"
        :props="cascaderProps"
        filterable
        :popper-class="
          [
            'data-view-select-theme__popper',
            themeStyleName,
            dropDownClass,
            'data-view-current-cascader-popper',
          ].join(' ')
        "
        @change="handleCascaderChange"
        :style="currentCascaderStyle"
      >
      </el-cascader>
    </div>
  </div>
</template>

<script>
const staticDataKeyDic = {
  id: "主键",
  pid: "父主键",
  label: "名称",
  value: "值",
};
const staticData = [
  {
    id: "0",
    pid: "null",
    label: "梦创双杨",
    value: "mcsy",
    children: [
      {
        id: "1",
        pid: "0",
        label: "北京研发中心",
        value: "bjyfzx",
        children: [
          {
            id: "111",
            pid: "1",
            label: "后端开发",
            value: "hdkf",
            children: [],
          },
        ],
      },
      {
        id: "2",
        pid: "0",
        label: "成都研发中心",
        value: "cdyfzx",
        children: [
          {
            id: "211",
            pid: "2",
            label: "大屏小组",
            value: "dpxz",
            children: [],
          },
          {
            id: "212",
            pid: "2",
            label: "产品小组",
            value: "cpxz",
            children: [],
          },
        ],
      },
      {
        id: "3",
        pid: "0",
        label: "上海研发中心",
        value: "shyfzx",
        children: [],
      },
    ],
  },
];
const defaultCustomThemeStyle = {
  "--dv-select-dropdown-bg": "rgba(23,23,23,1)",
  "--dv-select-dropdown-border-radius": "10px 10px 10px 10px",
  "--dv-select-dropdown-text-color": "rgba(255,255,255,1)",
  "--dv-active-select-dropdown-bg": "rgba(255,255,255,0.1)",
  "--dv-active-multiple-dropdown-text-color": "rgba(236,189,99,1)",
  "--dv-select-dropdown-bg-box-shadow": "none",
  "--dv-select-dropdown-border-color": "rgba(255,255,255,0)",
  "--dv-select-dropdown-arrow-display": "none",
  "--dv-select-dropdown-scrollbar-color": "rgba(255,255,255,0)",
};
import { eventTemp } from "_dataview/output/utils/relativeEvent";
import dataAnalysis from "_dataview/mixins/dataAnalysis.js";
import { createCommonTextStyle } from "_dataview/output/config/commonConfig";
import themeMixin from "_dataview/mixins/moreThemeMixin.js";
export default dsf.component({
  name: "DsfDataViewCascader",
  ctrlCaption: "级联下拉框",
  mixins: [$mixins.dataView, dataAnalysis, themeMixin],
  props: {
    //风格对应组件key和区域级联组件key相同
    styleMapKey: {
      type: String,
      default: "areaCascader",
    },
    width: {
      type: String,
      default: "auto",
    },
    customThemeStyle: {
      type: Object,
      default: () => defaultCustomThemeStyle,
    },
    borderConfig: {
      type: Object,
      default: () => ({
        border: "1px solid #DCDFE6",
        commonBorderWidth: 1,
        commonBorderColor: "#DCDFE6",
        commonBorderStyle: "solid",
      }),
    },
    dropDownClass: {
      type: String,
      default: "",
    },
    borderRadius: {
      type: Array,
      default() {
        return [0, 0, 0, 0];
      },
    },
    height: {
      type: String,
      default: "auto",
    },
    padding: {
      type: Array,
      default: () => [8, 6, 8, 6],
    },
    backgroundConfig: {
      type: Object,
      default: () => ({
        active: "page",
        pattern: {
          image: "",
          size: "100% 100%",
          repeat: "no-repeat",
          position: "left center",
        },
      }),
    },
    align: {
      type: String,
      default: "center",
    },
    vAlign: {
      type: String,
      default: "flex-start",
    },
    isShowName: {
      type: Boolean,
      default: true,
    },
    nameContent: {
      type: String,
      default: "名称：",
    },
    nameTextStyle: {
      type: Object,
      default: () =>
        createCommonTextStyle({
          fontSize: "16",
        }),
    },
    selectWidth: {
      type: String,
      default: "200",
    },
    selectTextStyle: {
      type: Object,
      default: () => ({
        fontSize: "16",
        fontFamily: "Microsoft Yahei",
        fontWeight: "normal",
        fontStyle: "normal",
      }),
    },
    selectHeight: {
      type: String,
      default: "40",
    },
    placeholder: {
      type: String,
      default: "请选择",
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    lazy: {
      type: Boolean,
      default: false,
    },
    // 输入框中是否显示选中值的完整路径
    showAllLevels: {
      type: Boolean,
      default: true,
    },
    // 是否可选择任意一级
    checkStrictly: {
      type: Boolean,
      default: false,
    },
    totalLevel: {
      type: Number,
      default: 3,
    },
    //是否是数结构数据
    isTreeData: {
      type: Boolean,
      default: false,
    },
    userValue: {
      type: String,
      default: "",
    },
    staticData: {
      type: Array,
      default: () => staticData,
    },
    excelData: {
      type: Array,
      default: () => {
        let data = dsf.dataview.utils.flatTree([...staticData]);
        return dsf.dataview.utils.transformToExcelData(data, staticDataKeyDic);
      },
    },
    mainKey: {
      type: String,
      default: "null",
    },
    mapRelations: {
      type: Array,
      default() {
        return [
          {
            text: "父主键",
            value: "pid",
            map: "pid",
            hideDigit: true,
          },
          {
            text: "主键",
            value: "id",
            map: "id",
            hideDigit: true,
          },
          {
            text: "名称",
            value: "label",
            map: "label",
            hideDigit: true,
          },
          {
            text: "值",
            value: "value",
            map: "value",
            hideDigit: true,
          },
          {
            text: "集合",
            value: "children",
            map: "children",
            hideDigit: true,
          },
        ];
      },
    },
    //存在事件依赖
    hasEventRelative: {
      type: Boolean,
      default: true,
    },
    eventRelativeDeal: {
      type: Object,
      default: () => ({
        mounted: {
          relatives: [],
          fn: eventTemp,
        },
        //数据加载完成事件
        dataLoad: {
          relatives: [],
          fn: eventTemp,
        },
        //数据处理完成事件
        load: {
          relatives: [],
          fn: eventTemp,
        },
        change: {
          relatives: [],
          fn: eventTemp,
        },
        click: {
          relatives: [],
          fn: eventTemp,
          hidden: true,
        },
        // 鼠标移入事件
        mouseenter: {
          relatives: [],
          fn: eventTemp,
          hidden: true,
        },
        // 鼠标移除事件
        mouseleave: {
          relatives: [],
          fn: eventTemp,
          hidden: true,
        },
      }),
    },
  },
  components: {},
  data() {
    return {
      currentValue: "",
      componentType: "cascader",
      lazyObj: {
        node: null,
        resolve: null,
      },
    };
  },
  computed: {
    getPid() {
      return this.dataType === "static" ? "pid" : this.mapRelations[0].map;
    },
    getId() {
      return this.dataType === "static" ? "id" : this.mapRelations[1].map;
    },
    getChildrenField() {
      return this.dataType === "static"
        ? "children"
        : this.mapRelations[4].map || "children";
    },
    lazyFLag() {
      return (
        this.lazy && this.dataType !== "excel" && this.dataType !== "static"
      );
    },
    cascaderProps() {
      return {
        label: this.dataType === "static" ? "label" : this.mapRelations[2].map,
        value: this.dataType === "static" ? "value" : this.mapRelations[3].map,
        children: this.getChildrenField,
        multiple: this.multiple,
        emitPath: false, // 这里直接返回最后一层因为在后面处理是把所有的数据都给了依赖事件
        checkStrictly: this.checkStrictly,
        lazy: this.lazyFLag,
        lazyLoad: this.lazyLoadData,
      };
    },
    cascaderStyle() {
      return {
        width: dsf.dataview.utils.transformPx(this.width),
        height: dsf.dataview.utils.transformPx(this.height),
        ...this.marginAndPadding,
        ...this.dvBackgroundFormat(this.backgroundConfig, {
          isBgInfoVar: true,
        }),
        ...this.getBoxShadowConfig(true),
        ...this.getCommonEnterAnimateStyle,
      };
    },
    innerCascaderStyle() {
      let style = {
        justifyContent: this.align,
      };
      return style;
    },
    areaLabelStyle() {
      const textStyle = dsf.dataview.utils.transformTextStyle(
        this.nameTextStyle
      );
      let style = {
        ...textStyle,
      };
      return style;
    },
    currentCascaderStyle() {
      const selectTextStyle = dsf.dataview.utils.transformTextStyle(
        this.selectTextStyle
      );
      let borderRadius = dsf.dataview.utils.transformArrayPx(this.borderRadius);
      let style = {
        pointerEvents: this.isDesign ? "none" : "auto",
        width: dsf.dataview.utils.transformPx(this.selectWidth),
        height: dsf.dataview.utils.transformPx(this.selectHeight),
        ...selectTextStyle,
        "--dv-input-border-radius": borderRadius,
      };
      if (!this.relationStyle) {
        style["--dv-input-border-width"] =
          this.borderConfig.commonBorderWidth + "px";
        style["--dv-input-border-color"] = this.borderConfig.commonBorderColor;
        style["--dv-input-border-style"] = this.borderConfig.commonBorderStyle;
        style["--dv-input-text-color"] = this.selectTextStyle.color;
      }
      return style;
    },
  },
  watch: {
    selectHeight: {
      handler(val) {
        if (val.includes("%")) {
          this.$emit("update:height", "100%");
        } else {
          this.$emit("update:height", "auto");
        }
      },
      immediate: true,
    },
  },
  created() {
    if(!this.lazy){
      this.initUserValue();
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.handleEventScope();
    });
  },
  methods: {
    // 复制组件样式
    copyComponentStyle() {
      return {
        _props: this.getComponentStyle(),
        // 固定为数组格式，按主、次顺序
        textStyles: [this.nameTextStyle, this.selectTextStyle],
        backgrounds: [this.backgroundConfig],
      };
    },
    // 粘贴组件样式
    pasteComponentStyle(config) {
      let groups = this.$designer.attributesGroup.filter(it => !/数据|属性|插槽/.test(it.name));
      if (config._props.ctrlName !== this.ctrlName) {
        groups = groups.filter(it => /布局|边框设置|背景|入场动画/.test(it.name));
        const { textStyles = [], backgrounds = [] } = config;
        this.updateComponentStyle("nameTextStyle", textStyles[0]);
        this.updateComponentStyle("selectTextStyle", textStyles[1]);
        this.updateComponentStyle("backgroundConfig", backgrounds[0]);
      }
      this.setComponentStyle(groups, config._props);
    },
    initUserValue() {
      let val = this.userValue.trim();
      if (this.multiple) {
        //多选用逗号分隔
        this.currentValue = val.split(",");
      } else {
        //单选
        this.currentValue = val;
      }
    },
    dataAnalysis(data) {
      let lazyObj = this.lazyObj;
      if (this.lazyFLag && lazyObj.resolve) {
        let node = lazyObj.node;
        let level = node.level;
        let nowLevel = level + 1;
        let newData = data.map((item) => {
          let obj = {
            ...item,
            leaf: nowLevel >= this.totalLevel,
          };
          return obj;
        });
        if (!data.length) {
          node.data.leaf = true;
        }
        lazyObj.resolve(newData);
        lazyObj.resolve = null;
        lazyObj.node = null;
        return;
      }
      if (!data.length) {
        this.hasData = false;
        return;
      }
      if (eval(this.dynamicRules)) {
        if ((!this.isTreeData || this.dataType === "excel") && !this.lazyFLag) {
          let treeData = dsf.dataview.utils.establishTree(
            data,
            this.mainKey,
            this.getId,
            this.getPid,
            this.getChildrenField,
            false
          );
          this.data = treeData;
        } else {
          this.data = data;
        }
      } else {
        if (this.$listeners["interceptOptions"]) {
          this.$dispatch("interceptOptions", { data: data, vm: this });
        }
      }
    },
    lazyLoadData(node, resolve) {
      if (node.root) {
        this.lazyObj.resolve = resolve;
        this.lazyObj.node = node;
        return;
      }
      let mapMethod = {
        datasource: "handleUpdateDataSourceParams",
        combineTable: "handleUpdateParams",
        interface: "handleUpdateInterfaceParams",
      };
      let fn = mapMethod[this.dataType];
      if (fn) {
        let parentKey = this.mapRelations[0].map;
        let key = this.mapRelations[3].map;
        let data = node.data;
        this[fn](parentKey, data[key]);
        this.lazyObj.resolve = resolve;
        this.lazyObj.node = node;
      } else {
        resolve([]);
      }
    },
    handleCascaderChange() {
      let result = this.handleValueToUser();
      this.$dispatch("change", result);
      this.loadChangeEvents(result);
    },
    handleValueToUser() {
      let nodeArr = this.$refs.cascader.getCheckedNodes();
      let result = [];
      nodeArr.forEach((node) => {
        let lastItem = node.data;
        let pathData = node.pathNodes.map((item) => ({
          ...item.data,
          children: undefined,
        }));
        result.push({
          ...lastItem,
          allPathData: pathData,
        });
      });
      return result;
    },
    specialAddStyle() {
      let nowConfig = dsf.mix(
        true,
        {},
        defaultCustomThemeStyle,
        this.customThemeStyle
      );
      nowConfig[
        "--dv-select-dropdown-border-radius"
      ] = dsf.dataview.utils.transformArrayPx(
        nowConfig["--dv-select-dropdown-border-radius"]
      );
      this.addStyle(nowConfig);
    },
  },
});
</script>
<style lang="scss">
@import "_dataview/assets/styles/share/components/cascader.scss";
</style>
