/*
 * @Description: 业务方法以及属性
 * @Author: shenah
 * @Date: 2023-08-21 10:21:52
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-06-11 17:55:31
 */

import MarkerCustomerLayer from "./markerCustomerLayer";
import { BMapQueryDistrictList, BMapQueryDistrict, BMapInitSource, BMapTranslatePoint } from "./BMapHelper.js";
import { showBMapFeatureList } from "_dataview/output/gis/BMap/BMapConfig.js";

import utils from "_dataview/output/utils/gis.js";
import themeStyle from "_dataview/output/gis/BMap/theme";
import defaultPolygon from "../../options/polygon.js";
import defaultPoint from "../../options/point.js";
import defaultScatter from "../../options/scatter.js";
import defaultHeatMap from "../../options/heatMap.js";
import defaultFlatBar from "../../options/flatBar.js";
import defaultPulseLink from "../../options/pulseLink.js";
import defaultIcon from "../../options/icon.js";
import BasePrivate from "./BasePrivate";
export default class BMapProxy extends BasePrivate {
  constructor(instance) {
    super(instance);

    //可视化实例
    this.loca = null;
    //地图实例
    this.map = null;
    //风格
    this.theme = "dark";
  }

  // 初始化api
  initAPIJS() {
    this._mapURL = `https://api.map.baidu.com/getscript?type=webgl&v=1.0&ak=${window.bMapWebAK}`;
    return new Promise((resolve, reject) => {
      let promiseArr = [];
      if (!window.BMapGL) {
        promiseArr.push(utils.loadJsSource(this._mapURL));
        this._locaURL.forEach((url) => {
          promiseArr.push(utils.loadJsSource(url));
        });
        Promise.all(promiseArr)
          .then(() => {
            resolve();
          })
          .catch(() => {
            reject();
          });
      } else {
        resolve();
      }
    });
  }

  /**
   * @description 获取地图类型
   * @param {string}
   */
  getMapType() {
    return "BMap";
  }

  /**
   * @description 地图初始化
   * @param {object} el 地图元素
   * @param {object} options => (center：中心点,zoom：放大倍数,pitch：俯角,rotation：旋转角度)
   * @return {无}
   */
  initMap(el, options) {
    // 生成百度地图有用的options
    let useOptions = this._createUseOptions(options);
    const map = new BMapGL.Map(el, {
      restrictCenter: false,
      ...useOptions,
      preserveDrawingBuffer: true,
    });
    // 启用滚轮缩放
    map.enableScrollWheelZoom();
    this.map = map;
    this._resetData();
    this.setMapStyle(options.mapStyle);
    this._addMapEvent();
    this.setMapOptions(useOptions);
    // 设置可视化图层
    this.loca = new mapvgl.View({
      map,
    });
  }

  /**
   * 视野控制在某个图层
   * @param {*} layers
   */
  setFitView(layers) {
    
  }

  /**
   * @description 查询多个点位
   * @param {string} data 点位数据
   */
  queryMultiPointsByCode(data) {
    let extraParam = {
      boundary: 1,
      sub_admin: "0",
    };
    let promise = [];
    data.forEach((it) => {
      if (typeof it === "string") {
        promise.push(
          BMapQueryDistrict({
            code: it,
            extraParam,
            isEnd: true,
          })
        );
      } else if (dsf.isObject(it)) {
        if (it.adcode) {
          promise.push(
            BMapQueryDistrict({
              code: it.adcode,
              extraParam,
              isEnd: true,
              extraData: it,
            })
          );
        }
      }
    });
    return Promise.all(promise).then((res) => {
      let points = [];
      res.forEach((it) => {
        if (Array.isArray(it)) {
          it.forEach((item) => {
            if (item) {
              let point = item.properties.center;
              points.push({ point, properties: { ...item.properties } });
            }
          });
        }
      });
      return points;
    });
  }

  /**
   * @description 查询行政下级区域列表
   * @param {string} adcode 行政区域编码 必填
   * @return {promise} list
   */
  queryDistrictListByCode(adcode) {
    return BMapQueryDistrictList(adcode);
  }

  /**
   * @description 查询行政区域
   * @param {string} adcode 行政区域编码
   * @param {string} level 查询区域等级
   * @return {promise} geojson
   */
  queryParticularDistrictByCode() {
    return Promise.resolve(null);
  }

  /**
   * @description 查询行政区域
   * @param {string} adcode 行政区域编码
   * @return {promise} geojson
   */
  queryDistrictByCode(adcode, tolerance) {
    return BMapQueryDistrict({ code: adcode, tolerance }).then((res) => {
      return {
        geo: {
          features: res,
          type: "FeatureCollection",
        },
        boundaries: [],
      };
    });
  }

  /**
   * 切换地图的主题
   * @param {*} str
   * @return {*}
   */
  setMapStyle(str) {
    let style = themeStyle[str] || str;
    this.theme = str;
    if (Array.isArray(style) || !str) {
      this.map.setMapStyleV2({ styleJson: style });
    } else {
      this.map.setMapStyleV2({
        styleId: style,
      });
    }
  }

  /**
   * 切换地图标志
   * @param {*} feature
   */
  setFeatures(feature) {
    let keys = Object.keys(showBMapFeatureList);
    keys.forEach((key) => {
      let obj = showBMapFeatureList[key];
      if (obj) {
        if (feature.indexOf(key) > -1) {
          this[obj.useObj][obj.method[0]]();
        } else {
          this[obj.useObj][obj.method[1]]();
        }
      }
    });
  }

  /**
   * @description 地图resize
   * @param {无}
   * @return {无}
   */
  resize() {
    return this.map && this.map.resize();
  }

  /**
   * @param {object} options 地图的选项
   */
  setMapOptions(options) {
    if (options.center) {
      let point = this._createPoint(options.center);
      let zoom = options.zoom ? options.zoom : this.map.getZoom();
      this.map.centerAndZoom(point, zoom);
    }
    if (options.rotation) {
      this.map.setHeading(options.rotation); //设置地图旋转角度
    }
    if (options.pitch) {
      this.map.setTilt(options.pitch); //设置地图倾斜角度
    }
  }

  /**
   * @description 添加点图层
   * @param {string} id 图层id 必填
   * @param {string|object} source geojson
   * @param {object} options => 参考 options point.js
   * @param {object} events => {click:点击事件，hover:hover事件,complete:加载完成事件}
   * @return {无}
   */
  addPointLayer(id, source, extraData = [], options = {}, events = {}) {
    let self = this;
    //路径
    if (typeof source === "string") {
      utils.getMapData(source).then((data) => {
        this.addPointLayer(id, data, extraData, options, events);
      });
      return false;
    }
    options = dsf.mix(true, {}, defaultPoint, options);
    //点图层配置项
    let series = options.point;
    // 文字options
    let labelOptions = options.label;
    let code = `var formatter = ${JSON.stringify(options.label.name)};
    var content = dsf.dataview.utils.labelStringToFunction(formatter,params,'gis');
    return content;`;

    const labelTextFn = new Function("params", code);

    //图层系列名称
    let seriesName = series.seriesName;
    BMapInitSource(source, extraData, seriesName, {
      layerId: id,
      seriesType: options.seriesType,
    });
    let textOldData = [];
    let renderOrder = 1000;
    let commonParams = {
      options: options,
      events,
    };
    // 加载点位图层
    let pointLayer = this._addLayer({
      ...commonParams,
      type: "point",
      otherOptions: {
        renderOrder,
        collides: false,
      },
    });
    this.loca.addLayer(pointLayer);
    // 加载文字图层
    let textLayer = null;
    if (options.label.show) {
      textLayer = this._addLayer({
        ...commonParams,
        type: "text",
        otherOptions: {
          drawInMapView3D: true, // 设置文字图层在3D视图中绘制
          renderOrder: renderOrder + 1,
        },
      });
      this.loca.addLayer(textLayer);
    }
    // 加载点位图层数据
    let data = _.cloneDeep(source.features);
    let textData = _.cloneDeep(data);
    let altitude = this.getBaseAltitude({ type: "point" });
    data.forEach((item) => {
      item.properties.seriesName = seriesName;
      item._type = "point";
      item.geometry.coordinates.push(altitude);
    });
    // 设置点位
    pointLayer.setData(data);
    let layerArr = [pointLayer];
    // 设置文字
    if (textLayer) {
      textData.forEach((item) => {
        let nowText = item.properties.name;
        item.properties.seriesName = seriesName;
        item._type = "point_text";
        item.geometry.coordinates.push(altitude);
        if (typeof labelTextFn === "function") {
          nowText = labelTextFn(item);
        }
        item.properties.text = nowText;
      });
      textLayer.setOptions({
        onMousemove(e, f) {
          self._handleUserEvent({
            e,
            f,
            layer: textLayer,
            eventType: "Mousemove",
          });
          self._addTooltips({
            e,
            f,
            options,
            layer: textLayer,
            _type: "point_text",
          });
        },
        onClick(e, f) {
          self._handleUserEvent({
            e,
            f,
            layer: pointLayer,
            eventType: "Click",
          });
          if (e.dataItem && e.dataItem._type === "point_text") {
            let featProperties = e.dataItem.properties;
            dsf.emit.$emit("GISPointClick", featProperties, [window]);
          }
        },
      });
      textOldData = _.cloneDeep(textData);
      textLayer.setData(textData);
      layerArr.push(textLayer);
    }

    // 设置移入点图层
    pointLayer.setOptions({
      onMousemove(e, f) {
        // 增加提示
        self._handleUserEvent({
          e,
          f,
          layer: pointLayer,
          eventType: "Mousemove",
        });
        self._addTooltips({
          e,
          f,
          options,
          layer: pointLayer,
          _type: "point",
        });
        if (e.dataItem && e.dataItem._type === "point") {
          let index = e.dataIndex;
          if (!pointLayer._moveInfo) {
            pointLayer._moveInfo = {
              index,
            };
            if (textLayer) {
              let textData = textLayer.data;
              textData[index].properties.color = textLayer.options.selectedColor;
              textLayer.setOptions({
                fontSize: labelOptions.emphasis.itemStyle.fontSize,
                data: textData,
              });
            }
          } else if (pointLayer._moveInfo && pointLayer._moveInfo.index !== index) {
            if (textLayer) {
              let textData = _.cloneDeep(textOldData);
              textData[index].properties.color = textLayer.options.selectedColor;
              textLayer.setOptions({
                fontSize: labelOptions.emphasis.itemStyle.fontSize,
                data: textData,
              });
            }
          }
        } else {
          if (pointLayer._moveInfo) {
            if (textLayer) {
              textData[pointLayer._moveInfo.index].properties.color = undefined;
              textLayer.setOptions({
                fontSize: labelOptions.itemStyle.fontSize,
                data: _.cloneDeep(textOldData),
              });
            }
            pointLayer._moveInfo = null;
          }
        }
      },
      onClick(e, f) {
        self._handleUserEvent({
          e,
          f,
          layer: pointLayer,
          eventType: "Click",
        });
        if (e.dataItem && e.dataItem._type === "point") {
          let featProperties = e.dataItem.properties;
          dsf.emit.$emit("GISPointClick", featProperties, [window]);
        }
      },
    });
    const layers = this.instance.layers;
    let _layers = layers.get(id);
    if (_layers) {
      this.removeLayers(_layers);
    }
    layers.set(id, layerArr);
    this._zoomByShowHideLayer([layerArr]);
  }

  /**
   * @description 添加面图层
   * @param {string} id => 图层id 必填
   * @param {string} source geojson 必填
   * @param {object} extraData 额外数据 选填
   * @param {object} options => 参考 options polygon.js 选填
   * @param {object} events => {click:点击事件，hover:hover事件,complete:加载完成事件} 选填
   * @param {object} boundaries => 区域轮廓 选填
   * @return {无}
   */
  addPolygonLayer(id, source, extraData = [], options = {}, events = {}) {
    if (typeof source === "string") {
      utils.getMapData(source).then((data) => {
        let arr = data.features.map((item) => new BMapGL.Point(item.properties.center[0], item.properties.center[1]));
        BMapTranslatePoint(arr).then((resultPoints) => {
          if (resultPoints.length) {
            data.features.forEach((item, index) => {
              let nowPoint = resultPoints[index];
              item.properties.center = [nowPoint.lng, nowPoint.lat];
            });
          }
          this.addPolygonLayer(id, data, extraData, options, events);
        });
      });
      return false;
    }
    options = dsf.mix(true, {}, defaultPolygon, options);
    // 面图层options
    let series = options.polygon;
    let mask = series.itemStyle.mask;
    // 文字options
    let labelOptions = options.label;

    let range = series.itemStyle.range;
    if (range.show) {
      let sc = range.color[0];
      let ec = range.color[1];
      let min = range.min;
      let max = range.max;
      //额外数据
      extraData.forEach((data) => {
        let value = data.value;
        let color = ec;
        if (range.mode === "separate") {
          color = utils.separateColor(value, range.rules, ec);
        } else {
          color = utils.rangeColor(sc, ec, min, max, value);
        }
        data.color = color;
      });
      series.itemStyle.topColor = function (f) {
        if (f.properties.color) {
          return f.properties.color;
        }
        return sc;
      };
    }
    //这里添加对应的properties
    let seriesName = series.seriesName;
    BMapInitSource(source, extraData, seriesName, {
      layerId: id,
      seriesType: options.seriesType,
    });

    // 因为面在最底层所以渲染顺序最低
    let polygonOldData = [];
    let textOldData = [];
    let self = this;
    let baseRenderOrder = 10;
    let altitude = series.itemStyle.height || 0;
    this._baseAltitude = altitude;
    let commonParams = {
      options,
      events,
    };
    // 加载面图层
    let shapeLayer = this._addLayer({
      ...commonParams,
      type: "shape",
      otherOptions: {
        renderOrder: baseRenderOrder,
      },
    });

    this.loca.addLayer(shapeLayer);
    let layerArr = [shapeLayer];
    let lineLayer = null;
    if (options.line.show) {
      // 加载线图层
      lineLayer = this._addLayer({
        ...commonParams,
        type: "line",
        otherOptions: {
          renderOrder: baseRenderOrder,
        },
      });
      this.loca.addLayer(lineLayer);
    }
    // 加载文字图层
    let textLayer = null;
    if (options.label.show) {
      textLayer = this._addLayer({
        ...commonParams,
        type: "text",
        otherOptions: {
          renderOrder: baseRenderOrder + 2,
          drawInMapView3D: true, // 设置文字图层在3D视图中绘制
        },
      });
      this.loca.addLayer(textLayer);
    }
    // 数据
    let data = source.features;
    // 设计数据
    let textData = [];

    let code = `var formatter = ${JSON.stringify(options.label.name)};
    var content = dsf.dataview.utils.labelStringToFunction(formatter,params,'gis');
    return content;`;

    let labelTextFn = new Function("params", code);

    data.forEach((item) => {
      item.properties.seriesName = seriesName;
      let nowText = item.properties.name;
      let textAltitude = 0;
      if (this._baseAltitude <= 999) {
        textAltitude = 4000;
      } else {
        textAltitude = this._baseAltitude * 4;
      }
      // 构建label数据
      let textOneData = {
        geometry: {
          type: "Point",
          coordinates: [item.properties.center[0], item.properties.center[1], textAltitude],
        },
        properties: {
          ...item.properties,
          seriesName,
        },
        _type: "polygon_text",
      };
      if (typeof labelTextFn === "function") {
        nowText = labelTextFn(textOneData);
      }
      textOneData.properties.color = labelOptions.itemStyle.color;
      textOneData.properties.text = nowText;
      item._type = "polygon";
      item.properties.height = this._baseAltitude;
      textData.push(textOneData);
    });
    // 设置文字图层数据
    if (textLayer) {
      textOldData = _.cloneDeep(textData);
      textLayer.setData(textData);
      layerArr.push(textLayer);
    }
    // 设置面图层数据
    polygonOldData = _.cloneDeep(data);
    shapeLayer.setData(data);
    let maskPolygonLayer = null;
    // 存在遮罩层和轮廓边框
    if (mask.show) {
      maskPolygonLayer = this._createMaskLayer(source, mask);
      this.loca.addLayer(maskPolygonLayer);
      layerArr.push(maskPolygonLayer);
    }
    if (lineLayer) {
      // 设置线图层数据
      let lineData = utils.getPolygonToLine(dsf.mix(true, {}, source));
      lineData.features.forEach((item) => {
        // 不要这个,这个会导致线飞
        // item.geometry.coordinates = item.geometry.coordinates.map((one) => [
        //   one[0],
        //   one[1],
        //   this._baseAltitude,
        // ]);
        // item.properties.height = this._baseAltitude;
      });
      lineLayer.setData(lineData.features);
      layerArr.push(lineLayer);
    }
    // 设置移入面图层
    shapeLayer.setOptions({
      onMousemove(e, f) {
        // 增加提示
        self._addTooltips({
          e,
          f,
          options,
          layer: shapeLayer,
          _type: "polygon",
        });
        let data = _.cloneDeep(polygonOldData);
        if (e.dataItem && e.dataItem._type === "polygon") {
          let index = e.dataIndex;
          let height = e.dataItem.properties.height;
          if (!shapeLayer._moveInfo) {
            shapeLayer._moveInfo = {
              index,
              height,
            };
            if (textLayer) {
              let textData = textLayer.data;
              textData[index].properties.color = textLayer.options.selectedColor;
              textLayer.setOptions({
                fontSize: labelOptions.emphasis.itemStyle.fontSize,
                data: textData,
              });
            }
            let data = shapeLayer.data;
            data[index].properties.height = series.emphasis.itemStyle.height;
            shapeLayer.setData(data);
          } else if (shapeLayer._moveInfo && shapeLayer._moveInfo.index !== index) {
            if (textLayer) {
              let textData = _.cloneDeep(textOldData);
              textData[index].properties.color = textLayer.options.selectedColor;
              textLayer.setOptions({
                fontSize: labelOptions.emphasis.itemStyle.fontSize,
                data: textData,
              });
            }
            data[index].properties.height = series.emphasis.itemStyle.height;
            shapeLayer._moveInfo = {
              index,
              height,
            };
            shapeLayer.setData(data);
          }
        } else {
          if (shapeLayer._moveInfo) {
            if (textLayer) {
              let textData = textLayer.data;
              textData[shapeLayer._moveInfo.index].properties.color = undefined;
              textLayer.setOptions({
                fontSize: labelOptions.itemStyle.fontSize,
                data: textData,
              });
            }
            shapeLayer.setData(data);
            shapeLayer._moveInfo = null;
          }
        }
      },
      onClick(e, f) {
        self._handleUserEvent({
          e,
          f,
          layer: shapeLayer,
          eventType: "Click",
        });
        if (e.dataItem && e.dataItem._type === "polygon") {
          let featProperties = e.dataItem.properties;
          dsf.emit.$emit("GISPolygonClick", featProperties, [window]);
        }
      },
    });
    const layers = this.instance.layers;
    let _layers = layers.get(id);
    if (_layers) {
      this.removeLayers(_layers);
    }
    layers.set(id, layerArr);
    this._zoomByShowHideLayer([layerArr]);
  }

  /**
   * @description 添加贴地点图层
   * @param {string|object} source 路径 geojson
   * @param {object} options => 参考 options scatter.js
   * @param {object} events => {click:点击事件，hover:hover事件,complete:加载完成事件}
   * @return {object} layerIds
   */
  addScatterLayer(id, source, extraData = [], options = {}, events = {}) {
    //路径
    if (typeof source === "string") {
      utils.getMapData(source).then((data) => {
        this.addScatterLayer(id, data, extraData, options, events);
      });
      return false;
    }
    options = dsf.mix(true, {}, defaultScatter, options);
    //贴地点图层配置项
    let series = options.scatter;
    // 文字options
    let labelOptions = options.label;
    //图层系列名称
    let seriesName = series.seriesName;
    BMapInitSource(source, extraData, seriesName, {
      layerId: id,
      seriesType: options.seriesType,
    });

    let self = this;
    let textOldData = [];
    let renderOrder = 100;
    let commonParams = {
      options,
      events,
    };
    // 加载贴地点
    let scatterLayer = this._addLayer({
      ...commonParams,
      type: "circle",
      otherOptions: {
        renderOrder,
      },
    });
    this.loca.addLayer(scatterLayer);
    // 加载文字图层
    let textLayer = null;
    if (options.label.show) {
      textLayer = this._addLayer({
        ...commonParams,
        type: "text",
        otherOptions: {
          drawInMapView3D: true, // 设置文字图层在3D视图中绘制
          renderOrder: renderOrder + 1,
        },
      });
      this.loca.addLayer(textLayer);
    }
    let layerArr = [scatterLayer];
    // 设置数据
    let data = _.cloneDeep(source.features);
    let textData = _.cloneDeep(data);

    let code = `var formatter = ${JSON.stringify(options.label.name)};
    var content = dsf.dataview.utils.labelStringToFunction(formatter,params,'gis');
    return content;`;

    let labelTextFn = new Function("params", code);

    let altitude = this.getBaseAltitude({ type: "circle" });
    data.forEach((item) => {
      item.properties.seriesName = seriesName;
      item._type = "circle";
      item.geometry.coordinates.push(altitude);
    });
    // 设置点位
    scatterLayer.setData(data);
    if (textLayer) {
      let altitude = this.getBaseAltitude({ type: "polygonText" });
      textData.forEach((item) => {
        let nowText = item.properties.name;
        item.properties.seriesName = seriesName;
        item._type = "circle_text";
        item.geometry.coordinates.push(altitude);
        if (typeof labelTextFn === "function") {
          nowText = labelTextFn(item);
        }
        item.properties.text = nowText;
        item.properties.color = labelOptions.itemStyle.color;
      });
      textLayer.setOptions({
        onMousemove(e, f) {
          self._handleUserEvent({
            e,
            f,
            layer: textLayer,
            eventType: "Mousemove",
          });
          self._addTooltips({
            e,
            f,
            options,
            layer: textLayer,
            _type: "circle_text",
          });
        },
        onClick(e, f) {
          self._handleUserEvent({
            e,
            f,
            layer: scatterLayer,
            eventType: "Click",
          });
          if (e.dataItem && e.dataItem._type === "circle_text") {
            let featProperties = e.dataItem.properties;
            dsf.emit.$emit("GISScatterClick", featProperties, [window]);
          }
        },
      });
      textOldData = _.cloneDeep(textData);
      textLayer.setData(textData);
      layerArr.push(textLayer);
    }
    // 设置移入点图层
    scatterLayer.setOptions({
      onMousemove(e, f) {
        self._handleUserEvent({
          e,
          f,
          layer: scatterLayer,
          eventType: "Mousemove",
        });
        self._addTooltips({
          e,
          f,
          options,
          layer: scatterLayer,
          _type: "circle",
        });
        if (e.dataItem && e.dataItem._type === "circle") {
          let index = e.dataIndex;
          if (!scatterLayer._moveInfo) {
            scatterLayer._moveInfo = {
              index,
            };
            if (textLayer) {
              let textData = textLayer.data;
              textData[index].properties.color = textLayer.options.selectedColor;
              textLayer.setOptions({
                fontSize: labelOptions.emphasis.itemStyle.fontSize,
                data: textData,
              });
            }
          } else if (scatterLayer._moveInfo && scatterLayer._moveInfo.index !== index) {
            if (textLayer) {
              let textData = _.cloneDeep(textOldData);
              textData[index].properties.color = textLayer.options.selectedColor;
              textLayer.setOptions({
                fontSize: labelOptions.emphasis.itemStyle.fontSize,
                data: textData,
              });
            }
          }
        } else {
          if (scatterLayer._moveInfo) {
            if (textLayer) {
              textLayer.setOptions({
                fontSize: labelOptions.itemStyle.fontSize,
                data: _.cloneDeep(textOldData),
              });
            }
            scatterLayer._moveInfo = null;
          }
        }
      },
      onClick(e, f) {
        self._handleUserEvent({
          e,
          f,
          layer: scatterLayer,
          eventType: "Click",
        });
        if (e.dataItem && e.dataItem._type === "circle") {
          let featProperties = e.dataItem.properties;
          dsf.emit.$emit("GISScatterClick", featProperties, [window]);
        }
      },
    });
    const layers = this.instance.layers;
    let _layers = layers.get(id);
    if (_layers) {
      this.removeLayers(_layers);
    }
    layers.set(id, layerArr);
    this._zoomByShowHideLayer([layerArr]);
  }

  /**
   * @description 添加热力图层
   * @param {string} id => 图层id 必填
   * @param {string} url 路径 geojson
   * @param {object} extraData 额外数据 选填
   * @param {object} options => 参考 options heatMap.js
   * @param {object} events => {click:点击事件，hover:hover事件,complete:加载完成事件}
   * @return {{无} }
   */
  addHeatMapLayerLayer(id, source, extraData = [], options = {}, events = {}) {
    let self = this;
    //字符串路径
    if (typeof source === "string") {
      utils.getMapData(source).then((data) => {
        this.addHeatMapLayerLayer(id, data, extraData, options, events);
      });
      return false;
    }
    options = dsf.mix(true, {}, defaultHeatMap, options);
    //热力图层配置项
    let series = options.heatMap;
    //图层系列名称
    let seriesName = series.seriesName;
    BMapInitSource(source, extraData, seriesName, {
      layerId: id,
      seriesType: options.seriesType,
    });

    let renderOrder = 100;
    let commonParams = {
      options: options,
      events,
    };
    // 加载热力图层
    let heatmapLayer = this._addLayer({
      ...commonParams,
      type: "heatmap",
      otherOptions: {
        height: this._baseAltitude * 4,
        renderOrder,
      },
    });
    this.loca.addLayer(heatmapLayer);
    source.features.forEach((item) => {
      item.properties.seriesName = seriesName;
      item._type = "heatmap";
      item.properties.count = item.properties.value;
    });
    // 设置热力图数据
    heatmapLayer.setData(source.features);
    const layers = this.instance.layers;
    let _layers = layers.get(id);
    if (_layers) {
      this.removeLayers(_layers);
    }
    let layerArr = [heatmapLayer];
    layers.set(id, layerArr);
    this._zoomByShowHideLayer([layerArr]);
  }

  /**
   * @description 添加平面柱图层
   * @param {string} id => 图层id 必填
   * @param {string} source 路径 geojson
   * @param {object} extraData 额外数据 选填
   * @param {object} options => 参考 options pulseLink.js
   * @param {object} events => {click:点击事件，hover:hover事件,complete:加载完成事件}
   * @param {object} useOptions => 伪代码区分类型的
   * @return {{无} }
   */
  addFlatBarLayer(id, source, extraData = [], options = {}, events = {}, useOptions = {}) {
    if (typeof source === "string") {
      utils.getMapData(source).then((data) => {
        this.addFlatBarLayer(id, data, extraData, options, events);
      });
      return false;
    }
    options = dsf.mix(true, {}, defaultFlatBar, options, useOptions);
    // 平面图层配置
    let series = options.flatBar;
    series.minZoom = series.zooms[0];
    series.maxZoom = series.zooms[1];
    let barType = series.barType;
    let labelOptions = options.label;
    //图层系列名称
    let seriesName = series.seriesName;
    BMapInitSource(source, extraData, seriesName, {
      layerId: id,
      seriesType: options.seriesType,
    });

    // 创建marker图层
    let layer = new MarkerCustomerLayer(this.map, series);
    let topColor = series.itemStyle.topColor;
    let sideLeftColor = series.itemStyle.sideLeftColor;
    let sideRightColor = series.itemStyle.sideRightColor;
    let width = series.itemStyle.width;
    let range = series.itemStyle.range;
    let oldHeightFn = series.itemStyle.height;
    let height = series.itemStyle.height;
    let borderWidth = series.itemStyle.borderWidth;
    let borderColor = series.itemStyle.borderColor;
    let hoverShow = series.emphasis.show;
    let hoverColor = series.emphasis.itemStyle.topColor;
    // 标签的属性
    let labelFontsize = labelOptions.itemStyle.fontSize;
    let labelColor = labelOptions.itemStyle.color;
    let labelBgColor = labelOptions.itemStyle.backgroundColor;
    let labelPositionStyle = {
      top: {
        top: 0,
        marginTop:"-100%",
      },
      left: {
        top: 0,
        marginTop: "-100%",
      },
      center: {
        top: "50%",
        marginTop: 0,
      },
      right: {
        top: "100%",
        marginTop: "100%",
      },
    };
    let labelPositionTop = labelPositionStyle[labelOptions.position].top;
    let labelPositionMarginTop = labelPositionStyle[labelOptions.position].marginTop;
    let labelShow = labelOptions.show;
    let labelShowStyle = labelOptions.show ? "block" : "none";
    let hoverLabelShow = labelOptions.emphasis.show;
    let hoverLabelFontSize = labelOptions.emphasis.itemStyle.fontSize;
    let hoverLabelColor = labelOptions.emphasis.itemStyle.color;
    let list = source.features;
    let colorList = [];
    list.forEach((item, index) => {
      let properties = item.properties;
      let lngLatArr = item.geometry.coordinates;
      // bar的属性
      let value = properties.value || 0;
      if (range.show) {
        let sc = range.color[0];
        let ec = range.color[1];
        let min = range.min;
        let max = range.max;
        let color = ec;
        if (range.mode === "separate") {
          color = utils.separateColor(value, range.rules, ec);
        } else {
          color = utils.rangeColor(sc, ec, min, max, value);
        }
        topColor = color;
        if (barType === "2") {
          sideLeftColor = utils.setColorOpacity(color, 0.8);
        } else {
          sideLeftColor = color;
          sideRightColor = color;
        }
      }
      if (typeof oldHeightFn === "function") {
        height = oldHeightFn(item);
      }
      let elStr = "";
      let barStyle = "";
      let labelTransform = "translate(-50%, -50%)";
      let labelMarginLeft = "34%";
      if (barType === "3") {
        labelTransform += `translateZ(${2 * width}px) rotateY(-45deg);`;
        labelMarginLeft = "-100%";
        if (labelOptions.position === "right") {
          labelPositionMarginTop = "0";
        } else if (labelOptions.position === "left") {
          labelPositionMarginTop = "-250%";
        } else if (labelOptions.position === "center") {
          labelPositionMarginTop = "-100%";
        }
      }
      let labelStyle = `margin-top:${labelPositionMarginTop};position: absolute;top:${labelPositionTop};margin-left: ${labelMarginLeft};transform:${labelTransform};width: 100px;text-align: center;
      font-size:${labelFontsize}px;color:${labelColor};background-color:${labelBgColor};display:${labelShowStyle};
     `;

      const labelText = dsf.dataview.utils.labelStringToFunction(labelOptions.name, item, "gis");

      let labelHTML = `<div class="marker-label" style="${labelStyle}">${labelText}</div>`;
      if (barType === "1") {
        // 代表的是平面柱体
        barStyle = `position:relative;
        width:${width}px;height:${height}px;border:${borderWidth}px solid ${borderColor};
        background-color:${topColor};
      `;
        elStr = `<div data-index="${index}" class="marker-bar-${id}" style="${barStyle}">
         ${labelHTML} 
      </div>`;
      } else if (barType === "2") {
        const circleHeight = Math.ceil(width / 3);
        const halfCircleHeight = circleHeight / 2;
        // 代表的是圆柱体
        elStr = `<div class="flatbar-wrapper marker-bar-${id}" style="transform: translate(0, -100%);">
          <div class="sylider-box" data-color="${sideLeftColor}" style="width: ${width}px; height: ${height}px; background: ${sideLeftColor};">
            ${labelHTML} 
            <div class="cube cube1" style="background: ${topColor};height: ${circleHeight}px; top: -${halfCircleHeight}px;" data-color="${topColor}" ></div>
            <div class="cube cube2" style="background: ${topColor};height: ${circleHeight}px; bottom: -${halfCircleHeight}px;" data-color="${topColor}"></div>
          </div>
        </div>`;
      } else if (barType === "3") {
        // 代表的是棱柱
        elStr = `<div class="flatbar-wrapper marker-bar-${id}" style="height: ${height}px;">
        <div class="cube-box" style="margin-bottom: ${width}px;">
          <div class="flatbar-box" style="width: ${width}px; height: ${height}px;">
            ${labelHTML}
            <div class="cube cube1" style="background: ${sideLeftColor};" data-color="${sideLeftColor}"></div>
            <div class="cube cube2" data-color="${sideRightColor}" style="background: ${sideRightColor};transform: translateZ(${width}px);"></div>
            <div class="cube cube3" data-color="${topColor}" style="background: ${topColor};"></div>
          </div>
        </div>
      </div>`;
      }
      let marker = new BMapGL.Marker(new BMapGL.Point(lngLatArr[0], lngLatArr[1]));
      // 隐藏markerIcon
      let markerIcon = marker.getIcon();
      markerIcon.setSize(new BMapGL.Size(0, 0));
      let markerLabel = new BMapGL.Label(elStr, {
        offset: new BMapGL.Size(series.itemStyle.offset[0], series.itemStyle.offset[1]),
      });
      markerLabel.setStyle({
        border: "none",
        padding: 0,
        transform: "translate(-50%,-100%)",
        "background-color": "transparent",
      });
      marker.setLabel(markerLabel);
      let removerStyleFn = (dom) => {
        let index = dom.getAttribute("data-index");
        if (hoverShow) {
          if (barType === "1") {
            // 悬浮柱的颜色
            dom.style.backgroundColor = colorList[index][0];
          } else if (barType === "3" || barType === "2") {
            if (barType === "2") {
              let el = dom.querySelector(".sylider-box");
              let nowColor = el.getAttribute("data-color");
              el.style.backgroundColor = nowColor;
            }
            dom.querySelectorAll(".cube").forEach((el) => {
              let nowColor = el.getAttribute("data-color");
              el.style.backgroundColor = nowColor;
            });
          }
        }
        if (labelShow && hoverLabelShow) {
          let el = dom.querySelector(".marker-label");
          el.style.color = labelColor;
          el.style.fontSize = `${labelFontsize}px`;
          el.style.backgroundColor = labelBgColor;
        }
      };
      markerLabel.on("mouseover", (e) => {
        e.dataItem = item;
        e.showLabelLatLng = e.latLng;
        // 移除所有
        document.querySelectorAll(`.marker-bar-${id}`).forEach((dom) => {
          removerStyleFn(dom);
        });
        this._createTooltipLabel(options, e);
        let dom = e.target.domElement.querySelector(`.marker-bar-${id}`);
        if (hoverShow) {
          if (barType === "1") {
            dom.style.backgroundColor = hoverColor;
          } else if (barType === "2" || barType === "3") {
            if (barType === "2") {
              let el = dom.querySelector(".sylider-box");
              el.style.backgroundColor = utils.setColorOpacity(hoverColor, 0.8);
            }
            dom.querySelectorAll(".cube").forEach((dom) => {
              dom.style.background = hoverColor;
            });
          }
        }
        if (labelShow && hoverLabelShow) {
          let el = dom.querySelector(".marker-label");
          el.style.color = hoverLabelColor;
          el.style.fontSize = `${hoverLabelFontSize}px`;
        }
      });
      markerLabel.on("mouseout", (e) => {
        let dom = e.target.domElement.querySelector(`.marker-bar-${id}`);
        removerStyleFn(dom);
        this._tooltips.hide();
      });
      markerLabel.on("click", (e) => {
        dsf.emit.$emit("GISFlatBarClick", properties, [window]);
      });
      colorList.push([topColor, sideLeftColor, sideRightColor]);
      layer.addMarker(marker);
    });
    const layers = this.instance.layers;
    let _layers = layers.get(id);
    if (_layers) {
      this.removeLayers(_layers);
    }
    if (list.length) {
      let layerArr = [layer];
      layers.set(id, layerArr);
      this._zoomByShowHideLayer([layerArr]);
    }
  }

  /**
   * @description 添加飞行线图层
   * @param {string} id => 图层id 必填
   * @param {string} source 路径 geojson
   * @param {object} extraData 额外数据 选填
   * @param {object} options => 参考 options pulseLink.js
   * @param {object} events => {click:点击事件，hover:hover事件,complete:加载完成事件}
   * @return {{无} }
   */
  addPulseLinkLayer(id, source, extraData = [], options = {}, events = {}) {
    //路径
    if (typeof source === "string") {
      utils.getMapData(source).then((data) => {
        this.addPulseLinkLayer(id, data, extraData, options, events);
      });
      return false;
    }
    options = dsf.mix(true, {}, defaultPulseLink, options);
    //飞行线
    let series = options.pulseLink;
    series.minZoom = series.zooms[0];
    series.maxZoom = series.zooms[1];
    //图层系列名称
    let seriesName = series.seriesName;
    BMapInitSource(source, extraData, seriesName);
    let data = source.features;
    data.forEach((item) => {
      // 生成带高度的贝塞尔曲线坐标集
      var curve = new mapvgl.BezierCurve({
        start: item.geometry.coordinates[0],
        end: item.geometry.coordinates[1],
      });
      item.geometry.coordinates = curve.getPoints(60);
      item.geometry.coordinates = item.geometry.coordinates.map((item) => {
        //为了让抛起来
        item[2] += 3;
        return item;
      });
      item.properties.count = Math.random();
    });
    // 动画图层
    var flyColor = series.itemStyle.headColor;
    // var flyColor = series.itemStyle.headColor?.replaceAll("a","")
    var animateLayer = new mapvgl.LineLayer({
      minZoom: series.minZoom,
      maxZoom: series.maxZoom,
      color: flyColor, // 飞线动画颜色
      blend: "lighter",
      width: 3,
      animation: true,
      duration: 1, // 循环时间2s
      trailLength: 0.8, // 拖尾长度占间隔的0.8
      interval: 0.5, // 粒子长度占线整体长度的0.2
    });

    // 飞行线
    let lineColor = series.itemStyle.lineColors[0];
    var lineLayer = new mapvgl.LineLayer({
      blend: "lighter",
      width: 1,
      color: lineColor, // 飞线颜色
    });

    animateLayer.setData(data);
    this.loca.addLayer(animateLayer);
    lineLayer.setData(data);
    this.loca.addLayer(lineLayer);
    const layers = this.instance.layers;
    let _layers = layers.get(id);
    if (_layers) {
      this.removeLayers(_layers);
    }
    let layerArr = [animateLayer, lineLayer];
    layers.set(id, layerArr);
    this._zoomByShowHideLayer([layerArr]);
  }

  /**
   * @description 添加图标图层
   * @param {string} id 图层id 必填
   * @param {string|object} source geojson
   * @param {object} options => 参考 options point.js
   * @param {object} events => {click:点击事件，hover:hover事件,complete:加载完成事件}
   * @return {无}
   */
  addIconLayer(id, source, extraData = [], options = {}, events = {}) {
    let self = this;
    //路径
    if (typeof source === "string") {
      utils.getMapData(source).then((data) => {
        this.addIconLayer(id, data, extraData, options, events);
      });
      return false;
    }
    options = dsf.mix(true, {}, defaultIcon, options);
    //点图层配置项
    let series = options.icon;
    // 文字options
    let labelOptions = options.label;

    let code = `var formatter = ${JSON.stringify(options.label.name)};
    var content = dsf.dataview.utils.labelStringToFunction(formatter,params,'gis');
    return content;`;

    const labelTextFn = new Function("params", code);

    //图层系列名称
    let seriesName = series.seriesName;
    BMapInitSource(source, extraData, seriesName, {
      layerId: id,
      seriesType: options.seriesType,
    });
    let textOldData = [];
    let renderOrder = 1000;
    let commonParams = {
      options: options,
      events,
    };
    // 加载点位图层
    let iconLayer = this._addLayer({
      ...commonParams,
      type: "icon",
      otherOptions: {
        renderOrder,
        collides: false,
      },
    });
    this.loca.addLayer(iconLayer);
    // 加载文字图层
    let textLayer = null;
    if (options.label.show) {
      textLayer = this._addLayer({
        ...commonParams,
        type: "text",
        otherOptions: {
          drawInMapView3D: true, // 设置文字图层在3D视图中绘制
          renderOrder: renderOrder + 1,
        },
      });
      this.loca.addLayer(textLayer);
    }
    // 加载点位图层数据
    let data = _.cloneDeep(source.features);
    let textData = _.cloneDeep(data);
    let altitude = this.getBaseAltitude({ type: "point" });
    data.forEach((item) => {
      item.properties.seriesName = seriesName;
      item._type = "point";
      item.geometry.coordinates.push(altitude);
    });
    // 设置点位
    iconLayer.setData(data);
    let layerArr = [iconLayer];
    // 设置文字
    if (textLayer) {
      textData.forEach((item) => {
        let nowText = item.properties.name;
        item.properties.seriesName = seriesName;
        item._type = "point_text";
        item.geometry.coordinates.push(altitude);
        if (typeof labelTextFn === "function") {
          nowText = labelTextFn(item);
        }
        item.properties.text = nowText;
      });
      textLayer.setOptions({
        onMousemove(e, f) {
          self._handleUserEvent({
            e,
            f,
            layer: textLayer,
            eventType: "Mousemove",
          });
          self._addTooltips({
            e,
            f,
            options,
            layer: textLayer,
            _type: "point_text",
          });
        },
        onClick(e, f) {
          self._handleUserEvent({
            e,
            f,
            layer: iconLayer,
            eventType: "Click",
          });
          if (e.dataItem && e.dataItem._type === "point_text") {
            let featProperties = e.dataItem.properties;
            dsf.emit.$emit("GISIconClick", featProperties, [window]);
          }
        },
      });
      textOldData = _.cloneDeep(textData);
      textLayer.setData(textData);
      layerArr.push(textLayer);
    }

    // 设置移入点图层
    iconLayer.setOptions({
      onMousemove(e, f) {
        // 增加提示
        self._handleUserEvent({
          e,
          f,
          layer: iconLayer,
          eventType: "Mousemove",
        });
        self._addTooltips({
          e,
          f,
          options,
          layer: iconLayer,
          _type: "point",
        });
        if (e.dataItem && e.dataItem._type === "point") {
          let index = e.dataIndex;
          if (!iconLayer._moveInfo) {
            iconLayer._moveInfo = {
              index,
            };
            if (textLayer) {
              let textData = textLayer.data;
              textData[index].properties.color = textLayer.options.selectedColor;
              textLayer.setOptions({
                fontSize: labelOptions.emphasis.itemStyle.fontSize,
                data: textData,
              });
            }
          } else if (iconLayer._moveInfo && iconLayer._moveInfo.index !== index) {
            if (textLayer) {
              let textData = _.cloneDeep(textOldData);
              textData[index].properties.color = textLayer.options.selectedColor;
              textLayer.setOptions({
                fontSize: labelOptions.emphasis.itemStyle.fontSize,
                data: textData,
              });
            }
          }
        } else {
          if (iconLayer._moveInfo) {
            if (textLayer) {
              textData[iconLayer._moveInfo.index].properties.color = undefined;
              textLayer.setOptions({
                fontSize: labelOptions.itemStyle.fontSize,
                data: _.cloneDeep(textOldData),
              });
            }
            iconLayer._moveInfo = null;
          }
        }
      },
      onClick(e, f) {
        self._handleUserEvent({
          e,
          f,
          layer: iconLayer,
          eventType: "Click",
        });
        if (e.dataItem && e.dataItem._type === "point") {
          let featProperties = e.dataItem.properties;
          dsf.emit.$emit("GISIconClick", featProperties, [window]);
        }
      },
    });
    const layers = this.instance.layers;
    let _layers = layers.get(id);
    if (_layers) {
      this.removeLayers(_layers);
    }
    layers.set(id, layerArr);
    this._zoomByShowHideLayer([layerArr]);
  }

  /**
   * 飞行到某一点
   * @param {Object} options 点击的某一点
   */
  flyToView(options) {
    let { info, zoom = 10, immediately = false, avoid = [60, 60, 60, 60] } = options;
    if (!info.dataItem) {
      return;
    }
    let latLng = info.dataItem.geometry.coordinates;
    this.setMapOptions({
      center: latLng,
      zoom,
    });
  }

  showLayers(layers) {
    this._handleLayerAction(layers, "show");
  }

  hideLayers(layers) {
    this._handleLayerAction(layers, "hide");
  }

  removeLayers(layers) {
    this._handleLayerAction(layers, "remove");
  }

  getMapProperties() {
    let center = this.map.getCenter();
    let zoom = this.map.getZoom();
    let pitch = this.map.getTilt();
    let rotation = this.map.getHeading();
    return { center: [center.lng, center.lat], zoom, pitch, rotation };
  }

  // 销毁地图
  destroy() {
    this.map && this.map.destroy();
  }
}
