// public/js/signup.js
const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_BASE_URL = isLocal
    ? "http://localhost:5000"
    : "https://chessforage.onrender.com";

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("signupForm");
    const submitBtn = form.querySelector("button[type='submit']");
    const errorDiv = document.getElementById("error-message");
    const successDiv = document.getElementById("success-message");

    function showError(msg) {
        errorDiv.textContent = msg;
        errorDiv.style.display = "block";
        successDiv.style.display = "none";
    }

    function showSuccess(msg) {
        successDiv.textContent = msg;
        successDiv.style.display = "block";
        errorDiv.style.display = "none";
    }

    function clearMessages() {
        errorDiv.style.display = "none";
        successDiv.style.display = "none";
    }

    function setLoading(loading) {
        submitBtn.disabled = loading;
        submitBtn.textContent = loading ? "Creating account..." : "Sign Up";
    }

    function validateForm(name, email, password, confirmPassword) {
        if (name.trim().length < 2) return "Name must be at least 2 characters.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Please enter a valid email address.";
        if (password.length < 8) return "Password must be at least 8 characters.";
        if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) return "Password must contain at least one letter and one number.";
        if (password !== confirmPassword) return "Passwords do not match.";
        return null;
    }

    async function signup(e) {
        e.preventDefault();
        clearMessages();

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        const validationError = validateForm(name, email, password, confirmPassword);
        if (validationError) {
            showError(validationError);
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password })
            });

            const data = await res.json();

            if (res.ok) {
                showSuccess(data.message + " Redirecting to login...");
                setTimeout(() => {
                    window.location.href = "login.html";
                }, 1500);
            } else {
                showError(data.message || "Signup failed. Please try again.");
            }
        } catch (err) {
            showError("Could not connect to server. Please check your connection.");
        } finally {
            setLoading(false);
        }
    }

    form.addEventListener("submit", signup);
});