const debug = require('debug')('hapi')

const Hapi = require('hapi');
const path = require('path');
const Joi = require('joi');


debug('boot', 'test');

const server = Hapi.server({
  host: 'localhost',
  port: 8000,
  routes: {
    validate: {
      failAction: async (request, h, err) => {
        throw err;
      }
    }
  },
});

const dbUrl = 'mongodb://localhost:27017/hapi-app';

server.route({
  method: 'POST',
  path: '/hello',
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
})

async function start() {
  try {
    await server.start();
  } catch (err) {
    console.log(err)
    process.exit(1);
  }

  debug('Server running at: %o', server.info.uri);
}

start();
