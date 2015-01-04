

var current_checkins = function( $scope, $http ){
  $scope.checkins = [];

  var CLOZERR_CURRENT_CHECKINS_URL = CLOZERR_API + "/checkin/active";
  // TODO: update this url somewhere.

  $scope.update = function(){
    var access_token = localStorage.token;
    $http.get( CLOZERR_CURRENT_CHECKINS_URL + "?access_token=" + access_token ).
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

  var CLOZERR_VALIDATE_URL = CLOZERR_API + "/checkin/validate";
  $scope.validate = function( checkin ){

    $scope.spinner = true;

    var access_token = localStorage.token;
    $http.get( CLOZERR_VALIDATE_URL + "?access_token=" + access_token + "&checkin=" + checkin._id ).
    success(function(data, status, headers, config) {
      /*
      TODO: Give green signal to vendor.
      */
    }).error(function(data, status, headers, config) {
      /*
      TODO: Red signal to vendor.
      */
    });

  }

  $scope.$on("page-current-checkins", function(){
    $scope.visibility = true;
  });

  $scope.$on("page-close", function(){
    $scope.visibility = false;
  });

  $scope.update();
  /*
    TODO: Register for SocketIO messages here.
  */
}
