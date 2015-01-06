var vendor_list = function( $scope, $http) {
	$scope.vendors = [];
	$scope.visibility = false;

	var CLOZERR_VENDORS_URL = CLOZERR_API + "/vendor";

	$scope.load_vendors = function() {
		var access_token = localStorage.token;
		$http.get( CLOZERR_VENDORS_URL + "/get/all" + "?access_token=" + access_token).
		success(function(data, status, headers, config) {
			$scope.vendors = data;
		}).error(function(data, status, headers, config) {
     	/*
      		TODO: Throw error here.
      		*/
      	});
	}

	$scope.$on("page-vendor-list", function(){
		$scope.visibility = true;
	});

	$scope.$on("page-close", function(){
		$scope.visibility = false;
	});
}

var vendor_update = function( $scope, $http) {

	var CLOZERR_VENDORS_URL = CLOZERR_API + "/vendor";

	$scope.update_vendor = function(vendor) {

		var access_token = localStorage.token;
		$http.get(CLOZERR_VENDORS_URL + "/update?access_token=" + access_token + "&vendor_id=" + vendor._id + "&vendor_name=" + vendor.name + "&latitude=" + vendor.latitude + "&longitude=" + vendor.longitude +"&fid=" + vendor.fid + "&image=" + vendor.image).
		success(function(data, status, headers, config) {
			//redirect
			$('#vendor_list').attr('style','display:inline');
			$('#create_form').attr('style','display:none');
			$('#update_form').attr('style','display:none');

		}).error(function(data, status, headers, config) {
     		/*
      			TODO: Throw error here.
      		*/
      	});
	}

	$scope.$on("page-vendor-update", function(){
		$scope.visibility = true;
	});

	$scope.$on("page-close", function(){
		$scope.visibility = false;
	});
}

var vendor_create = function( $scope, $http) {

	$scope.create_vendor = function() {
		$http.get( CLOZERR_VENDORS_URL + "/create" + "?access_token=" + access_token).
		success(function(data, status, headers, config) {
			$scope.update_vendor(data.vendor_id);
		}).error(function(data, status, headers, config) {
     	/*
      		TODO: Throw error here.
      		*/
      	});	
	}

	$scope.$on("page-vendor-create", function(){
		$scope.visibility = true;
	});

	$scope.$on("page-close", function(){
		$scope.visibility = false;
	});

}