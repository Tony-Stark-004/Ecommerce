const mongoose = require('mongoose')

const connectDatabase = () => {
    mongoose.connect(process.env.DB_URL_Localhost,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    ).then((data) => console.log(`mongoDB server connected successfully on ${data.connection.host}`))
         .catch((error) => console.log(`error occured while connecting mongoDB: ${error.message}`))
}

module.exports = connectDatabase
