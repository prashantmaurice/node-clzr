

var index_home = function( $rootScope, $scope, $http ){
  $scope.checkins = [];
  $scope.visibility = false;

  var CLOZERR_ALL_CHECKINS_URL = CLOZERR_API + "checkin/confirmed";

  console.log(localStorage.token);

  $scope.$watch(function($scope) {
    return $scope.visibility;
  }, function(newValue, oldValue) {
    $scope.loadStats();
    console.log('watched - toggle - visibility - home');
  });

  $scope.getNumber = function(stars) {
    var avgst=0;
    for(var kw=0;kw<stars.length;kw++) {
      avgst = avgst + stars[kw];
    }
    if(stars.length!=0) {
      avgst = avgst/stars.length;
    }
    return new Array(avgst);   
  }
  $scope.getTimeInFormat = function(dateStr) {
    //10/21/2013 3:29 PM
    var date = new Date(dateStr);
    var str = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' ';
    var ampm = "";
    if(date.getHours()>12) {
      str = str + (date.getHours() - 12);
      ampm = "PM";
    }
    else {
      str = str + date.getHours();
      ampm = "AM";
    }

    str = str + ':' + date.getMinutes() + ' ' + ampm;
    console.log(str);
    return str;
  }

  $scope.loadStats = function() {

    $http.get(CLOZERR_ALL_CHECKINS_URL + "?access_token=" + localStorage.token ).
    success(function(data, status, headers, config) {
      console.log("Got all checkins..");

      $scope.latestCheckinObjects = [];
      $scope.latestCheckinObjectsWithReviews = [];
      console.log(data);

      $scope.allCheckinObjects = data;

      for(var i=0;i<data.length;i++) {
        if(new Date().getTime() - new Date(data[i].date_created).getTime() < 7*24*3600*1000*10000) {
          data[i].date_created_modified = $scope.getTimeInFormat(data[i].date_created);
          $scope.latestCheckinObjects.push(data[i]);      //may or may not contain a review
          if(data[i].review) {
            $scope.latestCheckinObjectsWithReviews.push(data[i]);
            data[i].review.date_created_modified = $scope.getTimeInFormat(data[i].review.date_created);
          }
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

  
}
