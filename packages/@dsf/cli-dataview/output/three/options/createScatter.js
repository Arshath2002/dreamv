/*
 * @Editor: zhanghang
 * @Description:
 * @Date: 2024-07-16 11:17:47
 * @LastEditors: zhanghang
 * @LastEditTime: 2024-07-23 17:49:54
 */
import createLabel from "./createLabel";
const label = createLabel();
label.show = false;
export default function () {
  return {
    type: "scatter",
    seriesName: "scatter",
    spotColor: "rgb(6, 209, 25)",
    spotSize: 8,
    spotSizeFormatter: null,
    spotSeparate: 50,
    ringColor: "rgb(95, 163, 111)",
    ringRatio: 2,
    ringSeparate: 50,
    offset: [0, 0],
    label,
    nameRelation: "",
    valueRelation: "",
    districtRelation: "",
    data: [],
  };
}
