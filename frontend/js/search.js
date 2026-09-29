const searchableStocks = window.StockPilotStocks;

const searchInput = document.querySelector("#stockSearchPageInput");
const clearSearchButton = document.querySelector("#clearSearchButton");
const startContent = document.querySelector("#searchStartContent");
const resultContent = document.querySelector("#searchResultContent");
const resultList = document.querySelector("#stockSearchPageResults");
const resultCount = document.querySelector("#searchResultCount");
const emptyState = document.querySelector("#searchEmptyState");
const popularStockList = document.querySelector("#popularStockList");
const recentSection = document.querySelector("#recentSearchSection");
const recentList = document.querySelector("#recentSearchList");
const clearRecentButton = document.querySelector("#clearRecentButton");
const recentStorageKey = "stockpilotRecentSearches";

function formatPrice(value) {
  return `${value.toLocaleString("ko-KR")}원`;
}

function getRecentSearches() {
  try {
    return JSON.parse(localStorage.getItem(recentStorageKey)) || [];
  } catch (error) {
    return [];
  }
}

function saveRecentStock(stock) {
  const recent = getRecentSearches().filter((item) => item.code !== stock.code);
  recent.unshift({ name: stock.name, code: stock.code });
  localStorage.setItem(recentStorageKey, JSON.stringify(recent.slice(0, 6)));
}

function openStock(stock) {
  saveRecentStock(stock);
  window.location.href = `./stock.html?code=${encodeURIComponent(stock.code)}`;
}

function createStockItem(stock, showRank) {
  const button = document.createElement("button");
  const changeClass = stock.change >= 0 ? "rise" : "fall";
  const changeSign = stock.change > 0 ? "+" : "";
  button.type = "button";
  button.className = "stock-result-item";
  button.innerHTML = `
    <span class="stock-rank">${showRank ? stock.rank : ""}</span>
    <span class="stock-main">
      <span class="stock-name">${stock.name}</span>
      <span class="stock-meta">${stock.code} · ${stock.market}</span>
    </span>
    <span class="stock-price">
      <strong>${formatPrice(stock.price)}</strong>
      <span class="${changeClass}">${changeSign}${stock.change.toFixed(2)}%</span>
    </span>`;
  button.addEventListener("click", () => openStock(stock));
  return button;
}

function renderPopularStocks() {
  popularStockList.replaceChildren(...searchableStocks.map((stock) => createStockItem(stock, true)));
}

function renderRecentSearches() {
  const recent = getRecentSearches();
  recentSection.classList.toggle("hidden", recent.length === 0);
  recentList.replaceChildren();
  recent.forEach((item) => {
    const stock = searchableStocks.find((candidate) => candidate.code === item.code);
    if (!stock) return;
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "recent-search-chip";
    chip.textContent = stock.name;
    chip.addEventListener("click", () => openStock(stock));
    recentList.appendChild(chip);
  });
}

function runSearch() {
  const keyword = searchInput.value.trim().toLowerCase();
  clearSearchButton.classList.toggle("hidden", keyword.length === 0);
  startContent.classList.toggle("hidden", keyword.length > 0);
  resultContent.classList.toggle("hidden", keyword.length === 0);
  searchInput.setAttribute("aria-expanded", String(keyword.length > 0));
  if (!keyword) return;

  const matches = searchableStocks.filter((stock) =>
    stock.name.toLowerCase().includes(keyword) || stock.code.includes(keyword),
  );
  resultCount.textContent = `${matches.length}개`;
  emptyState.classList.toggle("hidden", matches.length > 0);
  resultList.classList.toggle("hidden", matches.length === 0);
  resultList.replaceChildren(...matches.map((stock) => createStockItem(stock, false)));
}

searchInput.addEventListener("input", runSearch);
searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    searchInput.value = "";
    runSearch();
    return;
  }

  if (event.key === "ArrowDown") {
    const firstButton = resultContent.classList.contains("hidden")
      ? popularStockList.querySelector("button")
      : resultList.querySelector("button");
    if (firstButton) {
      event.preventDefault();
      firstButton.focus();
    }
    return;
  }

  if (event.key !== "Enter" || searchInput.value.trim() === "") return;
  const firstResult = searchableStocks.find((stock) =>
    stock.name.toLowerCase().includes(searchInput.value.trim().toLowerCase()) ||
    stock.code.includes(searchInput.value.trim()),
  );
  if (firstResult) openStock(firstResult);
});

clearSearchButton.addEventListener("click", () => {
  searchInput.value = "";
  runSearch();
  searchInput.focus();
});

clearRecentButton.addEventListener("click", () => {
  localStorage.removeItem(recentStorageKey);
  renderRecentSearches();
});

renderPopularStocks();
renderRecentSearches();

const invalidStockCode = new URLSearchParams(window.location.search).get("invalid");
if (invalidStockCode) {
  window.showToast(`종목코드 ${invalidStockCode}을(를) 찾을 수 없습니다.`, "error", 3600);
}
