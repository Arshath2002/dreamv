/*
 * @Description: 长按指令
 * @Author: shenah
 * @Date: 2025-02-14 16:13:07
 * @LastEditors: shenah
 * @LastEditTime: 2025-02-20 16:50:18
 */


export default {
  install(Vue) {
    Vue.directive("dsf-dv-longPress", {
      bind(el, binding) {
        let pressTimer = null;
    
        // 参数标准化处理
        const normalizeConfig = () => {
          if (typeof binding.value === 'function') {
            return { press: binding.value };
          }
          if (typeof binding.value !== 'object' || binding.value === null) {
            throw new Error('v-dsf-dv-longPress 必须接收函数或配置对象');
          }
          if (typeof binding.value.press !== 'function') {
            throw new Error('必须提供 press 回调函数');
          }
          return binding.value;
        };
    
        // 合并配置
        const config = {
          time: 500,
          cancel: () => {},
          ...normalizeConfig()
        };
    
        // 事件对象生成
        const createEvent = (e) => ({
          originalEvent: e,
          target: e.target,
          currentTarget: el,
          timestamp: Date.now(),
          userData: config.userData
        });
    
        // 清理定时器
        const clearTimer = () => {
          if (pressTimer) {
            clearTimeout(pressTimer);
            pressTimer = null;
          }
        };
    
        // 移除文档监听器
        const removeDocumentListeners = (listeners) => {
          listeners.forEach(({ type, handler }) => {
            document.removeEventListener(type, handler);
          });
        };
    
        // 鼠标按下处理器
        const handleMouseDown = (e) => {
          if (e.button !== 0) return;
    
          clearTimer();
          e.preventDefault();
    
          const startPos = { x: e.clientX, y: e.clientY };
    
          // 设置长按定时器
          pressTimer = setTimeout(() => {
            if (document.body.contains(el)) {
              config.press(createEvent(e));
            }
          }, config.time);
    
          // 移动处理
          const handleMove = (moveEvent) => {
            const dx = Math.abs(moveEvent.clientX - startPos.x);
            const dy = Math.abs(moveEvent.clientY - startPos.y);
            if (dx > 10 || dy > 10) {
              clearTimer();
              config.cancel(createEvent(moveEvent));
              removeDocumentListeners(documentListeners);
            }
          };
    
          // 松开处理
          const handleUp = (upEvent) => {
            clearTimer();
            config.cancel(createEvent(upEvent));
            removeDocumentListeners(documentListeners);
          };
    
          // 添加新监听器
          const documentListeners = [
            { type: 'mousemove', handler: handleMove },
            { type: 'mouseup', handler: handleUp }
          ];
          documentListeners.forEach(({ type, handler }) => {
            document.addEventListener(type, handler);
          });
    
          // 保存引用
          el._documentListeners = documentListeners;
        };
    
        // 右键菜单处理
        const contextMenuHandler = (e) => e.preventDefault();
        el.addEventListener('contextmenu', contextMenuHandler);
    
        // 保存引用
        el._longPressHandler = handleMouseDown;
        el._contextMenuHandler = contextMenuHandler;
        el._removeDocumentListeners = removeDocumentListeners;
        el._clearTimer = clearTimer; // 将 clearTimer 保存到元素上
        el.addEventListener('mousedown', handleMouseDown);
      },
    
      unbind(el) {
        // 移除元素监听器
        el.removeEventListener('mousedown', el._longPressHandler);
        el.removeEventListener('contextmenu', el._contextMenuHandler);
    
        // 清理文档监听器
        if (el._documentListeners) {
          el._removeDocumentListeners(el._documentListeners);
        }
    
        // 清理定时器
        if (el._clearTimer) {
          el._clearTimer();
        }
    
        // 删除引用
        delete el._longPressHandler;
        delete el._contextMenuHandler;
        delete el._documentListeners;
        delete el._clearTimer;
        delete el._removeDocumentListeners;
      }
    });
  },
};
