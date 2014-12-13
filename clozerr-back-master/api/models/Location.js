/**
* Location.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  
  	 longitude: {
            type: 'float',
            required: true
        },
        latitude: {
            type: 'float'
        },
        country: {
            type: 'string'
        },
        city: {
            type: 'string'
        },
        stateCode: {
            type: 'string'
        },
        zipcode: {
            type: 'string'
        },
        streetName: {
            type: 'string'
        },
        streetNumber: {
            type: 'string'
        },
        c_id:
        {
        	type:'string'
        }

  }
};

