var should = require('should');
var app = require('../../../app');
var request = require('supertest');
var _ = require('underscore');

var server=request(app)
var settings = require('../../settings') 

var test_vendor_id = "55293297b6cd430f332841c4"

describe('Vendor', function() {
	var base_url='/v2/vendor'
	it('vendor details',function(done){
		server.get(base_url+'/details/get')
			.expect(200)
			.end(function(err,res){
				if(err) return done(err);
				should.exist(res.body._id)
			})
	})
	it('beacons of all vendors',function(done){
		server.get(base_url+'/beacons/all')
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

});