const express = require('express')
const { 
    newOrder, 
    singleOrder, 
    myOrders,
    updateOrder,
    deleteOrder,
    getAllOrders
} = require('../controller/orderController')

const {isAuthenticatedUser, authorizeRoles} = require('../middleware/auth')

const router = express.Router()

router.route('/order/new').post(isAuthenticatedUser, newOrder)
router.route('/order/:id').get(isAuthenticatedUser, singleOrder)
router.route('/orders/me').get(isAuthenticatedUser, myOrders)
router.route('/admin/orders').get(isAuthenticatedUser, authorizeRoles('admin'), getAllOrders)

router.route('/admin/order/:id').put(isAuthenticatedUser, authorizeRoles('admin'), updateOrder)
                                .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteOrder)



module.exports = router