<!--
 * @Description: 单个属性判断以及赋值
 * @Author: shenah
 * @Date: 2023-07-10 09:47:31
 * @LastEditors: shenah
 * @LastEditTime: 2023-08-14 09:28:11
-->

<template>
  <div class="data-view-common-attr-item">
    <!-- 输入框 -->
    <el-input
      v-model="dataValue"
      class="common-width"
      v-if="item.showType === 'text'"
      @change="oneChange(...arguments, item)"
    ></el-input>
    <!-- 颜色 -->
    <el-color-picker
      v-else-if="item.showType === 'color'"
      v-model="dataValue"
      class="common-width"
      show-alpha
      @change="oneChange(...arguments, item)"
    ></el-color-picker>
    <!-- 是否 -->
    <el-radio-group
      v-model="dataValue"
      class="common-width"
      v-else-if="item.showType === 'boolean'"
    >
      <el-radio
        :label="radio.value"
        v-for="radio in booleanOptions"
        :key="radio.value"
        @change="oneChange(...arguments, item)"
      >
        {{ radio.label }}
      </el-radio>
    </el-radio-group>
    <!-- 选项框 -->
    <el-select
      v-model="dataValue"
      class="common-width"
      v-else-if="item.showType === 'select'"
      @change="oneChange(...arguments, item)"
    >
      <el-option
        :label="option.text"
        :value="option.value"
        v-for="option in item.dictionary"
        :key="option.value"
      ></el-option>
    </el-select>
    <!-- 数字框 -->
    <el-input-number
      v-else-if="item.showType === 'number'"
      class="common-width"
      :controls="item.config.controls"
      v-model="dataValue"
      :precision="item.config.precision"
      :min="item.config.min"
      :max="item.config.max"
    ></el-input-number>
    <!-- 弹框 -->
    <el-button
      v-else-if="item.showType === 'dialog'"
      class="common-width"
      type="primary"
      @click="openDialog(item)"
    >
      {{ item.config.buttonText || "设置" }}
    </el-button>
    <!-- 边距之类 -->
    <template v-else-if="item.showType === 'multipleText'">
      <div
        class="margin-item"
        v-for="margin in marginOptions"
        :key="margin.value"
      >
        {{ margin.label }}：
        <el-input-number
          class="margin-input-number"
          v-model="dataValue[margin.value]"
          controls-position="right"
          :max="1000"
          @change="oneChange(...arguments, item)"
        ></el-input-number>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: "commonAttrItem",
  components: {},
  props: {
    item: {
      type: Object,
      require: true,
    },
    form: {
      type: Object,
      require: true,
    },
  },
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
      // 边距
      marginOptions: [
        {
          label: "上",
          value: 0,
        },
        {
          label: "右",
          value: 1,
        },
        {
          label: "下",
          value: 2,
        },
        {
          label: "左",
          value: 3,
        },
      ],
      dataValue: this.transformData(this.item),
    };
  },
  methods: {
    // 表示像input之类的改变
    oneChange(val, attr) {
      //TODO:差一个点的判断
      this.form[attr.bindControlAttr] = val;
      this.$emit("change", {
        value: val,
        attr,
      });
    },
    // 弹框
    openDialog(attr) {
      let config = attr.config || {};
      let self = this;
      this.$openDialog({
        title: config.title,
        content: config.content,
        width: config.width,
        height: config.height,
        params: {
          currentData: this.form[attr.bindControlAttr],
          config: {},
        },
        btns: [
          {
            text: "确定",
            handler: (res) => {
              let result = res.yes();
              if (result) {
                self.form[attr.bindControlAttr] = result;
                self.$emit("change", {
                  value: result,
                  attr,
                });
              }
            },
          },
          {
            text: "取消",
            handler: () => {},
          },
        ],
      });
    },
    transformData(attr) {
      let val = this.getRecursionValue(this.form, attr);
      return val;
    },
    getRecursionValue(obj, attr) {
      let key = attr.bindControlAttr;
      let arrKey = key.split(".");
      let val = obj;
      for (let i = 0; i < arrKey.length; i++) {
        let nowKey = arrKey[i];
        if (val && typeof val === "object") {
          val = val[nowKey];
        } else {
          value = this.getEveryTypeInitValue(attr);
          break;
        }
      }
      return val;
    },
    getEveryTypeInitValue(attr) {
      let showType = attr.showType;
      if (showType === "number") {
        return undefined;
      }
      return "";
    },
  },
};
</script>
