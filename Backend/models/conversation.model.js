import mongoose, { Schema } from "mongoose";
import USER from "./user.model.js";
import MESSAGE from "./message.model.js";
const conversationSchema =  new Schema({
    participants:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'USER',
        }
    ],
   messages:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:'MESSAGE',
        default:[],
    }
   ]
},
{
    timestamps:true
}
);

const CONVERSATION = mongoose.model('CONVERSATION',conversationSchema);
export default CONVERSATION;