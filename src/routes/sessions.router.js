import {Router} from 'express'
import userModel from '../Dao/models/users.model.js'

const router = Router();

router.post('/register',async (req, res) => {
  try {
    const { first_name , last_name, email, age, password } = req.body 
    const existes = await userModel.findOne({email})
    if(existes) return res.status(400).send("El usuario ya existe")
    const user ={
      first_name,
      last_name,
      email,
      age,
      password
    }
    await userModel.create(user)
    res.send({status:'sucess',message:'User Registered'})
  }catch(error){
    return res.status(500).send(`hubo un error: ${error}`)
  }
})

router.post('/login',async (req, res) => {
  
  try {
    const { email, password } = req.body 
    const user = await userModel.findOne({email,password})
    if(!user) return res.status(400).send("credenciales incorrectas")
    req.session.user = {
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      age: user.age
    }
    res.send({status:'sucess',message:'login succesfull'})

  }catch(error){
    return res.status(500).send(`hubo un error: ${error}`)
  }
  
})

router.get('/logout',async (req, res) => {
  req.session.destroy(err=>{
    if(err) return res.status(500).send(`Error: ${err}`)
    res.redirect('/')
  })
})

export default router