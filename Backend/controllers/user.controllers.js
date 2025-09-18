import USER from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { transporter } from "../utils/email.js";
import { createNotification } from "./notification.controllers.js";
import { NOTIFICATION_TYPES } from "../utils/notification.types.js";
import mongoose, { connections } from "mongoose";
import { sendOtp } from "../utils/email.js";
export const register = async (req, res) => {
  const { name, email, password } = req.body;
  // console.log(req.body);
  try {
    if (!name || !email || !password) {
      // console.log("Please fill all the fields");
      return res.status(400).json({ msg: "Please fill all the fields" });
    }
    let existing = await USER.exists({email});
    // let existing = await USER.findOne({email});
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
    console.log(err)
    res.status(500).json({ msg: err });
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
    let existing = await USER.findOne({ email }).select('password _id');
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
    // console.log(id);
    // const user = await USER.findById(id).populate('connections.user');
    // const onlyAcceptedConnections = user.connections.filter((connection) => connection.status === 'accepted');
   const user = (await USER.aggregate([
  { $match: { _id: new mongoose.Types.ObjectId(id) } },

  // Step 1: Filter connections array
  {
    $project: {
      name: 1,
      email: 1,
      connections: {
        $filter: {
          input: "$connections",
          as: "conn",
          cond: { $eq: ["$$conn.status", "accepted"] }
        }
      }
    }
  },

  // Step 2: Populate user references in connections
  {
    $lookup: {
      from: "users",
      localField: "connections.user",
      foreignField: "_id",
      as: "populatedUsers"
    }
  },

  // Step 3: Map the populated users back into connections
  {
    $addFields: {
      connections: {
        $map: {
          input: "$connections",
          as: "conn",
          in: {
            $mergeObjects: [
              "$$conn",
              {
                user: {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: "$populatedUsers",
                        as: "u",
                        cond: { $eq: ["$$u._id", "$$conn.user"] }
                      }
                    },
                    0
                  ]
                }
              }
            ]
          }
        }
      }
    }
  },

  // Step 4: Remove the temporary populatedUsers array
  { $project: { populatedUsers: 0 } }
]))[0];
    console.log(user);
    if (!user) {
      return res.status(404).json({
        msg: "User not found",
      });
    }
    res.send({user});
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
    // console.log(senderUser);
    // console.log(receiverUser)
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




export const forgotPassword = async( req, res) => {
  try{
    const {email} = req.body;
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
    await sendOtp(email, otp);
    res.status(200).json({message: "otp send successfully"});
  }catch(err){
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