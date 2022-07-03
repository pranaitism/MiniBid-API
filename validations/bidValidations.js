const joi = require('joi');
const Joi = require('joi-oid')
const bidValidation = (data) => {
    const schemaValidation = joi.object({
        bidder:Joi.objectId().required(),
        bid_amount: joi.number().required().min(1).max(1000)
    })
    return schemaValidation.validate(data)
}

module.exports.bidValidation = bidValidation;
