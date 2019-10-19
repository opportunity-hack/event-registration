import { useDispatch, useSelector } from "react-redux";
import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";

/**
 * Custom authentication hook
 */

export default function useAuth() {
  const dispatch = useDispatch();
  const authState = useSelector(state => state.auth);

  const getAuthFromCookie = () => {
    if (!authState.checkedForAuth) {
      const token = Cookies.get("Authorization-Token");

      if (token) {
        //check if expired??
        login(token);
        return token;
      }
      dispatch({
        type: "CHECKED_FOR_AUTH"
      });
    }
    return null;
  };

  const getToken = () => {
    if (authState.isAuthenticated) {
      return authState.token;
    }
    if (authState.checkedForAuth) {
      return null;
    } else {
      return getAuthFromCookie();
    }
  };

  const login = token => {
    dispatch({
      type: "LOGIN",
      token: token,
      payload: jwt_decode(token)
    });
    //Cookies.set("Authorization-Token", token);
    //cookie gets set from server
  };

  const logout = () => {
    Cookies.remove("Authorization-Token");
    Cookies.remove("Avatar-Url");
    dispatch({
      type: "LOGOUT"
    });
  };

  return { getAuthFromCookie, authState, login, logout, getToken };
}
