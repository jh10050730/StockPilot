// ========================================
// 임시 종목 데이터
// 나중에 실제 API로 교체
// ========================================

const stockData = {
  "005930": {
    name: "삼성전자",
    code: "005930",
    market: "KOSPI",
    price: 82300,
    purchasePrice: 78000,
    changePrice: 1100,
    changeRate: 1.35,
  },

  "000660": {
    name: "SK하이닉스",
    code: "000660",
    market: "KOSPI",
    price: 192000,
    purchasePrice: 181000,
    changePrice: 4200,
    changeRate: 2.21,
  },

  "035420": {
    name: "NAVER",
    code: "035420",
    market: "KOSPI",
    price: 215000,
    purchasePrice: 220000,
    changePrice: -1550,
    changeRate: -0.72,
  },

  "035720": {
    name: "카카오",
    code: "035720",
    market: "KOSPI",
    price: 58400,
    purchasePrice: 60000,
    changePrice: -670,
    changeRate: -1.13,
  },

  "005380": {
    name: "현대차",
    code: "005380",
    market: "KOSPI",
    price: 241000,
    purchasePrice: 238000,
    changePrice: 2000,
    changeRate: 0.84,
  },

  "068270": {
    name: "셀트리온",
    code: "068270",
    market: "KOSPI",
    price: 183400,
    purchasePrice: 185000,
    changePrice: -800,
    changeRate: -0.42,
  },
};

// URL에서 code 가져오기

const params = new URLSearchParams(window.location.search);

const stockCodeFromUrl = params.get("code");

if (stockCodeFromUrl && !stockData[stockCodeFromUrl]) {
  window.location.replace(
    `./search.html?invalid=${encodeURIComponent(stockCodeFromUrl)}`,
  );
}

// 해당 종목 찾기
// code가 없으면 삼성전자를 기본값으로 사용

const stock = stockData[stockCodeFromUrl] || stockData["005930"];

// ========================================
// DOM
// ========================================

const stockName = document.querySelector("#stockName");

const stockCode = document.querySelector("#stockCode");

const stockPrice = document.querySelector("#stockPrice");

const stockChange = document.querySelector("#stockChange");

const favoriteButton = document.querySelector("#favoriteButton");

const buyTab = document.querySelector("#buyTab");

const sellTab = document.querySelector("#sellTab");

const orderButton = document.querySelector("#orderButton");

const orderPrice = document.querySelector("#orderPrice");

const orderQuantity = document.querySelector("#orderQuantity");

const orderTotal = document.querySelector("#orderTotal");

const autoOrderModal = document.querySelector("#autoOrderModal");

const openAutoOrderButton = document.querySelector("#openAutoOrderButton");

const closeModalButton = document.querySelector("#closeModalButton");

const saveAutoOrderButton = document.querySelector("#saveAutoOrderButton");

const autoOrderAction = document.querySelector("#autoOrderAction");

const autoOrderCondition = document.querySelector("#autoOrderCondition");

const autoOrderPrice = document.querySelector("#autoOrderPrice");

const autoOrderQuantity = document.querySelector("#autoOrderQuantity");

const autoOrderPreview = document.querySelector("#autoOrderPreview");

const autoOrderList = document.querySelector("#autoOrderList");

const stockAiInput = document.querySelector("#stockAiInput");

const stockAiSend = document.querySelector("#stockAiSend");

const stockAiResponse = document.querySelector("#stockAiResponse");

const stockPriceChart = document.querySelector("#stockPriceChart");

const purchasePriceLabel = document.querySelector("#purchasePriceLabel");

const chartComparisonText = document.querySelector("#chartComparisonText");

const chartPurchasePriceText = document.querySelector("#chartPurchasePriceText");

const chartPeakPriceText = document.querySelector("#chartPeakPriceText");

const chartPeakTimeText = document.querySelector("#chartPeakTimeText");

const chartLowPriceText = document.querySelector("#chartLowPriceText");

const chartCurrentPriceText = document.querySelector("#chartCurrentPriceText");

const chartCurrentTimeText = document.querySelector("#chartCurrentTimeText");

const stockChartArea = document.querySelector("#stockChartArea");

const stockChartLine = document.querySelector("#stockChartLine");

const chartPeakLine = document.querySelector("#chartPeakLine");

const chartPeakCircle = document.querySelector("#chartPeakCircle");

const chartCurrentLine = document.querySelector("#chartCurrentLine");

const chartCurrentCircle = document.querySelector("#chartCurrentCircle");

const orderCard = document.querySelector(".order-card");

const orderError = document.querySelector("#orderError");

const closeOrderSheetButton = document.querySelector("#closeOrderSheetButton");

const mobileOrderOverlay = document.querySelector("#mobileOrderOverlay");

const mobileBuyButton = document.querySelector("#mobileBuyButton");

const mobileSellButton = document.querySelector("#mobileSellButton");

const chartDetailCard = document.querySelector(".chart-detail-card");

if (chartDetailCard && orderCard) {
  chartDetailCard.insertAdjacentElement("afterend", orderCard);
}

// ========================================
// 종목 기본 정보
// ========================================

function renderStock() {
  stockName.textContent = stock.name;

  stockCode.textContent = `${stock.code} · ${stock.market}`;

  stockPrice.textContent = `${stock.price.toLocaleString()}원`;

  const isUp = stock.changeRate >= 0;

  const sign = isUp ? "+" : "";

  stockChange.textContent =
    `${sign}${stock.changePrice.toLocaleString()} ` +
    `(${sign}${stock.changeRate}%)`;

  stockChange.classList.remove("increase", "decrease");

  stockChange.classList.add(isUp ? "increase" : "decrease");

  document.title = `${stock.name} | StockPilot`;

  orderPrice.value = stock.price;

  const isAbovePurchase = stock.price >= stock.purchasePrice;
  const profitRate = ((stock.price - stock.purchasePrice) / stock.purchasePrice) * 100;
  const peakPrice = Math.round((stock.price * 1.0097) / 100) * 100;
  const lowPrice = Math.round((stock.price * 0.983) / 100) * 100;

  purchasePriceLabel.textContent = `${stock.purchasePrice.toLocaleString()}원`;
  chartComparisonText.textContent = `평균 매수가보다 ${Math.abs(profitRate).toFixed(2)}% ${isAbovePurchase ? "높아요" : "낮아요"}`;
  chartComparisonText.classList.toggle("increase", isAbovePurchase);
  chartComparisonText.classList.toggle("decrease", !isAbovePurchase);
  chartPurchasePriceText.textContent = `내 평균 ${stock.purchasePrice.toLocaleString()}원`;
  chartPeakPriceText.textContent = `${peakPrice.toLocaleString()}원`;
  chartLowPriceText.textContent = `${lowPrice.toLocaleString()}원`;
  chartCurrentPriceText.textContent = `${stock.price.toLocaleString()}원`;
  stockPriceChart.classList.toggle("chart-up", isAbovePurchase);
  stockPriceChart.classList.toggle("chart-down", !isAbovePurchase);

  const chartColor = isAbovePurchase ? "#f04452" : "#3182f6";
  const chartAreaGradient = isAbovePurchase
    ? "url(#stockChartAreaUp)"
    : "url(#stockChartAreaDown)";

  stockChartArea.setAttribute("fill", chartAreaGradient);
  stockChartLine.setAttribute("fill", "none");
  stockChartLine.setAttribute("stroke", chartColor);
  stockChartLine.setAttribute("stroke-width", "4");
  stockChartLine.setAttribute("stroke-linecap", "round");
  stockChartLine.setAttribute("stroke-linejoin", "round");
  chartPeakLine.setAttribute("stroke", chartColor);
  chartPeakCircle.setAttribute("fill", chartColor);
  chartPeakCircle.setAttribute("stroke", "#ffffff");
  chartPeakTimeText.setAttribute("fill", chartColor);
  chartPeakPriceText.setAttribute("fill", chartColor);
  chartCurrentLine.setAttribute("stroke", chartColor);
  chartCurrentCircle.setAttribute("fill", chartColor);
  chartCurrentCircle.setAttribute("stroke", "#ffffff");
  chartCurrentTimeText.setAttribute("fill", chartColor);
  chartCurrentPriceText.setAttribute("fill", chartColor);
  stockPriceChart.setAttribute(
    "aria-label",
    `${stock.name} 1일 가격 흐름 예시 차트. 장중 저점 ${lowPrice.toLocaleString()}원, 최고점 ${peakPrice.toLocaleString()}원, 현재가 ${stock.price.toLocaleString()}원. 평균 매수가 ${stock.purchasePrice.toLocaleString()}원보다 현재가가 ${isAbovePurchase ? "높음" : "낮음"}`,
  );

  updateOrderTotal();
}

renderStock();

// ========================================
// 관심종목
// ========================================

function getFavoriteSymbols() {
  return window.StockPilotWatchlist.getLocalSymbols();
}

let isFavorite = getFavoriteSymbols().includes(stock.code);

function renderFavoriteButton() {
  favoriteButton.textContent = isFavorite ? "★" : "☆";
  favoriteButton.classList.toggle("active", isFavorite);
  favoriteButton.setAttribute("aria-label", isFavorite ? "관심종목에서 제거" : "관심종목에 추가");
}

renderFavoriteButton();

window.StockPilotWatchlist.loadSymbols()
  .then(function (symbols) {
    isFavorite = symbols.includes(stock.code);
    renderFavoriteButton();
  })
  .catch(function (error) {
    console.error("관심종목 동기화 실패", error);
  });

favoriteButton.addEventListener("click", async function () {
  favoriteButton.disabled = true;
  try {
    if (isFavorite) {
      await window.StockPilotWatchlist.remove(stock.code);
    } else {
      await window.StockPilotWatchlist.add(stock.code);
    }
    isFavorite = !isFavorite;
    renderFavoriteButton();
    window.showToast(
      isFavorite ? "관심종목에 추가했습니다." : "관심종목에서 삭제했습니다.",
      "success",
    );
  } catch (error) {
    window.showToast(error.message, "error");
  } finally {
    favoriteButton.disabled = false;
  }
});

// ========================================
// 매수 / 매도 탭
// ========================================

let orderType = "buy";

function setOrderType(type) {
  orderType = type;

  const isBuy = type === "buy";

  buyTab.classList.toggle("active", isBuy);

  sellTab.classList.toggle("active", !isBuy);

  orderButton.textContent = isBuy ? "매수하기" : "매도하기";

  orderButton.classList.toggle("buy", isBuy);

  orderButton.classList.toggle("sell", !isBuy);
}

buyTab.addEventListener("click", function () {
  setOrderType("buy");
});

sellTab.addEventListener("click", function () {
  setOrderType("sell");
});

function openOrderSheet(type) {
  setOrderType(type);
  orderCard.classList.add("mobile-open");
  mobileOrderOverlay.classList.add("visible");
  mobileOrderOverlay.setAttribute("aria-hidden", "false");
  document.body.classList.add("order-sheet-open");
}

function closeOrderSheet() {
  orderCard.classList.remove("mobile-open");
  mobileOrderOverlay.classList.remove("visible");
  mobileOrderOverlay.setAttribute("aria-hidden", "true");
  document.body.classList.remove("order-sheet-open");
}

mobileBuyButton.addEventListener("click", function () {
  openOrderSheet("buy");
});

mobileSellButton.addEventListener("click", function () {
  openOrderSheet("sell");
});

closeOrderSheetButton.addEventListener("click", closeOrderSheet);

mobileOrderOverlay.addEventListener("click", closeOrderSheet);

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape" && orderCard.classList.contains("mobile-open")) {
    closeOrderSheet();
  }
});

// ========================================
// 주문 금액 계산
// ========================================

function updateOrderTotal() {
  const price = Number(orderPrice.value);

  const quantity = Number(orderQuantity.value);

  const isValid = Number.isInteger(price) && price > 0 && Number.isInteger(quantity) && quantity > 0;

  const total = isValid ? price * quantity : 0;

  orderTotal.textContent = isValid ? `${total.toLocaleString()}원` : "—";

  orderError.classList.add("hidden");
}

function validateOrder() {
  const price = Number(orderPrice.value);
  const quantity = Number(orderQuantity.value);

  if (!Number.isInteger(price) || price <= 0) {
    return "주문 가격을 1원 이상의 정수로 입력해주세요.";
  }

  if (!Number.isInteger(quantity) || quantity <= 0) {
    return "주문 수량을 1주 이상의 정수로 입력해주세요.";
  }

  return "";
}

orderPrice.addEventListener("input", updateOrderTotal);

orderQuantity.addEventListener("input", updateOrderTotal);

// 수량 버튼

const quantityButtons = document.querySelectorAll(".quantity-buttons button");

quantityButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    const addQuantity = Number(button.dataset.quantity);

    orderQuantity.value = Number(orderQuantity.value) + addQuantity;

    updateOrderTotal();
  });
});

// ========================================
// 주문 버튼
// ========================================

orderButton.addEventListener("click", function () {
  const price = Number(orderPrice.value);

  const quantity = Number(orderQuantity.value);

  const actionText = orderType === "buy" ? "매수" : "매도";

  const validationMessage = validateOrder();

  if (validationMessage) {
    orderError.textContent = validationMessage;
    orderError.classList.remove("hidden");
    return;
  }

  window.showToast(
    `${stock.name} ${quantity}주 ${actionText}\n${price.toLocaleString()}원 · 화면 테스트용 주문`,
    "success",
    3600,
  );

  closeOrderSheet();
});

// ========================================
// 자동주문 Modal
// ========================================

openAutoOrderButton.addEventListener("click", function () {
  autoOrderModal.classList.remove("hidden");

  updateAutoOrderPreview();
});

closeModalButton.addEventListener("click", function () {
  autoOrderModal.classList.add("hidden");
});

autoOrderModal.addEventListener("click", function (event) {
  if (event.target === autoOrderModal) {
    autoOrderModal.classList.add("hidden");
  }
});

// ========================================
// 자동주문 Preview
// ========================================

function updateAutoOrderPreview() {
  const action = autoOrderAction.value === "sell" ? "매도" : "매수";

  const condition =
    autoOrderCondition.value === "above" ? "이상이 되면" : "이하가 되면";

  const price = Number(autoOrderPrice.value);

  const quantity = Number(autoOrderQuantity.value);

  autoOrderPreview.innerHTML = `

        <strong>
            ${stock.name}
        </strong>

        <br>

        주가가

        <strong>
            ${price.toLocaleString()}원
        </strong>

        ${condition}

        <br>

        <strong>
            ${quantity}주 ${action}
        </strong>

    `;
}

autoOrderAction.addEventListener("change", updateAutoOrderPreview);

autoOrderCondition.addEventListener("change", updateAutoOrderPreview);

autoOrderPrice.addEventListener("input", updateAutoOrderPreview);

autoOrderQuantity.addEventListener("input", updateAutoOrderPreview);

// ========================================
// 자동주문 저장
// ========================================

const autoOrders = [];

saveAutoOrderButton.addEventListener("click", function () {
  const price = Number(autoOrderPrice.value);
  const quantity = Number(autoOrderQuantity.value);

  if (!Number.isInteger(price) || price <= 0) {
    window.showToast("목표 가격을 1원 이상의 정수로 입력해주세요.", "error");
    autoOrderPrice.focus();
    return;
  }

  if (!Number.isInteger(quantity) || quantity <= 0) {
    window.showToast("수량을 1주 이상의 정수로 입력해주세요.", "error");
    autoOrderQuantity.focus();
    return;
  }

  const newOrder = {
    action: autoOrderAction.value,

    condition: autoOrderCondition.value,

    price: price,

    quantity: quantity,
  };

  autoOrders.push(newOrder);

  renderAutoOrders();

  autoOrderModal.classList.add("hidden");
  window.showToast("자동주문 조건을 저장했습니다.", "success");
});

function renderAutoOrders() {
  autoOrderList.innerHTML = "";

  autoOrders.forEach(function (order) {
    const item = document.createElement("div");

    item.className = "auto-order-item";

    const action = order.action === "sell" ? "매도" : "매수";

    const condition = order.condition === "above" ? "이상" : "이하";

    item.innerHTML = `

                <strong>

                    ${order.price.toLocaleString()}원
                    ${condition}

                </strong>

                <span>

                    ${stock.name}
                    ${order.quantity}주
                    ${action}

                </span>

            `;

    autoOrderList.appendChild(item);
  });
}

// ========================================
// 종목 AI 질문
// ========================================

function sendStockAiMessage() {
  const question = stockAiInput.value.trim();

  if (question === "") {
    return;
  }

  stockAiResponse.classList.remove("hidden");

  stockAiResponse.innerHTML = `

        <strong>
            ✦ StockPilot AI
        </strong>

        <br><br>

        "${escapeHtml(question)}"

        <br><br>

        아직 실제 AI 서버가 연결되지 않아
        질문 입력 기능만 테스트하고 있습니다.

    `;

  stockAiInput.value = "";
}

stockAiSend.addEventListener("click", sendStockAiMessage);

stockAiInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    sendStockAiMessage();
  }
});

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// ========================================
// 차트 기간 버튼
// ========================================

const periodButtons = document.querySelectorAll(".period-button");

periodButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    periodButtons.forEach(function (item) {
      item.classList.remove("active");
    });

    button.classList.add("active");
  });
});
