const jwt = require("jsonwebtoken");
const OTPGenerator = require("otp-generator");
const emailValidator = require("email-validator");
const dotenv = require("dotenv");
dotenv.config();
const User = require("../models/User");
const Token = require("../models/Token");
const {
  signupFormValidation,
} = require("../utils/validation/signupFormValidation");
const {
  send_email_verification_mail,
} = require("../utils/mailer/emailVerificationMail");
const {
  signinFormValidation,
} = require("../utils/validation/signinFormValidation");
const {
  send_password_reset_mail,
} = require("../utils/mailer/passowrdResetMail");
const {
  resetPasswordFormValidation,
} = require("../utils/validation/resetPasswordFormValidation");

const createToken = (user, expiry = "710h") => {
  // encryption key
  const SECRET_KEY_TO_ACCESS = process.env.SECRET_KEY_TO_ACCESS;

  // decide whether admin or not
  const isAdmin = user.role === "admin" ? true : false;

  // form the data to be encrypted and generate token
  const user_data = {
    email: user.email,
    id: user._id,
    admin: isAdmin,
  };
  const token = jwt.sign(user_data, SECRET_KEY_TO_ACCESS, {
    expiresIn: expiry,
  });

  return token;
};

const decryptToken = (token) => {
  const SECRET_KEY_TO_ACCESS = process.env.SECRET_KEY_TO_ACCESS;

  return new Promise((resolve, reject) => {
    jwt.verify(token, SECRET_KEY_TO_ACCESS, (error, payload) => {
      if (error) {
        return reject(error);
      } else {
        return resolve(payload);
      }
    });
  });
};

const createOTP = () => {
  const otp = OTPGenerator.generate(4, {
    specialChars: false,
    upperCase: false,
    alphabets: false,
  });

  return otp;
};

const signupUser = async (req, res) => {
  // validate form
  const { error } = signupFormValidation(req.body);
  if (error) {
    return res.status(400).json({
      error: true,
      message: error.details[0].message,
    });
  }

  let { name, email, password } = req.body;
  password = password.trim();

  // validate email
  if (!emailValidator.validate(email)) {
    return res.status(400).json({
      error: true,
      message: "Invaild email credentials",
    });
  }

  // limit to specific domain
  const allowed_domain1 = process.env.ADMIN_CONTROL_EMAIL.trim();
  const allowed_domain2 = process.env.USER_CONTROL_EMAIL.trim();
  const admin_users = process.env.ALLOWED_ADMIN_USERS.split(" ");
  const test_user = process.env.TEST_USERS.split(" ");
  let domain = email.trim().split("@")[1];
  if (
    domain !== allowed_domain1 &&
    domain !== allowed_domain2 &&
    !test_user.includes(email)
  ) {
    return res.status(400).json({
      error: true,
      message: "Invalid domain",
    });
  }

  try {
    // check whether user already exists
    const check_User = await User.find({ email: email }).lean().exec();

    //if user already exists
    if (check_User.length > 0) {
      return res.status(400).json({
        error: true,
        message: "User Already exists",
      });
    }

    // assign roles based on domain
    let role = admin_users.includes(email) === true ? "admin" : "user";
    const to_add = {
      name,
      email,
      password,
      role,
    };

    // add user to database
    const user = await User.create(to_add);

    // create OTP
    const OTP = createOTP();
    // store generated otp in token model
    const token_data = {
      user_id: user._id,
      token: String(OTP),
    };
    await Token.create(token_data);

    // send verification mail
    await send_email_verification_mail(name, email, OTP);

    return res.status(200).json({
      error: false,
      message: "Registration Successful",
      data: {
        email: email,
      },
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Something went wrong",
      reason: `${error}`,
    });
  }
};

const verifyUser = async (req, res) => {
  let { email, OTP } = req.body;

  // check for OTP and email in request
  if (!email || !OTP) {
    return res.status(400).json({
      error: true,
      message: "Send both email and otp",
    });
  }

  try {
    // check if user exists
    const user = await User.findOne({ email: email }).lean().exec();

    // if no such user
    if (!user) {
      return res.status(400).json({
        error: true,
        message: "Invalid email",
      });
    }

    // If user registered using OAuth
    if (!user.password && user.oauth) {
      return res.status(400).json({
        error: true,
        message: "User signed up using OAuth",
      });
    }

    // get user id
    const user_id = user._id;

    const token = await Token.findOne({ user_id: user_id }).lean().exec();

    // if no token
    if (!token) {
      return res.status(400).json({
        error: true,
        message: "No OTP generated or OTP expired",
      });
    }

    // if otp doesn't match
    OTP = String(OTP).trim();
    if (token.token !== OTP) {
      return res.status(400).json({
        error: true,
        message: "Invalid OTP",
      });
    }

    // if Otp matches update verified flag in user collection
    await User.updateOne(
      {
        _id: user_id,
      },
      {
        $set: {
          verified: true,
        },
      }
    );

    return res.status(200).json({
      error: false,
      message: "User verified successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Something went wrong",
      reason: `${error}`,
    });
  }
};

const resendEmailVerficationOTP = async (req, res) => {
  const { email } = req.body;

  // check for email in request
  if (!email) {
    return res.status(400).json({
      error: true,
      message: "Send the user email",
    });
  }

  try {
    const user = await User.findOne({ email: email }).lean().exec();

    // if no user
    if (!user) {
      return res.status(400).json({
        error: true,
        message: "Invalid email",
      });
    }

    // If user registered using OAuth
    if (!user.password && user.oauth) {
      return res.status(400).json({
        error: true,
        message: "User signed up using OAuth",
      });
    }

    // if user already verified
    if (user.verified) {
      return res.status(400).json({
        error: true,
        message: "Email already verified",
      });
    }

    // get user id and name
    const user_id = user._id;
    const name = user.name;

    // create OTP
    const OTP = createOTP();
    // store generated otp in token model
    const token_data = {
      user_id: user._id,
      token: String(OTP),
      createdAt: Date.now(),
    };

    // check for previous OTP, if any update else update previous
    await Token.updateOne(
      { user_id: user_id },
      { ...token_data },
      { upsert: true }
    )
      .lean()
      .exec();

    // send verification mail
    await send_email_verification_mail(name, email, OTP);

    return res.status(200).json({
      error: false,
      message: "OTP sent successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Something went wrong",
      reason: `${error}`,
    });
  }
};

const signinUser = async (req, res) => {
  // validate form
  const { error } = signinFormValidation(req.body);
  if (error) {
    return res.status(400).json({
      error: true,
      message: error.details[0].message,
    });
  }

  let { email, password } = req.body;
  password = password.trim();

  try {
    // get user (removed lean as for the usage of methods in mongo object)
    const user = await User.findOne({ email: email }).exec();

    // if no user
    if (!user) {
      return res.status(400).json({
        error: true,
        message: "Invalid Email",
      });
    }

    // If user registered using OAuth
    if (!user.password && user.oauth) {
      return res.status(400).json({
        error: true,
        message: "User has only OAuth signin option",
      });
    }

    // If user not verified
    if (!user.verified) {
      return res.status(400).json({
        error: true,
        message: "User email hasn't been verified",
      });
    }

    // check password match
    const match = await user.password_checker(password);

    // if password doesn't match
    if (!match) {
      return res.status(400).json({
        error: false,
        message: "Invalid Password",
      });
    }

    // generate token for the user
    const token = createToken(user);

    // form data to be sent as response
    const user_data = {
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePic: user.profilePic === undefined ? null : user.profilePic,
    };
    return res.status(200).json({
      error: false,
      message: "user has been successfully authenticated",
      user: user_data,
      token: token,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Something went wrong",
      reason: `${error}`,
    });
  }
};

const sendPasswordResetOTP = async (req, res) => {
  const { email } = req.body;

  // check for email in body
  if (!email) {
    return res.status(400).json({
      error: true,
      message: "Send the user email",
    });
  }

  try {
    // get the user
    const user = await User.findOne({ email: email }).exec();

    // if no such user
    if (!user) {
      return res.status(400).json({
        error: true,
        message: "Invalid email",
      });
    }

    // If user registered using OAuth
    if (!user.password && user.oauth) {
      return res.status(400).json({
        error: true,
        message: "User signed up using OAuth",
      });
    }

    // get user id and name
    const user_id = user._id;
    const name = user.name;

    // create OTP
    const OTP = createOTP();
    // store generated otp in token model
    const token_data = {
      user_id: user._id,
      token: String(OTP),
      createdAt: Date.now(),
    };

    // check for previous OTP, if any update else update previous
    await Token.updateOne(
      { user_id: user_id },
      { ...token_data },
      { upsert: true }
    )
      .lean()
      .exec();

    // send verification mail
    await send_password_reset_mail(name, email, OTP);

    user.password_reset_status = true;
    await user.save();

    return res.status(200).json({
      error: false,
      message: "OTP sent successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Something went wrong",
      reason: `${error}`,
    });
  }
};

const passwordResetOTPVerification = async (req, res) => {
  let { email, OTP } = req.body;

  // check for OTP and email in request
  if (!email || !OTP) {
    return res.status(400).json({
      error: true,
      message: "Send both email and otp",
    });
  }

  try {
    // get user
    const user = await User.findOne({ email: email }).lean().exec();

    // if no user
    if (!user) {
      return res.status(400).json({
        error: true,
        message: "Invalid Email",
      });
    }

    // If user registered using OAuth
    if (!user.password && user.oauth) {
      return res.status(400).json({
        error: true,
        message: "User signed up using OAuth",
      });
    }

    // get user id
    const user_id = user._id;

    // get otp
    const token = await Token.findOne({ user_id: user_id }).lean().exec();

    // if no otp
    if (!token) {
      return res.status(400).json({
        error: true,
        message: "No OTP generated or OTP expired",
      });
    }

    // if otp doesn't match
    OTP = String(OTP).trim();
    if (token.token !== OTP) {
      return res.status(400).json({
        error: true,
        message: "Invalid OTP",
      });
    }

    const temporary_pass = createToken(user, "300000");

    // after reset delete the token/otp
    await Token.deleteOne({ _id: token._id });

    return res.status(200).json({
      error: false,
      data: {
        message: "OTP verified successfully",
        temporary_pass,
      },
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Something went wrong",
      reason: `${error}`,
    });
  }
};

const passwordReset = async (req, res) => {
  // validate form
  const { error } = resetPasswordFormValidation(req.body);
  if (error) {
    return res.status(400).json({
      error: true,
      message: error.details[0].message,
    });
  }

  let { new_password, pass } = req.body;
  new_password = new_password.trim();

  try {
    // decrypt pass to get email
    let decrypted_data;
    try {
      decrypted_data = await decryptToken(pass);
    } catch (error) {
      // if not valid send error
      return res.status(400).json({
        error: true,
        message: "Invalid pass or pass expired",
      });
    }
    const { email } = decrypted_data;

    // get user (removed lean as for the usage of methods in mongo object)
    const user = await User.findOne({ email: email }).exec();

    // if no user
    if (!user) {
      return res.status(400).json({
        error: true,
        message: "Invalid Email",
      });
    }

    // if already reset for a particular request
    if (!user.password_reset_status) {
      return res.status(400).json({
        error: true,
        message:
          "Already reset or password reset request hasn't been initiated",
      });
    }

    // if Otp matches update new password in user collection
    user.password = new_password;
    user.password_reset_status = false;
    await user.save();

    return res.status(200).json({
      error: false,
      message: "Password changed successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Something went wrong",
      reason: `${error}`,
    });
  }
};

module.exports = {
  signupUser,
  verifyUser,
  resendEmailVerficationOTP,
  signinUser,
  sendPasswordResetOTP,
  passwordResetOTPVerification,
  passwordReset,
};
