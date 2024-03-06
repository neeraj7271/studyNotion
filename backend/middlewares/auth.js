import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

//auth
export async function auth(req, res, next) {
  try {
    //get token from these available options
    const token =
      req.body.token ||
      req.cookies.token ||
      req.header("Authorisation").replace("Bearer ", "");

    //validate token
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token not found",
      });
    }

    //verify the token
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decode);

      req.user = decode;
    } catch (error) {
     return res.status(403).json({
        success: false,
        message: "Token is invalid",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
        success: false,
        message: "Something went wrong while verifying the token",
    })
  }
}

//isStudent
export function isStudent(req, res, next) {
    try {
        if(req.user.accountType  !== "Student") {
            return res.status(403).json({
                success: false,
                message: "This is the protected route for students only",
            })
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong while verifying the user",
        })
    }
}

//isInstructor
export function isInstructor(req, res, next) {
    try {
        if(req.user.accountType  !== "Instructor") {
            return res.status(403).json({
                success: false,
                message: "This is the protected route for Instructors only",
            })
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong while verifying the user",
        })
    }
}

//isAdmin
export function isAdmin(req, res, next) {
    try {
        if(req.user.accountType  !== "Admin") {
            return res.status(403).json({
                success: false,
                message: "This is the protected route for Admins only",
            })
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong while verifying the user",
        })
    }
}
