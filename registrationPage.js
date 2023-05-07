const form = document.querySelector("form");
const username = document.querySelector("input[name='username']");
const password = document.querySelector("input[name='password']");

form.addEventListener("submit", async e => {
  e.preventDefault();
  const name = username.value;
  const pwd = password.value;
  try {
    const response = await fetch(
      "https://localhost:5104/api/UserAccounts/SignUp",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userName: name,
          password: pwd
        })
      }
    );
    if (response.ok) {
      alert("You have created an account, please login :)");
    } else {
      alert("The username is already taken, please try again :(");
    }
  } catch (error) {
    console.error(error);
    alert("Sign-up failed. Please try again later.");
  }
});
