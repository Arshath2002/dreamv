<!--数据源-->
<template>
  <div class="ds-data-select" style="height: 100%; overflow: auto">
    <dsf-tree-select
      :tree-data="treeData"
      :loading="loading[0]"
      :default-checked-key="defaultCheckedKey"
      :multiple="multiple"
      :search-control="searchControl"
      :theme="theme"
      node-key="ID"
      node-name="label"
      default-expand-all
      @choose-key="chooseKey"
      @choose-node="chooseNode"
    />
  </div>
</template>

<script>
export default {
  name: "DesDVDbDataSelect",
  props: {
    value: {
      type: Object,
      default() {
        return {
          key: null,
          node: null,
        };
      },
    },
    // 主题 theme1，theme2
    theme: {
      type: String,
      default: "theme2",
    },
    // 是否显示筛选框
    searchControl: {
      type: Boolean,
      default: true,
    },
    // 是否多选
    multiple: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      loading: false,
      treeData: [],
      defaultCheckedKey: "",
      node: null,
    };
  },
  created() {
    this.initValue();
    this.postData();
    if (this.value.key) {
      this.defaultCheckedKey = this.value.key || ""; // JSON.stringify(this.value.key);
    }
  },
  methods: {
    initValue() {
      if (this.multiple) {
        if (this.value.key && dsf.type(this.value.key) !== "array") {
          this.updateValue({
            key: [this.value.key],
            node: [this.value.node],
          });
        }
      } else {
        if (this.value.key && dsf.type(this.value.key) === "array") {
          this.updateValue({
            key: this.value.key[0],
            node: this.value.node[0],
          });
        }
      }
    },
    postData() {
      this.loading = true;
      const url = dsf.url.getWebPath("rm/list/ds", $$webRoot.platform);
      this.$http
        .get(url, {
          namespace: "",
        })
        .done((data) => {
          if (data.success) {
            this.treeData = data.data.map((v) => this.dataFormat(v));
          } else {
            dsf.layer.message("请求异常！", false);
          }
        })
        .always(() => {
          this.loading = false;
        });
    },
    dataFormat({ _id, _name, name, ID, type_value, children }) {
      const obj = {
        _id,
        _name,
        label: name,
        ID,
        nocheck: type_value !== "3" && type_value !== "8",
        iconSkin: "",
      };
      if (children) {
        obj.children = children.map((v) => this.dataFormat(v));
      } else if (obj.nocheck) {
        obj.iconSkin = "_special";
      }
      return obj;
    },
    chooseKey(key) {
      setTimeout(() => {
        this.updateValue({
          key,
          node: this.node,
        });
      }, 20);
    },
    chooseNode(data) {
      this.node = data;
    },
    updateValue(val) {
      this.$emit("input", val);
      this.$emit("change", val);
    },
  },
};
</script>
