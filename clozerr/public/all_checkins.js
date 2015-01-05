

var all_checkins = function( $rootScope, $scope, $http ){
  $scope.checkins = [];
  $scope.visibility = false;

  var CLOZERR_ALL_CHECKINS_URL = CLOZERR_API + "checkin/confirmed";
  // TODO: update this url somewhere.

  $scope.update = function(){
    var access_token = localStorage.token;

    $http.get( CLOZERR_ALL_CHECKINS_URL + "?access_token=" + access_token ).
    success(function(data, status, headers, config) {
      /*
      TODO: Update checkins object here.
      */

    }).error(function(data, status, headers, config) {
      /*
      TODO: Throw error here.
      */
    });

  }

  $scope.$on("page-all-checkins", function(){
    $scope.visibility = true;
  });

  $scope.$on("page-close", function(){
    $scope.visibility = false;
  });

  //$scope.update();
  /*
    TODO: Register for SocketIO messages here.
  */
}
