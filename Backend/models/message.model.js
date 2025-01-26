import mongoose,{Schema} from "mongoose";
import USER from "./user.model.js";
const messageSchema = new Schema({
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'USER',
        required: true,
    },
    receiver:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'USER',
        required:true,
    },

    content:{
        type:String,
        required:true,
    },
    date:{
        type:String,
        required:true,
        default:Date.now,
    }
})

const MESSAGE = mongoose.model("MESSAGE",messageSchema);

export default MESSAGE;