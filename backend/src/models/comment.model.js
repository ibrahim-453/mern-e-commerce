import mongoose from "mongoose";

const commentSchema =  new mongoose.Schema(
    {
        content:{
            type:String,
            required:true
        },
        productId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Product"
        },
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
    },
    {timestamps:true}
)

export const Comment = mongoose.model("Comment",commentSchema)