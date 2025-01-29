import USER from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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
    const user = await USER.findById(id).populate('connections');
    // console.log(user);
    if (!user) {
      return res.status(404).json({
        msg: "User not found",
      });
    }
    res.send({user:user});
  } catch (err) {
    res.status(500).json({ msg: err });
    // console.log(err.message);
  }
};

export const beingConnect = async (req, res) => {
  try {
    const connectionSendid = req.user.id;
    const {email, message} = req.body;
    // console.log(email,message);
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
    let u = SendUser.connections.includes(connectionGetid);
    if(u){
      return res.status(400).json({
          message: "User already exists"
      });
    }
    SendUser.connections.push(connectionGetid);
    RecevierUser.connections.push(connectionSendid);
    await SendUser.save();
    await RecevierUser.save();
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

export const getAllconnections = async (req, res) => {
  try {
    const id = req.user.id;
    const user = await USER.findById(id).populate('connections');
    if (!user) {
      return res.status(404).json({
        message: "User does not exist",
      });
    }
    const allConnections = user.connections;
    res.status(201).json({
      user,
      allConnections,
    });
    // console.log(user);
  } catch (error) {
    console.log(error.message);
    res.send({
      message: "Internal server error",
    });
  }
};
