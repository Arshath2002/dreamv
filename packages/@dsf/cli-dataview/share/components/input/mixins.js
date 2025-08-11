import { eventTemp } from "_dataview/output/utils/relativeEvent";

export default {
  props: {
    itemSet: {
      type: Object,
      default() {
        return {
          attach: [],
          code: [
            {
              text: "选项1",
              value: "1",
            },
            {
              text: "选项2",
              value: "2",
            },
          ],
          type: "static",
        };
      },
    },
    items: {
      type: Array,
      default() {
        return [];
      },
    },
    //业务组件选择
    businessComponents: {
      type: Array,
      default() {
        return [];
      },
    },
    //存在事件依赖
    hasEventRelative: {
      type: Boolean,
      default: true,
    },
    //事件依赖
    eventRelativeDeal: {
      type: Object,
      default() {
        return {
          load: {
            relatives: [],
            fn: eventTemp,
          },
          change: {
            relatives: [],
            fn: eventTemp,
          },
        };
      },
    },
  },
  data() {
    return {
      componentType: "select",
      dataItems: [],
    };
  },
  created() {
    // 兼容以前静态配置
    if (this.items.length) {
      this.itemSet.type = "static";
      this.itemSet.code = [...this.items];
      this.metadata = null;
      this.$emit("update:items", []);
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.handleEventScope();
    });
  },
  watch: {
    itemSet: {
      handler() {
        if (this.isDesign) {
          this.initData();
        }
      },
      deep: true,
    },
    businessComponents: {
      handler() {
        if (this.isDesign) {
          this.initData();
        }
      },
      deep: true,
    },
  },
  methods: {
    initData() {
      // 如果绑定业务组件
      if (this.businessComponents.length) {
        this.dataItems = this.businessComponents;
        return false;
      }

      const { code, type } = this.itemSet;
      let config = {};
      const httpHeader = this.httpHeader || this.$page?.httpHeader;
      // 添加大屏请求标识
      if (httpHeader) {
        if (config) {
          if (config.headers) {
            config.headers["view"] = "view_key";
          } else {
            config.headers = {
              view: "view_key",
            };
          }
        } else {
          config = {
            headers: {
              view: "view_key",
            },
          };
        }
      }

      switch (type) {
        case "dict":
          const url = dsf.url.getWebPath(`dict/getList/${code}`, $$webRoot.platform);
          this.$http.get(url, {}, config).done((data) => {
            if (data.success) {
              let list = data.data;
              this.dataItems = list;
            } else {
              dsf.layer.message("请求异常！", false);
            }
          });
          break;
        case "db":
          const dbSourceURL = dsf.url.getWebPath("meta/tree/dbSource", $$webRoot.platform);
          this.$http
            .get(
              dbSourceURL,
              {
                rmId: code,
              },
              config
            )
            .done((data) => {
              if (data.success) {
                let list = data.data.map((it) => {
                  let text = it.text === undefined ? it.name : it.text;
                  return {
                    text,
                    value: it.value,
                  };
                });
                this.dataItems = list;
              } else {
                dsf.layer.message("请求异常！", false);
              }
            });
          break;
        case "static":
          this.dataItems = code;
          break;
      }
    },
    handleUpdateItems(items) {
      this.dataItems = items;
    },
    handleSetValue(value) {
      if (this.multiple) {
        value = Array.isArray(value) ? value : [value];
        let values = [];
        value.forEach((it) => {
          let item = this.dataItems.find((_it) => _it.text === it);
          values.push(item.value);
        });

        this.value = values;
      } else {
        value = Array.isArray(value) ? value[0] : value;
        let item = this.dataItems.find((_it) => _it.text === value);
        this.value = item ? item.value : value;
      }
    },
    handleGetValue() {
      return this.value;
    },
    handleGetValueName() {
      let one = this.dataItems.find((item) => item.value == this.value);
      return one?.text || "";
    },
    changeItem(val) {
      let res = [];
      if (!this.multiple) {
        let item = this.dataItems.filter((item) => item.value == val);
        res = item;
      } else {
        var dataItems = [];
        for (let i = 0; i <= val.length - 1; i++) {
          this.dataItems.find((item) => {
            if (item.value == val[i]) {
              dataItems.push(item);
            }
          });
        }
        res = dataItems;
      }
      if (!this.isDesign) {
        let data = res.map((it) => it.value);
        this.getValue = data;
        this.loadChangeEvents(data);
        this.$dispatch("change", data);
      }
    },

    loadCompleteEvents(data) {
      try {
        let { fn } = this.eventRelativeDeal.load;
        this.currentComponentData = data;
        this.handleCommonEmit(fn, data);
      } catch (e) {
        console.error(e);
      }
    },

    loadChangeEvents(data) {
      try {
        let { fn } = this.eventRelativeDeal.change;
        this.currentComponentData = data;
        this.handleCommonEmit(fn, data);
      } catch (e) {
        console.error(e);
      }
    },
  },
};
