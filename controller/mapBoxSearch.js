const MapboxClient = require('mapbox');

const client = new MapboxClient(process.env.MAPBOX);

const mapBoxSearch = (parsedAddr) => new Promise((resolve, reject) => {
  client.geocodeForward(`${parsedAddr.number} ${parsedAddr.street} ${parsedAddr.type} ${parsedAddr.city} ${parsedAddr.state} ${parsedAddr.zip}`, (err, data, res) => {
    console.log(parsedAddr);
    if (err) return reject(err);
    return resolve(res);
  });

});

const Joi = require('joi');
const parser = require('parse-address');

module.exports = {
  method: 'POST',
  path: '/mapboxer',
  config: {
    handler: async (request, h) => {
      const { parsedAddr } = request.payload;

      const mapboxResult = await mapBoxSearch(parsedAddr);
      console.log(mapboxResult.entity.features[0]);

      if (!parsedAddr.state || !parsedAddr.city || !parsedAddr.street || !parsedAddr.zip) return request.payload.address;

      return parsedAddr;
    },
    validate: {
      payload: Joi.object({
        address: Joi.string(),
        parsedAddr: Joi.object(),
      }).or('address', 'parsedAddr').unknown(),
    },
  },
};
