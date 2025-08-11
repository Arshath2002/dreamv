<template>
  <div class="des-dv-map-property">
    <div class="des-dv-map-series__wrapper">
      <div class="des-dv-map-series__wrapper-item" @click="active = idx" :class="{ active: active === idx }" v-for="(it, idx) in styles" :key="idx" :label="idx">
        菜单{{ idx + 1 }}级
        <DsfIcon class="del-icon" name="close" @click="deleteStyle(idx)" v-if="idx > 0"></DsfIcon>
      </div>
      <div class="des-dv-icon-add" @click="addStyle" style="margin-left: 5px; margin-bottom: 0">
        <i class="add-btn el-icon-plus"></i>
      </div>
    </div>
    <div v-for="(item, index) in styles" :key="index" style="margin-top: 10px">
      <template v-if="active == index">
        <div class="ds-designer-property property-item">
          <div class="property-item-name">菜单背景<span>： </span></div>
          <DesDVColorPicker :config="linerColor" v-model="item.backgroundColor" @change="changeValue($event, item, 'backgroundColor')" />
        </div>
        <div class="ds-designer-property property-item">
          <div class="property-item-name">高亮背景<span>： </span></div>
          <DesDVColorPicker :config="linerColor" v-model="item.activeBackgroundColor" @change="changeValue($event, item, 'activeBackgroundColor')" />
        </div>
        <div class="ds-designer-property property-item">
          <div class="property-item-name">外线颜色<span>： </span></div>
          <DesDVColorPicker :config="linerColor" v-model="item.outLineColor" @change="changeValue($event, item, 'outLineColor')" />
        </div>
        <div class="ds-designer-property property-item">
          <div class="property-item-name">边线颜色<span>： </span></div>
          <DesDVMoreModeColor :config="modeColor" v-model="item.bottomLineColor" @change="changeValue($event, item, 'bottomLineColor')" />
        </div>

        <div class="ds-designer-property property-item">
          <div class="property-item-name">文字样式<span>： </span></div>
          <DesDVTextStyle class="min" v-model="item.textStyle" :config="fontConfig"></DesDVTextStyle>
        </div>
        <div class="ds-designer-property property-item">
          <div class="property-item-name">高亮样式<span>： </span></div>
          <DesDVTextStyle class="min" v-model="item.activeTextStyle" :config="fontConfig"></DesDVTextStyle>
        </div>
      </template>
    </div>
  </div>
</template>
<script>


export default {
  name: "DesDVGaugeMenu",
  props: {
    value: {
      type: Array,
    },
    config: {
      type: Object,
    },
  },
  data() {
    return {
      active: 0,
      fontConfig: {
        picker: {
          type: "color",
        },
      },
      linerColor: {
        type: "liner",
      },
      modeColor: {
        lastOneDel: true,
        allowDelete: false,
        limit: 2,
        type: "color",
      },
    };
  },
  computed: {
    styles() {
      return this.value.map((it) => {
        const { backgroundColor, activeBackgroundColor, outLineColor, ...properties } = it;

        return {
          ...properties,
          backgroundColor: `linear-gradient(90deg,${backgroundColor[0]}  0%,${backgroundColor[1]} 100%)`,
          activeBackgroundColor: `linear-gradient(90deg,${activeBackgroundColor[0]}  0%,${activeBackgroundColor[1]} 100%)`,
          outLineColor: `linear-gradient(90deg,${outLineColor[0]}  0%,${outLineColor[1]} 100%)`,
        };
      });
    },
  },
  methods: {
    deleteStyle(index) {
      this.styles.splice(index);
      this.submitResult();
      if (this.active >= index) {
        this.active--;
      }
    },
    addStyle() {
      const copy = _.cloneDeep(this.styles[this.styles.length - 1]);
      this.styles.push(copy);
      this.submitResult();
    },
    changeValue(value, item, key) {
      this.$set(item, key, value);
      this.submitResult();
    },
    submitResult() {
      const result = this.styles.map((it) => {
        const { backgroundColor, activeBackgroundColor, outLineColor, ...properties } = it;
        return {
          ...properties,
          backgroundColor: this.transformColor(backgroundColor),
          activeBackgroundColor: this.transformColor(activeBackgroundColor),
          outLineColor: this.transformColor(outLineColor),
        };
      });
      this.$emit("input", result);
      this.$emit("change", result);
    },
    transformColor(image) {
      const reg = /(#[0-9A-Za-z]{3,})|(rgb(?:a)?\(.+?\))/g;
      const result = image.match(reg);
      if (result && result.length) {
        return result.slice(0, 2);
      }
      return [];
    },
  },
};
</script>
<style lang="scss">
@import "_dataview/assets/styles/designer/DesDVMapProperty.scss";
</style>
