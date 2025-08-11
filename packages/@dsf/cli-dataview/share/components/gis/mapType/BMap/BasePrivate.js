import MarkerCustomerLayer from "./markerCustomerLayer";
import defaultTooltipOptions from "../../options/tooltip";
import { infoMapKeyMap } from "_dataview/output/gis/BMap/BMapConfig.js";
import defaultMarker from "_dataview/assets/img/gis/default-marker.png";

export default class BasePrivate {
  constructor(instance) {
    this._locaURL = ["https://unpkg.com/mapvgl@1.0.0-beta.185/dist/mapvgl.min.js"];
    this._tooltips = null;
    this._cacheHoverLayer = null;

    // 如果有面的话以面的基础海拔为准
    this._baseAltitude = 0;

    // 如果没有这用这个默认值
    this._defaultAltitude = 10000;

       // 大屏地图实例
       this.instance = instance;
  }
  /**
   * 生成size
   * @param {Array[string | number]} arr
   * @return {*}
   */
  _createSize(arr) {
    if (Array.isArray(arr) && arr.length >= 2) {
      return new BMapGL.Size(arr[0], arr[1]);
    }
    return null;
  }

  /**
   * 生成点位
   * @param {Array[string | number]} arr
   * @return {*}
   */
  _createPoint(arr) {
    if (Array.isArray(arr) && arr.length >= 2) {
      return new BMapGL.Point(arr[0], arr[1]);
    }
    return null;
  }

  /**
   * 添加地图的事件
   */
  _addMapEvent() {
    this.map.addEventListener("zoomend", () => {
      this._zoomByShowHideLayer(); // 根据缩放等级显示与隐藏图层
    });
  }

  _resetData() {
    if (this._tooltips) {
      this._tooltips.hide();
    }
    this._tooltips = null;
    this._cacheHoverLayer = null;
  }

  /**
   * 初始化自己组件的options(参数以高德地图为准)
   * @param {Object} options 传入的mapOptions
   * @param {String} type // 地图类型
   * @return {Object} 返回当前地图所需的属性
   */
  _createUseOptions(options, type = "map") {
    let nowOptions = _.cloneDeep(options);
    let keyObj = infoMapKeyMap[type];
    Object.keys(keyObj).forEach((key) => {
      let val = options[key];
      if (val) {
        nowOptions[keyObj[key]] = val;
        delete options[key];
      }
    });
    return nowOptions;
  }

  /**
   * 根据配置项生成提示相关信息
   * @param {*} options tooltips的配置
   * @return {*}
   */
  _createTooltipInfo(options, e) {
    let tooltipOptions = _.merge(defaultTooltipOptions.tooltip, options);
    let content = "";
    if (content) {
      content = tooltipOptions.content;
    } else if (tooltipOptions.formatter) {
      if (typeof tooltipOptions.formatter === "function") {
        content = tooltipOptions.formatter(e.dataItem);
      } else {
        content = tooltipOptions.formatter;
      }
    }
    let style = {
      ...tooltipOptions.itemStyle,
      borderWidth: `${tooltipOptions.itemStyle.borderWidth}px`,
      padding: `${tooltipOptions.itemStyle.padding}px`,
      fontSize: `${tooltipOptions.itemStyle.fontSize}px`,
      minWidth: `${tooltipOptions.itemStyle.minWidth}px`,
      borderRadius: `${tooltipOptions.itemStyle.borderRadius}px`,
      transform: "translateY(100%)",
      zIndex: 1000000,
    };
    return {
      show: tooltipOptions.show,
      content,
      style,
    };
  }

  // 目前是否有悬浮层
  _setHoverMapvglLayer(e, layer) {
    if (e.dataItem) {
      // 证明进入了悬浮层
      this._cacheHoverLayer = layer;
    } else {
      // 离开了悬浮层
      if (this._cacheHoverLayer === layer) {
        this._cacheHoverLayer = null;
      }
    }
  }

  /**
   * 移入时文字提示用于mapV生成的
   * @param {Object} obj
   * options用户传入其中tooltip是提示所需要的
   * layer移入时的图层
   * _type是指的是移入的哪个图层
   * e与f指代的是onMousemove中两个参数
   * @return {*}
   */
  _addTooltips({ options, layer, _type, e, f }) {
    let target = f.target;
    if (target.id === "mask") {
      if (e.dataItem && _type === e.dataItem._type) {
        e.showLabelLatLng = f.latlng;
        this._createTooltipLabel(options, e);
        this._cacheHoverLayer = layer;
      } else {
        if (this._cacheHoverLayer === layer) {
          this._cacheHoverLayer = null;
        }
        if (this._tooltips && !this._cacheHoverLayer) {
          this._tooltips.hide();
        }
      }
    }
  }

  _createTooltipLabel(options, info) {
    let tooltipInfo = this._createTooltipInfo(options.tooltip, info);
    let content = tooltipInfo.content;
    let tooltipShow = tooltipInfo.show;
    let tooltipStyle = tooltipInfo.style;
    let isUpdate = true;
    if (!this._tooltips) {
      isUpdate = false;
      let tipTools = new BMapGL.Label(content, {
        position: new BMapGL.Point(info.showLabelLatLng.lng, info.showLabelLatLng.lat),
        offset: this._createSize(options.tooltip.offset),
      });
      this._tooltips = tipTools;
      this._tooltips.setStyle(tooltipStyle);
      this._tooltips.hide();
      this.map.addOverlay(this._tooltips);
    }
    if (tooltipShow) {
      if (isUpdate) {
        this._updateTooltipLabel(options, info);
      } else {
        this._tooltips.show();
      }
    } else {
      this._tooltips.hide();
    }
  }

  _updateTooltipLabel(options, info) {
    let tooltipInfo = this._createTooltipInfo(options.tooltip, info);
    let content = tooltipInfo.content;
    let tooltipStyle = tooltipInfo.style;
    if (this._tooltips) {
      this._tooltips.setContent(content);
      this._tooltips.setStyle(tooltipStyle);
      this._tooltips.setPosition(new BMapGL.Point(info.showLabelLatLng.lng, info.showLabelLatLng.lat));
      this._tooltips.setStyle({
        zIndex: 1000000,
      });
      this._tooltips.show();
    }
  }

  /**
   * 加载图层的公用方法
   * @param {Object} options 选项
   * @param {Object} events 事件 click、hover、complete
   * @param {*} type 加载的类型点
   * @return {Object} id与图层对象
   */
  _addLayer(params) {
    let options = params.options;
    let events = params.events;
    let type = params.type;
    let otherOptions = params.otherOptions || {};
    let typeOptions = {};
    // 处理事件
    let eventOptions = this._handleLayerEvent(events);
    // 处理属性
    let layerOptions = this._handleLayerOptions(options, type);
    typeOptions = {
      ...eventOptions,
      ...layerOptions,
      ...otherOptions,
    };
    let layer = new mapvgl[`${_.capitalize(type)}Layer`]({
      ...typeOptions,
    });
    return layer;
  }

  /**
   * 后期一起处理用户传过来的事件
   * @param {*} e 事件里面的参数
   * @param {string} eventType 事件名称 _userClick,_userMousemove
   * @param {string} layer 图层
   */
  _handleUserEvent({ eventType, e, layer }) {
    if (e.dataItem) {
      let fn = layer.options[`_user${eventType}`];
      if (typeof fn === "function") {
        fn(e);
      }
    }
  }

  /**
   * save用户的事件,并触发用户事件
   * _userClick:点击事件
   * _userMousemove:鼠标移入移出事件
   * @param {*} events
   * @return {*}
   */
  _handleLayerEvent(events) {
    let eventOption = {
      enablePicked: true,
      autoSelect: true,
      popEvent: true,
    };
    if (events.click) {
      eventOption._userClick = events.click;
      eventOption.onClick = events.click;
    }
    if (events.hover) {
      eventOption._userMousemove = events.hover;
      eventOption.onMousemove = events.hover;
    }
    return eventOption;
  }

  /**
   * 解析公用的属性
   * @param {Object} options 该对象的属性
   * @return {Object}
   */
  _analyzeCommonOptions(options) {
    options = _.cloneDeep(options);
    let useOptions = options.itemStyle || { itemStyle: {} };
    let hoverOptions = options.emphasis || { itemStyle: {} };
    let nowOptions = {
      visible: options.show,
      ...useOptions,
      ...hoverOptions,
      autoSelect: hoverOptions.show,
      selectedColor: hoverOptions.itemStyle?.color || "",
    };
    if (Array.isArray(options.zooms)) {
      nowOptions.minZoom = options.zooms[0];
      nowOptions.maxZoom = options.zooms[1];
    }
    delete nowOptions.zIndex;
    return {
      resultOptions: nowOptions,
      useOptions,
      hoverOptions,
    };
  }

  /**
   * 处理图层的属性
   * @param {Object} options 传入过来的属性
   * @param {String} type 图层的类型
   * @return {*}
   */
  _handleLayerOptions(options, type) {
    let attrOptions = {};
    if (type === "point") {
      let { resultOptions } = this._analyzeCommonOptions(options.point);
      attrOptions = {
        ...resultOptions,
      };
    } else if (type === "text") {
      let { resultOptions } = this._analyzeCommonOptions(options.label);
      attrOptions = {
        ...resultOptions,
      };
    } else if (type === "shape") {
      let { resultOptions, useOptions, hoverOptions } = this._analyzeCommonOptions(options.polygon);
      attrOptions = {
        ...resultOptions,
        color: useOptions.topColor,
        altitude: useOptions.altitude,
        texture: useOptions.texture,
        selectedColor: hoverOptions.itemStyle?.topColor,
      };
    } else if (type === "line") {
      let { resultOptions, useOptions } = this._analyzeCommonOptions(options.line);
      attrOptions = {
        ...resultOptions,
        width: useOptions.lineWidth,
      };
    } else if (type === "circle") {
      let { resultOptions, useOptions, hoverOptions } = this._analyzeCommonOptions(options.scatter);
      let size = useOptions.size[0] || 10;
      attrOptions = {
        ...resultOptions,
        size,
        type: useOptions.animate ? "bubble" : "simple",
        selectedColor: hoverOptions.itemStyle.color,
      };
    } else if (type === "heatmap") {
      let { resultOptions, useOptions } = this._analyzeCommonOptions(options.heatMap);
      let size = resultOptions.size;
      if (typeof size === "function") {
        size = Math.round((resultOptions.sizeMin + resultOptions.sizeMax) / 2);
      }
      attrOptions = {
        ...resultOptions,
        max: useOptions.max === null ? 100 : useOptions.max,
        size,
      };
      delete attrOptions.opacity;
    } else if (type === "icon") {
      let { resultOptions, useOptions } = this._analyzeCommonOptions(options.icon);
      let size = useOptions.iconSize;
      let icon = useOptions.icon ? useOptions.icon : defaultMarker;
      attrOptions = {
        ...resultOptions,
        width: size[0],
        height: size[1],
        icon,
      };
      delete attrOptions.selectedColor;
    }
    return attrOptions;
  }

  _handleLayerAction(layerArr, type) {
    if (layerArr?.length) {
      layerArr.forEach((layer) => {
        this.loca[`${type}Layer`](layer);
        if (layer instanceof MarkerCustomerLayer) {
          layer[type]();
        }
      });
    } else {
      const layers = this.instance.layers;
      layers.forEach((layerArr) => {
        layerArr.forEach((layer) => {
          this.loca[`${type}Layer`](layer);
          if (layer instanceof MarkerCustomerLayer) {
            layer[type]();
          }
        });
      });
      if (type === "remove") {
        this.loca.removeAllLayers();
      } else {
        this.loca[type]();
      }
    }
  }

  getBaseAltitude(obj = {}) {
    let type = obj.type;
    let _baseAltitude = this._baseAltitude;
    if (type === "circle") {
      return _baseAltitude + 1;
    } else {
      const map = {
        heatMap: 10,
        point: 6,
        line: 1,
        polygon: 1,
        polygonText: 3,
        movePolygon: 1.5,
      };
      let multiple = map[type] || 1;
      let num = obj.height;
      let _defaultAltitude = this._defaultAltitude * multiple;
      let _baseAltitude = this._baseAltitude * multiple;
      let height = obj.height * multiple;
      if (height === undefined) {
        num = _baseAltitude ? _baseAltitude : _defaultAltitude;
      } else {
        num = height ? height : _defaultAltitude;
      }
      return num;
    }
  }

  _zoomByShowHideLayer(mapLayer) {
    const layers = mapLayer || this.instance.layers;
    let nowZoom = this.map.getZoom();
    layers.forEach((layerArr) => {
      // 根据第一个对象判断是否显示
      let layer = layerArr[0];
      let options = layer.options;
      let isFlag = false;
      if (options) {
        let minZoom = options.minZoom;
        let maxZoom = options.maxZoom;
        if (nowZoom >= minZoom && nowZoom <= maxZoom) {
          isFlag = true;
        }
      }
      layerArr.forEach((itemLayer) => {
        if (isFlag) {
          itemLayer?.show();
          this.loca.showLayer(itemLayer);
        } else {
          itemLayer?.hide();
          this.loca.hideLayer(itemLayer);
        }
      });
    });
  }

  /**
   * @name: 创建蒙层图层
   * @param {Object} source
   * @param {Object} options 蒙层相关的配置
   * @return {*}
   */
  _createMaskLayer(source, options) {
    let list = source.features;
    let arr = [
      [
        [
          // 形成蒙层重要的东西
          [170.672126, 81.291804],
          [-169.604276, 81.291804],
          [-169.604276, -68.045308],
          [170.672126, -68.045308],
        ],
      ],
    ];
    list.forEach((item) => {
      item.geometry.coordinates.forEach((one) => {
        one.forEach((two) => {
          arr[0].push(two);
        });
      });
    });
    let data = [
      {
        geometry: {
          type: "MultiPolygon",
          coordinates: arr,
        },
        properties: {},
      },
    ];
    const maskLayer = new mapvgl.PolygonLayer({
      lineWidth: 0,
      fillColor: options.color,
      fillOpacity: options.opacity,
      data,
    });
    return maskLayer;
  }
}
