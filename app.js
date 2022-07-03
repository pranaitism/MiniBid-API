const express = require('express')
const app = express()
const mongoose = require('mongoose')
const morgan = require('morgan')
const bodyParser = require('body-parser')
require('dotenv/config')

// 2. Middleware

//Logging
app.use(morgan('dev'))
app.use(bodyParser.json())
// Routes
const authRoute = require('./routes/auth')
const itemRoute = require('./routes/item')
const auctionRoute = require('./routes/auction')
const bidRoute = require('./routes/bid')

app.use('/api/users', authRoute)
app.use('/api/items', itemRoute)
app.use('/api/auctions', auctionRoute)
app.use('/api/bids', bidRoute)

mongoose.connect(process.env.DB_CONNECTOR, () => {
    console.log('Your mongoDB connector is on...')
})


// 4  Start the server
app.listen(3000, ()=> {
    console.log('Server is up and running..')
} )