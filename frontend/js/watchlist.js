(function () {
  const apiUrl = `${window.StockPilotConfig.apiBaseUrl}/watchlists`;
  const legacyStorageKey = "favoriteSymbols";

  function getToken() {
    return localStorage.getItem("accessToken");
  }

  function getStorageKey() {
    if (!getToken()) return "favoriteSymbols:guest";
    try {
      const user = JSON.parse(localStorage.getItem("user")) || {};
      const identifier = user.id || user.email || "signed-in";
      return `favoriteSymbols:user:${identifier}`;
    } catch (error) {
      return "favoriteSymbols:user:signed-in";
    }
  }

  function migrateLegacySymbols() {
    const storageKey = getStorageKey();
    if (localStorage.getItem(storageKey) !== null) return;
    const legacyValue = localStorage.getItem(legacyStorageKey);
    if (legacyValue !== null) {
      localStorage.setItem(storageKey, legacyValue);
      localStorage.removeItem(legacyStorageKey);
    }
  }

  function getLocalSymbols() {
    migrateLegacySymbols();
    try {
      const value = JSON.parse(localStorage.getItem(getStorageKey())) || [];
      return Array.isArray(value) ? value : [];
    } catch (error) {
      return [];
    }
  }

  function saveLocalSymbols(symbols) {
    const normalized = [...new Set(symbols.map(String))];
    localStorage.setItem(getStorageKey(), JSON.stringify(normalized));
    window.dispatchEvent(new CustomEvent("watchlist:changed", { detail: normalized }));
    return normalized;
  }

  async function request(path, options) {
    const token = getToken();
    if (!token) throw new Error("로그인이 필요한 기능입니다.");
    const response = await fetch(`${apiUrl}${path}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...(options && options.headers),
      },
    });
    const data = await response.json().catch(() => ({}));
    if (response.status === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      const returnTo = `.${window.location.pathname}${window.location.search}`;
      window.location.href = `./login.html?reason=expired&returnTo=${encodeURIComponent(returnTo)}`;
      throw new Error("로그인이 만료되었습니다. 다시 로그인해주세요.");
    }
    if (!response.ok) {
      const message = Array.isArray(data.message) ? data.message[0] : data.message;
      throw new Error(message || "관심종목을 처리하지 못했습니다.");
    }
    return data;
  }

  async function loadSymbols() {
    if (!getToken()) return getLocalSymbols();

    const localSymbols = getLocalSymbols();
    const migrationKey = `${getStorageKey()}:server-migrated`;
    const needsMigration = localStorage.getItem(migrationKey) !== "true";
    if (needsMigration && localSymbols.length > 0) {
      await Promise.allSettled(
        localSymbols.map((symbol) =>
          request("", { method: "POST", body: JSON.stringify({ symbol }) }),
        ),
      );
    }

    const watchlists = await request("", { method: "GET" });
    if (needsMigration) localStorage.setItem(migrationKey, "true");
    return saveLocalSymbols(watchlists.map((item) => item.symbol));
  }

  async function add(symbol) {
    if (!getToken()) return saveLocalSymbols([...getLocalSymbols(), symbol]);
    await request("", { method: "POST", body: JSON.stringify({ symbol }) });
    return saveLocalSymbols([...getLocalSymbols(), symbol]);
  }

  async function remove(symbol) {
    if (!getToken()) return saveLocalSymbols(getLocalSymbols().filter((item) => item !== symbol));
    await request(`/${encodeURIComponent(symbol)}`, { method: "DELETE" });
    return saveLocalSymbols(getLocalSymbols().filter((item) => item !== symbol));
  }

  window.StockPilotWatchlist = {
    isLoggedIn: () => Boolean(getToken()),
    getLocalSymbols,
    saveLocalSymbols,
    loadSymbols,
    add,
    remove,
  };
})();
