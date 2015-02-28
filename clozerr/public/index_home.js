

var index_home = function( $rootScope, $scope, $http ){
  $scope.checkins = [];
  $scope.visibility = false;

  var CLOZERR_ALL_CHECKINS_URL = CLOZERR_API + "checkin/confirmed";

  console.log(localStorage.token);
  $http.get(CLOZERR_ALL_CHECKINS_URL + "?access_token=" + localStorage.token ).
  success(function(data, status, headers, config) {
    console.log("Got all checkins..");

    $scope.latestCheckinObjects = [];
    console.log(data);

   /* data.sort(function(obj1, obj2) {
      var a = new Date(obj1);
      var b = new Date(obj2);
      if(a>b) return true;
      else return false;
    });*/

  $scope.allCheckinObjects = data;

  for(var i=0;i<data.length;i++) {
    if(new Date().getTime() - new Date(data[i].date_created).getTime() < 7*24*3600*1000) {
      $scope.latestCheckinObjects.push(data[i]);
    }
  }

}).error(function(data, status, headers, config) {
        //TODO : Throw error
      });

$scope.loadStats = function() {

  $http.get(CLOZERR_ALL_CHECKINS_URL + "?access_token=" + localStorage.access_token ).
  success(function(data, status, headers, config) {
    console.log("Got all checkins..");

    $scope.latestCheckinObjects = [];
    console.log(data);

   /* data.sort(function(obj1, obj2) {
      var a = new Date(obj1);
      var b = new Date(obj2);
      if(a>b) return true;
      else return false;
    });*/

  $scope.allCheckinObjects = data;

  for(var i=0;i<data.length;i++) {
    if(new Date().getTime() - new Date(data[i].date_created).getTime() < 7*24*3600*1000 || true) {
      $scope.latestCheckinObjects.push(data[i]);
    }
  }

}).error(function(data, status, headers, config) {
        //TODO : Throw error
      });
}

  // Page change controllers start.
  var PAGE_NAME = "home";
  $scope.$on("page-" + PAGE_NAME, function(){
    $scope.visibility = true;
    //$scope.update();
  });
  $scope.$on("page-close", function(){
    $scope.visibility = false;
  });
  // Page change controllers end.

  $scope.update = function(){
    var access_token = localStorage.token;

    // update stuff here.

  }

  $rootScope.pageChange = function( page ){
    $rootScope.$broadcast("page-close");
    $rootScope.$broadcast("page-" + page );
  }

  //$scope.update();
  /*
  TODO: Register for SocketIO messages here.
  */
}
