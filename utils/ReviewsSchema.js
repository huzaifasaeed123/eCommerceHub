const Joi = require('joi');
module.exports=Joi.object({
    comment: Joi.string()
    .min(3)
    .max(100)
    .required(),
    rating: Joi.number()
    .min(1)
    .max(5)
    .required(),
});