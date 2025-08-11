/*
 * @Editor: zhanghang
 * @Description: 绘制辉光
 * @Date: 2024-06-19 09:58:44
 * @LastEditors: zhanghang
 * @LastEditTime: 2024-07-12 11:04:26
 */
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
// SMAA抗锯齿通道
import { SMAAPass } from "three/examples/jsm/postprocessing/SMAAPass.js";
// FXAA抗锯齿Shader
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader.js";

import * as THREE from "three";

const vs = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`;
// const fs = `
// uniform sampler2D baseTexture;
// uniform sampler2D bloomTexture;
// varying vec2 vUv;
// void main() {
//   gl_FragColor = ( texture2D( baseTexture, vUv ) + vec4( 1.0 ) * texture2D( bloomTexture, vUv ) );
// }
// `;
const fs = `uniform sampler2D baseTexture;
uniform sampler2D bloomTexture;
varying vec2 vUv;
void main() {
vec4 base_color = texture2D(baseTexture, vUv);
vec4 bloom_color = texture2D(bloomTexture, vUv);

float lum = 0.21 * bloom_color.r + 0.71 * bloom_color.g + 0.07 * bloom_color.b;
gl_FragColor = vec4(base_color.rgb + bloom_color.rgb, max(base_color.a, lum));
}`;

export const drawGlow = function (options) {
  const glow = options.glow;
  const { scene, camera, renderer, innerWidth, innerHeight } = this;
  const renderPass = new RenderPass(scene, camera);
  const bloomPass = new UnrealBloomPass(new THREE.Vector2(renderer.domElement.offsetWidth, renderer.domElement.offsetHeight), 1, 1, 0.1);
  bloomPass.threshold = glow.threshold;
  bloomPass.strength = glow.strength;
  bloomPass.radius = glow.radius;

  const bloomComposer = new EffectComposer(renderer);
  bloomComposer.renderToScreen = false;
  bloomComposer.addPass(renderPass);
  bloomComposer.addPass(bloomPass);
 

  const finalComposer = new EffectComposer(renderer);
  const shaderPass = new ShaderPass(
    new THREE.ShaderMaterial({
      uniforms: {
        baseTexture: { value: null },
        bloomTexture: { value: bloomComposer.renderTarget2.texture },
      },
      vertexShader: vs,
      fragmentShader: fs,
      defines: {},
    }),
    "baseTexture"
  );
  shaderPass.needsSwap = true;
  finalComposer.addPass(renderPass);
  finalComposer.addPass(shaderPass);

   // SMAAPass抗锯齿通道
   const pixelRatio = renderer.getPixelRatio(); // 获取像素比
   const smaaPass = new SMAAPass(innerWidth * pixelRatio, innerHeight * pixelRatio);
   finalComposer.addPass(smaaPass);
   
  return { bloomComposer, finalComposer };
};
