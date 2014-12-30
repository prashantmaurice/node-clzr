/**
* Coupon.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
 schema:true,
  attributes: {
  	name:{type:'string'
  		//required:true

  	},
  	 offer:{
      type:'string'
      //required:true
    },
  	
  	prereq: {
  		type:'string'
  		//required:true
  	},
  	v_id: {
  		type:'string'
  		//required:true
  	},
    visitcount:{
      type:'string',
      required:true
    },
    expiry:{
      type:'string',
      required:true
    }
    /*email:{
      type:'string',
      email:'true'
    }*/
}
};


