const express = require('express')
const bidRouter = express.Router()

const Bid = require('../models/Bid')
const Item = require('../models/Item')
const Auction = require('../models/Auction')
const User = require('../models/User')

const verify = require('../verifyToken')
const {bidValidation} = require('../validations/bidValidations')

bidRouter.post('/makeBid/:id', verify, async (req, res) => {
    //Bid Validation
    const {error} = bidValidation(req.body)
    if (error) {
        return res.status(400).send({message: error['details'][0]["message"]})
    }
    const paramsId = req.params.id
    //Validate if auction exists
    const findAuction = await Auction.findOne({_id:paramsId})
    if (!findAuction){
        return res.status(400).send('Auction doesnt exists')
    }

    // Validate if bidder exists
    const findUser = await User.findOne({_id:req.body.bidder})
    if(!findUser)
        return res.status(400).send('User doesnt exists')

    // validate auction bid on open auctions only
    const closedAuction = await Auction.findById({_id:paramsId})
    if(closedAuction["auction_status"]===("Closed"))
        return res.status(400).send("Auction is closed for biding")

    // Restrict item owners bidding for their items
    const itemOwner = await Auction.findById({_id:paramsId}).populate({path: 'item', model: Item})
    if (itemOwner["item"]["owner"].toString() === req.body.bidder){
        return res.status(400).send('Item owner can not bid for his/her item')
    }
    // users to bid higher amount
    const previousBid = await Bid.find({auction:paramsId})
    const amountToBid = req.body.bid_amount
    let isBidHigher;
    // Get the last bid
    if(previousBid.length !== 0) {
        isBidHigher = amountToBid > previousBid[previousBid.length - 1]["bid_amount"]
    }
    else{
        isBidHigher = true
    }
    if (!isBidHigher)
        return res.status(400).send("Your bid must by higher")

   //Create Bid
    const auctionItemBid = new Bid({
        bid_amount:req.body.bid_amount,
        bidder : req.body.bidder
    })
   //Save bid to auction using id
    const bid = await Auction.findByIdAndUpdate({_id:req.params.id},
        {$push:{bidding_history:auctionItemBid},$set: {winning_bidder:req.body.bidder} }
    )
    try{
        const itemBidToSave = auctionItemBid.save()
        res.send({ message: "Bid has been submitted"})
    }catch (err) {
        res.send({message:err})
    }
})

bidRouter.get('/', verify,async (req,res)=>{
    await Bid.aggregate([
        {
            '$lookup': {
                'from': 'users',
                'localField': 'bidder',
                'foreignField': '_id',
                'as': 'bidder'
            }
        }, {
            '$unwind': {
                'path': '$bidder'
            }
        }, {
            '$project': {
                '_id': 1,
                'bid_amount': 1,
                'auction':1,
                'bidder': '$bidder.username'
            }
        }
//https://stackoverflow.com/questions/59617836/nodejs-mongodb-return-a-json-response-from-aggregate-inside-a-get-request
    ]).then((result) => {
        res.send(result)
    })
        .catch((error) => {
            console.log(error);
        });

})


module.exports = bidRouter;
