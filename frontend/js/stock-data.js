window.StockPilotStocks = [
  { rank: 1, name: "삼성전자", code: "005930", market: "KOSPI", price: 82300, change: 1.35 },
  { rank: 2, name: "SK하이닉스", code: "000660", market: "KOSPI", price: 192000, change: 2.21 },
  { rank: 3, name: "NAVER", code: "035420", market: "KOSPI", price: 215000, change: -0.72 },
  { rank: 4, name: "카카오", code: "035720", market: "KOSPI", price: 58400, change: -1.13 },
  { rank: 5, name: "현대차", code: "005380", market: "KOSPI", price: 241000, change: 0.84 },
  { rank: 6, name: "셀트리온", code: "068270", market: "KOSPI", price: 183400, change: -0.42 },
];

window.getStockPilotStock = function (code) {
  return window.StockPilotStocks.find(function (stock) {
    return stock.code === String(code);
  });
};
