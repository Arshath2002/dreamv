/*
 * @Editor: zhanghang
 * @Description:
 * @Date: 2024-08-26 11:22:48
 * @LastEditors: zhanghang
 * @LastEditTime: 2024-09-11 17:04:24
 */
import createLabel from "./createLabel";
const label = createLabel();
label.itemStyle.padding = [0, 5, 0, 5];
export default function () {
  return {
    type: "lightBar",
    seriesName: "lightBar",
    color: "#FFFF77",
    size: 10,
    label,
    maxHeight: 100,
    minHeight: 30,
    offset: 0.2,
    scale: 10,
    className: "",
    nameRelation: "",
    valueRelation: "",
    districtRelation: "",
    data: [],
  };
}
