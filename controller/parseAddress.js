const Joi = require('joi');

module.exports = {
  method: 'POST',
  path: '/hello33',
  config: {
    handler: (request, h) => {
      return 'hello world';
    },
    validate: {
      payload: Joi.object({
        delivery_line_1: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().required(),
        zipcode: Joi.string().required(),
        product_type: Joi.string(),
        mortgage_balance: Joi.number().min(0).max(50000000),
        property_use: Joi.string(),
        webhook: Joi.string(),
      }).unknown(),
    },
  },
};
