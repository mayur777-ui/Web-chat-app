import mongoose,{Schema} from "mongoose";

const userSchema = new Schema({
    name:{
        type:String,
        required:true,
        unique:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    profilepic:{
        type:String,
        default:"",
    },
    connections:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'USER'
    }],
    otp:{
        otpnum:{
            type:String,
        },
        expiry: Date
    }
},
{timestamps:true}
);

const USER = mongoose.model('USER',userSchema);
export default USER;