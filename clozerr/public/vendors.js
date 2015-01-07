var vendor_list = function( $rootScope, $scope, $http) {
	$scope.vendors = [];
	$scope.visibility = false;

	var CLOZERR_VENDORS_URL = CLOZERR_API + "vendor";

	$scope.load_vendors = function() {
		var access_token = localStorage.admin_token;
		$http.get( CLOZERR_VENDORS_URL + "/get/all" + "?access_token=" + access_token).
		success(function(data, status, headers, config) {
			$scope.vendors = data;
		}).error(function(data, status, headers, config) {
     	/*
      	TODO: Throw error here.
      */
  	});
	}

	$scope.edit = function( vendor ){
		console.log( vendor );
		$rootScope.vendor_to_edit = vendor;
		$rootScope.pageChange("vendors");
	}

	$scope.$on("page-vendor-list", function(){
		$scope.visibility = true;
		$scope.load_vendors();
;	});

	$scope.$on("page-close", function(){
		$scope.visibility = false;
	});

	$scope.create_vendor = function() {
		var access_token = localStorage.admin_token;
		$http.get( CLOZERR_VENDORS_URL + "/create" + "?access_token=" + access_token  + "&latitude=0&longitude=0&image=default&fid=0&name=default").
		success(function(data, status, headers, config) {
			$http.get( CLOZERR_API +  "user/create" + "?access_token=" + access_token  + "&vendor_id=" + data._id + "&username=" + $("#vendor_username").val() ).
			success(function(data, status, headers, config) {
				$scope.load_vendors();
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

var vendor_update = function( $rootScope, $scope, $http) {

	var CLOZERR_VENDORS_URL = CLOZERR_API + "vendor";

	$scope.update_vendor = function(vendor) {

		var access_token = localStorage.admin_token;
		$http.get(CLOZERR_VENDORS_URL + "/update?access_token=" + access_token + "&vendor_id=" + vendor._id + "&vendor_name=" + vendor.name + "&latitude=" + vendor.location[0] + "&longitude=" + vendor.location[1] +"&fid=" + vendor.fid + "&image=" + vendor.image).
		success(function(data, status, headers, config) {
			//redirect


		}).error(function(data, status, headers, config) {
     		/*
      			TODO: Throw error here.
      		*/
    });

	}

	$scope.load_vendor = function(){
		$scope.vendor = $rootScope.vendor_to_edit;
		$http.get(CLOZERR_VENDORS_URL + "/get?vendor_id=" + $scope.vendor._id ).
		success(function(data, status, headers, config) {
			//redirect
			$scope.vendor = data;

		}).error(function(data, status, headers, config) {
			/*
			TODO: Throw error here.
			*/
		});
	}

	$scope.new_offer = function( vendor ){
		$http.get(CLOZERR_API + "offer/create?vendor_id=" + $scope.vendor._id + "&access_token=" + localStorage.admin_token ).
		success(function(data, status, headers, config) {
			//redirect
			$http.get(CLOZERR_VENDORS_URL + "/addoffer?vendor_id=" + $scope.vendor._id + "&access_token=" + localStorage.admin_token + "offer_id=" + data._id ).
			success(function(data, status, headers, config) {
				//redirect
				$scope.vendor = data;

			}).error(function(data, status, headers, config) {
				/*
				TODO: Throw error here.
				*/
			});
			//$scope.vendor = data;

		}).error(function(data, status, headers, config) {
			/*
			TODO: Throw error here.
			*/
		});
	}

	$scope.edit_offer = function( offer ){
		console.log( offer );
		$rootScope.offer_to_edit = offer;
		$rootScope.pageChange("offers");
	}


	$scope.$on("page-vendors", function(){
		//$scope.vendor = $rootScope.vendor_to_edit;
		$scope.load_vendor();
		$scope.visibility = true;
	});

	$scope.$on("page-close", function(){
		$scope.visibility = false;
	});
}


var offers = function( $rootScope, $scope, $http) {

	var CLOZERR_OFFERS_URL = CLOZERR_API + "offer";

	$scope.update_offer = function(offer) {

		var access_token = localStorage.admin_token;
		var offer = $scope.offer;
		$http.get(CLOZERR_OFFERS_URL + "/update?access_token=" + access_token + "&offer_id=" + offer._id + "&type=" + offer.type + "&description=" + offer.description + "&caption=" + offer.caption ).
		success(function(data, status, headers, config) {
			//redirect

		}).error(function(data, status, headers, config) {
			/*
			TODO: Throw error here.
			*/
		});

	}

	$scope.load_offer = function(){
		$scope.offer = $rootScope.offer_to_edit;
		$http.get(CLOZERR_OFFERS_URL + "/get?offer_id=" + $scope.offer._id ).
		success(function(data, status, headers, config) {
			//redirect
			$scope.offer = data;

		}).error(function(data, status, headers, config) {
			/*
			TODO: Throw error here.
			*/
		});
	}

	$scope.$on("page-offers", function(){
		//$scope.vendor = $rootScope.vendor_to_edit;
		$scope.load_offer();
		$scope.visibility = true;
	});

	$scope.$on("page-close", function(){
		$scope.visibility = false;
	});
}

$scope.
