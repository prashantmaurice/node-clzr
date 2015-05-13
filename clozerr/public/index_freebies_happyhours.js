var index_freebies_happyhours = function( $rootScope, $scope, $http ) {
	$scope.mytime = new Date();

	$scope.hstep = 1;
	$scope.mstep = 15;
	$scope.ismeridian = true;
	var CLOZERR_API = location.origin + '/';
	var CLOZERR_VENDORS_URL = CLOZERR_API + "vendor";
	var CLOZERR_OFFERS_URL = CLOZERR_API + "offer";

  // Page change controllers start.
  $scope.visibility = false;

  var PAGE_NAME = "freebies-happyhours";
  $rootScope.$on("page-" + PAGE_NAME, function(){
  	$scope.visibility = true;
  });

}