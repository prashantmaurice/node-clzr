/**
* Vendor.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
schema:true,
  attributes: {
  	ID:{type:'string',
    required:true},
  	name:{type:'string',
  		required:true

  	},
  	 activeness:{
      type:'string',
      required:true
    },
  	
  	tags: {
  		type:'string',
  		required:true
  	},
  	address: {
  		type:'string',
  		required:true
  	},
    phoneno:{
      type:'string',
      required:true
    },
    rating:{
      type:'string',
      required:true
    },
    ratingcount:{
      type:'string',
      required:true
    },
    lat:{
      type:'string',
      required:true},
      lon:{
        type:'string',
        required:true
      }

    }


  
};

