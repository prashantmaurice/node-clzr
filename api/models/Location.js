/**
* Location.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  

    loc:{
        index: '2d',
        longitude: {
            type: 'float',
            required: true
        },
        latitude: {
            type: 'float',
            required:true
        }
    },
    c_id:
    {
       	type:'string'
    }

  }
};