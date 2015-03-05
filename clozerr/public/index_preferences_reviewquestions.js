var reviewQuestionsCtrl = function($scope, $rootScope, $http) {
	console.log("loaded");

	//$rootScope.vendor.question = ["Food","Ambience","Quality of Service"];
	
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
}