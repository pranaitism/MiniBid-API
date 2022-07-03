const express = require('express')
const auctionRouter = express.Router()
const Auction = require('../models/Auction')
const Bid = require('../models/Bid')
const Item = require('../models/Item')
const verify = require('../verifyToken')
const moment = require('moment')
const {auctionValidation} = require("../validations/auctionValidations");
const User = require("../models/User");


// First Add item to auction
auctionRouter.post('/add', verify,async (req,res) => {
    const {error} = auctionValidation(req.body)
    if (error) {
        return res.status(400).send({message: error['details'][0]["message"]})
    }
    // Check if item exists in Auction
    const auctionItem_id = await Auction.findOne({item: req.body.item})
    if (auctionItem_id) {
        return res.status(400).send({message: 'Item is already in auction'})
    }

    // Check if item exists.Item has been created.
    const item_id = await Item.findOne({item: req.body.item})
    if (item_id === auctionItem_id) {
        return res.status(400).send({message: 'Please create item first'})
    }
    // Add item to Auction

    const auction =  new Auction({
        item : req.body.item,
        ends_at:moment.utc((req.body.ends_at).toLocaleString())
    //    https://stackoverflow.com/questions/8990595/dates-in-mongoose
    })

    try{
        const auctionItemToSave = auction.save()
        res.send({message:"Item id   " + req.body.item+ " has been added to the Auction"})
    }catch (err) {
        res.send({message:err})
    }
})

//Close auctions that have ended and update ends_at date to null
auctionRouter.get('/close', verify,async (req,res)=>{
    try {
        const closeAuction = await Auction.updateMany({ item_status: 'Open', ends_at: { $lt: Date.now() }},
            {$set: {auction_status: "Closed", ends_at:null}})
        res.send(closeAuction)
    }catch (err){
        console.log(err)
    }

})
// Get Active auctions
auctionRouter.get('/active', verify,async (req,res)=>{

    try{
    const getAuctions = await Auction.find({auction_status:"Open"},{bidding_history:0}).populate(
        [{path: 'bidding_history', model: Bid,
            populate:{path:"bidder", model: User, select:"username"}
        },
        {path:"item",model:Item, select:"title"},
            {path:"winning_bidder", model:User, select:"username"}]
    )
    res.send(getAuctions);
    }
    catch (err) {
        res.send({message:err})
    }

})

auctionRouter.get('/active/:id', verify,async (req,res)=>{

    const auctionID = req.params.id
    try{
        const getAuction = await Auction.findOne({_id:auctionID},
            { time_left_days:
                {
                    $dateDiff:
                        {
                            startDate: "$$NOW",
                            endDate: "$ends_at",
                            unit: "day"
                        },
                },
                time_left_hours:{
                    $dateDiff:
                        {
                            startDate: "$$NOW",
                            endDate: "$ends_at",
                            unit: "hour"
                        },
                },
                time_left_minutes:{
                    $dateDiff:
                        {
                            startDate: "$$NOW",
                            endDate: "$ends_at",
                            unit: "minute"
                        },
                }
    },
            {match:{auction_status:"Open"}}
        )
            .populate(
            [{path: 'bidding_history', model: Bid,
                populate:{path:"bidder", model: User, select:"username"}
            },
                {path:"item",model:Item, select:["title", "description"]},
                {path:"winning_bidder", model:User, select:"username"}]
        )
        res.send(getAuction);
    }
    catch (err) {
        res.send({message:err})
    }

})

auctionRouter.get('/sold', verify,async (req,res)=>{
    try{
    const endedAuctions = await Auction.find({auction_status:"Closed"}).populate(
        [{path: 'bidding_history', model: Bid,
            populate:{path:"bidder", model: User, select:"username"}
        },
            {path:"item",model:Item, select:"title"},
            {path:"winning_bidder", model:User, select:"username"}]
    )
        res.send(endedAuctions)
}
catch (err) {
    res.send({message:err})
}
})

auctionRouter.get('/sold/:id', verify,async (req,res)=>{
    try{
        const endedAuction = await Auction.find({auction_status:"Closed"}).populate(
            [{path: 'bidding_history', model: Bid,
                populate:{path:"bidder", model: User, select:"username"}
            },
                {path:"item",model:Item, select:"title"},
                {path:"winning_bidder", model:User, select:"username"}]
        )
        res.send(endedAuction)
    }
    catch (err) {
        res.send({message:err})
    }
})

module.exports = auctionRouter;