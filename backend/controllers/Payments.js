import { instance } from "../config/razorpay.js";
import Course from "../models/Course.js";
import User from "../models/User.js";
import mailSender from "../utils/mailSender.js";
import { courseEnrollmentEmail } from "../mail/templates/courseEnrollmentEmail.js";
import mongoose from "mongoose";

//capture payment and initiate the razorpay order
export async function capturePayment(req, res) {
  try {
    //get courseId and userId
    const { courseId } = req.body;
    const userId = req.user.id;
    //validation
    //valid courseId
    if (!courseId) {
      return res.json({
        success: false,
        message: "Please provide valid course ID",
      });
    }
    //validCourseDetail
    let course;
    try {
      course = await Course.findById(courseId);
      if (!course) {
        return res.json({
          success: false,
          message: "Could not find the course",
        });
      }
      //check if user already paid for the same course or not
      //converting the user id into objectid from the string
      const uid = new mongoose.Types.ObjectId(id);
      if (course.studentsEnrolled.includes(uid)) {
        return res.status(200).json({
          success: true,
          message: "Student is already enrolled",
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    //order create
    const amount = course.price;
    const currency = "INR";

    const options = {
      amount: amount * 100,
      currency,
      receipt: Math.random(Date.now()).toString(),
      notes: {
        //because it is needed when signature is verified and we need to enroll the student in the course
        courseId: courseId,
        userId,
      },
    };

    try {
      //initiate the payment using razorpay
      const paymentResponse = await instance.orders.create(options);
      console.log(paymentResponse);

      res.status(200).json({
        success: true,
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        thumbnail: course.thumbnail,
        orderId: paymentResponse.id,
        currency: paymentResponse.currency,
        amount: paymentResponse.amount,
      });
    } catch (error) {
      console.error(error);
      return res.json({
        success: false,
        message: "Could not initiate the order",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while capturing the payment",
    });
  }
}

//verify Signature of the razorpay and Server
export async function verifySignature(req, res) {
  try {
    const webhookSecret = "12345678";

    const signature = req.headers("x-razorpay-signature");

    //Hmac-> Hashed based message authentication code
    //SHA-> Secure hashing alogrithm
    const shasum = crypto.createHmac("sha256", webhookSecret);

    shasum.update(JSON.stringify(req.body));

    //jab aap kisi hashing algorithm ko run krte ho kisi text ke upar then jo output aata hai use bhot saare special cases ke andar "DIGEST" kehte hai.
    const digest = shasum.digest("hex");

    if (signature === digest) {
      console.log("Payment is Authorised");

      const { courseId, userId } = req.body.payload.payment.entity.notes;

      try {
        //fulfill the action
        //find the course and enroll the student in it
        const enrollCourse = await Course.findById(
          { _id: courseId },
          {
            $push: {
              studentsEnrolled: userId,
            },
          },
          { new: true }
        );

        if (!enrollCourse) {
          return status(500).json({
            success: false,
            message: "Course not found.",
          });
        }

        console.log("Enroll course: ", enrollCourse);

        //find the student and add the course in their list of enrolled courses
        const enrolledStudent = User.findOneAndUpdate(
          { _id: userId },
          {
            $push: {
              courses: courseId,
            },
          }
        );
        console.log("enrolledStudent: ", enrolledStudent);

        //mail send krna hai confirmation wala
        const emailResponse = await mailSender(
          enrolledStudent.email,
          "Congratulation from StudyNotion",
          "you are onboarded on new StudyNotion course."
        );

        console.log(emailResponse);

        return res.status(200).json({
          success: true,
          message: "Signature verified and course added",
        });
      } catch (error) {
        console.error(error);
        return res.status(500).json({
          success: false,
          message: error.message,
        });
      }
    } else {
        return res.status(400).json({
            success: false,
            message: "Invalid request Siganture not verified",
        })
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while Verifuing the signature",
    });
  }
}
