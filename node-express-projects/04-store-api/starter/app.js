require('dotenv').config();
require('express-async-errors')

const express=require('express')
const app=express()

const connectDB=require('./db/connect')
const productsRouter = require('./routes/products')

app.use(express.json())

app.get('/',(req,res)=>{
    res.send('<h1>STORE API</h1><a href="/api/v1/products">Produts Route</a>')
})
//routers
app.use('/api/v1/products',productsRouter)

const port=process.env.PORT || 3000;
const start = async()=>{
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port,()=>{
            console.log('server is listening...')
        })
    } catch (error) {
        console.log(error.message)
    }
}

start()