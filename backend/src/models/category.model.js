import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema(
    {
        name:{
            type:String,
            enum:["Mens","Women","Kids"],
            required:true
        },
        subCategory:{
            type:String,
            required:true
        }
    },
    {timestamps:true}
)

export const Category = mongoose.model("Category",categorySchema)