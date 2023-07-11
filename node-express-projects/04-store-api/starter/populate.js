require('dotenv').config()

const connectDB=require('./db/connect')//to connect with database
const Product = require('./models/product') //for acessing 'model' feature
const jsonProducts=require('./products.json') //initial prooduct initialisation 


const start = async()=>{
    try {
        await connectDB(process.env.MONGO_URI)
        await Product.create(jsonProducts)
        console.log('Sucess!!!')
        process.exit(0)
    } catch (error) {
        console.log(error.message)
        process.exit(1)
    }
}
start()