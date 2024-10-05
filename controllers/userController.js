import User from '../models/userModel.js';
import { sendOTPEmail, sendOTPMobile,generateOTP } from '../utils/genrateToken.js'
import jwt from 'jsonwebtoken'

//  export async function sendOtpController(req, res){
//   const { phone, email } = req.body;
//   const otp = generateOTP();
//   const otpExpiration = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

//   try {
//     // Find or create a new user
//     let user = await User.findOne({ phone, email });
//     if (!user) {
//       user = new User({ phone, email, otp, otpExpiration });
//     } else {
//       user.otp = otp;
//       user.otpExpiration = otpExpiration;
//     }
//     await user.save();

//     // Send OTP to email and mobile
//     await sendOTPEmail(email, otp);
//     await sendOTPMobile(phone, otp);

//     res.status(200).json({ message: 'OTP sent to email and mobile' });
//   } catch (error) {
//     res.status(500).json({ message: 'Error sending OTP', error });
//   }
// };


// isme dono pe ja rha h otp mail or phone pe 
// export async function sendOtpController(req, res) {
//   const { phone, email } = req.body;
//   const otp = generateOTP();
//   const otpExpiration = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

//   try {
//     // Find or create a new user
//     let user = await User.findOne({ phone, email });
//     if (!user) {
//       user = new User({ phone, email, otp, otpExpiration });
//     } else {
//       user.otp = otp;
//       user.otpExpiration = otpExpiration;
//     }
//     await user.save();

//     // Send OTP to email
//     await sendOTPEmail(email, otp);

//     // Send OTP to mobile
//     try {
//       await sendOTPMobile(phone, otp);
//     } catch (twilioError) {
//       if (twilioError.status === 400 && twilioError.code === 21408) {
//         // Handle the specific Twilio error for unverified numbers
//         return res.status(400).json({
//           message: 'Unable to send OTP to unverified phone number',
//           error: twilioError,
//         });
//       } else {
//         // Handle other Twilio errors
//         return res.status(500).json({
//           message: 'Error sending OTP to mobile',
//           error: twilioError,
//         });
//       }
//     }

//     res.status(200).json({ message: 'OTP sent to email and mobile' });
//   } catch (error) {
//     res.status(500).json({ message: 'Error sending OTP', error });
//   }
// };

// export async function verifyOtpController(req, res){
//   const { phone, email, otp } = req.body;

//   try {
//     // Find user
//     const user = await User.findOne({ phone, email });
//     if (!user) {
//       return res.status(400).json({ message: 'User not found' });
//     }

//     // Check if OTP is valid
//     if (user.otp !== otp || user.otpExpiration < Date.now()) {
//       return res.status(400).json({ message: 'Invalid or expired OTP' });
//     }

//     // Generate JWT token
//     const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
//     res.status(200).json({ message: 'OTP verified', token });
//   } catch (error) {
//     res.status(500).json({ message: 'Error verifying OTP', error });
//   }
// }


export async function sendOtpController(req, res) {
  const { phone, email } = req.body;

  // Check if either phone or email is provided (but not both)
  if (!phone && !email) {
    return res.status(400).json({ message: "Please provide either a phone number or email." });
  }

  const otp = generateOTP(); // Generate a new OTP
  const otpExpiration = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

  try {
    // Find or create a new user based on either phone or email
    let user;
    if (phone) {
      user = await User.findOne({ phone });
      if (!user) {
        user = new User({ phone, otp, otpExpiration });
      } else {
        user.otp = otp;
        user.otpExpiration = otpExpiration;
      }
    } else if (email) {
      user = await User.findOne({ email });
      if (!user) {
        user = new User({ email, otp, otpExpiration });
      } else {
        user.otp = otp;
        user.otpExpiration = otpExpiration;
      }
    }

    // Save user with the new OTP and expiration
    await user.save();

    // Send OTP based on whether email or phone was provided
    if (email) {
      // Send OTP to email
      await sendOTPEmail(email, otp);
      return res.status(200).json({ message: "OTP sent to email" });
    } else if (phone) {
      // Send OTP to mobile
      try {
        await sendOTPMobile(phone, otp);
        return res.status(200).json({ message: "OTP sent to mobile" });
      } catch (twilioError) {
        if (twilioError.status === 400 && twilioError.code === 21408) {
          // Handle specific Twilio error for unverified numbers
          return res.status(400).json({
            message: "Unable to send OTP to unverified phone number",
            error: twilioError,
          });
        } else {
          // Handle other Twilio errors
          return res.status(500).json({
            message: "Error sending OTP to mobile",
            error: twilioError,
          });
        }
      }
    }
  } catch (error) {
    res.status(500).json({ message: "Error sending OTP", error });
  }
}

export async function verifyOtpController(req, res) {
  const { phone, email, otp } = req.body;

  try {
    // Ensure either phone or email is provided
    if (!phone && !email) {
      return res.status(400).json({ message: 'Please provide either phone or email to verify OTP' });
    }

    // Find user based on phone or email
    let user;
    if (phone) {
      user = await User.findOne({ phone });
    } else if (email) {
      user = await User.findOne({ email });
    }

    // If user is not found
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Check if OTP is valid and not expired
    if (user.otp !== otp || user.otpExpiration < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // If OTP is correct and not expired, generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Respond with success and token
    res.status(200).json({ message: 'OTP verified successfully', token });
  } catch (error) {
    res.status(500).json({ message: 'Error verifying OTP', error });
  }
}
