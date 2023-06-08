const express = require('express')
const { 
    getAllproduct, 
    createProduct, 
    updateProduct, 
    deleteProduct, 
    getSingleProduct, 
    productReview, 
    getAllReviews,
    deleteReviews
} = require('../controller/productController')

const {isAuthenticatedUser, authorizeRoles} = require('../middleware/auth')

const router = express.Router()

router.get('/products', getAllproduct)
router.route('/admin/product/new').post(isAuthenticatedUser, authorizeRoles('admin'), createProduct)
router.route('/admin/product/:id').put(isAuthenticatedUser, authorizeRoles('admin'), updateProduct)
                                  .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteProduct)

router.route('/product/:id').get(getSingleProduct)
router.route('/product/review').put(isAuthenticatedUser, productReview)
router.route('/reviews').get(getAllReviews).delete(isAuthenticatedUser, deleteReviews)


module.exports = router 

