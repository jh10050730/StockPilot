// ==========================================
// StockPilot Home
// main.js
//
// 담당 기능
// 1. 목업 종목 데이터
// 2. 많이 보는 종목 출력
// 3. 종목 검색
// 4. 종목 상세 페이지 이동
// 5. AI 질문 UI
// 6. 빠른 질문 버튼
// 7. 플로팅 AI 버튼
//
// Header / 로그인 상태는
// header.js에서 관리
// ==========================================

// ==========================================
// 임시 국내 주식 데이터
//
// 실제 주식 API를 연결하면
// 이 배열을 서버 데이터로 교체한다.
// ==========================================

const stocks = window.StockPilotStocks;

// ==========================================
// DOM 가져오기
// ==========================================

const stockList = document.querySelector("#stockList");

const stockSearchInput = document.querySelector("#stockSearchInput");

const searchResult = document.querySelector("#searchResult");

const aiInput = document.querySelector("#aiInput");

const aiSendButton = document.querySelector("#aiSendButton");

const aiResponseSection = document.querySelector("#aiResponseSection");

const aiResponse = document.querySelector("#aiResponse");

const quickButtons = document.querySelectorAll(".quick-button");

const floatingAiButton = document.querySelector("#floatingAiButton");

const loggedInSummary = document.querySelector("#loggedInSummary");

const loggedOutSummary = document.querySelector("#loggedOutSummary");

const homeGreeting = document.querySelector("#homeGreeting");

const toggleBalanceButton = document.querySelector("#toggleBalanceButton");

const totalAssetValue = document.querySelector("#totalAssetValue");

const dailyProfitValue = document.querySelector("#dailyProfitValue");

const briefingButton = document.querySelector(".briefing-button");

const addWatchStockButton = document.querySelector(".watch-empty .blue-button");

const homeWatchList = document.querySelector("#homeWatchList");

const homeWatchEmpty = document.querySelector("#homeWatchEmpty");

const marketCards = document.querySelectorAll(".market-card[data-stock-code]");

function getFavoriteSymbols() {
  return window.StockPilotWatchlist.getLocalSymbols();
}

function renderHomeWatchlist() {
  if (!homeWatchList || !homeWatchEmpty) {
    return;
  }

  const favoriteSymbols = getFavoriteSymbols();
  const favoriteStocks = stocks.filter(function (stock) {
    return favoriteSymbols.includes(stock.code);
  });

  homeWatchList.innerHTML = "";

  if (favoriteStocks.length === 0) {
    homeWatchList.classList.add("hidden");
    homeWatchEmpty.classList.remove("hidden");
    return;
  }

  favoriteStocks.slice(0, 4).forEach(function (stock) {
    const item = document.createElement("button");
    item.type = "button";
    item.className = "home-watch-item";
    item.innerHTML = `
      <span class="home-watch-name">${stock.name}<small>${stock.code}</small></span>
      <span class="home-watch-price">${formatPrice(stock.price)}원<small class="${getChangeClass(stock.change)}">${getChangeText(stock.change)}</small></span>
    `;
    item.addEventListener("click", function () {
      openStockDetail(stock.code);
    });
    homeWatchList.appendChild(item);
  });

  homeWatchEmpty.classList.add("hidden");
  homeWatchList.classList.remove("hidden");
}

// ==========================================
// 홈 사용자 / 자산 요약
// ==========================================

function getHomeUser() {
  const accessToken = localStorage.getItem("accessToken");
  const savedUser = localStorage.getItem("user");

  if (!accessToken || !savedUser) {
    return null;
  }

  try {
    return JSON.parse(savedUser);
  } catch (error) {
    console.error("홈 사용자 정보를 읽지 못했습니다.", error);
    return null;
  }
}

function renderHomeSummary() {
  if (!loggedInSummary || !loggedOutSummary) {
    return;
  }

  const user = getHomeUser();

  if (!user) {
    loggedOutSummary.classList.remove("hidden");
    loggedInSummary.classList.add("hidden");
    return;
  }

  const nickname = user.nickname || "사용자";

  homeGreeting.textContent = `${nickname}님, 오늘도 좋은 투자하세요.`;
  loggedInSummary.classList.remove("hidden");
  loggedOutSummary.classList.add("hidden");
}

function toggleAssetVisibility() {
  if (!totalAssetValue || !dailyProfitValue || !toggleBalanceButton) {
    return;
  }

  const isHidden = toggleBalanceButton.getAttribute("aria-pressed") === "true";
  const nextHidden = !isHidden;

  toggleBalanceButton.setAttribute("aria-pressed", String(nextHidden));
  toggleBalanceButton.textContent = nextHidden ? "금액 보기" : "금액 숨기기";
  totalAssetValue.textContent = nextHidden ? "••••••••" : totalAssetValue.dataset.value;
  dailyProfitValue.textContent = nextHidden ? "••••••" : dailyProfitValue.dataset.value;
}

if (toggleBalanceButton) {
  toggleBalanceButton.addEventListener("click", toggleAssetVisibility);
}

if (briefingButton) {
  briefingButton.addEventListener("click", function () {
    const aiAssistant = document.querySelector("#aiAssistant");

    if (aiAssistant) {
      aiAssistant.scrollIntoView({ behavior: "smooth", block: "center" });
      aiInput?.focus();
    }
  });
}

if (addWatchStockButton) {
  addWatchStockButton.addEventListener("click", function () {
    stockSearchInput?.scrollIntoView({ behavior: "smooth", block: "center" });
    stockSearchInput?.focus();
  });
}

marketCards.forEach(function (card) {
  card.addEventListener("click", function () {
    openStockDetail(card.dataset.stockCode);
  });
});

// ==========================================
// 가격 형식
//
// 82300
// ↓
// 82,300
// ==========================================

function formatPrice(price) {
  return price.toLocaleString("ko-KR");
}

// ==========================================
// 등락률 문자열
// ==========================================

function getChangeText(change) {
  if (change > 0) {
    return `+${change}%`;
  }

  if (change < 0) {
    return `${change}%`;
  }

  return "0.00%";
}

// ==========================================
// 상승 / 하락 CSS Class
// ==========================================

function getChangeClass(change) {
  if (change > 0) {
    return "increase";
  }

  if (change < 0) {
    return "decrease";
  }

  return "";
}

// ==========================================
// 많이 보는 종목 출력
// ==========================================

function renderStocks() {
  if (!stockList) {
    return;
  }

  stockList.innerHTML = "";

  stocks.forEach(function (stock) {
    const item = document.createElement("div");

    item.className = "stock-item";

    const changeClass = getChangeClass(stock.change);

    const changeText = getChangeText(stock.change);

    item.innerHTML = `

            <div class="stock-rank">

                ${stock.rank}

            </div>


            <div class="stock-info">

                <span class="stock-name">

                    ${stock.name}

                </span>


                <span class="stock-code">

                    ${stock.code}

                </span>

            </div>


            <div class="stock-price-area">

                <span class="stock-price">

                    ${formatPrice(stock.price)}원

                </span>


                <span
                    class="stock-change ${changeClass}"
                >

                    ${changeText}

                </span>

            </div>

        `;

    // 종목 클릭
    item.addEventListener("click", function () {
      openStockDetail(stock.code);
    });

    stockList.appendChild(item);
  });
}

// ==========================================
// 종목 상세 페이지 열기
// ==========================================

function openStockDetail(code) {
  window.location.href = `./stock.html?code=${encodeURIComponent(code)}`;
}

// ==========================================
// 종목 검색
// ==========================================

function searchStocks(keyword) {
  if (!searchResult) {
    return;
  }

  const searchKeyword = keyword.trim().toLowerCase();

  // 검색창이 비어 있으면 닫기
  if (searchKeyword === "") {
    hideSearchResult();

    return;
  }

  const filteredStocks = stocks.filter(function (stock) {
    const stockName = stock.name.toLowerCase();

    const stockCode = stock.code.toLowerCase();

    return (
      stockName.includes(searchKeyword) || stockCode.includes(searchKeyword)
    );
  });

  renderSearchResults(filteredStocks);
}

// ==========================================
// 검색 결과 출력
// ==========================================

function renderSearchResults(results) {
  if (!searchResult) {
    return;
  }

  searchResult.innerHTML = "";

  // 결과 없음
  if (results.length === 0) {
    const emptyItem = document.createElement("div");

    emptyItem.className = "search-result-item";

    emptyItem.innerHTML = `

            <span class="search-result-name">

                검색 결과가 없습니다.

            </span>

        `;

    searchResult.appendChild(emptyItem);

    showSearchResult();

    return;
  }

  // 결과 출력
  results.forEach(function (stock) {
    const item = document.createElement("div");

    item.className = "search-result-item";

    item.innerHTML = `

            <span class="search-result-name">

                ${stock.name}

            </span>


            <span class="search-result-code">

                ${stock.code}

            </span>

        `;

    item.addEventListener("click", function () {
      openStockDetail(stock.code);
    });

    searchResult.appendChild(item);
  });

  showSearchResult();
}

// ==========================================
// 검색 결과 열기
// ==========================================

function showSearchResult() {
  if (!searchResult) {
    return;
  }

  searchResult.classList.remove("hidden");
}

// ==========================================
// 검색 결과 닫기
// ==========================================

function hideSearchResult() {
  if (!searchResult) {
    return;
  }

  searchResult.classList.add("hidden");
}

// ==========================================
// 검색창 이벤트
// ==========================================

if (stockSearchInput) {
  // 입력할 때마다 검색
  stockSearchInput.addEventListener("input", function () {
    searchStocks(stockSearchInput.value);
  });

  // Enter
  stockSearchInput.addEventListener("keydown", function (event) {
    if (event.key !== "Enter") {
      return;
    }

    const keyword = stockSearchInput.value.trim();

    if (keyword === "") {
      return;
    }

    const matchedStock = stocks.find(function (stock) {
      return stock.name === keyword || stock.code === keyword;
    });

    // 정확하게 일치하는 종목이 있으면
    // 바로 상세페이지 이동
    if (matchedStock) {
      openStockDetail(matchedStock.code);

      return;
    }

    searchStocks(keyword);
  });
}

// 검색 영역 외부 클릭 시 닫기

document.addEventListener("click", function (event) {
  if (!stockSearchInput || !searchResult) {
    return;
  }

  const searchSection = document.querySelector(".search-section");

  if (searchSection && !searchSection.contains(event.target)) {
    hideSearchResult();
  }
});

// ==========================================
// 임시 AI 응답
//
// 실제 AI API 연결 후
// 이 함수를 API 요청으로 변경한다.
// ==========================================

function getMockAiResponse(question) {
  const lowerQuestion = question.toLowerCase();

  // 삼성전자
  if (lowerQuestion.includes("삼성전자")) {
    return `

            <strong>
                삼성전자 분석
            </strong>

            <br><br>

            현재는 실제 주식 API와
            AI 모델이 연결되지 않아
            예시 응답을 보여주고 있습니다.

            <br><br>

            향후 StockPilot AI는

            <br><br>

            • 최근 주가 흐름

            <br>

            • 거래량 변화

            <br>

            • 관련 뉴스

            <br>

            • 주요 재무 정보

            <br>

            • 과거 가격 데이터

            <br><br>

            등을 함께 분석해
            결과를 보여줄 예정입니다.

            <br><br>

            <small>
                현재 표시되는 주가 데이터는
                프론트 개발용 목업 데이터입니다.
            </small>

        `;
  }

  // 시장
  if (
    lowerQuestion.includes("시장") ||
    lowerQuestion.includes("코스피") ||
    lowerQuestion.includes("코스닥")
  ) {
    return `

            <strong>
                오늘의 국내 시장
            </strong>

            <br><br>

            실제 시장 데이터가 연결되면
            KOSPI와 KOSDAQ의 흐름,
            거래량 변화,
            주요 업종과 시장 뉴스를
            AI가 분석해서 요약할 예정입니다.

        `;
  }

  // 뉴스
  if (lowerQuestion.includes("뉴스")) {
    return `

            <strong>
                AI 뉴스 요약
            </strong>

            <br><br>

            뉴스 API 연결 후
            국내 증시와 관심 종목에 관련된
            여러 뉴스를 AI가 분석해
            핵심 내용만 정리할 예정입니다.

        `;
  }

  // 인기
  if (lowerQuestion.includes("인기") || lowerQuestion.includes("많이 보는")) {
    return `

            <strong>
                많이 보는 종목
            </strong>

            <br><br>

            현재 프론트 테스트 데이터 기준입니다.

            <br><br>

            1. 삼성전자

            <br>

            2. SK하이닉스

            <br>

            3. NAVER

            <br>

            4. 카카오

            <br>

            5. 현대차

            <br>

            6. 셀트리온

        `;
  }

  // 자동주문
  if (
    lowerQuestion.includes("자동") ||
    lowerQuestion.includes("팔아") ||
    lowerQuestion.includes("매도") ||
    lowerQuestion.includes("매수")
  ) {
    return `

            <strong>
                자동주문 기능
            </strong>

            <br><br>

            추후에는 AI에게

            <br><br>

            "삼성전자 주가가 특정 가격 이상이 되면
            매도 조건 만들어줘"

            <br><br>

            같은 방식으로 요청할 수 있도록
            만들 예정입니다.

            <br><br>

            AI가 주문 조건을 정리한 뒤
            사용자가 최종 확인하고
            등록하는 구조로 개발합니다.

        `;
  }

  // 기본
  return `

        <strong>
            질문을 확인했어요.
        </strong>

        <br><br>

        "${escapeHtml(question)}"

        <br><br>

        현재는 프론트 개발 단계라
        실제 StockPilot AI 서버가
        연결되어 있지 않습니다.

        <br><br>

        추후 AI 서버를 연결하면
        실제 분석 결과가 이 영역에
        표시될 예정입니다.

    `;
}

// ==========================================
// AI 메시지 보내기
// ==========================================

function sendAiMessage() {
  if (!aiInput || !aiResponse || !aiResponseSection) {
    return;
  }

  const question = aiInput.value.trim();

  if (question === "") {
    aiInput.focus();

    return;
  }

  aiResponse.innerHTML = getMockAiResponse(question);

  aiResponseSection.classList.remove("hidden");

  aiInput.value = "";

  aiResponseSection.scrollIntoView({
    behavior: "smooth",
    block: "center",
  });
}

// ==========================================
// AI 전송 버튼
// ==========================================

if (aiSendButton) {
  aiSendButton.addEventListener("click", sendAiMessage);
}

// ==========================================
// AI Enter
// ==========================================

if (aiInput) {
  aiInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      sendAiMessage();
    }
  });
}

// ==========================================
// 빠른 질문 버튼
// ==========================================

quickButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    if (!aiInput) {
      return;
    }

    const question = button.dataset.question || button.textContent.trim();

    aiInput.value = question;

    sendAiMessage();
  });
});

// ==========================================
// 플로팅 AI 버튼
// ==========================================

if (floatingAiButton) {
  floatingAiButton.addEventListener("click", function () {
    const aiHero = document.querySelector(".ai-hero");

    if (aiHero) {
      aiHero.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }

    // 스크롤 이동 후 입력창 Focus
    setTimeout(function () {
      if (aiInput) {
        aiInput.focus();
      }
    }, 400);
  });
}

// ==========================================
// HTML Escape
// AI 입력값을 화면에 출력할 때
// HTML 코드가 실행되지 않도록 처리
// ==========================================

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")

    .replaceAll("<", "&lt;")

    .replaceAll(">", "&gt;")

    .replaceAll('"', "&quot;")

    .replaceAll("'", "&#039;");
}

// ==========================================
// 페이지 시작
// ==========================================

renderHomeSummary();

renderStocks();

renderHomeWatchlist();
window.StockPilotWatchlist.loadSymbols()
  .then(renderHomeWatchlist)
  .catch(function (error) {
    console.error("관심종목 동기화 실패", error);
  });
