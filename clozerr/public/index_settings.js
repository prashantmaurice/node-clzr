

var index_settings = function( $rootScope, $scope, $http ){

  // Page change controllers start.
  $scope.visibility = false;
  console.log("settings");
  var PAGE_NAME = "settings";
  $scope.$on("page-" + PAGE_NAME, function(){
  	$scope.visibility = true;
  	$rootScope.vendor.settings = {};
  	$rootScope.vendor.settings.birthday = {};
  	$rootScope.vendor.settings.birthday.activated = true;
  	$rootScope.vendor.settings.birthday.birthdayWish = "Happy birthday";
  	$rootScope.vendor.settings.birthday.notifyFirst = false;
  	$rootScope.vendor.settings.birthday.notifyExact = true;

    $rootScope.vendor.settings.visitreminder = {};
  	$rootScope.vendor.settings.visitreminder.activated = false;	
  	$rootScope.vendor.settings.visitreminder.days = 7;
  	$rootScope.vendor.settings.visitreminder.visitMessage = "Get a Coffee free!";

    $rootScope.vendor.settings.neighbourhoodperks = {};
  	$rootScope.vendor.settings.neighbourhoodperks.activated = true;
  	$rootScope.vendor.settings.neighbourhoodperks.message = "Restaurant is nearby..";
    $rootScope.vendor.settings.neighbourhoodperks.distance = 1;  	

  });
  $scope.$on("page-close", function(){
  	$scope.visibility = false;
  });
  // Page change controllers end.
}
