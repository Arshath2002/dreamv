/*
 * @Editor: zhanghang
 * @Description: 
 * @Date: 2024-08-27 16:16:57
 * @LastEditors: zhanghang
 * @LastEditTime: 2024-08-28 19:26:58
 */
export default function () {
  return {
    show: true,
    name: "{b}",
    isFormatter: false, // 是否格式化
    formatter: null,
    formatterHtml: "",
    className: "",
    offset: [0, 0],
    itemStyle: {
      padding: [0, 0, 0, 0],
      backgroundColor: "rgba(50,50,50,0)",
      borderRadius: 5,
      borderColor: "rgba(255,255,255,0)",
      borderWidth: 0,
      textStyle: {
        fontSize: 14,
        color: "#FFF",
        fontStyle: "normal",
        fontWeight: "600",
        fontFamily: "Microsoft Yahei",
        textDecoration: "",
        textShadow: "",
      },
    },
  };
}
