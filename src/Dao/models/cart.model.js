import mongoose from "mongoose";
const cartsCollection = 'carts'

const cartSchema = mongoose.Schema(
  {
    products: {
      type: [
        {
          product:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"products"
          }
        }
      ],
    }
  }
)

export const cartModel = mongoose.model(cartsCollection,cartSchema)