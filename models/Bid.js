const mongoose = require('mongoose')
const {Schema} = require("mongoose");

const BidSchema = mongoose.Schema({
    bid_amount:{
        type:Number,
        required:true,
        min:1,
        max:2000
    },
    bidder: {
        type:Schema.Types.ObjectId, ref:'User',
        required: true
    }

})
module.exports = mongoose.model('bids', BidSchema)