/*
 * @Editor: zhanghang
 * @Description: 
 * @Date: 2024-08-30 15:24:06
 * @LastEditors: zhanghang
 * @LastEditTime: 2024-08-30 17:52:27
 */
export const tooltip = {
  show: true,
  content: "",
  styleType: "custom",
  isFormatter: false, // 是否格式化
  formatterHtml: "", // 格式化的html
  formatter: function (data) {
    var name = data.name || "-- ";
    var value = data.value === undefined ? "-- " : data.value;
    return "<span>" + name + "：</span>" + "<span>" + value + "</span>";
  },
  itemStyle: {
    backgroundColor: "rgba(50,50,50,0)",
    borderColor: "#333",
    borderWidth: 0,
    padding: [10, 10, 10, 10],
    color: "#fff",
    fontSize: 14,
    minWidth: 80,
    width: "max-content",
    borderRadius: 5,
    borderStyle: "solid",
  },
};
