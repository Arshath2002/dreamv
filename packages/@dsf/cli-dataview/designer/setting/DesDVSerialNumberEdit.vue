<!--
 * @Description: 序号设置
 * @Author: shenah
 * @Date: 2023-04-24 15:45:12
 * @LastEditors: zhanghang
 * @LastEditTime: 2024-04-03 13:51:08
-->

<template>
  <div class="des-dv-index-number-setting">
    <el-card class="common-card">
      <div slot="header" class="clearfix">
        <div>序号样式配置</div>
      </div>
      <el-form :inline="true" :show-message="false" label-width="100px" size="small">
        <el-form-item label="宽度" class="common-form-item">
          <el-input v-model="defaultForm.width" class="common-width"></el-input>
        </el-form-item>
        <el-form-item label="高度" class="common-form-item">
          <el-input v-model="defaultForm.height" class="common-width"></el-input>
        </el-form-item>
        <el-form-item label="字号" class="common-form-item">
          <el-input v-model="defaultForm.fontSize" class="common-width"></el-input>
        </el-form-item>
        <el-form-item label="粗细" class="common-form-item">
          <el-input v-model="defaultForm.fontWeight" class="common-width"></el-input>
        </el-form-item>
        <el-form-item label="是否圆形" class="common-form-item">
          <el-radio-group v-model="defaultForm.isRound" class="common-width">
            <el-radio v-for="item in booleanOptions" :key="item.value" :label="item.value">
              {{ item.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="边框圆角" class="common-form-item" v-if="!defaultForm.isRound">
          <el-input v-model="defaultForm.borderRadius" class="common-width"></el-input>
        </el-form-item>
        <el-row>
          <el-form-item label="字体颜色" class="common-form-item bg-form-item">
            <div class="common-bg-icon-wrap">
              <el-button class="bg-icon-btn" type="text" icon="el-icon-circle-plus-outline" size="small" @click="addOne('fontColors')"> 添加字体颜色 </el-button>
              <div class="bg-icon-items">
                <div class="bg-icon-wrap" v-for="(item, index) in defaultForm.fontColors" :key="item.uuid">
                  <i class="close el-icon-close" @click.stop="removeOne('fontColors', index)"></i>
                  <el-color-picker v-model="item.value" class="bg-color-item"></el-color-picker>
                </div>
              </div>
            </div>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="背景色" class="common-form-item bg-form-item">
            <div class="common-bg-icon-wrap">
              <el-button class="bg-icon-btn" type="text" icon="el-icon-circle-plus-outline" size="small" @click="addOne('bgColors')"> 添加背景色 </el-button>
              <div class="bg-icon-items">
                <div class="bg-icon-wrap" v-for="(item, index) in defaultForm.bgColors" :key="item.uuid">
                  <i class="close el-icon-close" @click.stop="removeOne('bgColors', index)"></i>
                  <el-color-picker v-model="item.value" class="bg-color-item"></el-color-picker>
                </div>
              </div>
            </div>
          </el-form-item>
        </el-row>
        <el-form-item label="展示内容" class="common-form-item">
          <el-radio-group v-model="defaultForm.showContent" class="common-width">
            <el-radio v-for="item in showContentOptions" :key="item.value" :label="item.value">
              {{ item.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-row>
          <el-form-item label="图标选择" class="common-form-item" v-if="defaultForm.showContent === 'icon'">
            <div class="common-bg-icon-wrap">
              <el-button class="bg-icon-btn" type="primary" icon="el-icon-circle-plus-outline" size="small" @click.stop="selectIcon()"> 添加图标 </el-button>
              <div class="bg-icon-items">
                <div class="bg-icon-wrap" v-for="(item, index) in defaultForm.icons" :key="item.uuid">
                  <DsfIcon v-if="item.value" class="close" name="close" @click.stop="removeOne('icons', index)" />

                  <div class="now-icon" @click.stop="selectIcon(item)">
                    <DsfIcon :name="item.value" v-if="item.value"></DsfIcon>
                  </div>
                </div>
              </div>
            </div>
          </el-form-item>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>
<script>
export default {
  name: "DesDVSerialNumberEdit",
  mixins: [$mixins.propertyDialogSetting],
  data() {
    return {
      booleanOptions: [
        {
          label: "是",
          value: true,
        },
        {
          label: "否",
          value: false,
        },
      ],
      showContentOptions: [
        {
          label: "数字",
          value: "number",
        },
        {
          label: "图标",
          value: "icon",
        },
      ],
      defaultForm: {
        width: "32",
        height: "32",
        fontSize: "16",
        fontWeight: "400",
        isRound: true,
        showContent: "number",
        borderRadius: "",
        bgColors: [],
        fontColors: [],
        icons: [],
      },
    };
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
      const data = Array.isArray(this.currentData) ? this.currentData[0] : this.currentData;
      let config = _.cloneDeep(data);
      config.bgColors = config.bgColors.map((str) => ({
        value: str,
        id: dsf.uuid(),
      }));
      config.fontColors = config.fontColors.map((str) => ({
        value: str,
        id: dsf.uuid(),
      }));
      config.icons = config.icons.map((str) => ({
        value: str,
        id: dsf.uuid(),
      }));
      this.defaultForm = config;
    },
    selectIcon(row) {
      let self = this;
      let params = {};
      if (row) {
        params.icon = row.value;
      } else {
        params.icon = "";
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
                    row.value = i;
                  } else {
                    self.defaultForm.icons.push({
                      value: i,
                      id: dsf.uuid(),
                    });
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
    addOne(field) {
      this.defaultForm[field].push({
        id: dsf.uuid(),
        value: "",
      });
    },
    removeOne(field, index) {
      this.defaultForm[field].splice(index, 1);
    },
    yes() {
      return {
        ...this.defaultForm,
        bgColors: this.defaultForm.bgColors.map((item) => item.value),
        icons: this.defaultForm.icons.map((item) => item.value),
        fontColors: this.defaultForm.fontColors.map((item) => item.value),
      };
    },
  },
};
</script>
<style lang="scss">
@import "_dataview/assets/styles/designer/DesDVSerialNumberEdit.scss";
</style>
