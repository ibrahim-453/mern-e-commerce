import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    mainCategory : {
      type : String,
      trim : true,
      required : true
    },
    subCategory : {
      type : String,
      trim : true,
      required : true
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
    },
    images: {
      type: [String],
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    ratings: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        value: { type: Number, min: 1, max: 5},
      },
    ],
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);
