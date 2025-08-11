/*
 * @Editor: zhanghang
 * @Description: 绘制卫星
 * @Date: 2024-08-28 11:05:41
 * @LastEditors: zhanghang
 * @LastEditTime: 2024-11-06 14:59:49
 */
import { TextureLoader, PlaneGeometry, MeshBasicMaterial, Color, Vector3, DoubleSide, BufferGeometry, Mesh, Points, PointsMaterial } from "three";
import ringTexture from "../asset/ring.png";
import planetTexture from "../asset/planet.png";
export const drawSatellite = (options) => {
  const satellites = [];

  options.data.forEach((element) => {
    const { ring, planet, autoRotateDirection, autoRotateSpeed } = element;
    const degree = ring.degree;
    //卫星环
    const image = ring.texture === "default" || !ring.texture ? ringTexture : ring.texture;
    // TextureLoader创建一个纹理加载器对象，可以加载图片作为纹理贴图
    const textureLoader = new TextureLoader();
    //加载纹理贴图
    const texture = textureLoader.load(image);

    const geometry = new PlaneGeometry(ring.radius * 2, ring.radius * 2);
    const opacity = tinycolor(ring.color).getAlpha();
    const material = new MeshBasicMaterial({
      map: texture,
      color: ring.color,
      transparent: true,
      side: DoubleSide,
      opacity,
      depthWrite: false,
    });
    const mesh = new Mesh(geometry, material);
    mesh.rotation.x = (Math.PI * degree[0]) / 180;
    mesh.rotation.y = (Math.PI * degree[1]) / 180;
    mesh.rotation.z = (Math.PI * degree[2]) / 180;

    // 绘制卫星
    const radian = (Math.PI * (360 / planet.num)) / 180;

    //卫星
    const planetImage = planet.texture === "default" || !planet.texture ? planetTexture : planet.texture;
    //加载纹理贴图
    const planetMap = textureLoader.load(planetImage);

    const points = [];
    for (let i = 0; i < planet.num; i++) {
      const x = Math.sin(i * radian) * ring.radius;
      const y = Math.cos(i * radian) * ring.radius;

      const point = new Vector3(x, y, 0);
      points.push(point);
    }
    const planetGeometry = new BufferGeometry().setFromPoints(points);
    const ball = new Points(
      planetGeometry,
      new PointsMaterial({
        map: planetMap,
        transparent: true,
        side: DoubleSide,
        size: planet.size,
        depthWrite: false,
      })
    );
    ball.renderOrder = 91;
    mesh._direction = autoRotateDirection;
    mesh._speed = autoRotateSpeed;
    mesh.add(ball);
    mesh.renderOrder = 90;
    satellites.push(mesh);
  });

  return satellites;
};
