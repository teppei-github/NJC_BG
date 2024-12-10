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
