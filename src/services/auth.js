export const checkTokenAndLogout = () => {
  const data = localStorage.getItem("data");
  if (data) {
    const token = JSON.parse(data).user?.token;
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const expiry = payload.exp * 1000;
      const currentTime = Date.now();

      if (expiry <= currentTime) {
        doLogout(() => {
          alert("Session expired. Please login again.");
        });
      } else {
        setTimeout(() => {
          doLogout(() => {
            alert("Session expired. You have been logged out.");
          });
        }, expiry - currentTime);
      }
    }
  }
};

// Helper to decode JWT and check expiration
const isTokenExpired = (token) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
    const currentTime = Math.floor(Date.now() / 1000); // In seconds
    return payload.exp < currentTime;
  } catch (error) {
    console.error("Invalid token", error);
    return true; // If decoding fails, treat it as expired
  }
};

//isLoggedIn
export const isLoggedIn = () => {
  let data = localStorage.getItem("data");
  if (data != null) {
    const token = JSON.parse(data).user?.token;
    if (token && !isTokenExpired(token)) {
      return true;
    } else {
      doLogout(() => {}); // Automatically logout if expired
      return false;
    }
  } else {
    return false;
  }
};

export const doLogin = (data, next) => {
  localStorage.setItem("data", JSON.stringify(data));

  // Decode token and calculate remaining time
  const token = data.user?.token;
  if (token) {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expiry = payload.exp * 1000; // Convert to ms
    const currentTime = Date.now();
    const timeout = expiry - currentTime;

    if (timeout > 0) {
      setTimeout(() => {
        doLogout(() => {
          alert("Session expired. You have been logged out.");
        });
      }, timeout);
    }
  }

  next();
};

// doLogout=>remove from localStorage
export const doLogout = (next) => {
  localStorage.removeItem("data");
  window.location.href = "/";
};

//get current user detail
export const getCurrentUserDetail = () => {
  if (isLoggedIn()) {
    return JSON.parse(localStorage.getItem("data")).user;
  } else {
    return undefined;
  }
};

//get token
export const getToken = () => {
  if (isLoggedIn()) {
    return JSON.parse(localStorage.getItem("data")).user.token;
  } else {
    return null;
  }
};
