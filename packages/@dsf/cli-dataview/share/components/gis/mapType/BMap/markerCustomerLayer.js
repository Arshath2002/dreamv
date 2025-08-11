/*
 * @Description: 创建marker自定义图层
 * @Author: shenah
 * @Date: 2023-10-10 18:06:50
 * @LastEditors: shenah
 * @LastEditTime: 2023-10-16 17:00:58
 */

// 创建Marker图层
function MarkerCustomerLayer(map, options) {
  this.map = map;
  this.options = options;
  this.markers = []; // 存储标记的数组
}
// 添加标记到自定义图层
MarkerCustomerLayer.prototype.addMarker = function (marker) {
  this.markers.push(marker);
  this.map.addOverlay(marker);
};

// 从自定义图层中删除所有标记
MarkerCustomerLayer.prototype.remove = function () {
  for (var i = 0; i < this.markers.length; i++) {
    var marker = this.markers[i];
    this.map.removeOverlay(marker);
  }
  this.markers = [];
};

// 从自定义图层中显示标记
MarkerCustomerLayer.prototype.show = function () {
  for (var i = 0; i < this.markers.length; i++) {
    var marker = this.markers[i];
    marker.show();
  }
};
// 从自定义图层中隐藏
MarkerCustomerLayer.prototype.hide = function () {
  for (var i = 0; i < this.markers.length; i++) {
    var marker = this.markers[i];
    marker.hide();
  }
};

export default MarkerCustomerLayer;
