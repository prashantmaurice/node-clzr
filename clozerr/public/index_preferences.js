var index_preferences = function( $rootScope, $scope, $http ){

  var CLOZERR_API = location.origin + '/';
  var CLOZERR_VENDORS_URL = CLOZERR_API + "vendor";

  // Page change controllers start.
  $scope.visibility = false;

  var PAGE_NAME = "preferences";
  $scope.$on("page-" + PAGE_NAME, function(){
  	$scope.visibility = true;

  });

  $scope.$on("page-close", function(){
   $scope.visibility = false;
 });
  // Page change controllers end.

  $scope.updateVendorPreferencesBackend = function() {
    var access_token = localStorage.token;
    var str = decodeURIComponent(jQuery.param({offers:$rootScope.vendor.offers}));
    console.log(str);
    $http.get( CLOZERR_VENDORS_URL + "/update?"+ str + "&access_token=" + access_token).
    success(function(data, status, headers, config) {
      console.log('Successfully updated');
      $rootScope.pageChange("home");
    }).error(function(data, status, headers, config) {

    });


  }
}
/*
    $rootScope.vendor.settings = {};
    $rootScope.vendor.settings.birthday = {};
    $rootScope.vendor.settings.birthday.activated = true;
    $rootScope.vendor.settings.birthday.birthdayWish = "Happy birthday";*/

     /* $rootScope.vendor.settings.visitreminder = {};
    $rootScope.vendor.settings.visitreminder.activated = false; 
    $rootScope.vendor.settings.visitreminder.days = 7;
    $rootScope.vendor.settings.visitreminder.visitMessage = "Get a Coffee free!";

    $rootScope.vendor.settings.neighbourhoodperks = {};
    $rootScope.vendor.settings.neighbourhoodperks.activated = true;
    $rootScope.vendor.settings.neighbourhoodperks.message = "Restaurant is nearby..";
    $rootScope.vendor.settings.neighbourhoodperks.distance = 1;   
    */