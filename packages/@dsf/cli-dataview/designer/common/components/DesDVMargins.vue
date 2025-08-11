<template>
  <div class="dsf-margins">
    <el-input
      class="dsf-margins-input"
      :disabled="inputDisabled"
      v-model="dataValue[0]"
      @change="changeValue(0)"
      :type="currentConfig.type"
    >
    </el-input>
    <div class="dsf-margins-center">
      <el-input
        class="dsf-margins-input"
        :disabled="inputDisabled"
        v-model="dataValue[3]"
        @change="changeValue(3)"
        :type="currentConfig.type"
      ></el-input>
      <div class="dsf-margins-rectangle">
        <div class="diagonal-line-right"></div>
        <div class="diagonal-line-left"></div>
      </div>
      <el-input
        class="dsf-margins-input"
        :disabled="inputDisabled"
        v-model="dataValue[1]"
        @change="changeValue(1)"
        :type="currentConfig.type"
      ></el-input>
    </div>
    <el-input
      class="dsf-margins-input"
      :disabled="inputDisabled"
      v-model="dataValue[2]"
      @change="changeValue(2)"
      :type="currentConfig.type"
    ></el-input>
  </div>
</template>

<script>
import propertyMixin from "_dataview/designer/common/components/propertyMixin.js";
export default {
  name: 'DesDVMargins',
  mixins: [propertyMixin],
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    value: {
      type: Array,
      default: () => [0, 0, 0, 0],
    },
    inputDisabled: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    value: {
      handler(v) {
        if (v.length === 4) {
          this.dataValue = _.cloneDeep(v)
        } else if (v.length === 3) {
          this.dataValue[0] = v[0]
          this.dataValue[1] = v[1]
          this.dataValue[3] = v[1]
          this.dataValue[2] = v[2]
        } else if (v.length === 2) {
          this.dataValue[0] = v[0]
          this.dataValue[2] = v[0]
          this.dataValue[1] = v[0]
          this.dataValue[3] = v[0]
        } else if (v.length === 1) {
          this.dataValue.forEach((item) => {
            if (Array.isArray(v)) {
              item = v[0]
            } else {
              item = v
            }
          })
        }
      },
      immediate: true
    },

  },
  data() {
    return {
      defaultConfig: {
        type:"number"
      },
      dataValue: [0, 0, 0, 0],
    }
  },
  methods: {
    changeValue(index) {
      if (this.dataValue[index] === '') {
        this.dataValue[index] = 0
      }
      this.$emit('change', this.dataValue)
    },
  },
}
</script>
<style lang="scss">
@import "_dataview/assets/styles/designer/common/commonProperty/margins.scss";
</style>
