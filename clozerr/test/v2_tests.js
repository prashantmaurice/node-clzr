var should = require('should');
var app = require('../app');
var request = require('supertest');
var _ = require('underscore');

var server=request(app)
var settings = require('../routes/settings') 

var test_vendor_id = "55293297b6cd430f332841c4"
var test_access_token = "4dd2cee48ddecfd9ae6e6a120d410c97"
var test_vendor_access_token = "7f8437926c5c901489a1f88031f1ea14"

// TO TEST
// have errors:
// vendor/offersPage
// vendor/homepage
//
describe('Vendor', function() {
	var base_url='/v2/vendor'
	it('vendor details',function(done){
		server.get(base_url+'/details/get')
			.query({access_token : test_access_token,
				vendor_id:test_vendor_id})
			.expect(200)
			.end(function(err,res){
				if(err) return done(err);
				res.body.should.have.property('_id');
				res.body.should.have.property('name');
				res.body.should.have.property('fid');
				res.body.should.have.property('location');
				done();
			})
	})
	it('vendor details set (simple)',function(done){
		server.get(base_url+'/details/set')
			.query({access_token: test_vendor_access_token,
				vendor_id:test_vendor_id,
				'vendor[address]': 'testAddress'})
			.expect(200)
			.end(function(err,res){
				if(err) return done(err);
				res.body.should.have.property('address','testAddress')
				server.get(base_url+'/details/set')
				.query({access_token: test_vendor_access_token,
					vendor_id:test_vendor_id,
					'vendor[address]': 'anotherTestAddress'})
				.expect(200)
				.end(function(err,res){
					if(err) return done(err);
					res.body.should.have.property('address','anotherTestAddress')
					done();
				})
			})
	})
	it('vendor details set check authorization',function(done){
		server.get(base_url+'/details/set')
			.query({access_token: test_access_token,
				vendor_id:test_vendor_id,
				'vendor[address]': 'testAddress'})
			.expect(909)
			.end(function(err,res){
				if(err) return done(err);
				done();
			})
	})
	it('vendor details update (array add+remove)',function(done){
		var qrcode1='26c5c901489a1f880',qrcode2='26c5c901332h22380';
		server.get(base_url+'/details/update')
			.query({access_token: test_vendor_access_token,
				vendor_id:test_vendor_id,
				modify:'qrcodes',
				operation:'add',
				'values[0]':qrcode1,
				'values[1]':qrcode2})
			.expect(200)
			.end(function(err,res){
				if(err) return done(err);
				res.body.should.have.property('qrcodes')
				res.body.qrcodes.should.be.instanceof(Array)
				res.body.qrcodes.should.containDeep([qrcode1,qrcode2])
				server.get(base_url+'/details/update')
				.query({access_token: test_vendor_access_token,
					vendor_id:test_vendor_id,
					modify:'qrcodes',
					operation:'remove',
					'values[0]':qrcode1,
					'values[1]':qrcode2})
				.expect(200)
				.end(function(err,res){
					if(err) return done(err);
					res.body.should.have.property('qrcodes')
					res.body.qrcodes.should.be.instanceof(Array)
					res.body.qrcodes.should.not.containDeep([qrcode1,qrcode2])
					done();
				})
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

describe('Category',function(){
	var base_url='/v2/category'
	it('category list',function(done){
		server.get(base_url+'/list')
			.expect(200)
			.end(function(err,res){
				if(err) return done(err);
				res.body.should.be.instanceof(Array)
				_.each(res.body,function(category){
					category.should.have.property('name')
					category.should.have.property('image')
				})
				res.body.should.have.lengthOf(settings.categories.length)
				done()
			})
	})
})