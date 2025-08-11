/*
 * @Editor: zhanghang
 * @Description:
 * @Date: 2024-03-11 17:11:30
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-07-18 17:22:08
 */

export default {
  props: {
    value: {
      type: String,
      require: true,
    },
  },
  data() {
    return {
      val: this.value,
    };
  },
  render(h) {
    return h(
      "el-select",
      {
        style: {
          width: "90%",
          display: "block",
          margin: "auto",
        },
        props: {
          value: this.val,
        },
        on: {
          input: (val) => {
            this.val = val;
            this.$emit("change", val);
          },
        },
      },
      [h("el-option", { props: { label: "百分比布局", value: "%" } }), h("el-option", { props: { label: "自由布局", value: "px" } })]
    );
  },
  methods: {
    yes() {
      return this.val;
    },
  },
};
