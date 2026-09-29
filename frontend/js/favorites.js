const favoriteStockData = Object.fromEntries(
  window.StockPilotStocks.map(function (stock) {
    return [stock.code, stock];
  }),
);

const favoritesList = document.querySelector("#favoritesList");
const favoritesContent = document.querySelector("#favoritesContent");
const favoritesEmpty = document.querySelector("#favoritesEmpty");
const favoriteCount = document.querySelector("#favoriteCount");
const favoritesNoticeText = document.querySelector("#favoritesNoticeText");
const favoritesLoading = document.querySelector("#favoritesLoading");

function getFavoriteSymbols() {
  return window.StockPilotWatchlist.getLocalSymbols();
}

function getChangeText(change) {
  return `${change > 0 ? "+" : ""}${change.toFixed(2)}%`;
}

async function removeFavorite(symbol, button) {
  button.disabled = true;
  try {
    await window.StockPilotWatchlist.remove(symbol);
    renderFavorites();
    window.showToast("관심종목에서 삭제했습니다.", "success");
  } catch (error) {
    window.showToast(error.message, "error");
    button.disabled = false;
  }
}

function renderFavorites() {
  const symbols = getFavoriteSymbols();
  const stocks = symbols.map(function (symbol) {
    return favoriteStockData[symbol];
  }).filter(Boolean);

  favoriteCount.textContent = String(stocks.length);
  favoritesList.innerHTML = "";

  if (stocks.length === 0) {
    favoritesContent.classList.add("hidden");
    favoritesEmpty.classList.remove("hidden");
    return;
  }

  stocks.forEach(function (stock) {
    const row = document.createElement("article");
    const changeClass = stock.change >= 0 ? "increase" : "decrease";

    row.className = "favorite-row";
    row.innerHTML = `
      <a class="favorite-stock-link" href="./stock.html?code=${encodeURIComponent(stock.code)}">
        <strong>${stock.name}</strong>
        <span>${stock.code} · ${stock.market}</span>
      </a>
      <a class="favorite-price" href="./stock.html?code=${encodeURIComponent(stock.code)}">
        <strong>${stock.price.toLocaleString("ko-KR")}원</strong>
        <span class="${changeClass}">${getChangeText(stock.change)}</span>
      </a>
      <button class="favorite-remove-button" type="button" aria-label="${stock.name} 관심종목에서 제거">★</button>
    `;

    row.querySelector(".favorite-remove-button").addEventListener("click", function (event) {
      removeFavorite(stock.code, event.currentTarget);
    });

    favoritesList.appendChild(row);
  });

  favoritesEmpty.classList.add("hidden");
  favoritesContent.classList.remove("hidden");
}

async function initializeFavorites() {
  try {
    await window.StockPilotWatchlist.loadSymbols();
    favoritesNoticeText.textContent = window.StockPilotWatchlist.isLoggedIn()
      ? "로그인 계정에 저장된 관심종목입니다. 다른 기기에서도 동일하게 확인할 수 있어요."
      : "로그인 전에는 관심종목이 이 브라우저에 임시 저장됩니다.";
  } catch (error) {
    favoritesNoticeText.textContent = "서버와 동기화하지 못해 이 브라우저에 저장된 목록을 표시합니다.";
    console.error(error);
  }
  favoritesLoading.classList.add("hidden");
  favoritesLoading.setAttribute("aria-busy", "false");
  renderFavorites();
}

initializeFavorites();
