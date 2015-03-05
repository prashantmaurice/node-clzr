var index_profile_editprofile = function( $rootScope, $scope, $http) {
	var CLOZERR_API = location.origin + '/';
	var CLOZERR_VENDORS_URL = CLOZERR_API + "vendor";

	$scope.focusShowNothing = function() {
		console.log("focussed");		
		$('#statusLocationIndicator').removeClass('fa fa-spin fa-gear fa-2x');
		$('#statusLocationIndicator').removeClass('fa fa-times fa-2x');
		$('#statusLocationIndicator').removeClass('fa fa-check fa-2x');
		$('#statusLocationIndicator').addClass('fa fa-spin fa-gear fa-2x');
	}



	$scope.getAddress = function(lat, lon) {
		$http.get( "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + lon).
    success(function(data, status, headers, config) {
      console.log(data);
      $scope.vendorAddressRevGeoCoded = data.results[0].formatted_address;
    }).error(function(data, status, headers, config) {

    });
	}
	$scope.$on('page-editprofile',function() {
		$scope.vendorAddressRevGeoCoded = $scope.getAddress($rootScope.vendor.location[0],$rootScope.vendor.location[1]);
	});	

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

				$rootScope.vendor.location[0] = $scope.vlatitude;
				$rootScope.vendor.location[1] = $scope.vlongitude;

				$('#statusLocationIndicator').addClass('fa fa-check fa-2x');
			} else {		
				$('#statusLocationIndicator').addClass('fa fa-times fa-2x');
			}

		});
	}
}