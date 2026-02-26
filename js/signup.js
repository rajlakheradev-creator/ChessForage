// js/signup.js

async function signup() {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("Password").value;

    const res = await fetch("http://localhost:5000/api/auth/signup", {
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