<script>
export default {
  name: "dataReplaceText",
  render(h) {
    return h("el-input", {
      class: "data-replace-text-input",
      attrs: { placeholder: this.placeholder },
      props: {
        value: this.inputValue,
        resize: "none",
        row: 2,
        type: "textarea",
      },
      on: {
        input: (value) => {
          this.inputValue = value;
        },
      },
    });
  },
  props: {
    owner: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      inputValue: "",
      placeholder: [
        '格式："文本|替换文本"',
        "多个替换文本用回车符换行",
        "例：",
        "四川省|四川",
        "北京市|北京",
      ].join("\n"),
    };
  },
  created() {
    this.inputValue = this.jsonToStr();
  },
  methods: {
    jsonToStr() {
      let dataReplaceText = this.owner.dataReplaceText;
      let str = [];
      dataReplaceText.forEach(([text, replaceText]) => {
        str.push(text + "|" + replaceText);
      });
      return str.join("\n");
    },
    srtToJson() {
      let str = this.inputValue;
      let res = [];
      str.split("\n").forEach((it) => {
        let arr = it.trim().split("|");
        if (arr.length === 2) {
          res.push(arr);
        }
      });

      return res;
    },
    yes() {
      return this.srtToJson()
    },
  },
};
</script>
