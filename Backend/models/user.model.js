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
          user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'USER',
      required: true
    },
        status:{
            type:String,
            enum:['pending','accepted', 'rejected'],
            default: 'pending',
        },
         requestedAt: {
                type: Date,
                default: Date.now
            },
            updatedAt: {
                type: Date,
            }
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