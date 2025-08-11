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
        fontSize: 12,
        color: "#FFF",
        fontStyle: "normal",
        fontWeight: "normal",
        fontFamily: "Microsoft Yahei",
        textDecoration: "",
        textShadow: "",
      },
    },
  };
}
