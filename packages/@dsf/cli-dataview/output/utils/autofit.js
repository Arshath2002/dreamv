let currRenderDom = null;
let resizeListener = null;
let timer = null;
let currScale = 1;
let isAutofitRunnig = false;

const autofit = {
  init(options = {}, isShowInitTip = false) {
    if (isShowInitTip) {
      console.log(
        `%c` + `autofit.js` + ` is running`,
        `font-weight: bold; color: #ffb712; background:linear-gradient(-45deg, #bd34fe 50%, #47caff 50% );background: -webkit-linear-gradient( 120deg, #bd34fe 30%, #41d1ff );background-clip: text;-webkit-background-clip: text; -webkit-text-fill-color:linear-gradient( -45deg, #bd34fe 50%, #47caff 50% ); padding: 8px 12px; border-radius: 4px;`
      );
    }
    const { dw = 1920, dh = 929, el = typeof options === "string" ? options : "#app", resize = true, ignore = [], transition = "none", container, delay = 300 } = options;
    currRenderDom = el;
    let dom = document.querySelector(el);
    if (!dom) {
      console.error(`autofit: '${el}' is not exist`);
      return;
    }
    const style = document.createElement("style");
    const ignoreStyle = document.createElement("style");
    style.lang = "text/css";
    ignoreStyle.lang = "text/css";
    style.id = "autofit-style";
    ignoreStyle.id = "ignoreStyle";
    style.innerHTML = `body {overflow: hidden;}`;
    const bodyEl = document.querySelector("body");
    bodyEl.appendChild(style);
    bodyEl.appendChild(ignoreStyle);
    
    dom.style.height = `${dh}px`;
    dom.style.width = `${dw}px`;
    dom.style.transformOrigin = `0 0`;
    dom.style.overflow = "hidden";
    keepFit(dw, dh, dom, ignore, container);
    resizeListener = () => {
      clearTimeout(timer);
      if (delay != 0)
        timer = setTimeout(() => {
          container.callback(container);
          keepFit(dw, dh, dom, ignore, container);
         
        }, delay);
      else {
        keepFit(dw, dh, dom, ignore, container);

      }
    };
    resize && window.addEventListener("resize", resizeListener);
    isAutofitRunnig = true;
    setTimeout(() => {
      dom.style.transition = `${transition}s`;
    });
  },
  off(el = "#app") {
    try {
      window.removeEventListener("resize", resizeListener);
      document.querySelector("#autofit-style")?.remove();
      const ignoreStyleDOM = document.querySelector("#ignoreStyle");
      ignoreStyleDOM && ignoreStyleDOM.remove();
      // document.querySelector(currRenderDom ? currRenderDom : el).style = "";
    } catch (error) {
      console.error(`autofit: Failed to remove normally`, error);
      isAutofitRunnig = false;
    }
    isAutofitRunnig && console.log(`%c` + `autofit.js` + ` is off`, `font-weight: bold;color: #707070; background: #c9c9c9; padding: 8px 12px; border-radius: 4px;`);
  },
};
function keepFit(dw, dh, dom, ignore, container) {
  container = container || document.documentElement;
  let clientHeight = container.clientHeight;
  let clientWidth = container.clientWidth;
  currScale = clientWidth / clientHeight < dw / dh ? clientWidth / dw : clientHeight / dh;
  dom.style.height = `${clientHeight / currScale}px`;
  dom.style.width = `${clientWidth / currScale}px`;
  dom.style.transform = `scale(${currScale})`;
  // 暴露给全局 在3d地球使用html2canvas
  window.dataviewPageScale = currScale
  const ignoreStyleDOM = document.querySelector("#ignoreStyle");
  ignoreStyleDOM.innerHTML = "";
  for (let item of ignore) {
    let itemEl = item.el || item.dom;
    typeof item == "string" && (itemEl = item);
    if (!itemEl) {
      console.error(`autofit: bad selector: ${itemEl}`);
      continue;
    }
    let realScale = item.scale ? item.scale : 1 / currScale;
    let realFontSize = realScale != currScale ? item.fontSize : "autofit";
    let realWidth = realScale != currScale ? item.width : "autofit";
    let realHeight = realScale != currScale ? item.height : "autofit";
    let regex = new RegExp(`${itemEl}(\x20|{)`, "gm");
    let isIgnored = regex.test(ignoreStyleDOM.innerHTML);
    if (isIgnored) {
      continue;
    }
    ignoreStyleDOM.innerHTML += `\n${itemEl} { 
      transform: scale(${realScale})!important;
      transform-origin: 0 0;
      width: ${realWidth}!important;
      height: ${realHeight}!important;
    }`;
    if (realFontSize) {
      ignoreStyleDOM.innerHTML += `\n${itemEl} div ,${itemEl} span,${itemEl} a,${itemEl} * {
        font-size: ${realFontSize}px;
      }`;
    }
  }
}

export default autofit;
