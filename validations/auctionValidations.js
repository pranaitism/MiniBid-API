const joi = require('joi').extend(require('@joi/date'))
const Joi = require('joi-oid')

const auctionValidation = (data) => {
    const schemaValidation = joi.object({
        item:Joi.objectId().required(),
        ends_at: joi.date().format(['YYYY/MM/DD', 'DD-MM-YYYY']).greater("now").max(Date.now() + 7 * 24 * 60 * 60 * 1000)
    })
    return schemaValidation.validate(data)
}

module.exports.auctionValidation = auctionValidation;
