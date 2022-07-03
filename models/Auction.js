const mongoose = require('mongoose')
const {Schema} = require("mongoose");
const AuctionSchema = mongoose.Schema({
    item: {
        type: Schema.Types.ObjectId, ref: 'Item'
    },
    auction_status: {
        type: String,
        default:"Open"
    },
    // https://stackoverflow.com/questions/29899208/mongoose-date-field-set-default-to-date-now-n-days
    ends_at: {
        type: Date,
        min:Date.now(),
        max: () => Date.now() + 7*24*60*60*1000,
        default: ()=> Date.now() + 3*24*60*60*1000,
    },
    winning_bidder:
    {type: Schema.Types.ObjectId, ref: 'User'},
    bidding_history: [{type: Schema.Types.ObjectId, ref: 'Bid'}]
})

module.exports = mongoose.model('auctions', AuctionSchema)
