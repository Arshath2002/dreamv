<!--
 * @Description: 自定义属性分组--目前只用于自定义分组
 * @Author: shenah
 * @Date: 2024-09-02 10:42:29
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-02-13 14:54:55
-->

<template>
  <div class="des-dv-more-custom-list-group-wrapper">
    <transition-group name="move-up-down">
      <div class="single-layout-item" v-for="(it, index) in value" :key="it.id">
        <div class="flex-wrap">
          <span class="title">第{{ index + 1 }}格</span>
          <div class="btn-list">
            <div class="des-dv-icon-add" @click="up(index)" v-if="index !== 0">
              <i class="add-btn el-icon-top"></i>
            </div>
            <div class="des-dv-icon-add" @click="down(index)" v-if="value.length - 1 !== index">
              <i class="add-btn el-icon-bottom"></i>
            </div>
            <div class="des-dv-icon-add" @click="insertItem(index)">
              <i class="add-btn el-icon-plus"></i>
            </div>
            <div class="des-dv-icon-add" @click="deleteItem(it, index)" v-if="value.length > 1">
              <i class="add-btn el-icon-minus del"></i>
            </div>
          </div>
        </div>
        <div class="single-layout-item-item flex-wrap">
          <div class="single-layout-item-info-item">
            <span>宽</span>
            <DesDVPixel v-model="it.width" />
          </div>
          <div class="single-layout-item-info-item">
            <span>高</span>
            <DesDVPixel v-model="it.height" />
          </div>
        </div>
        <div class="single-layout-item-info-item">
          <span>外边距</span>
          <DesDVSwitch v-model="it.showFlag" />
        </div>
        <div class="single-layout-item-info-item" v-if="it.showFlag" style="margin-left: 60px">
          <DesDVMargins v-model="it.margin" />
        </div>
      </div>
    </transition-group>
  </div>
</template>
<script>
import propertyMixin from "./propertyMixin";
export default {
  name: "DesDVMoreCustomListGroup",
  mixins: [propertyMixin],
  props: {
    value: {
      type: Array,
    },
    config: {
      type: Object,
      default() {
        return {};
      },
    },
    owner: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      defaultValue: {
        margin: [0, 0, 0, 0],
      },
    };
  },
  created() {
    this.value.forEach((it) => {
      Object.keys(this.defaultValue).forEach((key) => {
        it.id = dsf.uuid();
        if (!it[key]) {
          it[key] = this.defaultValue[key];
        }
      });
    });
  },
  methods: {
    insertItem($index) {
      let vm = this.owner.$children[0];
      let slots = vm.slots;
      let index = this.value.length;
      while (true) {
        let item = this.value.find((it) => it.name === "listgroup-" + index);
        if (item) {
          index++;
        } else {
          break;
        }
      }
      let one = slots.find((it) => it.name === "listgroup-" + index);
      let obj = {
        width: "40%",
        height: "100px",
        margin: [0, 0, 0, 0],
        controls: [],
        name: `listgroup-${index}`,
        id: dsf.uuid(),
      };
      this.value.splice($index + 1, 0, obj);
      if (one) {
        one.controls = [];
      } else {
        slots.splice($index + 1, 0, obj);
      }
      this.$emit("input", this.value);
      this.$emit("change", this.value);
      vm.$emit("update:slots", slots);
    },
    deleteItem(row, index) {
      let slots = this.owner.slots;
      let slot = slots.find((it) => it.name === row.name);
      if (slot && slot.controls.length > 0) {
        let controls = slot.controls;
        dsf.layer.pc
          .confirm("栅格中存在" + controls.length + "个子组件,删除该单元格子组件将一起被删除。<br/>是否确定要继续?")
          .then(() => {
            this.value.splice(index, 1);
            this.$emit("input", this.value);
            this.$emit("change", this.value);
          })
          .catch(() => {});
      } else {
        this.value.splice(index, 1);
        this.$emit("input", this.value);
        this.$emit("change", this.value);
      }
    },
    up(index) {
      if (index > 0) {
        let curr = this.value[index];
        let currIndex = index;
        dsf.array.remove(this.value, curr);
        this.value.splice(currIndex - 1, 0, curr);
        this.$emit("input", this.value);
        this.$emit("change", this.value);
      }
    },
    down(index) {
      if (this.value.length - 1 > index) {
        let curr = this.value[index];
        let currIndex = index;
        dsf.array.remove(this.value, curr);
        this.value.splice(currIndex + 1, 0, curr);
        this.$emit("input", this.value);
        this.$emit("change", this.value);
      }
    },
  },
};
</script>
<style lang="scss">
@import "_dataview/assets/styles/designer/common/commonProperty/moreCustomListGroup.scss";
</style>
