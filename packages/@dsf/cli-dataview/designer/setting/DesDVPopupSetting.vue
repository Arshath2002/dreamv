<!--
 * @Description: 大屏弹框设置
 * @Author: zhanghang
 * @Date: 2023-11-21 15:34:37
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-06-05 10:47:15
-->
<template>
  <div class="des-dv-dialog-setting">
    <el-button class="add-btn" type="text" @click="add">新增悬浮框样式</el-button>
    <div class="dialog-list">
      <el-scrollbar class="dialog-scroller">
        <div class="dialog-item" v-for="(it, index) in tableData" :key="it.id">
          <div @click="deleted(it)" class="delete-icon" v-if="tableData.length > 1">
            <DsfIcon name="close" />
          </div>
          <!-- 弹框预览 -->
          <div class="dialog-item-view">
            <div class="dialog-item-instance popup" :style="getContentStyle(it)">
              <div class="arrow" v-show="it.arrow.show" :class="it.placement" :style="getArrowStyle(it)"></div>
              <div class="dialog-item-content" :style="getInnerContentStyle(it)">
                <div class="dialog-item-content-inner">悬浮框预览样式</div>
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
              <el-col :span="24">
                <div class="property-item title">
                  <span>悬浮框设置</span>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="property-item">
                  <span>悬浮位置：</span>
                  <DesDVRadioGroup :data="{ dictionary: floatOptions }" v-model="it.placement" />
                </div>
              </el-col>
              <el-col :span="12">
                <div class="property-item">
                  <span>偏移大小：</span>
                  <DesDVNumber v-model="it.offsetFormat" />
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
              <el-col :span="12" v-if="!it.relativeStyle">
                <div class="property-item">
                  <span>内容边距：</span>
                  <DesDVMargins v-model="it.padding" />
                </div>
              </el-col>
              <el-col :span="12" v-if="!it.relativeStyle">
                <div class="property-item">
                  <span>显示箭头：</span>
                  <DesDVSwitch v-model="it.arrow.show" />
                </div>
                <div class="property-item ml-20" v-if="it.arrow.show">
                  <span>箭头大小：</span>
                  <DesDVNumber :config="{ min: 0, unit: 'px' }" v-model="it.arrow.size" />
                </div>
              </el-col>
              <el-col :span="12">
                <div class="property-item">
                  <span>圆角：</span>
                  <DesDVNumber class="min" v-model="it.borderRadius" :config="{ min: 0, unit: 'px' }" />
                </div>
              </el-col>
              <el-col :span="12" v-if="!it.relativeStyle && !it.arrow.show">
                <div class="property-item">
                  <span>显示阴影：</span>
                  <DesDVSwitch v-model="it.shadowShow" />
                </div>
                <div class="property-item ml-20" v-if="it.shadowShow">
                  <span>颜色：</span>
                  <DesDVColorPicker
                    class="dialog-border-color"
                    v-model="it.shadowColor"
                    :config="{
                      type: 'color',
                      noArrow: true,
                      noInput: true,
                    }"
                  />
                </div>
              </el-col>

              <el-col :span="12" v-if="!it.arrow.show && !it.relativeStyle">
                <div class="property-item">
                  <span>边框：</span>
                </div>
                <div class="property-item ml-20">
                  <span>颜色：</span>
                  <DesDVColorPicker
                    class="dialog-border-color"
                    v-model="it.borderColor"
                    :config="{
                      type: 'color',
                      noArrow: true,
                      noInput: true,
                    }"
                  />
                  <span>宽度：</span>
                  <DesDVNumber class="min" v-model="it.borderWidth" :config="{ min: 0, unit: 'px' }" />
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
const defaultConfig = {
  background: {
    active: "color",
    color: {
      // 选色方式 默认为空 单色色盘选择 color  线性渐变 linear  径向渐变 radial
      type: "color",
      //提供给渐变使用
      image: "",
      isTheme: false,
      theme: "main",
      value: "rgba(16,75,157,0.6)",
    },
  },
  placement: "right", // 悬浮方向
  relativeStyle: true,
  arrow: {
    show: true,
    size: 10,
  },
  shadowShow: false, //阴影
  shadowColor: "#FFF",
  offsetFormat: 0,
  padding: [0, 0, 0, 0],
  borderRadius: "5",
  borderWidth: "0",
  // 边框颜色
  borderColor: "#ffffff",
};
const defaultConfigOther = {
  placement: "right",
  offsetFormat: 0,
};
export default {
  name: "DesDVPopupSetting",
  mixins: [$mixins.propertyDialogSetting],

  data() {
    return {
      floatOptions: [
        {
          text: "上",
          value: "top",
        },
        {
          text: "左",
          value: "left",
        },
        {
          text: "下",
          value: "bottom",
        },
        {
          text: "右",
          value: "right",
        },
      ],
      tableData: [],
      themePopupConfig: null,
    };
  },
  created() {
    const designer = this.designer;
    const { styles, styleTheme } = designer;

    const theme = styles.find((it) => it.value === styleTheme);
    this.themePopupConfig = theme?.style?.popupConfig;

    _.each(this.currentData, (it) => {
      if (it.relativeStyle === undefined) {
        it.relativeStyle = false;
      }
    });
    this.tableData = this.currentData.map((it) => dsf.mix(true, {}, defaultConfig, it));
    this.tableData.forEach((it, index) => {
      if (it.relativeStyle === true) {
        this.changeRelativeStyle(it, index);
        let $it = dsf.mix(true, {}, it, this.themePopupConfig);
        this.$set(this.tableData, index, $it);
      }
    });
  },
  methods: {
    changeRelativeStyle(it, index) {
      let $it = _.cloneDeep(it);
      if ($it.relativeStyle === false && this.themePopupConfig) {
        $it = { ...$it, ...this.themePopupConfig };
        this.$set(this.tableData, index, $it);
      }
    },
    getContentStyle(it) {
      const background = dsf.dataview.utils.$backgroundFormat(it.background);
      const borderRadius = dsf.dataview.utils.transformPx(it.borderRadius);
      const arrowSize = dsf.dataview.utils.transformPx(it.arrow.size);
      let shadow = {};
      if (it.shadowShow && !it.arrow.show) {
        shadow.boxShadow = `inset 0px 0px 12px 0px ${it.shadowColor}`;
      }
      return {
        borderRadius,
        ...background,
        "--privacy-theme": background["background-color"],
        "--arrow-size": arrowSize,
        ...shadow,
      };
    },
    getInnerContentStyle(it) {
      const padding = dsf.dataview.utils.transformArrayPx(it.padding);
      return {
        padding,
      };
    },
    getArrowStyle(it) {},
    // 新增
    add() {
      this.tableData.push(this.newRow());
    },
    newRow() {
      let popupConfig = this.themePopupConfig || defaultConfig;
      let config = dsf.mix(true, {}, popupConfig, defaultConfigOther);
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
