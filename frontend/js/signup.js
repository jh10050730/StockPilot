const signupForm = document.querySelector("#signupForm");

const nicknameInput = document.querySelector("#nickname");

const emailInput = document.querySelector("#email");

const passwordInput = document.querySelector("#password");

const signupMessage = document.querySelector("#signupMessage");

const signupButton = document.querySelector("#signupButton");
const togglePasswordButton = document.querySelector("#togglePasswordButton");

togglePasswordButton.addEventListener("click", function () {
  const isVisible = passwordInput.type === "text";
  passwordInput.type = isVisible ? "password" : "text";
  togglePasswordButton.textContent = isVisible ? "보기" : "숨기기";
  togglePasswordButton.setAttribute("aria-label", isVisible ? "비밀번호 보기" : "비밀번호 숨기기");
  togglePasswordButton.setAttribute("aria-pressed", String(!isVisible));
});

signupForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const nickname = nicknameInput.value.trim();

  const email = emailInput.value.trim();

  const password = passwordInput.value;

  if (nickname === "" || email === "" || password === "") {
    showMessage("모든 항목을 입력해주세요.", "error");

    return;
  }

  if (password.length < 8) {
    showMessage("비밀번호는 8자 이상이어야 합니다.", "error");

    return;
  }

  signupButton.disabled = true;

  signupButton.textContent = "가입 중...";

  try {
    const response = await fetch(`${window.StockPilotConfig.apiBaseUrl}/auth/signup`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        nickname: nickname,
        email: email,
        password: password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "회원가입에 실패했습니다.");
    }

    showMessage("회원가입이 완료되었습니다.", "success");

    setTimeout(function () {
      window.location.href = "./login.html";
    }, 900);
  } catch (error) {
    console.error(error);

    const message = error instanceof TypeError
      ? "서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요."
      : error.message;
    showMessage(message, "error");
  } finally {
    signupButton.disabled = false;

    signupButton.textContent = "회원가입";
  }
});

function showMessage(message, type) {
  signupMessage.textContent = message;

  signupMessage.className = `auth-message ${type}`;
}
