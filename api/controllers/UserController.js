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
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.write('<h1>Successfully inserted user '+user.name+'</h1><br><a href="/user"> Go Back</a>');
			res.end();
		});
	}
};

