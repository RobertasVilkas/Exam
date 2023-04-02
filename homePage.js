const table = document.getElementById("accounts-table");
const tableBody = document.getElementById("accounts-table-body");

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

function parseJwt() {
  let token = getCookie("token");
  let base64Url = token.split(".")[1];
  let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  let jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
  console.log(JSON.parse(jsonPayload));
  return JSON.parse(jsonPayload);
}
//parseJwt();
function getRole() {
  let jwt = parseJwt();
  console.log(
    jwt["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
  );
  return jwt["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
}
getRole();

// prideti if, kad getrole == admin // getrole == user

async function fetchAccounts() {
  try {
    const response = await fetch(
      "https://localhost:7112/api/get-all-accounts",
      {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`
        }
      }
    );

    if (response.ok) {
      const accounts = await response.json();

      accounts.forEach(account => {
        const row = document.createElement("tr");
        row.classList.add("account-row");

        const usernameCell = document.createElement("td");
        usernameCell.textContent = account.username;

        const roleCell = document.createElement("td");
        roleCell.textContent = account.role;

        const deleteCell = document.createElement("td");
        deleteCell.id = "delete-column";

        // Create the delete button only for the "Admin" role
        if (getRole() === "Admin") {
          const deleteButton = document.createElement("button");
          deleteButton.classList.add("delete-button");
          deleteButton.textContent = "Delete";

          deleteButton.addEventListener("click", async () => {
            try {
              const response = await fetch(
                `https://localhost:7112/api/accounts/${account.id}`,
                {
                  method: "DELETE",
                  headers: {
                    Authorization: `Bearer ${getCookie("token")}`
                  }
                }
              );

              if (response.ok) {
                row.remove();
              } else {
                console.error("Failed to delete account");
              }
            } catch (error) {
              console.error(error);
            }
          });

          deleteCell.appendChild(deleteButton);
        }

        row.appendChild(usernameCell);
        row.appendChild(roleCell);
        row.appendChild(deleteCell);

        tableBody.appendChild(row);
      });
    } else {
      console.error("Failed to fetch accounts");
    }
  } catch (error) {
    console.error(error);
  }
}

fetchAccounts();
