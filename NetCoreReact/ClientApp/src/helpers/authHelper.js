import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";

export function UserIsValid(token) {
  let expiration;
  let now = new Date().getTime() / 1000;

  if (token != null && token && token.isAuthenticated) {
    expiration = jwt_decode(token.token).exp;
    if (expiration > now) {
      return true;
    }
  }
  let cookieToken = Cookies.get("Authorization-Token");
  if (cookieToken != null && cookieToken) {
    expiration = jwt_decode(cookieToken).exp;
    if (expiration > now) {
      return true;
    }
  }
  return false;
}

export function TryGetToken(token) {
  if (token != null && token) {
    return "Bearer " + token;
  }
  let cookieToken = Cookies.get("Authorization-Token");
  if (cookieToken != null && cookieToken) {
    return "Bearer " + cookieToken;
  }
  return "";
}

export function login(token) {
  return dispath => {
    dispath({
      type: "LOGIN",
      payload: token
    });
  };
}

export function logout() {
  return dispath => {
    dispath({
      type: "LOGOUT",
      payload: ""
    });
  };
}
