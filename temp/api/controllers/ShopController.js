/**
 * ShopController
 *
 * @description :: Server-side logic for managing shops
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	
	'new':function (req,res){
		res.view();
	},
	create:function(req,res,next){
		Shop.create(req.params.all(),function couponCreated(err,shop){
			if(err) return next(err);
			res.json(shop);
			res.redirect('/shop/show/'+shop.id);
		});
	},

	
	show:function(req,res,next){
		Shop.findOne(req.param('id'),function foundCoupon(err,shop){
			if(err)return next(err);
			if(!shop)return next();
			res.view({
				shop:shop
			});
			
		});
	},
	index: function(req,res,next){
		Shop.find(function foundCoupons(err,shops){
			if(err) return next(err);
			res.view({
				shops:shops
			});
		});
	},
	edit: function(req,res,next){
		Shop.findOne(req.param('id'),function foundCoupon(err,shop){
			if(err)return next(err);
			if(!shop)return next();
			res.view({
				shop:shop
			});
			
		});

	},
	update:function(req,res,next){
		Shop.update(req.param('id'),req.params.all(),function userupdated(err){
			if(err){
				return res.redirect('/shop/edit/'+req.param('id'));

			}
			res.redirect('/shop/show/'+req.param('id'));
		});
	},
	destroy:function(req,res,next){
		Shop.findOne(req.param('id'),function foundCoupon(err,shop){
			if(err)return next(err);
			if(!shop)return next('vendor doesnt exist.');
			Shop.destroy(req.param('id'),function userdestroy(err){
				if(err) return next(err);
			});
			res.redirect('/shop');
			
		});


	}

};

