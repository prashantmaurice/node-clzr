var should = require('should');
var app = require('../app');
var request = require('supertest');
var _ = require('underscore');

var server=request(app)
var settings = require('../routes/settings') 

var test_vendor_id = "55293297b6cd430f332841c4"
var test_access_token = "4dd2cee48ddecfd9ae6e6a120d410c97"
var test_vendor_access_token = "7f8437926c5c901489a1f88031f1ea14"
var test_lat = 13.1
var test_lon = 80.1

var models=require('../routes/models')
//usage >mocha test/imp_tests.js
//tbc = to be changed
/*
Skeleton test
describe('(url to be tested)',function(){
	it('(info)',function(done){
		var params={}
		console.log('params : '+JSON.stringify(params))
		server.get('(url)')
		.query(params)
		.expect(200)
		.end(function(err,res){
			if(err) return done(err);
			done();
		})
	})
})
*/
should.Assertion.add('Vendor',
	function(){
		this.params={operator:'to be a valid vendor object'};
		var vendor=this.obj
		should.exist(vendor)
		vendor.should.have.property('_id')
		vendor.should.have.property('name')
	},
	true)
should.Assertion.add('Category',
	function(){
		this.params={operator:'to be a valid category object'};
		var category=this.obj
		should.exist(category)
		category.should.have.property('image')
		category.should.have.property('name')
	},
	true)
should.Assertion.add('Checkin',
	function(){
		this.params={operator:'to be a valid checkin object'};
		var checkin=this.obj
		should.exist(checkin)
		checkin.should.have.property('_id')
		checkin.should.have.property('pin')
		checkin.should.have.property('state')
		checkin.should.have.property('offer')
		checkin.should.have.property('user')
		checkin.should.have.property('vendor')
	},
	true)
describe('URLs currently used by android app test',function(){
	describe('/content',function(){
		it('to be tested',function(){
		})
	})
	describe('/v2/vendor/beacons/all',function(){
		it('list of beacons with vendor',function(done){
			var params={}
			console.log('params : '+JSON.stringify(params))
			server.get('/v2/vendor/beacons/all')
			.query(params)
			.expect(200)
			.end(function(err,res){
				if(err) return done(err);
				should.exist(res.body.UUID);
				should.exist(res.body.vendors);
				res.body.should.be.instanceof.Array;
				_.forEach(res.body.vendors,function(vendor){
					vendor.should.be.a.Vendor;
					if(vendor.beacons){
						vendor.beacons.should.have.property('major');
						vendor.beacons.should.have.property('minor');
					}
					if(vendor.location){
						vendor.location.should.be.instanceof(Array).and.have.lengthOf(2)
					}
				})
				done();
			})
		})
	})
	describe('/v2/vendor/categories/get',function(){
		it('list of categories (tbc)',function(done){
			var params={}
			console.log('params : '+JSON.stringify(params))
			server.get('/v2/vendor/categories/get')
			.query(params)
			.expect(200)
			.end(function(err,res){
				if(err) return done(err);
				res.body.should.be.instanceof(Array)
				_.each(res.body,function(category){
					category.should.be.a.Category;
				})
				res.body.should.have.lengthOf(settings.categories.length)
				done()
			})
		})
	})
	describe('/v2/vendor/search/near',function(){
		it('search with just lat/long',function(done){
			var params={
				access_token:test_access_token,
				latitude:test_lat,
				longitude:test_lon
			}
			console.log('params : '+JSON.stringify(params))
			server.get('/v2/vendor/search/near')
			.query(params)
			.expect(200)
			.end(function(err,res){
				if(err) return done(err);
				res.body.should.be.instanceof(Array)
				_.every(res.body, function(vendor, index, array) {
					vendor.should.be.a.Vendor;
					vendor.should.have.property('distance')
				  	if(index != 0)
				  		vendor.distance.should.not.be.below(array[index-1].distance-0.5)
				});
				done();
			})
		})
		it('search with name',function(done){
			//do more sophisticated check for name validity
			var test_name='c'
			var params={
				access_token:test_access_token,
				latitude:test_lat,
				longitude:test_lon,
				name:test_name
			}
			console.log('params : '+JSON.stringify(params))
			server.get('/v2/vendor/search/near')
			.query(params)
			.expect(200)
			.end(function(err,res){
				if(err) return done(err);
				res.body.should.be.instanceof(Array)
				_.each(res.body, function(vendor, index, array) {
					vendor.should.be.a.Vendor;
					vendor.should.have.property('distance')
				  	if(index != 0)
				  		vendor.distance.should.not.be.below(array[index-1].distance-0.5)
				  	if(vendor.name.indexOf('c')==-1)
				  		vendor.name.indexOf('C').should.not.be.equal(-1)
				  	else
				  		vendor.name.indexOf('c').should.not.be.equal(-1)
				});
				done();
			})
		})
		it('search by category',function(done){
			var test_category='Food'
			var params={
				access_token:test_access_token,
				latitude:test_lat,
				longitude:test_lon,
				category:test_category
			}
			console.log('params : '+JSON.stringify(params))
			server.get('/v2/vendor/search/near')
			.query(params)
			.expect(200)
			.end(function(err,res){
				if(err) return done(err);
				res.body.should.be.instanceof(Array)
				var all_done=_.after(res.body.length,done)
				_.each(res.body, function(vendor, index, array) {
					vendor.should.be.a.Vendor;
					vendor.should.have.property('distance')
				  	if(index != 0)
				  		vendor.distance.should.not.be.below(array[index-1].distance-0.5)
				  	server.get('/v2/vendor/details/get')
				  	.query({
				  		access_token:params.access_token,
				  		vendor_id:vendor._id
				  	})
				  	.expect(200)
				  	.end(function(err,res){
				  		if(err) return done(err);
				  		res.body.should.be.a.Vendor;
				  		res.body.should.have.property('category')
				  		res.body.category.should.equal(test_category)
				  		all_done();
				  	})
				});
			})
		})
		it('search by tags : to be tested',function(){

		})
	})
	describe('/v2/vendor/offers/checkin',function(){
		var Checkin=models.Checkin;
		it('S0 limitedCustomers checkin (WIP)',function(done){
			// var test_offer_id="55293299b6cd430f332841c7"
			// var params={
			// 	access_token:test_access_token,
			// 	vendor_id:test_vendor_id,
			// 	offer_id:test_offer_id
			// }
			// console.log('params : '+JSON.stringify(params))
			// server.get('/v2/vendor/offers/checkin')
			// .query(params)
			// .expect(200)
			// .end(function(err,res){
			// 	if(err) return done(err);
			// 	res.body.should.be.a.Checkin;
			// 	console.log(res.body)
			// 	Checkin.findByIdAndRemove(res.body._id).exec()
			// 	done();
			// })
		})
	})
})