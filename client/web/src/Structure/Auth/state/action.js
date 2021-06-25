import { authConstants } from "./actionTypes";
import axios from "axios";
import { storageEnums } from "../../../Enums/storageEnums";
import {
  saveToStorage,
  removeFromStorage,
} from "../../../Utils/localStorageHelper";

const AUTH_API_URL = process.env.REACT_APP_AUTH_API_URL;

const userSignUpRequest = () => ({
  type: authConstants.USERS_SIGNUP_REQUEST,
});

const userSignUpSuccess = (payload) => ({
  type: authConstants.USERS_SIGNUP_SUCCESS,
  payload,
});

const userSignUpFailure = (payload) => ({
  type: authConstants.USERS_SIGNUP_FAILURE,
  payload,
});

const userVerificationRequest = () => ({
  type: authConstants.USERS_VERIFICATION_REQUEST,
});

const userVerificationSuccess = (payload) => ({
  type: authConstants.USERS_VERIFICATION_SUCCESS,
  payload,
});

const userVerificationFailure = (payload) => ({
  type: authConstants.USERS_VERIFICATION_FAILURE,
  payload,
});

const userSigninRequest = () => ({
  type: authConstants.USERS_SIGNIN_REQUEST,
});

const userSigninSuccess = (payload) => ({
  type: authConstants.USERS_SIGNIN_SUCCESS,
  payload,
});

const userSigninFailure = (payload) => ({
  type: authConstants.USERS_SIGNIN_FAILURE,
  payload,
});

const resentOTPRequest = () => ({
  type: authConstants.RESEND_OTP_REQUEST,
});

const resentOTPSuccess = (payload) => ({
  type: authConstants.RESEND_OTP_SUCCESS,
  payload,
});

const resentOTPFailure = (payload) => ({
  type: authConstants.RESEND_OTP_FAILURE,
  payload,
});

const userSignUpProcess =
  ({ name, email, password }) =>
  async (dispatch) => {
    dispatch(userSignUpRequest());
    const config = {
      method: "POST",
      url: `${AUTH_API_URL}/signup`,
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        email: email,
        name: name,
        password: password,
      },
    };
    return axios(config)
      .then((res) => dispatch(userSignUpSuccess(res.data)))
      .catch((err) => {
        console.log(err);
      });
  };

//user verification

const userVerficationProcess =
  ({ email, otp }) =>
  async (dispatch) => {
    dispatch(userVerificationRequest());
    const config = {
      method: "POST",
      url: `${AUTH_API_URL}/verify_user`,
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        email: email,
        OTP: otp,
      },
    };
    return axios(config)
      .then((res) => dispatch(userVerificationSuccess(res.data)))
      .catch((err) => {
        console.log(err);
      });
  };

// signin

const userSigninProcess =
  ({ email, password }) =>
  async (dispatch) => {
    dispatch(userSigninRequest());
    const config = {
      method: "POST",
      url: `${AUTH_API_URL}/signin`,
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        email: email,
        password: password,
      },
    };
    return axios(config)
      .then((res) => dispatch(userSigninSuccess(res.data)))
      .catch((err) => {
        console.log(err);
      });
  };

// Resend OTP

const resendOtpProcess =
  ({ email }) =>
  async (dispatch) => {
    dispatch(resentOTPRequest());
    const config = {
      method: "POST",
      url: `${AUTH_API_URL}/email_verification/resend_otp`,
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        email: email,
      },
    };
    return axios(config)
      .then((res) => console.log(res))
      .catch((err) => {
        console.log(err);
      });
  };

export const authActions = {
  userSignUpProcess: userSignUpProcess,
  userVerficationProcess: userVerficationProcess,
  userSigninProcess: userSigninProcess,
  resendOtpProcess: resendOtpProcess,
};
