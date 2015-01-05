

var login = function( $rootScope, $scope, $http ){

  var PAGE_ID = "login";
  var CLOZERR_LOGIN_URL = CLOZERR_API + "auth/login/password";
  // TODO: update this url somewhere.
  $scope.visibility = false;
  $scope.login = function(){

    $http.get( CLOZERR_LOGIN_URL + "?username=" + $("#username").val() + "&password=" + $("#password").val() ).
    success(function(data, status, headers, config) {
      localStorage.token = data.access_token;
      $rootScope.$broadcast("page-close");
      $rootScope.$broadcast("page-current-checkins");
      $scope.getDetails();
    }).error(function(data, status, headers, config) {
      /*
      TODO: Throw error here.
      */
    });
  }

  $scope.$on("page-"+PAGE_ID, function(){
    $scope.visibility = true;
  });

  $scope.$on("page-close", function(){
    $scope.visibility = false;
  });

  //$scope.update();
  setTimeout( function(){
    console.log( localStorage.token );
    if( !localStorage.token ){
      console.log("Not logged in.");
      $rootScope.$broadcast("page-close");
      $rootScope.$broadcast("page-login");
    }else{
      console.log('Logged in');
      $rootScope.$broadcast("page-close");
      $rootScope.$broadcast("page-current-checkins");
      $scope.getDetails();
    }
  }, 0);

  $scope.getDetails = function(){
    var CLOZERR_PROFILE_URL = CLOZERR_API + "auth/profile";
    var CLOZERR_VENDOR_URL = CLOZERR_API + "vendor/get";

    $http.get(CLOZERR_PROFILE_URL + "?access_token=" + localStorage.token).
    success(function(data, status, headers, config) {
      console.log( data );
      $rootScope.user = data;

      $http.get(CLOZERR_VENDOR_URL + "?vendor_id=" + $rootScope.user.vendor_id).
      success(function(data, status, headers, config) {
        console.log( data );
        $rootScope.vendor = data;
      }).error(function(data, status, headers, config) {
        /*
        TODO: Throw error here.
        */
      });
    }).error(function(data, status, headers, config) {
      /*
      TODO: Throw error here.
      */
    });
  }
  /*
    TODO: Register for SocketIO messages here.
  */
}
