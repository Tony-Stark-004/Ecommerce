const Product = require('../model/productModel')
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncError = require('../middleware/catchAsyncError')
const ApiFeatures = require('../utils/apifeatures')

// creating Product --> Admin
exports.createProduct = catchAsyncError (async (req, res, next) => {

    req.body.user = req.user.id
    
        const product = await Product.create(req.body)
        res.status(201).json({
            success: true,
            product
        })
})

// get all products
exports.getAllproduct = catchAsyncError (async (req, res, next) => {

    const resultPerPage = 5
    const productsCount = await Product.countDocuments()
    const apifeatures = new ApiFeatures(Product.find(), req.query).search().filter()

    let products = await apifeatures.query;
    let filteredProductCount = products.length
    apifeatures.pagination(resultPerPage)

    products = await apifeatures.query.clone()

    res.status(200).json({
        success: true,
        totalProducts: products.length,
        products,
        productsCount,
        resultPerPage,
        filteredProductCount
    })
})

// get single product
exports.getSingleProduct = catchAsyncError (async(req, res, next) => {
    const {id} = req.params
     const product = await Product.findById(id)
 
     if(!product) {
         return next( new ErrorHandler('Product not found', 404))
     }

     res.status(200).json({
         success: true,
         product,
     })
 })


// update products --> admin
exports.updateProduct = catchAsyncError (async(req, res, next) => {
   const {id} = req.params
    const getProduct = await Product.findById(id)

    if(!getProduct) {
        return next( new ErrorHandler('Product not found', 404))
    }
    const product = await Product.findByIdAndUpdate(id, req.body, {new: true, runValidators: true, useFindAndModify: false})
    res.status(200).json({
        success: true,
        product
    })
})

// delete --> admin

exports.deleteProduct = catchAsyncError (async(req, res, next) => {
    const {id} = req.params
    const getProduct = await Product.findById(id)

    if(!getProduct) {
        return next( new ErrorHandler('Product not found', 404))
    }

    await Product.findByIdAndDelete(id)
    res.status(204).json({
        success: true,
        message: "Product deleted successfully"

    })
})

// create new or update Review

exports.productReview = catchAsyncError(async (req, res, next) => {
    const {comment, rating, productId} = req.body

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
    }

    const product = await Product.findById(productId)
    const isReviewed = product.reviews.find(rev => rev.user.toString() === req.user._id.toString())

    if(isReviewed) {
           product.reviews.forEach(rev => {
            if(rev.user.toString() === rev.user_id.toString()) {
                res.rating = rating
                res.comment = comment
            }
           }) 

    } else {
        product.reviews.push(review)
        product.NumberOfReviews = product.reviews.length
    }

    let average = 0
    product.reviews.forEach(rev => average+=rev.rating)

    product.ratings = average/product.reviews.length
    product.save({validateBeforeSave: false})

    res.status(200).json({
        success: true,
        message: 'Review and Rated successfully'
    })
})


// get all reviews
exports.getAllReviews = catchAsyncError(async (req, res, next) => {

    const product = await Product.findById(req.query.productId)

    
    if(!product) {
        return next( new ErrorHandler('Product not found', 404))
    }

    res.status(200).json({
        success: true,
        reviews: product.reviews

    })

})


// delete review
exports.deleteReviews = catchAsyncError(async (req, res, next) => {

    const product = await Product.findById(req.query.productId)

    
    if(!product) {
        return next( new ErrorHandler('Product not found', 404))
    }

    const reviews = product.reviews.filter(rev => rev._id.toString() !== req.query.id.toString())

    let average = 0
   reviews.forEach(rev => average+=rev.rating)

   const ratings = average/reviews.length
   const NumberOfReviews = reviews.length
   
   await Product.findByIdAndUpdate( req.query.productId, {reviews, ratings, NumberOfReviews}, 
                                   {new: true, runValidators: true, useFindAndModify: false})

    res.status(200).json({
        success: true,
        message: 'Review deleted'

    })

})