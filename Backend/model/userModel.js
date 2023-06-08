const mongoose = require('mongoose')
const validator = require('validator')
const bcrpt = require('bcrypt')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name'],
        maxLength: [30, 'Name can\'t exceed 30 characters'],
        minLength: [4, 'Name should have more than 4 characters']
    },

    email: {
        type: String,
        required: [true, 'Please enter your Email'],
        unique: true,
        validator: [validator.isEmail, 'Please enter valid email'],
    },

    password: {
        type: String,
        required: [true, 'Please enter your password'],
        minLength: [8, 'Password should have more than 8 characters'],
        select: false
    }, 

    avatar: {
        public_id: {
            type: String,
            required: true
        },

        url: {
            type: String,
            required: true
        }
    },

    role: {
        type: String,
        default: 'user'
    },

    resetPasswordToken: String,
    resetPasswordExpire: Date

})

// hashing password
userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) {
        next()
    }

    this.password = await bcrpt.hash(this.password, 10)
})

// jwt token generation
userSchema.methods.getJwtToken = function() {
    return jwt.sign({id: this._id}, process.env.Jwt_SecretKey, {
        expiresIn: process.env.Jwt_Expires
    })
}

// compare password
userSchema.methods.comparePassword = async function(enteredPassword) {
       return await bcrpt.compare(enteredPassword, this.password)
}


// generating password reset token
userSchema.methods.getResetPasswordToken = function() {
    // generating token
    const resetToken = crypto.randomBytes(20).toString('hex')

    // hasing and adding resetPasswordToken to userSchema
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    this.resetPasswordExpire = Date.now() + 15*60*1000

    return resetToken

}

module.exports = mongoose.model('User', userSchema)



