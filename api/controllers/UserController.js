/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	
};

show: function (req,res,next) {
	 User.findOne(req.param	('id'),function foundUser(err,user)
	 {
	 	if(err)	return next(err);
	 	if(!name) return next();
	 	res.view({
	 		name: user;
	 	})
	 })
}