/*
 * @Editor: zhanghang
 * @Description:
 * @Date: 2024-08-26 10:39:25
 * @LastEditors: zhanghang
 * @LastEditTime: 2024-10-29 11:14:44
 */
import { PlaneBufferGeometry, TextureLoader, MeshBasicMaterial, DoubleSide, Mesh, Color, Vector3 } from "three";
import { lon2xyz } from "./tools.js";
import wavePng from "../asset/wave.png";
import pointPng from "../asset/point.png";

export const drawScatters = (options, config) => {
  const { data, offset = 0, waveSize = 4, pointSize = 2, pointColor, waveColor = "#22ffcc" } = options;
  const radius = config.radius
  const waveMeshCollect = [];
  const pointMeshCollect = [];

  data.forEach((it) => {
    const district = it.district;
    const point = lon2xyz(radius + Number(offset), district[0], district[1]);

    const geometry = new PlaneBufferGeometry(1, 1); //默认在XOY平面上
    const textureLoader = new TextureLoader(); // TextureLoader创建一个纹理加载器对象
    // 波纹纹理
    const waveTexture = textureLoader.load(wavePng);
    const waveOpacity = tinycolor(waveColor).getAlpha();
    // 波纹材质
    const waveMaterial = new MeshBasicMaterial({
      color: new Color(waveColor),
      map: waveTexture,
      transparent: true, //使用背景透明的png贴图，注意开启透明计算
      opacity: waveOpacity,
      side: DoubleSide, //双面可见
      depthWrite: false, //禁止写入深度缓冲区数据
    });
    const pointOpacity = tinycolor(pointColor).getAlpha();
    // 点纹理p
    const pointTexture = textureLoader.load(pointPng);
    const pointMaterial = new MeshBasicMaterial({
      color: new Color(pointColor),
      map: pointTexture,
      opacity: pointOpacity,
      transparent: true, //使用背景透明的png贴图，注意开启透明计算
      depthWrite: false, //禁止写入深度缓冲区数据
    });
    const waveMesh = new Mesh(geometry, waveMaterial);
    const pointMesh = new Mesh(geometry, pointMaterial);

    pointMesh.scale.set(pointSize, pointSize, pointSize); //设置mesh大小

    waveMesh.scale.set(waveSize, waveSize, waveSize); //设置mesh大小
    waveMesh.size = waveSize;
    waveMesh._s = Math.random() * 1.0 + 1.0;

    waveMesh.position.set(point.x, point.y, point.z);
    pointMesh.position.set(point.x, point.y, point.z);

    // mesh姿态设置
    // mesh在球面上的法线方向(球心和球面坐标构成的方向向量)
    const coordVec3 = new Vector3(point.x, point.y, point.z).normalize();
    // mesh默认在XOY平面上，法线方向沿着z轴new THREE.Vector3(0, 0, 1)
    const meshNormal = new Vector3(0, 0, 1);
    // 四元数属性.quaternion表示mesh的角度状态
    //.setFromUnitVectors();计算两个向量之间构成的四元数值
    waveMesh.quaternion.setFromUnitVectors(meshNormal, coordVec3);
    pointMesh.quaternion.setFromUnitVectors(meshNormal, coordVec3);

    pointMeshCollect.push(pointMesh);
    waveMeshCollect.push(waveMesh);
  });

  return { pointMeshCollect, waveMeshCollect };
};

export const waveAnimate = (meshData) => {
  // console.log(meshData)
  // 所有波动光圈都有自己的透明度和大小状态
  // 一个波动光圈透明度变化过程是：0~1~0反复循环
  meshData.forEach((mesh) => {
    mesh._s += 0.007;
    mesh.scale.set(mesh.size * mesh._s, mesh.size * mesh._s, mesh.size * mesh._s);
    if (mesh._s <= 1.5) {
      mesh.material.opacity = (mesh._s - 1) * 2; //2等于1/(1.5-1.0)，保证透明度在0~1之间变化
    } else if (mesh._s > 1.5 && mesh._s <= 2) {
      mesh.material.opacity = 1 - (mesh._s - 1.5) * 2; //2等于1/(2.0-1.5) mesh缩放2倍对应0 缩放1.5被对应1
    } else {
      mesh._s = 1.0;
    }
  });
};
