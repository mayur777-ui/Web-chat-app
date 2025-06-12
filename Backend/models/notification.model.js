import mongoose ,{Schema} from "mongoose";

const notificationSchema  = new Schema({
   receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'USER',
        required: true
    },
    senderId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'USER',
        default: null
    },
    Type : {
        type:String,
        enum:[
            'FirstTime',
            'PasswordReset',
            'ConnectionRequest',
            'ConnectionAccepted',
            'ConnectionRejected',
            'NewMessage',
        ]
    },
    text: {
    type: String,
    required: true,
  },
  status:{
    type: String,
    enum: ['unread', 'read'],
    default: 'unread',
  }
},{
    timestamps: true,
})

const NOTIFICATION = mongoose.model('NOTIFICATION', notificationSchema);
export default NOTIFICATION;