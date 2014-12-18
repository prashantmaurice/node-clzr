/**
 * LocationController
 *
 * @description :: Server-side logic for managing locations
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	'new':function(req,res){
		res.view();
	},
	create:function(req,res,next){
		Location.create(req.params.all(),function couponCreated(err,location){
			if(err) return next(err);
			res.json(location);
			res.redirect('/location/show/'+location.id);
		});
	},
	show:function(req,res,next){
		Location.findOne(req.param('id'),function foundCoupon(err,location){
			if(err)return next(err);
			if(!location)return next();
			res.view({
				location:location
			});
			
		});
	},
	edit: function(req,res,next){
		Location.findOne(req.param('id'),function foundCoupon(err,location){
			if(err)return next(err);
			if(!location)return next();
			res.view({
				location:location
			});
			
		});

	},
	update:function(req,res,next){
		Location.update(req.param('id'),req.params.all(),function userupdated(err){
			if(err){
				return res.redirect('/location/edit/'+req.param('id'));

			}
			res.redirect('/location/show/'+req.param('id'));
		});
	},
	destroy:function(req,res,next){
		Location.findOne(req.param('id'),function foundCoupon(err,location){
			if(err)return next(err);
			if(!location)return next('location doesnt exist.');
			Location.destroy(req.param('id'),function userdestroy(err){
				if(err) return next(err);
			});
			res.redirect('/location');
			
		});
	},
	index: function(req,res,next){
		Location.find(function foundCoupons(err,locations){
			if(err) return next(err);
			res.view({
				locations:locations
			});
		});
	},
    'locate': function(req, res, next)
    {
            var params = {
            longitude: loc.longitude,
            latitude: loc.latitude
        }
        ,query = {}
        Event.native(req.params.all(),function(err, collection)
        {
            collection.find(
                query.coordinates =
                {
                    $near: 
                    {
                        $geometry: 
                        {
                            type: 'Point',
                            coordinates: [params.longitude, params.latitude]
                        },
                        $maxDistance: 16093.4 // 10 miles in meters
                    }
                }
            );
            res.json(event);
            Event.find().paginate({page: 1, limit: 2});
            res.view(
            {
				location:location
			});
             

            Event.toArray(function(err, event)
            {
                if(err) return next(err);
                res.status(201);
                res.json(params + event);
             });
        });
    }
}




