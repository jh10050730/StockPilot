const loginForm = document.querySelector("#loginForm");

const emailInput = document.querySelector("#email");

const passwordInput = document.querySelector("#password");

const loginMessage = document.querySelector("#loginMessage");

const loginButton = document.querySelector("#loginButton");
const togglePasswordButton = document.querySelector("#togglePasswordButton");

togglePasswordButton.addEventListener("click", function () {
  const isVisible = passwordInput.type === "text";
  passwordInput.type = isVisible ? "password" : "text";
  togglePasswordButton.textContent = isVisible ? "보기" : "숨기기";
  togglePasswordButton.setAttribute("aria-label", isVisible ? "비밀번호 보기" : "비밀번호 숨기기");
  togglePasswordButton.setAttribute("aria-pressed", String(!isVisible));
});

const loginParams = new URLSearchParams(window.location.search);
const requestedReturnTo = loginParams.get("returnTo");
const safeReturnTo = /^\.\/[a-z0-9_-]+\.html(?:[?#].*)?$/i.test(requestedReturnTo || "")
  ? requestedReturnTo
  : "./index.html";

if (loginParams.get("reason") === "expired") {
  showMessage("로그인이 만료되었습니다. 다시 로그인해주세요.", "error");
}

loginForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const email = emailInput.value.trim();

  const password = passwordInput.value;

  if (email === "" || password === "") {
    showMessage("이메일과 비밀번호를 입력해주세요.", "error");

    return;
  }

  loginButton.disabled = true;

  loginButton.textContent = "로그인 중...";

  try {
    const response = await fetch(`${window.StockPilotConfig.apiBaseUrl}/auth/login`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "로그인에 실패했습니다.");
    }

    // 테스트 단계에서는 localStorage 사용
    localStorage.setItem("accessToken", data.accessToken);

    localStorage.setItem("user", JSON.stringify(data.user));

    showMessage("로그인 성공!", "success");

    setTimeout(function () {
      window.location.href = safeReturnTo;
    }, 700);
  } catch (error) {
    console.error(error);

    const message = error instanceof TypeError
      ? "서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요."
      : error.message;
    showMessage(message, "error");
  } finally {
    loginButton.disabled = false;

    loginButton.textContent = "로그인";
  }
});

function showMessage(message, type) {
  loginMessage.textContent = message;

  loginMessage.className = `auth-message ${type}`;
}
