<!--
 * @Description: 公用柱体配置项(目前只用与图文)
 * @Author: shenah
 * @Date: 2023-09-04 09:23:33
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-02-12 18:27:27
-->
<template>
  <div class="des-dv-table-bar-setting">
    <div class="header-title">
      <div class="btn-list" v-if="initValIsArray">
        <el-button size="small" type="text" icon="el-icon-plus" @click="addBarConfig"> 添加柱体 </el-button>
      </div>
    </div>
    <el-card class="common-card" v-for="(item, index) in list" :key="item.id">
      <div slot="header" class="title" v-if="initValIsArray">
        <div class="left-title">第{{ index + 1 }}项</div>
        <div v-if="list.length > 1">
          <el-button size="small" icon="el-icon-delete" @click="removeBar(index)"></el-button>
        </div>
      </div>
      <el-form :inline="true" :show-message="false" label-width="120px" size="small">
        <el-form-item label="柱体宽度" class="common-form-item">
          <div class="common-width">
            <DesDVPixel v-model="item.width" />
          </div>
        </el-form-item>
        <el-form-item label="柱体高度" class="common-form-item">
          <div class="common-width">
            <DesDVPixel v-model="item.height" />
          </div>
        </el-form-item>
        <div>
          <el-form-item label="光点动效" class="common-form-item">
            <DesDVRadioGroup :data="{ dictionary: pointOptions }" v-model="item.pointInfo.type"></DesDVRadioGroup>
          </el-form-item>
          <template v-if="item.pointInfo.type !== 'no'">
            <el-form-item label="光点颜色" class="common-form-item" style="margin-left: 26px">
              <DesDVColorPicker
                v-model="item.pointInfo.color"
                :config="{
                  type: 'color',
                }"
              ></DesDVColorPicker>
            </el-form-item>
            <template v-if="item.pointInfo.type === 'point'">
              <el-form-item label="底色" class="common-form-item">
                <DesDVColorPicker
                  v-model="item.pointInfo.baseColor"
                  :config="{
                    type: 'color',
                  }"
                ></DesDVColorPicker>
              </el-form-item>
              <el-form-item label="呼吸效果" class="common-form-item" style="position: relative; left: -72px">
                <DesDVSwitch v-model="item.pointInfo.isBreathe"></DesDVSwitch>
              </el-form-item>
            </template>
          </template>
        </div>
        <div>
          <el-form-item label="动画" class="common-form-item">
            <DesDVSwitch v-model="item.animation.flag"></DesDVSwitch>
          </el-form-item>
          <el-form-item label="动画时长" class="common-form-item" v-if="item.animation.flag" style="margin-left: 154px">
            <DesDVNumber
              v-model="item.animation.duration"
              :config="{
                unit: 's',
                min: 1,
              }"
            />
          </el-form-item>
        </div>

        <el-form-item label="显示值" class="common-form-item">
          <DesDVSwitch v-model="item.showValue" class="common-width"></DesDVSwitch>
        </el-form-item>
        <el-form-item class="common-form-item" label="最小百分比">
          <div class="common-width">
            <DesDVNumber
              v-model="item.minPercent"
              :config="{
                unit: '%',
                min: 2,
                max: 20,
              }"
            />
          </div>
        </el-form-item>
        <el-form-item label="边框圆角" class="common-form-item">
          <DesDVBorderRadius class="common-width" v-model="item.borderRadius" @change="(val) => borderRadiusChange(val, item)"></DesDVBorderRadius>
        </el-form-item>
        <el-form-item label="柱体底色" class="common-form-item">
          <DesDVColorPicker
            v-model="item.basicBgColor"
            :config="{
              type: 'color',
            }"
          ></DesDVColorPicker>
        </el-form-item>
        <el-form-item label="柱体颜色" class="common-form-item">
          <DesDVColorPicker v-model="item.bgColor"></DesDVColorPicker>
        </el-form-item>
        <el-form-item label="颜色规则" class="common-form-item label-transparent">
          <dsfButtonDialog
            @click="ruleSet(item, index, 'bgColorRuleList')"
            :hasValue="colorRules(item)"
            :config="{
              buttonText: '颜色规则',
            }"
          >
          </dsfButtonDialog>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import { createBarConfig } from "_dataview/output/config/dynamicFieldConfig";
import dsfButtonDialog from "_dataview/designer/common/components/dsfButton.vue";
export default {
  name: "CommonBarConfigSetting",
  mixins: [$mixins.propertyDialogSetting],
  components: {
    dsfButtonDialog,
  },
  props: {
    mapFieldList: {
      require: true,
    },
  },
  data() {
    return {
      pointOptions: [
        {
          text: "无",
          value: "no",
        },
        {
          text: "竖线",
          value: "line",
        },
        {
          text: "光点",
          value: "point",
        },
      ],
      initValIsArray: true, // 判断初始值为数组还是对象
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
      list: [],
    };
  },
  computed: {
    colorRules() {
      return (row) => {
        if (row.bgColorRuleList.length) {
          return true;
        }
        return false;
      };
    },
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
      let list = _.cloneDeep(this.currentData);
      if (!Array.isArray(list)) {
        this.initValIsArray = false;
        list = [list];
      }
      for (let i = 0; i < list.length; i++) {
        let baseOne = createBarConfig();
        let gradientColors = list[i].gradientColors;
        if (Array.isArray(gradientColors)) {
          gradientColors = gradientColors.map((color) => ({
            value: color,
            id: dsf.uuid(),
          }));
        } else {
          gradientColors = baseOne.gradientColors?.map((color) => ({
            value: color,
            id: dsf.uuid(),
          }));
        }
        let newItem = {
          id: dsf.uuid(),
          ...baseOne,
          ...list[i],
          gradientColors,
        };
        // 这里处理颜色以及渐变
        if (typeof newItem.isGradient === "boolean") {
          let one = newItem.gradientColors;
          if (newItem.isGradient && one.length > 1) {
            newItem.bgColor = `linear-gradient(90deg,${one[0].value},${one[1].value})`;
          } else {
            newItem.bgColor = newItem.bgColor;
          }
          delete newItem.isGradient;
          delete newItem.gradientColors;
        }
        list[i] = newItem;
      }
      this.list = list;
    },
    borderRadiusChange(val, row) {
      row.borderRadius = val;
    },
    ruleSet(row, index, field) {
      let params = {
        currentData: row[field],
        owner: this.owner,
        config: {
          typeOptions: [
            {
              label: "色值",
              value: "color",
              config: {
                type: "both",
              },
            },
          ],
        },
      };
      let title = this.initValIsArray ? `第${index + 1}柱体颜色设置` : "柱体颜色设置";
      this.$openDialog({
        title: title,
        content: "DesDVUniversalRuleConfig",
        params,
        width: "1200px",
        height: "60vh",
        btns: [
          {
            text: "确定",
            handler(res) {
              if (res && res.yes) {
                let i = res.yes();
                row[field] = i;
              }
            },
          },
          {
            text: "取消",
          },
        ],
      });
    },
    addBarConfig() {
      let obj = createBarConfig();
      this.list.push(obj);
    },
    removeBar(index) {
      this.list.splice(index, 1);
    },
    beforeYes() {
      let list = _.cloneDeep(this.list);
      // 处理数据
      if (!this.initValIsArray) {
        return list[0] || [];
      }
      return list;
    },
    yes() {
      let arr = this.beforeYes();
      return arr;
    },
  },
};
</script>
<style lang="scss">
@import "_dataview/assets/styles/designer/tableBarSetting.scss";
</style>
