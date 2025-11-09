import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
    {
        product:{
            type:mongoose.Types.ObjectId,
            ref:"Product",
            required:true
        },
        quantity:{
            type:Number,
            default:0,
            required:true
        }
    }
)

const cartSchema = new mongoose.Schema(
    {
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        items:[cartItemSchema],
        totalPrice:{
            type:Number,
            default:0,
            required:true
        },
        totalItems:{
            type:Number,
            default:0,
            required:true
        }
    },
    {timestamps:true}
)
export const Cart = mongoose.model("Cart",cartSchema)