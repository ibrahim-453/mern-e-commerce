import mongoose from "mongoose";

const productScehma = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true
        },
        description:{
            type:String,
            required:true
        },
        catgory:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Catgory",
            required:true
        },
        stock:{
            type:Number,
            required:true,
            default:0
        },
        price:{
            type:Number,
            required:true
        },
        image:{
            type:String,
            required:true
        },
        rating:{
            type:[mongoose.Schema.Types.ObjectId],
            ref:"User",
            default:[]
        },
        isActive:{
            type:Boolean,
            default:true
        }
    },
    {timestamps:true}
)

export const Product = mongoose.model("Product",productScehma)