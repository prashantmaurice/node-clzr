 var index_profile = function( $rootScope, $scope, $http ) {

  var CLOZERR_API = location.origin + '/';
  var CLOZERR_VENDORS_URL = CLOZERR_API + "vendor";
  var CLOZERR_OFFERS_URL = CLOZERR_API + "offer";

  // Page change controllers start.
  $scope.visibility = false;
  $rootScope.uploadModal = false;

  var PAGE_NAME = "profile";
  $scope.$on("page-" + PAGE_NAME, function(){
    $scope.visibility = true;
   // $("#modalUploadPhoto").find('.modal-body').load('./example.html');
    $rootScope.$broadcast('page-editprofile');
  });

  $scope.$on("page-close", function(){
   $scope.visibility = false;
 });
  // Page change controllers end.

  $scope.updateVendorProfileBackend = function() {
    var access_token = localStorage.token;

    $http.get( CLOZERR_VENDORS_URL + "/update?vendor_id=" + $rootScope.vendor._id + "&name=" + $rootScope.vendor.name + "&phone=" + $rootScope.vendor.phone + "&latitude=" + $rootScope.vendor.location[0] + "&longitude=" + $rootScope.vendor.location[1] + "&access_token=" + access_token ).
      success(function(data, status, headers, config) {
        console.log(data);
    }).error(function(data, status, headers, config) {
  });

}
 $scope.uploadVendorPhotoBackend = function(){
    $http.get(CLOZERR_VENDORS_URL+"/upload-policy?vendor_id="+$rootScope.vendor._id+"&access_token="+localStorage.token).
    success(function(data,status,headers,config){
      console.log(data);
      $rootScope.options = data;
      $rootScope.uploadModal = true;
    }).error(function(data,status,headers,config){

    });
 }
}