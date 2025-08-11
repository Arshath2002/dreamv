/*
 * @Editor: zhanghang
 * @Description: 
 * @Date: 2025-02-07 14:06:42
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-02-07 14:35:57
 */
import gisUtils from "_dataview/output/utils/gis.js";
export const register = function (code) {
  let full = null;
  let boundary = null;
  if (/^\d+$/.test(code)) {

    
    full = new Promise((resolve) => {
      dsf.http.get(dsf.url.getWebPath(`static/js/libs/three/geoJson/${code}.json`,__DSF_DATAVIEW_PATH__)).then((res) => {
        if (res.status === 200) {
          const data = res.data;
          resolve(data);
        }
      });
    });
    boundary = new Promise((resolve) => {
      dsf.http.get(dsf.url.getWebPath(`static/js/libs/three/geoJson/${code}_bound.json`,__DSF_DATAVIEW_PATH__)).then((res) => {
        if (res.status === 200) {
          const data = res.data;
          resolve(data);
        }
      });
    });
  } else {
    boundary = new Promise((outerResolve) => {
      full = new Promise((resolve) => {
        dsf.http.get(code).then((res) => {
          if (res.status === 200) {
            const data = res.data;
  
            // 计算边界
            let box = data.features[0];
            for (let i = 1; i < data.features.length; i++) {
              const feature = data.features[i];
              box = gisUtils.union(box, feature);
            }
            outerResolve({ type: "featureCollection", features: [box] });
            resolve(data);
          }
        });
      });
    })
  }
  return Promise.all([boundary, full]);
};
