const Product = require('../model/productModel')
const Order = require('../model/orderModel')
const User = require('../model/userModel')

const ErrorHandler = require('../utils/errorHandler')
const catchAsyncError = require('../middleware/catchAsyncError')

// create new order
exports.newOrder = catchAsyncError(async (req, res, next) => {

    const {
        shippingInfo, 
        orderItems, 
        paymentInfo, 
        itemPrice, taxPrice,
        totalPrice, 
        shippingPrice
    } = req.body

    const order = await Order.create({
        shippingInfo, 
        orderItems, 
        paymentInfo, 
        itemPrice, taxPrice,
        totalPrice, 
        shippingPrice,
        paidAt: Date.now(),
        user: req.user._id
    })

    res.status(201).json({
        success: true,
        order
    })
}) 


// get single order
exports.singleOrder = catchAsyncError(async (req, res, next) => {

    const order = await Order.findById(req.params.id).populate("user", "name email")

    if(!order) {
        return next(new ErrorHandler('No order found with this id', 404))
    }

    res.status(200).json({
        success: true,
        order
    })
})


// get logged in user order
exports.myOrders = catchAsyncError(async (req, res, next) => {
    const orders = await Order.find({user: req.user._id})

    res.status(200).json({
        success: true,
        orders
    })
})

// get all order --> admin
exports.getAllOrders = catchAsyncError(async (req, res, next) => {
    const orders = await Order.find()

    let totalAmount = 0

    orders.forEach(order => totalAmount+=order.totalPrice)

    res.status(200).json({
        success: true,
        totalAmount,
        orders
    })
})


// update order status
exports.updateOrder = catchAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id)

    if(!order) {
        return next(new ErrorHandler('No order found with this id', 404))
    }

    if(order.orderStatus === "Delivered") {
        return next(new Error('Order is already delivered', 400))
    }

    order.orderItems.forEach(async (ord) => {
        await updateStock(ord.product, ord.quantity)
    })

    order.orderStatus = req.body.status

    if(order.orderStatus === "Delivered") {
        order.deliverAt = Date.now()
    }

    await order.save({validateBeforeSave: false})
    res.status(200).json({
        success: true,
        message: `order status: ${req.body.status}`
    })
})

// async updateStock creation
async function updateStock(id, quantity) {
    const product = await Product.findById(id)
    product.stock -= quantity

    await product.save({validateBeforeSave: false})
}


// delete order 
exports.deleteOrder = catchAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id)

    if(!order) {
        return next(new ErrorHandler('No order found with this id', 404))
    }

    await order.deleteOne()
 
    res.status(200).json({
        success: true,
        message: `order deleted`
    })
})




 
