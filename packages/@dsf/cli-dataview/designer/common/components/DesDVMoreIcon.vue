<!--
 * @Description: 多种图标集合
 * @Author: shenah
 * @Date: 2024-03-18 15:00:28
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-02-13 11:46:30
-->

<template>
  <div class="dsf-more-mode-color-icon dsf-more-icon">
    <div class="color-icon-item" v-for="(item, index) in currentData" :key="item.id">
      <DsfIcon class="select-icon" :name="item.value" @click="selectIcon(item)"></DsfIcon>
      <DsfIcon class="del-icon" name="close" @click="delOne(index)" v-if="(isArrayValue && currentData.length > 1) || !isArrayValue || currentConfig.isDelIcon"></DsfIcon>
    </div>
    <div class="des-dv-icon-add" @click="add" v-if="isArrayValue || !currentData.length">
      <i class="add-btn el-icon-plus"></i>
    </div>
  </div>
</template>
<script>
import propertyMixin from "./propertyMixin";
export default {
  name: "DesDVMoreIcon",
  props: {
    value: {
      type: [Array, String],
    },
  },
  mixins: [propertyMixin],
  components: {},
  data() {
    return {
      defaultConfig: {
        isDelIcon: false,
      },
      currentData: [],
    };
  },
  computed: {},
  watch: {},
  created() {
    this.initValue();
  },
  methods: {
    initValue() {
      if (this.isArrayValue) {
        this.currentData = this.value.map((str) => ({
          id: dsf.uuid(),
          value: str,
        }));
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
    add() {
      this.selectIcon();
    },
    selectIcon(row) {
      let self = this;
      let params = {
        icon: row?.value,
      };
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
                    self.currentData.push({
                      id: dsf.uuid(),
                      value: i,
                    });
                  }
                  self.changeValue();
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
    delOne(index) {
      this.currentData.splice(index, 1);
      this.changeValue();
    },
    changeSingleColor() {
      this.changeValue();
    },
    changeValue() {
      let nowData = this.currentData.map((item) => item.value);
      if (!this.isArrayValue) {
        nowData = this.currentData[0]?.value || "";
      }
      this.$emit("input", nowData);
      this.$emit("change", nowData);
    },
  },
};
</script>
