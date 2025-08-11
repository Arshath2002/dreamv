/*
 * @Description: 
 * @Author: zhanghang
 * @Date: 2023-08-17 10:55:56
 * @LastEditors: zhanghang
 * @LastEditTime: 2023-09-27 17:26:05
 */
export default {
  tooltip: {
    show: true,
    content: "",
    isFormatter: false, // 是否格式化
    formatterHtml: "", // 格式化的html
    formatter: function (f) {

      var name = f.properties.name || "-- ";
      var value = f.properties.value === undefined ? "-- " : f.properties.value;
      return "<span>" + name + "：</span>" + "<span>" + value + "</span>";
    },
    zIndex: 120,
    offset: [0, 0],
    position: "top-right",
    zooms: [2, 20],
    cursor: "pointer",
    itemStyle: {
      backgroundColor: "rgba(50,50,50,0.7)",
      borderColor: "#333",
      borderWidth: 0,
      padding: 10,
      color: "#fff",
      fontSize: 14,
      minWidth: 80,
      width: "max-content",
      borderRadius: 5,
      borderStyle: "solid"
    }
  }
}