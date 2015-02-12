var vendorSignup = function($scope, $rootScope, $http) {
	$scope.visStep1 = true;
	$scope.visStep2 = false;
	$scope.visStep3 = false;
	$scope.address = "";
	$scope.showTick = false;

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
	}

	$scope.step2 = function() {
		console.log('step2');
		$scope.visStep1 = false;
		$scope.visStep2 = true;
		$scope.visStep3 = false;
	}

	$scope.step3 = function() {
		$scope.visStep1 = false;
		$scope.visStep2 = false;
		$scope.visStep3 = true;
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
				$('#statusLocationIndicator').addClass('fa fa-check fa-2x');
			} else {		
				$('#statusLocationIndicator').addClass('fa fa-times fa-2x');
			}

		});
	}
}