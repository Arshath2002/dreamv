/*
 * @Description: 属性混入
 * @Author: shenah
 * @Date: 2024-09-13 17:15:12
 * @LastEditors: shenah
 * @LastEditTime: 2024-09-13 17:51:45
 */
export default {
  components: {},
  props: {
    currentBorderConfig: {
      type: Object,
      required: true,
    },
    currentBaseProgressConfig: {
      type: Object,
      required: true,
    },
    currentProgressConfig: {
      type: Object,
      required: true,
    },
    formatVal: {
      type: Number,
      required: true,
    },
    currentAnimationConfig: {
      type: Object,
      required: true,
    },
  },
  watch: {},
  computed: {},
  data() {
    return {};
  },
  created() { },
  mounted() { },
  methods: {},
};
