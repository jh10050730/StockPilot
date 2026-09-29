const holdings = [
  { name: "삼성전자", code: "005930", quantity: 60, averagePrice: 78000, currentPrice: 82300 },
  { name: "SK하이닉스", code: "000660", quantity: 20, averagePrice: 181000, currentPrice: 192000 },
  { name: "NAVER", code: "035420", quantity: 2, averagePrice: 220000, currentPrice: 215000 },
];

const activities = [
  { type: "buy", name: "삼성전자", detail: "10주 · 81,500원", date: "오늘 10:32" },
  { type: "sell", name: "NAVER", detail: "1주 · 216,000원", date: "어제 14:18" },
  { type: "buy", name: "SK하이닉스", detail: "5주 · 188,500원", date: "9월 27일" },
];

const holdingsList = document.querySelector("#holdingsList");
const activityList = document.querySelector("#activityList");
const toggleAssetsButton = document.querySelector("#toggleAssetsButton");
const portfolioAiButton = document.querySelector("#portfolioAiButton");

function formatMoney(value) {
  return `${Math.abs(value).toLocaleString("ko-KR")}원`;
}

function renderHoldings() {
  holdingsList.innerHTML = "";

  holdings.forEach(function (holding) {
    const invested = holding.averagePrice * holding.quantity;
    const evaluated = holding.currentPrice * holding.quantity;
    const profit = evaluated - invested;
    const rate = (profit / invested) * 100;
    const isUp = profit >= 0;
    const item = document.createElement("a");

    item.className = "holding-row";
    item.href = `./stock.html?code=${encodeURIComponent(holding.code)}`;
    item.innerHTML = `
      <div class="holding-name">
        <strong>${holding.name}</strong>
        <span>${holding.quantity}주 · 평균 ${holding.averagePrice.toLocaleString("ko-KR")}원</span>
      </div>
      <div class="holding-value">
        <strong class="private-value" data-value="${formatMoney(evaluated)}">${formatMoney(evaluated)}</strong>
        <span class="${isUp ? "increase" : "decrease"} private-value" data-value="${isUp ? "+" : "-"}${formatMoney(profit)} (${isUp ? "+" : ""}${rate.toFixed(2)}%)">
          ${isUp ? "+" : "-"}${formatMoney(profit)} (${isUp ? "+" : ""}${rate.toFixed(2)}%)
        </span>
      </div>
    `;
    holdingsList.appendChild(item);
  });
}

function renderActivities() {
  activityList.innerHTML = "";

  activities.forEach(function (activity) {
    const item = document.createElement("div");
    const isBuy = activity.type === "buy";

    item.className = "activity-row";
    item.innerHTML = `
      <span class="activity-type ${activity.type}">${isBuy ? "매수" : "매도"}</span>
      <div>
        <strong>${activity.name}</strong>
        <span>${activity.detail}</span>
      </div>
      <time>${activity.date}</time>
    `;
    activityList.appendChild(item);
  });
}

function togglePrivateValues() {
  const shouldHide = toggleAssetsButton.getAttribute("aria-pressed") !== "true";

  toggleAssetsButton.setAttribute("aria-pressed", String(shouldHide));
  toggleAssetsButton.textContent = shouldHide ? "금액 보기" : "금액 숨기기";

  document.querySelectorAll(".private-value").forEach(function (element) {
    element.textContent = shouldHide ? "••••••" : element.dataset.value;
  });
}

toggleAssetsButton.addEventListener("click", togglePrivateValues);

portfolioAiButton.addEventListener("click", function () {
  window.showToast("포트폴리오 AI 분석은 자산 API와 AI 서버 연결 후 제공할 예정입니다.", "info", 3600);
});

renderHoldings();
renderActivities();
