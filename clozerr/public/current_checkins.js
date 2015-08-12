

var current_checkins = function( $rootScope, $scope, $http ){
  $scope.checkins = [];
  $scope.visibility = false;
// Fix default 1.
  //$scope.validate_data = {};
  //$scope.validate_data.stamps = 1;

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

  var CLOZERR_CURRENT_CHECKINS_URL = CLOZERR_API + "v2/vendor/checkins/active";
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

      $scope.checkins = data;
    	$scope.checkins.forEach( function( checkin ){ checkin.validate_data = {}; checkin.validate_data.stamps = 1; });
    }).error(function(data, status, headers, config) {
      /*
      TODO: Throw error here.
      */
    });
  }
  $rootScope.validating = false;
  var CLOZERR_VALIDATE_URL = CLOZERR_API + "v2/offers/checkin/validate";
  $rootScope.validate = function( checkin, validate_data ){
    console.log("Validating: ");
    //console.log($scope.billAmount);
    //console.log($rootScope.billAmt);
    console.log( checkin );
    console.log( validate_data );
    $scope.spinner = true;

    //$scope.invokeTypeRequirement( checkin );
    $rootScope.validating = true;
    var access_token = localStorage.token;
    var str = encodeURIComponent(validate_data);
    $http.get( CLOZERR_VALIDATE_URL + "?access_token=" + access_token + "&checkin_id=" + checkin._id + "&validate_data[stamps]=" + validate_data.stamps ).
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

  $(window).on("checkin-expired", function(){ 
	
	console.log("checkin-expired signal received");
	
	setTimeout( function(){
		console.log("Standby.. refreshing..");
		$scope.update(); 
	}, 1000 );

  });

  $scope.invokeTypeRequirement = function( checkin ){
    /*if( checkin.offer.type == "SX" ){
      $("#SX-Modal").modal();
    }*/
    $rootScope.checkin = checkin;
    console.log( checkin );
    $scope.spinner = true;
    $scope.showData = false;

    //$rootScope.billAmt = $scope.billAmount;
    $rootScope.$broadcast( "page-ctype-"+checkin.offer.type );
  }

  $scope.$on("page-current-checkins", function(){
    $scope.visibility = true;
    $scope.update();
    if($rootScope.vendor.settings) {

    $scope.sxEnabled=$rootScope.vendor.settings.sxEnabled || false;
    }
    else $scope.sxEnabled = false;
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
