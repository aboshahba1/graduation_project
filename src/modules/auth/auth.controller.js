import { userModel } from "../../../db/models/userModel.js";
import { generateToken, verifyToken } from "../../utils/tokenFunctions.js";
import { sendEmailService } from "../../services/mailService.js";
import pkg from "bcrypt";
import { providers, systemRoles } from "../../utils/systemRoles.js";
import { customAlphabet } from "nanoid";
import { OTPemailTemplate } from "../../utils/OTPemailTemplate.js";

export const register = async (req, res, next) => {
  const {
    Name,
    Phone,
    Age,
    NationalID,
    email,
    Password,
    isDoctor,
    doctorSpecialization,
    experienceNumber,
    doctorDetails,
    cPassword,
  } = req.body;

  const isEmailDuplicate = await userModel.findOne({ Mail: email });
  if (isEmailDuplicate) {
    return next(new Error("email is already exist", { cause: 400 }));
  }

  if (Password !== cPassword) {
    return next(
      new Error("password and cPassword don't match", { cause: 400 })
    );
  }

  // generate email

  // Generate Confirmation Link
  const randomOTP = customAlphabet("1234567890", 4);
  const otp = randomOTP();

  const isEmailSent = sendEmailService({
    to: email,
    subject: "OTP verification",
    message: OTPemailTemplate({ otp }),
  });
  if (!isEmailSent) {
    return next(new Error("fail to sent reset password email", { cause: 400 }));
  }

  // hash password
  const hashedPassword = pkg.hashSync(Password, +process.env.SALT_ROUNDS);

  // Initialize user object
  let user = new userModel({
    Name,
    Phone,
    Age,
    NationalID,
    Mail: email,
    otp,
    Password: hashedPassword,
    provider: providers.SYSTEM,
    role: systemRoles.CLIENT,
    isDoctor,
    doctorSpecialization,
    experienceNumber,
    doctorDetails,
  });
  await user.save();

  res.status(200).json({
    message: "OTP verification code is sent check your email",
    checkOTP_API: checkOTP,
  });
};

export const checkOTP = async (req, res, next) => {
  const { otp, Mail } = req.body;

  const user = await userModel.findOne({ Mail });
  if (!user) {
    return next(new Error("In-valid user", { cause: 400 }));
  }

  if (user.otp !== otp) {
    return next(new Error("In-valid OTP code", { cause: 400 }));
  }

  await userModel.findOneAndUpdate(
    { Mail, isConfirmed: false },
    { isConfirmed: true, otp: null },
    { new: true }
  );

  res.status(200).json({ message: "OTP is correct try to log in" });
};
// export const confirmEmail = async (req, res, next) => {

//     const { token } = req.params
//     const tokenData = verifyToken({
//         token,
//         signature: process.env.SIGNUP_CONFIRMATION_EMAIL_TOKEN
//     })

//     if (!tokenData) {
//         return next(new Error('Too late to confirm, token is expired. register again', { cause: 400 }))
//     }
//     const user = await userModel.findOneAndUpdate(
//         { Mail: tokenData?.Mail, isConfirmed: false },
//         { isConfirmed: true },
//         { new: true },
//     )
//     if (!user) {
//         return next(new Error('this email is already confirmed', { cause: 400 }))
//     }
//     res.status(200).json({ messge: 'Confirmed done, please try to login' })
// }

export const login = async (req, res, next) => {
  const { Password, Name } = req.body;

  const user = await userModel.findOne({ Name, isConfirmed: true });

  if (!user) {
    return next(
      new Error(
        "It seems like invalid credentials OR you didn't confirm your email",
        { cause: 400 }
      )
    );
  }

  const isPasswordMatch = pkg.compareSync(Password, user.Password);
  if (!isPasswordMatch) {
    return next(new Error("invalid login credentials", { cause: 400 }));
  }

  //  generate Login token
  const token = generateToken({
    payload: {
      _id: user._id,
      Mail: user.Mail,
      role: user.role,
    },
    signature: process.env.LOGIN_SIGN,
    expiresIn: "100d",
  });

  const logedInUser = await userModel.findOneAndUpdate(
    { Mail: user.Mail },
    { token },
    { new: true }
  );

  if (logedInUser.profilePic.secure_url !== undefined) {
    const { secure_url } = logedInUser.profilePic;
    return res.status(200).json({
      Message: "User loged in",
      Name: logedInUser.Name,
      picture: secure_url,
      Mail: logedInUser.Mail,
      userRole: logedInUser.role,
      userToken: logedInUser.token,
      NationalID: logedInUser.NationalID,
      Age: logedInUser.Age,
    });
  }

  res.status(200).json({
    Message: "User loged in",
    Name: logedInUser.Name,
    Mail: logedInUser.Mail,
    userRole: logedInUser.role,
    userToken: logedInUser.token,
    NationalID: logedInUser.NationalID,
    Age: logedInUser.Age,
  });
};

// export const forgetPassword = async (req, res, next) => {
//     const { email } = req.body
//     const user = await userModel.findOne({ email })
//     if (!user) {
//         return next(new Error('invalid email', { cause: 400 }))
//     }

//     const randomOTP = customAlphabet('1234567890', 4)
//     const otp = randomOTP()

//     // const token = generateToken({
//     //     payload: {
//     //         email,
//     //         otp,
//     //     },
//     //     signature: process.env.FORGET_PASS_TOKEN,
//     //     expiresIn: '1h',
//     // })

//     // const checkOTP = `${req.protocol}://${req.headers.host}/api/auth/checkOTP/${token}`

//     const isEmailSent = sendEmailService({
//         to: email,
//         subject: 'OTP verification',
//         message: OTPemailTemplate({ otp }),

//     })
//     if (!isEmailSent) {
//         return next(new Error('fail to sent reset password email', { cause: 400 }))
//     }

//     const userUpdates = await userModel.findOneAndUpdate(
//         { email },
//         {
//             otp,
//         },
//         {
//             new: true,
//         },
//     )
//     if (!userUpdates) {
//         return next(
//             new Error('changing password process is failed ,try to fetch an API again', { cause: 400 }))
//     }
//     res.status(200).json({
//         message: 'OTP verification code is sent check your email',
//         checkOTP_API: checkOTP
//     })
// }

// export const resetPassword = async (req, res, next) => {
//     const { email, password, cPassword } = req.body

//     const user = await userModel.findOne({ email })
//     if (!user) {
//         return next(
//             new Error('In-valid user', { cause: 400 })
//         )
//     }

//     if (!password || !cPassword) {
//         return next(
//             new Error('must supply with password and confirm password', { cause: 400 }))
//     }
//     if (password !== cPassword) {
//         return next(new Error("password and cPassword don't match", { cause: 400 }))
//     }

//     const hashedPassword = pkg.hashSync(password, +process.env.SALT_ROUNDS)

//     user.password = hashedPassword
//     user.otp = null

//     const resetedPassData = await user.save()
//     if (!resetedPassData) {
//         return next(
//             new Error('changing password process is failed,try to fetch an API again', { cause: 400 }))
//     }
//     res.status(200).json({ message: 'password has been updated successfully' })
// }

export const logout = async (req, res, next) => {
  const { Name } = req.body;

  const userCheck = await userModel.findOne({ Name });

  if (!userCheck) {
    return next(new Error("in-valid email", { cause: 400 }));
  }

  const userLogedOut = await userModel.findOneAndUpdate(
    { Name },
    { token: "" }
  );
  if (!userLogedOut) {
    return next(new Error("fail to update the user", { cause: 400 }));
  }
  res.status(200).json({ Message: " user logged out" });
};
