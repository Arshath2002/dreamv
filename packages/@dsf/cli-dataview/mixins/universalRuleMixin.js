/*
 * @Description: 通用规则解析一套
 * @Author: shenah
 * @Date: 2024-04-16 10:22:49
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-06-04 14:49:30
 */
import { createDefaultRuleTypeConfig } from "_dataview/output/config/universalRuleConfig";

const getExpress = function (condition) {
  let code = "";
  switch (condition) {
    case "%":
      code = `key % value == 0`;
      break;
    case "!%":
      code = `key % value != 0`;
      break;
    default:
      code = `key ${condition} value`;
      break;
  }
  return new Function("key", "value", `return ${code}`);
};
const handleUniversalRule = function (row, ruleList) {
  const ruleObj = {};
  if (Array.isArray(ruleList)) {
    ruleList.forEach((item, index) => {
      let type = item.type;
      let ruleConfig = item.ruleConfig;
      let field = ruleConfig.field;
      let condition = ruleConfig.condition;
      let diffValue = ruleConfig.diffValue;
      let ruleStr = "";
      let flag = false;
      if (field && condition) {
        ruleStr = this.analysisKeyToDataField(field);
        let nowJudgeFn = () => false;
        nowJudgeFn = getExpress(condition);
        try {
          // 判断数量
          if (dsf.isNumber(diffValue) && dsf.isNumber(row[ruleStr])) {
            // 这里字符串有问题
            flag = nowJudgeFn(row[ruleStr] * 1, diffValue * 1);
          } else {
            flag = nowJudgeFn(row[ruleStr], diffValue);
          }
        } catch (error) {
          console.log("error", error);
        }
      } else {
        ruleStr = ruleConfig.oldRule;
        try {
          ruleStr = this.analysisRuleToDataField(ruleStr);
          flag = this.$eval(ruleStr, row);
        } catch (error) {
          console.warn("old rule error,please reset rule", error);
        }
      }
      if (flag) {
        ruleObj[type] = _.cloneDeep(item.attr);
        if (type === "text") {
          ruleObj[type].fontSize = dsf.dataview.utils.transformPx(
            ruleObj[type].fontSize
          );
        }
        if (type === "image") {
          let imgObj = ruleObj[type].image;
          let animationStyle = dsf.dataview.utils.analyzeAnimation(imgObj[imgObj.active]);
          ruleObj[type].url = dsf.dataview.utils.compatiblePathToExtendShowImg(imgObj);
          ruleObj[type].width = dsf.dataview.utils.transformPx(ruleObj[type].width);
          ruleObj[type].height = dsf.dataview.utils.transformPx(ruleObj[type].height);
          ruleObj[type] = {
            ...ruleObj[type],
            ...animationStyle,
          };
        }
        if (type === "icon") {
          ruleObj[type].fontSize = dsf.dataview.utils.transformPx(
            ruleObj[type].fontSize
          );
        }
        ruleObj[type].sortIndex = index;
      }
    });
  }
  return ruleObj;
};
export { handleUniversalRule };
export default {
  methods: {
    // 解析公用规则
    handleUniversalRule(row, ruleList) {
      return handleUniversalRule.call(this, row, ruleList);
    },
    // 兼容原来前后缀规则
    handleUniversalOldRuleToNew(ruleList) {
      let newRuleList = [];
      ruleList.forEach((ruleObj) => {
        let rule = ruleObj.rule;
        if (this._handleUniversalIsColor(ruleObj)) {
          let color = createDefaultRuleTypeConfig("color");
          text.ruleConfig.oldRule = rule;
          text.attr.color = ruleObj.color;
          newRuleList.push(color);
        }
        if (this._handleUniversalIsText(ruleObj)) {
          let text = createDefaultRuleTypeConfig("text");
          text.ruleConfig.oldRule = rule;
          text.attr.content = ruleObj.content;
          text.attr.color = ruleObj.color;
          text.attr.fontSize = ruleObj.fontSize;
          text.attr.fontWeight = ruleObj.fontWeight;
          newRuleList.push(text);
        }
        if (this._handleUniversalIsIcon(ruleObj)) {
          let icon = createDefaultRuleTypeConfig("icon");
          icon.ruleConfig.oldRule = rule;
          icon.attr.color = ruleObj.color;
          icon.attr.icon = ruleObj.icon;
          icon.attr.position = ruleObj.showPosition;
          icon.attr.fontSize = ruleObj.fontSize;
          newRuleList.push(icon);
        }
        if (this._handleUniversalIsImage(ruleObj, "img")) {
          let image = createDefaultRuleTypeConfig("image");
          image.ruleConfig.oldRule = rule;
          image.attr.position = ruleObj.showPosition;
          image.attr.width = ruleObj.imgWidth;
          image.attr.height = ruleObj.imgHeight;
          image.attr.image = ruleObj.img;
          newRuleList.push(image);
        }
        if (this._handleUniversalIsImage(ruleObj, "imgObj")) {
          let image = createDefaultRuleTypeConfig("image");
          image.ruleConfig.oldRule = rule;
          image.attr.width = ruleObj.imgObj.width;
          image.attr.height = ruleObj.imgObj.height;
          image.attr.image = ruleObj.imgObj.src;
          newRuleList.push(image);
        }
      });
      return newRuleList;
    },
    _handleUniversalIsColor(ruleObj) {
      let flag = ruleObj.color && typeof ruleObj.fontSize === undefined;
      let imgFlag1 = this._handleUniversalIsImage(ruleObj, "img");
      let imgFlag2 = this._handleUniversalIsImage(ruleObj, "imgObj");
      let iconFlag = this._handleUniversalIsIcon(ruleObj);
      return flag && !imgFlag1 && !imgFlag2 && !iconFlag;
    },
    _handleUniversalIsText(ruleObj) {
      let flag = ruleObj.color && typeof ruleObj.fontSize !== undefined;
      let imgFlag1 = this._handleUniversalIsImage(ruleObj, "img");
      let imgFlag2 = this._handleUniversalIsImage(ruleObj, "imgObj");
      let iconFlag = this._handleUniversalIsIcon(ruleObj);
      return flag && !imgFlag1 && !imgFlag2 && !iconFlag;
    },
    _handleUniversalIsImage(ruleObj, field) {
      if (field === "img") {
        return ruleObj.img && ruleObj.img.custom?.image;
      } else if (field === "imgObj") {
        return ruleObj.imgObj && ruleObj.imgObj.src.custom?.image;
      }
      return false;
    },
    _handleUniversalIsIcon(ruleObj) {
      return ruleObj.icon;
    },
    /**
     * @name: 规则里面的类型强制转化
     * @param {*} ruleList 规则列表
     * @param {*} arr 需要转化的类型数组[["text","color"]] 是将text => color
     * @return {*}
     */
    handleUniversalRuleTypeChange(ruleList, arr) {
      ruleList.forEach((item) => {
        let type = item.type;
        arr.forEach((oneArr) => {
          const [one, two] = oneArr;
          if (type === one) {
            item.type = two;
            let newItem = createDefaultRuleTypeConfig(two);
            let newItemAttr = newItem.attr;
            Object.keys(newItemAttr).forEach((key) => {
              if (item.attr[key] !== undefined) {
                newItemAttr[key] = item.attr[key];
              }
            });
          }
        });
      });
    },
    /**
     * @name: 处理成当前组件需要的形式
     * @param {*} obj 前后缀相关的配置项
     * @param {*} config 新的配置项
     * @return {*}
     */
    handleUniversalRuleToAttr(obj, config) {
      let oldType = {
        content: "text",
        icon: "icon",
        img: "image",
      };
      let ruleConfig = obj.ruleConfig;
      let ruleList = this.handleUniversalOldRuleToNew(ruleConfig.ruleList);
      let defaultStyle = {
        fontSize: ruleConfig.defaultForm.fontSize,
        color: ruleConfig.defaultForm.color,
        fontWeight: ruleConfig.defaultForm.fontWeight,
      };
      config.ruleList = ruleList;
      config.defaultConfig.flag = obj.flag;
      config.defaultConfig.type = oldType[obj.type];
      config.defaultConfig.icon.color = defaultStyle.color;
      config.defaultConfig.icon.fontSize = defaultStyle.fontSize;
      config.defaultConfig.icon.icon = obj.icon;
      config.defaultConfig.text = {
        ...config.defaultConfig.text,
        ...defaultStyle,
      };
      if (obj.image) {
        config.defaultConfig.image = {
          ...config.defaultConfig.image,
          width: obj.image.width,
          height: obj.image.height,
          image: obj.image.src,
        };
      }
      config.defaultConfig.text.content = obj.content || "";
    },
  },
};
