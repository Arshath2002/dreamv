<!--
 * @Description: 大屏弹框设置
 * @Author: zhanghang
 * @Date: 2023-11-21 15:34:37
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-07-22 17:55:19
-->
<template>
  <div class="des-dv-dialog-setting">
    <el-button class="add-btn" type="text" @click="add">新增弹框样式</el-button>
    <div class="dialog-list">
      <el-scrollbar class="dialog-scroller">
        <div class="dialog-item" v-for="(it, index) in tableData" :key="index">
          <div @click="deleted(it)" class="delete-icon" v-if="tableData.length > 1">
            <DsfIcon name="delete"></DsfIcon>
          </div>
          <!-- 弹框预览 -->
          <div class="dialog-item-view">
            <div class="dialog-item-instance" :style="getContentStyle(it)">
              <div class="dialog-item-title" :style="getTitleStyle(it)">
                <div class="dialog-item-title_inner" :style="getInnerTitleStyle(it)">弹框标题</div>
                <div class="dialog-item-title_icon" v-if="isImage(it)" :style="getIconStyle(it)">
                  <img class="img" :src="handleImgSrcStr(it.closeImgConfig)" :style="getIconImgStyle(it.closeImgConfig)" />
                </div>
                <div class="dialog-item-title_icon" v-else :style="getIconStyle(it)">
                  <DsfIcon
                    :style="{
                      fontSize: dsf.dataview.utils.transformPx(it.iconSize, false),
                    }"
                    :name="it.iconName"
                  ></DsfIcon>
                </div>
              </div>
              <div class="dialog-item-content" :style="getInnerContentStyle(it)">
                <div class="dialog-item-content-inner">弹框预览样式</div>
              </div>
            </div>
          </div>
          <!-- 弹框设置 -->
          <div class="dialog-item-setting" style="margin-left: 15px">
            <el-row>
              <el-col :span="12">
                <div class="property-item sign title">
                  <span>弹框标识</span>
                  <el-input size="small" v-model="it.id"></el-input>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="property-item">
                  <span>依赖风格：</span>
                  <DesDVSwitch v-model="it.relativeStyle" @change="changeRelativeStyle(it, index)" />
                </div>
              </el-col>
              <DesDVHorizonLine
                :config="{
                  spacingNumber: 2,
                  space: 20,
                }"
              ></DesDVHorizonLine>
              <el-col :span="24" v-if="!it.relativeStyle">
                <div class="property-item title">
                  <span>标题设置</span>
                </div>
              </el-col>
              <el-col :span="12" v-if="!it.relativeStyle">
                <div class="property-item">
                  <span>高度：</span>
                  <DesDVNumber :config="{ min: 12, unit: 'px' }" v-model="it.titleHeight" />
                </div>
              </el-col>
              <el-col :span="12" v-if="!it.relativeStyle">
                <div class="property-item flex-start">
                  <span>对齐：</span>
                  <DesDVTextAlign :value="getAlign(it)" @change="setAlign($event, it)" :config="alignConfig"></DesDVTextAlign>
                </div>
              </el-col>
              <!-- 新增 -->
              <el-col :span="12" v-if="!it.relativeStyle">
                <div class="property-item">
                  <span>背景颜色：</span>
                  <DesDVColorPicker v-model="it.titleBackground" />
                </div>
                <div class="property-item flex-start">
                  <span>背景图片：</span>
                  <DesDVMoreImg
                    v-model="it.titleBackground"
                    :config="{
                      limitImg: 1,
                      backgroundTypes: ['model', 'title'],
                    }"
                  />
                </div>
              </el-col>
              <el-col :span="12" v-if="!it.relativeStyle">
                <div class="property-item flex-start">
                  <span>字体：</span>
                  <DesDVTextStyle :value="it.textStyle" @change="setTitleFontStyle($event, it)"></DesDVTextStyle>
                </div>
              </el-col>
              <DesDVHorizonLine
                v-if="!it.relativeStyle"
                :config="{
                  spacingNumber: 2,
                  space: 20,
                }"
              ></DesDVHorizonLine>
              <el-col :span="24">
                <div class="property-item title">
                  <span>弹框设置</span>
                </div>
              </el-col>
              <el-col :span="12" v-if="!it.relativeStyle">
                <div class="property-item">
                  <span>弹框边框：</span>
                </div>
                <div class="property-item ml-20">
                  <span>颜色：</span>
                  <DesDVColorPicker class="dialog-border-color" v-model="it.borderColor" :config="borderConfig" />
                  <span>宽度：</span>
                  <DesDVNumber class="min" v-model="it.borderWidth" :config="{ min: 0, unit: 'px' }" />
                </div>
                <div class="property-item ml-20">
                  <span>圆角：</span>
                  <DesDVNumber class="min" v-model="it.borderRadius" :config="{ min: 0, unit: 'px' }" />
                </div>
              </el-col>

              <el-col :span="12" v-if="!it.relativeStyle">
                <div class="property-item">
                  <span>关闭图标：</span>
                  <div class="icon-image-wrapper">
                    <div class="img-wrap" v-if="it.closeImgConfig && it.closeImgConfig.imgObj.custom.image">
                      <img class="img" :src="handleImgSrcStr(it.closeImgConfig)" :style="getIconImgStyle(it.closeImgConfig)" />
                      <DsfIcon @click="it.closeImgConfig.imgObj.custom.image = ''" name="close" class="delete" />
                    </div>

                    <div class="icon-wrap" v-else>
                      <DsfIcon :name="it.iconName" :style="getIconStyle(it)"></DsfIcon>
                    </div>

                    <el-button class="btn" @click="selectCloseIcon(it)" size="small"> 选择 </el-button>
                  </div>
                </div>
                <div class="property-item ml-20" v-if="it.closeImgConfig && it.closeImgConfig.imgObj.custom.image">
                  <span>宽：</span>
                  <DesDVNumber v-model="it.closeImgConfig.width" :config="{ min: 0, unit: 'px' }" />
                  <span>高：</span>
                  <DesDVNumber v-model="it.closeImgConfig.height" :config="{ min: 0, unit: 'px' }" />
                </div>
                <div class="property-item ml-20" v-else>
                  <span>颜色：</span>
                  <DesDVColorPicker class="dialog-border-color" v-model="it.iconColor" :config="borderConfig" />
                  <span>大小：</span>
                  <DesDVNumber v-model="it.iconSize" :config="{ min: 0, unit: 'px' }" />
                </div>
                <div class="property-item ml-20">
                  <span>定位：</span>
                  <!-- 新字段 -->
                  <DesDVMargins v-model="it.iconPosition" :config="{ type: 'string' }" />
                </div>
              </el-col>
              <el-col :span="12" v-if="!it.relativeStyle">
                <div class="property-item flex-start">
                  <span>边距：</span>
                  <DesDVMarginsGroup :owner="it" :config="marginConfig"></DesDVMarginsGroup>
                </div>
              </el-col>
              <el-col :span="12" v-if="!it.relativeStyle">
                <div class="property-item">
                  <span>背景颜色：</span>
                  <DesDVColorPicker v-model="it.background" />
                </div>
                <div class="property-item flex-start">
                  <span>背景图片：</span>
                  <DesDVMoreImg v-model="it.background" :config="{ limitImg: 1 }" />
                </div>
              </el-col>
              <el-col :span="12">
                <div class="property-item flex-start">
                  <span>打开动画：</span>
                  <div style="position: relative; top: -4px">
                    <DesDVSwitch v-model="it.animate.flag" />
                    <template v-if="it.animate.flag">
                      <div style="margin: 10px 0">
                        <DesDVRadioGroup v-model="it.animate.class" :data="{ dictionary: animateOptions }"  @change="animateClassChange($event, it)"></DesDVRadioGroup>
                      </div>
                      <div class="property-item">
                        <span>打开至：</span>
                        <DesDVTextAlign
                          class="position-text-align"
                          :key="it.animate.class"
                          :value="it.position"
                          @change="setPositionAlign($event, it)"
                          :config="getPositionOptions(it)"
                        ></DesDVTextAlign>
                      </div>
                    </template>
                  </div>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="property-item flex-start">
                  <span>遮罩：</span>
                  <div style="position: relative; top: -4px">
                    <DesDVSwitch v-model="it.modal" />
                    <DesDVColorPicker v-if="it.modal" style="margin: 10px 0" :config="{ type: 'color' }" v-model="it.modalColor" />
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>
<script>
import { createCommonTextStyle } from "_dataview/output/config/commonConfig";

import createBackground from "_dataview/output/config/backgroundExtend.js";

const DesDVBgSettingExtend = Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_private" */ "./DesDVImage/DesDVBgSettingExtend.vue"));
const defaultConfig = {
  background: {
    active: "color",
    color: {
      // 选色方式 默认为空 单色色盘选择 color  线性渐变 linear  径向渐变 radial
      type: "color",
      //提供给渐变使用
      image: "",
      value: "rgba(16,75,157,0.6)",
    },
  },
  // 标题背景
  titleBackground: {
    active: "color",
    color: {
      // 选色方式 默认为空 单色色盘选择 color  线性渐变 linear  径向渐变 radial
      type: "color",
      //提供给渐变使用
      image: "",
      value: "rgba(16,75,157,0.6)",
    },
  },
  // 关闭图标定位
  iconPosition: ["auto", "auto", "auto", "auto"],
  relativeStyle: true, // 依赖风格
  //标题高度
  titleHeight: "40",
  //标题对齐
  align: "left",
  vectorAlign: "center",
  iconColor: "#FFF",
  iconSize: "16",
  iconName: "guanbi2",
  closeImgConfig: {
    imgObj: { ...createBackground(), active: "custom" },
    width: "13",
    height: "13",
  },
  padding: [0, 0, 0, 0],
  titlePadding: [0, 10, 0, 10],
  borderWidth: "1",
  // 边框颜色
  borderColor: "#104B9D",
  // 边框圆角
  borderRadius: "5",
  //文本样式
  textStyle: {
    ...createCommonTextStyle(),
  },
  animate: {
    flag: false,
    class: "left-to-right",
  },
  position: "left",
  modal: false,
  modalColor: "rgba(0,0,0,0.25)",
};

export default {
  name: "DesDVDialogSetting",
  mixins: [$mixins.propertyDialogSetting],

  data() {
    return {
      themeDialogConfig: null,
      marginConfig: {
        options: [
          {
            text: "标题边距",
            bindControlAttr: "titlePadding",
          },
          {
            text: "内容边距",
            bindControlAttr: "padding",
          },
        ],
      },
      alignConfig: {
        vMapData: [
          { mapName: "flex-start", mapKey: "top" },
          { mapName: "center", mapKey: "middle" },
          { mapName: "flex-end", mapKey: "bottom" },
        ],
      },
      animateOptions: [
        {
          text: "从左往右",
          value: "left-to-right",
        },
        {
          text: "从右往左",
          value: "right-to-left",
        },
        {
          text: "从上往下",
          value: "top-to-bottom",
        },
        {
          text: "从下往上",
          value: "bottom-to-top",
        },
      ],
      borderConfig: {
        type: "color",
        noArrow: true,
        noInput: true,
      },
      tableData: [],
      fonts: [],
      styleTheme: "",
    };
  },
  created() {
    const designer = this.designer;
    const { styles, styleTheme } = designer;

    const theme = styles.find((it) => it.value === styleTheme);
    this.themeDialogConfig = theme?.style?.dialogConfig;

    this.tableData = this.currentData.map((it) => dsf.mix(true, {}, defaultConfig, it));
    this.fonts = dsf.dataview.designer.fonts;
  },
  methods: {
    isImage(it) {
      return it.closeImgConfig && it.closeImgConfig.imgObj.custom.image;
    },
    handleImgSrcStr(obj) {
      return dsf.dataview.utils.compatiblePathToExtendShowImg(obj.imgObj);
    },
    getIconImgStyle(obj) {
      return {
        width: obj.width + "px",
        height: obj.height + "px",
        ...dsf.dataview.utils.getBgAnimation(obj.imgObj),
      };
    },
    selectCloseIcon(it) {
      const backgroundConfig = {
        active: "custom",
        custom: it.closeImgConfig.imgObj.custom,
      };
      this.$openDialog({
        title: "图标上传",
        content: DesDVBgSettingExtend,
        params: {
          currentData: backgroundConfig,
          backgroundTypes: [],
          isEffect: false,
          isBackdropBlur: false,
        },
        width: "950px",
        height: "600px",
        btns: [
          {
            text: "确定",
            handler(res) {
              if (res && res.yes) {
                let data = res.yes();
                it.closeImgConfig.imgObj = data;
              }
            },
          },
          {
            text: "取消",
          },
        ],
      });
    },
    changeRelativeStyle(it, index) {
      let $it = _.cloneDeep(it);
      if ($it.relativeStyle === false && this.themeDialogConfig) {
        $it = { ...$it, ...this.themeDialogConfig };
        this.$set(this.tableData, index, $it);
      }
    },
    getPositionOptions(it) {
      let map = {
        "left-to-right": {
          isShowVAlign: false,
          hMapData: [
            { mapName: "left", mapKey: "left" },
            { mapName: "center", mapKey: "center" },
            { mapName: "right", mapKey: "right", hidden: true },
          ],
        },
        "right-to-left": {
          isShowVAlign: false,
          hMapData: [
            { mapName: "left", mapKey: "left", hidden: true },
            { mapName: "center", mapKey: "center" },
            { mapName: "right", mapKey: "right" },
          ],
        },
        "top-to-bottom": {
          isShowHAlign: false,
          vMapData: [
            { mapName: "top", mapKey: "top" },
            { mapName: "center", mapKey: "middle" },
            { mapName: "bottom", mapKey: "bottom", hidden: true },
          ],
        },
        "bottom-to-top": {
          isShowHAlign: false,
          vMapData: [
            { mapName: "top", mapKey: "top", hidden: true },
            { mapName: "center", mapKey: "middle" },
            { mapName: "bottom", mapKey: "bottom" },
          ],
        },
      };
      return map[it.animate.class];
    },
    setPositionAlign(val, it) {
      it.position = val;
    },
    animateClassChange(val, it) {
      let map = {
        "left-to-right": "left",
        "right-to-left": "right",
        "top-to-bottom": "top",
        "bottom-to-top": "bottom",
      };
      it.position = map[val];
    },
    getAlign(it) {
      return {
        vAlign: it.vectorAlign || "center",
        hAlign: it.align || "left",
      };
    },
    setAlign(value, it) {
      it.vectorAlign = value.vAlign;
      it.align = value.hAlign;
    },
    getIconStyle(it) {
      let { iconColor } = it;
      const align = it.align || "left";
      const vectorAlign = it.vectorAlign;
      let map = {
        left: "flex-start",
        center: "center",
        right: "flex-end",
      };
      return {
        color: iconColor,
        "justify-content": map[align],
        "align-items": vectorAlign,
        ...this.transformPosition(it.iconPosition),
      };
    },
    getInnerContentStyle(it) {
      const padding = dsf.dataview.utils.transformArrayPx(it.padding);
      return {
        padding,
      };
    },
    transformPosition(position) {
      let _position = _.map(position, (v) => {
        return dsf.isNumber(v) ? v + "px" : v;
      });
      // 兼容二开里的样式
      let status = position.every((v) => {
        return v == "auto";
      });
      if (status) return {};
      return {
        top: _position[0],
        right: _position[1],
        bottom: _position[2],
        left: _position[3],
      };
    },
    getContentStyle(it) {
      const background = dsf.dataview.utils.$backgroundFormat(it.background);
      const borderRadius = dsf.dataview.utils.transformPx(it.borderRadius);

      return {
        borderRadius,
        ...background,
      };
    },
    getInnerTitleStyle(it) {
      const align = it.align || "left";
      const vectorAlign = it.vectorAlign;
      const fontStyle = dsf.dataview.utils.transformTextStyle(it.textStyle);
      let map = {
        left: "flex-start",
        center: "center",
        right: "flex-end",
      };
      return {
        ...fontStyle,
        "justify-content": map[align],
        "align-items": vectorAlign,
      };
    },
    getTitleStyle(it) {
      const height = dsf.dataview.utils.transformPx(it.titleHeight, false);
      const padding = dsf.dataview.utils.transformArrayPx(it.titlePadding);
      const background = dsf.dataview.utils.$backgroundFormat(it.titleBackground);
      return {
        height,
        padding,
        ...background,
      };
    },
    setTitleFontStyle(style, it) {
      this.$set(it.textStyle, style);
    },
    // 新增
    add() {
      this.tableData.push(this.newRow());
    },
    newRow() {
      const config = dsf.mix(true, {}, defaultConfig, this.themeDialogConfig);
      return {
        id: dsf.uuid(),
        ...config,
      };
    },
    deleted(it) {
      dsf.array.remove(this.tableData, it);
    },
    yes() {
      return [...this.tableData];
    },
  },
};
</script>
<style lang="scss">
@import "_dataview/assets/styles/designer/DesDVDialogSetting.scss";
</style>
