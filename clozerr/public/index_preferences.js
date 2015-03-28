  var index_preferences = function( $rootScope, $scope, $http ) {

    var CLOZERR_API = location.origin + '/';
    var CLOZERR_VENDORS_URL = CLOZERR_API + "vendor";
    var CLOZERR_OFFERS_URL = CLOZERR_API + "offer";

  // Page change controllers start.
  $scope.visibility = false;

  
  $rootScope.$broadcast('showPunchCardInputs');

  var PAGE_NAME = "preferences";
  $scope.$on("page-" + PAGE_NAME, function(){
  	$scope.visibility = true;
    $rootScope.$broadcast('showPunchCardInputs');
  });

  $scope.$on("page-close", function(){
   $scope.visibility = false;
 });
  // Page change controllers end.

  console.log('in index_preferences controller');
  
//call update offer url and not vendor update

}
