import express from 'express'
import handlebars from 'express-handlebars'
import productsRouter from './routes/products.router.js'
import cartsRouter from './routes/carts.router.js'
import viewrouter from './routes/views.router.js'
import sessionsRouter from './routes/sessions.router.js'
import { __dirname } from './utils.js'
import { Server } from 'socket.io'
import mongoose from 'mongoose'
import MongoStore from 'connect-mongo'
import { messageModel } from './Dao/models/messages.model.js'
import { MongoMessageManager } from './Dao/managers/mongo/mongoMessageManager.js'
import session from 'express-session'

const mongoMM = new MongoMessageManager()

const app = express()
const PORT = 8080
try {
  await mongoose.connect(
    'mongodb+srv://fabianGuarascio:yvFiYs0oRIsFS7qf@cluster0.vk3tfaq.mongodb.net/ecommerce?retryWrites=true&w=majority'
  )
  console.log('DB connected')
} catch (error) {
  console.error('error: ', error)
}

app.use(express.json())

app.use(express.static(`${__dirname}/public`))
app.engine('handlebars', handlebars.engine())
app.set('views', `${__dirname}/views`)
app.set('view engine', 'handlebars')


app.use(session({
  store:MongoStore.create({
    client:mongoose.connection.getClient(),
    ttl:15
  }),
  secret : 'Coder39760',
  resave:true,
  saveUninitialized: true
}))

app.use('/', viewrouter)
app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)
app.use('/api/sessions', sessionsRouter)


export const server = app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
const io = new Server(server)
app.set('socketio', io)
let messages = []
messages = await mongoMM.getMessages()
io.on('connection', (socket) => {
  io.emit('messagesLogs', messages)
  socket.on('message', async (data) => {
    messages.push(data)
    await mongoMM.addMessage(data)
    io.emit('messagesLogs', messages)
  })
})
