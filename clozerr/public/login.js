

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

  $scope.$on("page-login", function(){
    $scope.visibility = true;
  });

  $scope.$on("page-close", function(){
    $scope.visibility = false;
  });

  //$scope.update();
  angular.element(document).ready(function () {
    //console.log('Hello World');
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
  });


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

  $rootScope.logout = function(){
    var CLOZERR_LOGOUT_URL = CLOZERR_API + "auth/logout"
    $http.get( CLOZERR_LOGOUT_URL + "?access_token=" + localStorage.token ).
    success(function(data, status, headers, config) {
      console.log( data );
      $rootScope.vendor = data;
    }).error(function(data, status, headers, config) {
      /*
      TODO: Throw error here.
      */
    });
    delete localStorage["token"];
    $rootScope.$broadcast("page-close");
    $rootScope.$broadcast("page-login");
  }
  /*
    TODO: Register for SocketIO messages here.
  */
}
