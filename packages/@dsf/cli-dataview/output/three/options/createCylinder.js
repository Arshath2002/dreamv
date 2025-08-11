/*
 * @Editor: zhanghang
 * @Description:
 * @Date: 2024-07-23 14:07:32
 * @LastEditors: zhanghang
 * @LastEditTime: 2024-07-24 11:52:44
 */
import createLabel from "./createLabel";
const label = createLabel();
label.offset = [0, 1];
export default function () {
  return {
    type: "cylinder",
    seriesName: "cylinder",
    mode: "cylinder", // cylinder 圆柱 tower 光柱
    towerColor: "#FFF",
    color: ["#003e62", "#00E6E6"],
    size: 25,
    maxHeight: 100,
    minHeight: 10,
    separate: 100,
    offset: [0, 0],
    label,
    nameRelation: "",
    valueRelation: "",
    districtRelation: "",
    data: [],
  };
}
