const dotenv = require('dotenv')
const app = require('./app')
const connectDatabase = require('./config/database')

// handling uncaught error
process.on('uncaughtException', (error) => {
    console.log('Error', error.message)
    console.log('server is shutting down because of  uncaught error')
    process.exit(1)

})

/* configure env */
dotenv.config({
    path: 'Backend/config/config.env'
})

connectDatabase() 

server = app.listen(process.env.Port, () => {
    console.log(`backend is running on server ${process.env.Port}`)
})

// unhandled promise rejection
process.on('unhandledRejection', (error) => {
    console.log('Error', error.message)
    console.log('server is shutting down because of unhandled promise rejection')

    server.close(() => {
        process.exit(1)
    })

})
