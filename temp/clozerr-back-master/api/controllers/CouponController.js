/**
 * CouponController
 *
 * @description :: Server-side logic for managing coupons
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	'new':function(req,res){
		res.view();
	},
	create:function(req,res,next){
		Coupon.create(req.params.all(),function couponCreated(err,coupon){
			if(err) return next(err);
			res.json(coupon);
		})
	},
	show:function(req,res,next){
		Coupon.findOne(req.param('id'),function foundCoupon(err,coupon){
			if(err)return next(err);
			if(!coupon)return next();
			res.view({
				coupon:coupon
			});
			
		});
	},
	index: function(req,res,next){
		Coupon.find(function foundCoupons(err,coupons){
			if(err) return next(err);
			res.view({
				coupons:coupons
			});
		});
	},
	edit: function(req,res,next){
		Coupon.findOne(req.param('id'),function foundCoupon(err,coupon){
			if(err)return next(err);
			if(!coupon)return next();
			res.view({
				coupon:coupon
			});
			
		});

	},
	update:function(req,res,next){
		Coupon.update(req.param('id'),req.params.all(),function userupdated(err){
			if(err){
				return res.redirect('/coupon/edit/'+req.param('id'));

			}
			res.redirect('/coupon/show/'+req.param('id'));
		});
	},
	destroy:function(req,res,next){
		Coupon.findOne(req.param('id'),function foundCoupon(err,coupon){
			if(err)return next(err);
			if(!coupon)return next('coupon doesnt exist.');
			Coupon.destroy(req.param('id'),function userdestroy(err){
				if(err) return next(err);
			});
			res.redirect('/coupon');
			
		});


	
}
};

