// 全屏 three.js 示意页共用：把渲染器装进 .stage，按它的大小出图，并让场景装得下。
// 用法：const layout = fitStage({ camera, renderer, controls, radius | extent, canMove });
//   stage 尺寸变化时自动重排；canMove 返回 false 时只改画幅、不动相机（比如第一人称镜头里）。
export function fitStage({ camera, renderer, controls, radius = 5, extent, canMove = () => true }) {
  const stage = document.querySelector('.stage');
  stage.appendChild(renderer.domElement);
  const base = camera.position.distanceTo(controls.target);
  let fitDist = base;
  const [hw, hh] = extent || [radius, radius];

  function layout() {
    const W = Math.max(1, stage.clientWidth), H = Math.max(1, stage.clientHeight);
    renderer.setSize(W, H);
    camera.aspect = W / H; camera.updateProjectionMatrix();
    // 相机沿当前方向后退，直到半径 radius（或 extent 给的半宽半高）的场景装进画幅
    const tanHalf = Math.tan(camera.fov * Math.PI / 360);
    const d = Math.max(base, hw / (tanHalf * camera.aspect), hh / tanHalf);
    if (canMove()) camera.position.sub(controls.target).multiplyScalar(d / fitDist).add(controls.target);
    fitDist = d;
    controls.maxDistance = Math.max(controls.maxDistance, d * 1.6);
  }
  if (window.ResizeObserver) new ResizeObserver(layout).observe(stage); else addEventListener('resize', layout);
  layout();
  return layout;
}
