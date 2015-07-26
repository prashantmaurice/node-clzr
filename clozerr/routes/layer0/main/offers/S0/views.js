var registry = global.registry;
var Q = require("q");
var _ = require("underscore");

var view_vendor_offers_offers_S0=function(params,user){
	
    var context = { params: params, user:user };
    return registry.getSharedObject("data_vendor").get(params).then(function(vendor) {
	    context.vendor = vendor;	
        return registry.getSharedObject("data_vendor_S0").get(params,vendor);
    
    }).then(function(vendor_offers){
		
        context.vendor_offers = vendor_offers;

		var predicate = registry.getSharedObject("handler_predicate_S0");
		var plist = [];

        _.each(vendor_offers.offers,function(element,index,array){
			plist.push(predicate.get(user,context.vendor,element))
		})
			
			return Q.all(plist);
            
    }).then(function(predlist){
				
		var offersplist=[];
		_.each(_.filter( context.vendor_offers.offers,
				function(val,idx){return predlist[idx]})
				,function(offer){
						// return offer;
					offersplist.push(registry.getSharedObject("qualify").getOfferDisplay(user,context.vendor,offer))
				});
		return Q.all(offersplist)
        
    });
}

var view_vendor_offers_checkin_S0 = function(params, user) {


    var context = {params:params, user:user};
	return registry.getSharedObject("data_vendor").get(params).then(function(vendor) {
		var offer_id = params.offer_id;

        context.vendor = vendor;
        return registry.getSharedObject("data_offer").get(params);

    }).then( function( offer ){ 
		/*var offerFromVendor = _.find( context.vendor.offers, function(offer) {
			return (offer._id == context.offer_id);
		});*/
        context.offer = offer;
		if( !offer ) {
			//TODO : throw error : request made with an offer id which is not an offer given by that particular vendor
            throw { code:311, description:"Offer does not exist" };
		}

		return registry.getSharedObject("handler_predicate_S0").get(user, vendor, offer)
        
    }).then(function(offer) {
		if( !offer )
            throw { err:301, description:"Offer not valid in this context"};

		return registry.getSharedObject("vendor_checkin_S0").get(params, user, context.vendor, context.offer).then(function(checkin) {
			return qualify.getCheckinOnCheckinDisplay(checkin);
		});	

	});

	
}

var view_vendor_offers_validate_S0 = function(params, user) {


    var context = {};
	return registry.getSharedObject("data_vendor").get(params).then(function(vendor) {
	    
        context.vendor = vendor;
        return registry.getSharedObject("data_checkin").get(params, user);
    
    }).then(function(checkin_obj) {

        context.checkin_obj = checkin_obj;
		return registry.getSharedObject("vendor_validate_S0").get(params,context.vendor,user,context.checkin_obj)

    }).then(function(checkin) {

		return qualify.getCheckinOnValidateDisplay(checkin);

	});

}

var view_vendor_offers_limitedtimeoffers = function(params, user) {
	var deferred = Q.defer();

	var offerList = [];
	debugger;

	registry.getSharedObject("data_vendors_withLimitedTimeOffers").get(params).then(function(arr_pre) {
		debugger;

		var arr_vendors = _.filter(arr_pre, function(element) {
			if(element.vendor) {
				return true;
			}
			else {
				return false;
			}
		});

		var arr_offers = _.filter(arr_pre, function(element) {
			if(element.offer) {
				return true;
			}
			else {
				return false;
			}
		});

		debugger;

		var arr_ret = _.map(arr_offers, function(obj) {
			var offer_disp = obj.offer;
			offer_disp.vendor = {};
			var vendor_raw = _.filter(arr_vendors, function(element) {
				debugger;
				return (element.vendor.offers.indexOf(offer_disp._id.toString()) != -1);
			})[0].vendor;

			offer_disp.vendor._id = vendor_raw._id;
			offer_disp.vendor.name = vendor_raw.name;

			return offer_disp;
		});

		/*for(key in allOffers) {
			for(offer in allOffers[key].offers) {
				var obj = {};

				//TODO : modify this obj for required view

				obj.vendor = allOffers[key].vendor;
				obj.offer = offer;
				offerList.push(obj);
			}
		}*/

		deferred.resolve(arr_ret);

	}, function(err) {
		deferred.resolve({code:500,error:err});
	});

	return deferred.promise;
}
function removeDuplicatesRewards(user,vendor_id){
    var valid = true;
    if(user.lucky_rewards.length==0)
        return true;
    for(var i=0;i<user.lucky_rewards.length;i++){
        if(user.lucky_rewards[i].id.equals(vendor_id))
            valid = false;
        if(i==user.lucky_rewards.length-1)
            return valid;
    }
}
function removeDuplicatesFailed(user,vendor_id){
    var valid = true;
    if(user.failed_instances.length==0)
        return true;
    for(var i=0;i<user.failed_instances.length;i++){
        if(user.failed_instances[i].id.equals(vendor_id))
           { if(Date.now()-user.failed_instances[i].time>1000*24*60*60)
             valid = true;
             else
             valid = false;
     }
        if(i==user.failed_instances.length-1)
            return valid;
    }
}
var view_vendor_lucky_checkin  = function(params,user){
    var deferred = Q.defer();
    var vendorObj = registry.getSharedObject("data_vendor");
    var valid ;
    debugger;
    if(!user.lucky_rewards)
    {
        user.lucky_rewards = [];
    }
    if(!user.failed_instances)
    {
        user.failed_instances = [];
    }
    vendorObj.get(params).then(function(vendor){
        if(!vendor.trials)
            vendor.trials = 0;
        debugger;
        if(removeDuplicatesFailed(user,vendor._id))
            {   debugger;
                if(removeDuplicatesRewards(user,vendor._id))
                {
                    if(vendor.trials%2==0)
                        {   debugger;
                            user.lucky_rewards.push({id:vendor._id,time:Date.now()});
                            vendor.trials++;
                            user.markModified("lucky_rewards");
                            user.save();
                            valid = true;
                            deferred.resolve(valid);
                        }
                        else
                        {
                            user.failed_instances.push({id:vendor._id,time:Date.now()});
                            vendor.trials++;
                            user.markModified("failed_instances");
                            user.save();
                            valid = false;
                            deferred.resolve(valid);
                        }
                        vendor.save();
                    }
                    else
                    {
                        deferred.resolve(false);
                    }
                }
                else
                {
                    deferred.resolve(false);
                }
            });
return deferred.promise;
}

registry.register("view_vendor_lucky_checkin",{get:view_vendor_lucky_checkin});
registry.register("view_vendor_offers_checkin_S0", {get:view_vendor_offers_checkin_S0});
registry.register("view_vendor_offers_validate_S0", {get:view_vendor_offers_validate_S0});
registry.register("view_vendor_offers_offers_S0", {get:view_vendor_offers_offers_S0});
registry.register("view_vendor_offers_offersPage_S0", {get:view_vendor_offers_offers_S0});
registry.register("view_vendor_offers_limited_time_offers", {get:view_vendor_offers_limitedtimeoffers});
