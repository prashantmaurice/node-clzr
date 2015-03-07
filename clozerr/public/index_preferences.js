  var index_preferences = function( $rootScope, $scope, $http ) {

  var CLOZERR_API = location.origin + '/';
  var CLOZERR_VENDORS_URL = CLOZERR_API + "vendor";
  var CLOZERR_OFFERS_URL = CLOZERR_API + "offer";

  // Page change controllers start.
  $scope.visibility = false;

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

  $scope.updateVendorPreferencesBackend = function() {
    var access_token = localStorage.token;

    var arr = $rootScope.vendor.offers;
    var str = decodeURIComponent(jQuery.param({question:$rootScope.vendor.question}));

    $http.get( CLOZERR_VENDORS_URL + "/update?vendor_id=" + $rootScope.vendor._id + "&" + str + "&access_token=" + access_token ).
      success(function(data, status, headers, config) {

        console.log('success - question');
        console.log( CLOZERR_VENDORS_URL + "/update?vendor_id=" + $rootScope.vendor._id + "&" + str + "&access_token=" + access_token );
        console.log(data);
    }).error(function(data, status, headers, config) {
  });

    for(var u = 0; u<arr.length; u++) {
      $http.get( CLOZERR_OFFERS_URL + "/update?offer_id=" + arr[u]._id + "&caption=" + arr[u].caption + "&description=" + arr[u].description + "&access_token=" + access_token ).
      success(function(data, status, headers, config) {
      console.log(data);
      $rootScope.pageChange("home");
    }).error(function(data, status, headers, config) {
  });
}
}
//call update offer url and not vendor update

}
