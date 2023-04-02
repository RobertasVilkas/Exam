const getCookie = name => {
  const cookies = document.cookie.split(";").map(cookie => cookie.trim());
  const cookie = cookies.find(cookie => cookie.startsWith(`${name}=`));

  if (cookie) {
    return cookie.substring(name.length + 1);
  }

  return "";
};

const userInfoContainer = document.getElementById("user-info-container");
const errorContainer = document.getElementById("error-container");

async function getUserInformation() {
  try {
    const response = await fetch(
      "https://localhost:7112/api/user-information",
      {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`
        }
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    console.log(data);

    renderUserInformation(data);
  } catch (error) {
    console.error("There was a problem getting user information:", error);
    errorContainer.textContent =
      "There was a problem getting user information. Please try again later.";
  }
}

function renderUserInformation(userInformation) {
  const humanInformation = userInformation.humanInformation;
  const address = userInformation.address;
  const userInfoElement = document.getElementById("user-info");

  if (humanInformation && address) {
    const html = `
        <div class="user-information">
          <div class="username">Vartotojo vardas: ${userInformation.username}</div>
          <div class="role">Rolė: ${userInformation.role}</div>
          <div class="name">Vardas: ${humanInformation.name}</div>
          <div class="surname">Pavardė: ${humanInformation.surname}</div>
          <div class="personal-code">Asmens kodas: ${humanInformation.personalCode}</div>
          <div class="telephone-number">Telefono numeris: ${humanInformation.telephoneNumber}</div>
          <div class="email">El. paštas: ${humanInformation.email}</div>
          <div class="address">
            <div class="city">Miestas: ${address.city}</div>
            <div class="street">Gatvė: ${address.street}</div>
            <div class="house-number">Namų nr.: ${address.houseNumber}</div>
            <div class="flat-number">Butas: ${address.flatNumber}</div>
          </div>
        </div>
      `;
    userInfoElement.innerHTML = html;
    userInfoElement.classList.add("user-information-visible");
  } else {
    userInfoElement.innerHTML = "Vartotojas dar nėra užpildęs informacijos";
  }
}

getUserInformation();
