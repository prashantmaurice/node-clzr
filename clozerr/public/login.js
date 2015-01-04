

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
  if( !localStorage.access_token ){
    $rootScope.$broadcast("page-close");
    $rootScope.$broadcast("page-login");
  }
  /*
    TODO: Register for SocketIO messages here.
  */
}
