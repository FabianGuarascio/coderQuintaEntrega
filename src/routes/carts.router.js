import { Router } from 'express'
import { ProductManager } from '../Dao/managers/fileSystem/ProductManager.js'
import { ChartManager } from '../Dao/managers/fileSystem/ChartManager.js'
import { MongoCartManager } from '../Dao/managers/mongo/mongoCartManager.js'
import { MongoProductManager } from '../Dao/managers/mongo/mongoProductManager.js'

const pm = new ProductManager()
const cm = new ChartManager()
const mongoCm = new MongoCartManager()
const mongoPm = new MongoProductManager()
const router = Router()

router.get('/', async (req, res) => {
  const charts = await mongoCm.getCarts()
  res.send(charts)
})

router.post('/', async (req, res) => {
  const { body } = req
  const cart = await mongoCm.addcart(body)
  res.send(cart)
})

router.get('/:cid', async (req, res) => {
  const { cid } = req.params
  const chart = await mongoCm.getCartById(cid)
  if (chart) {
    res.send(chart)
  } else {
    res.status(404).send('Carrito con ese id no existe')
  }
})

router.put('/:cid', async (req, res) => {
  const { cid } = req.params
  const { body } = req
  try{
    const cart = await mongoCm.updatecart(cid,body)
    if (cart) {
      res.send(cart)
    } else {
      res.status(404).send('Carrito con ese id no existe')
    }
  }catch(error){
    res.status(500).send(`Error: ${error}`)  
  }
})

router.post('/:cid/product/:pid', async (req, res) => {
  const { cid, pid } = req.params
  try{
    const cart = await mongoCm.addProductToCart(cid, pid)
    res.status(200).send(cart)
  }catch(error){
    res.status(500).send(`Error: ${error}`)
  }
})
router.delete('/:cid/product/:pid', async (req, res) => {
  const { cid, pid } = req.params
  try{
    const cart = await mongoCm.deleteProductFromCart(cid, pid)
    res.status(200).send(cart)
  }catch(error){
    res.status(500).send(`Error: ${error}`)
  }
})

export default router
