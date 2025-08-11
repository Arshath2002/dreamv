/*
 * @Editor: zhanghang
 * @Description: 标记图层配置
 * @Date: 2024-07-05 15:45:32
 * @LastEditors: zhanghang
 * @LastEditTime: 2024-07-23 15:16:47
 */
import createLabel from "./createLabel";
const label = createLabel();
label.itemStyle.padding = [2, 5, 2, 5]
label.itemStyle.backgroundColor = "rgba(50,50,50,0.7)"
export default function () {
  return {
    type: "marker",
    seriesName: "marker",
    symbol: "default",
    symbolSize: [20, 20],
    symbolSizeFormatter: null,
    offset: [0, 0],
    className: "",
    label,
    nameRelation: "",
    valueRelation: "",
    districtRelation: "",
    data: [
    ],
  };
}
