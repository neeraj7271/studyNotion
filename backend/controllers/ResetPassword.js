import User from "../models/User.js";
import mailSender from "../utils/mailSender.js";
import bcrypt from "bcrypt";
import crypto from "crypto";

//resetPasswordToken
export async function resetPasswordToken(req, res) {
  try {
    //get emailfrom req.body
    const email = req.body.email;

    if (!email) {
      return res.status(403).json({
        success: false,
        message: "Enter your Email please..",
      });
    }

    //check is user exists with this email or not
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Please signup first",
      });
    }
    //generate token
    const token = crypto.randomUUID();

    //update token by adding token and expires time
    const updatedDetails = await User.findOneAndUpdate(
      { email: email },
      {
        token: token,
        resetPasswordExpires: Date.now() + 3600000,
      },
      { new: true }
    );
    console.log("Updated Details", updatedDetails);
    //create Url
    const url = `http://localhost:3000/update-password/${token}`;

    //send mail
    await mailSender(
      email,
      "Password Reset",
      `Your password reset link ${url}`
    );

    //return response
    res.json({
      success: true,
      message:
        "Email Sent Successfully, Please Check Your Email to Continue Further",
    });
  } catch (error) {
    return res.json({
      error: error.message,
      success: false,
      message: `Some Error in Sending the Reset Message`,
    });
  }
}

//resetPassword
export async function resetPassword(req, res){

    try {
        
        //date fetch
        const {password, confirmPassword, token} = req.body;

        //validate
        if(password !== confirmPassword) {
            return res.json({
                success: false,
                message: "Password does not matchted",
            })
        }

        //get user details from db using token
        const userDetails = await User.findOne({token: token});

        //if not entry - invalid token
        if(!userDetails) {
            return res.json({
                success: false,
                message: "Token invalid"
            })
        }
        //token time check
        if(userDetails.resetPasswordExpires <  Date.now()) {
            return res.json({
                success: false,
                message: "Token is expired, regenerate new token",
            })
        }

        //hash password
       const hashedPassword = await bcrypt.hash(password, 10);

        //upadte pwd in db
        await User.findOneAndUpdate({token: token}, {
            password: hashedPassword,
        }, {new: true});

        // return response
        return res.status(200).json({
            success: true,
            message: "password reset successfull"
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong while reseting the password"
        })
    }

}
