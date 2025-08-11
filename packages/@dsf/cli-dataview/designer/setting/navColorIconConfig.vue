<!--
 * @Description: 根据值的规则配置图标或者颜色
 * @Author: shenah
 * @Date: 2023-03-29 10:59:50
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-01-02 18:11:09
-->

<template>
  <div class="des-dv-nav-color-icon-config">
    <el-form :inline="true" label-width="76px" class="color-icon-config-form">
      <el-form-item label="默认颜色" v-if="hasColor && colorObj && iconImageType != 'image'">
        <el-color-picker show-alpha class="color-select" v-model="colorObj.defaultValue" size="small"></el-color-picker>
      </el-form-item>
      <div style="padding: 20px 0 0">
        <el-form-item label="展示位置">
          <el-select v-model="showPosition" size="small" class="common-width">
            <el-option :label="item.label" :value="item.value" v-for="item in showPositionOptions" :key="item.value"></el-option>
          </el-select>
        </el-form-item>
      </div>
      <div style="padding: 20px 0 0" v-if="iconImageType == 'both'">
        <el-form-item label="展示类型">
          <el-radio-group v-model="showType" class="common-width">
            <el-radio size="small" :label="item.value" v-for="item in showTypeOptions" :key="item.value">
              {{ item.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </div>
      <div v-if="showType === 'icon' && iconImageType != 'image'" style="padding: 20px 0 0">
        <el-form-item label="默认图标">
          <div class="icon-wrap">
            <div class="show-icon" v-if="iconObj.defaultValue">
              <DsfIcon class="select-icon" :name="iconObj.defaultValue"></DsfIcon>
              <i class="close el-icon-close" @click="clearIcon()"></i>
            </div>
            <el-button @click="selectIcon()" size="small">选择图标</el-button>
          </div>
        </el-form-item>
      </div>
      <template v-else-if="showType === 'img' && iconImageType != 'icon'">
        <div style="padding: 20px 0 20px">
          <el-form-item label="默认图片">
            <div class="img-wrap">
              <div class="show-img" v-if="judgeShowImg()">
                <img :src="dsf.url.getWebPath(imgObj.defaultValue.custom.image)" class="show-img-now" />
                <i class="close el-icon-close" @click="clearImg()"></i>
              </div>
              <el-button size="small" class="upload-btn" @click="openImg"> 上传 </el-button>
            </div>
          </el-form-item>
        </div>
        <el-form-item label="图片宽" v-if="showType === 'img' && judgeShowImg()">
          <el-input v-model="imgObj.imgWidth" size="small" class="common-width"></el-input>
        </el-form-item>
        <el-form-item label="图片高" v-if="showType === 'img' && judgeShowImg()">
          <el-input v-model="imgObj.imgHeight" size="small" class="common-width"></el-input>
        </el-form-item>
      </template>
    </el-form>
  </div>
</template>
<script>
export default {
  name: "NavColorIconConfig",
  mixins: [$mixins.propertyDialogSetting],
  props: {
    iconImageType: {
      type: String,
      default: "both",
    },
    hasColor: {
      type: Boolean,
      default: true,
    },
    backgroundTypes: {
      type: Array,
      default() {
        return [];
      },
    },
    currentData: {
      type: Object,
      default: () => ({
        field: "value",
        valueIconObj: {
          defaultValue: null,
          ruleList: [],
        },
        valueColorObj: {
          defaultValue: null,
          ruleList: [],
        },
        valueImgObj: {
          defaultValue: null,
          imgWidth: "20",
          imgHeight: "auto",
          ruleList: [],
        },
        valueShowType: "icon", // 展示的图标还是自定义图片
        valueShowPosition: "before", // 图标展示在前面还是后面
      }),
    },
  },
  data() {
    return {
      dynamicField: "value",
      showType: "icon",
      showPosition: "before",
      showTypeOptions: [
        {
          label: "图标",
          value: "icon",
        },
        {
          label: "图片",
          value: "img",
        },
      ],
      showPositionOptions: [
        {
          label: "上",
          value: "top",
        },
        {
          label: "右",
          value: "after",
        },
        {
          label: "下",
          value: "bottom",
        },
        {
          label: "左",
          value: "before",
        },
      ],
      iconObj: {
        defaultValue: null,
      },
      colorObj: {
        defaultValue: null,
      },
      imgObj: {
        defaultValue: null,
        imgWidth: "20",
        imgHeight: "auto",
      },
      tableData: [],
    };
  },
  created() {
    this.initData();
    if (this.iconImageType === "image") {
      this.showType = "img";
    } else if (this.iconImageType === "icon") {
      this.showType = "icon";
    }
  },
  methods: {
    initData() {
      const {
        valueIconObj,
        valueColorObj,
        valueImgObj = {
          defaultValue: null,
          imgWidth: "20",
          imgHeight: "auto",
          ruleList: [],
        },
        field = "value",
        valueShowType = "icon",
        valueShowPosition = "before",
      } = this.currentData;
      let iconRuleList = valueIconObj?.ruleList || [];
      let colorRuleList = valueColorObj?.ruleList || [];
      let imgRuleList = valueImgObj?.ruleList || [];
      let ruleList = this.handleData(iconRuleList, colorRuleList, imgRuleList);
      this.dynamicField = field;
      this.showType = valueShowType;
      this.showPosition = valueShowPosition;
      this.iconObj = _.cloneDeep(valueIconObj);
      this.colorObj = _.cloneDeep(valueColorObj);
      let nowImgObj = _.cloneDeep(valueImgObj);
      if (nowImgObj.defaultValue) {
        nowImgObj.defaultValue = dsf.dataview.utils.compatiblePathToExtendImg(nowImgObj.defaultValue);
      }
      this.imgObj = nowImgObj;
      this.tableData = ruleList;
    },
    handleData(iconRuleList, colorRuleList, imgRuleList) {
      let ruleList = [];
      // 处理颜色规则相关
      if (colorRuleList.length) {
        colorRuleList.forEach((item) => {
          let obj = {
            uuid: dsf.uuid(),
            rule: item.rule,
            color: item.value,
            icon: "",
            img: "",
            showType: item.showType || "icon",
            showPosition: item.showPosition || "before",
            imgWidth: item.imgWidth || "20",
            imgHeight: item.imgHeight || "auto",
          };
          ruleList.push(obj);
        });
      }
      // 处理icon
      if (iconRuleList.length) {
        iconRuleList.forEach((item) => {
          let one = ruleList.find((ruleObj) => ruleObj.rule === item.rule);
          if (one) {
            one.icon = item.value;
          } else {
            let obj = {
              uuid: dsf.uuid(),
              rule: item.rule,
              color: "",
              icon: item.value,
              img: "",
              showType: item.showType || "icon",
              showPosition: item.showPosition || "before",
              imgWidth: item.imgWidth || "20",
              imgHeight: item.imgHeight || "auto",
            };
            ruleList.push(obj);
          }
        });
      }
      // 处理自定义图片
      if (imgRuleList.length) {
        imgRuleList.forEach((item) => {
          let one = ruleList.find((ruleObj) => ruleObj.rule === item.rule);
          if (one) {
            one.img = dsf.dataview.utils.compatiblePathToExtendImg(item.value);
          } else {
            let obj = {
              uuid: dsf.uuid(),
              rule: item.rule,
              color: "",
              icon: "",
              img: dsf.dataview.utils.compatiblePathToExtendImg(item.value),
              showType: item.showType || "icon",
              showPosition: item.showPosition || "before",
              imgWidth: item.imgWidth || "20",
              imgHeight: item.imgHeight || "auto",
            };
            ruleList.push(obj);
          }
        });
      }
      return ruleList;
    },
    selectIcon(row) {
      let self = this;
      let params = {};
      if (row) {
        params.icon = row.icon;
      } else {
        params.icon = this.iconObj.defaultValue || "";
      }
      this.$openDialog({
        title: "图标选择",
        content: "DsfSelectIcon",
        params,
        width: "980px",
        height: "60vh",
        btns: [
          {
            text: "确定",
            handler(res) {
              if (res && res.yes) {
                let i = res.yes();
                if (i) {
                  if (row) {
                    row.icon = i;
                  } else {
                    self.iconObj.defaultValue = i;
                  }
                }
              }
            },
          },
          {
            text: "取消",
          },
        ],
      });
    },
    judgeShowImg() {
      let defaultValue = this.imgObj.defaultValue;
      if (defaultValue && defaultValue.custom && defaultValue.custom.image) {
        return true;
      }
      return false;
    },
    openImg() {
      let currentData = this.imgObj.defaultValue;
      const backgroundTypes = this.backgroundTypes;
      this.$openDialog({
        title: "图片设置",
        content: "DesDVBgSettingExtend",
        width: "600px",
        height: "400px",
        params: {
          currentData,
          hasColor: false,
          onlyImage: true,
          backgroundTypes,
        },
        btns: [
          {
            text: "确定",
            handler: (res) => {
              let result = res.yes();
              if (result) {
                this.imgObj.defaultValue = result;
              }
            },
          },
        ],
      });
    },
    clearIcon(row) {
      if (row) {
        row.icon = "";
      } else {
        this.iconObj.defaultValue = "";
      }
    },
    clearImg(row) {
      if (row) {
        row.img = "";
      } else {
        this.imgObj.defaultValue = "";
      }
    },
    createOne() {
      return {
        uuid: dsf.uuid(),
        rule: "",
        color: "",
        icon: "",
        img: "",
        imgWidth: "20",
        imgHeight: "auto",
        showType: "icon",
        showPosition: "before",
      };
    },
    add() {
      // 新增
      this.tableData.push(this.createOne());
    },
    insert(scope) {
      // 插入
      this.tableData.splice(scope.$index + 1, 0, this.createOne());
    },
    deleted(scope) {
      dsf.array.remove(this.tableData, scope.row);
    },
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
    afterHandleData() {
      let obj = {
        colorRule: [],
        iconRule: [],
        imgRule: [],
      };
      this.tableData.forEach((item) => {
        let rule = item.rule;
        let oneColorRule = {
          rule,
          ...item,
          value: item.color,
        };
        let oneIconRule = {
          rule,
          ...item,
          value: item.icon,
        };
        let oneImgRule = {
          rule,
          ...item,
          imgWidth: item.imgWidth,
          imgHeight: item.imgHeight,
          value: item.img,
        };
        obj.colorRule.push(oneColorRule);
        obj.iconRule.push(oneIconRule);
        obj.imgRule.push(oneImgRule);
      });
      return obj;
    },
    yes() {
      // 过滤出名称与字段没有填的列表
      this.tableData = this.tableData.filter((item) => item.rule && (item.color || item.icon || item.img));
      let obj = this.afterHandleData();
      let { iconObj, colorObj, imgObj } = this;
      let valueIconObj = iconObj
        ? {
            defaultValue: iconObj.defaultValue,
            ruleList: obj.iconRule,
          }
        : null;
      let valueColorObj = colorObj
        ? {
            defaultValue: colorObj.defaultValue,
            ruleList: obj.colorRule,
          }
        : null;
      let valueImgObj = imgObj
        ? {
            defaultValue: imgObj.defaultValue,
            imgWidth: imgObj.imgWidth,
            imgHeight: imgObj.imgHeight,
            ruleList: obj.imgRule,
          }
        : null;
      return {
        valueShowType: this.showType,
        valueShowPosition: this.showPosition,
        valueIconObj,
        valueColorObj,
        valueImgObj,
      };
    },
  },
};
</script>
<style lang="scss">
@import "_dataview/assets/styles/designer/navColorIconConfig.scss";
</style>
