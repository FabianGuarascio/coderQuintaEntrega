import { cartModel } from "../../models/cart.model.js"


export class MongoCartManager {
  async getCarts() {
    const carts = await cartModel.find()
    return carts
  }

  async getCartById(id){
    try {
      return await cartModel.findById(id)
    }catch(error){
      return error
    }
  }

  async addcart(cart) {
    console.log("que ondaaaaaaaaaaaa")
    return await cartModel.create(cart)
  }

  async updatecart(id,cart) {
    const cartRes = await cartModel.findById({_id:id})
    cartRes.products = cart
    return await cartModel.updateOne( {_id:id} ,cartRes)
  }
  
  async deletecart(id){
    return await cartModel.deleteOne( {_id:id})
  }

  async addProductToCart(cid,pid){
    const cart = await cartModel.findById({_id:cid})
    cart.products.push({product: pid})
    const result = await cartModel.updateOne({_id:cid},cart)
    return result
  }
  async deleteProductFromCart(cid,pid){
    const cart = await cartModel.findById({_id:cid})
    const index = cart.products.findIndex(v=>{
      return v.product == pid
    })
    if(index>-1){
      cart.products.splice(index,1)
      const result = await cartModel.updateOne({_id:cid},cart)
      return result
    }else{
      return "el producto no existe"
    }
  }
}
