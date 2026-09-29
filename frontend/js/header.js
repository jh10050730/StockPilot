// ==========================================
// StockPilot 공통 Header
// ==========================================

const appHeader = document.querySelector("#appHeader");

// ==========================================
// 현재 페이지 확인
// ==========================================

function getCurrentPage() {
  const path = window.location.pathname;

  if (path.includes("search.html")) {
    return "domestic";
  }

  if (path.includes("stock.html")) {
    return "domestic";
  }

  if (path.includes("favorites.html")) {
    return "favorites";
  }

  if (path.includes("ai.html")) {
    return "ai";
  }

  if (path.includes("news.html")) {
    return "news";
  }

  if (path.includes("my.html")) {
    return "my";
  }

  if (path.includes("assets.html")) {
    return "my";
  }

  return "home";
}

// ==========================================
// 메뉴 active 처리
// ==========================================

function getActiveClass(page) {
  return getCurrentPage() === page ? "active" : "";
}

// ==========================================
// 로그인 사용자 가져오기
// ==========================================

function getLoggedInUser() {
  const accessToken = localStorage.getItem("accessToken");

  const savedUser = localStorage.getItem("user");

  if (!accessToken || !savedUser) {
    return null;
  }

  try {
    return JSON.parse(savedUser);
  } catch (error) {
    console.error("사용자 정보를 읽지 못했습니다.", error);

    localStorage.removeItem("user");

    localStorage.removeItem("accessToken");

    return null;
  }
}

// ==========================================
// Header 렌더링
// ==========================================

function renderHeader() {
  if (!appHeader) {
    return;
  }

  const user = getLoggedInUser();

  appHeader.innerHTML = `

        <div class="header-inner">

            <!-- Logo -->
            <a href="./index.html" class="logo" aria-label="StockPilot 홈">
                <span class="logo-mark">S</span>
                <span>StockPilot</span>
            </a>


            <!-- Navigation -->
            <nav class="nav">

                <a
                    href="./index.html"
                    class="nav-item ${getActiveClass("home")}"
                >
                    홈
                </a>


                <a
                    href="./search.html"
                    class="nav-item ${getActiveClass("domestic")}"
                >
                    주식
                </a>


                <a
                    href="./favorites.html"
                    class="nav-item ${getActiveClass("favorites")}"
                >
                    관심종목
                </a>


                <a href="./index.html#aiAssistant" class="nav-item ${getActiveClass("ai")}">
                    AI 분석
                </a>


                <a href="./assets.html" class="nav-item ${getActiveClass("my")}">내 자산</a>

            </nav>


            <!-- 오른쪽 -->
            <div class="header-actions">

                <a class="header-icon header-search-link" href="./search.html" title="종목 검색" aria-label="종목 검색">
                    <span aria-hidden="true">⌕</span>
                </a>


                ${user ? createLoggedInMenu(user) : createLoginButton()}

            </div>

        </div>

        <nav class="mobile-bottom-nav" aria-label="주요 메뉴">
            <a href="./index.html" class="mobile-nav-item ${getActiveClass("home")}">
                <span class="mobile-nav-icon">⌂</span><span>홈</span>
            </a>
            <a href="./favorites.html" class="mobile-nav-item ${getActiveClass("favorites")}">
                <span class="mobile-nav-icon">☆</span><span>관심</span>
            </a>
            <button type="button" class="mobile-nav-item mobile-order-item" data-nav-action="order">
                <span class="mobile-order-icon">↕</span><span>주문</span>
            </button>
            <a href="./index.html#aiAssistant" class="mobile-nav-item">
                <span class="mobile-nav-icon">✦</span><span>AI</span>
            </a>
            <a href="./assets.html" class="mobile-nav-item ${getActiveClass("my")}">
                <span class="mobile-nav-icon">◉</span><span>자산</span>
            </a>
        </nav>

    `;

  if (user) {
    setupProfileMenu();
  }

  setupNavigation();
}

function setupNavigation() {
  document.querySelectorAll("[data-nav-action]").forEach(function (button) {
    button.addEventListener("click", function () {
      const action = button.dataset.navAction;

      if (action === "order") {
        const orderCard = document.querySelector(".order-card");

        if (orderCard) {
          orderCard.scrollIntoView({ behavior: "smooth", block: "start" });
          return;
        }

        window.location.href = "./stock.html?code=005930";
      }

    });
  });
}

// ==========================================
// 로그인 안 했을 때
// ==========================================

function createLoginButton() {
  return `

        <a
            href="./login.html"
            class="login-button"
        >
            로그인
        </a>

    `;
}

// ==========================================
// 로그인했을 때
// ==========================================

function createLoggedInMenu(user) {
  const nickname = escapeHtml(user.nickname || "사용자");

  return `

        <div class="profile-wrapper">

            <button
                id="profileButton"
                class="profile-user-button"
            >

                <span class="profile-avatar">
                    ${nickname.charAt(0)}
                </span>

                <span class="profile-nickname">
                    ${nickname}
                </span>

                <span class="profile-arrow">
                    ▾
                </span>

            </button>


            <div
                id="profileDropdown"
                class="profile-dropdown hidden"
            >

                <div class="profile-info">

                    <strong>
                        ${nickname}
                    </strong>

                    ${
                      user.email
                        ? `
                                <span>
                                    ${escapeHtml(user.email)}
                                </span>
                            `
                        : ""
                    }

                </div>


                <div class="profile-divider">
                </div>


                <button
                    class="profile-menu-item"
                    data-action="my"
                >
                    내 정보
                </button>


                <button
                    class="profile-menu-item"
                    data-action="favorites"
                >
                    관심종목
                </button>


                <button
                    class="profile-menu-item"
                    data-action="portfolio"
                >
                    포트폴리오
                </button>


                <div class="profile-divider">
                </div>


                <button
                    class="
                        profile-menu-item
                        logout-menu-item
                    "
                    data-action="logout"
                >
                    로그아웃
                </button>

            </div>

        </div>

    `;
}

// ==========================================
// 프로필 메뉴 이벤트
// ==========================================

function setupProfileMenu() {
  const profileButton = document.querySelector("#profileButton");

  const profileDropdown = document.querySelector("#profileDropdown");

  if (!profileButton || !profileDropdown) {
    return;
  }

  // 프로필 버튼
  profileButton.addEventListener("click", function (event) {
    event.stopPropagation();

    profileDropdown.classList.toggle("hidden");
  });

  // Dropdown 메뉴
  profileDropdown.addEventListener("click", function (event) {
    const button = event.target.closest("[data-action]");

    if (!button) {
      return;
    }

    const action = button.dataset.action;

    if (action === "logout") {
      logout();

      return;
    }

    if (action === "my") {
      window.location.href = "./assets.html";

      return;
    }

    if (action === "favorites") {
      window.location.href = "./favorites.html";

      return;
    }

    if (action === "portfolio") {
      window.location.href = "./assets.html";
    }
  });

  // 프로필 밖 클릭
  document.addEventListener("click", function (event) {
    const profileWrapper = document.querySelector(".profile-wrapper");

    if (profileWrapper && !profileWrapper.contains(event.target)) {
      profileDropdown.classList.add("hidden");
    }
  });
}

// ==========================================
// 로그아웃
// ==========================================

function logout() {
  localStorage.removeItem("accessToken");

  localStorage.removeItem("user");

  window.location.href = "./index.html";
}

// ==========================================
// HTML Escape
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
// 공통 토스트 알림
// ==========================================

let toastTimer;

window.showToast = function (message, type = "info", duration = 2800) {
  let toast = document.querySelector("#appToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "appToast";
    toast.className = "app-toast";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    document.body.appendChild(toast);
  }

  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.className = `app-toast ${type} visible`;
  toastTimer = setTimeout(function () {
    toast.classList.remove("visible");
  }, duration);
};

// ==========================================
// 실행
// ==========================================

renderHeader();
