

var password_change = function( $rootScope, $scope, $http ){

  var PAGE_ID = "login";
  var CLOZERR_PASSWORD_URL = CLOZERR_API + "auth/reset/password";
  // TODO: update this url somewhere.
  $scope.visibility = true;
  $scope.spinner = false;
  $scope.password_form = true;
  $scope.change = function(){
    $scope.spinner = true;
    $scope.password_form = false;
    if( !( $("#new_password_again").val() == $("#new_password").val() ) ){
      console.log("Password mismatch");
      return;
    }
    $http.get( CLOZERR_PASSWORD_URL + "?access_token=" + localStorage.token + "&new_password=" + $("#new_password").val() ).
    success(function(data, status, headers, config) {

      $scope.spinner = false;
      $scope.password_form = true;

      $rootScope.$broadcast("page-close");
      $rootScope.$broadcast("page-current-checkins");

      $scope.getDetails();
    }).error(function(data, status, headers, config) {
      /*
      TODO: Throw error here.
      */
    });

  }

  $scope.$on("page-password-change", function(){
    $scope.visibility = true;
  });

  $scope.$on("page-close", function(){
    $scope.visibility = false;
  });

  $rootScope.pageChange = function( page ){
    $rootScope.$broadcast("page-close");
    $rootScope.$broadcast("page-" + page );
  }

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

  //$scope.update();
  angular.element(document).ready(function () {
    //console.log('Hello World');
    console.log( localStorage.token );
    if( !localStorage.token ){
      console.log("Not logged in.");
      $rootScope.$broadcast("page-close");
      $rootScope.$broadcast("page-login");
      $rootScope.loggedIn = false;
    }else{
      console.log('Logged in');
      $rootScope.$broadcast("page-close");
      $rootScope.$broadcast("page-current-checkins");
      $scope.getDetails();
      $rootScope.loggedIn = true;
    }
  });




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
    $rootScope.loggedIn = false;
  }
  /*
    TODO: Register for SocketIO messages here.
  */
}
