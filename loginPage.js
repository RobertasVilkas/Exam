const form = document.querySelector("form");
const username = document.querySelector("input[name='username']");
const password = document.querySelector("input[name='password']");

form.addEventListener("submit", async e => {
  e.preventDefault();
  const name = username.value;
  const pwd = password.value;
  try {
    const response = await fetch("https://localhost:5104/api/Accounts/Login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userName: name,
        password: pwd
      })
    });

    if (response.ok) {
      const data = await response.text();

      document.cookie = `token=${data}`;

      const getCookie = name => {
        const cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
          let c = cookies[i].trim().split("=");
          if (c[0] === name) {
            return decodeURIComponent(c[1]);
          }
        }
        return "";
      };

      let output = getCookie("token");
      console.log(output);
      console.log("Welcome");
      window.location.href = "./homePage.html";
    } else {
      console.log("Something went wrong");
    }
  } catch (error) {
    console.error(error);
  }
});
