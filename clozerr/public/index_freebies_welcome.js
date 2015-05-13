var index_freebies_welcome = function( $rootScope, $scope, $http ) {

	var CLOZERR_API = location.origin + '/';
	var CLOZERR_VENDORS_URL = CLOZERR_API + "vendor";
	var CLOZERR_OFFERS_URL = CLOZERR_API + "offer";

  // Page change controllers start.
  $scope.visibility = false;
  $scope.slide=false;
  var PAGE_NAME = "freebies-welcome";
  $rootScope.$on("page-" + PAGE_NAME, function(){
  	$scope.visibility = true;
  });

}