/*
 * @Description: 公用mixins
 * @Author: shenah
 * @Date: 2024-12-16 13:52:47
 * @LastEditors: shenah
 * @LastEditTime: 2024-12-16 14:05:28
 */
export default {
  props: {
    shape: {
      type: String,
      required: true,
    },
    itemWidth: {
      type: Number,
      required: true,
    },
    itemHeight: {
      type: Number,
      required: true,
    },
    itemInnerWidth: {
      type: Number,
      required: true,
    },
    itemInnerHeight: {
      type: Number,
      required: true,
    },
    itemInnerColor: {
      type: String,
      required: true,
    },
    borderConfig: {
      type: Object,
      required: true,
    },
    animationConfig: {
      type: Object,
      required: true,
    },
    outerShadowConfig: {
      type: Object,
      required: true,
    },
    innerShadowConfig: {
      type: Object,
      required: true,
    },
  },
};
