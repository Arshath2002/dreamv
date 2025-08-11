/*
 * @Editor: zhanghang
 * @Description:
 * @Date: 2024-08-26 11:22:48
 * @LastEditors: zhanghang
 * @LastEditTime: 2024-09-02 11:46:33
 */
import createLabel from "./createLabel";
const label = createLabel();
label.itemStyle.padding = [0, 5, 0, 5];
export default function () {
  return {
    type: "marker",
    seriesName: "marker",
    symbol: "default",
    static:false,
    symbolSize: [20, 20],
    scale: 8,
    className: "",
    nameRelation: "",
    valueRelation: "",
    districtRelation: "",
    label,
    data: [
     
    ],
  };
}
