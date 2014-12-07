/**
 * VendorController
 *
 * @description :: Server-side logic for managing vendors
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	'new':function(req,res){
		res.view();
	},
	create:function(req,res,next){
		Vendor.create(req.params.all(),function couponCreated(err,vendor){
			if(err) return next(err);
			res.json(vendor);
			res.redirect('/vendor/show/'+vendor.id);
		});
	},
	show:function(req,res,next){
		Vendor.findOne(req.param('id'),function foundCoupon(err,vendor){
			if(err)return next(err);
			if(!vendor)return next();
			res.view({
				vendor:vendor
			});
			
		});
	},
	index: function(req,res,next){
		Vendor.find(function foundCoupons(err,vendors){
			if(err) return next(err);
			res.view({
				vendors:vendors
			});
		});
	},
	edit: function(req,res,next){
		Vendor.findOne(req.param('id'),function foundCoupon(err,vendor){
			if(err)return next(err);
			if(!vendor)return next();
			res.view({
				vendor:vendor
			});
			
		});

	},
	update:function(req,res,next){
		Vendor.update(req.param('id'),req.params.all(),function userupdated(err){
			if(err){
				return res.redirect('/vendor/edit/'+req.param('id'));

			}
			res.redirect('/vendor/show/'+req.param('id'));
		});
	},
	destroy:function(req,res,next){
		Vendor.findOne(req.param('id'),function foundCoupon(err,vendor){
			if(err)return next(err);
			if(!vendor)return next('vendor doesnt exist.');
			Vendor.destroy(req.param('id'),function userdestroy(err){
				if(err) return next(err);
			});
			res.redirect('/vendor');
			
		});


	}


	
};

