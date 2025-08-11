/*
 * @Editor: chenqy
 * @Description: 处理组件伪代码事件相关操作
 * @Date: 2023-03-31 09:40:59
 * @LastEditors: zhanghang
 * @LastEditTime: 2024-09-11 17:32:19
 */

import { DATA_HANDLE, EVENT_TEMPLATE } from "./eventTemplate";
/**
 * @description: 处理事件作用域问题
 * @param {VueComponent} context 当前组件上下文
 * @param {eventTemplate} executeFnScope 当前组件伪代码关联组件事件
 * @param {boolean} isPage 当前上下文是否是页面
 * @return {*}
 */
const utilsHandleScope = (context, executeFnScope, isPage) => {
  if (executeFnScope) {
    let eventScope = eval(`(${executeFnScope})`);
    const keys = Object.keys(eventScope);
    for (let i = 0; i < keys.length; i++) {
      let componentName = keys[i];

      //公共页面事件
      let pageEvent = EVENT_TEMPLATE.page[componentName];
      if (pageEvent) {
        _handleBindFnScope(eventScope, keys[i], context, componentName);
        //组件列表事件
      } else {
        //寻找中文名对应的ref组件
        let executeFnComp = context.executeFnComp;
        if (executeFnComp[componentName]) {
          const ref = executeFnComp[componentName];
          let page = isPage ? context : context.$page;
          //这里需要判断是否是gis运行一张图
          if (ref === "GISPageMap") {
            const scope = page.$parent?.pageProps?.gisVm;
            _handleBindFnScope(eventScope, keys[i], scope, componentName);
          } else {
            const scope = page.$parent.$refs[ref];
            _handleBindFnScope(eventScope, keys[i], scope, componentName);
          }
        }
      }
    }
    return eventScope;
  } else {
    return {};
  }
};
/**
 * @description: 解析伪代码
 * @param {string} code
 * @return {function} 可执行函数
 */
const utilsHandleParseCode = (code) => {
  code = code.trim();

  let callback = function () {};
  // 兼容以前版本
  if (/^function/.test(code)) {
    let regExp = new RegExp(/([^{}]+\{)([\s\S]*)(\}\s*\n*\s*$)/);
    //获取方法体
    let body = regExp.exec(code)[2];
    let bodyTemp = `function(executeFnScope){
      with(executeFnScope){
        ${body}
      }
    }`;
    callback = new Function(`return ${bodyTemp}`)();
  } else {
    let bodyTemp = `function(executeFnScope){
      with(executeFnScope){
        ${code}
      }
    }`;
    callback = new Function(`return ${bodyTemp}`)();
  }
  return callback;
};

/**
 * @description: // 构造编辑器提示项数据
 * @param {Object} parent
 * @param {Function} insertCb 插入具体值
 * @param {Monaco/CompletionItemKind} endingType 最后一项数据类型
 * @return {Monaco/Suggsetions}
 */
const utilsHandleGetEditorTemplate = (parent, insertCb, endingType) => {
  const keys = Object.keys(parent);
  let res = [];
  for (let i = 0; i < keys.length; i++) {
    let key = keys[i];
    let module = parent[key];
    let config = {
      name: key,
      value: insertCb(key, module),
      type: dsf.isObject(parent[key]) ? "Module" : endingType ? endingType : "Function",
      detail: key,
    };
    if (config.type == "Module") {
      config.children = utilsHandleGetEditorTemplate(parent[keys[i]], insertCb, endingType);
    }

    res.push(config);
  }
  return res;
};

// 数据处理函数分析
const utilsHandleParseCodeForDataHand = (code, executeFnScope) => {
  const { data } = DATA_HANDLE;
  const dataRegs = Object.keys(data);
  _.forEach(dataRegs, (item) => {
    const reg = new RegExp(`(\\.)${item}(\\()`);
    code = code.replace(reg, `$1${data[item]}$2`);
  });

  let regExp = new RegExp(/([^{}]+\{)([\s\S]*)(\}\s*\n*\s*$)/);
  let body = regExp.exec(code)[2];
  let prefix = regExp.exec(code)[1];
  let suffix = regExp.exec(code)[3];

  let bodyTemp = `${prefix}
    with(executeFnScope){
      ${body}
    }
  ${suffix}`;

  return new Function("executeFnScope", `return ${bodyTemp}`)(executeFnScope);
};
export { utilsHandleScope, utilsHandleParseCode, utilsHandleGetEditorTemplate, utilsHandleParseCodeForDataHand };

function _handleBindFnScope(item, key, scope, componentName) {
  let parent = item[key];
  const isFn = dsf.isFunction(parent);
  if (isFn) {
    // 代码执行友好提示
    const friendlyFn = (...params) => {
      try {
        if (scope) {
          if (key == "悬浮弹框") {
            // 注入事件dom对象
            params = [item.eventTarget, ...params];
          }
          return parent.apply(scope, params);
        } else {
          console.error(`发现代码中存在已经删除组件【${componentName}】的逻辑, 请修改组件【${componentName}】中伪代码逻辑。`);
        }
      } catch (e) {
        console.error(`组件【${componentName}】执行出错\n${e}`);
      }
    };
    item[key] = friendlyFn;
  } else if (dsf.isObject(parent)) {
    const keys = Object.keys(parent);
    for (let i = 0; i < keys.length; i++) {
      _handleBindFnScope(parent, keys[i], scope, componentName);
    }
  }
}
