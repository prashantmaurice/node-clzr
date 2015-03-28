

var current_checkins = function( $rootScope, $scope, $http ){
  $scope.billAmt=0;
  $scope.checkins = [];
  $scope.visibility = false;

  var CLOZERR_CURRENT_CHECKINS_URL = CLOZERR_API + "checkin/active";
  // TODO: update this url somewhere.
  $scope.showData = true;
  $scope.update = function(){
    var access_token = localStorage.token;
    $scope.spinner = true;
    $scope.showData = false;

    $http.get( CLOZERR_CURRENT_CHECKINS_URL + "?access_token=" + access_token ).
    success(function(data, status, headers, config) {
      console.log( data );
      $scope.spinner = false;
      $scope.showData = true;

      $scope.checkins = data.data;
    }).error(function(data, status, headers, config) {
      /*
      TODO: Throw error here.
      */
    });
  }
  $rootScope.validating = false;
  var CLOZERR_VALIDATE_URL = CLOZERR_API + "checkin/validate";
  $rootScope.validate = function( checkin, validate_data ){
    validate_data.billAmt=$scope.billAmt;
    console.log("Validating: ");
    console.log( checkin );
    console.log( validate_data );
    $scope.spinner = true;

    //$scope.invokeTypeRequirement( checkin );
    $rootScope.validating = true;
    var access_token = localStorage.token;
    $http.get( CLOZERR_VALIDATE_URL + "?access_token=" + access_token + "&checkin_id=" + checkin._id + "&validate_data=" + encodeURIComponent( JSON.stringify(validate_data) ) ).
    success(function(data, status, headers, config) {
      $rootScope.validating = false;
      $rootScope.pageChange( "current-checkins" );
      console.log( data );
    }).error(function(data, status, headers, config) {
      console.log( data );
    });

  }

  $scope.$on("validate-finish", function(){
    $scope.update();
  });
  $scope.invokeTypeRequirement = function( checkin ){
    /*if( checkin.offer.type == "SX" ){
      $("#SX-Modal").modal();
    }*/
    $rootScope.checkin = checkin;
    console.log( checkin );
    $scope.spinner = true;
    $scope.showData = false;
    $rootScope.$broadcast( "page-ctype-"+checkin.offer.type );
  }

  $scope.$on("page-current-checkins", function(){
    $scope.visibility = true;
    $scope.update();
    $scope.sxEnabled=$rootScope.vendor.settings.sxEnabled;
  });
  $scope.$on("logged-in", function(){
    $scope.visibility = true;
    $scope.update();
  });


  $scope.$on("page-close", function(){
    $scope.visibility = false;
  });

  $scope.update();


  $scope.reg_socket = function() {

    var socket = io();
    socket.on('signal',function(signal) {
      console.log( "Signal received: " + signal );
      if( JSON.parse(signal).vendor_id == $rootScope.user.vendor_id )
        $scope.update();
    });
  }

  $scope.reg_socket();

}
