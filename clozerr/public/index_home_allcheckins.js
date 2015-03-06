
var index_home_allcheckins = function( $rootScope, $scope, $http ){
  
  $scope.visibility = false;
  console.log('controller home-all-checkins')
  var PAGE_NAME = "home-all-checkins";
  $scope.$on("page-" + PAGE_NAME, function(){
    $scope.visibility = true;
  });
  $scope.$on("page-close", function(){
    $scope.visibility = false;
  });
}