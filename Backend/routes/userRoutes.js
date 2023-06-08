const express = require('express')
const {
    registerUser, 
    loginUser, 
    userLogout, 
    forgotPassword, 
    resetPassword, 
    getUserDetails, 
    updateUserPassword,
    updateUserProfile,
    getAllUsers,
    getUser,
    updateUserRole,
    deleteUser
} = require('../controller/userController')

const {isAuthenticatedUser, authorizeRoles} = require('../middleware/auth')

const router = express.Router()

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/password/forgot').post(forgotPassword)
router.route('/password/reset/:token').put(resetPassword)
router.route('/me').get(isAuthenticatedUser,  getUserDetails)
router.route('/password/update').put(isAuthenticatedUser,  updateUserPassword)
router.route('/me/update').put(isAuthenticatedUser,  updateUserProfile)
router.route('/admin/users').get(isAuthenticatedUser, authorizeRoles('admin'), getAllUsers)

router.route('/admin/user/:id').get(isAuthenticatedUser, authorizeRoles('admin'), getUser)
                               .put(isAuthenticatedUser, authorizeRoles('admin'), updateUserRole)
                               .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteUser)
router.route('/logout').get(userLogout)

module.exports = router