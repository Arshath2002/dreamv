import { eventTemp, dealTemp } from "_dataview/output/utils/relativeEvent";
import { filterConditionStrategy } from "_dataview/output/utils/filterData";
import { utilsHandleParseCodeForDataHand } from "_dataview/output/utils/event";
//图表，数据组件事件公共方法
import dataGraphCommonEvent from "./dataGraphCommonEvent.js";
import { getDataSource } from "_dataview/output/config/designer.js";

/**
 * @name： 获取 对象的hashCode
 * @param {Object} data
 * @returns {String} hashCode
 */
const getHashCode = function (data) {
  // 将对象obj转换为字符串
  const str = JSON.stringify(data);

  let hash = 0,
    i,
    chr,
    len;
  if (str.length === 0) return hash;
  for (i = 0, len = str.length; i < len; i++) {
    chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash.toString();
};
//生成公式语法树
const generateFormalTree = function (value) {
  //计算字符出现的数量
  let cal = function (str, keyWord) {
    let sumNum = 0;
    if (str) {
      let arr = str.split(keyWord);
      sumNum = arr.length - 1;
    }
    return sumNum;
  };
  let analysis = function (value) {
    // 公式语法树
    let formula = {
      name: "",
      args: [],
    };
    if (!value) return value;
    //匹配 是否符合公式规范
    let isFormulaReg = /[a-zA-Z]+\([\s\S]*\)/;
    let funcNameReg = /[a-zA-Z]+(?=\()/;
    // 获取参数
    if (isFormulaReg.test(value)) {
      let result = value.match(funcNameReg);
      //属于公式
      if (result) {
        let name = result[0];
        formula.name = name;
        let index = 0;
        let len = name.length;
        let args = value.substring(index + len + 1, value.length - 1);
        // 'a,b,c(c,e(s,d)),d,'.match(/(([a-z]+\(.+\)))+/g)
        let argsArr = args.split(",");

        // 解析参数
        let argsRes = [];
        //笨比方法
        let left = 0;
        let funs = "";
        for (let i = 0; i < argsArr.length; i++) {
          let item = argsArr[i];
          if (cal(item, "(")) {
            left += cal(item, "(");
          }
          if (cal(item, ")")) {
            left -= cal(item, ")");
          }
          funs += "," + item;
          if (left === 0) {
            argsRes.push(funs.replace(/^,/, ""));
            funs = "";
          }
        }
        argsRes.forEach((arg) => {
          formula.args.push(analysis(arg));
        });
        return formula;
      } else {
        //就是普通字符串
        return value;
      }
    } else {
      return value;
    }
  };
  return analysis(value);
};
// 请求参数解析类型
const getParams = {
  // 固定值
  text: function (value) {
    return value;
  },
  // 路径取值
  queryString: function (value = "") {
    const scope = this.queryString || {};
    return value.startsWith("@") ? this.$replace(value, scope) : scope[value];
  },
  // cookie取值
  cookie: function (value = "") {
    const scope = dsf.cookies.get();
    return value.startsWith("@") ? this.$replace(value, scope) : scope[value];
  },
  // localStorage取值
  localStorage: function (value = "") {
    const scope = localStorage;
    return value.startsWith("@") ? this.$replace(value, scope) : scope[value];
  },
  // sessionStorage取值
  sessionStorage: function (value = "") {
    const scope = sessionStorage;
    return value.startsWith("@") ? this.$replace(value, scope) : scope[value];
  },
  // 大屏全局参数取值
  $dataview: function (value = "") {
    if (this.$vm && this.$vm.$dataview) {
      const scope = this.$vm.$dataview;
      return value.startsWith("@") ? this.$replace(value, scope) : scope[value];
    }
  },
  // 二开取值
  vm: function (value = "") {
    if (this.$vm) {
      const scope = this.$vm;
      return value.startsWith("@") ? this.$replace(value, scope) : scope[value];
    }
  },
  // 弹框取值
  dialog: function (value = "") {
    if (this.$vm && this.$vm.$dialogArgs) {
      const scope = this.$vm.$dialogArgs;
      return value.startsWith("@") ? this.$replace(value, scope) : scope[value];
    }
  },
};
export default {
  mixins: [dataGraphCommonEvent],
  props: {
    // ai 大模型参数
    modelArgs: {
      type: Object,
      default: null,
    },
    //数据来源类型
    dataType: {
      type: String,
      default: "excel",
    },
    //综合数据信息 {id,url,params}
    combineTable: {
      type: Object,
      default() {
        return {
          name: "",
          active: "combineLedger",
          id: "",
          url: "/metadata/macrodata/kiv/queryMetadataTableData",
          params: null,
        };
      },
    },
    // 接口
    interface: {
      type: Object,
      default() {
        return {
          _id: "",
          code: null,
          url: "",
          label: "",
          fields: [],
        };
      },
    },
    //数据源
    dataSource: {
      type: Object,
      default() {
        return {
          _id: "",
          code: null,
          label: "",
          fields: [],
        };
      },
    },
    //动态数据路径
    dataURL: {
      type: String,
      default: "",
    },
    height: {
      type: String,
      default: "100%",
    },
    //接口额外headers
    configAttachRequestHeaders: {
      type: Array,
      default() {
        return [];
      },
    },
    //接口使用
    configAttachRequestParams: {
      type: Array,
      default() {
        return [];
      },
    },
    //综合表额外的headers
    combineTableHeaders: {
      type: Array,
      default() {
        return [];
      },
    },
    //综合表查询参数
    combineTableParams: {
      type: Array,
      default() {
        return [];
      },
    },
    //数据源额外的headers
    dataSourceHeaders: {
      type: Array,
      default() {
        return [];
      },
    },

    //数据源查询参数
    dataSourceParams: {
      type: Array,
      default() {
        return [];
      },
    },
    //懒加载
    isHandlerRefresh: {
      type: Boolean,
      default: false,
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
          //组件初始化事件
          mounted: {
            relatives: [],
            fn: eventTemp,
          },
          //数据加载完成事件
          dataLoad: {
            relatives: [],
            fn: eventTemp,
          },
          //数据处理完成事件
          load: {
            relatives: [],
            fn: eventTemp,
          },
          //数据点击事件
          click: {
            relatives: [],
            fn: eventTemp,
          },
        };
      },
    },
    //数据处理函数
    dealDataFunction: {
      type: String,
      default: dealTemp,
    },
    //数据处理规则数组
    dealDataList: {
      type: Array,
      default() {
        return [];
      },
    },
    //接口请求方式
    interfaceMethod: {
      type: String,
      default: "get",
    },
    // 是否为json格式
    interInterfaceHttpJSONFlag: {
      type: Boolean,
      default: false,
    },
    //接口请求配置
    interfaceHttpConfig: {
      type: Object,
      default() {
        return null;
      },
    },
    //接口映射列表
    interfaceMapFieldList: {
      type: Array,
      default() {
        return [];
      },
    },
    //综合表字段映射列表
    mapFieldList: {
      type: Array,
      default() {
        return [];
      },
    },
    //数据源映射列表
    datasourceMapFieldList: {
      type: Array,
      default() {
        return [];
      },
    },
    //表格源映射列表
    excelMapFieldList: {
      type: Array,
      default() {
        return [];
      },
    },
    //数据拆分设置
    dataDivideSet: {
      type: Array,
      default() {
        return [];
      },
    },
    //分割数据映射列表
    divideDataMapList: {
      type: Array,
      default() {
        return [];
      },
    },
    //数据文本映射
    dataReplaceText: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      //高级查询参数
      extendParams: null,
      //设计器中映射列表
      designerMapFieldList: [],
      //临时数据规则过滤
      temporaryRules: [],
      temporaryRulesPromise: null,
      //当前组件数据
      currentComponentData: {},
      //组件原始数据
      originComponentData: {},

      data: [],
      dataLoad: false,
      hasData: true,
      loadingText: "加载中",
      loadingSpinner: "el-icon-loading",
      loadingBackground: "rgba(0, 0, 0, 0)",
      //服务端数据
      serviceData: [],
      //需要拆分的数据
      divideData: [],
      // 伪代码事件相关作用域
      eventScope: {},
      //interface 特殊处理
      dynamicRules: `['datasource','combineTable','interface','excel'].includes(this.dataType)`,
    };
  },
  computed: {
    //获取拆分数据列表
    getDivideDataMapList() {
      return this.divideDataMapList || [];
    },
    dataMapFieldList() {
      let map = {
        excel: "excelMapFieldList",
        interface: "interfaceMapFieldList",
        datasource: "datasourceMapFieldList",
        combineTable: "mapFieldList",
      };
      let field = map[this.dataType];
      if (field) {
        return this[field];
      }
      return [];
    },
  },
  created() {
    //监听高级查询条件
    dsf.emit.$on(
      "advancedQuery",
      (data) => {
        this.extendParams = data;
        this.init();
      },
      this
    );

    // 兼容以前写法
    if (this.combineTable.params && this.combineTableParams.length == 0) {
      this.$emit("update:combineTableParams", this.transformParams(this.combineTable.params));
    }
    if (this.isDesign) {
      //订阅动态数据来源改变
      dsf.emit.$on(
        "changeDataSource",
        (data) => {
          // console.log('订阅信息发布')
          //dataType 来源类型
          //combineTable 综合数据信息
          //fields映射字段里列表
          //dataSource 数据源信息
          //configAttachRequestParams 请求参数

          switch (data.dataType) {
            case "interface":
              //更新映射列表
              this.$emit("update:interfaceMapFieldList", data.fields);
              //更新请求参数
              data.interfaceParams && this.$emit("update:configAttachRequestParams", data.interfaceParams);
              //更新接口配置
              data.interface && this.$emit("update:interface", data.interface);
              // 认为只要路径改变+参数改变就触发请求
              if ((data.interface && data.interface.url != this.interface.url) || !_.isEqual(this.configAttachRequestParams, data.interfaceParams)) {
                console.log("触发重新请求----interface");
                this.$nextTick(this.init);
              }
              break;
            case "datasource":
              //更新映射列表
              this.$emit("update:datasourceMapFieldList", data.fields);
              //更新请求参数
              data.dataSourceParams && this.$emit("update:dataSourceParams", data.dataSourceParams);
              //更新数据源配置
              data.dataSource && this.$emit("update:dataSource", data.dataSource);
              // 认为只要路径改变+参数改变就触发请求
              if ((data.dataSource && data.dataSource.code != this.dataSource.code) || !_.isEqual(this.dataSourceParams, data.dataSourceParams)) {
                console.log("触发重新请求---datasource");
                this.$nextTick(this.init);
              }
              break;
            case "combineTable":
              //更新映射列表
              this.$emit("update:mapFieldList", data.fields);
              //更新请求参数
              data.combineTableParams && this.$emit("update:combineTableParams", data.combineTableParams);
              //更新综合数据配置
              data.combineTable && this.$emit("update:combineTable", data.combineTable);

              if (data.combineTable) {
                // 认为只要id和名字改变+参数改变就触发请求
                const comparison = this.combineTable.id + "-" + this.combineTable.name;
                const _comparison = data.combineTable.id + "-" + data.combineTable.name;
                if (_comparison != comparison || !_.isEqual(this.combineTableParams, data.combineTableParams)) {
                  console.log("触发重新请求---combineTable");
                  this.$nextTick(this.init);
                }
              }

              break;
            case "excel":
              this.reloadFieldsExec({ clear: false });
              return;
          }
          //重新读取映射列表
          this.reloadFieldsExec({ clear: true });
        },
        this
      );
    }
  },
  beforeDestroy() {
    dsf.emit.$hasEvent("changeDataSource", this) && dsf.emit.$remove("changeDataSource", this);

    dsf.emit.$remove("advancedQuery", this);
  },
  mounted() {
    this.$nextTick(() => {
      this.handleEventScope();
      //触发初始化完成
      this.loadMountedEvents();

      if (!this.isHandlerRefresh || this.isDesign) {
        if (typeof this.beforeInit === "function") {
          this.beforeInit();
        } else {
          this.init();
        }
      }
    });
  },
  watch: {
    staticData() {
      if (this.isDesign && this.dataType === "static") {
        setTimeout(this.init, 0);
      }
    },
    //数据拆分设置
    dataDivideSet: {
      handler(dataDivideSet) {
        //重新读取映射列表
        if (this.isDesign && dataDivideSet.length && dataDivideSet.length > 2) {
          let { fieldsMapList } = this.$handleDivideData(this.divideData, dataDivideSet);
          this.$emit("update:divideDataMapList", fieldsMapList);
          //重新读取映射列表
          this.reloadFieldsExec();
        } else {
          //没有则恢复之前的映射列表
          this.$emit("update:divideDataMapList", []);
          //重新读取映射列表
          this.reloadFieldsExec();
        }
      },
      deep: true,
    },
    //数据文本替换
    dataReplaceText: {
      handler(res) {
        if (this.isDesign) {
          this.middleWareData(this.serviceData);
        }
      },
      deep: true,
    },
    dealDataFunction: {
      handler() {
        if (this.isDesign) {
          this.init();
        }
      },
      deep: true,
    },
    //表格数据改变
    excelData: {
      handler(v, o) {
        if (this.isDesign) {
          this.init();
        }
      },
      deep: true,
    },
    //数据来源类型
    dataType() {
      if (this.isDesign) {
        this.$nextTick(() => {
          this.init();
        });
      }
    },
  },
  methods: {
    //重新读取映射列表
    reloadFieldsExec(props = {}) {
      //重新读取映射列表
      dsf.emit.$emit("reloadFields", props, [this]);
      this.$nextTick(() => {
        this.designerMapFieldList = this.getDesignerMapFieldList();
      });
    },
    //在设计器种获取映射列表
    getDesignerMapFieldList() {
      let mapFieldList = [];
      //数据拆分
      let divideDataMapList = this.getDivideDataMapList;
      switch (this.dataType) {
        case "excel":
          mapFieldList = this.excelMapFieldList;
          break;
        case "interface":
          mapFieldList = divideDataMapList.length ? divideDataMapList : this.interfaceMapFieldList;
          break;
        case "datasource":
          mapFieldList = divideDataMapList.length ? divideDataMapList : this.datasourceMapFieldList;
          break;
        case "combineTable":
          mapFieldList = divideDataMapList.length ? divideDataMapList : this.mapFieldList;
          break;
      }
      return mapFieldList;
    },
    //统一走luckySheet excel 解析方式
    dataExcelAnalysis(data) {
      if (!Array.isArray(data)) {
        return this.$dataAnalysis([]);
      }
      let result = [];
      let fieldList = [];
      //luckysheet 数据
      if (Array.isArray(data[0])) {
        let { res, mapList } = dsf.dataview.utils.transformExcelDataToJSON(data);
        result = res;
        fieldList = mapList;
      }

      if (this.isDesign) {
        this.$emit("update:excelMapFieldList", fieldList);
      }
      return result;
    },

    /**
     * ai 大模型输出数据处理
     */
    dataModelAnalysis() {},
    updateURL(url) {
      if (!this.dataURL) this.$emit("update:dataURL", url);
    },
    //处理数据函数
    dealInterfaceData(data) {
      // 处理数据
      try {
        let page = this.$page.$vm;
        const executeFnScope = {
          page,
        };
        let fn = utilsHandleParseCodeForDataHand(this.dealDataFunction, executeFnScope);
        let dealData = fn.call(this, data, this);
        if (dealData) {
          data = dealData;
        }
      } catch (error) {
        console.error("处理数据异常", error);
      }

      return data;
    },
    //数据加载完成事件
    dataLoadEvent(data) {
      this.loadDataLoadEvents(data);
      return this.middleWareData(data);
    },
    //数据中间件
    middleWareData(data = this.serviceData) {
      //保存数据
      this.serviceData = _.cloneDeep(data);
      this.$dispatch("loadInterfaceData", { data: data, vm: this });
      let result = this._getMiddleWareData(data);
      if (this.$listeners["interInterfaceData"]) {
        this.$dispatch("interInterfaceData", { data: result, vm: this });
      } else {
        this.$dataAnalysis(result);
      }
      return result;
    },
    //获取处理过后的数据
    _getMiddleWareData(data) {
      let result = null;
      switch (this.dataType) {
        // 静态数据
        case "static":
          result = data;
          break;
        //表格数据
        case "excel":
          result = this._excelDataHandle(data);
          break;
        //服务端数据
        default:
          result = this._serviceDataHandle(data);
          break;
      }
      return result;
    },
    //私有服务端数据处理方法
    _serviceDataHandle(data) {
      //数据处理
      data = this.dealInterfaceData(data);
      //数据拆分
      this.divideData = _.cloneDeep(data);
      //数据拆分---如果存在数据拆分 修改数据映射
      if (this.dataDivideSet.length && this.dataDivideSet.length > 2) {
        let { res } = this.$handleDivideData(this.divideData, this.dataDivideSet);
        data = res;
      }
      //数据过滤
      data = this.filterData(data);
      //数据文本替换
      if (this.dataReplaceText.length) {
        let dataReplaceTextMap = new Map(this.dataReplaceText);
        data.forEach((it) => {
          Object.keys(it).forEach((key) => {
            if (dataReplaceTextMap.has(it[key])) {
              it[key] = dataReplaceTextMap.get(it[key]);
            }
          });
        });
      }
      return data;
    },
    //私有表格处理函数
    _excelDataHandle(data) {
      //数据过滤
      data = this.filterData(data);
      return data;
    },
    // _get
    //拆分数据
    $handleDivideData(data, setData) {
      let fields = setData[0];
      let decs = setData[1];
      //字段映射表
      let fieldsMapList = setData[0].map((field, index) => {
        return {
          name: decs[index] || field,
          value: field,
        };
      });

      let res = [];
      for (let i = 2; i < setData.length; i++) {
        let row = setData[i];
        let resData = {};
        for (let j = 0; j < row.length; j++) {
          let str = row[j] || "";
          //字段名
          let key = fields[j];
          let value = this.decodeFormula(str, data);
          resData[key] = value;
        }
        res.push(resData);
      }
      return { res, fieldsMapList };
    },
    // 解析公式树
    decodeFormula(str, data) {
      let formulas = {
        //加法
        SUM: function () {
          return [...arguments].reduce((sum, cur) => (sum += Number(cur)), 0);
        },
        //减法
        SUB: function (a, b) {
          return a - b;
        },
        //乘法
        MUL: function () {
          return [...arguments].reduce((sum, cur) => (sum *= Number(cur)));
        },
        //除法
        DIV: function (a, b) {
          return a / b;
        },
        //平均数
        AVG: function () {
          let sum = [...arguments].reduce((sum, cur) => (sum += Number(cur)), 0);
          return sum / arguments.length;
        },
        //最大值
        MAX: function () {
          return Math.max(...arguments);
        },
        //最小值
        MIN: function () {
          return Math.min(...arguments);
        },
        //截取
        SLICE: function (str, s, e) {
          return str.toString().slice(s, e);
        },
        //保留小数
        DECIMAL: function (a, b) {
          return Number.parseFloat(a).toFixed(b);
        },
      };
      //生成公式语法树
      let formulaTree = generateFormalTree(str);
      let getValue = function (tree) {
        if (dsf.isObject(tree)) {
          let name = tree.name;
          let args = tree.args;
          if (typeof formulas[name] === "function") {
            let _args = [];
            args.forEach((arg) => {
              _args.push(getValue(arg));
            });
            return formulas[name](..._args);
          }
        } else {
          // 解析字符串
          let value = tree + "";
          let arr = value.replace(/@/g, "^^").split("^^");
          if (arr.length == 2) {
            let index = arr[0];
            let key = arr[1];
            let item = data[index];
            if (item) {
              value = item[key] || "";
            }
          }
          return value;
        }
      };
      return getValue(formulaTree);
    },
    $dataAnalysis(data) {
      this.hasData = true;
      if (data) this.data = data;
      setTimeout(() => this.loadCompleteEvents(data), 0);
      this.dataAnalysis(data);
    },

    /**
     * 大屏接口数据缓存
     * @param {String} method 接口请求
     * @param {String} url 接口地址
     * @param {Object} params 接口参数
     * @param {Object} config 接口配置
     * @param {String} hasCode 接口对象哈希值
     */
    cacheHttp(method, url, params, config, hashCode) {
      if (this.isDesign) {
        return this.$http[method](this.$replace(url, this.local), params, config);
      }
      // 挂载数据到二开页面，没有则挂载到globalThis
      const scope = this.$page || globalThis;
      scope.cacheResponse = scope.cacheResponse ? scope.cacheResponse : {};

      if (Object.prototype.hasOwnProperty.call(scope.cacheResponse, hashCode)) {
        return scope.cacheResponse[hashCode];
      } else {
        scope.cacheResponse[hashCode] = null;
      }
      if (this.cancelToken) {
        this.cancelToken.cancel();
      }
      const cancelToken = dsf.http.CancelToken.source();
      this.cancelToken = Object.freeze(cancelToken);
      config.cancelToken = cancelToken.token;
      this.addNowRequestList(cancelToken);
      const result = this.$http[method](this.$replace(url, this.local), params, config);
      return result;
    },
    // 加入请求队列
    addNowRequestList(source) {
      const { requestInterfaceList } = this.$page;
      const { fakeCodeName } = this;
      const existingRequest = requestInterfaceList.find((item) => item.fakeCodeName === fakeCodeName);
      if (existingRequest) {
        existingRequest.source = source;
      } else {
        requestInterfaceList.push({ fakeCodeName, source });
      }
    },
    /**
     * 处理接口响应返回数据
     * @param {Object} cache 相应数据
     * @param {String} eventName hashCode
     */
    cacheResponse(cache, eventName) {
      const { status, response, config } = cache;
      const { combine } = config;
      // 成功
      if (status === 1) {
        let { success, data } = response;
        // 处理分页count
        if (data.count != undefined) {
          if (this.allowPageDataType) {
            this.pageTotal = data.count || 0;
          }
          data = data.data;
        }
        if (success && data) {
          //设计器如果动态进入这里
          if (this.isDesign) {
            // 从二包来的数据不收集
            let collectDataSource = true;
            switch (this.dataType) {
              case "interface":
                {
                  // 从二包来的数据不需要重新构造interface数据结构
                  if (!this.interface.isExotic) {
                    let fields = Object.keys(data?.[0] || {}),
                      interfaces = {};

                    if (fields.length > 0) {
                      fields = fields.map((field) => {
                        return {
                          name: field,
                          value: field,
                        };
                      });

                      let { label } = this.interface;

                      if (!label) {
                        label = this.dataURL.split("/");
                        label = label.length > 0 ? `接口${label[label.length - 1]}数据` : "";
                      }

                      interfaces = {
                        _id: dsf.uuid(),
                        code: null,
                        url: this.dataURL,
                        label: label,
                        fields,
                      };
                    }
                    dsf.emit.$emit(
                      "changeDataSource",
                      {
                        dataType: "interface",
                        fields,
                        interface: interfaces,
                        interfaceParams: this.configAttachRequestParams,
                      },
                      [this]
                    );
                  } else {
                    collectDataSource = false;
                  }
                }

                break;
              case "datasource":
                //重新读取映射列表
                this.reloadFieldsExec();
                break;
              case "combineTable":
                //综合台账、综合/汇总报表
                const active = this.combineTable.active;
                if (active === "combineLedger" || active === "combineReport") {
                  let fields = Object.keys(data.head);
                  fields = fields.map((key) => {
                    return {
                      name: data.head[key],
                      value: key,
                    };
                  });
                  dsf.emit.$emit(
                    "changeDataSource",
                    {
                      dataType: "combineTable",
                      fields,
                      combineTableParams: this.combineTableParams,
                    },
                    [this]
                  );
                  // 资源目录（4合一） table：数据表，govern_model：er模型，dataadhoc：即席查询，dataolap：olap分析
                } else if (active === "resourceClass") {
                  let fields = [];
                  if (!dsf.isEmptyObject(data)) {
                    fields = data.titles.map(({ title, key }) => {
                      return {
                        name: title,
                        value: key,
                      };
                    });
                    dsf.emit.$emit(
                      "changeDataSource",
                      {
                        dataType: "combineTable",
                        fields,
                        combineTableParams: this.combineTableParams,
                      },
                      [this]
                    );
                    // 没有数据
                  } else {
                    dsf.emit.$emit(
                      "changeDataSource",
                      {
                        dataType: "combineTable",
                        fields: [],
                        combineTableParams: this.combineTableParams,
                      },
                      [this]
                    );
                  }
                }
                break;
            }

            this.$nextTick(() => {
              // console.time('收集数据来源')
              if (collectDataSource) {
                const designer = this.$designer;
                // 防止不止大屏设计内部
                !designer.designerDataSources && (designer.designerDataSources = []);
                !designer.designerDataMappingComps && (designer.designerDataMappingComps = []);
                getDataSource.call(this.$designer, this);
              }
              // console.timeEnd('收集数据来源')
            });
          }
          const active = this.combineTable.active;

          let res = combine ? (active === "combineLedger" || active === "combineReport" ? data.data : data.details) : data;
          // (active === "combineLedger" || active === "combineReport")? data.data combine ? (data[0] && data[0].fields && data[0].results ? data[0].results : data.data) : data;
          this.dataLoadEvent(res);
        }
        // 失败
      } else if (status === 0) {
        if (response.__CANCEL__) {
          console.warn(`${this.fakeCodeName}_${response.message}`);
        } else {
          this.$message((response && response.message) || "请求异常", false);
        }
      }
      if (!this.isDesign) {
        dsf.emit.$remove(eventName, this._uid);
      }
      this.dataLoad = false;
    },
    //数据源、接口
    getInterfaceAPI(url, method = "get", params, config = null, combine = false) {
      const needLogin = this.$page?.needLogin;
      //不需要添加大屏请求标识
      if (needLogin === false) {
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

      const cacheHttpConfig = {
        method,
        params,
        url,
        config,
      };
      // 生成接口对象hash值
      const hashCode = getHashCode(cacheHttpConfig);
      const eventName = hashCode;
      this.dataLoad = true;
      const result = this.cacheHttp(method, url, params, config, hashCode);
      if (!result) {
        dsf.emit.$remove(eventName, this._uid);
        // 监听订阅事件
        dsf.emit.$on(
          eventName,
          (data) => {
            // 判断是不是发送的事件的组件
            if (data.config.uid != this._uid) {
              this.cacheResponse(data, eventName);
            }
          },
          this._uid
        );
        return false;
      }

      // 返回是promise
      if (result.then) {
        result
          .done((response) => {
            // 发送数据事件
            const data = {
              response,
              config: {
                combine,
                uid: this._uid,
              },
            };
            if (response.success) {
              data.status = 1;
            } else {
              data.status = 0;
            }

            if (!this.isDesign) {
              dsf.emit.$emit(eventName, data);

              const scope = this.$page || globalThis;
              scope.cacheResponse = scope.cacheResponse ? scope.cacheResponse : {};
              scope.cacheResponse[hashCode] = data;
            }

            this.cacheResponse(data, eventName);
          })
          .catch((err) => {
            const data = {
              status: 0,
              response: err,
              config: {
                combine,
              },
            };

            // 设计器中不发送
            if (!this.isDesign) {
              dsf.emit.$emit(eventName, data);
              const scope = this.$page || globalThis;
              scope.cacheResponse = scope.cacheResponse ? scope.cacheResponse : {};
              scope.cacheResponse[hashCode] = data;
            }

            this.cacheResponse(data, eventName);
          })
          .finally(() => {
            let page = this.$page;
            let index = page.requestInterfaceList.findIndex((item) => item.fakeCodeName === this.fakeCodeName);
            if (index > -1) {
              page.requestInterfaceList.splice(index, 1);
            }
          });
        // 从缓存中读取
      } else {
        this.cacheResponse(result, eventName);
      }
    },
    //初始化事件
    loadMountedEvents() {
      if (this.isDesign) return false;
      try {
        let { mounted } = this.eventRelativeDeal;
        if (mounted && mounted.fn) {
          const fn = mounted.fn;
          this.handleCommonEmit(fn, null);
        }
      } catch (e) {
        console.error(e);
      }
    },
    //数据处理完成事件
    loadCompleteEvents(data) {
      try {
        let { fn } = this.eventRelativeDeal.load;
        //给组件设置当前数据
        this.currentComponentData = data;
        this.handleCommonEmit(fn, data);
      } catch (e) {
        console.error(e);
      }
    },
    //数据加载完成事件
    loadDataLoadEvents(data) {
      //给组件设置原始数据
      this.originComponentData = data;
      try {
        let { dataLoad } = this.eventRelativeDeal;
        if (dataLoad && dataLoad.fn) {
          const fn = dataLoad.fn;
          this.handleCommonEmit(fn, data);
        }
      } catch (e) {
        console.error(e);
      }
    },
    //点击依赖组件关联方法
    loadClickEvents(data, e) {
      try {
        let { fn } = this.eventRelativeDeal.click;
        //给组件设置当前数据
        this.currentComponentData = data;
        this.handleCommonEmit(fn, data, e);
      } catch (e) {
        console.error(e);
      }
    },
    init() {
      let extendParams = this.extendParams;

      // 如果是ai 模型吐出的数据
      if (this.modelArgs && !dsf.isEmptyObject(this.modelArgs)) {
        const modelArgs = dsf.mix(true, {}, this.modelArgs);
        this.dataModelAnalysis(modelArgs);

        let styleTheme = "";
        if (this.$page && this.$page.isModel && this.$page.theme) {
          styleTheme = this.$page.theme;
        } else {
          styleTheme = modelArgs.styleTheme;
        }

        // 风格跟随设计器风格/或者页面风格
        if (styleTheme) {
          import(/* webpackChunkName: "dataview_theme",webpackMode: "lazy" */ "_dataview/output/dataviewStyle/index.js").then((res) => {
            let styles = res.default.concat(dsf.dataview.extendStyle);
            let theme = styles.find((it) => it.value === styleTheme);
            if (theme) {
              this.handlerCurrentStyleConfig && this.handlerCurrentStyleConfig(theme);
            }
          });
        }
        // 给推荐看板数据发送数据
        if (modelArgs.recommend) {
          const { recommend, ...properties } = modelArgs;
          setTimeout(() => {
            dsf.emit.$emit("aiModelData", {
              el: this.$el,
              modelArgs: properties,
            });
          }, 1300);
        }

        this.$emit("update:modelArgs", null);
      }

      // 接口形式
      if (this.dataType === "interface") {
        let params = this.getConfigAttachRequestParams();
        let requestParams = {};
        //高级查询
        if (extendParams) {
          const { pageNum = 1, pageSize = 200, ...properties } = params;
          requestParams.dataviewQuery = JSON.stringify(extendParams);
          requestParams.pageNum = pageNum;
          requestParams.pageSize = pageSize;
          requestParams = {
            ...requestParams,
            ...properties,
          };
        } else {
          requestParams = params;
        }
        this.dealInterfaceParams(requestParams);
        //数据源
      } else if (this.dataType === "datasource") {
        this.$nextTick(() => {
          this.dealDataSourceParams();
        });
        //综合表数据
      } else if (this.dataType === "combineTable") {
        let params = this.getConfigAttachRequestParams(this.combineTableParams);
        this.dealCombineTableParams(params);
      } else if (this.dataType === "excel") {
        let result = this.dataExcelAnalysis(this.excelData);
        //数据来源改变
        dsf.emit.$emit(
          "changeDataSource",
          {
            dataType: "excel",
          },
          [this]
        );
        //excel 也进入数据处理方法
        this.dataLoadEvent(result);
      } else {
        if (this.dataType === "static") {
          //数据来源改变
          dsf.emit.$emit(
            "changeDataSource",
            {
              dataType: "static",
            },
            [this]
          );
        }
        this.dataLoadEvent(this.staticData);
      }
    },
    commonHandleDataSourceParams() {
      let extendParams = this.extendParams;
      let params = this.getConfigAttachRequestParams(this.dataSourceParams);
      const { pageNum = 1, pageSize = 1000, ...properties } = params;

      let namespace = this.isDesign ? this.$designer.nameSpace : this.$vm.nameSpace;
      let pageName = this.isDesign ? this.$designer.pageName : this.$vm.pageName;

      const requestParams = {
        namespace,
        pageName,
        order: JSON.stringify([]),
        filter: JSON.stringify([]),
        pageNum,
        pageSize,
        dataRmId: this.dataSource.code,
        dataviewQuery: JSON.stringify([]),
        ...properties,
      };
      //高级查询
      if (extendParams) {
        requestParams.dataviewQuery = JSON.stringify(extendParams);
      }
      return requestParams;
    },
    // 统一处理extra的header
    dealExtraHeaders(flag = true) {
      let headerMap = {
        datasource: this.dataSourceHeaders,
        interface: this.configAttachRequestHeaders,
        combineTable: this.combineTableHeaders,
      };
      let arr = headerMap[this.dataType] || [];
      let params = this.getConfigAttachRequestParams(arr) || {};
      let extraHeaderConfig = {
        headers: params,
      };
      if (!flag) {
        extraHeaderConfig = params;
      }
      return extraHeaderConfig;
    },
    // 处理接口参数
    dealInterfaceParams(params) {
      //对数据进行拦截
      if (!this.dataURL) {
        return false;
      }
      let url = this.dataURL;
      let config = this.interfaceHttpConfig;
      let extraHeaderConfig = this.dealExtraHeaders();
      config = dsf.mix(true, {}, config, extraHeaderConfig);
      if (this.interInterfaceHttpJSONFlag) {
        config = dsf.mix(true, {}, config, {
          headers: {
            "Content-Type": "application/json;",
          },
        });
      }
      if (config && config["headers"] && config["headers"]["Content-Type"] && config["headers"]["Content-Type"].indexOf("application/json;") > -1) {
        params = JSON.stringify(params);
      }
      // 如果不加服务标识，使用:/ 开头路径
      url = this.$getWebPath(url, true);

      this.getInterfaceAPI(url, this.interfaceMethod, params, config);
    },
    //处理数据源参数
    dealDataSourceParams(params = {}) {
      let requestParams = this.commonHandleDataSourceParams();
      params = dsf.mix(true, {}, requestParams, params);
      const url = this.dataSource.code ? dsf.url.getWebPath("resource/list/data", $$webRoot.dataview) : "";
      if (url) {
        let extraHeaderConfig = this.dealExtraHeaders();
        this.getInterfaceAPI(url, "get", params, extraHeaderConfig);
      } else {
        this.$dataAnalysis(this.staticData);
      }
    },
    //处理综合数据参数
    dealCombineTableParams(params) {
      let url = this.combineTable.url;
      let keys = Object.keys(params);

      keys.forEach((key) => {
        if (/^\[|{/.test(params[key])) {
          params[key] = JSON.parse(params[key]);
        }
      });
      //综合/汇总报表
      if (this.combineTable.active === "combineReport") {
        if (!keys.length) return;
        let { header, ..._params } = params;
        _params.formatter = "json";

        let headers = {};

        if (header) {
          if (dsf.isObject(header)) {
            headers = { ...header };
          } else {
            headers["kivTable"] = header;
          }
        }
        let extraHeaderConfig = this.dealExtraHeaders(false);
        headers = dsf.mix(true, {}, headers, extraHeaderConfig);
        this.getInterfaceAPI(url, "get", _params, headers ? { headers } : null, true);
        //综合台账
      } else if (this.combineTable.active === "combineLedger") {
        if (!keys.length) return;
        let headers = {
          "Content-Type": "application/json;",
        };
        let { header, ..._params } = params;

        if (header) {
          if (dsf.isObject(header)) {
            headers = dsf.mix(true, {}, headers, header);
          } else {
            headers["kivTable"] = header;
          }
        }
        let extraHeaderConfig = this.dealExtraHeaders(false);
        headers = dsf.mix(true, {}, headers, extraHeaderConfig);
        this.getInterfaceAPI(
          url,
          "post",
          _params,
          {
            headers,
          },
          true
        );
        // 资源目录（4合一） table：数据表，govern_model：er模型，dataadhoc：即席查询，dataolap：olap分析
      } else if (this.combineTable.active === "resourceClass") {
        if (!keys.length) return;

        let { header, ..._params } = params;

        this.getInterfaceAPI(url, "get", _params, null, true);
      }
    },

    //解析参数
    getConfigAttachRequestParams(requestParams = this.configAttachRequestParams) {
      let params = {};
      requestParams?.forEach((item) => {
        //在设计器中直接读设计器字段
        if (this.isDesign) {
          if (item.queryKey) {
            params[item.queryKey] = item.designValue;
          }
        } else {
          if (item.queryKey) {
            const callback = getParams[item.origin];
            params[item.queryKey] = callback ? callback.call(this, item.valueKey) : "";
          }
        }
      });
      // 处理分页参数
      if (this.allowPageDataType) {
        let pageParams = this.handlePageParams();
        Object.keys(pageParams).forEach((key) => {
          params[key] = pageParams[key];
        });
      }
      return params;
    },
    /**
     * @description: 处理映射相关的值的小数处理
     * @param {string|number} data 传入的数字
     * @param {Object} mapObj 表头对象、映射对象等
     * @param {Object} fieldKeyObj digit保留几位小数的key,keepZero是否保留0
     * @return {string|number}
     */
    handleMapRelationNum(
      data,
      mapObj,
      fieldKeyObj = {
        digit: "digit",
        keepZero: "keepZero",
      }
    ) {
      let val = data;
      let digit = mapObj[fieldKeyObj.digit];
      let keepZero = mapObj[fieldKeyObj.keepZero];
      if (typeof digit === "number") {
        val = dsf.dataview.utils.handleDecimal(val, digit, keepZero);
      }
      return val;
    },
    //数据过滤
    filterData(data) {
      if (!this.dealDataList || this.dealDataList.length <= 0) {
        return data;
      }
      let switchData = _.cloneDeep(data);
      this.dealDataList.forEach((item) => {
        let fn = filterConditionStrategy[item.rule];
        if (typeof fn === "function") {
          switchData = fn.call(this, switchData, item);
        }
      });
      return switchData;
    },

    transformParams(params) {
      let res = [];
      Object.keys(params).forEach((key) => {
        let value = params[key];
        let valueKey = Array.isArray(value) || (typeof value == "object" && value != null) ? JSON.stringify(value) : value;
        res.push({
          origin: "text",
          queryKey: key,
          valueKey,
          designValue: valueKey,
        });
      });
      return res;
    },
    //为空或为空格字符验证(保留0)
    isEmpty(value = "") {
      if (!value && value != 0) return true;
      return (value + "").trim() === "" ? true : false;
    },
    // 解析替换规则中的中文成相应的字段
    analysisRuleToDataField(ruleStr) {
      return dsf.dataview.utils.analysisRuleToDataField(ruleStr, this.dataMapFieldList);
    },
    analysisKeyToDataField(ruleStr) {
      return dsf.dataview.utils.analysisKeyToDataField(ruleStr, this.dataMapFieldList);
    },
  },
};
