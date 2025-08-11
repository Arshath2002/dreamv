/*
 * @Description:
 * @Author: zhanghang
 * @Date: 2023-08-15 17:26:42
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-04-28 09:27:42
 */

import AMapProxy from "./mapType/AMap/AMap";
import BMapProxy from "./mapType/BMap/BMap";
import MineMapProxy from "./mapType/MineMap/MineMap";

function findLayersById(ids, layersMap) {
  //筛选所有图层
  if (!ids) {
    return Array.from(layersMap.values()).reduce((arr, cur) => arr.concat(cur), []);
  }
  ids = Array.isArray(ids) ? ids : [ids];
  let layers = [];
  ids.forEach((id) => {
    let _layers = layersMap.get(id);
    if (_layers) {
      layers.push(..._layers);
    }
  });
  return layers;
}

function dealVmLayerById(handler, ids, operation) {
  if (operation === "delete") {
    if (!ids) {
      handler.length = 0;
      return;
    }
    handler = handler.filter((it) => !ids.includes(it.layerId));
  } else {
    handler.forEach((it) => {
      if (ids.includes(it.layerId)) {
        it.show = operation;
      }
    });
  }
}
/**
 * @description 地图基类
 * @param {object} mapType 地图类型
 */
class BaseMap {
  constructor(mapType) {
    this.isLoad = false;
    //地图图层
    this.layers = new Map();

    //地图种类对象
    this.maps = {
      AMap: AMapProxy,
      BMap: BMapProxy,
      MineMap:MineMapProxy,
    };

    const MapProxy = this.maps[mapType];
    const instance = this;
    //实际API对象
    this.MapAPI = new MapProxy(instance);
  }
  /**
   * @description 地图API加载
   * @param {无}
   * @return {无}
   */
  initAPIJS() {
    return this.MapAPI.initAPIJS();
  }

  /**
   * @description 地图resize
   * @param {无}
   * @return {无}
   */
  resize() {
    return this.MapAPI.resize();
  }

  /**
   * @description 设置地图风格
   * @param {string} styleName 风格名称
   * @return {无}
   */
  setMapStyle(styleName) {
    return this.MapAPI.setMapStyle(styleName);
  }

  /**
   * @description 设置地图中心
   * @param {array} center [lng,lat]
   * @return {无}
   */
  setCenter(center) {
    return this.MapAPI.setCenter(center);
  }

  /**
   * @description 设置地图缩放级别
   * @param {string} zoom
   * @return {无}
   */
  setZoom(zoom) {
    return this.MapAPI.setZoom(zoom);
  }

  /**
   * @description 设置地图俯角
   * @param {string} pitch
   * @return {无}
   */
  setPitch(pitch) {
    return this.MapAPI.setPitch(pitch);
  }

  /**
   * @description 设置地图旋转角
   * @param {string} rotation
   * @return {无}
   */
  setRotation(rotation) {
    return this.MapAPI.setRotation(rotation);
  }

  /**
   * @description 设置地图要素
   * @param {array} features 要素数组
   * @return {无}
   */
  setFeatures(features) {
    return this.MapAPI.setFeatures(features);
  }

  /**
   * @description 设置中心城市
   * @param {object} city 对象 center,level
   * @param {number} zoom 缩放层级
   * @return {无}
   */
  setCity(city, zoom) {
    //地图未加载，触发该方法
    if (!this.isLoad) {
      this.cacheExecFn.push({
        key: this.setCity,
        args: arguments,
      });
      return false;
    }
    return this.MapAPI.setCity(city, zoom);
  }

  /**
   * @description 地图初始化
   * @param {object} options => (center：中心点,zoom：放大倍数,pitch：俯角,rotation：旋转角度)
   * @return {object} map 实例
   */
  initMap(el, options) {
    return this.MapAPI.initMap(el, options);
  }

  /**
   * @description 获取地图基础属性
   * @param {无}
   * @return {object} property center：中心点,zoom：放大倍数,pitch：俯角,rotation：旋转角度
   */
  getMapProperties() {
    return this.MapAPI.getMapProperties();
  }

  /**
   * @description 添加点图层
   * @param {object|string} source
   * @param {object} options => 图层配置
   * @return {无}
   */
  addPointLayer() {
    return this.MapAPI.addPointLayer(...arguments);
  }

  /**
   * @description 添加贴地点图层
   * @param {object|string} source
   * @param {object} options => 图层配置
   * @return {无}
   */
  addScatterLayer() {
    return this.MapAPI.addScatterLayer(...arguments);
  }

  /**
   * @description 添加面图层
   * @param {string} id => 图层id 必填
   * @param {string} source geojson 必填
   * @param {object} extraData 额外数据 选填
   * @param {object} options => 参考 options polygon.js 选填
   * @param {object} events => {click:点击事件，hover:hover事件,complete:加载完成事件} 选填
   * @return {无}
   */
  addPolygonLayer() {
    return this.MapAPI.addPolygonLayer(...arguments);
  }

  /**
   * @description 添加柱体图层
   * @param {string} id => 图层id 必填
   * @param {string} source geojson 必填
   * @param {object} extraData 额外数据 选填
   * @param {object} options => 参考 options flatBar.js 选填
   * @param {object} events => {click:点击事件，hover:hover事件,complete:加载完成事件} 选填
   * @return {无}
   */
  addFlatBarLayer() {
    return this.MapAPI.addFlatBarLayer(...arguments);
  }

  /**
   * @description 添加热力图层
   * @param {object|string} source
   * @param {object} options => 图层配置
   *@return {无}
   */
  addHeatMapLayerLayer() {
    return this.MapAPI.addHeatMapLayerLayer(...arguments);
  }

  /**
   * @description 添加飞行线图层
   * @param {object|string} source
   * @param {object} options => 图层配置
   *@return {无}
   */
  addPulseLinkLayer() {
    return this.MapAPI.addPulseLinkLayer(...arguments);
  }

  /**
   * @description 添加图标图层
   * @param {object|string} source
   * @param {object} options => 图层配置
   * @return {无}
   */
  addIconLayer() {
    return this.MapAPI.addIconLayer(...arguments);
  }

  /**
   * @description 是否含有该图层
   * @param {object|string} source
   * @param {object} options => 图层配置
   *@return {无}
   */
  hasLayersByIds() {}

  /**
   * 当为空则显示所有图层,传入的为图层的数组id
   * @param {undefined | Array[number]} ids
   */
  showLayers(ids) {
    let layers = findLayersById(ids, this.layers);
    ids = Array.isArray(ids) ? ids : [ids];
    dealVmLayerById(this.vm.collectLayers, ids, true);
    this.MapAPI.showLayers(layers);
  }

  /**
   * 当为空则隐藏所有图层,传入的为图层的数组id
   * @param {undefined | Array[number]} ids
   */
  hideLayers(ids) {
    let layers = findLayersById(ids, this.layers);
    ids = Array.isArray(ids) ? ids : [ids];
    dealVmLayerById(this.vm.collectLayers, ids, false);
    this.MapAPI.hideLayers(layers);
  }

  /**
   * 当为空则清除所有图层,传入的为图层的数组id
   * @param {undefined | Array[number]} ids
   */
  removeLayers(ids) {
    let layers = findLayersById(ids, this.layers);
    if (layers.length) {
      this.MapAPI.removeLayers(layers);
    }
    ids = Array.isArray(ids) ? ids : [ids];
    dealVmLayerById(this.vm.collectLayers, ids, "delete");
    if (!ids) {
      this.layers.clear();
    } else {
      ids = Array.isArray(ids) ? ids : [ids];
      ids.forEach((id) => {
        this.layers.delete(id);
      });
    }
  }
  
  /**
   * 视野控制在某个图层
   * @param {undefined | Array[number]} ids
   */
  setFitView(ids){
    let layers = findLayersById(ids, this.layers);
    if (layers.length) {
      this.MapAPI.setFitView(layers);
    }else {
      return this.MapAPI.setFitView();
    }
   
  }
  
  /**
   * @description 飞行到某个点位
   * @param {object} options =>
   * {Array[Array]} coordinates => 点位坐标支持多个点位[lng,lat],[[lng,lat]]
   * {Array[Number]} avoid => [60,60,60,60] 四周边距
   * {Boolean} immediately =>true 是否需要动画
   * {Number} zoom => 10 缩放级别
   * @return {无}
   */
  flyToView(options) {
    return this.MapAPI.flyToView(options);
  }
  /**
   * @description 摧毁地图
   * @param {无}
   * @return {无}
   */
  destroy() {
    this.MapAPI.destroy();
  }
  /**
   * @description 查询行政区域 只查询到子级
   * @param {string} adcode 行政区域编码
   * @return {object} geojson
   */
  queryDistrictByCode() {
    return this.MapAPI.queryDistrictByCode(...arguments);
  }
  /**
   * @description 查询行政区域
   * @param {string} level 查询级别
   * @return {object} geojson
   */
  queryParticularDistrictByCode() {
    return this.MapAPI.queryParticularDistrictByCode(...arguments);
  }

  /**
   * @description 查询行政点位
   * @param {string} adcode 行政区域编码
   * @param {object} extraData 点位额外数据
   */
  queryPointByCode() {
    return this.MapAPI.queryPointByCode(...arguments);
  }
  /**
   * @description 查询多个行政点位
   * @param {string} adcode 行政区域编码
   * @param {object} extraData 点位额外数据
   */
  queryMultiPointsByCode() {
    return this.MapAPI.queryMultiPointsByCode(...arguments);
  }
}
export default BaseMap;
