import { Router } from 'express'
import { ProductManager } from '../Dao/managers/fileSystem/ProductManager.js'
import { MongoProductManager } from '../Dao/managers/mongo/mongoProductManager.js'
import { MongoCartManager } from '../Dao/managers/mongo/mongoCartManager.js'


const pm = new ProductManager()
const mongoPm = new MongoProductManager()
const mongoCm = new MongoCartManager()


const router = Router()

router.get('/', (req, res) => {
  res.render('index', { title: 'main' })
})

router.get('/home', (req, res) => {
  const products = pm.getProducts()
  res.render('home', { prod: products })
})

router.get('/realTimeProducts', (req, res) => {
  const products = pm.getProducts()
  const io = req.app.get('socketio')
  io.on('connection', (socket) => {
    socket.emit('evento_server', 'te manda saludos el server')
  })
  res.render('realTimeProducts', { prod: products })
})

router.get('/products',async (req, res) => {
  let { limit, page, query, sort  } = req.query
  if(!limit) limit = 10
  if(!page) page = 1
  if(!sort) sort = "asc"
  try {
    const products = await mongoPm.getProducts(limit, page, query, sort)
    const responseObj = { ...products }
    
    if(responseObj.hasPrevPage){
      responseObj.prevLink = `http://localhost:8080/products?limit=${limit}&page=${responseObj.page - 1}`
    } else {
      responseObj.prevLink= null
    }
    if(responseObj.hasNextPage){
      responseObj.nextLink = `http://localhost:8080/products?limit=${limit}&page=${responseObj.page + 1}`
    }else{
      responseObj.nextLink= null
    }

    const modifiedPayload = responseObj.docs.map((item) => {
      return {
        _id: item._id.toString(),
        title: item.title,
        description: item.description,
        price: item.price,
        thumbnail: item.thumbnail,
        code: item.code,
        stock: item.stock,
        status: item.status,
        category: item.category,
      };
    });
    
    return res.render('products',{
      status: 'success',
      payload: modifiedPayload,
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

router.get('/carts/:cid',async (req, res) => {
  const cid = req.params.cid
  const cart = await mongoCm.getCartById(cid)
  const modifiedPayload = cart.products.map(product=>{
    return {
      product: product.product.toString(),
    }
  })
  res.render("cart", {products: modifiedPayload})
})

router.get('/chat',(req, res) => {
  res.render('chat')
})

const publicAccess = (req,res,next)=>{
  if (req.session.user) return res.redirect('/')
  next();
}

const privateAccess = (req,res,next)=>{
  if (!req.session.user) return res.redirect('/login')
  next();
}


router.get('/register', publicAccess, (req,res)=>{
  res.render("register")
})
router.get('/login', publicAccess, (req,res)=>{
  res.render("login")
})

router.get('/',privateAccess, (req,res)=>{
  res.render('profile', {
    user: req.session.user
  })
})


export default router
