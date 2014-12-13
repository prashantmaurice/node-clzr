/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  schema:true,
  attributes: {
  	name:{
  		type:'string',
  		required:true
  	},
  	phoneno:{
  		type:'string',
  		required:true
  	},
  	email:{
  		type:'string',
  		email:true,
  		required:true,
  		unique:true
  	},
    password:{
    	type:'string',
    	required:true
    }
   // visits:
    //{
      //[v_id:{type:'string'},count:{type:'INTEGER',default:0}]
   // }
   

  }
};

