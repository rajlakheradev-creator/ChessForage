// js/signup.js

const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_BASE_URL = isLocal 
? "http://localhost:5000" 
: "https://chess-forage.vercel.app";

async function signup() {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    const res = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();
    alert(data.message);

    if (res.ok) {
        window.location.href = "login.html";
    }


}

// FIX: was calling signupForm() which doesn't exist — function is named signup()
document.getElementById("signupForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    signup();
});