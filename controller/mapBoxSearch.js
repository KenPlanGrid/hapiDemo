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
      const { features } = mapboxResult.entity;

      if (!parsedAddr.state || !parsedAddr.city || !parsedAddr.street || !parsedAddr.zip) return request.payload.address;

      const bestResult = features[0]
      const { relevance, place_name } = bestResult;
      return {
        result: {
          location: {
            relevance,
            place_name,
            latitude: features[0].center[1],
            longitude: features[0].center[0]
          }
        },
        message: "Mapbox: ",
      }

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
