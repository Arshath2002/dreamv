/*
 * @Description: 右边属性的混入
 * @Author: shenah
 * @Date: 2024-03-20 10:50:42
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-02-14 17:16:51
 */

export default {
  components: {},
  props: {
    config: {
      type: Object,
      default: () => ({}),
    },
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    isArrayValue() {
      return Array.isArray(this.value);
    },
    currentConfig() {
      let config = this.config;
      if (this.data.config) {
        config =  this.data.config
      }
      return dsf.mix(true, {}, this.defaultConfig, config);
    },
  },
  data() {
    return {
      defaultConfig: {}, // 默认配置
    };
  },
  created() {},

  methods: {
    initConfig() {},
  },
};
