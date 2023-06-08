const express = require('express')
const cookieParser = require('cookie-parser')
const errorMiddleware = require('./middleware/error')

/* Routes */
const productRoutes = require('./routes/productRoutes')
const userRoutes = require('./routes/userRoutes')
const orderRoutes = require('./routes/orderRoutes')

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use('/api/v1', productRoutes)
app.use('/api/v1', userRoutes)
app.use('/api/v1', orderRoutes)


// error middleware
app.use(errorMiddleware) 



module.exports = app

