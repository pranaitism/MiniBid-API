const joi = require('joi').extend(require('@joi/date'));
const itemValidation = (data) => {
    const schemaValidation = joi.object({
        title: joi.string().required().min(3).max(40),
        condition: joi.string().valid("New", "Old", "Refurbished").required().min(3).max(4),
        description: joi.string().required().min(10)  .max(500)
    })
    return schemaValidation.validate(data)
}

module.exports.itemValidation = itemValidation;
