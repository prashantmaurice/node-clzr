/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	create: function(req,res){
		res.view();
	},

	insert: function(req,res,next){
		User.create(req.params.all(),function(err,user){
			if(err) return next(err);
			res.view();
		});
	}
};

