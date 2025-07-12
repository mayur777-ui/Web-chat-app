import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();
// console.log('Email user:', process.env.Google_EMAIL);
// console.log('Email pass:', process.env.Google_EMAIL_PASS);

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.Google_EMAIL,
    pass: process.env.Google_EMAIL_PASS
  }
});
