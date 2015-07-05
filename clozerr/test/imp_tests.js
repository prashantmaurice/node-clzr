var should = require('should');
var app = require('../app');
var request = require('supertest');
var _ = require('underscore');

var server=request(app)
var settings = require('../routes/settings') 

var test_vendor_id = "55293297b6cd430f332841c4"
var test_access_token = "4dd2cee48ddecfd9ae6e6a120d410c97"
var test_vendor_access_token = "7f8437926c5c901489a1f88031f1ea14"

//usage >mocha test/imp_tests.js

describe('URLs currently used by android app test',function(){
	it('/content',function(){
		console.log('to test')
	})
	it('/v2/vendor/beacons/all : list of beacons with vendor',function(done){
		server.get('/v2/vendor/beacons/all')
		.expect(200)
		.end(function(err,res){
			if(err) return done(err);
			should.exist(res.body.UUID);
			should.exist(res.body.vendors);
			res.body.should.be.instanceof.Array;
			_.forEach(res.body.vendors,function(vendor){
				vendor.should.have.property('_id');
				vendor.should.have.property('name');
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