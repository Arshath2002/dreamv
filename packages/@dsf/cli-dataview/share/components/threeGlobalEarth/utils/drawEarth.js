/*
 * @Editor: zhanghang
 * @Description: 绘制地球
 * @Date: 2024-08-26 10:09:02
 * @LastEditors: zhanghang
 * @LastEditTime: 2024-11-06 14:23:46
 */
import { TextureLoader, SphereGeometry, ShaderMaterial, SphereBufferGeometry, Mesh, Points, Color, PointsMaterial } from "three";
import earthTexture from "../asset/earthDefault.jpg";
import satelliteTexture from "_dataview/assets/img/echarts/glMap/earth.jpg";

const vertexShader = `
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vp;
varying vec3 vPositionNormal;
void main(void){
  vUv = uv;
  vNormal = normalize( normalMatrix * normal ); // 转换到视图空间
  vp = position;
  vPositionNormal = normalize(( modelViewMatrix * vec4(position, 1.0) ).xyz);
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`;
const fragmentShader = `
uniform vec3 glowColor;
uniform float bias;
uniform float power;
uniform float time;
varying vec3 vp;
varying vec3 vNormal;
varying vec3 vPositionNormal;
uniform float scale;
// 获取纹理
uniform sampler2D map;
// 纹理坐标
varying vec2 vUv;

void main(void){
  float a = pow( bias + scale * abs(dot(vNormal, vPositionNormal)), power );
  if(vp.y > time && vp.y < time + 20.0) {
    float t =  smoothstep(0.0, 0.8,  (1.0 - abs(0.5 - (vp.y - time) / 20.0)) / 3.0  );
    gl_FragColor = mix(gl_FragColor, vec4(glowColor, 1.0), t * t );
  }
  gl_FragColor = mix(gl_FragColor, vec4( glowColor, 1.0 ), a);
  float b = 0.8;
  gl_FragColor = gl_FragColor + texture2D( map, vUv );
}
`;

//添加地球贴图的Mesh到场景中
export const createEarth = (options, config) => {
  const radius = config.radius || 40;

  const { border, aureola } = options;

  const textureMap = {
    default: earthTexture,
    satellite: satelliteTexture,
  };
  //地球纹理
  const image = textureMap[options.texture] ? textureMap[options.texture] : options.texture ? options.texture : earthTexture;

  // TextureLoader创建一个纹理加载器对象，可以加载图片作为纹理贴图
  const textureLoader = new TextureLoader();
  //加载纹理贴图
  const texture = textureLoader.load(image);
  //创建一个球体几何对象
  const geometry = new SphereGeometry(radius, 96, 96);

  const uTime = 100;

  const uniforms = {
    glowColor: {
      value: new Color(aureola.color),
    },
    scale: {
      type: "f",
      value: -1.0,
    },
    bias: {
      type: "f",
      value: 1.0,
    },
    power: {
      type: "f",
      value: 3.3,
    },
    time: {
      type: "f",
      value: uTime,
    },
    isHover: {
      value: false,
    },
    map: {
      value: texture,
    },
  };
  //材质对象Material
  const material = new ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
  });
  const mesh = new Mesh(geometry, material); //网格模型对象Mesh
  mesh._uniforms = uniforms;
  mesh._uTime = uTime;
  if (border.show) {
    const borderGeometry = new SphereBufferGeometry(border.radius, 60, 60);
    const { rgb, opacity } = dsf.dataview.utils.transformRgb(border.color);
    const pointMaterial = new PointsMaterial({
      color: rgb, //设置颜色，默认 0xFFFFFF
      transparent: true,
      sizeAttenuation: true,
      opacity: opacity,
      vertexColors: false, //定义材料是否使用顶点颜色，默认false ---如果该选项设置为true，则color属性失效
      size: border.size / 100, //定义粒子的大小。默认为1.0
    });
    const borderMesh = new Points(borderGeometry, pointMaterial); //将模型添加到场景
    mesh.add(borderMesh);
  }

  mesh._type = "earth";
  return mesh;
};
