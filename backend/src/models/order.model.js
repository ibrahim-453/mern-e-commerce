import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product"
    },
    quantity:{
        type:Number,
        default:0
    }
},{_id:false})

const orderSchema = new mongoose.Schema(
    {
        customer:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        items:[orderItemSchema],
        totalPrice:{
            type:Number,
            default:0
        },
        shippingAddress:{
            street:String,
            city:String,
            postalcode:Number,
            country:String
        },
        paymentId:{
            type:String,
            unique:true
        },
        paymentStatus:{
            type:String,
            enum:["Pending","Paid","Failed"],
            default:"Pending"
        },
        orderStatus:{
            type:String,
            enum:["processing","shipping","canceled","delieverd"],
            default:"processing"
        }
    },
    {timestamps:true}
)

export const Order = mongoose.model("Order",orderSchema)
