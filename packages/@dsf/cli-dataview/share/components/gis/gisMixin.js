/*
 * @Description: 
 * @Author: zhanghang
 * @Date: 2023-09-12 15:26:47
 * @LastEditors: shenah
 * @LastEditTime: 2023-11-17 18:26:42
 */
import dataAndGraphRelationMixin from "_dataview/mixins/dataAndGraphRelationMixin.js";
export default {
  mixins: [$mixins.dataView, dataAndGraphRelationMixin],
  methods: {
    /**
  * @description 在Gis运行一张图情况下跳转页面
  * @param {string} path 切换viewPart路径
  * @return {无}
  */
    gisToPage(path) {
      if (this.$refs.viewPart && path) {
        this.$refs.viewPart.updatePath(path)
      }
    },

    /**
    * @description 在Gis运行一张图情况下跳转页面
    * @param {string} layerId 图层id
    * @return {object} data 图层数据
    */
    handleSettingLayerData(layerId, data) {
      return this.setLayerData(layerId, data)

    },
    /**
   * @description 行政区域下转
   * @param {string|oject} city 行政区域编码 必填
   * @param {string} layerId 是否使用图层id 选填
   * @param {data} data 展示的数据
   * @return {无}
   */
    handleDownMap(city, layerId, data = []) {
      let code = city
      if (dsf.isObject(city)) {
        code = city.adcode
      }

      this._DsfDataViewGisMap.setCity(city);
      let layerStyle = this.layerStyles[layerId];
      //如果该图层存在
      if (layerStyle) {
        layerStyle.dataConfig.districtCode = code.toString();
        this.setLayerData(layerId, data)
      }
    },
    /**
   * @description 添加面图层
   * @param {string} id 图层id 必填
   * @param {object} data 数据 选填
   * @param {string} adcode 面图层的行政编码 选填
   * @param {string} layerId 是否使用图层id 选填
   * @return {无}
   */
    handleFakeAddPloygonLayer(id, data, adcode, layerId) {
      if (!adcode && !layerId) return false
      //geojson
      if (dsf.isObject(data)) {
        this.addGeoDataLayer(id, data, layerId, "polygon");
      } else if (Array.isArray(data)) {
        let item = data[0]
        if (item) {
          //行政编码点
          if (item.adcode) {
            this.addCodeDataLayer(id, data, layerId, "polygon", adcode)
            //经纬度
          } else if (item.districtArr) {
            this.addLngLatDataLayer(id, data, layerId, "polygon")
          }
          //加载空图层
        } else {
          this.addCodeDataLayer(id, [], layerId, "polygon", adcode)
        }
      }
    },
    /**
  * @description 添加点、热力、贴地点、棱柱等图层
  * @param {string} id 图层id 必填
  * @param {object} data 数据 选填
  * @param {string} layerId 是否使用图层id 选填
  * @param {object} options 参照各个点位的options  选填
  * @return {无}
  */
    handleFakeAddPointTypeLayer(type, id, data, layerId, options = {}) {
      data = !Array.isArray(data) ? [data] : data
      let pointItem = data[0]
      if (pointItem) {
        //行政编码点
        if (pointItem.adcode) {
          this.addCodeDataLayer(id, data, layerId, type, undefined, options)
        } else {
          this.addLngLatDataLayer(id, data, layerId, type, options)
        }
      }
    },
    handleFakeAddPulseLinkLayer(id, data, layerId) {
      if (!Array.isArray(data) || !Array.isArray(data[0])) return false
      let cell = data[0][0]
      //认为是行政编码
      if (typeof cell === "string") {
        this.addCodeDataLayer(id, data, layerId, "pulseLink")
        //经纬度
      } else if (Array.isArray(cell)) {
        this.addLngLatDataLayer(id, data, layerId, "pulseLink")
        //对象模式
      } else if (dsf.isObject(cell)) {
        this.addLngLatDataLayer(id, data, layerId, "pulseLink")
      }
    },
    //区域点击依赖组件关联方法
    loadDistrictClickEvents(data, clickEvent) {
      try {
        let { fn } = this.eventRelativeDeal[clickEvent];
        //给组件设置当前数据
        this.currentComponentData = data;
        this.handleCommonEmit(fn, data);
      } catch (e) {
        console.error(e);
      }
    },
    //隐藏图层
    handleHiddenMapLayer(ids) {
      this._DsfDataViewGisMap.hideLayers(ids)
    },
    //显示图层
    handleShowMapLayer(ids) {
      this._DsfDataViewGisMap.showLayers(ids)
    },
    //删除图层
    handleDeleteMapLayer(ids) {
      this._DsfDataViewGisMap.removeLayers(ids)
    },
    //设置缩放层级
    handleSetMapZoom(zoom) {
      this._DsfDataViewGisMap.setZoom(zoom)
    }
  }
}