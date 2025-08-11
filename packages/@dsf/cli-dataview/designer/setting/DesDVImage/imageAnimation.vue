<!--
 * @Description: 图片动画
 * @Author: shenah
 * @Date: 2025-02-26 15:48:52
 * @LastEditors: shenah
 * @LastEditTime: 2025-02-27 17:28:03
-->

<template>
  <div class="des-dv-image-animation-effect-setting hover-attr-wrap">
    <template v-if="form[form.active] && form[form.active].animation">
      <div class="hover-attr-item">
        <div class="hover-attr-item-name">动画效果：</div>
        <DsfAnimationSelect
          v-model="form[form.active].animation.name"
          class="animation-select"
          :form="form"
          :config="{
            size:'small'
          }"
          @change="effectChange($event, form[form.active].animation, 'name')"
        ></DsfAnimationSelect>
      </div>
      <!-- 动画详细 -->
      <div class="image-info-effect">
        <div
          class="info-item"
          v-for="item in form[form.active].animation.attrList"
          :key="item.value"
        >
          <div class="info-title">{{ item.label }}</div>
          <div class="info-attr">
            <div class="info-attr-item">
              <label class="text">动画：</label>
              <DesDVNumber
                :config="{ min: 0, unit: 's' }"
                v-model="item.duration"
                class="min-width"
              />
            </div>
            <div class="info-attr-item">
              <label class="text">间隔：</label>
              <DesDVNumber
                :config="{ min: 0, unit: 's' }"
                v-model="item.delay"
                class="min-width"
              />
            </div>
            <!-- 渐变 -->
            <template v-if="item.value === 'dvDynamicOpacity'">
              <div class="info-attr-item">
                <label class="text">渐变：</label>
                <DesDVNumber
                  :config="{ min: 0, max: 1 }"
                  v-model="item.range[0]"
                  class="min-width"
                />
                <span class="space">~</span>
                <DesDVNumber
                  :config="{ min: 0, max: 1 }"
                  v-model="item.range[1]"
                  class="min-width"
                />
              </div>
            </template>
            <!-- 上下跳动 -->
            <template v-else-if="item.value === 'dvJumpUpDown'">
              <div class="info-attr-item">
                <label class="text">跳动：</label>
                <DesDVNumber
                  :config="{ unit: 'px' }"
                  v-model="item.jumpHeight"
                  class="min-width"
                />
              </div>
            </template>
            <!-- 顺时针或者逆时针 -->
            <template
              v-else-if="
                item.value === 'dvClockwiseRotate' ||
                  item.value === 'dvNotClockwiseRotate'
              "
            >
              <!-- 目前无 -->
            </template>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
import { createAnimationOptions } from "_dataview/output/config/backgroundExtend.js";
export default {
  name: "ImageAnimation",
  props: {
    form: {
      type: Object,
      require: true,
    },
  },
  components: {
    DsfAnimationSelect: Vue.defineAsyncComponent(() =>
      import(
        /* webpackChunkName: "dataview_design_private" */ "_dataview/designer/common/components/dsfAnimationSelect.vue"
      )
    ),
  },
  data() {
    const commonAttr = {
      delay: 0,
      duration: 2.5,
    };
    return {
      effectConfig: {
        dvDynamicOpacity: {
          ...commonAttr,
          range: [0.5, 1],
        },
        dvJumpUpDown: {
          ...commonAttr,
          jumpHeight: -15,
        },
        dvClockwiseRotate: {
          ...commonAttr,
        },
        dvNotClockwiseRotate: {
          ...commonAttr,
        },
      },
    };
  },
  created() {},
  computed: {},
  methods: {
    effectChange(val, item, key) {
      let newAttrList = this.createAttrList(this.form[this.form.active].animation, val);
      this.form[this.form.active].animation.attrList = [];
      setTimeout(() => {
        this.form[this.form.active].animation.attrList = newAttrList;
      });
      this.commonChange(val, item, key);
    },
    createAttrList(obj, list) {
      let newAttrList = [];
      let optionList = createAnimationOptions();
      list.forEach((str) => {
        let newOne = {};
        let attrList = obj.attrList;
        let one = attrList.find((item) => item.value === str);
        if (one) {
          newOne = dsf.mix(true, this.effectConfig[str], one);
        } else {
          let opOne = optionList.find((item) => item.value === str);
          newOne = dsf.mix(
            true,
            { value: str, label: opOne.label },
            this.effectConfig[str]
          );
        }
        newAttrList.push(newOne);
      });
      return newAttrList;
    },
    commonChange(val, item, key) {
      this.$set(item, key, val);
      this.$emit("updateData", this.form);
    },
  },
};
</script>
