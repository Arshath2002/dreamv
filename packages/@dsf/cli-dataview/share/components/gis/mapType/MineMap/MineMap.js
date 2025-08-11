import utils from "_dataview/output/utils/gis.js";
import point from "../../options/point.js";
import scatter from "../../options/scatter.js";
import polygon from "../../options/polygon.js";
import heatMap from "../../options/heatMap.js";
import pulseLink from "../../options/pulseLink.js";
import flatBar from "../../options/flatBar.js";
import label from "../../options/label.js";
import line from "../../options/line.js";
import defaultIconOp from "../../options/icon.js";
import {
  AddDataToSource,
  AddEventHandler,
  TransPointLayerStyle,
  TransLabelLayerStyle,
  MineMapHoverFunction,
  MineMapQueryDistrict,
  TransPolygonLayerStyle,
  TransHeatmapLayerStyle,
  TransPulselinkLayerStyle,
  TransPulselinkPointLayerStyle,
  CreateSplitPointGeoJson,
  TransToPointSource,
  TransScatterLayerStyle,
  MineMapQueryDistrictList,
  CreateFlatBarMarker,
  TransLineLayerStyle,
  CreateScatterMarker,
  FilterSourceValue,
  TransFillLayerStyle,
  CreateIconMarker,
} from "./MineMapHelper.js";

export default class MineMapProxy {
  constructor(instance) {
    // 大屏地图示例
    this.instance = instance;
    this.mineMapKey = "";
    // 地图实例
    this.map = null;
    // 全局点击事件集合
    this.globalClickFn = {};
    // 棱柱marker zoom集合
    this.markerZoom = {};
    // 显示要素
    this.features = [];
    // 缓存图层层级信息
    this.zIndexCache = {};
  }
  // 初始化api
  initAPIJS() {
    this.mineMapKey = window.mineMapKey;
    return new Promise((resolve, reject) => {
      try {
        if (!window.minemap) {
          let list = [dsf.url.getWebPath("static/js/libs/minemap/minemap.js", __DSF_DATAVIEW_PATH__)];
          utils.loadJsSource(list).then(() => {
            utils.loadCssSource(dsf.url.getWebPath("static/js/libs/minemap/minemap.css", __DSF_DATAVIEW_PATH__)).then(() => {
              resolve();
            });
          });
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
   * @param {object} options => (center：中心点, zoom：放大倍数, pitch：俯角, rotation：旋转角度)
   * @return {无}
   */
  initMap(el, options) {
    return new Promise((resolve, reject) => {
      minemap.domainUrl = window.map_domainUrl;
      minemap.dataDomainUrl = window.map_dataDomainUrl;
      minemap.serverDomainUrl = window.map_serverDomainUrl;
      minemap.spriteUrl = window.map_spriteUrl;
      minemap.serviceUrl = window.map_serviceUrl;
      minemap.key = window.mineMapKey;

      utils.getMapData(dsf.url.getWebPath(`static/js/libs/minemap/theme/theme-${options.mapStyle || "11001"}.json`, __DSF_DATAVIEW_PATH__)).then((res) => {
        const source = this.filterFeatures(res, options.features);
        this.features = options.features;
        utils.loadJsSource(dsf.url.getWebPath("static/js/libs/minemap/minemaplbs.js", __DSF_DATAVIEW_PATH__)).then(() => {
          Object.assign(options, {
            container: el, // 地图容器
            style: source,
            maxZoom: 17,
            minZoom: 3,
            projection: "MERCATOR", // 投影模式
            logoControl: false, // 不显示地图 api logo
            doubleClickZoom: false, // 禁用地图双击放大，双击事件冲突
            bearing: options.rotation,
          });
          const map = new minemap.Map(options);
          this.map = map;
          this.map.on("load", () => {
            resolve();
          });
          this.map.on("click", this.onMapClick.bind(this));
          this.map.on("zoomend", () => {
            this.checkMarkerZoom();
          });
        });
      });
    });
  }

  /**
   * @description 地图点击事件
   * @param {string} e 点击信息
   */
  onMapClick(e) {
    let feature = this.map.queryRenderedFeatures(e.point)[0];
    if (!feature) return;
    let layerId = feature?.layer?.id;
    if (this.globalClickFn["layer_" + layerId]) {
      this.globalClickFn["layer_" + layerId](e, feature);
    }
    if (feature.properties) {
      let properties = feature.properties;
      if (properties.layerAttr) {
        try {
          let layerAttr = JSON.parse(properties.layerAttr);
          let seriesType = _.upperFirst(layerAttr.seriesType);
          let result = {
            ...properties,
            layerAttr,
          };
          if (seriesType === "HeatMap") {
            result = {
              layerAttr,
            };
          }
          dsf.emit.$emit(`GIS${seriesType}Click`, result, [window]);
        } catch (error) {
          console.log("onMapClick", error);
        }
      }
    }
  }

  /**
   * @description 获取地图基础属性
   * @param {无}
   * @return {object} property center：中心点, zoom：放大倍数, pitch：俯角, rotation：旋转角度
   */
  getMapProperties() {
    let center = this.map.getCenter();
    let zoom = Number(this.map.getZoom().toFixed(2));
    let pitch = Number(this.map.getPitch().toFixed(2));
    let rotation = Number(this.map.getBearing().toFixed(2));
    return {
      center: [Number(center.lng.toFixed(6)), Number(center.lat.toFixed(6))],
      zoom,
      pitch,
      rotation,
    };
  }

  /**
   * @description 设置地图风格
   * @param {string} styleName 风格名称
   * @return {无}
   */
  setMapStyle(styleName) {
    utils.getMapData(dsf.url.getWebPath(`static/js/libs/minemap/theme/theme-${styleName}.json`, __DSF_DATAVIEW_PATH__)).then((res) => {
      const source = this.filterFeatures(res, this.features);
      this.map.setStyle(source, {
        diff: true,
        keepUserInfo: true,
      });
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
   * @description 设置地图中心
   * @param {string} center
   * @return {无}
   */
  setCenter(center) {
    this.map.setCenter(center);
  }

  /**
   * @description 设置地图缩放级别
   * @param {string} zoom
   * @return {无}
   */
  setZoom(zoom) {
    this.map.setZoom(zoom);
  }

  /**
   * @description 设置地图俯角
   * @param {string} pitch
   * @return {无}
   */
  setPitch(pitch) {
    this.map.setPitch(pitch);
  }

  /**
   * @description 设置地图旋转角
   * @param {string} rotation
   * @return {无}
   */
  setRotation(rotation) {
    this.map.setBearing(rotation);
  }

  /**
   * @description 设置中心城市
   * @param {object} city 对象 center,level
   * @param {number} zoom 缩放层级
   * @return {无}
   */
  async setCity(city, zoom) {
    if (typeof city == "string") {
      const info = await MineMapQueryDistrictList(city, 1, this.mineMapKey);
      city = {
        level: info[0].level,
        center: info[0].location.split(","),
      };
    }
    let level = city.level;
    let center = city.center;
    if (!level || !center) return;
    if (typeof center == "string") {
      try {
        center = JSON.parse(center);
      } catch (e) {
        //
      }
    }
    if (!zoom) {
      switch (level) {
        case "province":
          zoom = 6;
          break;
        case "city":
          zoom = 9;
          break;
        case "district":
          zoom = 12;
          break;
        case "省份/直辖市":
          zoom = 6;
          break;
        case "市":
          zoom = 9;
          break;
        case "区/县":
          zoom = 12;
          break;
        case "乡镇/街道":
          zoom = 14;
          break;
        case "居委会/社区":
          zoom = 17;
          break;
      }
    }
    return this.map.setZoomAndCenter(zoom, center);
  }

  /**
   * @description 设置地图要素
   * @param {array} features 要素数组
   * @return {无}
   */
  setFeatures(features) {
    this.features = features;
    const total = ["bg", "road", "building", "point"];
    const obj = {
      bg: "fill",
      road: "line",
      building: "extrusion",
      point: "symbol",
    };
    const hidden = total
      .filter((it) => !features.includes(it))
      .map((it) => {
        return obj[it];
      });
    const show = features.map((it) => {
      return obj[it];
    });
    const layers = this.map?.getStyle()?.layers || [];
    layers.forEach((layer) => {
      if (hidden.includes(layer.type)) {
        this.map.setLayoutProperty(layer.id, "visibility", "none");
      }
      if (show.includes(layer.type) && layer.layout?.visibility == "none") {
        this.map.setLayoutProperty(layer.id, "visibility", "visible");
      }
    });
  }

  /**
   * @description 过滤地图要素
   * @param {array} source 图层信息
   * @param {array} features 要素数组
   * @return {无}
   */
  filterFeatures(source, features) {
    const total = ["bg", "road", "building", "point"];
    if (_.isEqual(total.sort(), features.sort())) {
      return source;
    }
    const obj = {
      bg: "fill",
      road: "line",
      building: "extrusion",
      point: "symbol",
    };
    const hidden = total
      .filter((it) => !features.includes(it))
      .map((it) => {
        return obj[it];
      });
    const show = features.map((it) => {
      return obj[it];
    });
    source.layers.forEach((layer) => {
      if (hidden.includes(layer.type)) {
        layer.layout.visibility = "none";
      }
      if (show.includes(layer.type) && layer.layout?.visibility == "none") {
        layer.layout.visibility = "visible";
      }
    });
    return source;
  }

  /**
   * @description 添加Tooltip
   * @param {object} options
   */
  addTooltipMaker(options) {
    let { content, formatter, position: anchor, itemStyle: tooltipStyle, ...remain } = options;
    let style = utils.transformStyle(tooltipStyle);
    let _wraper = function (data, content) {
      let _content = "";
      if (typeof formatter === "function") {
        _content = formatter(data);
      } else {
        _content = content;
      }
      return _content ? `<div style="${style}">${_content}</div>` : "";
    };
    let popup = null;
    let _this = this;
    let _show = function (position, data, offsetX = 0) {
      let el = document.createElement("div");
      el.classList.add("marker-tooltip");
      el.innerHTML = _wraper(data, content);
      popup = new minemap.Marker(el, { offset: [0 + offsetX, 0] }).setLngLat(position).addTo(_this.map);
      return popup;
    };
    let _hide = function () {
      if (popup) popup.remove();
    };
    return { _hide, _show };
  }

  /**
   * @description 添加label图层
   * @param {string|object} source | geo  geojson point
   * @param {object} events => {click:点击事件，hover:hover事件,complete:加载完成事件}
   */
  addLabelLayer(id, source, extraData = [], options = {}, events = {}) {
    if (typeof source === "string") {
      utils.getMapData(source).then((data) => {
        this.addLabelLayer(id, data, extraData, options, events);
      });
      return false;
    }
    this.zIndexCache[id] = options.label?.zIndex;
    // 先移除之前的数据源与图层
    const allLayers =  this.instance.layers;
    if (allLayers.get(id)) {
      this.removeLayers(id);
    }
    allLayers.set(id, [id]);
    // 添加数据源
    const sourceId = "map_source_" + id;
    this.removeSources(sourceId);
    // 图层系列名称
    let seriesName = options.label.seriesName;
    AddDataToSource(source, extraData, seriesName);
    this.map.addSource(sourceId, {
      type: "geojson",
      data: source,
      promoteId: "adcode", // 使用feature-state需要feature中必须含有id，如果没有，添加promoteId属性从properties中取该属性当作id
    });
    // 配置
    options = dsf.mix(true, {}, label, options);
    // 设置提示框
    let tooltip = options.tooltip;
    let TooltipMaker = null;
    // 构造提示框对象
    if (tooltip.show) {
      TooltipMaker = this.addTooltipMaker(tooltip);
    }
    // 设置label
    const labelLayerStyle = TransLabelLayerStyle(options.label);
    const symbolId = "map_symbol_layer_" + id;
    this.map.addLayer({
      id: symbolId,
      type: "symbol",
      source: sourceId,
      ...labelLayerStyle,
    });
    // 事件处理
    AddEventHandler({
      _this: this,
      map: this.map,
      events,
      sourceId: sourceId,
      layerId: symbolId,
      TooltipMaker,
    });
    this.sortLayers(id);
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
    if (typeof source === "string") {
      utils.getMapData(source).then((data) => {
        this.addPointLayer(id, data, extraData, options, events);
      });
      return false;
    }
    this.zIndexCache[id] = options.point?.zIndex;
    // 先移除之前的数据源与图层
    const allLayers =  this.instance.layers;
    if (allLayers.get(id)) {
      this.removeLayers(id);
    }
    allLayers.set(id, [id]);
    // 添加数据源
    const sourceId = "map_source_" + id;
    this.removeSources(sourceId);
    // 图层系列名称
    let seriesName = options.point.seriesName;
    AddDataToSource(source, extraData, seriesName, {
      layerId: id,
      seriesType: point.seriesType,
    });
    this.map.addSource(sourceId, {
      type: "geojson",
      data: source,
      promoteId: "adcode",
    });
    // 配置
    options = dsf.mix(true, {}, point, options);
    // 设置提示框
    let tooltip = options.tooltip;
    let TooltipMaker = null;
    // 构造提示框对象
    if (tooltip.show) {
      TooltipMaker = this.addTooltipMaker(tooltip);
    }
    // 设置圆点样式
    const pointLayerStyle = TransPointLayerStyle(options.point);
    const layerId = "map_point_layer_" + id;
    this.map.addLayer({
      id: layerId,
      type: "circle",
      source: sourceId,
      ...pointLayerStyle,
    });
    // 设置label
    if (options.label?.show) {
      const labelLayerStyle = TransLabelLayerStyle(options.label);
      const symbolId = "map_symbol_layer_" + id;
      this.map.addLayer({
        id: symbolId,
        type: "symbol",
        source: sourceId,
        ...labelLayerStyle,
      });
    }
    // 事件处理
    AddEventHandler({
      _this: this,
      map: this.map,
      events,
      sourceId: sourceId,
      layerId: layerId,
      TooltipMaker,
    });
    this.sortLayers(id);
  }

  /**
   * @description 添加贴地点图层
   * @param {string|object} source 路径 geojson
   * @param {object} options => 参考 options scatter.js
   * @param {object} events => {click:点击事件，hover:hover事件,complete:加载完成事件}
   * @return {object} layerIds
   */
  addScatterLayer(id, source, extraData = [], options = {}, events = {}) {
    if (typeof source === "string") {
      utils.getMapData(source).then((data) => {
        this.addPointLayer(id, data, extraData, options, events);
      });
      return false;
    }
    // 先移除之前的数据源与图层
    const allLayers =  this.instance.layers;
    if (allLayers.get(id)) {
      this.removeLayers(id);
    }
    allLayers.set(id, [id]);
    // 添加数据源
    const sourceId = "map_source_" + id;
    this.removeSources(sourceId);
    // 图层系列名称
    let seriesName = options.scatter.seriesName;
    AddDataToSource(source, extraData, seriesName, {
      layerId: id,
      seriesType: scatter.seriesType,
    });
    const pointSource = TransToPointSource(source);
    this.map.addSource(sourceId, {
      type: "geojson",
      data: pointSource,
      promoteId: "adcode",
    });
    // 配置
    options = dsf.mix(true, {}, scatter, options);
    // 设置提示框
    let tooltip = options.tooltip;
    let TooltipMaker = null;
    // 构造提示框对象
    if (tooltip.show) {
      TooltipMaker = this.addTooltipMaker(tooltip);
    }
    this.markerZoom[id] = options.scatter.zooms;
    // 通过marker来生成贴地点
    CreateScatterMarker(id, this.map, pointSource, options, TooltipMaker, events);
    // 设置贴地点样式
    // const scatterLayerStyle = TransScatterLayerStyle(this.map, options);
    // const layerId = 'map_scatter_layer_' + id;
    // this.map.addLayer({
    //   id: layerId,
    //   type: "symbol",
    //   source: sourceId,
    //   ...scatterLayerStyle
    // });
    // // 事件处理
    // AddEventHandler({
    //   _this: this,
    //   map: this.map,
    //   events,
    //   sourceId: sourceId,
    //   layerId: layerId,
    //   TooltipMaker
    // })
  }

  /**
   * @description 添加图标图层
   * @param {string|object} source 路径 geojson
   * @param {object} options => 参考 options scatter.js
   * @param {object} events => {click:点击事件，hover:hover事件,complete:加载完成事件}
   * @return {object} layerIds
   */
  addIconLayer(id, source, extraData = [], options = {}, events = {}) {
    if (typeof source === "string") {
      utils.getMapData(source).then((data) => {
        this.addIconLayer(id, data, extraData, options, events);
      });
      return false;
    }
    // 先移除之前的数据源与图层
    const allLayers =  this.instance.layers;
    if (allLayers.get(id)) {
      this.removeLayers(id);
    }
    allLayers.set(id, [id]);
    // 添加数据源
    const sourceId = "map_source_" + id;
    this.removeSources(sourceId);
    // 图层系列名称
    let seriesName = options.icon.seriesName;
    AddDataToSource(source, extraData, seriesName, {
      layerId: id,
      seriesType: defaultIconOp.seriesType,
    });
    const pointSource = TransToPointSource(source);
    this.map.addSource(sourceId, {
      type: "geojson",
      data: pointSource,
      promoteId: "adcode",
    });
    // 配置
    options = dsf.mix(true, {}, defaultIconOp, options);
    // 设置提示框
    let tooltip = options.tooltip;
    let TooltipMaker = null;
    // 构造提示框对象
    if (tooltip.show) {
      TooltipMaker = this.addTooltipMaker(tooltip);
    }
    this.markerZoom[id] = options.icon.zooms;
    // 通过marker来生成icon图标
    CreateIconMarker(id, this.map, pointSource, options, TooltipMaker, events);
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
    if (typeof source === "string") {
      utils.getMapData(source).then((data) => {
        this.addLineLayer(id, data, extraData, options, events);
      });
      return false;
    }
    this.zIndexCache[id] = options.line?.zIndex;
    // 先移除之前的数据源与图层
    const allLayers =  this.instance.layers;
    if (allLayers.get(id)) {
      this.removeLayers(id);
    }
    allLayers.set(id, [id]);
    // 添加数据源
    const sourceId = "map_source_" + id;
    this.removeSources(sourceId);
    // 图层系列名称
    let seriesName = options.line.seriesName;
    AddDataToSource(source, extraData, seriesName);
    this.map.addSource(sourceId, {
      type: "geojson",
      data: source,
      promoteId: "adcode",
    });
    // 配置
    options = dsf.mix(true, {}, options, line);
    // 设置提示框
    let tooltip = options.tooltip;
    let TooltipMaker = null;
    // 构造提示框对象
    if (tooltip.show) {
      TooltipMaker = this.addTooltipMaker(tooltip);
    }
    // 设置线条样式
    const lineLayerStyle = TransLineLayerStyle(options.line);
    const layerId = "map_point_layer_" + id;
    this.map.addLayer({
      id: layerId,
      type: "line",
      source: sourceId,
      ...lineLayerStyle,
    });
    // 设置label
    if (options.label?.show) {
      const labelLayerStyle = TransLabelLayerStyle(options.label);
      const symbolId = "map_symbol_layer_" + id;
      this.map.addLayer({
        id: symbolId,
        type: "symbol",
        source: sourceId,
        ...labelLayerStyle,
      });
    }
    // 事件处理
    AddEventHandler({
      _this: this,
      map: this.map,
      events,
      sourceId: sourceId,
      layerId: layerId,
      TooltipMaker,
    });
    this.sortLayers(id);
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
  async addPolygonLayer(id, source, extraData = [], options = {}, events = {}, boundaries) {
    if (typeof source === "string") {
      utils.getMapData(source).then((data) => {
        this.addPolygonLayer(id, data, extraData, options, events);
      });
      return false;
    }
    this.zIndexCache[id] = options.polygon?.zIndex;
    let mask = options.polygon.itemStyle.mask;
    if (mask.show) {
      // this.setMapStyle('empty')
      // 创建中国图层
      if (!this.map.getSource("china")) {
        const chinaSource = await utils.getMapData(dsf.url.getWebPath("static/js/libs/three/geoJson/china.json", __DSF_DATAVIEW_PATH__));
        this.map.addSource("china", {
          type: "geojson",
          data: chinaSource,
          promoteId: "adcode",
        });
      }
      const maskId = "map_mask_layer_" + id;
      if (!this.map.getLayer(maskId)) {
        this.map.addLayer({
          id: maskId,
          type: "fill",
          source: "china",
          paint: {
            "fill-color": mask.color,
            "fill-outline-color": mask.strokeColor,
            "fill-opacity": mask.opacity,
          },
          filter: ["!=", "adcode", Number(options.dataConfig?.districtCode)],
        });
      } else {
        this.removeLayers(maskId);
      }
    }
    const allLayers =  this.instance.layers;
    if (allLayers.get(id)) {
      this.removeLayers(id);
    }
    allLayers.set(id, [id]);
    let newOptions = dsf.mix(true, {}, polygon, options);
    // 面图层
    let series = newOptions.polygon;
    let range = series.itemStyle.range;
    //存在色阶
    if (range.show) {
      let sc = range.color[0];
      let ec = range.color[1];
      let min = range.min;
      let max = range.max;
      // 额外数据
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
    }
    // 添加数据源
    const sourceId = "map_source_" + id;
    this.removeSources(sourceId);
    // 图层系列名称
    let seriesName = series.seriesName;
    AddDataToSource(source, extraData, seriesName, {
      layerId: id,
      seriesType: newOptions.seriesType,
    });
    if (options.polygon.itemStyle?.range?.show) {
      FilterSourceValue(source);
    }
    this.map.addSource(sourceId, {
      type: "geojson",
      data: source,
      promoteId: "adcode",
    });
    // 设置提示框
    let tooltip = newOptions.tooltip;
    let TooltipMaker = null;
    // 构造提示框对象
    if (tooltip.show) {
      TooltipMaker = this.addTooltipMaker(tooltip);
    }
    // 构造区域面
    const polygonLayerStyle = TransPolygonLayerStyle(newOptions, range.show);
    const polygonId = "map_fill_layer_" + id;
    this.map.addLayer({
      id: polygonId,
      type: "extrusion",
      source: sourceId, // 数据源的ID
      ...polygonLayerStyle,
      filter: ["!=", "value", ""],
    });
    // 构造无数据面图层
    const fillLayerStyle = TransFillLayerStyle(newOptions, range.show);
    const fillId = "map_fill2_layer_" + id;
    this.map.addLayer({
      id: fillId,
      type: "fill",
      source: sourceId, // 数据源的ID
      ...fillLayerStyle,
      filter: ["==", "value", ""],
    });
    // 构造轮廓
    const lineLayerStyle = TransLineLayerStyle(newOptions.line);
    const linelId = "map_line_layer_" + id;
    this.map.addLayer({
      id: linelId,
      type: "line",
      source: sourceId,
      ...lineLayerStyle,
    });
    // 构造label
    if (newOptions.label?.show) {
      // 创建并添加点图层
      const pointSource = TransToPointSource(source);
      const sourcePointId = "map_source_point_" + id;
      this.removeSources(sourcePointId);
      this.map.addSource(sourcePointId, {
        type: "geojson",
        data: pointSource,
        promoteId: "adcode",
      });
      const labelLayerStyle = TransLabelLayerStyle(newOptions.label);
      const symbolId = "map_symbol_layer_" + id;
      this.map.addLayer({
        id: symbolId,
        type: "symbol",
        source: sourcePointId,
        ...labelLayerStyle,
      });
    }
    // 事件处理
    AddEventHandler({
      _this: this,
      map: this.map,
      events,
      sourceId,
      layerId: polygonId,
      TooltipMaker,
    });
    // 事件处理
    AddEventHandler({
      _this: this,
      map: this.map,
      events,
      sourceId,
      layerId: fillId,
      TooltipMaker,
    });
    this.sortLayers(id);
  }

  /**
   * @description 添加棱柱图层
   * @param {string} id => 图层id 必填
   * @param {string} source geojson 必填
   * @param {object} extraData 额外数据 选填
   * @param {object} options => 参考 options flatBarLayer.js 选填
   * @param {object} events => {click:点击事件，hover:hover事件,complete:加载完成事件} 选填
   * @return {无}
   */
  addFlatBarLayer(id, source, extraData = [], options = {}, events = {}) {
    if (typeof source === "string") {
      utils.getMapData(source).then((data) => {
        this.addPolygonLayer(id, data, extraData, options, events);
      });
      return false;
    }
    const allLayers =  this.instance.layers;
    if (allLayers.get(id)) {
      this.removeLayers(id);
    }
    allLayers.set(id, [id]);
    options = dsf.mix(true, {}, flatBar, options);
    // 棱柱图层
    let series = options.flatBar;
    let range = series.itemStyle.range;
    //存在色阶
    if (range.show) {
      let sc = range.color[0];
      let ec = range.color[1];
      let min = range.min;
      let max = range.max;
      // 额外数据
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
    }
    // 添加数据源
    const sourceId = "map_source_" + id;
    this.removeSources(sourceId);
    // 图层系列名称
    let seriesName = series.seriesName;
    AddDataToSource(source, extraData, seriesName, {
      layerId: id,
      seriesType: options.seriesType,
    });
    const pointSource = TransToPointSource(source);
    this.map.addSource(sourceId, {
      type: "geojson",
      data: pointSource,
      promoteId: "adcode",
    });
    // 设置提示框
    let tooltip = options.tooltip;
    let TooltipMaker = null;
    // 构造提示框对象
    if (tooltip.show) {
      TooltipMaker = this.addTooltipMaker(tooltip);
    }
    this.markerZoom[id] = options.flatBar.zooms;
    // 通过marker来生成棱柱，圆柱，面
    CreateFlatBarMarker(id, this.map, pointSource, options, TooltipMaker, events);
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
    if (typeof source === "string") {
      utils.getMapData(source).then((data) => {
        this.addPolygonLayer(id, data, extraData, options, events);
      });
      return false;
    }
    this.zIndexCache[id] = options.heatMap?.zIndex;
    const allLayers =  this.instance.layers;
    if (allLayers.get(id)) {
      this.removeLayers(id);
    }
    allLayers.set(id, [id]);
    options = dsf.mix(true, {}, heatMap, options);
    // 面图层
    let series = options.heatMap;
    // 添加数据源
    const sourceId = "map_source_" + id;
    this.removeSources(sourceId);
    // 图层系列名称
    let seriesName = series.seriesName;
    AddDataToSource(source, extraData, seriesName, {
      layerId: id,
      seriesType: options.seriesType,
    });
    let maxValue = 0;
    source.features.forEach((item, index) => {
      source.features[index].properties.value = Number(item.properties.value);
      if (Number(item.properties.value) > maxValue) {
        maxValue = Number(item.properties.value);
      }
    });
    this.map.addSource(sourceId, {
      type: "geojson",
      data: source,
      promoteId: "adcode",
    });
    // 设置提示框
    let tooltip = options.tooltip;
    let TooltipMaker = null;
    // 构造提示框对象
    if (tooltip.show) {
      TooltipMaker = this.addTooltipMaker(tooltip);
    }
    // 构造区域面
    const heatmapLayerStyle = TransHeatmapLayerStyle(options.heatMap, maxValue);
    const polygonId = "map_heatmap_layer_" + id;
    this.map.addLayer({
      id: polygonId,
      type: "heatmap",
      source: sourceId, // 数据源的ID
      ...heatmapLayerStyle,
    });
    // 生成热力图面(因为不支持queryRenderedFeatures)
    const circle_id = "map_layer_circle_" + id;
    if (this.map.getLayer(circle_id)) {
      this.removeLayers(circle_id);
    }
    this.map.addLayer({
      id: circle_id,
      type: "circle",
      source: sourceId, // 数据源的ID
      paint: {
        "circle-radius": heatmapLayerStyle.paint["heatmap-radius"],
        "circle-opacity": 0,
      },
    });

    // 事件处理
    AddEventHandler({
      _this: this,
      map: this.map,
      events,
      sourceId,
      layerId: circle_id,
      TooltipMaker,
    });
    this.sortLayers(id);
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
    if (typeof source === "string") {
      utils.getMapData(source).then((data) => {
        this.addPulseLinkLayer(id, data, extraData, options, events);
      });
      return false;
    }
    this.zIndexCache[id] = options.pulseLink?.zIndex;
    const allLayers =  this.instance.layers;
    if (allLayers.get(id)) {
      this.removeLayers(id);
    }
    allLayers.set(id, [id]);
    options = dsf.mix(true, {}, pulseLink, options);
    // 面图层
    let series = options.pulseLink;
    // 添加数据源
    const sourceId = "map_source_" + id;
    this.removeSources(sourceId);
    // 图层系列名称
    let seriesName = options.pulseLink.seriesName;
    AddDataToSource(source, extraData, seriesName);
    const splitSource = CreateSplitPointGeoJson(source);
    source.features.push(...splitSource.features);
    this.map.addSource(sourceId, {
      type: "geojson",
      data: source,
      promoteId: "adcode",
    });
    // 设置提示框
    let tooltip = options.tooltip;
    let TooltipMaker = null;
    // 构造提示框对象
    if (tooltip.show) {
      TooltipMaker = this.addTooltipMaker(tooltip);
    }
    // 构造区域面
    const pulseLinkLayerStyle = TransPulselinkLayerStyle(options.pulseLink);
    const polygonId = "map_pulseLink_layer_" + id;
    this.map.addLayer({
      id: polygonId,
      type: "airline",
      source: sourceId, // 数据源的ID
      ...pulseLinkLayerStyle,
    });
    // 添加飞行线运动粒子图层
    this.map.repaint = true; // 开启动态地图重绘
    const pointId = "map_pulseLink_point_layer_" + id;
    const pulseLinkPointLayerStyle = TransPulselinkPointLayerStyle(options.pulseLink);
    this.map.addLayer({
      id: pointId,
      type: "airline",
      source: sourceId, // 数据源的ID
      ...pulseLinkPointLayerStyle,
    });
    // 构造label
    if (options.label?.show) {
      const labelLayerStyle = TransLabelLayerStyle(options.label);
      const symbolId = "map_layer_symbol_" + id;
      this.map.addLayer({
        id: symbolId,
        type: "symbol",
        source: sourceId,
        ...labelLayerStyle,
      });
    }
    // 事件处理
    AddEventHandler({
      _this: this,
      map: this.map,
      events,
      sourceId,
      layerId: polygonId,
      TooltipMaker,
    });
    this.sortLayers(id);
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
      MineMapQueryDistrict(coordinates, true).then((properties) => {
        options.coordinates = properties.center;
        this.flyToView(options);
      });
      return false;
    }
    if (!Array.isArray(coordinates) || !coordinates.length) return false;
    this.map.flyTo({
      center: coordinates[0],
      zoom: zoom,
      duration: immediately ? 1000 : 0,
    });
  }

  /**
   * @description 显示图层
   * @param {String} layerId
   */
  showLayers(layerId) {
    this.showMarkers(layerId);
    const layers = this.map?.getStyle()?.layers.filter((item) => item.id.startsWith("map_")) || [];
    if (Array.isArray(layerId)) {
      layerId.forEach((item) => {
        layers.forEach((it) => {
          if (it.id.includes("_layer_" + item)) {
            this.map.setLayoutProperty(it.id, "visibility", "visible");
          }
        });
      });
    } else {
      layers.forEach((it) => {
        if (it.id.includes("_layer_" + layerId)) {
          this.map.setLayoutProperty(it.id, "visibility", "visible");
        }
      });
    }
  }

  /**
   * @description 隐藏图层
   * @param {String} layerId
   */
  hideLayers(layerId) {
    // 贴地点与棱柱使用marker创建，这里需要同时隐藏
    this.hideMarkers(layerId);
    const layers = this.map?.getStyle()?.layers.filter((item) => item.id.startsWith("map_")) || [];
    if (Array.isArray(layerId)) {
      layerId.forEach((item) => {
        layers.forEach((it) => {
          if (it.id.includes("_layer_" + item)) {
            this.map.setLayoutProperty(it.id, "visibility", "none");
          }
        });
      });
    } else {
      layers.forEach((it) => {
        if (it.id.includes("_layer_" + layerId)) {
          this.map.setLayoutProperty(it.id, "visibility", "none");
        }
      });
    }
  }

  /**
   * @description 显示marker
   */
  showMarkers(ids) {
    const markers = this.map?.getAllMarkers() || [];
    if (typeof ids == "string") {
      ids = [ids];
    }
    ids.forEach((id) => {
      $(".minemap-marker." + id).css("opacity", 1);
    });
  }

  /**
   * @description 隐藏marker
   */
  hideMarkers(ids) {
    const markers = this.map?.getAllMarkers() || [];
    if (typeof ids == "string") {
      ids = [ids];
    }
    ids.forEach((id) => {
      $(".minemap-marker." + id).css("opacity", 0);
    });
  }

  /**
   * @description 移除图层
   * @param {String} layerId
   */
  removeLayers(layerId) {
    this.removeMarker(layerId);
    const layers = this.map?.getStyle()?.layers.filter((item) => item.id.startsWith("map_")) || [];
    if (Array.isArray(layerId)) {
      layerId.forEach((item) => {
        layers.forEach((it) => {
          if (it.id.includes("_layer_" + item)) {
            this.map.removeLayer(it.id);
          }
        });
      });
    } else {
      layers.forEach((it) => {
        if (it.id.includes(layerId)) this.map.removeLayer(it.id);
      });
    }
  }

  /**
   * @description 移除marker
   */
  removeMarker(ids) {
    const markers = this.map?.getAllMarkers() || [];
    if (typeof ids == "string") {
      ids = [ids];
    }
    ids.forEach((id) => {
      markers.forEach((marker) => {
        let list = Array.prototype.slice.call(marker._element.classList, 0);
        if (list.includes(id)) {
          marker.remove();
        }
      });
      delete this.markerZoom[id];
      $(".minemap-marker." + id).remove();
    });
  }

  /**
   * @description 查询行政区域
   * @param {string} adcode 行政区域编码
   * @return {object} geojson
   */
  /**
   * @description 移除数据源
   * @param {String} sourceId
   */
  removeSources(sourceId) {
    if (this.map.getSource(sourceId)) {
      this.map.removeSource(sourceId);
    }
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
   * @return {object} geojson
   */
  queryDistrictByCode(adcode, tolerance) {
    return MineMapQueryDistrict(adcode, this.mineMapKey, "all").then((res) => {
      res = Array.isArray(res) ? res : [res];
      let features = [];
      res.forEach((it, index) => {
        if (it) {
          features.push(it.genjsonPolygon);
        }
      });
      return { geo: utils.featureCollection(features), boundaries: null };
    });
  }

  /**
   * @description 查询行政下级区域列表
   * @param {string} adcode 行政区域编码 必填
   * @param {number} deep 深度 选填
   * @return {promise} list
   */
  queryDistrictListByCode(adcode, deep) {
    return MineMapQueryDistrictList(adcode, deep, this.mineMapKey);
  }

  /**
   * @description 查询行政点位
   * @param {string} adcode 行政区域编码
   * @param {object} extraData 点位额外数据
   */
  queryPointByCode(adcode, extraData) {
    return MineMapQueryDistrict(adcode, this.mineMapKey, "base", true, extraData).then((res) => {
      return res;
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
        promise.push(this.queryPointByCode(it));
      } else if (dsf.isObject(it)) {
        if (it.adcode) {
          promise.push(this.queryPointByCode(it.adcode, it));
        }
      }
    });
    return Promise.all(promise).then((res) => {
      let points = [];
      res.forEach((it) => {
        if (it) {
          let point = it.center;
          points.push({ point, properties: it });
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
    return "MineMap";
  }

  /**
   * @description 销毁地图
   */
  destroy() {
    this.zIndexCache = {};
    this.map && this.map.remove();
  }

  /**
   * @description 控制marker显示层级
   */
  checkMarkerZoom() {
    const markers = Object.keys(this.markerZoom);
    if (!markers.length) return;
    const zoom = this.map.getZoom();
    markers.map((marker) => {
      const show = this.markerZoom[marker];
      if (zoom >= show[0] && zoom <= show[1]) {
        $(".minemap-marker." + marker).css("display", "block");
      } else {
        $(".minemap-marker." + marker).css("display", "none");
      }
    });
  }

  /**
   * @description 对图层重新排序
   */
  sortLayers(id) {
    // 获取当前图层的上级图层
    const sortIds = Object.entries(this.zIndexCache)
      .sort((a, b) => a[1] - b[1])
      .map((entry) => entry[0]);
    if (id !== sortIds[sortIds.length - 1]) {
      const beforeId = sortIds[sortIds.indexOf(id) + 1];
      // 将当前图层移动到上级图层下面
      const layers = this.map?.getStyle()?.layers.filter((item) => item.id.startsWith("map_")) || [];
      const ids = layers
        .filter((item) => item.id.endsWith("layer_" + id))
        .map((item) => {
          return item.id;
        });
      const beforeLayerId = layers.filter((item) => item.id.endsWith("layer_" + beforeId))[0]?.id;
      for (let i = 0; i < ids.length; i++) {
        if (this.map.getLayer(ids[i]) && this.map.getLayer(beforeLayerId)) {
          this.map.moveLayer(ids[i], beforeLayerId);
        }
      }
    }
  }
}
