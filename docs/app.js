const weatherData = {
  sat: "周六先走天母湖与藏寨，避免午后赶王朗",
  sun: "周日晴间多云，第一班观光车进山更从容"
};

document.querySelectorAll("[data-weather]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-weather]").forEach((item) => {
      const active = item === button;
      item.classList.toggle("active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    document.querySelector("#weatherVerdict b").textContent = weatherData[button.dataset.weather];
  });
});

const profileAdvice = {
  photo: "<b>摄影优先：</b>天母湖把时间压到 15:30 前，低角度光线更有层次；王朗建议第一班观光车进山，薄雾和空镜概率更高。",
  walk: "<b>轻徒步优先：</b>把第二天上午完整留给白沙沟 / 甘海子方向。薄雪后木栈道易滑，带登山杖但不离开开放步道。",
  family: "<b>亲子 / 长辈优先：</b>减少甘海子长线，选择观光车 + 短步道组合；每走 30–40 分钟就休息，出现头痛、恶心立即下降海拔。",
  culture: "<b>人文优先：</b>第一天下午别急着拍完就走，向民宿主人询问曹盖面具、圆圆舞与传统服饰；篝火是否举行以当晚通知为准。"
};

document.querySelectorAll("[data-profile]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-profile]").forEach((item) => {
      const active = item === button;
      item.classList.toggle("active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    document.querySelector("#preferenceAdvice p").innerHTML = profileAdvice[button.dataset.profile];
  });
});

document.querySelectorAll("[data-day]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-day]").forEach((item) => {
      const active = item === button;
      item.classList.toggle("active", active);
      item.setAttribute("aria-selected", String(active));
    });
    document.querySelectorAll(".day-panel").forEach((panel) => {
      const active = panel.id === button.dataset.day;
      panel.classList.toggle("active", active);
      panel.hidden = !active;
    });
  });
});

const copyButton = document.querySelector("#copyCoords");
copyButton.addEventListener("click", async () => {
  const feedback = document.querySelector("#copyFeedback");
  try {
    await navigator.clipboard.writeText(copyButton.dataset.coords);
    feedback.textContent = "已复制：104.053139, 32.92816";
  } catch {
    feedback.textContent = copyButton.dataset.coords;
  }
  window.setTimeout(() => { feedback.textContent = ""; }, 2600);
});

const budgetInputs = [...document.querySelectorAll(".calc-inputs input")];
const money = (value) => Math.round(value).toLocaleString("zh-CN");

function updateBudget() {
  const people = Number(document.querySelector("#people").value) || 1;
  const rooms = Number(document.querySelector("#rooms").value) || 1;
  const distance = Number(document.querySelector("#distance").value) || 0;
  const consumption = Number(document.querySelector("#consumption").value) || 0;
  const fuelPrice = Number(document.querySelector("#fuelPrice").value) || 0;
  const toll = Number(document.querySelector("#toll").value) || 0;
  const roomPrice = Number(document.querySelector("#roomPrice").value) || 0;
  const ticket = Number(document.querySelector("#ticket").value) || 0;
  const food = Number(document.querySelector("#food").value) || 0;

  const costs = {
    "燃油": distance * consumption / 100 * fuelPrice,
    "高速": toll,
    "住宿": rooms * roomPrice,
    "票车": people * ticket,
    "餐饮": people * food,
    "机动": people * 100
  };
  const total = Object.values(costs).reduce((sum, value) => sum + value, 0);
  document.querySelector("#totalBudget").textContent = money(total);
  document.querySelector("#perPerson").textContent = money(total / people);

  const max = Math.max(...Object.values(costs), 1);
  document.querySelector("#costBars").innerHTML = Object.entries(costs).map(([name, value]) => `
    <div class="cost-row"><span>${name}</span><div class="bar"><i style="width:${Math.max(4, value / max * 100)}%"></i></div><b>¥${money(value)}</b></div>
  `).join("");
}

budgetInputs.forEach((input) => input.addEventListener("input", updateBudget));
updateBudget();

const packingBoxes = [...document.querySelectorAll("#packingList input[type='checkbox']")];
const storageKey = "wanglang-packing-v1";

function savePacking() {
  const selected = packingBoxes.filter((box) => box.checked).map((box) => box.dataset.item);
  localStorage.setItem(storageKey, JSON.stringify(selected));
  updatePackingProgress();
}

function updatePackingProgress() {
  const checked = packingBoxes.filter((box) => box.checked).length;
  const total = packingBoxes.length;
  document.querySelector("#packingCount").textContent = `${checked}/${total}`;
  document.querySelector("#progressRing").style.setProperty("--progress", `${checked / total * 360}deg`);
}

try {
  const saved = JSON.parse(localStorage.getItem(storageKey) || "[]");
  packingBoxes.forEach((box) => { box.checked = saved.includes(box.dataset.item); });
} catch {
  localStorage.removeItem(storageKey);
}

packingBoxes.forEach((box) => box.addEventListener("change", savePacking));
document.querySelector("#resetPacking").addEventListener("click", () => {
  packingBoxes.forEach((box) => { box.checked = false; });
  savePacking();
});
updatePackingProgress();
