<!--
 * @Description: 规则类型对象
 * @Author: shenah
 * @Date: 2024-04-15 16:10:46
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-02-13 13:44:53
-->

<template>
  <div class="rule-type-wrap">
    <!-- 色值 -->
    <div class="rule-value-item" v-if="row.type === 'color'">
      <div class="label-text">色值：</div>
      <DesDVColorPicker v-model="form.color" :config="typeConfig"></DesDVColorPicker>
    </div>
    <!-- 多个色值 -->
    <div class="rule-value-item" v-if="row.type === 'moreColor'">
      <div class="label-text">多个色值：</div>
      <DesDVMoreModeColor v-model="form.colorList" :config="typeConfig"></DesDVMoreModeColor>
      <DesDVToolTipsIcon
        v-if="oneOptions.desc"
        :data="{
          desc: oneOptions.desc,
        }"
        style="display: flex; align-items: center"
      >
      </DesDVToolTipsIcon>
    </div>
    <!-- 文字 -->
    <template v-if="row.type === 'text'">
      <div class="rule-value-item" v-if="typeConfig.hiddenContent !== undefined">
        <div class="label-text">内容：</div>
        <el-input v-model="form.content" size="small" placeholder="请输入内容" style="margin-bottom: 10px; width: 240px"></el-input>
      </div>
      <div class="rule-value-item">
        <div class="label-text">样式：</div>
        <DesDVTextStyle
          style="width: 240px"
          v-model="form"
          :config="
            typeConfig.picker || {
              picker: {
                type: 'color',
              },
            }
          "
        ></DesDVTextStyle>
      </div>
    </template>
    <div class="rule-value-inner" v-if="row.type === 'icon'">
      <div class="rule-value-inner-item" v-if="!typeConfig.hiddenPosition">
        <div class="label-text">展示位置：</div>
        <el-radio-group size="small" v-model="form.position">
          <el-radio-button v-for="item in positionOptions" :key="item.value" :label="item.value">
            {{ item.label }}
          </el-radio-button>
        </el-radio-group>
      </div>
      <div class="rule-value-inner-item">
        <div class="label-text">图标选择：</div>
        <DesDVMoreIcon v-model="form.icon"></DesDVMoreIcon>
      </div>
      <div class="rule-value-inner-item">
        <div class="label-text">字号：</div>
        <DesDVPixel v-model="form.fontSize" class="width-pixel"></DesDVPixel>
      </div>
      <div class="rule-value-inner-item">
        <div class="label-text">图标颜色：</div>
        <DesDVColorPicker
          v-model="form.color"
          :config="{
            type: 'color',
          }"
          class="inner-value"
        ></DesDVColorPicker>
      </div>
    </div>
    <!-- 图片 -->
    <div class="rule-value-inner" v-if="row.type === 'image'">
      <div class="rule-value-inner-item" v-if="!typeConfig.hiddenPosition">
        <div class="label-text">展示位置：</div>
        <el-radio-group size="small" v-model="form.position">
          <el-radio-button v-for="item in positionOptions" :key="item.value" :label="item.value">
            {{ item.label }}
          </el-radio-button>
        </el-radio-group>
      </div>
      <div class="rule-value-inner-item">
        <div class="label-text">图片上传：</div>
        <DesDVMoreImg
          class="more-image"
          v-model="form.image"
          :config="{
            backgroundTypes: [],
            limitImg: 1,
          }"
        ></DesDVMoreImg>
      </div>
      <template v-if="!typeConfig.hiddenWH">
        <div class="rule-value-inner-item">
          <div class="label-text">宽：</div>
          <DesDVPixel v-model="form.width" class="width-pixel"></DesDVPixel>
        </div>
        <div class="rule-value-inner-item">
          <div class="label-text">高：</div>
          <DesDVPixel v-model="form.height" class="width-pixel"></DesDVPixel>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: "ruleTypeItem",
  data() {
    return {
      positionOptions: [
        {
          label: "前面",
          value: "before",
        },
        {
          label: "后面",
          value: "after",
        },
      ],
      form: null,
    };
  },
  props: {
    value: {
      type: Object,
    },
    typeOptions: {
      type: Array,
      default: () => [],
    },
    row: {
      type: Object,
    },
  },
  watch: {
    form: {
      handler() {
        this.changeValue();
      },
      deep: true,
    },
  },
  computed: {
    typeConfig() {
      let one = this.typeOptions.find((item) => item.value === this.row.type) || { config: {} };
      return one.config || {};
    },
    oneOptions() {
      let one = this.typeOptions.find((item) => item.value === this.row.type) || {};
      return one;
    },
  },
  created() {
    this.form = _.cloneDeep(this.value);
  },
  methods: {
    changeValue() {
      this.$emit("input", this.form);
      this.$emit("change", this.form);
    },
  },
};
</script>
