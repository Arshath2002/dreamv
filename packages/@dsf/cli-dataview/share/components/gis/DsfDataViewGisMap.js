/*
 * @Description:
 * @Author: zhanghang
 * @Date: 2023-08-14 10:36:44
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-04-27 20:08:10
 */
import BaseMap from "./baseMap";
import utils from "_dataview/output/utils/gis.js";
//业务类，提供业务级别方法
class DsfDataViewGisMap extends BaseMap {
  /**
   * @description 地图业务类
   * @param {object} options => (center：中心点,zoom：放大倍数,pitch：俯角,rotation：旋转角度)
   * @param {string} mapType 地图类型 默认高德
   * @return {object} map 实例
   */
  constructor(el, options, mapType = "AMap", vm) {
    super(mapType);
    this.el = el;
    this.mapType = mapType;
    this.options = options;
    //地图维未加载之前，调用了图层方法
    this.cacheExecFn = [];
    // 地图信息缓存
    this.adcodeCacheInfo = new Map();

    //vue gis组件实例
    this.vm = vm;

    //加载apijs 初始化地图
    this.initAPIJS().then(() => {
      const status = this.initMap(el, options);
      if (status instanceof Promise) {
        status.then(() => {
          dsf.emit.$emit("GISLoad", {}, [window]);
          this.afterLoad();
        });
        return;
      }
      dsf.emit.$emit("GISLoad", {}, [window]);
      this.afterLoad();
    });
  }
  /**
   * @description 地图加载完成之后执行
   * @param {无}
   * @return {无}
   */
  afterLoad() {
    this.isLoad = true;
    while (this.cacheExecFn.length) {
      let execFn = this.cacheExecFn.shift();
      let { key, args } = execFn;
      key.call(this, ...args);
    }
  }
  /**
   * @description 通过经纬度数据
   * @param {string} id 图层id 必填
   * @param {array} data 点位数据 必填
   * @param {string} layerType point 点位；heatMap 热力图；scatter 贴地点
   * @param {object} options 图层配置项参考相关配置
   * @param {object} events 图层事件对象
   * @param {object} useOptions 用于区别图层里面又分类别等属性
   * @return {无}
   */
  addPointLayerByLngLat(id, data, options, layerType = "point", extraData = [], events, useOptions) {
    //地图未加载，触发该方法
    if (!this.isLoad) {
      this.cacheExecFn.push({
        key: this.addPointLayerByLngLat,
        args: arguments,
      });
      return false;
    }

    if (!Array.isArray(data) || data.length === 0) return false;

    let featureCollection = [];
    data.forEach((it) => {
      let { lng, lat, ...properties } = it;
      if (lng && lat) {
        featureCollection.push(utils.point([lng, lat], properties));
      }
    });
    let geo = utils.featureCollection(featureCollection);

    switch (layerType) {
      case "point":
        //加载点位图层
        this.addPointLayer(id, geo, extraData, options, events);
        break;
      case "heatMap":
        //加载热力图层
        this.addHeatMapLayerLayer(id, geo, extraData, options, events);
        break;
      case "scatter":
        //加载贴地点图层
        this.addScatterLayer(id, geo, extraData, options, events);
        break;
      case "flatBar":
        // 加载平面柱
        this.addFlatBarLayer(id, geo, extraData, options, events, useOptions);
        break;
      case "icon":
        //加载图标图层
        this.addIconLayer(id, geo, extraData, options, events);
        break;
    }
  }

  /**
   * @description 通过行政编码加载点位数据
   * @param {string} id 图层id 必填
   * @param {array} data 点位数据 必填
   * @param {string} layerType point 点位；heatMap 热力图；scatter 贴地点 flatBar 柱体
   * @param {object} options 图层配置项参考相关配置
   * @param {object} events 图层事件对象
   * @param {object} useOptions 伪代码传入过来
   * @return {无}
   */
  addPointLayerByCode(id, data, options, layerType = "point", extraData = [], events, useOptions = {}) {
    //地图未加载，触发该方法
    if (!this.isLoad) {
      this.cacheExecFn.push({
        key: this.addPointLayerByCode,
        args: arguments,
      });
      return false;
    }
    if (!Array.isArray(data) || data.length === 0) return false;
    let featureCollection = [];
    this.vm.loadingMap = true;
    //查询多个点位
   return this.queryMultiPointsByCode(data).then((res) => {
      this.vm.loadingMap = false;
      res.forEach((result) => {
        let { point, properties } = result;
        if (point) {
          featureCollection.push(utils.point(point, properties));
        }
      });

      let geo = utils.featureCollection(featureCollection);

      switch (layerType) {
        case "point":
          //加载点位图层
          this.addPointLayer(id, geo, extraData, options, events);
          break;
        case "heatMap":
          //加载热力图层
          this.addHeatMapLayerLayer(id, geo, extraData, options, events);
          break;
        case "scatter":
          //加载贴地点图层
          this.addScatterLayer(id, geo, extraData, options, events);
          break;
        case "flatBar":
          // 加载平面柱
          this.addFlatBarLayer(id, geo, extraData, options, events, useOptions);
          break;
        case "icon":
          //加载图标图层
          this.addIconLayer(id, geo, extraData, options, events);
          break;
      }
    });
  }
  /**
   * @description 通过经纬度添加飞行线
   * @param {string} id 图层id 必填
   * @param {object} data 飞行数据 必填
   * @param {object} options 图层配置项参考相关配置
   * @param {object} events 图层事件对象
   * @return {无}
   */
  addPulseLinkLayerByLngLat(id, data, options, events) {
    //地图未加载，触发该方法
    if (!this.isLoad) {
      this.cacheExecFn.push({
        key: this.addPulseLinkLayerByLngLat,
        args: arguments,
      });
      return false;
    }
    //data [[[],[]]]
    if (!Array.isArray(data) || !Array.isArray(data[0])) return false;

    let featureCollection = [];
    data.forEach((point) => {
      if (point[0] && point[1]) {
        featureCollection.push(utils.lineString([point[0], point[1]]));
      }
    });
    const source = utils.featureCollection(featureCollection);
    this.addPulseLinkLayer(id, source, [], options, events);
  }
  /**
   * @description 通过行政编码飞行线
   * @param {string} id 图层id 必填
   * @param {object} data 飞行数据 必填
   * @param {object} options 图层配置项参考相关配置
   * @param {object} events 图层事件对象
   * @return {无}
   */
  addPulseLinkLayerByCode(id, data, options, events) {
    //地图未加载，触发该方法
    if (!this.isLoad) {
      this.cacheExecFn.push({
        key: this.addPulseLinkLayerByCode,
        args: arguments,
      });
      return false;
    }
    //data 必须是二位数组
    if (!Array.isArray(data) || !Array.isArray(data[0])) return false;
    let pointSet = new Set();
    data.forEach((point) => {
      if (point[0] && point[1]) {
        pointSet.add(point[0]);
        pointSet.add(point[1]);
      }
    });
    let featureCollection = [];
    if (!Array.from(pointSet).length) return false;
    //查询多个点位
    this.vm.loadingMap = true;
    this.queryMultiPointsByCode(Array.from(pointSet)).then((res) => {
      this.vm.loadingMap = false;
      data.forEach((it) => {
        let s = it[0]; //起点
        let e = it[1]; //终点

        let spoint = null;
        let epoint = null;

        if (typeof s === "string") {
          spoint = res.find((re) => re.properties.adcode == s);
        } else if (dsf.isObject(s)) {
          spoint = res.find((re) => re.properties.adcode == s.adcode);
        }
        if (typeof e === "string") {
          epoint = res.find((re) => re.properties.adcode == e);
        } else if (dsf.isObject(e)) {
          epoint = res.find((re) => re.properties.adcode == e.adcode);
        }
        //起点、终点同时存在
        if (spoint && epoint) {
          Object.keys(spoint.properties).forEach((key) => {
            spoint.properties[`s${key}`] = spoint.properties[key];
          });
          Object.keys(epoint.properties).forEach((key) => {
            epoint.properties[`e${key}`] = epoint.properties[key];
          });
          featureCollection.push(
            utils.lineString([spoint.point, epoint.point], {
              ...spoint.properties,
              ...epoint.properties,
            })
          );
        }
      });
      const source = utils.featureCollection(featureCollection);
      this.addPulseLinkLayer(id, source, [], options, events);
    });
  }
  /**
   * @description 通过行政编码加载地图区域
   * @param {string} id 图层id 必填
   * @param {string} code 行政区域编码 必填
   * @param {object} options 图层配置项参考polygon.js
   * @param {object} events 图层事件对象
   * @param {array}  extraData 额外参数
   * @return {无}
   */
  addPolygonLayerByCode(id, code, options, extraData = [], events, tolerance = 0.005) {

    //地图未加载，触发该方法
    if (!this.isLoad) {
      this.cacheExecFn.push({
        key: this.addPolygonLayerByCode,
        args: arguments,
      });
      return false;
    }
    if (!code || code == "undefined") return false;
    // 由于全国Geojson过大 暂时加载本地的json
    if (code === "100000") {
      this.addPolygonLayer(id, dsf.url.getWebPath("static/js/libs/three/geoJson/details_china.json", __DSF_DATAVIEW_PATH__), extraData, options, events);
    } else {
      let _adcodeInfo = this.adcodeCacheInfo.get(code);
      if (_adcodeInfo) {
        const { geo, boundaries } = _adcodeInfo;
        this.addPolygonLayer(id, geo, extraData, options, events, boundaries);
        return;
      }

      this.vm.loadingMap = true;
      this.queryDistrictByCode(code, tolerance).then(({ geo, boundaries }) => {
        this.adcodeCacheInfo.set(code, { geo, boundaries });
        this.vm.loadingMap = false;
        //绘制区域
        this.addPolygonLayer(id, geo, extraData, options, events, boundaries);
      });

    }
  }
  /**
   * @description 通过行政编码加载地图区域
   * @param {string} id 图层id 必填
   * @param {string} code 行政区域编码 必填
   * @param {object} options 图层配置项参考polygon.js
   * @param {object} events 图层事件对象
   * @param {array}  extraData 额外参数
   * @param {string} level 查询层级
   * @return {无}
   */
  addParticularPolygonLayerByCode(id, code, level, options, extraData = [], events, tolerance = 0.005) {
    //地图未加载，触发该方法
    if (!this.isLoad) {
      this.cacheExecFn.push({
        key: this.addParticularPolygonLayerByCode,
        args: arguments,
      });
      return false;
    }
    if (!code || code == "undefined") return false;
    let _adcodeInfo = this.adcodeCacheInfo.get(code);
    if (_adcodeInfo) {
      const { geo } = _adcodeInfo;
      this.addPolygonLayer(id, geo, extraData, options, events, []);
      return;
    }
    this.vm.loadingMap = true;
    this.queryParticularDistrictByCode(code, level, tolerance).then((res) => {
      if (!res) return false;
      let { geo } = res;
      this.adcodeCacheInfo.set(code, { geo });
      this.vm.loadingMap = false;
      //绘制区域
      this.addPolygonLayer(id, geo, extraData, options, events, []);
    });
  }
  /**
   * @description 通过经纬度数据
   * @param {string} id 图层id 必填
   * @param {array} data 面层数据
   * @param {object} options 图层配置项参考相关配置
   * @param {object} events 图层事件对象
   * @return {无}
   */
  addPolygonLayerByLngLat(id, data, options, extraData = [], events) {
    //地图未加载，触发该方法
    if (!this.isLoad) {
      this.cacheExecFn.push({
        key: this.addPolygonLayerByLngLat,
        args: arguments,
      });
      return false;
    }
    if (!Array.isArray(data) || data.length === 0) return false;
    let threeDimensions = [];
    data.forEach((it) => {
      let properties = {
        ...it,
      };
      let coordinates = utils.handleDataToThreeDimensions(it.districtArr);
      delete it.districtArr;
      if (coordinates.length) {
        threeDimensions.push({
          coordinates,
          properties,
        });
      }
    });
    let features = [];
    threeDimensions.forEach((item) => {
      let feature = utils.multiPolygonFromPoint(item.coordinates, item.properties);
      features.push(feature);
    });
    if (features.length) {
      let geo = utils.featureCollection(features);
      this.addPolygonLayer(id, geo, extraData, options, events);
    }
  }
  /**
   * @description 查询行政下级区域列表
   * @param {string} adcode 行政区域编码 必填
   * @param {number} deep 深度 选填
   * @return {promise} list
   */
  queryDistrictListByCode(adcode, deep) {
    return this.MapAPI.queryDistrictListByCode(adcode, deep);
  }
  /**
   * @description 获取地图类型
   * @return {string}
   */
  getMapType() {
    return this.MapAPI.getMapType();
  }
}
export default DsfDataViewGisMap;
