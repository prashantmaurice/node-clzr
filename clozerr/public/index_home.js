

var index_home = function( $rootScope, $scope, $http ){
  $scope.checkins = [];
  $scope.visibility = false;

  var CLOZERR_ALL_CHECKINS_URL = CLOZERR_API + "checkin/confirmed";

  // Page change controllers start.
  var PAGE_NAME = "home";
  $scope.$on("page-" + PAGE_NAME, function(){
    $scope.visibility = true;
    //$scope.update();
  });
  $scope.$on("page-close", function(){
    $scope.visibility = false;
  });
  // Page change controllers end.

  $scope.update = function(){
    var access_token = localStorage.token;

    // update stuff here.

  }

  $rootScope.pageChange = function( page ){
    $rootScope.$broadcast("page-close");
    $rootScope.$broadcast("page-" + page );
  }

  //$scope.update();
  /*
  TODO: Register for SocketIO messages here.
  */
}
