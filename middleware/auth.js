import JWT from "jsonwebtoken";

// mobileOtp: async (req, res) => {
//     console.log("mobile otp verify --> ")
//     try {
//       const { mobileNumber } = req.body;
//       // Check if the mobile number is already associated with any user
//       const existingUser = await userModel.findOne({
//         mobileNumber: mobileNumber,
//         status: "ACTIVE",
//       });
//       if (existingUser) {
//         return response(
//           res,
//           ErrorCode.ALREADY_EXIST, // Use appropriate error code for conflict
//           [],
//           "Mobile number is already registered with another account."
//         );
//       }
//       const userData = await userModel.findOne({
//         _id: req.userId,
//         status: "ACTIVE",
//       });
//       if (!userData) {
//         return response(
//           res,
//           ErrorCode.NOT_FOUND,
//           [],
//           ErrorMessage.NOT_REGISTERED
//         );
//       }

//       let findRes = await otpModel.findOne({
//         mobileNumber: req.body.mobileNumber,
//       });
//       if (findRes) {
//         var otp1 = commonFunction.getOTP();
//         let otpExpireTime = Date.now() + 300 * 1000;
//         await commonFunction.sendSMS(req.body.mobileNumber, otp1, (error, mobileResult) => {
//           if (error) {
//             console.log("mobile otp Result", error);
//           } else {
//             console.log("mobile otp Result ===>", otp1);
//           }
//         });
//         // const mailSent = await commonFunction.mobileOtpVerify(userData.firstName, userData.lastName, req.body.mobileNumber, userData.email);
//         // await notificationCreate({
//         //   userId: userData._id,
//         //   title: "Verify Your Mobile Number and Earn 1 Gyan Coin!",
//         //   message: Please verify your mobile number to complete your registration and earn 1 Gyan Coin. Enter your number, receive an OTP, and submit it to finalize the verification. Check your phone for the OTP and follow the instructions to get started!,
//         // });
//         const updateOtp = await otpModel.findByIdAndUpdate(
//           { _id: findRes._id },
//           {
//             $set: {
//               otp: otp1,
//               mobileVerification: false,
//               otpExpireTime: otpExpireTime,
//             },
//           },
//           { new: true }
//         );
//         await userModel.findOneAndUpdate(
//           { _id: req.userId },
//           {
//             $set: {
//               mobileOtp: otp1,
//               mobileVerification: false,
//               otpExpireTime: otpExpireTime,
//             },
//           },
//           { new: true }
//         );

//         return response(res, SuccessCode.SUCCESS, [], SuccessMessage.OTP_SEND);
//       } else {
//         console.log("else not OTP model");
//         var otp2 = commonFunction.getOTP();
//         let otpExpireTime = Date.now() + 300 * 1000;
//         await commonFunction.sendSMS(req.body.mobileNumber, otp2, (error, mobileResult) => {
//           if (error) {
//             console.log("mobile otp Result", error);
//           } else {
//             console.log("mobile otp Result ===>", otp2);
//           }
//         });
//         // const mailSent = await commonFunction.mobileOtpVerify(userData.firstName, userData.lastName, req.body.mobileNumber, userData.email);
//         // await notificationCreate({
//         //   userId: userData._id,
//         //   title: "Verify Your Mobile Number and Earn 1 Gyan Coin!",
//         //   message: Please verify your mobile number to complete your registration and earn 1 Gyan Coin. Enter your number, receive an OTP, and submit it to finalize the verification. Check your phone for the OTP and follow the instructions to get started!,
//         // });
//         const obj = {
//           mobileNumber: req.body.mobileNumber,
//           otp: otp2,
//           mobileVerification: false,
//           otpExpireTime: otpExpireTime,
//         };
//         const saveOtp = await new otpModel(obj).save();
//         return response(res, SuccessCode.SUCCESS, [], SuccessMessage.OTP_SEND);
//       }
//     } catch (error) {
//       console.log("error=====>>>>>", error);
//       return response(
//         res,
//         ErrorCode.SOMETHING_WRONG,
//         [],
//         ErrorMessage.SOMETHING_WRONG
//       );
//     }
//   },


// const accountSid = global.gConfig.accountSid;
// const authToken = global.gConfig.authToken;
// const client = require('twilio')(accountSid, authToken);
// sendSMS: (mobileNumber, otp, callback) => {
//     console.log("🚀 ~ mobileNumber, otp, callback:", mobileNumber, otp, callback)
//     console.log("mobileNumber", mobileNumber);
//     var body = template.smsOTP(otp);
//     client.messages.create({
//         'body': body,
//         'to': mobileNumber,
//         "from": fromNumber,
//     }, (twilioErr, twilioResult) => {
//         if (twilioErr) {
//           console.log(------------------------------------------------------------------------------\n------------------------------------------------------------------------\n-------------------------------------------------------------------------------------------\n---------------------------------------------------------) 
//           console.log("TWILIO ERROR -- =================>>>>", twilioErr);
//             if (typeof callback === 'function') {
//                 callback(twilioErr, null);
//             } else {
//                 console.error("Callback is not a function");
//             }
//         } else {
//             // console.log("twilioResult", twilioResult);
//             // console.log(twilioResult.sid)
//             if (typeof callback === 'function') {
//                 callback(null, twilioResult);
//             } else {
//                 console.error("Callback is not a function");
//             }
//         }
//     });
// },