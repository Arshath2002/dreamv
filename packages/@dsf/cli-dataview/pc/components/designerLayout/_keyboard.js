const BOM = "BOM:DsfLayout-";
const GRID = "DATAVIEW:GRID-";
//递归组件属性对象的designId
function deepCorrectComponentDesignId(ctrlProps) {
  ctrlProps.designId = dsf.uuid();
  ctrlProps.isCopy = true;
  ctrlProps.designShowMarkRemove = true;
  ctrlProps.designShowMarkDragDrop = true;
  ctrlProps.designShowMarkCaption = true;
  ctrlProps.designShowMarkInfo = true;
  ctrlProps.designDisabledProps = null;
  _.each(ctrlProps.slots || [], (it) => {
    if (it) {
      _.each(it.controls, (ctrl) => {
        deepCorrectComponentDesignId.call(this, ctrl, it);
      });
    }
  });
}
export default {
  created() {
    document.querySelector(".data-view-designer-frame").addEventListener("click", this.setBlur, true);
  },
  mounted() {
    document.querySelector(".designer-grid-layout__wrapper").addEventListener("keydown", this.watchKeyBoard, false);
  },
  beforeDestroy() {
    const wrapper = document.querySelector(".designer-grid-layout__wrapper");
    wrapper && wrapper.removeEventListener("keydown", this.watchKeyBoard, false);
    document.querySelector(".data-view-designer-frame").removeEventListener("click", this.setBlur, true);
  },
  methods: {
    /**
     * @Description 按键监听
     */
    watchKeyBoard(evt) {
      evt.stopPropagation();
      if (evt.ctrlKey || evt.metaKey) {
        //存在选择单元格，复制
        if (evt.keyCode == "67" && this.activeItem.length) {
          evt.preventDefault();
          this.designerCopy();
          //ctrl+v 粘贴
        } else if (evt.keyCode == "86") {
          this.designer.$getClipboard().then((res) => {
            //平台组件方式复制的组件
            if (res && res.indexOf(BOM) >= 0) {
              if (res.startsWith("<")) {
                res = $(res).text();
              }
              this.platformPasteToPage(res);
              // 大屏设计器之间复制的组件
            } else if (res && res.indexOf(GRID) >= 0) {
              this.designerPaste(res, evt);
            }
          });
          //ctrl+g 组合单元格
        } else if (evt.keyCode == 71 && !evt.shiftKey) {
          evt.preventDefault();
          this.compositionMix();
          //ctrl+shift+g 解除组合
        } else if (evt.keyCode == 71 && evt.shiftKey) {
          evt.preventDefault();
          this.dismissComposition();
          //ctrl+k 锁定单元格
        } else if (evt.keyCode == 75 && !evt.shiftKey) {
          evt.preventDefault();
          this.locked();
          //ctrl+shift+k 解除锁定
        } else if (evt.keyCode == 75 && evt.shiftKey) {
          evt.preventDefault();
          this.unLocked();
        }
      }

      const activeItem = this.activeItem;
      //存在选中的单元格
      if (activeItem.length) {
        const isStopLeft = activeItem.some((i) => {
          const item = this.letterMapGrids.get(i);
          return item.x <= 0;
        });
        const isStopRight = activeItem.some((i) => {
          const item = this.letterMapGrids.get(i);
          return item.x + item.w >= 100;
        });
        const isStopUp = activeItem.some((i) => {
          const item = this.letterMapGrids.get(i);
          return item.y <= 0;
        });
        activeItem.forEach((i) => {
          const item = this.letterMapGrids.get(i);
          //如果是锁住不在单元格，或者在锁住组合单元格中，则返回
          const res = this.judgeInComposition(item.i);

          if (item.static && (!res || res.static)) return;

          switch (evt.keyCode) {
            //left
            case 37:
              if (!isStopLeft) {
                let lx = parseInt(item.x - 1);
                if (lx < 0) {
                  lx = 0;
                }
                this.$set(item, "x", lx);
              }
              break;
            //up
            case 38:
              if (!isStopUp) {
                let uy = parseInt(item.y - 1);
                if (uy <= 0) {
                  uy = 0;
                }
                this.$refs.gridLayout.updateHeight();
                this.$set(item, "y", uy);
              }
              break;
            //right
            case 39:
              if (!isStopRight && this.colNumUnit == "%") {
                let ry = parseInt(item.x + 1);
                if (item.w + ry >= 100) {
                  ry = 100 - item.w;
                }
                this.$set(item, "x", ry);
              } else if (this.colNumUnit != "%") {
                let ry = parseInt(item.x + 1);
                this.$set(item, "x", ry);
              }
              break;
            //down
            case 40:
              let dy = parseInt(item.y + 1);
              this.$refs.gridLayout.updateHeight();
              this.$set(item, "y", dy);
              break;
          }
        });
        //删除按钮
        if (evt.keyCode === 46 || evt.keyCode === 8) {
          dsf.layer.confirm("是否删除选中单元格或组合？").then(() => {
            this.deleteAllGrid(activeItem);
          });
        }
      }
    },
    /**
     * @Description 复制操作
     *
     */
    designerCopy() {
      let copyContext = "";
      // 所有选中的单元格
      const activeItem = this.activeItem;
      const activeComposition = this.activeComposition;

      if (activeItem.length > 1 && activeComposition.length == 0) {
        dsf.layer.message({ message: "离散单元格请先组合再复制！", type: "warning" });
        return false;
      }
      let activeLength = activeComposition.reduce((sum, cur) => sum + cur.i.split(",").length, 0);
      if (activeLength && activeItem.length && activeLength != activeItem.length) {
        dsf.layer.message({ message: "不能同时复制离散单元格和组合单元格！", type: "warning" });
        return false;
      }
      const constructData = (keys, x, y) => {
        const grids = [];
        keys.forEach((it) => {
          const layout = this.letterMapGrids.get(it);

          const { w: gw, h: gh, x: gx, y: gy, zIndex = 1 } = layout;
          const grid = {
            w: gw,
            h: gh,
            zIndex,
            //下面是偏移量
            ox: gx - x,
            oy: gy - y,
            static: !!layout.static,
            components: [],
          };

          let slotName = `area-${it}-${this.activeLevel}`;
          const el = $(`[slot-name=${slotName}]`);
          const proxy = el.find(">.designer-ctrl-proxy");
          const components = [];
          for (let n = 0; n < proxy.length; n++) {
            const item = proxy[n];
            let component = $(item).get(0).__vue__;

            let layout = dsf.designer.getLayoutInfo(component, true);
            components.push(layout);
          }
          grid.components = components;
          grids.push(grid);
        });
        return grids;
      };
      // 组合单元格复制
      if (activeComposition.length || activeItem.length) {
        let result = null;
        //是组合单元格
        if (activeComposition.length) {
          const composition = activeComposition[0];
          const { w, h, i, x, y } = composition;
          result = {
            w,
            h,
            static: !!composition.static,
            grids: [],
          };
          const grids = constructData(i.split(","), x, y);
          result.grids = grids;
          // 激活单个单元格
        } else if (activeItem.length) {
          const i = activeItem[0];
          const layout = this.letterMapGrids.get(i);
          const { w, h, x, y } = layout;
          result = {
            w,
            h,
            grids: [],
          };
          const grids = constructData([i], x, y);
          result.grids = grids;
        }

        if (result) {
          let json = dsf.designer.controlToJson([result]);
          copyContext = GRID + this.colNumUnit + ";" + json;
        }
      }
      if (!copyContext) return false;

      //如果浏览器兼容剪贴板api则直接使用
      if (navigator?.clipboard?.writeText) {
        navigator?.clipboard?.writeText(copyContext).then(() => {
          dsf.layer.message("复制成功");
        });
      }
      //否则使用兼容方式操作，该操作的缺点就是不能复制大量内容否则浏览器会崩溃
      else {
        let textarea = document.createElement("input");
        document.body.append(textarea);
        textarea.value = copyContext;
        textarea.focus();
        textarea.selectionStart = 0;
        textarea.selectionEnd = textarea.value.length;
        document.execCommand("copy", false, null);
        dsf.layer.message("复制成功");
        window.setTimeout(() => {
          this.designer.$el.focus();
          textarea.remove();
        }, 200);
      }
    },
    /**
     * @Description 平台复制粘贴组件
     * @param{String} text 粘贴板内容
     */
    platformPasteToPage(text) {
      if (text) {
        try {
          let index = text.indexOf(";");
          let pageInfo = text.substring(BOM.length, index).split("|");
          let fromClient = pageInfo[1];
          let targetClient = this.designer.mobile ? "mobile" : "pc";
          if (fromClient != targetClient) {
            dsf.layer.message("不同的终端类型不可粘贴", false);
            return;
          }
          text = text.substr(index + 1);
          let data = JSON.parse(text);
          if (data) {
            let layouts = _.map(data, (it) => {
              return dsf.designer.requestAsyncComponentsByLayout(it);
            });
            Promise.all(layouts).then(() => {
              try {
                let isPage = data.length > 0 ? data[0].isView : false;
                //如果是页面
                let promise = null;
                if (isPage) {
                  dsf.layer.message("暂时不支持页面级粘贴", false);
                  promise = Promise.resolve();
                }
                //如果是组件
                else {
                  promise = this.pasteComponentToTarget(data);
                }
                promise.then(() => {
                  if (!isPage) {
                    dsf.layer.message("粘贴完成");
                    $(".dv-designer-container__warp-canvas")[0].focus();
                  }
                });
              } catch (ex) {
                dsf.error(ex);
                dsf.layer.message("解析结构出现了未知的错误", false);
              }
            });
          }
        } catch (ex) {
          dsf.error(ex);
          dsf.layer.message("无法识别的结构数据", false);
        }
      }
    },
    /**
     * @Description 粘贴组件
     * @param {String} text
     * @returns
     */
    designerPaste(text) {
      if (!text) return false;
      try {
        let index = text.indexOf(";");
        let unit = text.substring(GRID.length, index).split("|")[0];
        if (unit != this.colNumUnit) {
          dsf.layer.message("不同的布局模式不可复制", false);
          return;
        }
        text = text.substr(index + 1);
        let data = JSON.parse(text);
        if (!data) return false;
        // 如果是数组--组合单元格
        if (Array.isArray(data)) {
          // 取值第一个
          const result = data[0];
          const { grids, w } = result;
          let { x, y } = this.mouseEvent;
          // 百分比不允许超过100
          if (this.colNumUnit == "%" && w + x > 100) {
            x = 100 - w;
          }

          //设定max 为1
          let max = 1;
          this.currentLayout.forEach((it) => {
            const zIndex = it.zIndex;
            if (max < zIndex) {
              max = zIndex;
            }
          });
          const items = [];
          let letters = [];
          grids.forEach((grid) => {
            const { w, h, ox, oy, zIndex = max } = grid;
          
            items.push({
              x: x + ox,
              y: y + oy,
              w,
              h,
              zIndex,
            });
            // 构造插槽
            const { slotName, area } = this.createSlots(x + ox, y + oy, w, h, grid.static,zIndex);
            letters.push(area);
            const components = grid.components;
            // 内部存在组件
            if (components.length) {
              const container = this.designer.$refs.viewProxy;
              let page = container._isVue ? container : container.get(0).__vue__;
              components.forEach((component) => {
                // 创建完组件
                this.createComponent(component).then((res) => {
                  this.designer.addControl(page, slotName, res, null);
                });
              });
            }
          });
          // 多个单元格需要组合单元格
          if (items.length > 1) {
            // 构造组合单元格
            const composition = this.updateComposition(items);
            composition.static = !!result.static;
            composition.i = letters.join(",");
            composition.id = dsf.uuid();

            this.compositionLayout.push(composition);
            //激活当前组合
            this.activeComposition.push(composition);
            //取消选中
            this.activeItem = [];
          }
        }
      } catch (ex) {
        dsf.error(ex);
        dsf.layer.message("无法识别的结构数据", false);
      }
    },
    /**
     * @Description 粘贴组件
     * @param{Array} data 组件的layout信息数组
     */
    pasteComponentToTarget(data) {
      return this.loadAsyncComponent(data).then((res) => {
        res.forEach(({ code, it }) => {
          this.addComponent(code, it);
        });
      });
    },
    /**
     * @Description 构造组件
     * @param {Object} data 组件属性对象
     */
    createComponent(data) {
      return this.loadAsyncComponent([data]).then(() => {
        const code = data.ctrlType;
        let comp = dsf.designer.createComponent(code, { designProxy: true }, false, this.designer);
        comp = dsf.mix(comp, data);
        deepCorrectComponentDesignId.call(this.designer, comp);
        return comp;
      });
    },
    /**
     * @Description 增加组件
     * @param {string} code 组件的ctrlType
     * @param {Object} it 组件的layout信息
     */
    addComponent(code, it) {
      let comp = dsf.designer.createComponent(code, { designProxy: true }, false, this.designer);
      comp = dsf.mix(comp, it);
      deepCorrectComponentDesignId.call(this.designer, comp);

      let area = "";
      const activeLevelLayout = this.activeLevelLayout;
      const activeLevel = this.activeLevel;

      let { x, y, unit } = this.mouseEvent;
      let w = 30;
      let h = 30;
      if (unit !== "%") {
        w = 200;
        h = 200;
      }
      //存在复制的宽度和高度
      let { copyHeight, copyWidth, copyUnit } = comp;
      if (copyHeight && copyWidth) {
        const { width, height } = this.designerRatio;
        //百分比
        if (unit == "%") {
          if (copyUnit == "px") {
            w = Number(((100 * copyWidth) / width).toFixed(0));
            h = Number(((100 * copyHeight) / height).toFixed(0));
            w = w > 100 ? 100 : h;
          } else {
            w = copyWidth;
            h = copyHeight;
          }
          //如果是像素
        } else if (unit == "px") {
          if (copyUnit == "px") {
            w = copyWidth;
            h = copyHeight;
          } else {
            w = parseInt((width * copyWidth) / 100);
            w = parseInt((height * copyHeight) / 100);
          }
        }

        Reflect.deleteProperty(comp, "copyHeight");
        Reflect.deleteProperty(comp, "copyWidth");
        Reflect.deleteProperty(comp, "copyUnit");
      }
      //判断超出边界
      if (unit === "%") {
        if (w + x > 100) {
          x = 100 - w;
        }
      }
      const dataviewPageProxy = this.designer.$refs.viewProxy;
      const designActive = dataviewPageProxy.designActive;

      // 插槽名称
      const i = dsf.uuid();
      Object.keys(activeLevelLayout.layout).forEach((item) => {
        const currentLayout = activeLevelLayout.layout[item];

        //当前分辨率插槽名字
        if (item === designActive) {
          area = i;
        }
        let max = Math.max(...currentLayout.map((it) => it.zIndex), 0);
        if (isNaN(max)) {
          max = 0;
        }
        currentLayout.push({
          x,
          y,
          w,
          h,
          static: false,
          i,
          zIndex: max + 1,
        });
      });
      this.designer.dealSlots();
      if (area) {
        const slot = `area-${area}-${activeLevel}`;
        const container = dataviewPageProxy;
        let component = container._isVue ? container : container.get(0).__vue__;

        this.$nextTick(() => {
          this.designer.addControl(component, slot, comp, null);
        });
      }
    },

    // 构建插槽
    createSlots(x, y, w, h, locked,zIndex) {
      const activeLevelLayout = this.activeLevelLayout;
      const dataviewPageProxy = this.designer.$refs.viewProxy;
      const designActive = dataviewPageProxy.designActive;
      const activeLevel = this.activeLevel;

      let area = "";
      // 插槽名称
      const i = dsf.uuid();
      Object.keys(activeLevelLayout.layout).forEach((item) => {
        const currentLayout = activeLevelLayout.layout[item];
        //当前分辨率插槽名字
        if (item === designActive) {
          area = i;
        }
   
        currentLayout.push({
          x,
          y,
          w,
          h,
          static: locked,
          i,
          zIndex,
        });
      });
      this.designer.dealSlots();
      const slotName = `area-${area}-${activeLevel}`;
      // 返回插槽名字
      return { slotName, area };
    },
  },
};
