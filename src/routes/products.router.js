import { Router } from 'express'
import { ProductManager } from '../Dao/managers/fileSystem/ProductManager.js'
import { MongoProductManager } from '../Dao/managers/mongo/mongoProductManager.js'

const router = Router()
const pm = new ProductManager()
const mongoPm = new MongoProductManager()

router.get('/', async (req, res) => {
  let { limit, page, query, sort  } = req.query
  if(!limit) limit = 10
  if(!page) page = 1
  if(!sort) sort = "asc"
  try {
    const products = await mongoPm.getProducts(limit, page, query, sort)
    const responseObj = { ...products }
    
    if(responseObj.hasPrevPage){
      responseObj.prevLink = `http://localhost:8080/api/products?limit=${limit}&page=${responseObj.page - 1}`
    } else {
      responseObj.prevLink= null
    }
    if(responseObj.hasNextPage){
      responseObj.nextLink = `http://localhost:8080/api/products?limit=${limit}&page=${responseObj.page + 1}`
    }else{
      responseObj.nextLink= null
    }
    
    
    return res.status(200).send({
      status: 'success',
      payload: responseObj.docs,
      totalPages: responseObj.totalPages,
      prevPage: responseObj.prevPage,
      nextPage: responseObj.nextPage,
      page: responseObj.page,
      hasPrevPage: responseObj.hasPrevPage,
      hasNextPage: responseObj.hasNextPage,
      prevLink: responseObj.prevLink,
      nextLink: responseObj.nextLink,
    })

  }catch(error){
    return res.status(500).send({status: "error", error})
  }
})

router.get('/:pid', async (req, res) => {
  const pid = req.params.pid
  const io = req.app.get('socketio')
  const product = await mongoPm.getProduct(pid)
  io.sockets.emit('get_p_id', product)
  res.status(200).send(product)
})

router.post('/', async (req, res) => {
  const { title, description, price, thumbnail, code, stock, status, category } = req.body
  if (!title || !description || !price || !code || !stock || !category) {
    return res.status(405).send('el producto que se esta enviando no esta completo')
  }
  const product = req.body
  const addedProduct = await mongoPm.addProduct(product)
  return res.status(200).send(addedProduct)
})

router.put('/:pid', async (req, res) => {
  const pid = req.params.pid
  const product = req.body
  const updateProduct = await mongoPm.updateProduct(pid, product)
  return res.status(200).send(updateProduct)
})

router.delete('/:pid', async (req, res) => {
  const pid = req.params.pid
  const io = req.app.get('socketio')
  try {
    const deletedProduct = await mongoPm.deleteProduct(pid)
    io.sockets.emit('delete_product', pid)
    return res.status(200).send(`Producto con id ${pid} borrado con exito`)
  } catch (error) {
    return res.status(500).send(error)
  }
})

export default router
