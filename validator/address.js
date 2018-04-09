const Boom = require('boom');
const Joi = require('joi');

const testScheme = Joi.object({
  address: Joi.string()
});

const validate = request => {
  Joi.validate(request, testScheme, (err, value) => {

  })
};
