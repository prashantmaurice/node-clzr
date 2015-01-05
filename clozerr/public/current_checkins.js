

var current_checkins = function( $rootScope, $scope, $http ){
  $scope.checkins = [];
  $scope.visibility = false;

  var CLOZERR_CURRENT_CHECKINS_URL = CLOZERR_API + "checkin/active";
  // TODO: update this url somewhere.

  $scope.update = function(){
    var access_token = localStorage.token;
    $http.get( CLOZERR_CURRENT_CHECKINS_URL + "?access_token=" + access_token ).
    success(function(data, status, headers, config) {
      console.log( data );
      $scope.checkins = data.data;
    }).error(function(data, status, headers, config) {
      /*
      TODO: Throw error here.
      */
    });
  }

  var CLOZERR_VALIDATE_URL = CLOZERR_API + "checkin/validate";
  $scope.validate = function( checkin ){

    $scope.spinner = true;

    var access_token = localStorage.token;
    $http.get( CLOZERR_VALIDATE_URL + "?access_token=" + access_token + "&checkin_id=" + checkin._id ).
    success(function(data, status, headers, config) {
      console.log( data );
    }).error(function(data, status, headers, config) {
      console.log( data );
    });

  }

  $scope.$on("page-current-checkins", function(){
    $scope.visibility = true;
    $scope.update();
  });

  $scope.$on("page-close", function(){
    $scope.visibility = false;
  });

  $scope.update();
  /*
    TODO: Register for SocketIO messages here.
  */

  $scope.reg_socket = function() {
//TODO : will modify this
    var socket = io();
    socket.on('signal',function(signal) {
      console.log( "Signal received: " + signal );
      if( JSON.parse(signal).vendor_id == $rootScope.user.vendor_id )
        $scope.update();
    });
  }

  $scope.reg_socket();

}
