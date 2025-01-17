import { authConstants } from "./actionTypes";
import { getFromStorage } from "../../../Utils/localStorageHelper";
import { storageEnums } from "../../../Enums/storageEnums";

import LogRocket from "logrocket";
LogRocket.init("zpsfu7/refresh-localhost");

const initState = {
  isLoggingIn: false,
  loginError: false,
  loginErrorMessage: "",
  user_id: getFromStorage(storageEnums.USER_ID, ""),
  token: getFromStorage(storageEnums.TOKEN, ""),
  name: getFromStorage(storageEnums.NAME, ""),
  email: getFromStorage(storageEnums.EMAIL, ""),
  profilePic: getFromStorage(storageEnums.PROFILEPIC, ""),
  logoutError: "",
  isSignUp: false,
  signUpError: false,
  signUpErrorMessage: "",
};

const authentication = (state = initState, { type, payload }) => {
  switch (type) {
    case authConstants.USERS_LOGIN_REQUEST:
      return {
        ...state,
        isLoggingIn: true,
        loginError: false,
      };
    case authConstants.USERS_LOGIN_SUCCESS: {
      const {
        token,
        user: { email, name },
      } = payload;
      LogRocket.identify(token, {
        name,
        email,
      });
      return {
        ...state,
        user_id: getFromStorage(storageEnums.USER_ID, ""),
        token: getFromStorage(storageEnums.TOKEN, ""),
        name: getFromStorage(storageEnums.NAME, ""),
        email: getFromStorage(storageEnums.EMAIL, ""),
        profilePic: getFromStorage(storageEnums.PROFILEPIC, ""),
        isLoggingIn: false,
        loginError: false,
      };
    }
    case authConstants.USERS_LOGIN_FAILURE:
      return {
        ...state,
        isLoggingIn: false,
        loginError: true,
        loginErrorMessage: payload,
      };
    case authConstants.LOGOUT_REQUEST:
      return state;
    case authConstants.LOGOUT_SUCCESS:
      return {
        ...state,
        isLoggingIn: false,
        loginError: "",
        logoutError: "",
      };
    case authConstants.LOGOUT_FAILURE:
      return {
        ...state,
        isLoggingIn: false,
        loginError: "",
        logoutError: "",
      };

    case authConstants.SIGNUP_REQUEST:
      return state;
    case authConstants.SIGNUP_SUCCESS:
      return {
        ...state,
        isSignUp: false,
        signUpError: "",
      };
    case authConstants.SIGNUP_FAILURE:
      return {
        ...state,
        isSignUp: false,
        signUpError: "",
      };
    default:
      return state;
  }
};

export { authentication };
