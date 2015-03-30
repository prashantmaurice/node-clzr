

var ctype_sx = function( $rootScope, $scope, $http ){
  $scope.visibility = false;


  $scope.$on("page-ctype-SX", function(){

    $scope.visibility = true;
    $scope.validate_data = {};
    $scope.validate_data.billAmt=$rootScope.billAmt;
    $scope.checkin = $rootScope.checkin;
    $rootScope.validate( $scope.checkin, validate_data );

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
