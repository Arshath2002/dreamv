<!--
 * @Description: 通用属性的封装()
 * @Author: shenah
 * @Date: 2023-07-31 11:17:02
 * @LastEditors: shenah
 * @LastEditTime: 2024-05-21 17:04:22
-->

<template>
  <el-form-item :label="label" class="bg-layout-array-setting-attr-item">
    <template v-if="type === 'margin'">
      <div
        v-for="(item, index) in marginOption"
        :key="index"
        class="margin-wrap"
      >
        <el-input-number
          v-model="nowVal[index]"
          style="width: 50px"
          :controls="false"
          :max="1000"
          size="small"
        ></el-input-number>
      </div>
    </template>
    <template v-else-if="type === 'wH' || type === 'relative'">
      <div class="wh-wrap">
        <div
          class="wh-wrap-item"
          v-for="(item, index) in showSomeOption"
          :key="index"
        >
          <span class="title" v-if="item.title">{{ item.title }}</span>
          <DesDVPixel v-model="nowVal[index]"></DesDVPixel>
        </div>
      </div>
    </template>
  </el-form-item>
</template>
<script>

export default {
  name: "commonAttrItem",

  props: {
    type: {
      // margin类型、wH宽高类型
      require: true,
      type: String,
    },
    label: {
      require: true,
      type: String,
    },
    value: {
      type: [Object, Array, String],
      require: true,
    },
  },
  computed: {
    showSomeOption() {
      let map = {
        wH: "wHOption",
        relative: "relativeOption",
      };
      let list = this[map[this.type]] || [];
      return list;
    },
  },
  data() {
    return {
      marginOption: [
        {
          title: "",
        },
        {
          title: "",
        },
        {
          title: "",
        },
        {
          title: "",
        },
      ],
      wHOption: [
        {
          title: "",
        },
        {
          title: "高",
        },
      ],
      relativeOption: [
        {
          title: "",
        },
        {
          title: "Y",
        },
      ],
      nowVal: [],
    };
  },
  created() {
    this.initData();
  },
  watch: {
    value(val) {
      this.nowVal = val;
    },
    nowVal(val) {
      this.$emit("input", val);
    },
  },
  methods: {
    initData(val = this.value) {
      if (["relative", "margin", "wH"].indexOf(this.type) > -1) {
        this.compatibleAttr(val, {
          initValue: [],
        });
      }
    },
    compatibleAttr(val, { initValue }) {
      if (Array.isArray(val)) {
        if (val.length === 0) {
          this.nowVal = initValue;
        } else {
          this.nowVal = val;
        }
      } else {
        this.nowVal = initValue;
      }
    },
  },
};
</script>
<style lang="scss">
.bg-layout-array-setting-attr-item {
  margin-bottom: 0;
  .margin-wrap {
    display: inline-block;
  }
  .wh-wrap {
    display: flex;
    align-items: center;
    .wh-wrap-item {
      display: flex;
      margin-right: 20px;
      .title {
        margin-right: 8px;
      }
    }
  }
}
</style>
