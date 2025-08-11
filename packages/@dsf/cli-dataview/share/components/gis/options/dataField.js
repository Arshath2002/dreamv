/*
 * @Description: gis映射字段
 * @Author: shenah
 * @Date: 2023-09-07 17:52:59
 * @LastEditors: shenah
 * @LastEditTime: 2023-09-11 16:38:00
 */
export default {
  //数据配置
  dataConfig: {
    //地图加载状态：load：初始化 down：下转，none：不加载
    status: "load",
    //数据类型 code 行政区域编码 lnglat 经纬度  geo
    dataType: "code",

    tolerance: "0.005",//行政区域抽稀系数
    //行政编码映射字段
    adCodeRelation: "",
    //行政区域code 面图层需要的字段
    districtCode: "100000",
    //当为经纬度时,区域 面图层需要的字段
    districtRelation: "",
    //点图层类型：点、热力、贴地点、棱柱 需要的映射字段
    lngRelation: "",
    latRelation: "",

    //飞行线需要的映射字段
    startRelation: "",
    endRelation: "",

    //所有图层都需要的图层
    nameRelation: "", //名称映射字段
    valueRelation: "", //值映射字段
  },
};
