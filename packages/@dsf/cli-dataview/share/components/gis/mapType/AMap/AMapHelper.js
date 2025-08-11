/*
 * @Description: 高德地图工具函数
 * @Author: zhanghang
 * @Date: 2023-08-25 14:36:25
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-04-27 16:13:23
 */
import utils from "_dataview/output/utils/gis.js";

import _line from "../../options/line.js";
import _label from "../../options/label.js";
/**
 * @description 初始化地图数据来源
 * @param {object|string} source 地图来源路径活对象
 * @param {string} seriesName 图层系列名
 * @return {object} source
 */
const AMapInitSource = function (source, extraData, seriesName, layerProperties = {}) {
  source.features.forEach((feature) => {
    let adcode = feature.properties.adcode;
    feature.properties.seriesName = seriesName;
    feature.properties.layerAttr = layerProperties;
    //区域编码匹配
    let extra = extraData.find((it) => it.adcode == adcode);
    if (extra) {
      feature.properties = dsf.mix(true, {}, feature.properties, extra);
    }
  });
  return source;
};
/**
 * @description 地图图层事件处理函数
 * @param {object|string} options =>(map:地图,events:事件对象,layer:发生事件图层,TooltipMaker:图层的提示框)
 * @return {无}
 */
const AMapEventHandler = function (options) {
  let { map, events, layer, TooltipMaker, layerAttr = {} } = options;
  let click, hover, complete;
  if (events) {
    click = events.click;
    hover = events.hover;
    complete = events.complete;
  }

  let completeFn = function (e) {
    if (typeof complete === "function") {
      complete(e, null);
    }
  };
  let hoverFn = function (e) {
    const feat = layer.queryFeature(e.pixel.toArray());
    if (typeof hover === "function") {
      hover(feat, e);
    }
    if (!feat) {
      TooltipMaker?._hide();
      return false;
    }

    if (layer.CLASS_NAME === "HeatMap") {
      if (feat.height || feat.scale) {
        //悬浮提示框
        if (TooltipMaker) {
          let position = feat.lnglat;
          if (position.length) {
            TooltipMaker._show(position, {
              properties: feat,
            });
          }
        }
      } else {
        TooltipMaker?._hide();
      }
    } else {
      //悬浮提示框
      if (TooltipMaker) {
        let position = [];
        switch (feat.type) {
          case "Point":
            position = [feat.coordinates[0], feat.coordinates[1]];
            break;
          case "MultiPolygon":
            position = utils.getCentroid(feat);
            break;
          case "Polygon":
            position = utils.getCentroid(feat);
            break;
        }
        if (!feat.type && feat.lnglat) {
          position = feat.lnglat;
        }
        if (position.length) {
          TooltipMaker._show(position, feat);
        }
      }
    }
  };
  let clickFn = function (e) {
    const feat = layer.queryFeature(e.pixel.toArray());
    if (feat) {
      let featProperties = feat.properties;
      if (layer.CLASS_NAME === "HeatMap") {
        if (feat.height || feat.scale) {
          // 热力图
          featProperties = {
            layerAttr: layerAttr,
          };
          let seriesType = _.upperFirst(featProperties.layerAttr.seriesType);
          dsf.emit.$emit(`GIS${seriesType}Click`, featProperties, [window]);
        }
      } else {
        if (typeof click === "function") {
          click(feat, e);
        }
        let seriesType = _.upperFirst(featProperties.layerAttr.seriesType);
        dsf.emit.$emit(`GIS${seriesType}Click`, featProperties, [window]);
      }
    }
  };
  map.on("complete", completeFn);
  map.on("mousemove", hoverFn);
  map.on("click", clickFn);
};
/**
 * @description 地图图层悬浮样式处理成函数结构
 * @param {object|string} feat 图层的feature或名称
 * @param {object} item 被指定修改的图层样式
 * @param {object} cache 被指定修改的图层样式的缓存
 * @param {object} itemStyle 图层的悬浮之前样式
 * @param {array} keys 控制悬浮图层的修改的样式字段
 * @return {无}
 */
const AMapHoverTransform = function (feat, item, cache, itemStyle, keys) {
  Object.keys(itemStyle).forEach((key) => {
    //如果悬浮样式没有则使用之前样式
    let value = cache[key] ? cache[key] : itemStyle[key];
    if (dsf.isObject(value) && !Array.isArray(value) && cache[key]) {
      AMapHoverTransform(feat, item[key], cache[key], itemStyle[key], keys);
    } else {
      if (!cache[key]) {
        item[key] = itemStyle[key];
      }
      if (keys.includes(key)) {
        item[key] = function (i, f) {
          if (_.isEqual(f.properties, feat.properties)) {
            if (typeof value === "function") {
              return value(i, f);
            }
            return value;
          } else {
            if (typeof itemStyle[key] === "function") {
              return itemStyle[key](i, f);
            }
            return itemStyle[key];
          }
        };
      }
    }
  });
};
/**
 * @description 地图配置项针对函数形式回调参数统一以及字段映射
 * @param {object} item 配置项对象
 * @param {object} key 配置项字段名
 * @param {map} mapList 需要映射修改的字段
 * @return {无}
 */
const AMapTransformFunctionArgs = function (key, item, mapList) {
  let value = item[key];
  if (typeof value === "function") {
    let __value = value;
    value = function (i, f) {
      return __value(f, i);
    };
    item[key] = value;
  }
  if (mapList && mapList.has(key)) {
    let mapKey = mapList.get(key);
    item[mapKey] = value;
    //删除该字段
    Reflect.deleteProperty(item, key);
  }
};

/**
 * @description 地图图层生成悬浮样式方法
 * @param {object} layer 图层对象
 * @param {object} events 事件对象
 * @param {object} emphasis 悬浮样式
 * @param {object} style 图层默认样式
 * @param {array} keys 图层悬浮需要控制的字段
 * @return {无}
 */
const AMapHandlerHoverFunction = function (layer, events, emphasis, style, keys) {
  let _hover = events.hover;
  let cache = dsf.mix(true, {}, emphasis);
  let hasFeat = false;
  events.hover = function (feat, e) {
    if (feat) {
      hasFeat = true;
      AMapHoverTransform(feat, emphasis, cache, style, keys);
      layer.setStyle(emphasis);
    } else {
      if (hasFeat) {
        layer.setStyle(style);
      }
      hasFeat = false;
    }
    if (typeof _hover === "function") {
      _hover(feat, e);
    }
  };
};
/**
 * @description 查询行政下级区域列表
 * @param {string} adcode 行政区域编码 必填
 * @param {number} deep 深度 选填
 * @return {promise} list
 */
const AMapQueryDistrictList = function (code, deep = 3) {
  const opts = {
    subdistrict: deep,
    extensions: "base",
    showbiz: false,
  };
  const district = new AMap.DistrictSearch(opts);
  return new Promise((resolve, reject) => {
    district.search(code, function (status, result) {
      if (!result.districtList) {
        resolve([]);
        return false;
      }
      resolve(result.districtList);
    });
  });
};

/**
 * @description 查询指定级别的行政区域轮廓图
 * @param {string} code 行政区域编码
 * @param {boolean} level 查询的级别 province city district
 * @return {无}
 */
const AMapQueryParticularDistrict = function (code, level) {
  if (level === "street") {
    return Promise.resolve([]);
  }
  const query = function (code) {
    const opts = {
      subdistrict: 1,
      extensions: "all",
      showbiz: false,
    };
    const district = new AMap.DistrictSearch(opts);

    const _promise = new Promise((resolve) => {
      district.search(code, function (status, result) {
        if (!result.districtList) {
          resolve(null);
          return false;
        }
        const district = result.districtList[0];
        const boundaries = district.boundaries;
        const center = district.center;
        //结束
        if (district.level === level) {
          const properties = {
            center: [center.lng, center.lat],
            name: district.name,
            adcode: district.adcode,
            boundaries,
            level: district.level,
          };
          resolve(properties);
        } else if (district.districtList && district.districtList.length) {
          let _ = [];
          for (let i = 0; i < district.districtList.length; i++) {
            let subdistrict = district.districtList[i];
            _.push(query(subdistrict.adcode));
          }
          Promise.all(_).then((res) => resolve(res));
        } else {
          resolve(null);
        }
      });
    });

    return _promise;
  };

  return query(code);
};
/**
 * @description 查询行政区域轮廓图 只查询到下级
 * @param {string} code 行政区域编码
 * @param {boolean} isEnd 是否结束查询 查单层使用
 * @return {无}
 */
const AMapQueryDistrict = function (code, isEnd, extraData = {}, parent) {
  const opts = {
    subdistrict: 1,
    extensions: "all",
    showbiz: false,
  };
  const district = new AMap.DistrictSearch(opts);
  return new Promise((resolve, reject) => {
    district.search(code, function (status, result) {
      if (!result.districtList) {
        resolve(null);
        return false;
      }
      const district = result.districtList[0];
      const boundaries = district.boundaries;
      const center = district.center;

      const properties = {
        center: [center.lng, center.lat],
        name: district.name,
        adcode: district.adcode,
        ...extraData,
        boundaries,
        level: district.level,
        parent: parent ? parent : boundaries,
      };
      let promise = [];

      //包含子级
      if (district.districtList && district.districtList.length && !isEnd) {
        for (let i = 0; i < district.districtList.length; i++) {
          let subdistrict = district.districtList[i];
          promise.push(AMapQueryDistrict(subdistrict.adcode, true, {}, boundaries));
        }
      }
      if (isEnd || (!district.districtList.length && !isEnd)) {
        resolve(properties);
      } else {
        Promise.all(promise).then((res) => resolve(res));
      }
    });
  });
};

const label = ["fillColor"];
//悬浮样式控制字段
const AMapEmphasisKeys = {
  point: ["radius", "borderWidth", "borderColor", "blurWidth", "color", "zIndex"],
  line: ["altitude", "color"],
  label,
  polygon: ["topColor", "sideTopColor", "sideBottomColor", "height", "altitude", "labelAltitude", ...label],
  scatter: ["color", "borderColor", "size", "altitude"],
};

/**
* @description 处理线样式
* @param {object} options 线条配置项目
* @return {object} {
  config:配置,
  itemStyle:样式
  emphasis:悬浮样式
}
*/
const AMapDealLineHandler = function (options) {
  let series = dsf.mix(true, {}, _line.line, options);
  //做字段转换和字段函数方法替换
  Object.keys(series).forEach((key) => {
    AMapTransformFunctionArgs(key, series, new Map([["show", "visible"]]));
  });
  let { itemStyle, emphasis, ...config } = series;

  Object.keys(itemStyle).forEach((key) => {
    AMapTransformFunctionArgs(key, itemStyle);
  });

  Object.keys(emphasis.itemStyle).forEach((key) => {
    AMapTransformFunctionArgs(key, emphasis.itemStyle);
  });
  return {
    config,
    itemStyle,
    emphasis,
  };
};
/**
* @description 处理label样式
* @param {object} options label配置项目
* @return {object} {
  ALabel:总体配置,
  config:配置项,
  itemStyle:样式
  emphasis:悬浮样式
}
*/
const AMapDealLabelHandler = function (options) {
  let currentLabel = dsf.mix(true, {}, _label.label, options);

  let { itemStyle: style, icon, emphasis, ...config } = currentLabel;

  let code = `var formatter = ${JSON.stringify(config.name)};
  var content = dsf.dataview.utils.labelStringToFunction(formatter,params,'gis');
  return content;`;
  config.name = new Function("params", code);

  //将label的字段转换和函数参数调换
  Object.keys(style).forEach((key) => {
    AMapTransformFunctionArgs(key, style, new Map([["color", "fillColor"]]));
  });
  Object.keys(config).forEach((key) => {
    AMapTransformFunctionArgs(
      key,
      config,
      new Map([
        ["name", "content"],
        ["show", "visible"],
        ["position", "direction"],
      ])
    );
  });

  Object.keys(icon).forEach((key) => {
    AMapTransformFunctionArgs(key, icon, new Map([["position", "anchor"]]));
  });

  let { direction, content, ...remain } = config;
  const { offset, ...labelStyle } = style;

  let ALabel = {
    ...remain,
    text: {
      content,
      direction,
      offset,
      style: labelStyle,
    },
    icon,
  };
  let EItemStyle = null;
  if (emphasis.show) {
    let style = emphasis.itemStyle;
    Object.keys(style).forEach((key) => {
      AMapTransformFunctionArgs(key, style, new Map([["color", "fillColor"]]));
    });
    EItemStyle = {
      text: {
        style,
      },
    };
  }

  return {
    ALabel,
    config: remain,
    emphasis: EItemStyle,
    itemStyle: {
      ...ALabel,
      extData(index, feat) {
        return feat;
      },
    },
  };
};
export {
  AMapInitSource,
  AMapEventHandler,
  AMapHoverTransform,
  AMapTransformFunctionArgs,
  AMapHandlerHoverFunction,
  AMapEmphasisKeys,
  AMapQueryDistrict,
  AMapDealLineHandler,
  AMapDealLabelHandler,
  AMapQueryDistrictList,
  AMapQueryParticularDistrict,
};
