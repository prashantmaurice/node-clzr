module.exports = {
	"auth":{
		"facebook":{
			"app_token":"643340145745435|nyelclS2lAU75ksOpYtfOLNtwOg"
		},
		"google":{
			"app_id":"496568600186-q67jdokmmuofba4updq7v8kl9j4niaoe.apps.googleusercontent.com",
		},
		"password":{
			"default":"password"
		}
	},
	"db":{
		"mongo":{ "host":"db.clozerr.com", "port":"27107", "name":"fin4", "username":"mongoadmin", "password":"clozerradmin"}
	},
	"s3":{
		"access_key":"AKIAJHO66S6AWOPIT2GA",
		"secret_key":"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",
		"bucket":"clozerr",
		"base_path":"app/coupons-alpha"
	},
	"checkin":{
		"expiry_time":10 * 60 * 1000,
		"delay_between_checkins":2 * 60 * 60 * 1000
	},
	"api":{
		"default_limit" : 30
	},
	"gcm":{
		"apiKey":"AIzaSyD7a0oUk6GMFLpuFU_wUsuhjBH4jKKOFKQ"
	},
	"birthday":{
		"birthdayWishMessage": "wishes you a Happy Birthday"
	}
	
};
