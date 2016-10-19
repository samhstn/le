const Joi = require('joi');

module.exports = {
  headers: Joi.object({
    cookie: Joi.string().required()
  }).options({ allowUnknown: true })
}
