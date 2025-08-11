<!--
 * @Editor: zhanghang
 * @Description: 菜单编辑列表
 * @Date: 2024-11-05 16:24:41
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-06-16 11:22:32
-->
<template>
  <div class="des-dv-nav-menu-editor-list">
    <el-button type="text" @click="addMenu">新增菜单</el-button>
    <div class="nav-menu-list" v-if="menuData.length">
      <el-scrollbar class="menu-scroller">
        <div class="nav-menu-item" v-for="(it, index) in menuData" :key="index">
          <div class="common-btn-list">
            <div @click="moveOne(menuData, index, 'up')" class="common-icon" v-if="menuData.length > 1">
              <DsfIcon name="shang"></DsfIcon>
            </div>
            <div @click="moveOne(menuData, index, 'down')" class="common-icon" v-if="menuData.length > 1">
              <DsfIcon name="xia"></DsfIcon>
            </div>
            <div @click="deleteMenu(index)" class="common-icon" v-if="menuData.length > 1">
              <DsfIcon name="shanchu"></DsfIcon>
            </div>
          </div>

          <el-row>
            <el-col class="nav-menu-item__cell" :offset="1" :span="7">
              <span>菜单名称：</span>
              <el-input size="small" v-model="it.name"></el-input>
              <DesDVToolTipsIcon
                :data="{
                  desc:'<div>支持：路径参数、全局参数、page、弹窗参数、cookie、sessionStorage、localStorage</div><div>示例：@[路径参数.name]</div>'
                }"
              >
              </DesDVToolTipsIcon>
            </el-col>
            <el-col class="nav-menu-item__cell" :offset="1" :span="7">
              <span>菜单标识：</span>
              <el-input size="small" v-model="it.id"></el-input>
            </el-col>
            <el-col v-if="hasIcon" class="nav-menu-item__cell" :offset="1" :span="5">
              <span>图标：</span>
              <div class="icon-image-wrapper">
                <div class="show-icon" v-if="it.valueShowType === 'icon' && it.valueIconObj.defaultValue">
                  <DsfIcon class="select-icon" :name="it.valueIconObj.defaultValue"></DsfIcon>
                  <DsfIcon class="close" name="close" @click="it.valueIconObj.defaultValue = ''" />
                </div>
                <div class="show-image" v-if="it.valueShowType === 'img' && it.valueImgObj && it.valueImgObj.defaultValue">
                  <img :src="handleImgSrcStr(it.valueImgObj.defaultValue)" :style="handleImgAn(it.valueImgObj.defaultValue)" />
                  <DsfIcon class="close" name="close" @click="it.valueImgObj.defaultValue = ''" />
                </div>
                <el-button @click="selectAllColorIcon(it)" size="small"> 选择 </el-button>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col class="nav-menu-item__cell" :offset="1" :span="23">
              <span>菜单交互：</span>
              <el-radio-group v-model="it.interactType" size="small">
                <el-radio-button :label="radio.value" v-for="radio in interactTypes" :key="radio.value">{{ radio.label }}</el-radio-button>
              </el-radio-group>
            </el-col>
          </el-row>
          <el-row v-if="['1', '2', '3'].includes(it.interactType)">
            <el-col class="nav-menu-item__cell padding" :offset="1" :span="10">
              <span>菜单路径：</span>
              <el-input size="small" v-model="it.url" v-if="it.interactType == '2'"></el-input>
              <el-input v-model="it.url" v-else class="dsf-input-url" placeholder="支持表达式" size="small">
                <el-button slot="append" icon="el-icon-search" @click="openDialog(it)" />
              </el-input>
            </el-col>
            <el-col v-if="it.interactType != '3'" class="nav-menu-item__cell" :offset="2" :span="7">
              <span>打开至：</span>
              <el-radio-group v-model="it.isOuter" size="small">
                <el-radio-button :label="false">当前窗口</el-radio-button>
                <el-radio-button :label="true">新窗口</el-radio-button>
              </el-radio-group>
            </el-col>
          </el-row>
          <el-row v-if="it.interactType == '3'">
            <el-col class="nav-menu-item__cell padding" :offset="1" :span="23">
              <div class="dialog-item">
                <span>宽度：</span>
                <DesDVPixel size="small" v-model="it.dialogWidth"></DesDVPixel>
              </div>
              <div class="dialog-item">
                <span>高度：</span>
                <DesDVPixel size="small" v-model="it.dialogHeight"></DesDVPixel>
              </div>
              <div class="dialog-item">
                <span>标题：</span>
                <el-input size="small" v-model="it.dialogTitle"></el-input>
              </div>
              <div class="dialog-item">
                <span>弹框类型：</span>
                <el-select size="small" v-model="it.dialogType">
                  <el-option size="small" :label="dialog.label" :value="dialog.value" v-for="dialog in dialogConfig" :key="dialog.id"></el-option>
                </el-select>
              </div>
            </el-col>
          </el-row>
          <el-row v-if="it.interactType == '4'">
            <el-col class="nav-menu-item__cell padding" :offset="1" :span="8">
              <span>视图绑定：</span>
              <el-select v-model="it.viewPart" class="dsf-input-url" size="small">
                <el-option v-for="item in viewPartList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
              </el-select>
            </el-col>
            <el-col class="nav-menu-item__cell padding" :offset="1" :span="8">
              <span>视图路径：</span>
              <el-input v-model="it.viewPartUrl" class="dsf-input-url" placeholder="支持表达式" size="small">
                <el-button slot="append" icon="el-icon-search" @click="openDialog(it, 'viewPartUrl')" />
              </el-input>
            </el-col>
          </el-row>
        </div>
      </el-scrollbar>
    </div>
    <DsfEmptyData text="暂无子菜单数据" v-else />
  </div>
</template>
<script>
const NavColorIconConfig = Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_private" */ "./navColorIconConfig.vue"));
import { createMenuItem } from "_dataview/output/config/commonConfig";
import menuEditorMixin from "./menuEditorMixin.js";
export default {
  name: "MenuEditorList",
  mixins: [menuEditorMixin],
  props: {
    designer: {
      type: Object,
      require: true,
    },
    owner: {
      type: Object,
      require: true,
    },
    iconImageType: {
      type: String,
      default: "both",
    },
    menuData: {
      type: Array,
      require: true,
    },
    menuType: {
      type: String,
      default: "nav",
    },
    hasIcon: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    addMenu() {
      const menuItem = createMenuItem({ name: "新建菜单" }, this.menuType);
      this.menuData.push(menuItem);
    },
    deleteMenu(index) {
      this.menuData.splice(index, 1);
    },
    selectAllColorIcon(row) {
      this.$openDialog({
        title: "图标颜色选择",
        content: NavColorIconConfig,
        params: {
          iconImageType: this.iconImageType,
          hasColor: false,
          currentData: {
            valueIconObj: row[`valueIconObj`] || "",
            valueColorObj: row[`valueColorObj`] || null,
            valueImgObj: row[`valueImgObj`] || "",
            valueShowType: row[`valueShowType`] || "",
            valueShowPosition: row[`valueShowPosition`] || "",
          },
        },
        width: "600px",
        height: "40vh",
        btns: [
          {
            text: "确定",
            handler(res) {
              if (res && res.yes) {
                let i = res.yes();
                row[`valueIconObj`] = i.valueIconObj;
                row[`valueColorObj`] = i.valueColorObj;
                row[`valueImgObj`] = i.valueImgObj;
                row[`valueShowType`] = i.valueShowType;
                row[`valueShowPosition`] = i.valueShowPosition;
              }
            },
          },
          {
            text: "取消",
          },
        ],
      });
    },
    handleImgSrcStr(obj) {
      return dsf.dataview.utils.compatiblePathToExtendShowImg(obj);
    },
    handleImgAn(obj) {
      return dsf.dataview.utils.getBgAnimation(obj);
    },
    moveOne(arr, index, direction) {
      let menuData = dsf.dataview.utils.moveOneArray(arr, index, direction);
      this.$emit("changeMenuData", menuData);
    },
    getMenuData() {
      return this.menuData;
    },
  },
};
</script>
<style lang="scss">
@import "_dataview/assets/styles/designer/menuEditorList.scss";
</style>
