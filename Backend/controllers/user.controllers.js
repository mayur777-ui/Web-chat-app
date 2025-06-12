import USER from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { transporter } from "../utils/email.js";
import { createNotification } from "./notification.controllers.js";
import { NOTIFICATION_TYPES } from "../utils/notification.types.js";
export const register = async (req, res) => {
  const { name, email, password } = req.body;
  // console.log(req.body);
  try {
    if (!name || !email || !password) {
      console.log("Please fill all the fields");
      return res.status(400).json({ msg: "Please fill all the fields" });
    }
    let existing = await USER.findOne({ email });
    if (existing) {
      return res.status(409).json({ msg: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new USER({
      name,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    createNotification(newUser._id, NOTIFICATION_TYPES.First_time);
    const token = jwt.sign(
      {
        id: newUser._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    const { password: _, ...filteredUser } = newUser.toObject();
    res.status(201).json({
      token,
      user: filteredUser,
      msg: "User registered successfully",
    });
  } catch (err) {
    res.status(500).json({ msg: err });
    // console.log(err.message);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        msg: "Please fill all the fields",
      });
    }
    let existing = await USER.findOne({ email });
    if (!existing) {
      return res.status(404).json({
        msg: "User does not exist",
      });
    }
    let isPassword = await bcrypt.compare(password, existing.password);
    if (!isPassword) {
      return res.status(400).json({
        msg: "Invalid Password",
      });
    }

    const token = jwt.sign({ id: existing._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    const id = existing._id;
    // console.log(id.toString()); //i use TOstring method to want only id not addition info like newObjectId('id');
    res.status(200).json({
        id: id.toString(),
      token,
      msg: "User logged in successfully",
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await USER.findById(id).populate('connections.user');
    // console.log("User ID:", user);
    const onlyAcceptedConnections = user.connections.filter((connection) => connection.status === 'accepted');
    console.log("accept only ", onlyAcceptedConnections);
    if (!user) {
      return res.status(404).json({
        msg: "User not found",
      });
    }
    res.send({user, userFriend: onlyAcceptedConnections});
  } catch (err) {
    res.status(500).json({ msg: err });
    console.log(err.message);
  }
};

export const beingConnect = async (req, res) => {
  try {
    const connectionSendid = req.user.id;
    const {email, message} = req.body;
    const SendUser = await USER.findById(connectionSendid);
    const RecevierUser = await USER.findOne({email}); //=>if you use find only it will return array of user
    if (!SendUser) {
      return res.status(404).json({
        message: "User it self does not exist",
      });
    }

    if (!RecevierUser) {
      return res.status(404).json({
        message: "Reciver user is not present",
      });
    }
    const connectionGetid = RecevierUser._id;
    SendUser.connections.forEach((conn, index) => {
  console.log(`Connection[${index}]:`, conn);
});
    let u = SendUser.connections.some(connection => connection.user.toString() === connectionGetid.toString());
    if(u){
      
      return res.status(400).json({
          message: "User already exists"
      });
    }
    if(connectionSendid.toString() === connectionGetid.toString()){
      return res.status(400).json({message: "You cannot connect with yourself"});
    }


    SendUser.connections.push({
      user:connectionGetid,
      status: 'pending',
    })
    RecevierUser.connections.push({
      user: connectionSendid,
      status: 'pending',
    })
    await SendUser.save();
    await RecevierUser.save();
    createNotification(connectionGetid, NOTIFICATION_TYPES.Connection_request,connectionSendid);
    res.status(201).json({
      message: "User is in your connection",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};


export const acceptConnection = async(req,res)=>{
  try{
    const {senderID} = req.body;
    console.log("Sender ID:", senderID);
    const receiverID = req.user.id;
    const senderUser = await USER.findById(senderID);
    const receiverUser = await USER.findById(receiverID);
    console.log(senderUser);
    console.log(receiverUser)
    if(!senderUser){
      return res.status(404).json({
        message: "Sender User does not exist",
      });
    }
    if(!receiverUser){
      return res.status(404).json({
        message: "Receiver user does not exist",
      });
    }
    const receiverConnection = receiverUser.connections.find(
      conn => conn.user.toString() === senderID && conn.status === "pending"
    );
    const senderConnection = senderUser.connections.find(
      conn => conn.user.toString() === receiverID && conn.status === "pending"
    );
    if (!receiverConnection) {
      return res.status(400).json({
        message: "receiver has no pending record for this connection",
      });
    }
    if (!senderConnection) {
      return res.status(400).json({
        message: "Sender has no pending record for this connection",
      });
    }

    receiverConnection.status = "accepted";
    senderConnection.status = "accepted";

    await receiverUser.save();
    await senderUser.save();

     res.status(200).json({
      message: "Connection request accepted",
    });

  }catch(err){
    console.log(err.message);
    res.status(500).json({
      message: "Internal server error",
    });
  }
}
// export const getAllconnections = async (req, res) => {
//   try {
//     const id = req.user.id;
//     console.log("User id:", id);
//     const user = await USER.findById(id).populate('connections');
//     console.log(user);
//     if (!user) {
//       return res.status(404).json({
//         message: "User does not exist",
//       });
//     }
//     const allConnections = user.connections;
//     res.status(201).json({
//       user,
//       allConnections,
//     });
//     // console.log(user);
//   } catch (error) {
//     console.log(error.message);
//     res.send({
//       message: "Internal server error",
//     });
//   }
// };



export const forgotPassword = async( req, res) => {
  try{
//     console.log("Email user:", process.env.Google_EMAIL);
// console.log("Email pass:", process.env.Google_EMAIL_PASS);
    const {email} = req.body;
    // console.log(email);
    if(!email){
      return res.status(400).json({
        message: "Please fill all the fields",
      });
    }
    const user = await USER.findOne({email});
    if(!user){
      // console.log("User does not exist");
      return res.status(404).json({
        message: "User does not exist",
      });
    }
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    user.otp = {
      otpnum :otp,
      expiry :new Date(Date.now() + 10 * 60 * 1000)
    }
    await user.save();
    // res.status(200);
    await transporter.sendMail({
      from: process.env.Google_email,
      to: email,
      subject: "Password Reset OTP",
      html: `<div style="
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
  background: #f9fafb; 
  padding: 20px; 
  border-radius: 12px; 
  max-width: 400px; 
  margin: auto; 
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  color: #333;
">
  <h2 style="color: #4f46e5; margin-bottom: 10px;">Password Reset OTP</h2>
  <p style="font-size: 16px; line-height: 1.5;">
    Your OTP for password reset is 
    <span style="
      display: inline-block;
      background: #4f46e5;
      color: white;
      padding: 10px 18px;
      font-weight: 700;
      font-size: 18px;
      border-radius: 8px;
      letter-spacing: 2px;
      user-select: all;
      ">
      ${otp}
    </span>
  </p>
  <p style="font-size: 14px; color: #6b7280; margin-top: 12px;">
    This OTP is valid for 10 minutes. Please do not share it with anyone.
  </p>
</div>
`,
    }).then(() => {
      res.status(200).json({
        message: "OTP sent to your email",
      });
    }).catch((err) => {
      console.log(err);
      res.status(500).json({
        message: "Failed to send OTP",
      });   
    })
  }catch(err){
    console.log(err);
    res.status(500).json({
      message: "Internal server error",
    });
  }
}


export const verifyOtp = async(req,res)=>{
  try{
    const {email, otp} = req.body;

    if(!email || !otp){
      return res.status(400).json({
        message: "Please fill all the fields",
      });
    }
    const user  = await USER.findOne({email});
    if(!user){
      return res.status(404).json({
        message: "User does not exist",
      });
    }
    if(!user.otp || user.otp.otpnum !== otp || user.otp.expiry < new Date()){
      return res.status(400).json({
        message: "Invalid or expired OTP",
      });
    }
    res.status(200).json({
      message: "OTP verified successfully",
      userId: user._id,
    });
  }catch(err){
    console.log(err);
    res.status(500).json({
      message: "Internal server error",
    });
  }
}



export const resetPassword = async(req,res)=>{
  try{
    let {userId, newPassword} = req.body;
    if(!userId || !newPassword){
      return res.status(400).json({
        message: "Please fill all the fields",
      });
    }
    const user = await USER.findById(userId);
    if(!user){
      return res.status(404).json({
        message: "User does not exist",
      });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    user.otp = null; // Clear the OTP after successful password reset
    await user.save();
    createNotification(user._id, NOTIFICATION_TYPES.Password_reset);
    res.status(200).json({
      message: "Password reset successfully",
    });

  }catch(err){
    console.log(err);
    res.status(500).json({
      message: "Internal server error",
    })
  }
}