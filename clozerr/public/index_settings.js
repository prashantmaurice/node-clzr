var index_settings = function( $rootScope, $scope, $http ){

  $scope.extractBool = function(str) {
    if(str=="true") return true;
    else if(str=="false") return false;
    else if(str) return true;
    else return false;
  }

  var CLOZERR_API = location.origin + '/';
  var CLOZERR_VENDORS_URL = CLOZERR_API + "vendor";

  // Page change controllers start.
  $scope.visibility = false;
  console.log("settings");
  var PAGE_NAME = "settings";
  $scope.$on("page-" + PAGE_NAME, function(){
  	$scope.visibility = true;

    $rootScope.vendor.settings.birthday.activated = $scope.extractBool($rootScope.vendor.settings.birthday.activated);
    console.log('birthday-act');
    console.log($rootScope.vendor.settings.birthday.activated);
    $rootScope.vendor.settings.birthday.notifyFirst = $scope.extractBool($rootScope.vendor.settings.birthday.notifyFirst);
    $rootScope.vendor.settings.birthday.notifyExact = $scope.extractBool($rootScope.vendor.settings.birthday.notifyExact);

    $rootScope.vendor.settings.visitreminder.activated = $scope.extractBool($rootScope.vendor.settings.visitreminder.activated);
    $rootScope.vendor.settings.visitreminder.days = $rootScope.vendor.settings.visitreminder.days * 1;

    $rootScope.vendor.settings.neighbourhoodperks.activated = $scope.extractBool($rootScope.vendor.settings.neighbourhoodperks.activated);
    $rootScope.vendor.settings.neighbourhoodperks.distance =  $rootScope.vendor.settings.neighbourhoodperks.distance * 1;   

  });

  $scope.$on("page-close", function(){
   $scope.visibility = false;
 });
  // Page change controllers end.

  $scope.updateVendorSettingsBackend = function() {
    var access_token = localStorage.token;
    var str = decodeURIComponent(jQuery.param({settings:$rootScope.vendor.settings}));
    console.log(str);

    $http.get( CLOZERR_VENDORS_URL + "/update?"+ str + "&access_token=" + access_token + "&vendor_id=" + $rootScope.vendor._id).
    success(function(data, status, headers, config) {
      console.log(data);
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