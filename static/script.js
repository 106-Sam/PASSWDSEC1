function Strength(password) {
  let i = 0;
  if (password.length > 6) {
    i++;
  }
  if (password.length >= 10) {
    i++;
  }
  if (/[A-Z]/.test(password)) {
    i++;
  }
  if (/[0-9]/.test(password)) {
    i++;
  }
  if (/[A-Za-z0-9]/.test(password)) {
    i++;
  }
  return i;
}

function checkBreached(password) {
  return sha1(password)
    .then((hash) => {
      let hashPrefix = hash.toUpperCase().slice(0, 5);
      let url = `https://api.pwnedpasswords.com/range/${hashPrefix}`;
      return fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.text();
        })
        .then((data) => { 
          let lines = data.split("\n");
          let hashSuffix = hash.toUpperCase().slice(5);
          let breach_count = lines.filter((line) => line.startsWith(hashSuffix)).map((line) => line.split(":")[1]);  
          let breached = lines.some((line) => line.startsWith(hashSuffix));
          if (breach_count>1){
            document.querySelector(".count").innerHTML = `Breach count: ${breach_count}`;
          } else {
            document.querySelector(".count").innerHTML = "";
          }
          if (breached) {
            return "Password breached!";
          } else {
            return "Password not breached!";
          }
        })
        .catch((error) => {
          console.error("Error fetching breached passwords:", error);
          return "Error checking password breach.";
        });
    })
    .catch((error) => {
      console.error("Error calculating hash:", error);
      return "Error checking password breach.";
    });
}

function sha1(str) {
  return crypto.subtle
    .digest("SHA-1", new TextEncoder().encode(str))
    .then((buffer) => {
      const byteArray = new Uint8Array(buffer);
      let hash = "";
      byteArray.forEach((byte) => {
        hash += byte.toString(16).padStart(2, "0");
      });
      return hash;
    });
}

let container = document.querySelector(".container");
let passwordInput = document.querySelector("#myPassword");

document.addEventListener("keyup", async function (e) {
  let password = passwordInput.value;
  let strength = Strength(password);
    let breachResult = await checkBreached(password);

  container.classList.remove("weak-notsafe", "medium-notsafe", "strong-notsafe", "weak-safe", "medium-safe", "strong-safe");

  if (password === "") {
    container.classList.remove("weak-notsafe", "medium-notsafe", "strong-notsafe", "weak-safe", "medium-safe", "strong-safe");
  } else if (strength <= 2 && breachResult === "Password not breached!") {
    container.classList.add("weak-safe");
  } else if (strength > 2 && strength <= 4 && breachResult === "Password not breached!") {
    container.classList.add("medium-safe");
  } else if (strength > 4 && breachResult === "Password not breached!") {
    container.classList.add("strong-safe");
  } else if (strength <= 2 && breachResult === "Password breached!") {
    container.classList.add("weak-notsafe");
  } else if (strength > 2 && strength <= 4 && breachResult === "Password breached!") {
    container.classList.add("medium-notsafe");
  }
  else if (strength > 4 && breachResult === "Password breached!"){
    container.classList.add("strong-notsafe");
  }
});

let pswrd = document.querySelector("#myPassword");
let show = document.querySelector(".show");
show.onclick = function () {
  if (pswrd.type === "password") {
    pswrd.setAttribute("type", "text");
    show.classList.add("hide");
  } else {
    show.classList.remove("hide");
    pswrd.setAttribute("type", "password");
  }
};
