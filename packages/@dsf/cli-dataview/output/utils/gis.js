/*
 * @Description:
 * @Author: zhanghang
 * @Date: 2023-08-18 10:59:31
 * @LastEditors: shenah
 * @LastEditTime: 2025-03-07 09:32:10
 */

import polygonToLine from "@turf/polygon-to-line";
import centroid from "@turf/centroid";
import simplify from "@turf/simplify";
import distance from "@turf/distance";
import { multiPolygon, point, polygon, lineString, featureCollection } from "@turf/helpers";
import centerOfMass from "@turf/center-of-mass";
import bbox from "@turf/bbox";
import { default as union } from "@turf/union";
const turf = {
  union,
  centerOfMass,
  polygonToLine,
  distance,
  bbox,
  centroid,
  simplify,
  multiPolygon,
  point,
  polygon,
  lineString,
  featureCollection,
};

export default {
  union() {
    return turf.union(...arguments);
  },
  //计算质点
  centerOfMass() {
    return turf.centerOfMass(...arguments);
  },
  bbox() {
    return turf.bbox(...arguments);
  },
  distance() {
    return turf.distance(...arguments);
  },
  setColorOpacity(colorStr, opacity) {
    let colorObj = tinycolor(colorStr);
    colorObj.setAlpha(opacity);
    return tinycolor(colorObj).toString();
  },
  loadJsSource(url) {
    let urls = url;
    if (typeof urls === "string") {
      urls = [urls];
    }
    return new Promise((resolve, reject) => {
      const loadScript = (curl, index) => {
        try {
          let script = document.createElement("script");
          script.charset = "utf-8";
          script.src = curl;
          document.head.appendChild(script);
          script.onload = function () {
            if (index === urls.length - 1) {
              resolve();
            }
          };
        } catch (error) {
          reject(error);
        }
      };
      urls.forEach((curl, index) => {
        loadScript(curl, index);
      });
    });
  },
  loadCssSource(url) {
    return new Promise((resolve, reject) => {
      try {
        let linkElement = document.createElement("link");
        linkElement.rel = "stylesheet";
        linkElement.href = url;
        document.head.appendChild(linkElement);
        linkElement.onload = function () {
          resolve();
        };
      } catch (error) {
        reject(error);
      }
    });
  },
  //转换style css
  transformStyle(options) {
    let style = "";
    Object.keys(options).forEach((key) => {
      style += key.replace(/([A-Z])/g, function (match) {
        return "-" + match.toLowerCase();
      });
      style += ":";
      let value = options[key];
      if (Array.isArray(value)) {
        value = value.join("px ") + "px";
      } else if (dsf.isNumber(value)) {
        value += "px";
      }
      style += value + ";";
    });
    return style;
  },
  //获取地图数据
  getMapData(url) {
    return new Promise((resolve, reject) => {
      if (typeof url === "string") {
        dsf.http.get(url).then((res) => {
          if (res.status === 200) {
            let data = res.data;
            resolve(data);
          }
        });
      } else if (url && typeof url === "object") {
        resolve(url);
      } else {
        resolve({});
      }
    });
  },
  //面转线 geojson
  getPolygonToLine(data) {
    let features = data.features.map((feature) => {
      if (feature.geometry.type === "Polygon") {
        feature.geometry.type = "MultiPolygon";
        feature.geometry.coordinates = [feature.geometry.coordinates];
      }
      return turf.polygonToLine(feature);
    });
    data.features = features.reduce((total, cur) => total.concat(cur.features), []);
    return data;
  },
  // 转多面 coordinates[三位数组]
  multiPolygonFromPoint(coordinates, properties) {
    return turf.multiPolygon(coordinates, properties);
  },
  //点位转feature
  point() {
    return turf.point(...arguments);
  },
  polygon() {
    return turf.polygon(...arguments);
  },
  centroid() {
    return turf.centroid(...arguments);
  },
  //将feature生成标准的geojson
  featureCollection() {
    return turf.featureCollection(...arguments);
  },
  //点位转线feature
  lineString() {
    return turf.lineString(...arguments);
  },
  //简化geojson
  simplify() {
    return turf.simplify(...arguments);
  },
  //获取面中心点
  getCentroid(feat) {
    let type = feat.type;
    let polygons = [];
    if (type == "MultiPolygon") {
      polygons = feat.coordinates[0];
    } else if (type == "Polygon") {
      polygons = feat.coordinates;
    }

    if (Array.isArray(polygons[0]) && polygons.length) {
      polygons = turf.polygon(polygons);
      let re = turf.centroid(polygons);

      return re ? re.geometry.coordinates : [];
    }
    return [];
  },
  //颜色插值算法
  rangeColor(start, end, min, max, value) {
    let { r: sr, g: sg, b: sb } = tinycolor(start).toRgb();
    let { r: er, g: eg, b: eb } = tinycolor(end).toRgb();
    let colorStart = [sr, sg, sb];
    let colorEnd = [er, eg, eb];
    let m = 0;
    if (Number(max) > Number(min)) {
      m = (value - min) / (max - min);
    }
    m = m > 1 ? 1 : m;
    let r = parseInt(colorStart[0] + (colorEnd[0] - colorStart[0]) * m);
    let g = parseInt(colorStart[1] + (colorEnd[1] - colorStart[1]) * m);
    let b = parseInt(colorStart[2] + (colorEnd[2] - colorStart[2]) * m);

    return `rgb(${r},${g},${b})`;
  },
  //分段颜色计算
  separateColor(value, rules, defaultColor = "#008CFF") {
    let color = defaultColor;
    value = Number(value)
    rules.forEach((it) => {
      const rule = Number(it.value);
      const v = it.color;
      if (eval(`${value}>=${rule}`)) {
        color = v;
      }
    });
    return color;
  },
  // 解析polygon为geojson格式
  analysisIslandCave(data) {
    const polygons = data.split("|").map((item) => {
      const points = item.split(";").map((point) => {
        const num = point.split(",");
        return [+num[0], +num[1]];
      });
      const _points = [];
      let lastIndex = 0;
      let firstPoint = points[lastIndex];
      for (let index = 1; index < points.length; index++) {
        const point = points[index];
        if (point[0] === firstPoint[0] && point[1] === firstPoint[1]) {
          const slicePoints = points.slice(lastIndex, ++index);
          _points.push(slicePoints);
          lastIndex = index;
          if (lastIndex === points.length) break;
          firstPoint = points[lastIndex];
        }
      }
      return _points;
    });
    return turf.multiPolygon(polygons);
  },
  handleDataToThreeDimensions(data) {
    return Array.isArray(data[0]) ? (Array.isArray(data[0][0]) ? (Array.isArray(data[0][0][0]) ? data : [data]) : []) : [];
  },
  // 颜色透明度转换
  transColorOpacity(color, opacity) {
    const colorValue = tinycolor(color);
    const transparentColor = colorValue.setAlpha(opacity).toRgbString();
    return transparentColor;
  },
};
