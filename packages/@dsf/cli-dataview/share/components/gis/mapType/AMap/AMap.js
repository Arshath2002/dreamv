/*
 * @Description:
 * @Author: shenah
 * @Date: 2023-09-15 11:30:09
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-06-13 18:11:30
 */

import {
  AMapInitSource,
  AMapEventHandler,
  AMapQueryDistrict,
  AMapQueryParticularDistrict,
  AMapTransformFunctionArgs,
  AMapHandlerHoverFunction,
  AMapEmphasisKeys,
  AMapDealLabelHandler,
  AMapDealLineHandler,
  AMapQueryDistrictList,
} from "./AMapHelper";
import defaultMarker from "_dataview/assets/img/gis/default-marker.png";
import utils from "_dataview/output/utils/gis.js";
import point from "../../options/point.js";
import scatter from "../../options/scatter.js";
import polygon from "../../options/polygon.js";
import heatMap from "../../options/heatMap.js";
import pulseLink from "../../options/pulseLink.js";
import flatBar from "../../options/flatBar.js";
import iconOptions from "../../options/icon.js";
import breath from "./assets/breath_red.png";
export default class AMapProxy {
  constructor(instance) {
    window._AMapSecurityConfig = {
      securityJsCode: window.securityJsCode,
    };
    //基础库路径
    this.mapURL = "";
    //可视化库路径
    this.locaURL = "";
    //高德地图的可视化实例
    this.loca = null;
    //地图实例
    this.map = null;
    //地图元素
    this.el = null;
    // 大屏地图示例
    this.instance = instance;
    //收集页面上makers方法
    this.toolTipMakers = [];
  }

  // 初始化api
  initAPIJS() {
    window._AMapSecurityConfig = {
      securityJsCode: window.securityJsCode,
    };
    const proxyUrl = dsf.config.setting_public_amap_proxy_api_url || "https://webapi.amap.com";
    this.mapURL = `${proxyUrl}/maps?v=2.0&key=${window.amapKey}&plugin=AMap.DistrictSearch`;
    this.locaURL = `${proxyUrl}/loca?v=2.0.0&key=${window.amapKey}`;
    return new Promise((resolve, reject) => {
      try {
        if (!window.AMap) {
          utils
            .loadJsSource(this.mapURL)
            .then(() => utils.loadJsSource(this.locaURL))
            .then(() => resolve());
        } else {
          resolve();
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * @description 地图初始化
   * @param {object} el 地图元素
   * @param {object} options => (center：中心点,zoom：放大倍数,pitch：俯角,rotation：旋转角度)
   * @return {无}
   */
  initMap(el, options) {
    Object.assign(options, {
      viewMode: "3D", //默认开启3D视图,
      showLabel: true,
      WebGLParams: {
        preserveDrawingBuffer: true,
      },
    });

    const map = new AMap.Map(el, options);
    this.map = map;
    this.el = el;
    // 这里可能存在内存泄漏 去掉window
    this.loca = new Loca.Container({
      map,
    });
    this.loca.animate.start();
  }

  /**
   * 视野控制在某个图层
   * @param {*} layers
   */
  setFitView(layers) {
    const bounds = layers.filter((it) => Array.isArray(it)).reduce((res, cur) => res.concat(cur), []);
    this.flyToView({ coordinates: bounds });
  }

  /**
   * @description 获取地图基础属性
   * @param {无}
   * @return {object} property center：中心点,zoom：放大倍数,pitch：俯角,rotation：旋转角度
   */
  getMapProperties() {
    let center = this.map.getCenter();
    let zoom = this.map.getZoom();
    let pitch = this.map.getPitch();
    let rotation = this.map.getRotation();
    return { center: [center.lng, center.lat], zoom, pitch, rotation };
  }

  /**
   * @description 设置地图风格
   * @param {string} styleName 风格名称
   * @return {无}
   */
  setMapStyle(styleName) {
    return this.map && this.map.setMapStyle(styleName);
  }

  /**
   * @description 设置地图中心
   * @param {array} center
   * @return {无}
   */
  setCenter(center) {
    return this.map.setCenter(center);
  }

  /**
   * @description 设置地图缩放级别
   * @param {string} zoom
   * @return {无}
   */
  setZoom(zoom) {
    return this.map.setZoom(zoom);
  }

  /**
   * @description 设置地图俯角
   * @param {string} pitch
   * @return {无}
   */
  setPitch(pitch) {
    return this.map.setPitch(pitch);
  }

  /**
   * @description 设置地图旋转角
   * @param {string} rotation
   * @return {无}
   */
  setRotation(rotation) {
    return this.map.setRotation(rotation);
  }

  /**
   * @description 设置中心城市
   * @param {object} city 对象 center,level
   * @param {number} zoom 缩放层级
   * @return {无}
   */
  setCity(city, zoom) {
    if (dsf.isObject(city)) {
      let level = city.level;
      let center = city.center;
      if (!zoom) {
        switch (level) {
          case "province":
            zoom = 7;
            break;
          case "city":
            zoom = 8;
            break;
          case "district":
            zoom = 9;
            break;
        }
      }
      return this.map.setZoomAndCenter(zoom, center); //同时设置地图层级与中心点
    } else {
      return this.map.setCity(city);
    }
  }

  /**
   * @description 设置地图要素
   * @param {array} features 要素数组
   * @return {无}
   */
  setFeatures(features) {
    return this.map.setFeatures(features);
  }

  /**
   * @description 地图resize
   * @param {无}
   * @return {无}
   */
  resize() {
    //resize 高德必须在元素可见下调用，否则报错
    if (!$(this.el).is(":hidden")) {
      this.map && this.map.resize();
    }
    return this.map;
  }

  /**
   * @description 添加Tooltip
   * @param {object} options
   */
  addTooltipMaker(options) {
    let { content, formatter, position: anchor, itemStyle: tooltipStyle, ...remain } = options;

    let style = utils.transformStyle(tooltipStyle);

    let _wrapper = function (data, content) {
      let _content = "";
      if (typeof formatter === "function") {
        _content = formatter(data);
      } else {
        _content = content;
      }
      return _content ? `<div style="${style}">${_content}</div>` : "";
    };
    //构造maker对象
    const maker = new AMap.Marker({
      ...remain,
      anchor: anchor,
      position: [0, 0, 0],
      zIndex: 999999999,
    });
    maker.setMap(this.map);
    maker.hide();

    let _show = function (position, data, xyObj) {
      if (xyObj) {
        let pixel = new AMap.Pixel(xyObj.x, xyObj.y);
        maker.setOffset(pixel);
        maker.setAnchor("bottom-center");
      }
      maker.setPosition(position);

      let _content = _wrapper(data, content);
      if (_content) {
        maker.setContent(_content);
        maker.show();
      }
    };
    let _hide = function () {
      maker.hide();
    };
    const toolTipMaker = { _hide, _show };
    this.toolTipMakers.push(toolTipMaker);
    return toolTipMaker;
  }

  /**
   * @description 添加label图层
   * @param {string|object} source | geo  geojson point
   * @param {object} events => {click:点击事件，hover:hover事件,complete:加载完成事件}
   */
  addLabelLayer(id, source, extraData = [], options = {}, events = {}) {
    //路径
    if (typeof source === "string") {
      utils.getMapData(source).then((data) => {
        this.addLabelLayer(id, data, extraData, options, events);
      });
      return false;
    }
    let { config, itemStyle, emphasis: EItemStyle } = AMapDealLabelHandler(options);

    //图层系列名称
    let seriesName = options.label.seriesName;
    AMapInitSource(source, extraData, seriesName);

    const sourceData = {
      data: source,
    };

    const geo = new Loca.GeoJSONSource(sourceData);

    let click, hover, complete;
    if (events) {
      click = events.click;
      hover = events.hover;
      complete = events.complete;
    }
    const labelsLayer = new Loca.LabelsLayer(config);
    labelsLayer.setSource(geo, itemStyle);

    this.loca.add(labelsLayer);

    labelsLayer.on("complete", (e) => {
      if (typeof complete === "function") {
        complete(e, null);
      }
      let labelMarkers = labelsLayer.getLabelsLayer().getAllOverlays();
      for (let marker of labelMarkers) {
        marker.on("mouseover", (e) => {
          const position = e.data.data && e.data.data.position;
          if (position && typeof hover === "function") {
            hover(marker, e.data.data, labelsLayer);
          }
        });
        marker.on("click", (e) => {
          const position = e.data.data && e.data.data.position;
          if (position && typeof click === "function") {
            click(marker, e.data.data, labelsLayer);
          }
        });
      }
    });

    const layers = this.instance.layers;
    let _layers = layers.get(id);
    if (_layers) {
      this.removeLayers(_layers);
    }
    layers.set(id, [labelsLayer]);
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
    //路径
    if (typeof source === "string") {
      utils.getMapData(source).then((data) => {
        this.addPointLayer(id, data, extraData, options, events);
      });
      return false;
    }
    options = dsf.mix(true, {}, point, options);
    //点图层配置项
    let series = options.point;

    //图层系列名称
    let seriesName = series.seriesName;
    AMapInitSource(source, extraData, seriesName, {
      layerId: id,
      seriesType: options.seriesType,
    });

    const sourceData = {
      data: source,
    };
    const geo = new Loca.GeoJSONSource(sourceData);

    //构造提示框图层
    let tooltip = options.tooltip;
    let TooltipMaker = null;
    //构造提示框对象
    if (tooltip.show) {
      TooltipMaker = this.addTooltipMaker(tooltip);
    }

    let { itemStyle, emphasis, ...config } = series;

    //做字段转换和字段函数方法替换
    Object.keys(config).forEach((key) => {
      AMapTransformFunctionArgs(key, config, new Map([["show", "visible"]]));
    });
    Object.keys(itemStyle).forEach((key) => {
      AMapTransformFunctionArgs(key, itemStyle, new Map([["size", "radius"]]));
    });
    Object.keys(emphasis.itemStyle).forEach((key) => {
      AMapTransformFunctionArgs(key, emphasis.itemStyle);
    });
    //添加点图层
    let layer = new Loca.PointLayer(series);
    layer.setSource(geo, itemStyle);
    this.loca.add(layer);

    //标签图层配置项
    let label = options.label;
    //标签悬浮样式
    let ELabelItemStyle = null;
    let labelsLayer = null;
    let ALabel = null;

    if (label.show) {
      let { config, itemStyle, emphasis } = AMapDealLabelHandler(label);
      let { extraData, ...remain } = itemStyle;
      ELabelItemStyle = emphasis;
      ALabel = remain;
      labelsLayer = new Loca.LabelsLayer(config);
      labelsLayer.setSource(geo, itemStyle);

      this.loca.add(labelsLayer);

      labelsLayer.on("complete", (e) => {
        let labelMarkers = labelsLayer.getLabelsLayer().getAllOverlays();
        for (let marker of labelMarkers) {
          marker.on("mouseover", (e) => {
            const position = e.data.data && e.data.data.position;
            if (position) {
              let feature = marker.getExtData();
              try {
                let feat = geo.dataset[0].features.points.find((_feature) => feature.coordinates.toString() === _feature.coordinates.toString());
                events.hover && events.hover(feat);
              } catch (error) {
                console.log(error);
              }
              //存在提示框
              if (TooltipMaker) {
                TooltipMaker._show(position, feature);
              }
            }
          });
          marker.on("click", (e) => {
            const position = e.data.data && e.data.data.position;
            if (position) {
              let feature = marker.getExtData();
              try {
                let feat = geo.dataset[0].features.points.find((_feature) => feature.coordinates.toString() === _feature.coordinates.toString());
                dsf.emit.$emit("GISPointClick", feat.properties, [window]);
                if (typeof events.click === "function") {
                  click(marker, feat.properties, labelsLayer);
                }
              } catch (error) {
                console.log(error);
              }
            }
          });
        }
      });
    }
    //点悬浮样式
    if (emphasis.show) {
      let EItemStyle = emphasis.itemStyle;
      AMapHandlerHoverFunction.call(this, layer, events, EItemStyle, itemStyle, AMapEmphasisKeys.point);
    }
    //标签悬浮样式
    if (ELabelItemStyle) {
      let ELabel = ELabelItemStyle ? dsf.mix(true, {}, ALabel, { ...ELabelItemStyle }) : dsf.mix(true, {}, ALabel);
      AMapHandlerHoverFunction.call(this, labelsLayer, events, ELabel, ALabel, AMapEmphasisKeys.label);
    }

    //事件处理
    AMapEventHandler({
      map: this.map,
      events,
      layer,
      TooltipMaker,
    });

    const layers = this.instance.layers;
    let _layers = layers.get(id);
    if (_layers) {
      this.removeLayers(_layers);
    }
    layers.set(id, [layer, labelsLayer]);
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
    options = dsf.mix(true, {}, scatter, options);
    //贴地点图层配置项
    let series = options.scatter;
    //图层系列名称
    let seriesName = series.seriesName;
    AMapInitSource(source, extraData, seriesName, {
      layerId: id,
      seriesType: options.seriesType,
    });

    const sourceData = {
      data: source,
    };
    const geo = new Loca.GeoJSONSource(sourceData);

    //构造提示框图层
    let tooltip = options.tooltip;
    let TooltipMaker = null;
    //构造提示框对象
    if (tooltip.show) {
      TooltipMaker = this.addTooltipMaker(tooltip);
    }

    let { itemStyle, emphasis, ...config } = series;

    //做字段转换和字段函数方法替换
    Object.keys(config).forEach((key) => {
      AMapTransformFunctionArgs(key, config, new Map([["show", "visible"]]));
    });
    Object.keys(itemStyle).forEach((key) => {
      AMapTransformFunctionArgs(key, itemStyle);
    });
    Object.keys(emphasis.itemStyle).forEach((key) => {
      AMapTransformFunctionArgs(key, emphasis.itemStyle);
    });
    //添加贴地点图层
    let layer = new Loca.ScatterLayer(series);
    if (itemStyle.useDefaultTexture) {
      if (itemStyle.texture == "default"||!itemStyle.texture) {
        itemStyle = dsf.mix(true, {}, itemStyle, { texture: breath });
      }
    } else {
      itemStyle = dsf.mix(true, {}, itemStyle);
      Reflect.deleteProperty(itemStyle, "texture");
    }

    layer.setSource(geo, itemStyle);
    this.loca.add(layer);

    //标签图层配置项
    let label = options.label;
    //标签悬浮样式
    let ELabelItemStyle = null;
    let labelsLayer = null;
    let ALabel = null;
    //添加label图层
    if (label.show) {
      let { config, itemStyle, emphasis } = AMapDealLabelHandler(label);

      let { extraData, ...remain } = itemStyle;
      ELabelItemStyle = emphasis;
      ALabel = remain;
      labelsLayer = new Loca.LabelsLayer(config);
      labelsLayer.setSource(geo, itemStyle);
      this.loca.add(labelsLayer);

      labelsLayer.on("complete", (e) => {
        let labelMarkers = labelsLayer.getLabelsLayer().getAllOverlays();
        for (let marker of labelMarkers) {
          marker.on("mouseover", (e) => {
            const position = e.data.data && e.data.data.position;
            if (position) {
              let feature = marker.getExtData();
              try {
                let feat = geo.dataset[0].features.points.find((_feature) => feature.coordinates.toString() === _feature.coordinates.toString());
                events.hover && events.hover(feat);
              } catch (error) {
                console.log(error);
              }
              //存在提示框
              if (TooltipMaker) {
                TooltipMaker._show(position, feature);
              }
            }
          });
          marker.on("click", (e) => {
            const position = e.data.data && e.data.data.position;
            if (position) {
              let feature = marker.getExtData();
              try {
                let feat = geo.dataset[0].features.points.find((_feature) => feature.coordinates.toString() === _feature.coordinates.toString());
                dsf.emit.$emit("GISScatterClick", feat.properties, [window]);
                if (typeof events.click === "function") {
                  click(marker, feat.properties, labelsLayer);
                }
              } catch (error) {
                console.log(error);
              }
            }
          });
        }
      });
    }

    //贴地点悬浮样式
    if (emphasis.show) {
      let EItemStyle = emphasis.itemStyle;
      AMapHandlerHoverFunction.call(this, layer, events, EItemStyle, itemStyle, AMapEmphasisKeys.scatter);
    }
    //标签悬浮样式
    if (ELabelItemStyle) {
      let ELabel = ELabelItemStyle ? dsf.mix(true, {}, ALabel, { ...ELabelItemStyle }) : dsf.mix(true, {}, ALabel);
      AMapHandlerHoverFunction.call(this, labelsLayer, events, ELabel, ALabel, AMapEmphasisKeys.label);
    }
    //事件处理
    AMapEventHandler({
      map: this.map,
      events,
      layer,
      TooltipMaker,
    });

    const layers = this.instance.layers;
    let _layers = layers.get(id);
    if (_layers) {
      this.removeLayers(_layers);
    }
    layers.set(id, [layer, labelsLayer]);
  }

  /**
   * @description 添加线图层
   * @param {string} id 图层id 必填
   * @param {object} source geojson 必填
   * @param {object} extraData 额外数据 选填
   * @param {object} options 参考 options line.js
   * @param {object} events {click:点击事件，hover:hover事件,complete:加载完成事件}
   * @return {object} layerIds
   */
  addLineLayer(id, source, extraData = [], options = {}, events = {}) {
    //字符串路径
    if (typeof source === "string") {
      utils.getMapData(source).then((data) => {
        this.addLineLayer(id, data, extraData, options, events);
      });
      return false;
    }
    //图层系列名称
    let seriesName = options.line.seriesName;
    AMapInitSource(source, extraData, seriesName);

    let { config, itemStyle, emphasis } = AMapDealLineHandler(options.line);

    const layer = new Loca.LineLayer(config);

    layer.setSource(new Loca.GeoJSONSource({ data: source }), itemStyle);
    this.loca.add(layer);

    const layers = this.instance.layers;
    let _layers = layers.get(id);
    if (_layers) {
      this.removeLayers(_layers);
    }
    layers.set(id, [layer]);
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
  addPolygonLayer(id, source, extraData = [], options = {}, events = {}, boundaries) {
    //字符串路径
    if (typeof source === "string") {
      utils.getMapData(source).then((data) => {
        this.addPolygonLayer(id, data, extraData, options, events);
      });
      return false;
    }
    options = dsf.mix(true, {}, polygon, options);
    //面图层
    let series = options.polygon;
    let range = series.itemStyle.range;

    //存在色阶
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
      series.itemStyle.sideTopColor = function (f) {
        if (f.properties.color) {
          return f.properties.color;
        }
        return sc;
      };
      series.itemStyle.sideBottomColor = function (f) {
        if (f.properties.color) {
          return f.properties.color;
        }
        return sc;
      };
    }

    //图层系列名称
    let seriesName = series.seriesName;

    AMapInitSource(source, extraData, seriesName, {
      seriesType: options.seriesType,
      layerId: options.polygon.id,
    });

    const sourceData = {
      data: source,
    };
    const geo = new Loca.GeoJSONSource(sourceData);

    //构造提示框图层
    let tooltip = options.tooltip;
    let TooltipMaker = null;
    //构造提示框对象
    if (tooltip.show) {
      TooltipMaker = this.addTooltipMaker(tooltip);
    }

    //面图层标签
    let label = options.label;
    label.zooms = series.zooms;
    //面图层的轮廓
    let line = options.line;
    line.zooms = series.zooms;

    //轮廓高度继承面图层的高度(暂时忽略海拔影响)
    line.itemStyle.altitude = series.itemStyle.height;

    if (series.emphasis.itemStyle.height != undefined) {
      line.emphasis.itemStyle.altitude = series.emphasis.itemStyle.height + 100;
    }

    let { ALabel, emphasis: labelEItemStyle } = AMapDealLabelHandler(label);

    label = ALabel;

    //做字段转换和字段函数方法替换
    Object.keys(series).forEach((key) => {
      AMapTransformFunctionArgs(key, series, new Map([["show", "visible"]]));
    });

    let itemStyle = series.itemStyle;

    let emphasis = series.emphasis;

    let mask = itemStyle.mask;

    Object.keys(itemStyle).forEach((key) => {
      AMapTransformFunctionArgs(key, itemStyle);
    });
    Object.keys(itemStyle.mask).forEach((key) => {
      AMapTransformFunctionArgs(
        key,
        itemStyle.mask,
        new Map([
          ["color", "fillColor"],
          ["opacity", "fillOpacity"],
        ])
      );
    });
    Object.keys(emphasis.itemStyle).forEach((key) => {
      AMapTransformFunctionArgs(key, emphasis.itemStyle);
    });
    //合并面图层设置和面图层标签配置项
    itemStyle = dsf.mix(true, itemStyle, { label });
    //生成面图层
    let layer = new Loca.PolygonLayer(series);

    layer.setSource(geo, itemStyle);
    this.loca.add(layer);

    //轮廓线图层设置
    let lineLayer = null;
    //默认轮廓线样式
    let lineStyle = null;
    //悬浮轮廓线样式
    let lineEmphasis = null;

    let maskPolygonLayer = null;
    //存在遮罩层和轮廓边框
    if (mask.show && boundaries) {
      const outer = [new AMap.LngLat(-360, 90, true), new AMap.LngLat(-360, -90, true), new AMap.LngLat(360, -90, true), new AMap.LngLat(360, 90, true)];
      const path = [outer];
      path.push.apply(path, boundaries);
      let { fillColor, fillOpacity, strokeColor, strokeWeight = 0 } = mask;
      maskPolygonLayer = new AMap.Polygon({
        pathL: path,
        fillColor,
        strokeColor,
        strokeWeight,
        fillOpacity,
      });
      maskPolygonLayer.setPath(path);

      maskPolygonLayer.on("mousemove", () => {
        layer.setStyle(itemStyle);
        this.toolTipMakers.forEach((it) => {
          it?._hide();
        });
      });
      this.map.add(maskPolygonLayer);
    }

    //生成轮廓线图层
    if (sourceData.data && line.show) {
      const lineData = utils.getPolygonToLine(dsf.mix(true, {}, sourceData.data));
      let { config, itemStyle, emphasis } = AMapDealLineHandler(line);
      lineLayer = new Loca.LineLayer(config);

      lineLayer.setSource(new Loca.GeoJSONSource({ data: lineData }), itemStyle);
      this.loca.add(lineLayer);
      lineStyle = itemStyle;
      lineEmphasis = emphasis;
    }

    //悬浮图层样式
    let EItemStyle = emphasis && emphasis.itemStyle;
    //悬浮轮廓线样式
    let ELineStyle = lineEmphasis && lineEmphasis.itemStyle;

    //面图层悬浮样式
    if (emphasis && emphasis.show) {
      //获取悬浮标签样式
      let ELabel = labelEItemStyle ? dsf.mix(true, label, { ...labelEItemStyle }) : dsf.mix(true, {}, label);
      // 合并图层和标签的悬浮样式
      EItemStyle = dsf.mix(true, {}, EItemStyle, { label: ELabel });

      AMapHandlerHoverFunction.call(this, layer, events, EItemStyle, itemStyle, AMapEmphasisKeys.polygon);
    }
    //线图层悬浮样式
    if (lineEmphasis && lineEmphasis.show) {
      //fix 线图层相同海拔不生效bug 强制-1
      let _lineStyle = dsf.mix(true, {}, lineStyle);
      if (typeof _lineStyle.altitude === "number") {
        _lineStyle.altitude -= 1;
      }
      AMapHandlerHoverFunction.call(this, lineLayer, events, ELineStyle, _lineStyle, AMapEmphasisKeys.line);
    }

    AMapEventHandler({
      map: this.map,
      events,
      layer,
      layers: [layer, lineLayer, maskPolygonLayer],
      TooltipMaker,
    });

    const layers = this.instance.layers;
    let _layers = layers.get(id);
    if (_layers) {
      this.removeLayers(_layers);
    }
    layers.set(id, [layer, lineLayer, maskPolygonLayer]);
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
    //字符串路径
    if (typeof source === "string") {
      utils.getMapData(source).then((data) => {
        this.addHeatMapLayerLayer(id, data, extraData, options, events);
      });
      return false;
    }
    options = dsf.mix(true, {}, heatMap, options);
    //热力图层配置项
    let series = options.heatMap;

    //图层系列名称
    let seriesName = series.seriesName;
    AMapInitSource(source, extraData, seriesName, {
      layerId: id,
      seriesType: options.seriesType,
    });

    const sourceData = {
      data: source,
    };
    const geo = new Loca.GeoJSONSource(sourceData);

    //构造提示框图层
    let tooltip = options.tooltip;
    let TooltipMaker = null;
    //构造提示框对象
    if (tooltip.show) {
      TooltipMaker = this.addTooltipMaker(tooltip);
    }

    //热力图层无label和悬浮样式
    let { itemStyle, ...config } = series;
    //做字段转换和字段函数方法替换
    Object.keys(config).forEach((key) => {
      AMapTransformFunctionArgs(key, config, new Map([["show", "visible"]]));
    });
    Object.keys(itemStyle).forEach((key) => {
      AMapTransformFunctionArgs(key, itemStyle, new Map([["size", "radius"]]));
    });

    //添加热力图层
    let layer = new Loca.HeatMapLayer(config);

    layer.setSource(geo, itemStyle);

    this.loca.add(layer);

    //事件处理
    AMapEventHandler({
      map: this.map,
      events,
      layer,
      TooltipMaker,
      layerAttr: {
        layerId: id,
        seriesType: options.seriesType,
      },
    });

    const layers = this.instance.layers;
    let _layers = layers.get(id);
    if (_layers) {
      this.removeLayers(_layers);
    }
    layers.set(id, [layer]);
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
    options = dsf.mix(true, {}, flatBar, options, useOptions);
    // 平面图层配置
    let series = options.flatBar;
    let barType = series.barType;
    let labelOptions = options.label;
    //图层系列名称
    let seriesName = series.seriesName;
    AMapInitSource(source, extraData, seriesName, {
      layerId: id,
      seriesType: options.seriesType,
    });
    const sourceData = {
      data: source,
    };
    const geo = new Loca.GeoJSONSource(sourceData);
    //构造提示框图层
    let tooltip = options.tooltip;
    let TooltipMaker = null;
    //构造提示框对象
    if (tooltip.show) {
      TooltipMaker = this.addTooltipMaker(tooltip);
    }
    // 创建marker图层
    let layer = new AMap.OverlayGroup();
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
        marginTop: "-100%",
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
    let list = geo.options?.data?.features || [];
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

      let labelStyle = `
      margin-top:${labelPositionMarginTop};
      position: absolute;
      top:${labelPositionTop};
      margin-left: ${labelMarginLeft};
      transform:${labelTransform};
      width: 100px;text-align: center;
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
        elStr = `<div data-index="${index}" class="flatbar-wrapper marker-bar-${id}" style="transform: translate(0, calc(-100% - ${width / 2}px));">
          <div class="sylider-box" data-color="${sideLeftColor}" style="width: ${width}px; height: ${height}px; background: ${sideLeftColor};">
            ${labelHTML} 
            <div class="cube cube1" style="background: ${topColor};height: ${circleHeight}px; top: -${halfCircleHeight}px;" data-color="${topColor}"></div>
            <div class="cube cube2" style="background: ${topColor};height: ${circleHeight}px; bottom: -${halfCircleHeight}px;" data-color="${topColor}"></div>
          </div>
        </div>`;
      } else if (barType === "3") {
        // 代表的是棱柱
        elStr = `<div data-index="${index}" class="flatbar-wrapper marker-bar-${id}" style="height: ${height}px;">
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

      let marker = new AMap.Marker({
        content: elStr,
        position: lngLatArr,
        anchor: "bottom-center",
        zIndex: series.zIndex,
        offset: series.itemStyle.offset,
        zooms: series.zooms,
      });
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
      marker.on(
        "mouseover",
        _.debounce((e) => {
          // 移除所有
          document.querySelectorAll(`.marker-bar-${id}`).forEach((dom) => {
            removerStyleFn(dom);
          });

          let point = [e.lnglat.lng, e.lnglat.lat];
          let xyObj = {
            x: 0,
            y: -30,
          };
          let dom = e.target.dom.querySelector(`.marker-bar-${id}`);
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
          if (TooltipMaker) {
            TooltipMaker._show(point, item, xyObj);
          }
        }, 200)
      );
      marker.on("mouseout", (e) => {
        setTimeout(() => {
          let dom = e.target.dom.querySelector(`.marker-bar-${id}`);
          removerStyleFn(dom);
          if (TooltipMaker) {
            TooltipMaker._hide();
          }
        }, 200);
      });
      marker.on("click", (e) => {
        let dom = e.target.dom.querySelector(`.marker-bar-${id}`);
        if (dom) {
          let index = dom.getAttribute("data-index");
          let data = list[index];
          let properties = data?.properties || {};
          dsf.emit.$emit("GISFlatBarClick", properties, [window]);
          if (typeof events.click === "function") {
            click(marker, e.data.data, labelsLayer);
          }
        }
      });
      colorList.push([topColor, sideLeftColor, sideRightColor]);
      layer.addOverlay(marker);
    });
    const layers = this.instance.layers;
    let _layers = layers.get(id);
    if (_layers) {
      this.removeLayers(_layers);
    }
    if (list.length) {
      this.map.add(layer);
      // 添加方法
      layer.remove = () => {
        this.map.remove(layer);
      };
      layers.set(id, [layer]);
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
    options = dsf.mix(true, {}, pulseLink, options);
    //飞行线图层
    let series = options.pulseLink;

    //图层系列名称
    let seriesName = series.seriesName;
    AMapInitSource(source, extraData, seriesName, {
      layerId: id,
      seriesType: options.seriesType,
    });

    const sourceData = {
      data: source,
    };

    const geo = new Loca.GeoJSONSource(sourceData);

    //构造提示框图层
    let tooltip = options.tooltip;
    let TooltipMaker = null;
    //构造提示框对象
    if (tooltip.show) {
      TooltipMaker = this.addTooltipMaker(tooltip);
    }

    //飞行线图层无label和悬浮样式
    let { itemStyle, ...config } = series;
    //做字段转换和字段函数方法替换
    Object.keys(config).forEach((key) => {
      AMapTransformFunctionArgs(key, config, new Map([["show", "visible"]]));
    });
    Object.keys(itemStyle).forEach((key) => {
      AMapTransformFunctionArgs(key, itemStyle);
    });
    //添加图层
    let layer = new Loca.PulseLinkLayer(config);

    layer.setSource(geo, itemStyle);

    this.loca.add(layer);

    //事件处理
    AMapEventHandler({
      map: this.map,
      events,
      layer,
      TooltipMaker,
    });

    const layers = this.instance.layers;
    let _layers = layers.get(id);
    if (_layers) {
      this.removeLayers(_layers);
    }
    layers.set(id, [layer]);
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
    //路径
    if (typeof source === "string") {
      utils.getMapData(source).then((data) => {
        this.addIconLayer(id, data, extraData, options, events);
      });
      return false;
    }
    options = dsf.mix(true, {}, iconOptions, options);
    //点图层配置项
    let series = options.icon;

    //图层系列名称
    let seriesName = series.seriesName;
    AMapInitSource(source, extraData, seriesName, {
      layerId: id,
      seriesType: options.seriesType,
    });

    const sourceData = {
      data: source,
    };

    const geo = new Loca.GeoJSONSource(sourceData);

    //构造提示框图层
    let tooltip = options.tooltip;
    let TooltipMaker = null;
    //构造提示框对象
    if (tooltip.show) {
      TooltipMaker = this.addTooltipMaker(tooltip);
    }

    let { itemStyle, emphasis, ...config } = series;

    //做字段转换和字段函数方法替换
    Object.keys(config).forEach((key) => {
      AMapTransformFunctionArgs(key, config, new Map([["show", "visible"]]));
    });
    Object.keys(itemStyle).forEach((key) => {
      AMapTransformFunctionArgs(key, itemStyle, new Map([["size", "radius"]]));
    });
    Object.keys(emphasis.itemStyle).forEach((key) => {
      AMapTransformFunctionArgs(key, emphasis.itemStyle);
    });
    //添加图标图层
    let layer = new Loca.IconLayer(series);
    if (!itemStyle.icon || itemStyle.icon === "default") {
      itemStyle = dsf.mix(true, {}, itemStyle, {
        icon: defaultMarker,
      });
    }
    layer.setSource(geo, itemStyle);
    this.loca.add(layer);

    //标签图层配置项
    let label = options.label;
    //标签悬浮样式
    let ELabelItemStyle = null;
    let labelsLayer = null;
    let ALabel = null;

    if (label.show) {
      let { config, itemStyle, emphasis } = AMapDealLabelHandler(label);

      let { extraData, ...remain } = itemStyle;
      ELabelItemStyle = emphasis;
      ALabel = remain;
      labelsLayer = new Loca.LabelsLayer(config);
      labelsLayer.setSource(geo, itemStyle);

      this.loca.add(labelsLayer);

      labelsLayer.on("complete", (e) => {
        let labelMarkers = labelsLayer.getLabelsLayer().getAllOverlays();
        for (let marker of labelMarkers) {
          marker.on("mouseover", (e) => {
            const position = e.data.data && e.data.data.position;
            if (position) {
              let feature = marker.getExtData();
              try {
                let feat = geo.dataset[0].features.points.find((_feature) => feature.coordinates.toString() === _feature.coordinates.toString());
                events.hover && events.hover(feat);
              } catch (error) {
                console.log(error);
              }
              //存在提示框
              if (TooltipMaker) {
                TooltipMaker._show(position, feature);
              }
            }
          });
          marker.on("click", (e) => {
            const position = e.data.data && e.data.data.position;
            if (position) {
              let feature = marker.getExtData();
              try {
                let feat = geo.dataset[0].features.points.find((_feature) => feature.coordinates.toString() === _feature.coordinates.toString());
                dsf.emit.$emit("GISIconClick", feat.properties, [window]);
                if (typeof events.click === "function") {
                  click(marker, feat.properties, labelsLayer);
                }
              } catch (error) {
                console.log(error);
              }
            }
          });
        }
      });
    }
    //点悬浮样式
    if (emphasis.show) {
      let EItemStyle = emphasis.itemStyle;
      AMapHandlerHoverFunction.call(this, layer, events, EItemStyle, itemStyle, AMapEmphasisKeys.point);
    }
    //标签悬浮样式
    if (ELabelItemStyle) {
      let ELabel = ELabelItemStyle ? dsf.mix(true, {}, ALabel, { ...ELabelItemStyle }) : dsf.mix(true, {}, ALabel);
      AMapHandlerHoverFunction.call(this, labelsLayer, events, ELabel, ALabel, AMapEmphasisKeys.label);
    }

    //事件处理
    AMapEventHandler({
      map: this.map,
      events,
      layer,
      TooltipMaker,
    });
    const layers = this.instance.layers;
    let _layers = layers.get(id);
    if (_layers) {
      this.removeLayers(_layers);
    }
    let bounds = [];
    try {
      bounds = source.features.map((it) => it.geometry.coordinates);
    } catch (error) {
      console.warn(`error-${error}`);
    }
    if (options.fitView && bounds.length) {
      this.flyToView({ coordinates: bounds });
    }
    layers.set(id, [layer, labelsLayer, bounds]);
  }

  /**
   * @description 飞行到某个点位
   * @param {Array[Array]} coordinates => 点位坐标支持多个点位[lng,lat],[[lng,lat]]
   * @param {Array[Number]} avoid => [60,60,60,60] 四周边距
   * @param {Boolean} immediately =>true 是否需要动画
   * @param {Number} zoom => 10 缩放级别
   * @return {object} map 实例
   */
  flyToView(options) {
    let { coordinates, zoom = 10, immediately = false, avoid = [60, 60, 60, 60] } = options;
    //行政区域编码
    if (typeof coordinates === "string") {
      AMapQueryDistrict(coordinates, true).then((properties) => {
        options.coordinates = properties.center;
        this.flyToView(options);
      });
      return false;
    }

    if (!Array.isArray(coordinates) || !coordinates.length) return false;
    let map = this.map;
    let isMulti = Array.isArray(coordinates[0]);
    let makers = [];
    if (isMulti) {
      coordinates.forEach((coordinate) => {
        let marker = new AMap.Marker({
          map,
          position: coordinate,
          visible: false,
        });
        makers.push(marker);
      });
    } else {
      makers.push(
        new AMap.Marker({
          map,
          position: coordinates,
          visible: false,
        })
      );
    }

    map.setFitView(
      makers, // 覆盖物数组
      immediately, // 动画过渡到制定位置
      avoid, // 周围边距，上、下、左、右
      zoom // zoom 级别
    );
    makers.forEach((t) => t.remove());
  }

  /**
   * @description 显示图层
   * @param {object} layers
   */
  showLayers(layers) {
    layers = layers.filter((it) => !Array.isArray(it));
    layers.forEach((layer) => layer && layer.show());
  }

  /**
   * @description 隐藏图层
   * @param {object} layers
   */
  hideLayers(layers) {
    layers = layers.filter((it) => !Array.isArray(it));
    layers.forEach((layer) => layer && layer.hide());
  }

  /**
   * @description 移除图层
   * @param {object} layers
   */
  removeLayers(layers) {
    layers = layers.filter((it) => !Array.isArray(it));
    layers.forEach((layer) => layer && layer.remove());
  }

  /**
   * @description 查询行政区域
   * @param {string} adcode 行政区域编码
   * @param {string} level 查询区域等级
   * @return {promise} geojson
   */
  queryParticularDistrictByCode(adcode, level = "district", tolerance = 0.005) {
    return AMapQueryParticularDistrict(adcode, level).then((res) => {
      res = _.flattenDeep(res);
      let features = [];
      res.forEach((it, index) => {
        if (it) {
          let { boundaries, ...properties } = it;
          let coordinates = boundaries.map((boundary) => [boundary.map((item) => [item.lng, item.lat])]);
          let feature = utils.multiPolygonFromPoint(coordinates, properties);
          //geojson 抽稀
          let simplified = utils.simplify(feature, {
            tolerance,
            highQuality: false,
          });

          features.push(simplified);
        }
      });
      return {
        geo: utils.featureCollection(features),
      };
    });
  }

  /**
   * @description 查询行政区域
   * @param {string} adcode 行政区域编码
   * @return {promise} geojson
   */
  queryDistrictByCode(adcode, tolerance = 0.005) {
    return AMapQueryDistrict(adcode).then((res) => {
      res = Array.isArray(res) ? res : [res];
      let features = [];
      //区域轮廓
      let _boundaries = [];
      res.forEach((it, index) => {
        if (it) {
          let { boundaries, parent, ...properties } = it;
          _boundaries = parent;

          let coordinates = boundaries.map((boundary) => [boundary.map((item) => [item.lng, item.lat])]);
          let feature = utils.multiPolygonFromPoint(coordinates, properties);
          //geojson 抽稀
          let simplified = utils.simplify(feature, {
            tolerance,
            highQuality: false,
          });

          features.push(simplified);
        }
      });
      return {
        geo: utils.featureCollection(features),
        boundaries: _boundaries,
      };
    });
  }

  /**
   * @description 查询行政下级区域列表
   * @param {string} adcode 行政区域编码 必填
   * @param {number} deep 深度 选填
   * @return {promise} list
   */
  queryDistrictListByCode(adcode, deep) {
    return AMapQueryDistrictList(adcode, deep);
  }

  /**
   * @description 查询行政点位
   * @param {string} adcode 行政区域编码
   */
  queryPointByCode(adcode) {
    return AMapQueryDistrict(adcode, true).then((res) => {
      let point = it.center;
      let { boundaries, ...properties } = it;
      return { point, properties };
    });
  }

  /**
   * @description 查询多个点位
   * @param {string} data 点位数据
   */
  queryMultiPointsByCode(data) {
    let promise = [];
    data.forEach((it) => {
      if (typeof it === "string") {
        promise.push(AMapQueryDistrict(it, true));
      } else if (dsf.isObject(it)) {
        if (it.adcode) {
          promise.push(AMapQueryDistrict(it.adcode, true, it));
        }
      }
    });
    return Promise.all(promise).then((res) => {
      let points = [];
      res.forEach((it) => {
        if (it) {
          let point = it.center;
          let { boundaries, ...properties } = it;
          points.push({ point, properties });
        }
      });
      return points;
    });
  }

  /**
   * @description 获取地图类型
   * @param {string}
   */
  getMapType() {
    return "AMap";
  }
  destroy() {
    this.map && this.map.destroy();
  }
}
