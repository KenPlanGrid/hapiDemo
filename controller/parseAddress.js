const Joi = require('joi');
const parser = require('parse-address');

module.exports = (server) => ({
  method: 'POST',
  path: '/hello33',
  config: {
    handler: async (request, h) => {
      const parsedAddr = parser.parseLocation(request.payload.address);

      if (!parsedAddr.state || !parsedAddr.city || !parsedAddr.street || !parsedAddr.zip) return {
        // message: 'Cannot parse address'
        test: request.payload.address
      };

      const response = await server.inject({
        method: 'POST',
        url: '/mapboxer',
        payload: {
          parsedAddr
        },
      });

      console.log(response.payload);

      return parsedAddr;
    },
    validate: {
      payload: Joi.object({
        address: Joi.string().required(),
      }).unknown(),
    },
  },
});
