const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, 'Enter Porduct Name']
    },

    description: {
        type: String,
        required: [true, 'Enter Porduct Description']

    },

    price: {
        type: Number,
        required: [true, 'Enter Porduct Price'],
        maxLength: [6, 'Price Should Be Less Than 6 Numeric Digits']

    },

    ratings: {
        type: Number,
        default: 0
    },

    image: [
        {
            product_id: {
                type: String,
                required: true
            },

            url: {
                type: String,
                required: true
            }
        }
    ],

    category: {
        type: String,
        required: [true, 'Enter Product Category']
    },

    stock: {
        type: Number,
        required: [true, 'Stock Should Be Less Than 4 Numeric Digits'],
        default: 1
    },

    NumberOfReviews: {
        type: Number,
        defalut: 0
    },

    reviews: [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: "User",
                required: true
            },
            
            name: {
                type: String,
                required: true
            },

            rating: {
                type: Number,
                required: true
            },

            comment: {
                type: String,
                required: true
            }
        }
    ],

    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
   
})

module.exports = mongoose.model('Product', productSchema)