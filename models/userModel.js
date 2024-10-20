// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema(
//   {    
//       phone: { type: String, required: true },
//       email: { type: String, required: true },
//       otp: { type: String, required: true },
//       otpExpiration: { type: Date, required: true }
//   },
//   { timestamps: true }
// );

// export default mongoose.model("user", userSchema);

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: function () {
        return !this.email; // Phone is required if email is not provided
      },
    },
    email: {
      type: String,
      required: function () {
        return !this.phone; // Email is required if phone is not provided
      },
    },
    otp: {
      type: String,
      required: true, // OTP is always required
    },
    otpExpiration: {
      type: Date,
      required: true, // OTP expiration time is always required
    },
    // Address fields - make these optional for OTP
    firstName: {
      type: String,
      required: false, // Optional for OTP
    },
    lastName: {
      type: String,
      required: false, // Optional for OTP
    },
    street: {
      type: String,
      required: false, // Optional for OTP
    },
    city: {
      type: String,
      required: false, // Optional for OTP
    },
    state: {
      type: String,
      required: false, // Optional for OTP
    },
    country: {
      type: String,
      required: false, // Optional for OTP
    },
    postalCode: {
      type: String,
      required: false, // Optional for OTP
    },
  },
  { timestamps: true }
);

// Validation to ensure at least one of phone or email is provided
userSchema.path("phone").validate(function (value) {
  return this.phone || this.email;
}, "Either phone or email must be provided.");

userSchema.path("email").validate(function (value) {
  return this.phone || this.email;
}, "Either phone or email must be provided.");

export default mongoose.model("user", userSchema);
