var index_freebies = function( $rootScope, $scope, $http ) {

  var CLOZERR_API = location.origin + '/';
  var CLOZERR_VENDORS_URL = CLOZERR_API + "vendor";
  var CLOZERR_OFFERS_URL = CLOZERR_API + "offer";

  // Page change controllers start.
  $scope.visibility = false;

  var PAGE_NAME = "freebies";
  $rootScope.$on("page-" + PAGE_NAME, function(){
    $scope.visibility = true;
    $rootScope.$broadcast("page-freebies-checkin");
    $rootScope.$broadcast("page-freebies-happyhours");
    $rootScope.$broadcast("page-freebies-referral");
    $rootScope.$broadcast("page-freebies-lucky");
    $rootScope.$broadcast("page-freebies-welcome");
 });
  $rootScope.$on("page-close",function(){
    $scope.visibility = false;
  })
}