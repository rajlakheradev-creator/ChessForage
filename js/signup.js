async function signup() {
    const name = document.getElementById("name").value;
    const email =document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();
    alert(data.message);
}
// login.js
document.getElementById("signupForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    // ... your existing fetch logic
    signupForm();
});