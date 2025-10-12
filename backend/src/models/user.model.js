import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
    {
        fullname:{
            type:String,
            required:true
        },
        username:{
            type:String,
            unique:true,
            required:true
        },
        email:{
            type:String,
            unique:true,
            requied:true
        },
        password:{
            type:String,
            required:true
        },
        orderHistory:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"Order"
            }
        ],
        refreshToken:{
            type:String,
        },
        role:{
            type:String,
            enum:["user","admin"],
            default:"user"
        }
    },
    {timestamps:true}
)

export const User = mongoose.model("User",userSchema)