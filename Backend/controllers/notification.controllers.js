import NOTIFICATION from "../models/notification.model.js";
import { NOTIFICATION_TYPES } from "../utils/notification.types.js";



const getDefaultText = (type) => {
  switch (type) {
    case NOTIFICATION_TYPES.First_time:
      return "🎉 Welcome to the Chat App!";
    case NOTIFICATION_TYPES.Password_reset:
      return "🔐 Your password was successfully reset.";
    case NOTIFICATION_TYPES.New_message:
      return "💬 You have a new message.";
    case NOTIFICATION_TYPES.Connection_request:
      return "🤝 Someone sent you a connection request.";
    case NOTIFICATION_TYPES.Connection_accepted:
      return "✅ Your connection request was accepted.";
    default:
      return "📢 You have a new notification.";
  }
};


export const createNotification= async(userid, notificationType, senderid=null)=>{
    const text = getDefaultText(notificationType);
    try{
        const newNotification = new NOTIFICATION({
            receiverId: userid,
            senderId: senderid,
            Type: notificationType,
            text,
        });
        await newNotification.save();
    }catch(err){
        console.log("Error : ", err);
        throw err;
    }
};


export const getAllNotifications = async(req,res)=>{
    // const { userid } = req.params;
    const userid = req.user.id;

    try{
        let notifications = await NOTIFICATION.find({receiverId:userid}).sort({createdAt: -1});        
        res.status(200).json({data: notifications});
    }catch(err){
        console.log("Error : ", err);
        res.status(500).json({msg: "Internal server error"});
    }
};



export const getUnreadNotificationsCount = async(req,res)=>{
  const userid =req.user.id;
  try{
    const count = await NOTIFICATION.countDocuments({
      receiverId: userid,
      status: 'unread'
    })
    // console.log("Unread notifications count: ", count);
    res.status(200).json({count});
  }catch(err){
    console.log("Error : ", err);
    res.status(500).json({msg: "Internal server error"});
  }
}

export const markNotificationAsRead = async(req,res)=>{
  const userid = req.user.id;
  const {notificatoinid} = req.params;
  console.log("Notification ID: ", notificatoinid);
  try{
    const notification = await NOTIFICATION.findOneAndUpdate({
      _id: notificatoinid,
      receiverId: userid,
    },{
      status: 'read'
    },{
      new: true
    })
    
    if (!notification) {
      return res.status(404).json({ msg: 'Notification not found' });
    }
    res.status(200).json({msg: "Notification marked as read"});
  }catch(err){
    console.log("Error : ", err);
    res.status(500).json({msg: "Internal server error"});
  }
}