document.getElementById("switch-to-signup").addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(".login-form").classList.add("hidden");
    document.querySelector(".signup-form").classList.remove("hidden");
});

document.getElementById("switch-to-login").addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(".signup-form").classList.add("hidden");
    document.querySelector(".login-form").classList.remove("hidden");
});

document.querySelector(".login-form form").addEventListener("submit", async function (e) {
    e.preventDefault();
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;
    const response = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });
    const result = await response.text();
    if (result === 'Login successful') {
        window.location.href = 'main.html';
    } else {
        alert(result);
    }
});

document.querySelector(".signup-form form").addEventListener("submit", async function (e) {
    e.preventDefault();
    const name = document.getElementById("signup-name").value;
    const surname = document.getElementById("signup-surname").value;
    const username = document.getElementById("signup-username").value;
    const password = document.getElementById("signup-password").value;
    const response = await fetch('/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, surname, username, password }),
    });
    const result = await response.text();
    alert(result);
});