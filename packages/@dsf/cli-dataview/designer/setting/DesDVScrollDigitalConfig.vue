<!--
 * @Description: 数字翻牌器配置(图文组件)
 * @Author: shenah
 * @Date: 2023-07-07 09:28:06
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-06-27 14:16:28
-->

<template>
  <div class="hover-attr-wrap data-view-scroll-digital-config">
    <div class="hover-attr-item">
      <div class="hover-attr-item-name">翻牌器：</div>
      <DesDVSwitch :value="form.flag" @change="commonChange($event, form, 'flag')" />
    </div>
    <template v-if="form.flag">
      <div style="margin-left: 10px">
        <div class="hover-attr-item">
          <div class="hover-attr-item-name">展示形式：</div>
          <DesDVRadioGroup :data="{ dictionary: showTypeOptions }" :value="form.isTotalDigital" @change="commonChange($event, form, 'isTotalDigital')"></DesDVRadioGroup>
        </div>
        <div class="hover-attr-item" v-if="form.isTotalDigital">
          <div class="hover-attr-item-name">对齐方式：</div>
          <DesDVTextAlign :value="form.textAlign" :config="{ isShowVAlign: false, isShowDirection: false }" @change="commonChange($event, form, 'textAlign')" />
        </div>
        <div class="hover-attr-item">
          <div class="hover-attr-item-name">背景颜色：</div>
          <DesDVColorPicker :value="form.singleBackgroundConfig" @change="commonChange($event, form, 'singleBackgroundConfig')" />
        </div>
        <div class="hover-attr-item">
          <div class="hover-attr-item-name">背景图片：</div>
          <DesDVMoreImg :value="form.singleBackgroundConfig" :config="{ limit: 1 }" @change="commonChange($event, form, 'singleBackgroundConfig')" />
        </div>
        <div class="hover-attr-item">
          <div class="hover-attr-item-name">分割符号：</div>
          <el-input class="data-view-dv-dsf-pixel" v-model="form.separator" @change="commonChange($event, form, 'separator')" size="small" />
        </div>
        <div class="hover-attr-item">
          <div class="hover-attr-item-name">符号颜色：</div>
          <DesDVColorPicker :value="form.separatorColor" @change="commonChange($event, form, 'separatorColor')" />
        </div>
        <div class="hover-attr-item">
          <div class="hover-attr-item-name">数字宽度：</div>
          <DesDVPixel :value="form.digitalStyle.numberWidth" @change="commonChange($event, form.digitalStyle, 'numberWidth')" style="float: left" />
          <DesDVToolTipsIcon
            :data="{
              desc: '可以不设置，防止某些字体同大小宽度不一致导致容器抖动',
            }"
          />
        </div>
        <div class="hover-attr-item">
          <div class="hover-attr-item-name">字体边距：</div>
          <DesDVMarginsGroup
            :owner="form"
            @marginGroupChange="marginGroupChange"
            customEmit="marginGroupChange"
            :config="{
              options: [
                {
                  text: '外边距',
                  bindControlAttr: 'fontMargin',
                },
                {
                  text: '内边距',
                  bindControlAttr: 'fontPadding',
                },
              ],
            }"
          />
        </div>
        <div class="hover-attr-item">
          <div class="hover-attr-item-name">自动滚动：</div>
          <DesDVSwitch :value="form.config.autoplay" @change="commonChange($event, form.config, 'autoplay')" />
          <DesDVNumber style="margin-left: 20px" v-if="form.config.autoplay" :value="form.config.duration" :config="{ unit: 'ms' }" @change="commonChange($event, form.config, 'duration')" />
        </div>
        <div class="hover-attr-item">
          <div class="hover-attr-item-name">循环滚动：</div>
          <DesDVSwitch :value="form.isCycle" @change="commonChange($event, form, 'isCycle')" />
          <DesDVNumber v-if="form.isCycle" style="margin-left: 20px" :value="form.cycleSpaceTime" :config="{ unit: 'ms', min: 1000 }" @change="commonChange($event, form, 'cycleSpaceTime')" />
        </div>
      </div>
    </template>
  </div>
</template>
<script>
import { createWholeConfig } from "_dataview/output/config/scrollDigital";
export default {
  name: "DesDVScrollDigitalConfig",
  components: {},
  props: {
    currentData: {
      type: Object,
      default: () => ({}),
    },
    owner: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      showTypeOptions: [
        {
          text: "数字分割",
          value: false,
        },
        {
          text: "数值整体",
          value: true,
        },
      ],
      form: createWholeConfig(),
    };
  },
  created() {
    const config = createWholeConfig();
    this.form = dsf.mix(true, {}, config, this.currentData || {});
  },
  methods: {
    commonChange(val, item, key) {
      this.$set(item, key, val);
      this.$emit("change", this.form);
    },
    marginGroupChange(form) {
      this.$set(this, "form", form);
      this.$emit("change", this.form);
    },
  },
};
</script>
