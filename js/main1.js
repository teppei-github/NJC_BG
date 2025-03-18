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

// ドラッグ機能の修正（コンテナごとドラッグできるようにする）
document.addEventListener("DOMContentLoaded", function () {
  setupDraggable("clock_container", "clock");
  setupDraggable("calendar_container", "calendar");
  setupDraggable("timer_container", "timer");

  function setupDraggable(containerID, triggerID) {
    const container = document.getElementById(containerID);
    const trigger = document.getElementById(triggerID);
    let offsetX = 0;
    let offsetY = 0;
    let isDragging = false;

    // マウスダウンイベントでドラッグ開始
    trigger.addEventListener("mousedown", (event) => {
      isDragging = true;
      offsetX = event.clientX - container.offsetLeft;
      offsetY = event.clientY - container.offsetTop;
      trigger.style.cursor = "grabbing";
    });

    // マウス移動イベントで要素を移動
    document.addEventListener("mousemove", (event) => {
      if (isDragging) {
        const x = event.clientX - offsetX;
        const y = event.clientY - offsetY;
        container.style.left = `${x}px`;
        container.style.top = `${y}px`;
      }
    });

    // マウスアップイベントでドラッグ終了
    document.addEventListener("mouseup", () => {
      isDragging = false;
      trigger.style.cursor = "grab";
    });
  }
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

// タイマー機能の実装
document.addEventListener("DOMContentLoaded", function () {
  // タイマー関連の要素
  const hoursInput = document.getElementById("hours");
  const minutesInput = document.getElementById("minutes");
  const secondsInput = document.getElementById("seconds");
  const startButton = document.getElementById("start-btn");
  const stopButton = document.getElementById("stop-btn");
  const resetButton = document.getElementById("reset-btn");

  // タイマーの状態管理
  let timerInterval;
  let totalSeconds = 0;
  let originalSeconds = 0;

  // 入力フィールドにイベントリスナーを追加（数字のみ許可）
  [hoursInput, minutesInput, secondsInput].forEach((input) => {
    input.addEventListener("input", function () {
      // 数字以外の文字を削除
      this.value = this.value.replace(/[^0-9]/g, "");

      // 入力範囲を制限
      if (this.id === "hours") {
        if (parseInt(this.value) > 23) this.value = "23";
      } else {
        if (parseInt(this.value) > 59) this.value = "59";
      }
    });
  });

  // STARTボタンのイベントリスナー
  startButton.addEventListener("click", function () {
    // 現在の入力値を取得
    const hours = parseInt(hoursInput.value) || 0;
    const minutes = parseInt(minutesInput.value) || 0;
    const seconds = parseInt(secondsInput.value) || 0;

    // 合計秒数を計算
    totalSeconds = hours * 3600 + minutes * 60 + seconds;

    // タイマーが0秒以上でなければ実行しない
    if (totalSeconds <= 0) {
      alert("タイマーの時間を設定してください");
      return;
    }

    // 初回実行時のみオリジナルの値を保存
    if (originalSeconds === 0) {
      originalSeconds = totalSeconds;
    }

    // UIの更新
    startButton.style.display = "none";
    stopButton.style.display = "inline-block";
    resetButton.style.display = "none";

    // 入力フィールドを無効化
    toggleInputFields(false);

    // タイマーの開始
    updateTimerDisplay();
    timerInterval = setInterval(function () {
      totalSeconds--;

      if (totalSeconds <= 0) {
        // タイマー終了時の処理
        clearInterval(timerInterval);
        totalSeconds = 0;
        alert("タイマーが終了しました！");
        stopTimer();
        return;
      }

      updateTimerDisplay();
    }, 1000);
  });

  // STOPボタンのイベントリスナー
  stopButton.addEventListener("click", function () {
    stopTimer();
  });

  // RESETボタンのイベントリスナー
  resetButton.addEventListener("click", function () {
    resetTimer();
  });

  // タイマーを停止する関数
  function stopTimer() {
    clearInterval(timerInterval);

    // UIの更新
    stopButton.style.display = "none";
    startButton.style.display = "inline-block";
    resetButton.style.display = "inline-block";
  }

  // タイマーをリセットする関数
  function resetTimer() {
    // 元々設定した時間に戻す
    totalSeconds = originalSeconds;
    updateTimerDisplay();

    // UIの更新
    resetButton.style.display = "none";

    // 入力フィールドを有効化
    toggleInputFields(true);

    // オリジナルの値をリセット
    originalSeconds = 0;
  }

  // タイマーの表示を更新する関数
  function updateTimerDisplay() {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    hoursInput.value = hours.toString().padStart(2, "0");
    minutesInput.value = minutes.toString().padStart(2, "0");
    secondsInput.value = seconds.toString().padStart(2, "0");
  }

  // 入力フィールドの有効/無効を切り替える関数
  function toggleInputFields(enabled) {
    hoursInput.disabled = !enabled;
    minutesInput.disabled = !enabled;
    secondsInput.disabled = !enabled;
  }
});

// 閉じるボタンと再表示機能の実装
document.addEventListener("DOMContentLoaded", function () {
  // 各要素の参照を取得
  const clockContainer = document.getElementById("clock_container");
  const calendarContainer = document.getElementById("calendar_container");
  const timerContainer = document.getElementById("timer_container");

  // 閉じるボタンの参照を取得
  const closeClockBtn = document.getElementById("close-clock");
  const closeCalendarBtn = document.getElementById("close-calendar");
  const closeTimerBtn = document.getElementById("close-timer");

  // 再表示ボタンの参照を取得
  const restoreClockBtn = document.getElementById("restore-clock");
  const restoreCalendarBtn = document.getElementById("restore-calendar");
  const restoreTimerBtn = document.getElementById("restore-timer");

  // 閉じるボタンのイベントリスナー
  closeClockBtn.addEventListener("click", function () {
    clockContainer.classList.add("hidden");
    restoreClockBtn.style.display = "block";
  });

  closeCalendarBtn.addEventListener("click", function () {
    calendarContainer.classList.add("hidden");
    restoreCalendarBtn.style.display = "block";
  });

  closeTimerBtn.addEventListener("click", function () {
    timerContainer.classList.add("hidden");
    restoreTimerBtn.style.display = "block";
  });

  // 再表示ボタンのイベントリスナー
  restoreClockBtn.addEventListener("click", function () {
    clockContainer.classList.remove("hidden");
    restoreClockBtn.style.display = "none";
  });

  restoreCalendarBtn.addEventListener("click", function () {
    calendarContainer.classList.remove("hidden");
    restoreCalendarBtn.style.display = "none";
  });

  restoreTimerBtn.addEventListener("click", function () {
    timerContainer.classList.remove("hidden");
    restoreTimerBtn.style.display = "none";
  });

  // 初期状態では再表示ボタンを非表示にする
  restoreClockBtn.style.display = "none";
  restoreCalendarBtn.style.display = "none";
  restoreTimerBtn.style.display = "none";
});
