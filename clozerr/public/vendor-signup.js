var vendorSignup = function($scope, $rootScope, $http) {
	$scope.visStep1 = true;
	$scope.visStep2 = false;
	$scope.visStep3 = false;
	$scope.visStep4 = false;
	$scope.address = "";
	$scope.showTick = false;
	$scope.stepNo = 1;

	var CLOZERR_API = location.origin + '/';
	var CLOZERR_VENDORS_URL = CLOZERR_API + "vendor";

	$scope.focusShowNothing = function() {
		console.log("focussed");		
		$('#statusLocationIndicator').removeClass('ffa fa-spinner fa-pulse fa-2x');
		$('#statusLocationIndicator').removeClass('fa fa-times fa-2x');
		$('#statusLocationIndicator').removeClass('fa fa-check fa-2x');
		$('#statusLocationIndicator').addClass('fa fa-spinner fa-pulse fa-2x');
	}

	$scope.step1 = function() {
		$scope.visStep1 = true;
		$scope.visStep2 = false;
		$scope.visStep3 = false;
		$scope.visStep4 = false;
		$scope.stepNo = 1;
	}

	$scope.step2 = function() {
		console.log($scope.vusername + " " + $scope.vpassword + " ");
		$scope.visStep1 = false;
		$scope.visStep2 = true;
		$scope.visStep3 = false;
		$scope.visStep4 = false;
		$scope.stepNo = 2;
	}

	$scope.step3 = function() {
		console.log($scope.vpublicname + " " + $scope.vfranchisename + " " + $scope.vphoneno);
		$scope.visStep1 = false;
		$scope.visStep2 = false;
		$scope.visStep3 = true;
		$scope.visStep4 = false;
		$scope.stepNo = 3;
	}

	$scope.step4 = function() {
		$scope.visStep1 = false;
		$scope.visStep2 = false;
		$scope.visStep3 = false;
		$scope.visStep4 = true;
		$scope.stepNo = 4;
	}

	$scope.getLocation = function(address) {
		var geocoder = new google.maps.Geocoder();
		console.log('blurred');
		$('#statusLocationIndicator').removeClass('fa fa-spinner fa-pulse fa-2x');
		geocoder.geocode({ 'address': address }, function (results, status) {

			if (status == google.maps.GeocoderStatus.OK) {
				console.log(results);
				var latitude = results[0].geometry.location.lat();
				var longitude = results[0].geometry.location.lng();
				console.log('latitude : ' + latitude);
				console.log('longitude : ' + longitude);	

				$scope.vlatitude = latitude;
				$scope.vlongitude = longitude;

				$('#statusLocationIndicator').addClass('fa fa-check fa-2x');
			} else {		
				$('#statusLocationIndicator').addClass('fa fa-times fa-2x');
			}

		});
	}

	$scope.createVendor = function() {
		var access_token = localStorage.token;
		var settings = {};
		settings.sxEnabled=$rootScope.miscellaneous.sxEnabled;
		settings.billAmt=$rootScope.miscellaneous.billAmt;
		settings.birthday = $rootScope.bp;
		settings.neighbourhoodperks = $rootScope.np;
		settings.visitreminder = $rootScope.vp;
		var str = decodeURIComponent(jQuery.param({question:$rootScope.reviewQuestions,settings:settings}));
		console.log(str);

		$scope.fid = Math.floor(Math.random() * Math.pow(10,16));
		console.log($scope.fid);
		
		$http.get( CLOZERR_VENDORS_URL + "/create" + "?latitude=" + $scope.vlatitude +"&longitude=" + $scope.vlongitude + "&image=default"+"&fid=" + $scope.fid+"&name=" + $scope.vpublicname + "&phone=" + $scope.vphoneno + "&" + str).
		success(function(data, status, headers, config) {
            $rootScope.vendor=data;
			$scope.vendor_id = data.data._id;
			console.log(data);
			console.log("Created : Vendor Object");
			$http.get( CLOZERR_API +  "auth/create" + "?vendor_id=" + $scope.vendor_id + "&username=" + $scope.vusername + "&password=" + $scope.vpassword).
			success(function(data, status, headers, config) {
				console.log("Created : User account");
				console.log(data);
				console.log($scope.vusername);
				$http.get(CLOZERR_API + "auth/login/password?username=" + $scope.vusername + "&password=password" /*+ $scope.vpassword*/).
				success(function(data, status, headers, config) {
					console.log(data);
					access_token = data.access_token;
					localStorage.token = data.access_token;

					for(var u=0;u<$rootScope.offers.length;u++) {

						$http.get( CLOZERR_API +  "offer/create" + "?caption=" + $rootScope.offers[u] + "&description=" + $rootScope.offers[u] + "&access_token=" + access_token ).
						success(function(offerdata, status, headers, config) {
							console.log("offerdata : ");
							console.log(offerdata);
							console.log("Created : Offer no. " + u+1);
					//Link the offer -- vendor
					$http.get( CLOZERR_API +  "vendor/addoffer" + "?offer_id=" + offerdata.data._id + "&access_token=" + access_token + "&vendor_id=" + $scope.vendor_id).
					success(function(data, status, headers, config) {

						console.log("Linked : Offer no : " + u+1 + " with vendor object");

					}).error(function(data, status, headers, config) {
					//TODO : Throw error
				});

				}).error(function(data, status, headers, config) {
					//TODO : Throw error
				});
			}
		}).error(function(data, status, headers, config) {
			//TODO : Throw error
		});
		
	}).error(function(data, status, headers, config) {
				//TODO : Throw error
			});


}).error(function(data, status, headers, config) {
					//TODO : Throw error
				});


		console.log($rootScope.offers);
		console.log($rootScope.reviewQuestions);
	}
}