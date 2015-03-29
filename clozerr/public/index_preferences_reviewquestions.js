var reviewQuestionsCtrl = function($scope, $rootScope, $http) {
	console.log("loaded");

	//$rootScope.vendor.question = ["Food","Ambience","Quality of Service"];
	
    var CLOZERR_API = location.origin + '/';
    var CLOZERR_VENDORS_URL = CLOZERR_API + "vendor";
	$scope.focussedQuestion = 0;
	$scope.saveReviewQuestions = function() {
		console.log($rootScope.vendor.question);
	}

	$scope.removeQuestion = function($index) {
		$rootScope.vendor.question.splice($index,1);
	}

	$scope.addQuestion = function() {
		$rootScope.vendor.question.push("");
	}

	$scope.setFocussedQuestion = function(index) {
		$scope.focussedQuestion = index;
		console.log($scope.focussedQuestion);
	}

	 $scope.updateVendorPreferencesBackend = function() {
    var access_token = localStorage.token;

    var arr = $rootScope.vendor.offers;
    var str = decodeURIComponent(jQuery.param({question:$rootScope.vendor.question}));

    $http.get( CLOZERR_VENDORS_URL + "/update?vendor_id=" + $rootScope.vendor._id + "&" + str + "&access_token=" + access_token ).
    success(function(data, status, headers, config) {

      console.log('success - question');
      console.log( CLOZERR_VENDORS_URL + "/update?vendor_id=" + $rootScope.vendor._id + "&" + str + "&access_token=" + access_token );
      console.log(data);
    }).error(function(data, status, headers, config) {
    });
  }
}