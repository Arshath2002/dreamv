<!--
 * @Description: 区域级联下拉选
 * @Author: shenah
 * @Date: 2024-11-22 11:32:53
 * @LastEditors: zhanghang
 * @LastEditTime: 2024-12-31 15:13:46
-->

<template>
  <div class="dsf-area-cascader">
    <el-cascader
      :options="options"
      v-model="currentValue"
      :placeholder="placeholder"
      :props="cascaderProps"
      @visible-change="visibleChange"
      @change="changeValue"
      :key="updateId"
      :showAllLevels="vm.showAllLevels"
      ref="cascader"
    >
    </el-cascader>
    <i class="common-del el-icon-circle-close" @click="clearValue"></i>
  </div>
</template>
<script>
import propertyMixin from "./propertyMixin";
import { getValuesByLastValue, getOptions } from "_dataview/output/config/areaCascaderConfig";
export default {
  name: "DesDVAreaCascader",
  mixins: [propertyMixin],
  props: {
    value: {
      type: [Object, String],
    },
    config: {
      type: Object,
      default() {
        return {};
      },
    },
    owner: {
      type: Object,
    },
  },
  data() {
    return {
      chinaCode: "000000000000",
      updateId: 0,
      options: [],
      defaultConfig: {
        isRangeType: false,
      },
      currentValue: "",
      placeholder: "请选择",
      isFirst: true,
    };
  },
  watch: {
    "vm.superCode"() {
      if (!this.currentConfig.isRangeType) {
        this.updateId = dsf.uuid();
        this.currentValue = "";
        this.placeholder = "请选择";
      } else {
        if (this.vm.superCode === this.chinaCode) {
          this.placeholder = "全国";
          this.currentValue = "";
        }
      }
      this.vm.$emit("update:userValue", null);
    },
    "vm.accuracy"() {
      if (!this.currentConfig.isRangeType) {
        this.updateId = dsf.uuid();
        this.currentValue = "";
        this.placeholder = "请选择";
      }
      this.vm.$emit("update:userValue", null);
    },
    "vm.showAllLevels"() {
      if (!this.currentConfig.isRangeType) {
        this.updateId = dsf.uuid();
        this.currentValue = "";
        this.placeholder = "请选择";
      }
      this.vm.$emit("update:userValue", null);
    },
  },
  computed: {
    cascaderProps() {
      return {
        label: "name",
        value: "dsfa_area_id",
        lazy: true,
        checkStrictly: this.checkStrictly,
        lazyLoad: this.lazyQueryData,
        emitPath: false,
      };
    },
    vm() {
      return this.owner.$children[0];
    },
    checkStrictly() {
      return this.currentConfig.isRangeType ? true : this.vm.checkStrictly;
    },
    topCode() {
      return this.currentConfig.isRangeType ? this.chinaCode : this.vm.superCode;
    },
    realSuperCode() {
      let code = this.topCode;
      if (!/^([\d\w]+\.)*[\d\w]+$/.test(code) || code == this.chinaCode) {
        return this.chinaCode;
      }
      code = code.split(".");
      if (code.length == 1) {
        code = getValuesByLastValue(code[0], {
          rootCode: this.chinaCode,
          isFull: false, // 是否填充0
          inferCode: null, // 推导编码的方法，默认为空
        });
      }
      return code.join(".");
    },
    rangeStart() {
      let codes = this.realSuperCode.split(".");
      let r = codes.length - 1;
      return r;
    },
    rangeEnd() {
      let r = this.vm.accuracy;
      let totalLevel = this.isRangeType ? "3" : "4";
      return r > totalLevel ? totalLevel : r;
    },
  },
  created() {
    this.initValue();
  },
  beforeDestroy() {},
  methods: {
    initValue() {
      if (this.currentConfig.isRangeType) {
        this.currentValue = this.value;
        this.placeholder = "全国";
      } else {
        if (this.value && this.value.value) {
          this.currentValue = this.value.value;
        }
      }
      this.queryLike().then((res) => {
        let nameArr = [];
        const getNames = (data) => {
          data.forEach((item) => {
            nameArr.push(item.name);
            if (item.children && item.children.length > 0) {
              getNames(item.children);
            }
          });
        };
        getNames(res);
        if (nameArr.length > 0) {
          this.placeholder = nameArr.join("/");
        }
      });
    },
    queryLike(code) {
      let keyword = code !== undefined ? code : this.currentValue;
      return new Promise((resolve, reject) => {
        if (!keyword) {
          resolve([]);
          return;
        }
        const url = dsf.url.getWebPath("area/selectArea", $$webRoot.platform);
        this.$http
          .get(url, {
            keyword,
            fields: "CODE",
            level: this.rangeEnd + 2,
            key: this.topCode,
            $AreaVersionDate: "",
          })
          .done(({ success, message, data }) => {
            if (!success) {
              dsf.layer.message(message || "请求异常", false);
              resolve([]);
              return;
            }
            if (!dsf.isArray(data)) {
              data = [];
            }
            resolve(data);
          })
          .error((err) => {
            resolve([]);
          });
      });
    },
    // 懒加载查询
    lazyQueryData(node, resolve) {
      let { root, data } = node;
      let ids, level;
      if (root) {
        ids = this.topCode;
        level = this.rangeStart + 1;
      } else {
        let { treeinfo_globalid, treeinfo_level } = data;
        ids = treeinfo_globalid;
        level = treeinfo_level;
      }
      if (level > this.rangeEnd + 1) {
        resolve([]);
        return;
      }
      if (root) {
        if (ids !== this.chinaCode && !this.currentConfig.isRangeType) {
          this.queryLike(this.topCode).then((res) => {
            let lastItem = {};
            const getItem = (data) => {
              data.forEach((item) => {
                if (!item.children?.length) {
                  lastItem = item;
                } else {
                  if (item.children && item.children.length) {
                    getItem(item.children);
                  }
                }
              });
            };
            getItem(res);
            ids = lastItem.treeinfo_globalid;
            getOptions.call(
              this,
              {
                ids,
                endRange: level + 1,
                startRange: level + 1,
                areaVersion: "",
              },
              (list) => {
                if (level === this.rangeEnd + 1) {
                  list.forEach((l) => (l.leaf = true));
                }
                resolve(list);
              }
            );
          });
          return;
        }
      }
      getOptions.call(
        this,
        {
          ids,
          endRange: level + 1,
          startRange: level + 1,
          areaVersion: "",
        },
        (list) => {
          if (level === this.rangeEnd + 1) {
            list.forEach((l) => (l.leaf = true));
          }
          resolve(list);
        }
      );
    },
    visibleChange() {
      return;
    },
    changeValue(val) {
      if (this.currentConfig.isRangeType) {
        if (!val) {
          val = this.chinaCode;
        }
        this.vm.$emit("update:userValue", null);
        this.$emit("input", val);
        this.$emit("change", val);
      } else {
        let node = this.$refs.cascader.getCheckedNodes()[0] || { path: [], pathLabels: [], pathNodes: [] };
        let values = node.path;
        let text = node.pathLabels;
        let allArr = node.pathNodes;
        let alias = allArr.map((item) => item.data.alias);
        let nowVal = {
          text: this.vm.showAllLevels ? text.join("/") : _.last(text),
          alias: this.vm.showAllLevels ? text.join("/") : _.last(alias),
          value: _.last(values),
          allValue: values,
          allText: text,
          allAlias: alias,
        };
        this.$emit("input", nowVal);
        this.$emit("change", nowVal);
      }
    },
    clearValue() {
      this.currentValue = "";
      this.$nextTick(() => {
        this.changeValue(null);
      });
    },
  },
};
</script>
<style lang="scss">
.dsf-area-cascader {
  input {
    &::-webkit-input-placeholder {
      color: #333333;
    }
  }
  .common-del {
    margin-left: 6px;
    cursor: pointer;
    font-size: 14px;
    color: #999999;
  }
}
</style>
