import OTP from "../models/OTP.js";
import User from "../models/User.js";
import OTPGenerator from "otp-generator";
import bcrypt from "bcrypt";
import Profile from "../models/Profile.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import mailSender from "../utils/mailSender.js";

dotenv.config();

//sendOTP
export async function sendOTP(req, res) {
  try {
    //email fetch
    const { email } = req.body;

    //check if user already exists or not
    const checkUserPresent = await User.findOne({ email });

    //if user already exists then return response
    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "User Already Registered",
      });
    }

    //generate otp
    var otp = OTPGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    console.log("otp generated is: ", otp);

    let result = await OTP.findOne({ otp: otp });

    //not a good pratice becaz we're making again and again db calls
    while (result) {
      otp = OTPGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });

      result = await OTP.findOne({ otp: otp });
    }

    const otpPayload = { email, otp };

    //create entry in db
    const otpBody = await OTP.create(otpPayload);
    console.log("otp body: ", otpBody);

    //return the response
    res.status(200).json({
      success: true,
      message: "OTP Sent Successfully",
      otp,
    });
  } catch (error) {
    console.log("Error occured while sending the otp: ", error);
    res.status(500).json({
      success: false,
      message: "error.message",
    });
  }
}

//signup

export async function signup(req, res) {
  try {
    //data fetch from req ki body
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp,
    } = req.body;

    //validation krni hai
    if(!firstName || !lastName || !email || !password || !confirmPassword) {
        return res.status(403).json({
            success: false, 
            message: "Enter all the fields carefully.",
        })
    }

    //dono passwords match krne hai
    if(password !== confirmPassword) {
        return res.status(400).json({
            success: false,
            message: "Password and Confirm password does not match, Please try again",
        })
    }

    //user already exist or not
    const existingUser = await User.findOne({email});

    if(existingUser) {
        return res.status(401).json({
            success: false,
            message: "User is already registered",
        })
    }

    //find most recent otp stored for usr
    const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1)
    console.log(response)
    if (response.length === 0) {
      // OTP not found for the email
      return res.status(400).json({
        success: false,
        message: "The OTP is not valid",
      })
    } else if (otp !== response[0].otp) {
      // Invalid OTP
      return res.status(400).json({
        success: false,
        message: "The OTP is not valid",
      })
    }

    //password hash
    const hashedPassword = await bcrypt.hash(password, 10);

    const profileDetails = await Profile.create({
        gender: null,
        dateOfBirth: null,
        about: null,
        contact: null
    })

    //entry create krni hai db me
    const user = await User.create({
        firstName, 
        lastName,
        email,
        password: hashedPassword,
        accountType,
        contactNumber,
        additionalDetails: profileDetails._id,
        image: `https://ui-avatars.com/api/?name=${firstName}+${lastName}`,
    })

    //return krna hai response
    res.status(200).json({
        success: true,
        message:"User Registered Successfully",
        user,
    })
  } catch (error) {
    console.log("Error while registering the user: ", error);
    res.status(500).json( {
        success: false,
        message: "User cannot be registered Please try again!!",
    })
  }
}

//login
export async function login(req, res) {
  try {
      //get data from req body
      const {email, password} = req.body;

      //validate
      if(!email || !password) {
        return res.status(499).json({
          success: false,
          message: "All Fields are required",
        })
      }

      //check if user already exists or not
      const user = await User.findOne({email}).populate("additionalDetails");

      if(!user) {
        return res.status(403).json({
          success: false,
          message: "User is not registered, please sign up",
        })
      }

      //password compare and token generation
      if(await bcrypt.compare(password, user.password)) {

        let payload = {
          email: user.email,
          id: user._id,
          accountType: user.accountType,
        }

        let token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: "2h",
        });

        user.token = token,
        user.password = undefined;

        const options = {
          Expires: new Date(Date.now() * 3 * 24 * 60 * 60 * 1000),
          HttpOnly: true,
        }

        res.cookie("token", token, options).status(200).json({
          success:true,
          token,
          user, 
          message: "User logged in successfully."
        })


      } else {
        return res.status(401).json({
          success: false,
          message: "Password is incorrect",
        })
      }



  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Login failure please try again"
    })
  }
}


//changePassword - homework
export async function changePassword(req, res) {
  try {
    //Get user id from req.user
    const userId = req.user.id;

    //Get user details
    const userDetails = await User.findById(userId);

    //Get data from req ki body
    const {oldPassword, newPassword} = req.body;

    //Validate old password if it is present in db or not
    const isPasswordPresent = await bcrypt.compare(oldPassword, userDetails.password);

    if(!isPasswordPresent) {
      return res.status(401).json({
        success: false,
        message: "The password is incorrect",
      });
    }

    //update possoword
    const encryptedPassword = await bcrypt.hash(newPassword, 10);

    const updatedUserDetails = await User.findByIdAndUpdate(userId, {password: encryptedPassword}, {new: true});

    //send notification mail
    try {

      const emailResponse = await mailSender(
        updatedUserDetails.email,
        "Password for your account has been updated",
        passwordUpdated(
          updatedUserDetails.email,
          `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
        )
      )
      
    } catch (error) {
      // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
      console.error("Error occurred while sending email:", error)
      return res.status(500).json({
        success: false,
        message: "Error occurred while sending email",
        error: error.message,
      })
    }

     // Return success response
     return res
     .status(200)
     .json({ success: true, message: "Password updated successfully" })

  } catch (error) {
     // If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
     console.error("Error occurred while updating password:", error)
     return res.status(500).json({
       success: false,
       message: "Error occurred while updating password",
       error: error.message,
     })
  }
}
