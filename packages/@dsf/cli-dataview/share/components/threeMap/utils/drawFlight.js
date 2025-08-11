/*
 * @Editor: zhanghang
 * @Description:绘制飞行线
 * @Date: 2024-07-09 09:15:49
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-04-23 17:37:00
 */
import * as THREE from "three";
import point from "../asset/point.png";
const staticTexture = new THREE.TextureLoader().load(point);

const transform = function (code, districtData, projection) {
  let x = 0,
    y = 0,
    x1 = 0,
    y1 = 0;

  //经纬度
  if (Array.isArray(code)) {
    const point = projection(code);
    x = point[0];
    y = point[1];

    x1 = code[0];
    y1 = code[1];
    //行政编码
  } else {
    const district = districtData.find((city) => city.adcode == code);
    if (district) {
      const center = district.centroid || district.center;
      const point = projection(center);
      x = point[0];
      y = point[1];

      x1 = center[0];
      y1 = center[1];
    } else {
      return false;
    }
  }
  if (x == y) return null;
  return [x, y, x1, y1];
};

const createMesh = function ({ curvePoints, speed, color, size, len }) {
  const flightShader = {
    vertexshader: ` 
        uniform float size; 
        uniform float time; 
        uniform float u_len; 
        attribute float u_index;
        varying float u_opacitys;
        void main() { 
            if( u_index < time + u_len && u_index > time){
                float u_scale = 1.0 - (time + u_len - u_index) /u_len;
                u_opacitys = u_scale;
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_Position = projectionMatrix * mvPosition;
                gl_PointSize = size * u_scale * 300.0 / (-mvPosition.z);
            } 
        }
        `,
    fragmentshader: ` 
        uniform sampler2D u_map;
        uniform float u_opacity;
        uniform vec3 color;
        uniform float isTexture;
        varying float u_opacitys;
        void main() {
            vec4 u_color = vec4(color,u_opacity * u_opacitys);
            if( isTexture != 0.0 ){
                gl_FragColor = u_color * texture2D(u_map, vec2(gl_PointCoord.x, 1.0 - gl_PointCoord.y));
            }else{
                gl_FragColor = u_color;
            }
        }`,
  };

  const geometry = new THREE.BufferGeometry();
  const { opacity } = dsf.dataview.utils.transformRgb(color);
  color = new THREE.Color(color);

  const material = new THREE.ShaderMaterial({
    uniforms: {
      color: {
        value: color,
        type: "v3",
      },
      size: {
        value: size,
        type: "f",
      },
      u_map: {
        value: staticTexture,
        type: "t2",
      },
      u_len: {
        value: len,
        type: "f",
      },
      u_opacity: {
        value: opacity,
        type: "f",
      },
      time: {
        value: -len,
        type: "f",
      },
      isTexture: {
        value: 1.0,
        type: "f",
      },
    },
    transparent: true,
    depthTest: false,
    vertexShader: flightShader.vertexshader,
    fragmentShader: flightShader.fragmentshader,
  });
  const [position, u_index] = [[], []];
  curvePoints.forEach((it, index) => {
    position.push(it.x, it.y, it.z);
    u_index.push(index);
  });
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(position, 3));
  geometry.setAttribute("u_index", new THREE.Float32BufferAttribute(u_index, 1));

  const mesh = new THREE.Points(geometry, material);

  mesh._speed = speed;
  mesh._repeat = Infinity;
  mesh._been = 0;
  mesh._total = curvePoints.length;

  return mesh;
};
/**
 * @description 飞行线
 * @param {Object} options => 飞行线配置
 * @param {Object} config =>  scale 转换比例 默认100 depth 20 地图深度
 * @return {Array} mesh 数组
 */
export const drawFlight = function (options, config) {
  const projection = this.projection;
  const modelScale = this.scale;
  const seriesName = options.seriesName;
  const data = options.data || [];
  const group = new THREE.Group();
  const { depth, scale } = config;
  const z = (depth + 1) / scale;

  let { flightColor, headSize, points, speed = 10 } = options;

  const size = (1 * headSize) / scale;

  data.forEach((it) => {
    const start = transform(it.start, this.districtData, projection);
    const end = transform(it.end, this.districtData, projection);

    if (start && end) {
      let [sx, sy, x1, y1] = start;
      let [ex, ey, x2, y2] = end;

  
      const startPoint = new THREE.Vector3(sx, z, sy);
      const endPoint = new THREE.Vector3(ex, z, ey);

      // 创建三维样条曲线的中间点
      const middle = new THREE.Vector3(0, 0, 0);
      // 设置坐标为起始点和结束点的一半
      middle.add(startPoint).add(endPoint).divideScalar(2);
      // 获取两个起始点的距离
      const L = startPoint.clone().sub(endPoint).length();
      // 根据距离设置中间点坐标的z值,距离越远的省会之间，样条曲线会越高
      middle.y = z + L * 0.4 * modelScale;

      // 创建三维样条曲线
      const curve = new THREE.QuadraticBezierCurve3(startPoint, middle, endPoint);

      // 获取曲线上分布的n个三维向量坐标数组
      const curvePoints = curve.getPoints(points * 2);

      const color = flightColor[0];
      const len = curvePoints.length;
      const mesh = createMesh({
        curvePoints,
        speed,
        color,
        size,
        len,
      });

      const halfMesh = createMesh({
        curvePoints,
        speed,
        color,
        size,
        len,
      });

      halfMesh._isHalf = mesh.uuid;

      group.add(mesh);
      group.add(halfMesh);
    }
  });
  group._category = "flight";
  return group;
};

export const updateMiniFly = function (group) {
  group.forEach((mesh) => {
    let uniforms = mesh.material.uniforms;
    if (uniforms.time.value >= 0 && !mesh._isHalf) {
      const halfMesh = group.find((it) => it._isHalf === mesh.uuid);
      halfMesh && (halfMesh._isHalf = null);
    }

    if (mesh._isHalf) return false;

    if (uniforms.time.value < mesh._total) {
      uniforms.time.value += mesh._speed * 0.5;
    } else {
      uniforms.time.value = -uniforms.u_len.value;
    }
  });
};
