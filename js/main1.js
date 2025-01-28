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

const draggable1 = document.getElementById("clock");
let offsetX1 = 0;
let offsetY1 = 0;
let isDragging1 = false;

// マウスダウンイベントでドラッグ開始
draggable1.addEventListener("mousedown", (event) => {
  isDragging1 = true;
  offsetX1 = event.clientX - draggable1.offsetLeft;
  offsetY1 = event.clientY - draggable1.offsetTop;
  draggable1.style.cursor = "grabbing"; // カーソルを変更
});

// マウス移動イベントで要素を移動
document.addEventListener("mousemove", (event) => {
  if (isDragging1) {
    const x = event.clientX - offsetX1;
    const y = event.clientY - offsetY1;
    draggable1.style.left = `${x}px`;
    draggable1.style.top = `${y}px`;
  }
});

// マウスアップイベントでドラッグ終了
document.addEventListener("mouseup", () => {
  isDragging1 = false;
  draggable1.style.cursor = "grab"; // カーソルを元に戻す
});

const draggable2 = document.getElementById("calendar");
let offsetX2 = 0;
let offsetY2 = 0;
let isDragging2 = false;

// マウスダウンイベントでドラッグ開始
draggable2.addEventListener("mousedown", (event) => {
  isDragging2 = true;
  offsetX2 = event.clientX - draggable2.offsetLeft;
  offsetY2 = event.clientY - draggable2.offsetTop;
  draggable2.style.cursor = "grabbing"; // カーソルを変更
});

// マウス移動イベントで要素を移動
document.addEventListener("mousemove", (event) => {
  if (isDragging2) {
    const x = event.clientX - offsetX2;
    const y = event.clientY - offsetY2;
    draggable2.style.left = `${x}px`;
    draggable2.style.top = `${y}px`;
  }
});

// マウスアップイベントでドラッグ終了
document.addEventListener("mouseup", () => {
  isDragging2 = false;
  draggable2.style.cursor = "grab"; // カーソルを元に戻す
});

document.addEventListener("DOMContentLoaded", function () {
  const date = new Date();
  const monthsList = [
    "Jan.",
    "Feb.",
    "Mar.",
    "Apr.",
    "May",
    "June",
    "July",
    "Aug.",
    "Sept.",
    "Oct.",
    "Nov.",
    "Dec.",
  ];

  let month = date.getMonth();
  let monthEnglish = monthsList[month];
  let day = date.getDate();

  // .month クラスを持つ要素のテキストを更新
  document.querySelector(".month").textContent = monthEnglish;
  // .date クラスを持つ要素のテキストを更新
  document.querySelector(".datetext").textContent = day;
});

document.addEventListener("DOMContentLoaded", function () {
  // 本日の日付を取得し、yyyy/mm/dd形式にフォーマット
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0"); // 月を2桁にする
  const dd = String(today.getDate()).padStart(2, "0"); // 日を2桁にする
  const formattedDate = `${yyyy}-${mm}-${dd}`;
  //const formattedDate = `2025-01-01`;

  // APIのURLを作成
  const apiUrl = `https://holidays-jp.github.io/api/v1/${yyyy}/date.json`;

  // APIを呼び出す
  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("APIリクエストが失敗しました");
      }
      return response.json();
    })
    .then((data) => {
      // もし、特別な日付を設定したい場合はdataに追加する

      // APIの戻り値を .datetitle 要素に表示
      if (data[formattedDate]) {
        document.querySelector(".datetitle").textContent = data[formattedDate];
      }
    });
});
