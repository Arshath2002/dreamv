<!--
 * @Description: 多张图片
 * @Author: shenah
 * @Date: 2024-03-18 16:13:18
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-07-24 13:38:11
-->

<template>
  <div class="dsf-dv-more-img">
    <div class="img-wrap" v-for="(item, index) in currentData" :style="getImgWrapStyle(item.value)" :key="item.id">
      <div class="img-inner data-view-common-bg-effect">
        <div class="no-img-text" v-if="!hasImage(item)" @click.stop="selectImg(item)">
          <template v-if="currentConfig.noImgText">
            {{ currentConfig.noImgText }}
          </template>
          <template v-else>
            <i class="add-btn el-icon-plus"></i>
          </template>
        </div>
        <div class="btn-list" v-else>
          <DesDVDesignerPopover
            :attrData="{
              config: {
                content: 'DesDVImageConfig',
                width: '340',
                height: '450',
                buttonType: 'icon',
                iconConfig: {
                  fontSize: '18px',
                  color: '#fff',
                  title: '设置属性',
                  icon: 'shezhi',
                },
              },
            }"
            :componentConfig="{
              isEffect: currentConfig.isEffect,
              isFilter: currentConfig.isFilter,
              noStyle: currentConfig.noStyle || false,
            }"
            :dataValue="item.value"
            v-if="currentConfig.hasStyle"
            @change="(obj) => imageConfigChange(item, obj)"
            class="attr-icon"
          />
          <DsfIcon name="shangchuan" class="attr-icon" title="更换图片" @click.self="selectImg(item)"></DsfIcon>
        </div>
        <template v-if="isArrayValue">
          <DsfIcon name="shanchu1" class="del-icon" @click.stop="delOne(index)"> </DsfIcon>
        </template>
        <template v-else>
          <DsfIcon name="shanchu1" class="del-icon" @click.stop="clearImage(index)" v-if="isShowClear"> </DsfIcon>
        </template>
      </div>
    </div>
    <template v-if="!noAddBtn && isShowAdd">
      <div class="des-dv-icon-add" @click.stop="() => selectImg()" v-if="!currentConfig.isTemp">
        <i class="add-btn el-icon-plus"></i>
      </div>
      <div class="img-wrap" @click.stop="() => selectImg()" v-else>
        <div class="no-img-text">
          <i class="add-btn el-icon-plus"></i>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
import propertyMixin from "./propertyMixin";

export default {
  name: "DesDVMoreImg",
  mixins: [propertyMixin],
  props: {
    value: {
      type: [Array, Object],
    },
    noAddBtn: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      defaultConfig: {
        limitImg: undefined,
        noImgText: "",
        isTemp: false,
        isEffect: true,
        isFilter: true,
        hasStyle:true
      },
      defaultValue: {
        active: "pattern",
        pattern: {
          image: "",
          size: "contain",
          repeat: "no-repeat",
          position: "center",
        },
      },
      currentData: [],
    };
  },
  computed: {
    isShowClear() {
      if (this.currentData.length > 0 && this.currentData[0] && this.currentData[0].value) {
        let value = this.currentData[0].value;
        if (value?.active != "color" && (value?.pattern?.image || value?.custom?.image)) {
          return true;
        }
      }
      return false;
    },
    isShowAdd() {
      if (this.isArrayValue) {
        let totalLength = this.currentData.length;
        let isNumber = this.currentConfig.limitImg === undefined ? false : true;
        if (isNumber) {
          if (totalLength >= this.currentConfig.limitImg) {
            return false;
          }
          return true;
        }
        return true;
      }
      if (!this.isArrayValue && !this.currentData.length) {
        return true;
      }
      return false;
    },
    hashCode() {
      const res = Array.isArray(this.value) ? this.value : [this.value];
      return dsf.dataview.utils.getHashCode(res.map(this.hasImage));
    },
  },
  watch: {
    hashCode() {
      this.initValue();
    },
  },
  created() {
    this.initValue();
  },
  methods: {
    initValue() {
      if (this.isArrayValue) {
        let isNumber = this.currentConfig.limitImg === undefined ? false : true;
        let res = isNumber ? this.value.slice(0, this.currentConfig.limitImg) : this.value;
        this.currentData = res.map((item) => {
          return {
            id: dsf.uuid(),
            value: item,
          };
        });
      } else {
        if (this.value) {
          this.currentData = [
            {
              id: dsf.uuid(),
              value: this.value,
            },
          ];
        }
      }
    },
    getImgWrapStyle(imgObj) {
      let imgStyle =
        dsf.dataview.utils.$backgroundFormat(imgObj, {
          isBgInfoVar: true,
        }) || {};
      return {
        ...imgStyle,
      };
    },
    selectImg(row) {
      let self = this;
      let currentData = row ? row.value : this.defaultValue;
      const { backgroundTypes, isEffect } = this.currentConfig;
      this.$openDialog({
        title: "图片设置",
        content: "DesDVBgSettingExtend",
        width: "950px",
        height: "600px",
        params: {
          currentData,
          backgroundTypes,
          hasColor: false,
          isEffect,
        },
        btns: [
          {
            text: "确定",
            handler: (res) => {
              let result = res.yes();
              if (result) {
                if (row) {
                  row.value = result
                } else {
                  self.currentData.push({
                    id: dsf.uuid(),
                    value: result,
                  });
                }
                self.changeValue();
             
              }
            },
          },
          {
            text: "重置",
            handler: (res) => {
              let result = res.yes();
              if (result) {
                if (row) {
                  if (row.value.pattern) {
                    row.value.pattern.image = "";
                  }
                  if (row.value.custom) {
                    row.value.custom.image = "";
                  }
                  row.value.blurBackdrop = 0;
                }
                self.changeValue();
                this.initValue();
              }
            },
          },
        ],
      });
    },
    hasImage(item) {
      const res = item.value ? item.value : item;
      if (res.active === "pattern" && res.pattern && res.pattern.image) {
        return res.pattern.image;
      } else if (res.active === "custom" && res.custom && res.custom.image) {
        return res.custom.image;
      }
      return false;
    },
    delOne(index) {
      this.currentData.splice(index, 1);
      this.changeValue();
    },
    clearImage(index) {
      let value = this.currentData[index]?.value;
      if (value.pattern) {
        value.pattern.image = "";
      }
      if (value.custom) {
        value.custom.image = "";
      }
      this.changeValue();
    },
    changeSingleColor() {
      this.changeValue();
    },
    changeValue() {
      let nowData = this.currentData.map((item) => item.value);
      if (!this.isArrayValue) {
        nowData = this.currentData[0]?.value || this.defaultValue;
      }
      this.$emit("input", nowData);
      this.$emit("change", nowData);
    },
    imageConfigChange(row, result) {
      row.value = dsf.mix(true, this.isArrayValue ? [] : {}, this.value, result);
      this.changeValue();
    },
  },
};
</script>
<style lang="scss">
@import "_dataview/assets/styles/designer/common/commonProperty/moreImg.scss";
</style>
