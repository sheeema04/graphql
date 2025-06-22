document.getElementById("login-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const identifier = document.getElementById("identifier").value.trim();
  const password = document.getElementById("password").value;
  const errorMessage = document.getElementById("error-message");
  errorMessage.textContent = "";

  try {
    const credentials = btoa(`${identifier}:${password}`);
    const response = await fetch("https://learn.reboot01.com/api/auth/signin", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${credentials}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      errorMessage.textContent = "Invalid credentials. Try again!!!";
      return;
    }

    const jwt = await response.text();
    console.log("JWT received:", jwt);

    localStorage.setItem("jwt", jwt);
    window.location.href = "profile.html"; 
  } catch (error) {
    errorMessage.textContent = "Login failed. Please try again.";
    console.error("Login error:", error);
  }
});
