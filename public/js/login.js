// public/js/login.js
const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_BASE_URL = isLocal
    ? "http://localhost:5000"
    : "https://chess-forage.vercel.app";

const form = document.getElementById("loginForm");
const submitBtn = form.querySelector("button[type='submit']");
const errorDiv = document.getElementById("error-message");

function showError(msg) {
    errorDiv.textContent = msg;
    errorDiv.style.display = "block";
}

function clearError() {
    errorDiv.textContent = "";
    errorDiv.style.display = "none";
}

function setLoading(loading) {
    submitBtn.disabled = loading;
    submitBtn.textContent = loading ? "Logging in..." : "Login";
}

async function login(e) {
    e.preventDefault();
    clearError();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!email || !password) {
        showError("Please fill in all fields.");
        return;
    }

    setLoading(true);

    try {
        const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (res.ok) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("userName", data.name);
            window.location.href = "game.html";
        } else {
            showError(data.message || "Login failed. Please try again.");
        }
    } catch (err) {
        showError("Could not connect to server. Please check your connection.");
    } finally {
        setLoading(false);
    }
}

form.addEventListener("submit", login);