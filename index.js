const debug = require('debug')('hapi')

const Hapi = require('hapi');
const path = require('path');
const Joi = require('joi');
const mongoose = require('mongoose');
const createToken = require('./util/token');

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

const people = { // our "users database"
    1: {
      id: 1,
      name: 'Jen Jones'
    }
};

server.route(require('./controller/parseAddress'));

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

const user = {
  id: 1,
  username: 'Jen',
}

const test = createToken(user);
console.log(test);


const validate = async (decoded, request) => {
  console.log(decoded);
  if (!people[decoded.id]) {
    return { isValid: false };
  } else {
    return { isValid: true };
  }
}

async function start() {
  try {
    await server.register(require('hapi-auth-jwt2'));


    server.auth.strategy('jwt', 'jwt',
    { key: 'youcanttellmewhattodo',          // Never Share your secret key
      validate: validate,            // validate function defined above
      verifyOptions: { algorithms: [ 'HS256' ] } // pick a strong algorithm
    });

    // server.auth.default('jwt');

    server.route({
      method: 'GET',
      path: '/hello',
      config: {
        auth: 'jwt',
        handler: (request, h) => {
          return 'hello world';
        },
      },
    });

    await server.start((err) => {
      if (err) throw err;

      mongoose.connect(dbUrl, {}, (err) => {
        if (err) {
          throw err;
        }
      });
    });
  } catch (err) {
    console.log(err)
    process.exit(1);
  }

  debug('Server running at: %o', server.info.uri);
}

start();
