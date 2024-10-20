import dotenv from 'dotenv'
import nodemailer from 'nodemailer'
import twilio from 'twilio'
dotenv.config()

export function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
  

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = new twilio(accountSid, authToken);


export async function sendOTPEmail(email, otp) {
  let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  let mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is ${otp}`
  };

  await transporter.sendMail(mailOptions);
}

export async function sendOTPMobile(phone, otp) {
  await client.messages.create({
    body: `Your OTP code is ${otp}`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: phone
  });
}
