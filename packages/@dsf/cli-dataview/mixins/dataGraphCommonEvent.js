/*
 * @Description:
 * @Author: zhanghang
 * @Date: 2023-04-07 10:47:57
 * @LastEditors: shenah
 * @LastEditTime: 2025-04-25 17:39:38
 */
const ruleMap = new Map([
  ["==", "equalTo"],
  ["!=", "notEqualTo"],
  [">", "greaterThan"],
  ["<", "lessThan"],
  ["<=", "lessThanOrEqual"],
  [">=", "greaterThanOrEqual"],
  ["asc", "asc"],
  ["desc", "desc"],
  ["~=", "involve"],
]);
export default {
  computed: {
    isEventCursorPointer() {
      return dsf.dataview.utils.isCursorPointer([
        this.eventRelativeDeal.click,
        this.eventRelativeDeal.dbclick,
      ]);
    },
  },
  methods: {
    handleUpdateMap() {},
    //新过滤规则
    addFilterRules(key, rule, value, replace = true, isTemp = true) {
      rule = ruleMap.get(rule);
      if (!rule) return false;
      //连续多次添加在下一次事件队列中执行
      this.temporaryRules.push({
        key,
        rule,
        value,
        replace,
        isTemp,
      });

      if (!this.temporaryRulesPromise) {
        this.temporaryRulesPromise = Promise.resolve().then(() =>
          this._execTemporaryRules()
        );
      }
      return this.temporaryRulesPromise;
    },
    //执行临时过滤规则
    _execTemporaryRules() {
      let temporaryRules = this.temporaryRules;
      let dealDataList = this.dealDataList || [];
      let tempDealList = dsf.mix(true, [], dealDataList);

      let permanentRules = [];
      //临时规则
      temporaryRules.forEach((temp) => {
        let { key, rule, value, replace, isTemp } = temp;
        //替换规则--先移除
        if (replace) {
          let index = tempDealList.findIndex((it) => it.valueName == key);
          if (~index) {
            tempDealList.splice(index, 1);
          }
        }
        tempDealList.push({
          rule,
          valueName: key,
          threshold: value,
        });
        //永久过滤规则不删除
        if (!isTemp) {
          permanentRules.push({
            rule,
            valueName: key,
            threshold: value,
          });
        }
      });

      this.$emit("update:dealDataList", tempDealList);
      // this.dealDataList = tempDealList
      //执行数据过滤
      this.$nextTick(() => {
        this.middleWareData(this.serviceData);
        //复原过滤规则
        // this.dealDataList = dealDataList

        //该规则里面包含永久性的规则
        if (permanentRules.length) {
          dealDataList = dealDataList.concat(permanentRules);
        }
        // console.log("dealDataList",dealDataList)
        this.$emit("update:dealDataList", dealDataList);
        //清空组件的临时规则
        this.temporaryRules = [];

        this.temporaryRulesPromise = null;
      });
    },
    //更新数据源
    handleUpdateDataUrl(url, map) {
      // 更新映射字段
      this.handleUpdateMap(map);
      let params = this.getConfigAttachRequestParams(this.dataSourceParams);
      url = "/dbsource/interface/" + url;
      this.getInterfaceAPI(url, "get", params);
      return this;
    },
    //更新接口参数
    handleUpdateInterfaceParams(key, value, refresh = true) {
      let $params = this.getConfigAttachRequestParams(this.interfaceParams);
      if (key && typeof key === "object") {
        // 证明直接传入的对象
        dsf.mix(true, $params, key);
        refresh = typeof value === "boolean" ? value : true;
      } else {
        dsf.mix(true, $params, {
          [key]: value,
        });
      }
      dsf.mix(true, $params, {
        [key]: value,
      });
      //只刷新当前数据
      if (refresh) {
        this.dealInterfaceParams($params);
      } else {
        this.interfaceParams = $params;
      }
      return this;
    },
    //更新综合数据参数
    handleUpdateParams(key, value, refresh = true) {
      let $params = this.getConfigAttachRequestParams(this.combineTableParams);
      if (key && typeof key === "object") {
        // 证明直接传入的对象
        dsf.mix(true, $params, key);
        refresh = typeof value === "boolean" ? value : true;
      } else {
        dsf.mix(true, $params, {
          [key]: value,
        });
      }

      //只刷新当前数据
      if (refresh) {
        this.dealCombineTableParams($params);
      } else {
        this.combineTableParams = $params;
      }
      return this;
    },
    //更新数据源参数
    handleUpdateDataSourceParams(key, value, refresh = true) {
      let $params = this.getConfigAttachRequestParams(this.dataSourceParams);
      if (key && typeof key === "object") {
        // 证明直接传入的对象
        dsf.mix(true, $params, key);
        refresh = typeof value === "boolean" ? value : true;
      } else {
        dsf.mix(true, $params, {
          [key]: value,
        });
      }
      //只刷新当前数据
      if (refresh) {
        this.dealDataSourceParams($params);
      } else {
        this.dataSourceParams = $params;
      }
      return this;
    },
    //获取查询参数
    handleParams() {
      let realParams = this.realParams;
      let params = this.getConfigAttachRequestParams();
      return dsf.mix(true, params, realParams);
    },
    //获取数据源地址
    handleGetDataSource() {
      return this.dataURL;
    },
  },
};
