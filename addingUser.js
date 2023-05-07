const getCookie = name => {
  const cookies = document.cookie.split(";").map(cookie => cookie.trim());
  const cookie = cookies.find(cookie => cookie.startsWith(`${name}=`));

  if (cookie) {
    return cookie.substring(name.length + 1);
  }

  return "";
};

const form = document.getElementById("add-user-form");
const successMessage = document.getElementById("success-message");

form.addEventListener("submit", async event => {
  event.preventDefault();

  const formData = new FormData(form);
  const userData = {
    name: formData.get("name"),
    surname: formData.get("surname"),
    personalCode: formData.get("personalCode"),
    telephoneNumber: formData.get("telephoneNumber"),
    email: formData.get("email"),
    address: {
      city: formData.get("address[city]"),
      street: formData.get("address[street]"),
      houseNumber: formData.get("address[houseNumber]"),
      flatNumber: formData.get("address[flatNumber]")
    }
  };

  try {
    const token = getCookie("token");

    const response = await fetch(
      "https://localhost:5104/api/update-user-information",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(userData)
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    successMessage.style.display = "block";
    successMessage.classList.add("success-message");

    setTimeout(() => {
      successMessage.style.display = "none";
    }, 3000);
  } catch (error) {
    console.error(
      "There was a problem updating user information:",
      error.message
    );
  }
});
