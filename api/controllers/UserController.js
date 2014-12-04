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
			res.view({
				user:user
			});
		});
	},
	show: function (req,res,next) {
	 console.log(req.param('id'));
	 //res.end();
	 User.findOne(req.param	('id'),function foundUser(err,user)
	 {
	 	if(err)	return next(err);
	 	if(!user) return next();
	 		console.log(user.name);
	 	res.view({
	 		user: user
	 	});
	 //res.json(user);
	 });
	},

	index:function(req,res,next)
	{
		User.find(function foundUser(err,users){
		if(err) return next(err);
		res.json(users);
		res.view({
		users:users
	});
	});
	}

};

