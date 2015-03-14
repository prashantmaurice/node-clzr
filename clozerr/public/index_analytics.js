 var index_analytics = function( $rootScope, $scope, $http ) {

  $scope.visibility = false;
  console.log("index_analytics loaded");
  var PAGE_NAME = "analytics";
  $scope.$on("page-" + PAGE_NAME, function(){
    $scope.visibility = true;
  console.log("index_analytics onned");
    $rootScope.$broadcast('page-analytics');
  });

  $scope.$on("page-close", function(){
   $scope.visibility = false;
 });
}