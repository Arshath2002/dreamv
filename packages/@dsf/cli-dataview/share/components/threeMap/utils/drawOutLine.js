/*
 * @Editor: zhanghang
 * @Description: 绘制地图边界
 * @Date: 2024-06-18 16:14:55
 * @LastEditors: zhanghang
 * @LastEditTime: 2024-11-13 11:16:27
 */
import * as THREE from "three";
import wallImage from "../asset/map-wall.png";
const wallTexture = new THREE.TextureLoader().load(wallImage);
/**
 * 通过path构建墙体
 * option =>
 * params height path material expand(是否需要扩展路径)
 * **/
const createWallByPath = ({ verticesByTwo = [], color = 0x00ffff }) => {
  // 2.解析需要渲染的四边形 每4个顶点为一组
  const verticesByFour = verticesByTwo.reduce((arr, item, i) => {
    if (i === verticesByTwo.length - 1) return arr;
    return arr.concat([[item, verticesByTwo[i + 1]]]);
  }, []);
  // 3.将四边形面转换为需要渲染的三顶点面
  const verticesByThree = verticesByFour.reduce((arr, item) => {
    const [[point1, point2], [point3, point4]] = item;
    return arr.concat(...point2, ...point1, ...point4, ...point1, ...point3, ...point4);
  }, []);
  const geometry = new THREE.BufferGeometry();
  // 4. 设置position
  const vertices = new Float32Array(verticesByThree);
  geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
  // 5. 设置uv 6个点为一个周期 [0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1]

  // 5.1 以18个顶点为单位分组
  const pointsGroupBy18 = new Array(verticesByThree.length / 3 / 6).fill(0).map((item, i) => {
    return verticesByThree.slice(i * 3 * 6, (i + 1) * 3 * 6);
  });
  // 5.2 按uv周期分组
  const pointsGroupBy63 = pointsGroupBy18.map((item, i) => {
    return new Array(item.length / 3).fill(0).map((it, i) => item.slice(i * 3, (i + 1) * 3));
  });
  // 5.3根据BoundingBox确定uv平铺范围
  geometry.computeBoundingBox();
  const { min, max } = geometry.boundingBox;
  const rangeX = max.x - min.x;
  const uvs = [].concat(
    ...pointsGroupBy63.map((item) => {
      const point0 = item[0];
      const point5 = item[5];
      const distance = new THREE.Vector3(...point0).distanceTo(new THREE.Vector3(...point5)) / (rangeX / 10);
      return [0, 1, 0, 0, distance, 1, 0, 0, distance, 0, distance, 1];
    })
  );
  geometry.setAttribute("uv", new THREE.BufferAttribute(new Float32Array(uvs), 2));

  const meshMat = new THREE.MeshBasicMaterial({
    color,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: tinycolor(color).getAlpha(),
    alphaMap: wallTexture,
  });

  return new THREE.Mesh(geometry, meshMat);
};
/**
 * @description 构建轮廓数据
 * @param {Array} features 地理信息
 * @param {Object} options => 图层配置
 * @param {Object} config =>  scale 转换比例 默认100 depth 20 地图深度
 * @return {Object} {outline flow}
 */
export const drawOutline = function (features, options, config) {
  const projection = this.projection;
 
  const flowParams = options.flow;
  const wallOption = options.wall;
  const hasWall = wallOption && wallOption.show;
  const { depth, scale } = config;
  const z = (depth + 1) / scale;
  const outline = new THREE.Object3D();
  
  let outlineColor = options.outLineStyle.color;
  const format = tinycolor(outlineColor);
  const opacity = format.getAlpha();
  const rgb = format.toRgb();
  outlineColor = `rgb(${rgb.r},${rgb.g},${rgb.b})`;


  //流光点
  const lightPoints = [];
  const wallPoints = [];

  features.forEach(({ geometry }) => {
    let { coordinates } = geometry;
    //处理单环数据
    if (geometry.type === "Polygon") {
      coordinates = [coordinates];
    }

    coordinates.forEach((multiPolygon, index) => {
      multiPolygon.forEach((polygon) => {
        const lineMaterial = new THREE.LineBasicMaterial({
          color: outlineColor,
          transparent: true,
          opacity,
        });
        const points = [];
        const wp = [];
        for (let i = 0; i < polygon.length; i++) {
          const [x, y] = projection(polygon[i]);
          //过滤掉缺失的点位
          if (x && y) {
            points.push(new THREE.Vector3(x, -y, z));
            if (hasWall) {
              const height = wallOption.height;
              wp.push([
                [x, -y, z],
                [x, -y, z + height / scale],
              ]);
            }

            //取第一条轮廓线
            if (index === 0) {
              lightPoints.push([x, -y, z]);
            }
          }
        }
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(lineGeometry, lineMaterial);
        line.rotation.x = -0.5 * Math.PI;
        line._isGlow = true;
        outline.add(line);
        wallPoints.push(wp);
      });
    });
  });

  // const geometry = new THREE.BufferGeometry();
  // const positions = new Float32Array(lightPoints.flat(1));

  // // 设置顶点
  // geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  // // 设置 粒子透明度为 0
  // const opacity = new Float32Array(positions.length).map(() => 0);
  // geometry.setAttribute("aOpacity", new THREE.BufferAttribute(opacity, 1));

  // const flow = {
  //   geometry,
  //   positions,
  //   opacity,
  //   lightPoints,
  //   params: flowParams,
  // };
  // const pointsMesh = createFlowLight(flow);
  // flow.points = pointsMesh;

  const drawWall = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const group = new THREE.Group();
        if (!this.isClear && hasWall) {
          const { color } = wallOption;
          wallPoints.forEach((points) => {
            const wall = createWallByPath({
              verticesByTwo: points,
              color: color,
            });
            wall.rotation.x = -0.5 * Math.PI;
            wall.renderOrder = 90;
            group.add(wall);
          });
          resolve(group);
        } else {
          resolve(group);
        }
      }, 17);
    });
  };

  return { outline, drawWall, wallTexture };
};
/**
 * @description 流光渲染
 * @param {Object} flow 流光对象
 * @return {undefined} 无
 */
export const flowRender = function (flow) {
  if (!flow) return false;

  const { points, geometry, opacity, lightPoints, params } = flow;
  if (params.currentPos == undefined) {
    params.currentPos = 0;
  }
  let { pointSpeed } = params;
  if (points && geometry.attributes.position) {
    params.currentPos += pointSpeed;
    for (let i = 0; i < pointSpeed; i++) {
      opacity[(params.currentPos - i) % lightPoints.length] = 0;
    }

    for (let i = 0; i < 200; i++) {
      opacity[(params.currentPos + i) % lightPoints.length] = i / 50 > 2 ? 2 : i / 50;
    }
    geometry.attributes.aOpacity.needsUpdate = true;
  }
};
function createFlowLight(flow) {
  // 控制 颜色和粒子大小
  const params = flow.params;
  const vertexShader = `
            attribute float aOpacity;
            uniform float uSize;
            varying float vOpacity;
    
            void main(){
                gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);
                gl_PointSize = uSize;
    
                vOpacity=aOpacity;
            }
            `;

  const fragmentShader = `
            varying float vOpacity;
            uniform vec3 uColor;
    
            float invert(float n){
                return 1.-n;
            }
    
            void main(){
              if(vOpacity <=0.2){
                  discard;
              }
              vec2 uv=vec2(gl_PointCoord.x,invert(gl_PointCoord.y));
              vec2 cUv=2.*uv-1.;
              vec4 color=vec4(1./length(cUv));
              color*=vOpacity;
              color.rgb*=uColor;
              gl_FragColor=color;
            }
            `;
  const material = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    transparent: true, // 设置透明
    uniforms: {
      uSize: {
        value: params.pointSize,
      },
      uColor: {
        value: new THREE.Color(params.pointColor),
      },
    },
  });
  const points = new THREE.Points(flow.geometry, material);
  points.rotation.x = -0.5 * Math.PI;

  return points;
}
