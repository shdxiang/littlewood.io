// 全屏 three.js 示意页共用：把场景放进 #info 和 #status 之外的空白区。
// 画布照常铺满窗口（背景继续铺满），但投影中心挪到空白区中心，并按空白区大小让相机后退，
// 这样场景永远不会压在文字底下。横屏用文字右侧的区域；竖屏时文字块贴在底栏上方（scene.css），场景用顶栏和文字之间的区域。
// 用法：const relayout = fitScene({ camera, renderer, controls, radius, canMove }); 之后不用管，窗口和文字块变化时自动重排。
export function fitScene({ camera, renderer, controls, radius = 5, extent, minFrac = 0.33, canMove = () => true }) {
  const info = document.getElementById('info'), status = document.getElementById('status'), topbar = document.querySelector('.topbar');
  const base = camera.position.distanceTo(controls.target);
  let fitDist = base;
  const [hw, hh] = extent || [radius, radius];

  function layout() {
    const W = innerWidth, H = innerHeight;
    const r = info.getBoundingClientRect(), s = status.getBoundingClientRect(), t = topbar ? topbar.getBoundingClientRect() : { bottom: 0 };
    document.documentElement.style.setProperty('--status-h', `${Math.round(s.height)}px`);   // scene.css 用它把文字块贴在底栏上方
    const above = { x: 0, y: t.bottom, w: W, h: Math.max(0, r.top - t.bottom) };
    const below = { x: 0, y: r.bottom, w: W, h: Math.max(0, s.top - r.bottom) };
    const right = { x: r.right, y: 0, w: Math.max(0, W - r.right), h: s.top };
    const a = W > H && right.w >= W * .42 ? right : (above.h >= below.h ? above : below);

    renderer.setSize(W, H);
    camera.aspect = W / H;
    camera.setViewOffset(W, H, W / 2 - (a.x + a.w / 2), H / 2 - (a.y + a.h / 2), W, H);

    // 让半径 radius（或 extent 给的半宽半高）的场景装进空白区；空白区按至少 minFrac 屏算，免得相机退得太远
    const tanHalf = Math.tan(THREE_degToRad(camera.fov / 2));
    const d = Math.max(base,
      hw * H / (Math.max(a.w, W * minFrac) * tanHalf),
      hh * H / (Math.max(a.h, H * minFrac) * tanHalf));
    if (canMove()) camera.position.sub(controls.target).multiplyScalar(d / fitDist).add(controls.target);
    fitDist = d;
    controls.maxDistance = Math.max(controls.maxDistance, d * 1.6);
  }
  const THREE_degToRad = deg => deg * Math.PI / 180;

  addEventListener('resize', layout);
  if (window.ResizeObserver) new ResizeObserver(layout).observe(info);   // 「为什么」展开、换行数变化
  layout();
  return layout;
}
