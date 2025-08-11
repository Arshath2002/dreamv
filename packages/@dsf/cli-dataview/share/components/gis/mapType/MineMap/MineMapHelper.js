import utils from "_dataview/output/utils/gis.js";
import defaultMarker from "_dataview/assets/img/gis/default-marker.png";
/**
 * @description 添加地图数据
 * @param {object} source 地图来源路径活对象
 * @return {object} extraData 添加数据
 * @return {object} seriesName
 */
const AddDataToSource = function (
  source,
  extraData,
  seriesName,
  layerProperties = {}
) {
  source.features.forEach((feature) => {
    let adcode = feature.properties.adcode;
    feature.properties.seriesName = seriesName;
    feature.properties.layerAttr = layerProperties;
    //区域编码匹配
    let extra = extraData.find((it) => it.adcode == adcode);
    if (extra) {
      feature.properties = dsf.mix(true, feature.properties, extra);
    }
    if (feature.properties.value) {
      feature.properties.value = Number(feature.properties.value);
    }
  });
  return source;
};

/**
 * @description 地图图层事件处理函数
 * @param {object|string} options =>(map:地图,events:事件对象,layerId:发生事件图层,TooltipMaker:图层的提示框)
 * @return {无}
 */
const AddEventHandler = function (options) {
  let { _this, map, events, sourceId, layerId, TooltipMaker } = options;
  let click, hover, complete;
  if (events) {
    click = events.click;
    hover = events.hover;
    complete = events.complete;
  }
  if (click) {
    _this.globalClickFn["layer_" + layerId] = click;
  }
  if (layerId) {
    let featureList = [];
    map.on("mousemove", layerId, (e) => {
      if (hover) {
        hover(e, e.features[0]);
      }
      let features = map.queryRenderedFeatures(e.point, {
        layers: [layerId],
      });
      if (features.length) {
        let feartureId = String(features[0].id);
        if (
          (feartureId && !featureList.includes(feartureId)) ||
          $(".marker-tooltip").length == 0
        ) {
          setFeatureState(map, featureList, sourceId, false);
          featureList = [feartureId];
          setFeatureState(map, featureList, sourceId, true);
          if (TooltipMaker) {
            TooltipMaker?._hide();
            const feature = features[0];
            let coordinates = feature.properties.center;
            if (typeof coordinates == "string") {
              try {
                coordinates = JSON.parse(coordinates);
              } catch (e) {
                // 解析失败
              }
            }
            TooltipMaker._show(coordinates, feature);
          }
        }
      }
    });
    map.on("mouseleave", layerId, (e) => {
      let features = map.queryRenderedFeatures(e.point, { layers: [layerId] });
      if (features.length == 0 || featureList[0] !== String(features[0].id)) {
        TooltipMaker?._hide();
      }
      setFeatureState(map, featureList, sourceId, false);
      featureList = [];
    });
  }
};

const setFeatureState = function (map, featureList, sourceId, statue) {
  for (let i = 0; i < featureList.length; i++) {
    map.setFeatureState(
      {
        source: sourceId,
        id: featureList[i],
      },
      {
        hover: statue,
      }
    );
  }
};

/**
 * @description 点图层样式处理函数
 * @param {object} options
 * @return {object}
 */
const TransPointLayerStyle = function (options) {
  const min = options.itemStyle.sizeMin,
    max = options.itemStyle.sizeMax;
  const val = max / options.itemStyle.basicSize;
  return {
    layout: {
      visibility: options.show ? "visible" : "none",
    },
    paint: {
      "circle-radius": options.itemStyle.isCalcSize
        ? [
          "interpolate",
          ["linear"],
          ["*", val, ["get", "value"]],
          min,
          min,
          max,
          max,
        ]
        : options.itemStyle.size,
      "circle-color": [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        options.emphasis.itemStyle.color,
        options.itemStyle.color,
      ],
      "circle-opacity": options.opacity,
      "circle-stroke-color": options.itemStyle.borderColor,
      "circle-stroke-width": options.itemStyle.borderWidth,
    },
    minzoom: options.zooms[0],
    maxzoom: options.zooms[1],
  };
};

/**
 * @description 文字图层样式处理函数
 * @param {object} options
 * @return {object}
 */
const TransLabelLayerStyle = function (options) {
  return {
    layout: {
      visibility: options.show ? "visible" : "none",
      "text-field": options.name
        .replaceAll("{a}", "{seriesName}")
        .replaceAll("{b}", "{name}")
        .replaceAll("{c}", "{value}"),
      "text-size": Number(options.itemStyle.fontSize),
      "text-anchor":
        options.position == "left"
          ? "right"
          : options.position == "right"
            ? "left"
            : options.position,
      "text-offset": options.itemStyle.offset,
      "icon-allow-overlap": true, // 图标允许压盖
      "text-allow-overlap": true, // 图标覆盖文字允许压盖
    },
    paint: {
      "text-color": [
        "case",
        ["boolean", ["feature-state", "hover"], false], // 当鼠标悬停时
        options.emphasis.itemStyle.color, // 悬浮颜色
        options.itemStyle.color || options.color, // 默认颜色
      ],
      "text-halo-color": options.itemStyle.borderColor,
      "text-halo-width": options.itemStyle.borderWidth,
    },
    minzoom: options.zooms[0],
    maxzoom: options.zooms[1],
  };
};

/**
 * @description 热力图层样式处理函数
 * @param {object} options
 * @return {object}
 */
const TransHeatmapLayerStyle = function (options, maxValue) {
  function calcColors(gradient) {
    const keysArray = Object.keys(gradient);
    keysArray.sort((a, b) => parseFloat(a) - parseFloat(b));
    let arr = [0, "rgba(0, 0, 255, 0)"];
    keysArray.forEach((key) => {
      arr.push(Number(key));
      arr.push(gradient[key]);
    });
    return arr;
  }
  const min = options.itemStyle.sizeMin,
    max = options.itemStyle.sizeMax;
  const val = max / options.itemStyle.basicSize;
  return {
    layout: {
      visibility: options.show ? "visible" : "none",
    },
    paint: {
      "heatmap-radius": options.itemStyle.isCalcSize
        ? [
          "interpolate",
          ["linear"],
          ["*", val, ["get", "value"]],
          min,
          min,
          max,
          max,
        ]
        : options.itemStyle.size,
      "heatmap-weight": {
        property: "value",
        stops: [
          [0, 0],
          [maxValue, 5],
        ],
      },
      "heatmap-intensity": 1,
      "heatmap-color": [
        "interpolate",
        ["linear"],
        ["heatmap-density"],
        ...calcColors(options.itemStyle.gradient),
      ],
      "heatmap-opacity": 1,
    },
    minzoom: options.zooms[0],
    maxzoom: options.zooms[1],
  };
};

/**
 * @description 飞行线层样式处理函数
 * @param {object} options
 * @return {object}
 */
const TransPulselinkLayerStyle = function (options) {
  return {
    layout: {
      visibility: options.show ? "visible" : "none",
    },
    paint: {
      "airline-seg-group": options.itemStyle.smoothSteps,
      "airline-speed": options.itemStyle.speed / 1000,
      "airline-type": "none",
      "airline-color": options.itemStyle.lineColors[0],
      "airline-width": 1,
      "airline-opacity": options.opacity,
    },
    minzoom: options.zooms[0],
    maxzoom: options.zooms[1],
  };
};

/**
 * @description 飞行线运动粒子样式处理函数
 * @param {object} options
 * @return {object}
 */
const TransPulselinkPointLayerStyle = function (options) {
  return {
    layout: {
      visibility: options.show ? "visible" : "none",
    },
    paint: {
      "airline-seg-group": 10,
      "airline-speed": options.itemStyle.speed / 1000,
      "airline-type": "history",
      "airline-color": options.itemStyle.headColor,
      "airline-width": 3,
      "airline-opacity": options.opacity,
    },
    minzoom: options.zooms[0],
    maxzoom: options.zooms[1],
  };
};

/**
 * @description 贴地点样式处理函数
 * @param {object} options
 * @return {object}
 */
const TransScatterLayerStyle = function (map, options) {
  // 定义一个CustomLayerInterface来在地图上绘制脉冲点
  const scatterOptions = options.scatter,
    labelOptions = options.label;
  const w = scatterOptions.itemStyle.size[0] * 8,
    h = scatterOptions.itemStyle.size[1] * 8,
    animate = !scatterOptions.itemStyle.animate,
    duration = scatterOptions.itemStyle.duration || 2000;

  let pulsingDot = {
    width: w,
    height: h,
    data: new Uint8Array(w * h * 4),
    // 在图层添加到地图时获取获取canvas context
    onAdd: function () {
      let canvas = document.createElement("canvas");
      canvas.width = this.width;
      canvas.height = this.height;
      this.context = canvas.getContext("2d");
    },
    // 每帧渲染时调用
    render: function () {
      let t = (performance.now() % duration) / duration;
      let radius = (w / 2) * 0.3;
      let outerRadius = (w / 2) * 0.5 * t + radius;
      let context = this.context;
      // 画外围圆
      if (animate) {
        context.clearRect(0, 0, this.width, this.height);
        context.beginPath();
        context.arc(
          this.width / 2,
          this.height / 2,
          outerRadius,
          0,
          Math.PI * 2
        );
        context.fillStyle = utils.transColorOpacity(
          scatterOptions.itemStyle.color,
          0.1
        );
        context.fill();
      }
      // 画内圈圆
      context.beginPath();
      context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2);
      context.fillStyle = scatterOptions.itemStyle.color;
      context.strokeStyle =
        scatterOptions.itemStyle.borderWidth < 1
          ? "transparent"
          : scatterOptions.itemStyle.borderColor;
      context.lineWidth = scatterOptions.itemStyle.borderWidth;
      context.fill();
      context.stroke();
      // 从canvas中更新图片数据
      this.data = context.getImageData(0, 0, this.width, this.height).data;
      // 不断地重新绘制地图，导致平滑的动画点
      if (animate) {
        map.triggerRepaint();
      }
      // 返回`true`让映射知道图像已经更新
      return true;
    },
  };
  map.addImage("pulsing-dot", pulsingDot, {
    pixelRatio: 2,
  });
  const labelStyle = TransLabelLayerStyle(labelOptions);
  let style = {
    layout: Object.assign({}, labelStyle.layout, {
      "icon-image": "pulsing-dot",
      "icon-rotation-alignment": "map",
      "text-pitch-alignment": "map",
    }),
    paint: Object.assign({}, labelStyle.paint, {}),
    minzoom: scatterOptions.zooms[0],
    maxzoom: scatterOptions.zooms[1],
  };
  return style;
};

/**
 * @description 图层悬浮事件处理
 * @param {string} sourceId 数据源id
 * @param {string} layerId 图层id
 * @return {无}
 */
const MineMapHoverFunction = function (_this, sourceId, layerId) {
  _this.map.on("mouseenter", layerId, (e) => {
    _this.map.setFeatureState(
      {
        source: sourceId,
        id: e.features[0].id,
      },
      {
        hover: true,
      }
    );
  });
  _this.map.on("mouseleave", layerId, (e) => {
    _this.map.setFeatureState(
      {
        source: sourceId,
        id: e.features[0].id,
      },
      {
        hover: false,
      }
    );
  });
};

/**
 * @description 查询行政下级区域列表
 * @param {string} adcode 行政区域编码 必填
 * @param {number} deep 深度 选填
 * @return {promise} list
 */
const MineMapQueryDistrictList = function (code, deep = 3, key) {
  const opts = {
    keywords: code,
    subdistrict: deep,
    extensions: "base",
    key: key,
  };
  return new Promise((resolve) => {
    minemap.service.adminByPointData(opts).then((result) => {
      let districts = result.districts.slice(0, 1);
      resolve(districts);
    });
  });
};

/**
 * @description 查询行政区域轮廓图 只查询到下级
 * @param {string} code 行政区域编码
 * @param {string} key minemap key
 * @param {string} type all/base
 * @param {boolean} isEnd 是否结束查询 查单层使用
 * @return {无}
 */
const MineMapQueryDistrict = function (code, key, type, isEnd, extraData = {}) {
  const opts = {
    keywords: code,
    subdistrict: isEnd ? 0 : 1,
    extensions: type,
    key: key,
  };
  return new Promise((resolve) => {
    minemap.service.adminByPointData(opts).then((result) => {
      let district = result.districts[0];
      let geojsonPolygon = {};
      if (district.polygon) {
        geojsonPolygon = utils.analysisIslandCave(district.polygon);
      }
      const properties = {
        center: district.location.split(","),
        name: district.name,
        adcode: district.adcode,
        ...extraData,
        genjsonPolygon: {
          ...geojsonPolygon,
          properties: {
            center: district.location.split(","),
            name: district.name,
            adcode: district.adcode,
            level: district.level,
          },
        },
      };
      let promise = [];
      if (district.districts && district.districts.length && !isEnd) {
        for (let i = 0; i < district.districts.length; i++) {
          let subdistrict = district.districts[i];
          promise.push(
            MineMapQueryDistrict(subdistrict.adcode, key, type, true, {})
          );
        }
      }
      if (isEnd || (!district.districts?.length && !isEnd)) {
        resolve(properties);
      } else {
        Promise.all(promise).then((res) => resolve(res));
      }
    });
  });
};

/**
 * @description 面图层样式处理函数
 * @param {object} options
 * @return {object}
 */
const TransPolygonLayerStyle = function (options, showRange) {
  return {
    layout: {
      visibility: options.polygon.show ? "visible" : "none",
    },
    paint: {
      "extrusion-color": createHoverStyle(
        options,
        "polygon",
        "topColor",
        showRange,
        "color",
        "rgb(255,255,255)"
      ),
      "extrusion-opacity": options.polygon.opacity,
      "extrusion-height": options.polygon.itemStyle.height,
    },
    minzoom: options.polygon.zooms[0],
    maxzoom: options.polygon.zooms[1],
  };
};

/**
 * @description 面图层样式处理函数
 * @param {object} options
 * @return {object}
 */
const TransFillLayerStyle = function (options, showRange) {
  return {
    layout: {
      visibility: options.polygon.show ? "visible" : "none",
    },
    paint: {
      "fill-color": createHoverStyle(
        options,
        "polygon",
        "topColor",
        showRange,
        "color",
        "rgba(255,255,255,0)"
      ),
      "fill-opacity": 0,
    },
    minzoom: options.polygon.zooms[0],
    maxzoom: options.polygon.zooms[1],
  };
};

/**
 * @description 面图层轮廓样式处理函数
 * @param {object} options
 * @return {object}
 */
const TransLineLayerStyle = function (options) {
  return {
    layout: {
      "line-join": "round",
      "line-cap": "round",
      "border-visibility": options.show ? "visible" : "none",
    },
    paint: {
      "line-width": options.itemStyle.lineWidth,
      "line-color": [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        options.emphasis.itemStyle.color,
        options.itemStyle.color,
      ],
      "line-border-width": options.itemStyle.borderWidth,
      "line-border-color": options.itemStyle.borderColor,
    },
    minzoom: options.zooms[0],
    maxzoom: options.zooms[1],
  };
};

const createHoverStyle = function (
  options,
  type,
  attr,
  showRange,
  rangeAttr,
  defaultRange
) {
  const show = options[type]?.emphasis?.show;
  const hoverStyle = options[type]?.emphasis?.itemStyle[attr];
  let defaultStyle = utils.transColorOpacity(options[type].itemStyle[attr], 1);
  if (options[type]?.itemStyle[attr]) {
    defaultRange = utils.transColorOpacity(options[type]?.itemStyle[attr], 1);
  }
  if (showRange && options[type]?.itemStyle?.range?.color[0]) {
    defaultRange = utils.transColorOpacity(
      options[type]?.itemStyle.range.color[0],
      1
    );
  }
  if (showRange) {
    defaultStyle = [
      "case",
      ["has", rangeAttr],
      ["get", rangeAttr],
      defaultRange,
    ];
  }
  if (!show || !hoverStyle) {
    return defaultStyle;
  }
  return [
    "case",
    ["boolean", ["feature-state", "hover"], false],
    hoverStyle,
    defaultStyle,
  ];
};

/**
 * @description 计算飞行线上的feature
 * @param {object} options
 * @return {object}
 */
function lngLat2Mercator(e) {
  var t = [],
    r = (20037508.34 * e[0]) / 180,
    n = Math.log(Math.tan(((90 + e[1]) * Math.PI) / 360)) / (Math.PI / 180);
  return (n = (20037508.34 * n) / 180), t.push(r), t.push(n), t;
}
function _getDistanceInterval(e) {
  for (var t = [], r = 0; r < e.length; r++) {
    var n = e[r],
      o = lngLat2Mercator(n.slice(0, 2)),
      s = lngLat2Mercator(n.slice(2, 4)),
      a = Math.sqrt(Math.pow(o[0] - s[0], 2) + Math.pow(o[1] - s[1], 2));
    n.push(a), t.push(a);
  }
  return [Math.min.apply(null, t), Math.max.apply(null, t)];
}
function spliteLineAndGenGeo(e, t, r, n, o, s, a, u) {
  for (
    var i = r[0] - t[0],
    l = r[1] - t[1],
    g = a[a.length - 1],
    p = Math.round(g / s),
    c = Math.random() * p,
    v = Math.round(g / s),
    // h = ((g - u[0]) / (u[1] - u[0])) * (o - n) + n,
    h = n,
    f = 0;
    f < p;
    f++
  ) {
    for (
      var m = (-4 * h) / Math.pow(r[0] - t[0], 2),
      L = -m * (r[0] + t[0]),
      y = m * r[0] * t[0],
      C = {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: [
            [t[0] + (f * i) / p, t[1] + (f * l) / p],
            [t[0] + ((f + 1) * i) / p, t[1] + ((f + 1) * l) / p],
          ],
        },
        properties: {
          start_height:
            m * Math.pow(t[0] + (f * i) / p, 2) +
            L * (t[0] + (f * i) / p) +
            y,
          end_height:
            m * Math.pow(t[0] + ((f + 1) * i) / p, 2) +
            L * (t[0] + ((f + 1) * i) / p) +
            y,
          link_seq: (f + c) % p,
          count: v,
          total: p,
          code: a[a.length - 1],
        },
      },
      M = 0;
      M < a.length - 1;
      M++
    )
      C.properties["value" + M] = a[M];
    e.features.push(C);
  }
}
const CreateSplitPointGeoJson = function (source, h = 1000, n = 5000) {
  let list = [];
  for (let i = 0; i < source.features.length; i++) {
    let arr = [];
    const item = source.features[i];
    arr.push(...item.geometry.coordinates.flat(2));
    arr = arr.map((item) => Number(item));
    arr.push(100);
    list.push(arr);
  }
  for (
    var o = {
      type: "FeatureCollection",
      features: [],
    },
    s = _getDistanceInterval(list),
    a = 0;
    a < list.length;
    a++
  ) {
    var u = list[a];
    h = s[1] / 3000;
    spliteLineAndGenGeo(
      o,
      u.slice(0, 2),
      u.slice(2, 4),
      h,
      0,
      n,
      u.slice(4),
      s
    );
  }
  return o;
};

/**
 * @description 将面图层源转换成点图层源
 * @param {object} source
 * @return {object} source
 */
const TransToPointSource = function (source) {
  let data = _.cloneDeep(source);
  data.features.forEach((item) => {
    let center = item.properties.center;
    if (!Array.isArray(center)) {
      try {
        center = JSON.parse(center);
      } catch (e) {
        //
      }
    }
    item.geometry = {
      type: "Point",
      coordinates: center,
    };
  });
  return data;
};

/**
 * @description 创建棱柱marker
 * @param {object} map
 * @param {object} source
 * @param {object} options
 * @param {object} TooltipMaker
 * @return {null}
 */
const CreateFlatBarMarker = function (
  id,
  map,
  source,
  options,
  TooltipMaker,
  events
) {
  let minValue = 0,
    maxValue = 0;
  source.features.forEach((feature) => {
    const value = parseFloat(feature.properties.value);
    if (!isNaN(value)) {
      minValue = Math.min(minValue, value);
      maxValue = Math.max(maxValue, value);
    }
  });
  const flatBarOptions = options.flatBar,
    offsets = flatBarOptions.itemStyle.offset;
  let w = flatBarOptions.itemStyle.width;
  let range = flatBarOptions.itemStyle.range;
  let sc = range.color[0];
  let ec = range.color[1];
  let min = range.min;
  let max = range.max;

  source.features.forEach((feature) => {
    let value = feature.properties.value;
    let h = calcFlatBarHeight(
      feature.properties.value,
      minValue,
      maxValue,
      flatBarOptions.itemStyle
    );
    const lnglat = feature.properties.center;

    let rangeColor = ec;
    if (range.mode === "separate") {
      rangeColor = utils.separateColor(value, range.rules, ec);
    } else {
      rangeColor = utils.rangeColor(sc, ec, min, max, value);
    }
    const topColor = flatBarOptions?.itemStyle?.range?.show
      ? rangeColor
      : flatBarOptions.itemStyle.topColor;
    const sideLeftColor = flatBarOptions?.itemStyle?.range?.show
      ? rangeColor
      : flatBarOptions.itemStyle.sideLeftColor;
    const sideRightColor = flatBarOptions?.itemStyle?.range?.show
      ? rangeColor
      : flatBarOptions.itemStyle.sideRightColor;
    // 添加label
    const labelOptions = options.label;
    let labelHTML = "";
    const labelId = "label-" + dsf.uuid();
    if (labelOptions.show) {
      let labelEl = document.createElement("div");
      const content = labelOptions.name
        .replaceAll("{a}", labelOptions.seriesName)
        .replaceAll("{b}", feature.properties.name)
        .replaceAll("{c}", feature.properties.value);
      const defaultStyle = transLabelStyle(labelOptions.itemStyle, "string");
      let bottom =
        labelOptions.position == "center"
          ? h / 2
          : labelOptions.position == "top"
            ? h
            : 0;
      let transX = w / 2;
      if (flatBarOptions.barType == 3) {
        bottom += w;
        transX = w / 2;
      }
      labelHTML = `<div class="flatbar-label ${labelId}" style="transform: translateX(calc(-50% + ${transX}px)) translateY(50%);bottom: ${bottom}px;${defaultStyle}">${content}</div>`;
    }
    let el = document.createElement("div");
    el.classList.add("dsf-dv-gis")
    el.classList.add(id);
    el.style.width = w + "px";
    el.style.height = h + "px";
    const zoom = map.getZoom(),
      showZoom = flatBarOptions.zooms;
    let display = "block";
    if (zoom <= showZoom[0] || zoom >= showZoom[1]) {
      display = "none";
    }
    el.style.display = display;
    let offset = [0, 0];
    if (flatBarOptions.barType == 1) {
      // 面
      el.innerHTML = `
        <div class="flatbar-wrapper">
          ${labelHTML}
          <div class="card-box" style="width: ${w}px; height: ${h}px; background: ${topColor};">
          </div>
        </div>`;
      offset = [-w / 2 + offsets[0], -h];
    } else if (flatBarOptions.barType == 2) {
      // 圆柱
      const circleHeight = Math.ceil(w / 3);
      const halfCircleHeight = circleHeight / 2;
      el.innerHTML = `
        <div class="flatbar-wrapper">
          ${labelHTML}
          <div class="sylider-box" style="width: ${w}px; height: ${h}px; background: ${sideLeftColor};">
            <div class="cube cube1" style="background: ${topColor}; height: ${circleHeight}px; top: -${halfCircleHeight}px;"></div>
            <div class="cube cube2" style="background: ${topColor}; height: ${circleHeight}px; bottom: -${halfCircleHeight}px;"></div>
          </div>
        </div>`;
      offset = [-w / 2 + offsets[0], -h];
    } else {
      // 棱柱
      w = Number(Math.sqrt((w * w) / 2).toFixed(1));
      h = Number((h / 0.87).toFixed(1));
      el.innerHTML = `
        <div class="flatbar-wrapper">
          ${labelHTML}
          <div class="cube-box" style="margin-bottom: ${w}px;">
            <div class="flatbar-box" style="width: ${w}px; height: ${h}px;">
              <div class="cube cube1" style="background: ${topColor};"></div>
              <div class="cube cube2" style="background: ${sideLeftColor}; transform: translateZ(${w}px);"></div>
              <div class="cube cube3" style="background: ${sideRightColor};"></div>
            </div>
          </div>
        </div>`;
      offset = [-w / 2 + offsets[0], 0];
    }
    const flatBarMarker = new minemap.Marker(el, {
      offset: offset,
    })
      .setLngLat(lnglat)
      .addTo(map);
    flatBarMarker.getElement().addEventListener("mouseenter", (e) => {
      // 增加悬浮时样式
      editFlatBarHoverStyle(e.target, "hover", options);
      // 添加悬浮框
      TooltipMaker && TooltipMaker._show(lnglat, feature, offsets[0]);
      if (events.hover) {
        events.hover(feature.properties, feature);
      }
    });
    flatBarMarker.getElement().addEventListener("mouseleave", (e) => {
      // 移除悬浮时样式
      editFlatBarHoverStyle(e.target, "default", options);
      TooltipMaker._hide();
    });
    flatBarMarker.getElement().addEventListener("click", (e) => {
      let featureProperties = feature.properties;
      if (typeof events.click === "function") {
        events.click(featureProperties, feature);
      }
      let layerAttr = featureProperties.layerAttr;
      let seriesType = _.upperFirst(layerAttr.seriesType);
      dsf.emit.$emit(
        `GIS${seriesType}Click`,
        {
          ...featureProperties,
          layerAttr,
        },
        [window]
      );
    });
  });
};

const calcFlatBarHeight = function (value, min, max, style) {
  let height = style.height;
  if (style.isCalcHeight) {
    height = parseInt(style.basicHeight * (value / max));
  }
  height =
    height > style.heightMax
      ? style.heightMax
      : height < style.heightMin
        ? style.heightMin
        : height;
  return height;
};

const editFlatBarHoverStyle = function (el, type, options) {
  const flatBarOptions = options.flatBar,
    labelOptions = options.label,
    barType = options.flatBar.barType;
  if (!flatBarOptions.emphasis?.show) return;
  let topColor = flatBarOptions.itemStyle.topColor,
    sideLeftColor = flatBarOptions.itemStyle.sideLeftColor,
    sideRightColor = flatBarOptions.itemStyle.sideRightColor;
  if (type == "hover") {
    topColor = flatBarOptions.emphasis.itemStyle.topColor;
    sideLeftColor = flatBarOptions.emphasis.itemStyle.sideLeftColor;
    sideRightColor = flatBarOptions.emphasis.itemStyle.sideRightColor;
  }
  if (barType == 1) {
    $(el).find(".card-box").css("background", topColor);
  } else if (barType == 2) {
    $(el)
      .find(".sylider-box")
      .css("background", utils.transColorOpacity(topColor, 0.8));
    $(el).find(".cube1").css("background", topColor);
    $(el).find(".cube2").css("background", topColor);
  } else if (barType == 3) {
    $(el).find(".cube1").css("background", sideLeftColor);
    $(el).find(".cube2").css("background", sideRightColor);
    $(el).find(".cube3").css("background", topColor);
  }
  if (labelOptions.emphasis.show && type == "hover") {
    $(el)
      .find(".flatbar-label")
      .css(transLabelStyle(labelOptions.emphasis.itemStyle));
  } else {
    $(el).find(".flatbar-label").css(transLabelStyle(labelOptions.itemStyle));
  }
};

const transLabelStyle = function (styles, type) {
  let obj = {
    "font-size": styles.fontSize + "px",
    color: styles.color,
    padding: styles.padding.map((item) => {
      return item + "px";
    }),
    "text-stroke-color": styles.strokeColor,
    "background-color": styles.backgroundColor,
    "border-color": styles.borderColor,
    "border-width": styles.borderWidth + "px",
    margin: [styles.offset[1] + "px", 0, 0, styles.offset[0] + "px"],
  };
  if (type == "string") {
    let str = "";
    for (let key in obj) {
      let value = obj[key];
      if (Array.isArray(value)) {
        value = value.join(" ");
      }
      str += `${key}: ${value};`;
    }
    return str;
  }
  return obj;
};

/**
 * @description 创建贴地点marker
 * @param {object} map
 * @param {object} source
 * @param {object} options
 * @param {object} TooltipMaker
 * @return {null}
 */
const CreateScatterMarker = function (
  id,
  map,
  source,
  options,
  TooltipMaker,
  events
) {
  const scatterOptions = options.scatter;
  const w = scatterOptions.itemStyle.size[0],
    h = scatterOptions.itemStyle.size[1],
    color = scatterOptions.itemStyle.color,
    borderWidth = scatterOptions.itemStyle.borderWidth,
    borderColor = scatterOptions.itemStyle.borderColor;
  source.features.forEach((feature) => {
    const lnglat = feature.properties.center;
    // 添加label
    const labelOptions = options.label;
    let labelHTML = "";
    const labelId = "label-" + dsf.uuid();
    if (labelOptions.show) {
      let labelEl = document.createElement("div");
      const content = labelOptions.name
        .replaceAll("{a}", labelOptions.seriesName)
        .replaceAll("{b}", feature.properties.name)
        .replaceAll("{c}", feature.properties.value);
      const defaultStyle = transLabelStyle(labelOptions.itemStyle, "string");
      let transX = w / 2;
      const left =
        labelOptions.position == "left"
          ? 0
          : labelOptions.position == "right"
            ? w
            : w / 2;
      labelHTML = `<div class="scatter-label ${labelId}" style="top: ${h / 2
        }px; left: ${left}px; ${defaultStyle}">${content}</div>`;
    }
    let el = document.createElement("div");
    el.classList.add("dsf-dv-gis");
    el.classList.add("dsf-dv-gis-mine-map-scatter");
    el.classList.add(id);
    const zoom = map.getZoom(),
      showZoom = scatterOptions.zooms;
    let display = "block";
    if (zoom <= showZoom[0] || zoom >= showZoom[1]) {
      display = "none";
    }
    el.style.display = display;
    const animate = scatterOptions.itemStyle.animate,
      duration = scatterOptions.itemStyle.duration;
    el.innerHTML = `
      <div class="scatter-wrapper">
        ${labelHTML}
        <div class="scatter-box ${animate ? "animated" : ""
      }" style="width: ${w}px; height: ${h}px; background: ${color}; border: ${borderWidth}px solid ${borderColor}; border-radius: ${w / 2
      }px; animation-duration: ${duration}ms;">
        </div>
      </div>`;
    if (scatterOptions.itemStyle.texture) {
      el.innerHTML = `
        <div class="scatter-wrapper">
          ${labelHTML}
          <div class="scatter-img ${animate ? "animated" : ""
        }" style="width: ${w}px; height: ${h}px; background-image: url(${scatterOptions.itemStyle.texture
        })">
          </div>
        </div>`;
    }
    const scatterMarker = new minemap.Marker(el, {
      offset: [-w / 2, -h / 2],
      pitchAlignment: "map",
    })
      .setLngLat(lnglat)
      .addTo(map);
    let popStatus = false,
      popMarker = null;
    scatterMarker.getElement().addEventListener("mouseenter", (e) => {
      // 增加悬浮时样式
      editScatterHoverStyle(e.target, "hover", options);
      // 添加悬浮框
      if (TooltipMaker && !popMarker) {
        $(".marker-tooltip").remove();
        popStatus = false;
        popMarker = TooltipMaker._show(lnglat, feature);
        popMarker.getElement().addEventListener("mouseenter", (e2) => {
          popStatus = true;
        });
        popMarker.getElement().addEventListener("mouseleave", (e2) => {
          editScatterHoverStyle(e.target, "default", options);
          popStatus = false;
          TooltipMaker?._hide();
          popMarker = null;
        });
      }
      if (events.hover) {
        events.hover(feature.properties, feature);
      }
    });
    scatterMarker.getElement().addEventListener("mouseleave", (e) => {
      if (!popStatus) {
        // 移除悬浮时样式
        editScatterHoverStyle(e.target, "default", options);
        TooltipMaker?._hide();
        popMarker = null;
        popStatus = false;
      }
    });
    scatterMarker.getElement().addEventListener("click", (e) => {
      let featureProperties = feature.properties;
      if (typeof events.click === "function") {
        events.click(featureProperties, feature);
      }
      let layerAttr = featureProperties.layerAttr;
      let seriesType = _.upperFirst(layerAttr.seriesType);
      dsf.emit.$emit(
        `GIS${seriesType}Click`,
        {
          ...featureProperties,
          layerAttr,
        },
        [window]
      );
    });
  });
};

/**
 * @description 创建图标marker
 * @param {object} map
 * @param {object} source
 * @param {object} options
 * @param {object} TooltipMaker
 * @return {null}
 */
const CreateIconMarker = function (
  id,
  map,
  source,
  options,
  TooltipMaker,
  events
) {
  const iconOptions = options.icon;
  const w = iconOptions.itemStyle.iconSize[0],
    h = iconOptions.itemStyle.iconSize[1],
    offset = iconOptions.itemStyle.offset,
    iconUrl = iconOptions.itemStyle.icon
      ? iconOptions.itemStyle.icon
      : defaultMarker;
  source.features.forEach((feature) => {
    const lnglat = feature.properties.center;
    // 添加label
    const labelOptions = options.label;
    let labelHTML = "";
    const labelId = "label-" + dsf.uuid();
    if (labelOptions.show) {
      const content = labelOptions.name
        .replaceAll("{a}", labelOptions.seriesName)
        .replaceAll("{b}", feature.properties.name)
        .replaceAll("{c}", feature.properties.value);
      const defaultStyle = transLabelStyle(labelOptions.itemStyle, "string");
      const left =
        labelOptions.position == "left"
          ? 0
          : labelOptions.position == "right"
            ? w
            : w / 2;
      labelHTML = `<div class="icon-label ${labelId}" style="top: ${h / 2
        }px; left: ${left}px; ${defaultStyle}">${content}</div>`;
    }
    let el = document.createElement("div");
    el.classList.add("dsf-dv-gis");
    el.classList.add("dsf-dv-gis-icon");
    el.classList.add(id);
    const zoom = map.getZoom(),
      showZoom = iconOptions.zooms;
    let display = "block";
    if (zoom <= showZoom[0] || zoom >= showZoom[1]) {
      display = "none";
    }
    el.style.display = display;

    el.innerHTML = `<div class="icon-wrap">
      ${labelHTML}
      <img class="icon-img" src="${iconUrl}" width="${w}" height="${h}"/>
    </div>`;

    const iconMarker = new minemap.Marker(el, {
      offset: [-w / 2, -h / 2],
      pitchAlignment: "map",
    })
      .setLngLat(lnglat)
      .addTo(map);
    let popStatus = false,
      popMarker = null;
    iconMarker.getElement().addEventListener("mouseenter", (e) => {
      // 添加悬浮框
      if (TooltipMaker && !popMarker) {
        $(".marker-tooltip").remove();
        popStatus = false;
        popMarker = TooltipMaker._show(lnglat, feature);
        popMarker.getElement().addEventListener("mouseenter", (e2) => {
          popStatus = true;
        });
        popMarker.getElement().addEventListener("mouseleave", (e2) => {
          editScatterHoverStyle(e.target, "default", options);
          popStatus = false;
          TooltipMaker?._hide();
          popMarker = null;
        });
      }
      if (events.hover) {
        events.hover(feature.properties, feature);
      }
    });
    iconMarker.getElement().addEventListener("mouseleave", (e) => {
      if (!popStatus) {
        TooltipMaker?._hide();
        popMarker = null;
        popStatus = false;
      }
    });
    iconMarker.getElement().addEventListener("click", (e) => {
      let featureProperties = feature.properties;
      if (typeof events.click === "function") {
        events.click(featureProperties, feature);
      }
      let layerAttr = featureProperties.layerAttr;
      let seriesType = _.upperFirst(layerAttr.seriesType);
      dsf.emit.$emit(
        `GIS${seriesType}Click`,
        {
          ...featureProperties,
          layerAttr,
        },
        [window]
      );
    });
  });
};

const editScatterHoverStyle = function (el, type, options) {
  const scatterOptions = options.scatter,
    labelOptions = options.label;
  if (!scatterOptions.emphasis?.show) return;
  let color = scatterOptions.itemStyle.color,
    borderColor = scatterOptions.itemStyle.borderColor;
  if (type == "hover") {
    color = scatterOptions.emphasis.itemStyle.color;
    borderColor = scatterOptions.emphasis.itemStyle.borderColor;
  }
  $(el).find(".scatter-box").css("background", color);
  $(el).find(".scatter-box").css("border-color", borderColor);
  if (labelOptions.emphasis.show && type == "hover") {
    $(el)
      .find(".scatter-label")
      .css(transLabelStyle(labelOptions.emphasis.itemStyle));
  } else {
    $(el).find(".scatter-label").css(transLabelStyle(labelOptions.itemStyle));
  }
};

/**
 * @description 过滤地图geojson数据
 * @param {object} source 地图来源路径活对象
 */
const FilterSourceValue = function (source) {
  source.features = source.features.map((item) => {
    if (item.properties.value == undefined) {
      item.properties.value = "";
    }
    return item;
  });
  return source;
};

export {
  AddDataToSource,
  AddEventHandler,
  MineMapHoverFunction,
  MineMapQueryDistrict,
  TransPointLayerStyle,
  TransLabelLayerStyle,
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
};
