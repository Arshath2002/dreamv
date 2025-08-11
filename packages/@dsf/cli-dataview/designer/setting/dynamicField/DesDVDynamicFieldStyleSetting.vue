<!--
 * @Description: 额外的动态字段、颜色、字体、图标等配置
 * @Author: shenah
 * @Date: 2023-03-30 09:06:14
 * @LastEditors: shenah
 * @LastEditTime: 2024-04-12 17:30:37
-->

<template>
  <div class="des-dv-dynamic-field-style-setting">
    <SettingDataOrigin
      class="data-setting"
      :owner="owner"
      @update-field-list="clearMapFieldList"
    ></SettingDataOrigin>
    <div class="config-wrap">
      <!-- 主体部分必须显示 -->
      <template v-if="mainConfigs.length && mainObj">
        <div class="header-title">标题内容</div>
        <el-form :mode="mainObj" :inline="true" :show-message="false">
          <el-form-item
            :label="item.name"
            v-for="item in mainConfigs"
            :key="item.key"
            class="no-margin-bottom"
          >
            <el-input
              v-model="mainObj[item.key]"
              v-if="item.type === 'input'"
              size="small"
            ></el-input>
            <SelectInput
              v-else-if="item.type === 'fieldInput'"
              v-model="mainObj[item.key]"
              :mapFieldList="mapFieldList"
            />
          </el-form-item>
        </el-form>
      </template>
      <DynamicFieldStyle
        :currentData="currentData"
        :mapFieldList="mapFieldList"
        ref="dynamicFieldStyleRef"
        :owner="owner"
        :config="config"
        :title="config.dyTitle"
      ></DynamicFieldStyle>
    </div>
  </div>
</template>
<script>
/**
 * 对于传入currentData的说明
 * mainConfigs 主体配置里面是 name,key,type
 * dynamicConfigs 额外新增显示的字段 name,key,type,isMust
 * operateRights 操作权限 extra,insert,del,up,down 采用叠加
 * isMainMixins 是否进行mainConfigs与默认配置混合
 * isDynamicMixins 是否进行dynamicConfigs与默认配置混合
 * mainObj 主体配置的详情style相关
 * attachArr 额外增加字段的配置详情style相关
 */
import { mainFieldConfigList } from "./defaultConfig";
import dataAnalysisOptionHelper from "../dataAnalysisOptionHelper.js";
const SettingDataOrigin = Vue.defineAsyncComponent(() =>
  import(
    /* webpackChunkName: "dataview_design_private" */ "../settingDataOrigin"
  )
);
const DynamicFieldStyle = Vue.defineAsyncComponent(() =>
  import(
    /* webpackChunkName: "dataview_design_private" */ "./dynamicFieldStyle.vue"
  )
);
export default {
  name: "DesDVDynamicFieldStyleSetting",
  components: { DynamicFieldStyle, SettingDataOrigin },
  mixins: [$mixins.propertyDialogSetting, dataAnalysisOptionHelper],
  computed: {},
  created() {
    this.initConfig();
    this.initData();
  },
  data() {
    return {
      isHasMainConfigs: false,
      isMainMixins: false,
      originMainConfigs: [],
      mainConfigs: [],
      mainObj: {
        firstNameKey: "",
        secondValueKey: "",
      },
    };
  },
  methods: {
    initConfig() {
      // 初始化配置
      let isMainMixins = this.currentData.isMainMixins;
      let main = this.currentData.mainConfigs;
      if (Array.isArray(main)) {
        this.originMainConfigs = _.cloneDeep(main);
        if (isMainMixins) {
          main = [...mainFieldConfigList, ...main];
        }
        this.isHasMainConfigs = true;
      } else {
        this.isHasMainConfigs = false;
        main = _.cloneDeep(mainFieldConfigList);
      }
      this.mainObj = this.dynamicCreateForm(main);
      this.mainConfigs = main;
    },
    dynamicCreateForm(arr) {
      // 动态生成form
      let obj = {
        uuid: dsf.uuid(),
      };
      arr.forEach((item) => {
        let defaultValue = "";
        if (item.type === "color") {
          defaultValue = null;
        } else if (["ruleColor", "ruleIcon"].indexOf(item.type) > -1) {
          defaultValue = {
            defaultValue: "",
            ruleList: [],
          };
        } else if (["prefix"].indexOf(item.type) > -1) {
          defaultValue = {
            defaultValue: "",
            selectType: "icon",
            ruleList: [],
          };
        } else if (item.type === "rule") {
          item.key.split(",").forEach((key) => {
            obj[key] = {
              defaultValue: "",
              ruleList: [],
            };
          });
        } else if (item.type === "layoutMethods") {
          defaultValue = 24;
        }
        obj[item.key] = defaultValue;
      });
      return obj;
    },
    initData() {
      const { mainObj } = this.currentData;
      this.mainObj = mainObj;
    },
    yes() {
      this.beforeYes();
      let obj = {};
      if (this.mainObj) {
        obj = {
          mainObj: this.mainObj,
        };
      }
      if (this.isHasMainConfigs) {
        obj.mainConfigs = this.originMainConfigs;
      }
      if (this.isMainMixins) {
        obj.isMainMixins = this.isMainMixins;
      }
      let dynamicObj =
        this.$refs.dynamicFieldStyleRef.getDynamicFieldStyleObj();
      let resultObj = {
        ...obj,
        ...dynamicObj,
      };
      resultObj.__changeType__ = `${this.config.componentType || ""}Pop`.trim();
      return resultObj;
    },
    clearMapFieldList() {},
  },
};
</script>
<style lang="scss">
@import "_dataview/assets/styles/designer/dynamicFieldStyleSetting.scss";
</style>
