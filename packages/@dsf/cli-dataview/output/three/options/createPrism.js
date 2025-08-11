/*
 * @Editor: zhanghang
 * @Description: 标记图层配置
 * @Date: 2024-07-05 15:45:32
 * @LastEditors: zhanghang
 * @LastEditTime: 2024-07-16 11:29:06
 */
import createLabel from "./createLabel";
const label = createLabel();
label.itemStyle.padding = [0, 5, 0, 5]
label.itemStyle.backgroundColor = "rgba(50,50,50,0.7)"
export default function () {
  return {
    type: "prism",
    seriesName: "prism",
    size: 25,
    prismType:3,// 1 代表平面柱体 2 代表圆柱 3 代表棱柱
    maxHeight: 50,
    minHeight: 10,
    offset: [0, 0],
    label,
    nameRelation: "",
    valueRelation: "",
    districtRelation: "",
    itemStyle: {
      color: [
        "linear-gradient(0deg, rgb(120, 131, 248) 0%, rgb(90, 174, 243) 100%)",
        "linear-gradient(0deg, rgb(157, 77, 255) 0%, rgb(90, 174, 243) 100%)",
        "linear-gradient(0deg, rgb(151, 203, 247) 0%, rgb(151, 203, 247) 100%)",
      ],
    },
    data: [
      
    ],
  };
}
