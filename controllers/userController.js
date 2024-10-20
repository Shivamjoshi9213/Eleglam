import mongoose from 'mongoose';
import User from '../models/userModel.js';
import { sendOTPEmail, sendOTPMobile,generateOTP } from '../utils/genrateToken.js'
import jwt from 'jsonwebtoken';

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
// Add Address Controller
// export async function addAddressController(req, res) {
//   const { userId } = req.body; // Assuming you're passing the user ID after OTP verification

//   const { firstName, lastName, street, city, state, country, postalCode, phone, email } = req.body;

//   if (!userId) {
//     return res.status(400).json({ message: "User ID is required" });
//   }
//   if (!firstName) {
//     return res.status(400).json({ message: 'First name is required' });
//   }
//   if (!lastName) {
//     return res.status(400).json({ message: 'Last name is required' });
//   }
//   if (!street) {
//     return res.status(400).json({ message: 'Street is required' });
//   }
//   if (!city) {
//     return res.status(400).json({ message: 'City is required' });
//   }
//   if (!state) {
//     return res.status(400).json({ message: 'State is required' });
//   }
//   if (!country) {
//     return res.status(400).json({ message: 'Country is required' });
//   }
//   if (!postalCode) {
//     return res.status(400).json({ message: 'Postal code is required' });
//   }
  
//   if (!mongoose.Types.ObjectId.isValid(userId)) {
//     return res.status(400).json({ message: "Invalid User ID" });
//   }

//   try {
//     // Find the user by ID
//     const user = await User.findById(mongoose.Types.ObjectId(userId));
//     // If the user does not exist
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

    
//  // Ensure that if user already has a phone number, they can only add an email, and vice versa.
//  if (user.phone && phone) {
//   return res.status(400).json({ message: "Phone number is already set. Cannot update phone." });
// }

// if (user.email && email) {
//   return res.status(400).json({ message: "Email is already set. Cannot update email." });
// }

// // Allow adding email if phone was already set
// if (user.phone && !user.email && email) {
//   user.email = email; // Add email if it's provided and phone was already set
// }

// // Allow adding phone if email was already set
// if (user.email && !user.phone && phone) {
//   user.phone = phone; // Add phone if it's provided and email was already set
// }

//     // Update the user's address information
//     user.firstName = firstName;
//     user.lastName = lastName;
//     user.street = street;
//     user.city = city;
//     user.state = state;
//     user.country = country;
//     user.postalCode = postalCode;

//     // Save the updated user details
//     await user.save();

//     res.status(200).json({ message: "Address and contact details added successfully", user });
//   } catch (error) {
//     res.status(500).json({ message: "Error adding address and contact details", error });
//   }
// }

// export async function addAddressController(req, res) {
//   const { userId, firstName, lastName, street, city, state, country, postalCode, phone, email } = req.body;

//   // Check if userId is provided
//   if (!userId) {
//     return res.status(400).json({ message: "User ID is required" });
//   }

//   // Check if all address fields are provided
//   if (!firstName) return res.status(400).json({ message: 'First name is required' });
//   if (!lastName) return res.status(400).json({ message: 'Last name is required' });
//   if (!street) return res.status(400).json({ message: 'Street is required' });
//   if (!city) return res.status(400).json({ message: 'City is required' });
//   if (!state) return res.status(400).json({ message: 'State is required' });
//   if (!country) return res.status(400).json({ message: 'Country is required' });
//   if (!postalCode) return res.status(400).json({ message: 'Postal code is required' });

//   // Check if userId is valid
//   if (!mongoose.Types.ObjectId.isValid(userId)) {
//     return res.status(400).json({ message: "Invalid User ID" });
//   }

//   try {
//     // Find the user by ID
//     const user = await User.findById(mongoose.Types.ObjectId(userId));

//     // If the user does not exist
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Check if phone or email can be updated
//     if (user.phone && phone) {
//       return res.status(400).json({ message: "Phone number is already set. Cannot update phone." });
//     }

//     if (user.email && email) {
//       return res.status(400).json({ message: "Email is already set. Cannot update email." });
//     }

//     // Allow adding email if phone was set
//     if (user.phone && !user.email && email) {
//       user.email = email; // Add email if phone was set
//     }

//     // Allow adding phone if email was set
//     if (user.email && !user.phone && phone) {
//       user.phone = phone; // Add phone if email was set
//     }

//     // Update the user's address information
//     user.firstName = firstName;
//     user.lastName = lastName;
//     user.street = street;
//     user.city = city;
//     user.state = state;
//     user.country = country;
//     user.postalCode = postalCode;

//     // Save the updated user details
//     await user.save();

//     // Respond with success
//     return res.status(200).json({ message: "Address and contact details added successfully", user });
//   } catch (error) {
//     // Log the error for troubleshooting
//     console.error("Error adding address:", error);

//     // Return a detailed error message in response
//     return res.status(500).json({ message: "Error adding address and contact details", error: error.message || error });
//   }
// }

export async function addAddressController(req, res) {
  const { userId, firstName, lastName, street, city, state, country, postalCode, phone, email } = req.body;

  // Validate if the userId is provided
  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  // Check for missing address fields
  if (!firstName) return res.status(400).json({ message: 'First name is required' });
  if (!lastName) return res.status(400).json({ message: 'Last name is required' });
  if (!street) return res.status(400).json({ message: 'Street is required' });
  if (!city) return res.status(400).json({ message: 'City is required' });
  if (!state) return res.status(400).json({ message: 'State is required' });
  if (!country) return res.status(400).json({ message: 'Country is required' });
  if (!postalCode) return res.status(400).json({ message: 'Postal code is required' });

  // Check if userId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid User ID" });
  }

  try {
    // Find the user by their ID (Mongoose automatically converts string IDs)
    const user = await User.findById(userId); // No need for manual ObjectId conversion

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if phone or email can be added
    if (user.phone && phone) {
      return res.status(400).json({ message: "Phone number is already set. Cannot update phone." });
    }

    if (user.email && email) {
      return res.status(400).json({ message: "Email is already set. Cannot update email." });
    }

    // Allow adding email if the phone was set but email was not
    if (user.phone && !user.email && email) {
      user.email = email; // Add email
    }

    // Allow adding phone if the email was set but phone was not
    if (user.email && !user.phone && phone) {
      user.phone = phone; // Add phone
    }

    // Update address information
    user.firstName = firstName;
    user.lastName = lastName;
    user.street = street;
    user.city = city;
    user.state = state;
    user.country = country;
    user.postalCode = postalCode;

    // Save the user with the updated details
    await user.save();

    // Respond with success
    res.status(200).json({ message: "Address and contact details added successfully", user });
  } catch (error) {
    // Log error for debugging
    console.error("Error adding address:", error);

    // Send detailed error response
    res.status(500).json({ message: "Error adding address and contact details", error: error.message });
  }
}