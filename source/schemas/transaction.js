const Joi = require('joi');

module.exports = Joi.object().keys({
    type: Joi.string().min(5).max(15).required(),
    data: Joi.string().min(5).max(15).required(),
    cardId: Joi.number().integer().required(),
    sum: Joi.number().required(),
    id: Joi.number().integer(),
    time: Joi.string()
})
