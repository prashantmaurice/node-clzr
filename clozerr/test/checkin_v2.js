var should = require('should');
var app = require('../app');
var request = require('supertest');
var _ = require('underscore');

var server=request(app)
var settings = require('../routes/settings') 

var test_vendor_id = "55293297b6cd430f332841c4"
var test_access_token = "4dd2cee48ddecfd9ae6e6a120d410c97"
var test_user_id = "54b0468f50031f7324569260"
var test_vendor_access_token = "7f8437926c5c901489a1f88031f1ea14"
var test_offer_id = "55293299b6cd430f332841c7"

var CHECKIN_STATE_ACTIVE = 0;
var CHECKIN_STATE_CONFIRMED = 1;
var CHECKIN_STATE_CANCELLED = 2;
var models=require('../routes/models')
var Checkin=models.CheckIn;
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

describe("Test checkin flow",function(){
	describe('vendor validated',function(){
		var checkin_id
		it('checkin creation : /v2/offers/checkin/create',function(done){
			var params={
				access_token:test_access_token,
				vendor_id:test_vendor_id,
				offer_id:test_offer_id
			}
			console.log('params : '+JSON.stringify(params))
			server.get('/v2/offers/checkin/create')
			.query(params)
			.expect(200)
			.end(function(err,res){
				if(err) return done(err);
				res.body.should.be.a.Checkin;
				checkin_id=res.body._id;
				console.log(res);
				Checkin.findById(checkin_id,function(err,checkin){
					if(err) done(err);
					checkin.state.should.equal(CHECKIN_STATE_ACTIVE)
					done();
				})
			})
		})
		it('checkin validation by vendor : /v2/offers/checkin/validate',function(done){
			var params={
				access_token:test_vendor_access_token,
				vendor_id:test_vendor_id,
				checkin_id:checkin_id
			}
			console.log('params : '+JSON.stringify(params))
			server.get('/v2/offers/checkin/validate')
			.query(params)
			.expect(200)
			.end(function(err,res){
				if(err) return done(err);
				res.body.should.be.a.Checkin;
				res.body._id.should.be.equal(checkin_id)
				console.log(res)
				Checkin.findById(checkin_id,function(err,checkin){
					if(err) done(err);
					checkin.state.should.equal(CHECKIN_STATE_CONFIRMED)
					checkin.remove()
					done();
				})
			})
		})
	})
	describe('qrcode validated',function(){
		var checkin_id
		it('checkin creation : /v2/offers/checkin/create',function(done){
			var params={
				access_token:test_access_token,
				vendor_id:test_vendor_id,
				offer_id:test_offer_id
			}
			console.log('params : '+JSON.stringify(params))
			server.get('/v2/offers/checkin/create')
			.query(params)
			.expect(200)
			.end(function(err,res){
				if(err) return done(err);
				res.body.should.be.a.Checkin;
				checkin_id=res.body._id;
				Checkin.findById(checkin_id,function(err,checkin){
					if(err) done(err);
					checkin.state.should.equal(CHECKIN_STATE_ACTIVE)
					done();
				})
			})
		})
		it('checkin validation by qrcode : /v2/offers/checkin/qrcodevalidate',function(done){
			var params={
				access_token:test_access_token,
				vendor_id:test_vendor_id,
				checkin_id:checkin_id,
				qrcode:"26c5c901489a1f880"
			}
			console.log('params : '+JSON.stringify(params))
			server.get('/v2/offers/checkin/qrcodevalidate')
			.query(params)
			.expect(200)
			.end(function(err,res){
				if(err) return done(err);
				res.body.should.be.a.Checkin;
				res.body._id.should.be.equal(checkin_id)
				Checkin.findById(checkin_id,function(err,checkin){
					if(err) done(err);
					checkin.state.should.equal(CHECKIN_STATE_CONFIRMED)
					checkin.remove();
					done();
				})
			})
		})
	})
})