function tick() {
  const now = new Date(
    Date.now() + (new Date().getTimezoneOffset() + 9 * 60) * 60 * 1000
  );
  const h = now.getHours();
  const m = now.getMinutes();
  const s = now.getSeconds();
  const hourDeg = h * 30 + m * 0.5 + s * 0.00833333333;
  const minuteDeg = m * 6 + s * 0.1;
  const secondDeg = s * 6;
  document.getElementById("hour").style.transform = `rotate(${hourDeg}deg)`;
  document.getElementById("minute").style.transform = `rotate(${minuteDeg}deg)`;
  document.getElementById("second").style.transform = `rotate(${secondDeg}deg)`;
}

function init() {
  tick();
  document.getElementById("hour").style.background = "#333333";
  document.getElementById("minute").style.background = "#333333";
  document.getElementById("second").style.background = "#777777";
  setInterval(() => {
    tick();
  }, 100);
}

window.addEventListener("load", init);

// JavaScript to enable dragging
const draggable = document.getElementById("clock");

let offsetX = 0;
let offsetY = 0;
let isDragging = false;

// マウスダウンイベントでドラッグ開始
draggable.addEventListener("mousedown", (event) => {
  isDragging = true;
  offsetX = event.clientX - draggable.offsetLeft;
  offsetY = event.clientY - draggable.offsetTop;
  draggable.style.cursor = "grabbing"; // カーソルを変更
});

// マウス移動イベントで要素を移動
document.addEventListener("mousemove", (event) => {
  if (isDragging) {
    const x = event.clientX - offsetX;
    const y = event.clientY - offsetY;
    draggable.style.left = `${x}px`;
    draggable.style.top = `${y}px`;
  }
});

// マウスアップイベントでドラッグ終了
document.addEventListener("mouseup", () => {
  isDragging = false;
  draggable.style.cursor = "grab"; // カーソルを元に戻す
});
