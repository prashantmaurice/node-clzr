module.exports = {
	"auth":{
		"facebook":{
			"app_token":"643340145745435|nyelclS2lAU75ksOpYtfOLNtwOg"
		},
		"google":{
			"app_id":["496568600186-q67jdokmmuofba4updq7v8kl9j4niaoe.apps.googleusercontent.com",
                      "496568600186-ku41clmavuaam8dru15iheg4lnn66inb.apps.googleusercontent.com",
                      " 496568600186-25gp2rukpdi85euh02ud8i32ua3g5jvh.apps.googleusercontent.com"]

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
	},
	"sidebar":{
		url:[
		"https://s3-ap-southeast-1.amazonaws.com/www.clozerr.com/img/bg.jpg",
		"https://s3-ap-southeast-1.amazonaws.com/www.clozerr.com/img/phone.png"]
	},
	"homepage":{
		url:[
		"https://s3-ap-southeast-1.amazonaws.com/clozerrsite/img/mainbg.jpg",
         "https://s3-ap-southeast-1.amazonaws.com/clozerrsite/img/phone.png"]
	},
	"UUID":"EBEFD083-70A2-47C8-9837-E7B5634DF524"
};
