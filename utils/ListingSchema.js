const Joi = require('joi');

module.exports= Joi.object({
    title:Joi.string()
    .min(3)
    .max(30)
    .required(),
    description:Joi.string()
    .min(10)
    .max(1000)
    .required(),
    price: Joi.number()
    .integer()
    .min(0)
    .max(100000)
    .required(),
    location: Joi.string()
    .min(5)
    .max(50)
    .required(),
    country: Joi.string()
    .min(2)
    .max(30)
    .required(),
    image: Joi.string().allow("",null),

});
