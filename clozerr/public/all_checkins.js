

var all_checkins = function( $rootScope, $scope, $http ){
  $scope.checkins = [];
  $scope.visibility = false;

  var CLOZERR_ALL_CHECKINS_URL = CLOZERR_API + "checkin/confirmed";

  $scope.update = function(){
    var access_token = localStorage.token;

    $scope.err = false;
    $scope.spinner = true;
    $http.get( CLOZERR_ALL_CHECKINS_URL + "?access_token=" + access_token ).
    success( function( data, status, headers, config ) {
      $scope.checkins = data;
      $scope.spinner = false;
    }).error( function( data, status, headers, config ) {
      $scope.err = true;
    });

  }

  $scope.$on("page-all-checkins", function(){
    $scope.visibility = true;
    $scope.update();
  });

  $scope.$on("page-close", function(){
    $scope.visibility = false;
  });

  //$scope.update();
  /*
    TODO: Register for SocketIO messages here.
  */
}
