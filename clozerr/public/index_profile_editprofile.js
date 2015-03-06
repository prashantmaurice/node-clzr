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
	var CLOZERR_PASSWORD_URL = CLOZERR_API + "auth/reset/password";
	$scope.wrongData = false;
	$scope.wrongPassword = false;
	$scope.verifyPasswordChange = function(){
		if( !( $("#new_password_again").val() == $("#new_password").val() ) ){
			console.log("Password mismatch");
			$scope.wrongData = true;
			$scope.wrongPassword = false;
			return;
		}
		else $scope.wrongData = false;
		$http.get( CLOZERR_API + "auth/login/verifypassword?username=" + $rootScope.user.username + "&password=" + $("#old_password").val() ).
		success(function(data, status, headers, config) {

			if(data.result) {

				$scope.wrongPassword = false;
				$http.get( CLOZERR_PASSWORD_URL + "?access_token=" + localStorage.token + "&new_password=" + $("#new_password").val() ).
				success(function(data, status, headers, config) {
					$scope.wrongData = false;

					$("#new_password_again").val('');
					$("#new_password").val('');
					$("#old_password").val('');
					$('#modalChangePassword').modal('hide');

					$scope.getDetails();
				}).error(function(data, status, headers, config) {

				});

			}
			else $scope.wrongPassword = true;
			
		}).error(function(data, status, headers, config) {

		});
	}

	$scope.getDetails = function(){
		var CLOZERR_PROFILE_URL = CLOZERR_API + "auth/profile";
		var CLOZERR_VENDOR_URL = CLOZERR_API + "vendor/get";

		$http.get(CLOZERR_PROFILE_URL + "?access_token=" + localStorage.token).
		success(function(data, status, headers, config) {
			console.log( data );
			$rootScope.user = data;

			$http.get(CLOZERR_VENDOR_URL + "?vendor_id=" + $rootScope.user.vendor_id).
			success(function(data, status, headers, config) {
				console.log( data );
				$rootScope.vendor = data;
			}).error(function(data, status, headers, config) {
        /*
        TODO: Throw error here.
        */
    });
		}).error(function(data, status, headers, config) {
      /*
      TODO: Throw error here.
      */
  });
	}
}