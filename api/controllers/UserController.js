/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	'new':function (req,res){
		res.view();
	},
	create:function(req,res,next){
		User.create(req.params.all(),function couponCreated(err,user){
			if(err) return next(err);
			res.json(user);
			res.redirect('/user/show/'+user.id);
		});
	},

	
	show:function(req,res,next){
		User.findOne(req.param('id'),function foundCoupon(err,user){
			if(err)return next(err);
			if(!user)return next();
			res.view({
				user:user
			});
			
		});
	},
	index: function(req,res,next){
		User.find(function foundCoupons(err,users){
			if(err) return next(err);
			res.view({
				users:users
			});
		});
	},
	edit: function(req,res,next){
		User.findOne(req.param('id'),function foundCoupon(err,user){
			if(err)return next(err);
			if(!user)return next();
			res.view({
				user:user
			});
			
		});

	},
	update:function(req,res,next){
		User.update(req.param('id'),req.params.all(),function userupdated(err){
			if(err){
				return res.redirect('/user/edit/'+req.param('id'));

			}
			res.redirect('/user/show/'+req.param('id'));
		});
	},
	destroy:function(req,res,next){
		User.findOne(req.param('id'),function foundCoupon(err,user){
			if(err)return next(err);
			if(!user)return next('vendor doesnt exist.');
			User.destroy(req.param('id'),function userdestroy(err){
				if(err) return next(err);
			});
			res.redirect('/user');
			
		});


	}

	
};

