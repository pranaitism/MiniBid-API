const express = require('express')
const itemsRouter = express.Router()
const Item = require('../models/Item')
const verify = require('../verifyToken')

const {itemValidation}  = require('../validations/itemValidations')
const User = require("../models/User");

//Create Item using User id
itemsRouter.post('/create/:id',verify, async (req,res)=>{
    const {error} = itemValidation(req.body)
    if (error) {
        return res.status(400).send({message: error['details'][0]["message"]})
    }
    //Check if User exits
    const userExist = await User.findById(req.params.id)
    if(!userExist)
        return res.status(400).send({message: 'User id is incorrect'})

    //Item duplicate validation by title
    const item_id = await Item.findOne({title: req.body.title})
    if (item_id) {
            return res.status(400).send({message: 'Item title already exists'})
    }

    //add item
        const itemData = await new Item({
            title:req.body.title,
            condition:req.body.condition,
            description:req.body.description,
            expires_in:req.body.expires_in,
            owner:req.params.id
        })

    try{
        const itemToSave = await itemData.save()
        res.send(itemToSave)
    }catch (err) {
        res.send({message:err})
    }
})
itemsRouter.get('/',verify,async (req,res)=> {
    try {
        const items = await Item.find().limit(10)
        res.send(items)
    }catch (err) {
        res.status(404).send({message: err})
    }

})


// Get items that user created
itemsRouter.get('/:userId',verify,async (req,res)=> {
    try {
        const userItem = await Item.find({owner: req.params.userId}).limit(10)
        res.send(userItem)
    }catch (err) {
        res.status(404).send({message: err})
    }

})



module.exports = itemsRouter;
