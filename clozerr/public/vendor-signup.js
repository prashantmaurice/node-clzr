var vendorSignup = function($scope, $rootScope, $http) {
	$scope.visStep1 = true;
	$scope.visStep2 = false;
	$scope.visStep3 = false;
	$scope.visStep4 = false;
	$scope.address = "";
	$scope.showTick = false;

	var CLOZERR_API = "http://api.clozerr.com/"
	var CLOZERR_VENDORS_URL = CLOZERR_API + "vendor";

	$scope.focusShowNothing = function() {
		console.log("focussed");		
		$('#statusLocationIndicator').removeClass('fa fa-spin fa-gear fa-2x');
		$('#statusLocationIndicator').removeClass('fa fa-times fa-2x');
		$('#statusLocationIndicator').removeClass('fa fa-check fa-2x');
		$('#statusLocationIndicator').addClass('fa fa-spin fa-gear fa-2x');
	}

	$scope.step1 = function() {
		$scope.visStep1 = true;
		$scope.visStep2 = false;
		$scope.visStep3 = false;
		$scope.visStep4 = false;
	}

	$scope.step2 = function() {
		console.log($scope.vusername + " " + $scope.vpassword + " ");
		$scope.visStep1 = false;
		$scope.visStep2 = true;
		$scope.visStep3 = false;
		$scope.visStep4 = false;
	}

	$scope.step3 = function() {
		console.log($scope.vpublicname + " " + $scope.vfranchisename + " " + $scope.vphoneno);
		$scope.visStep1 = false;
		$scope.visStep2 = false;
		$scope.visStep3 = true;
		$scope.visStep4 = false;
	}

	$scope.step4 = function() {
		$scope.visStep1 = false;
		$scope.visStep2 = false;
		$scope.visStep3 = false;
		$scope.visStep4 = true;
	}

	$scope.getLocation = function(address) {
		var geocoder = new google.maps.Geocoder();
		console.log('blurred');
		$('#statusLocationIndicator').removeClass('fa fa-spin fa-gear fa-2x');
		geocoder.geocode({ 'address': address }, function (results, status) {

			if (status == google.maps.GeocoderStatus.OK) {
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
		/*$http.get( CLOZERR_VENDORS_URL + "/create" + "&latitude=" + $scope.vlatitude +"&longitude=" + $scope.vlongitude + "&image=default"+"&fid=0"+"&name=" + $scope.vpublicname).
		success(function(data, status, headers, config) {
			$scope.vendor_id = data.data._id;
			console.log("Created : Vendor Object");
			$http.get( CLOZERR_API +  "auth/create" + "&vendor_id=" + data.data._id + "&username=" + $scope.vusername + "&password=" + $scope.vpassword ).
			success(function(data, status, headers, config) {
				console.log("Created : User account");
			}).error(function(data, status, headers, config) {
				
			});

		}).error(function(data, status, headers, config) {
			
		});*/
		console.log($rootScope.offers);
		console.log($rootScope.reviewQuestions);
	}
}