<!--
 * @Description: 下拉选弹窗
 * @Author: shenah
 * @Date: 2024-11-18 10:10:19
 * @LastEditors: zhanghang
 * @LastEditTime: 2024-12-02 14:02:41
-->

<template>
  <div class="dataview-area-cascader-panel" v-onresize="onObserveResize">
    <el-autocomplete
      class="inline-input"
      v-model="keyword"
      :popper-append-to-body="false"
      :fetch-suggestions="querySearch"
      placeholder="请输入关键词"
      suffix-icon="el-icon-search"
      @focus="handleFocus"
      @blur="handleBlur"
      @select="handleSelect"
    >
      <template #default="{ item }">
        {{ item[optionsTextField] || item.name }}
      </template>
    </el-autocomplete>
    <el-cascader-panel ref="panel" v-model="value" v-loading="firstLoading" :props="props" @change="handleChange" />
  </div>
</template>

<script>
import { getValuesByLastValue, getOptions } from "_dataview/output/config/areaCascaderConfig";
export default {
  name: "DsfAreaCascaderPanel",
  props: {
    superCode: {
      type: String,
      default: "000000000000",
    },
    // 精确度，选择到第几级: 0-省、1-市、2-区县、3-街道、4-村居
    accuracy: {
      type: Number,
      default: 4,
    },
    // 是否可选择任意一级
    checkStrictly: {
      type: Boolean,
      default: false,
    },
    // 选项中显示的文本字段
    optionsTextField: {
      type: String,
      default: "name",
    },
    //选中时显示的值
    selectedTextField: {
      type: String,
      default: "name",
    },
    // 编码规则
    codeRule: {
      type: Object,
      default() {
        return {
          rootCode: "000000000000", // 根节点编码
          isFull: false, // 是否填充0
          inferCode: null, // 推导编码的方法，默认为空
        };
      },
    },
    // 懒加载自定义方法, 参数（node, params, resolve）
    lazyLoadData: {
      type: Function,
      default: null,
    },
    // 是否显示父级选项
    showSuperSelect: {
      type: Boolean,
      default: false,
    },
    // 区划版本
    areaVersion: {
      type: [String, Number],
      required: false,
    },
  },
  data() {
    return {
      firstLoading: true,
      fields: "",
      keyword: "",
      value: "",
    };
  },
  computed: {
    props() {
      return {
        value: this.selectedTextField,
        label: this.optionsTextField,
        checkStrictly: this.checkStrictly,
        children: "children",
        lazy: true,
        lazyLoad: this.getData,
      };
    },
    realSuperCode() {
      let code = this.superCode.trim();
      if (!/^([\d\w]+\.)*[\d\w]+$/.test(code) || code == this.codeRule.rootCode) {
        return this.codeRule.rootCode;
      }
      code = code.split(".");
      if (code.length == 1) {
        code = getValuesByLastValue(code[0], this.codeRule);
      }
      return code.join(".");
    },
    rangeStart() {
      let codes = this.realSuperCode.split(".");
      let r = codes.length - 1;
      if (r > 0 && this.showSuperSelect) {
        r--;
      }
      return r;
    },
    rangeEnd() {
      let r = this.accuracy;
      return r > 4 ? 4 : r;
    },
  },
  mounted() {
    this.panel = this.$refs.panel;
    this.store = this.panel.store;
  },
  methods: {
    onObserveResize(entry) {
      entry && this.sizeChange();
    },
    sizeChange(value) {
      this.$emit("size-change", value);
    },
    setValue(value = []) {
      if (this.firstLoading) {
        this.__queen = () => {
          this.checkByValue(value);
        };
      } else {
        this.checkByValue(value);
      }
    },
    querySearch(keyword, cb) {
      let f = this.fields;
      let fields = "";
      if (/^\d+$/.test(keyword)) {
        fields = "CODE";
      } else if (/^[a-zA-Z]+$/.test(keyword)) {
        fields = "PINYIN";
      } else if (/^[\u4e00-\u9fa5]+$/.test(keyword)) {
        fields = "NAME,ALIAS";
      }
      if (!fields || (f && fields.indexOf(f) == -1)) {
        return cb([]);
      }
      this.doSearch(keyword, fields, cb);
    },
    handleFocus() {
      this.$emit("input-focus");
    },
    handleBlur() {
      this.$emit("input-blur");
    },
    handleSelect(item) {
      let value = item.globalid.split(".").splice(1);
      this.checkByValue(value);
      this.$emit("select", item);
    },
    checkByValue(value) {
      let fn = (i, nodes) => {
        if (value.length === i) {
          if (this.checkStrictly) {
            this.handleChange(value);
            this.value = value;
          }
          return;
        }
        let node = _.find(nodes, (n) => n.data.areacode === value[i]) || value[i];
        this.lazyLoad(node, (nodes) => {
          fn(i + 1, nodes);
        });
      };
      if (value.length) fn(0);
      else this.value = value;
    },
    doSearch(keyword, fields, cb) {
      const url = dsf.url.getWebPath("area/selectArea", $$webRoot.platform);
      this.$http
        .get(url, {
          keyword,
          fields,
          level: this.rangeEnd + 2,
          key: this.superCode,
          $AreaVersionDate: this.areaVersion,
        })
        .done(({ success, message, data }) => {
          if (!success) {
            dsf.layer.message(message || "请求异常", false);
            cb([]);
            return;
          }
          if (!dsf.isArray(data)) {
            data = [];
          }
          cb(this.searchHandler(keyword, data));
        })
        .error((err) => {
          dsf.layer.message(err?.message || "请求异常", false);
          cb([]);
        });
    },
    searchHandler(keyword, res) {
      let arr = [];
      dsf.deepForEach(res, (item, level, index, parent) => {
        if (parent) {
          item.path = {
            name: parent.path.name + " / " + item.name,
            alias: parent.path.alias + " / " + item.alias,
            globalid: item.treeinfo_globalid,
          };
        } else {
          item.path = {
            name: item.name,
            alias: item.alias,
            globalid: item.treeinfo_globalid,
          };
        }
        if (!item.children?.length) {
          arr.push({
            value: keyword,
            ...item.path,
          });
        }
      });
      return arr;
    },
    getData(node, resolve) {
      let { root, data } = node;
      let ids, level;
      if (root) {
        ids = this.superCode;
        level = this.rangeStart + 1;
      } else {
        let { treeinfo_globalid, treeinfo_level } = data;
        ids = treeinfo_globalid;
        level = treeinfo_level;
      }
      if (level > this.rangeEnd + 1) {
        resolve([]);
        this.firstLoading = false;
        this.__queen = undefined;
        return;
      }
      if (this.lazyLoadData) {
        return this.lazyLoadData(
          node,
          {
            ids,
            endRange: level + 1,
            startRange: level + 1,
          },
          resolve
        );
      }
      getOptions.call(
        this,
        {
          ids,
          endRange: level + 1,
          startRange: level + 1,
          areaVersion: this.areaVersion,
        },
        (list) => {
          if (level === this.rangeEnd + 1) {
            list.forEach((l) => (l.leaf = true));
          }
          resolve(list);
          this.firstLoading = false;
          this.$nextTick(() => {
            this.__queen?.();
            this.__queen = undefined;
          });
        }
      );
    },
    lazyLoad(node, cb) {
      if (dsf.isString(node)) {
        node = this.store.getNodeByValue(node);
      }
      if (!node?.vm) return;
      // node.vm.$el.scrollIntoView({
      //   behavior: "auto",
      //   block: "nearest"
      // });
      node.vm.handleExpand(null, (children) => {
        cb(children);
      });
    },
    isEmptyValue(val) {
      const { multiple } = this;
      const { emitPath } = this.panel.config;
      if (multiple || emitPath) {
        return isEmpty(val);
      }
      return false;
    },
    computePresentText() {},
    handleChange(val) {
      let res = {
        nodes: [],
        values: [],
      };
      if (val.length == 0) {
        this.$emit("change", res);
        return;
      }
      this.panel.activePath.length || this.panel.syncActivePath();
      let activePath = [...this.panel.activePath];
      if (val.length == 1 && activePath.length == 0) {
        let last = this.store.getNodeByValue(val[0]);
        activePath.push(last);
      } else if (val.length > activePath.length) {
        let id = _.last(val);
        let last = _.find(_.last(activePath).children, (it) => it.value === id);
        activePath.push(last);
      }
      res = {
        nodes: activePath,
        values: val,
      };
      this.$emit("change", res);
    },
    scrollIntoView() {
      this.panel.scrollIntoView();
    },
  },
};
</script>
