/*
 * @Description: 百度地图工具函数
 * @Author: shenah
 * @Date: 2023-10-07 13:46:02
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-04-27 10:51:27
 */
import utils from "_dataview/output/utils/gis.js";
import { wktToGeoJSON } from "@terraformer/wkt";
// 解析根据行政区域查询获取到的数据
const analyzeDataByApiRegionSearch = function (str, row, tolerance = 0.005) {
  let obj = {
    type: "Feature",
    geometry: {
      type: "MultiPolygon",
      coordinates: [], // 添加坐标数组
    },
    properties: {
      ...row,
      adcode: row.adcode,
      name: row.name,
      center: [0, 0],
    }, // 可选，可以添加其他属性
  };
  delete obj.properties.polyline;
  if (typeof str !== "string") {
    return obj;
  }
  let handleStrToGeoJson = wktToGeoJSON(str);
  if (handleStrToGeoJson.type === "Polygon") {
    handleStrToGeoJson.coordinates = [handleStrToGeoJson.coordinates];
    handleStrToGeoJson.type = "MultiPolygon";
  }
  //geojson 抽稀(减少很多点)
  obj.geometry = utils.simplify(handleStrToGeoJson, {
    tolerance: 0.01,
    highQuality: false,
  });
  let pointObj = utils.centroid(obj);
  obj.properties.center = pointObj?.geometry?.coordinates || [0, 0];
  return obj;
};
const handleQueryDistrictList = function (data) {
  if (data.length) {
    data.forEach((item) => {
      if (item.code === "0") {
        item.adcode = "100000";
      } else {
        item.adcode = item.code;
      }
      item.districtList = item.districts || [];
      if (item.districtList.length) {
        handleQueryDistrictList(item.districtList);
      }
    });
  }
};
/**
 * @description 查询行政下级区域列表
 * @param {string} code 行政区域编码 必填
 * @param {number} deep 深度 选填
 * @return {promise} list
 */
const BMapQueryDistrictList = function (code, extraParam = {}) {
  if (code === "100000") {
    code = "中国";
  }
  let params = {
    keyword: code,
    ak: window.bMapServiceAK,
    sub_admin: "2",
    extensions_code: "1",
  };
  if (extraParam && typeof extraParam === "object") {
    params = {
      ...params,
      ...extraParam,
    };
  }
  return new Promise((resolve) => {
    var p = {
      url: "https://api.map.baidu.com/api_region_search/v1/",
      params,
    };
    dsf.http
      .get(dsf.url.getWebPath("resource/getHttpResult", $$webRoot.dataview), p)
      .then((res) => {
        let nowRes = res.data;
        if (nowRes.success) {
          let data = nowRes.data.districts || [];
          handleQueryDistrictList(data);
          resolve(data);
        } else {
          resolve([]);
        }
      })
      .catch((error) => {
        console.log("BMapQueryDistrictList", error);
        resolve([]);
      });
  });
};
/**
 * @description 查询行政区域轮廓图 只查询到下级
 * @param {string} code 行政区域编码
 * @param {boolean} isEnd 是否结束查询 查单层使用
 * @return {无}
 */
const BMapQueryDistrict = ({ code, tolerance = 0.005, isEnd = false, extraParam = {}, extraData = {} }) => {
  return new Promise((resolve) => {
    BMapQueryDistrictList(code, extraParam).then((data) => {
      const parentItem = data[0];
      if (isEnd) {
        const data = analyzeDataByApiRegionSearch(
          parentItem.polyline,
          {
            ...extraData,
            ...parentItem,
          },
          tolerance
        );
        resolve([data]);
      } else {
        const districtList = parentItem.districtList ? parentItem.districtList : [];
        const max = 5; // 最大并发数
        const result = [];
        const __runTask__ = function (tasks, max) {
          if (!tasks.length) {
            resolve(result);
            return false;
          }
          const current = tasks.slice(0, max);
          tasks = tasks.slice(max);
          let __runTaskNumber__ = current.length;
          const __run__ = function (task) {
            console.log("task", task.name);
            BMapQueryDistrictList(task.code, {
              boundary: 1,
              sub_admin: "1",
            })
              .then((data) => {
                let item = data[0];

                if (item) {
                  const resultData = analyzeDataByApiRegionSearch(item.polyline, item);
                  result.push(resultData);
                }
              })
              .catch((error) => {
                console.warn(`error-${error}`);
              })
              .finally(() => {
                __runTaskNumber__--;
                if (tasks.length) {
                  __runTaskNumber__++;
                  const task = tasks.pop();
                  // 直接运行，百度有并发数+时间限制，延迟500ms 推入执行栈
                  setTimeout(() => {
                    __run__(task);
                  }, 500);
                }
                console.log(__runTaskNumber__);
                if (__runTaskNumber__ === 0) {
                  console.log("result", result.length);
                  resolve(result);
                }
              });
          };

          for (let i = 0; i < current.length; i++) {
            const task = current[i];
            __run__(task);
          }
        };

        __runTask__(districtList, max);
      }
    });
  });
};
/**
 * @description 初始化地图数据来源
 * @param {object|string} source 地图来源路径活对象
 * @param {string} seriesName 图层系列名
 * @return {object} source
 */
const BMapInitSource = function (source, extraData, seriesName, layerProperties = {}) {
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
 * @name: 坐标转化
 * @return {*}
 */
const BMapTranslatePoint = function (arr, a = COORDINATES_WGS84, b = COORDINATES_BD09) {
  return new Promise((resolve) => {
    var convertor = new BMapGL.Convertor();
    convertor.translate(arr, a, b, (data) => {
      if (data.status === 0) {
        resolve(data.points);
      } else {
        resolve([]);
      }
    });
  });
};
export { BMapQueryDistrictList, BMapQueryDistrict, BMapInitSource, BMapTranslatePoint };
