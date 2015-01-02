

var current_checkins = function( $scope, $http ){
  $scope.checkins = [];

  var CLOZERR_CURRENT_CHECKINS_URL = CLOZERR_API + "/";
  // TODO: update this url somewhere.

  $scope.update = function(){
    $http.get(CLOZERR_CURRENT_CHECKINS_URL).
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

  var CLOZERR_VALIDATE_URL = CLOZERR_API + "/";
  $scope.validate = function( checkin_id ){

    /*
      TODO: Start spinner.
    */
    $http.get(CLOZERR_VALIDATE_URL).
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

  $scope.update();
  /*
    TODO: Register for SocketIO messages here.
  */

}
