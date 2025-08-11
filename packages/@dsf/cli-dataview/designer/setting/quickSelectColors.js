export default {
    transform: (str) => {
        if (!str || !(typeof str === "string")) return [];
        let res = [],
            s = str.replaceAll("linear-gradient(", ""),
            index = 1,
            keyname = "color";

        s = s.split("deg, ");
        res.push(`${s[0]}deg`);
        s = s[1];
        for (let i = 0 ; i < s.length - 2 ; i++ ) {
            if (`${s[i-2]}${s[i-1]}${s[i]}` === "x, ") {
                res[index].length = res[index].length.replaceAll("px", "");
                res[index].length = res[index].length.replaceAll("%", "");
                index += 1;
                keyname = "color";
            }

            if (!res[index]) res[index] = { length: "", color: "" };

            if (
                (s[i] != "," || s[i - 1] != "x") &&
                (s[i] != " " || ![") ", ", "].includes(`${s[i - 1]}${s[i]}`))
            ) {
                if (`${s[i - 2]}${s[i - 1]}` === ") ") {
                    keyname = "length"
                }
                res[index][keyname] += s[i];
            }
        }
        return res;
    },
    colors: [
        "rgb(0, 0, 0)",
        "rgb(84, 84, 84)",
        "rgb(225, 225, 225)",
        "rgb(255, 255, 255)",
        "rgb(255, 216, 53)",
        "rgb(90, 174, 243)",
        "rgb(112, 188, 89)",
        "rgb(96, 122, 244)",
        "rgb(59, 39, 205)",
        "rgb(44, 108, 218)",
        "rgb(117, 45, 208)",
        "rgb(77, 33, 167)",
        "rgb(210, 89, 89)",
        "rgb(214, 62, 123)",
        "rgb(230, 90, 86)",
        "rgb(255, 151, 76)",
        "rgb(225, 227, 113)",
        "rgb(215, 182, 255)",
        "rgb(203, 222, 255)",
        "rgb(201, 245, 255)",
        "rgb(239, 191, 221)",
        "rgb(255, 207, 193)",
        "rgb(255, 246, 212)",
        "rgb(225, 239, 195)",
        "linear-gradient(388deg, rgb(102, 166, 255) 0px, rgb(137, 247, 254) 92%)",
        "linear-gradient(405deg, rgb(150, 184, 226) 0px, rgb(117, 231, 214) 100%)",
        "linear-gradient(388deg, rgb(98, 155, 253) 0px, rgb(102, 166, 255) 92%)",
        "linear-gradient(405deg, rgb(118, 75, 162) 0px, rgb(102, 126, 234) 100%)",
        "linear-gradient(388deg, rgb(235, 237, 238) 0px, rgb(251, 251, 251) 92%)",
        "linear-gradient(405deg, rgb(195, 207, 226) 0px, rgb(245, 247, 250) 100%)",
        "linear-gradient(405deg, rgb(22, 217, 227) 0px, rgb(70, 174, 247) 100%)",
        "linear-gradient(90deg, rgb(167, 166, 203) 0px, rgb(137, 137, 186) 51%)",
        "linear-gradient(225deg, rgb(250, 208, 196) 0px, rgb(255, 154, 249) 100%)",
        "linear-gradient(405deg, rgb(226, 209, 195) 0px, rgb(253, 252, 251) 100%)",
        "linear-gradient(225deg, rgb(251, 252, 219) 0px, rgb(233, 222, 250) 100%)",
        "linear-gradient(90deg, rgb(254, 214, 227) 0px, rgb(168, 237, 234) 100%)",
        "linear-gradient(90deg, rgb(209, 253, 255) 0px, rgb(253, 219, 146) 100%)",
        "linear-gradient(90deg, rgb(235, 192, 253) 0px, rgb(217, 222, 216) 100%)",
        "linear-gradient(90deg, rgb(205, 156, 242) 0px, rgb(246, 243, 255) 100%)",
        "linear-gradient(90deg, rgb(152, 144, 227) 0px, rgb(177, 244, 207) 100%)",
        "linear-gradient(90deg, rgb(255, 209, 255) 0px, rgb(250, 208, 196) 100%)",
        "linear-gradient(90deg, rgb(255, 241, 235) 0px, rgb(172, 224, 249) 100%)",
        "linear-gradient(90deg, rgb(207, 199, 248) 0px, rgb(235, 187, 167) 100%)",
        "linear-gradient(90deg, rgb(254, 249, 215) 0px, rgb(210, 153, 194) 100%)",
        "linear-gradient(90deg, rgb(252, 182, 159) 0px, rgb(255, 236, 210) 100%)",
        "linear-gradient(270deg, rgb(251, 194, 235) 0px, rgb(161, 140, 209) 100%)",
        "linear-gradient(90deg, rgb(254, 175, 168) 0px, rgb(245, 239, 239) 100%)",
        "linear-gradient(270deg, rgb(254, 207, 239) 0px, rgb(255, 152, 156) 100%)",
        "linear-gradient(90deg, rgb(230, 233, 240) 0px, rgb(238, 241, 245) 100%)",
        "linear-gradient(90deg, rgb(172, 203, 238) 0px, rgb(231, 240, 253) 100%)",
        "linear-gradient(90deg, rgb(193, 223, 196) 0px, rgb(222, 236, 221) 100%)",
        "linear-gradient(90deg, rgb(250, 113, 205) 0px, rgb(196, 113, 245) 100%)",
        "linear-gradient(90deg, rgb(111, 134, 214) 0px, rgb(72, 198, 239) 100%)",
        "linear-gradient(90deg, rgb(0, 198, 251) 0px, rgb(0, 91, 234) 100%)",
        "linear-gradient(90deg, rgb(180, 144, 202) 0px, rgb(94, 231, 223) 100%)",
        "linear-gradient(90deg, rgb(0, 158, 253) 0px, rgb(42, 245, 152) 100%)"
    ]
}