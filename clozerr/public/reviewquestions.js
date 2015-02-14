var reviewQuestionsCtrl = function($scope, $rootScope, $http) {
	console.log("loaded");
	$rootScope.reviewQuestions = ["Food","Ambience","Quality of Service"];
	$scope.focussedQuestion = 0;
	$scope.saveReviewQuestions = function() {
		console.log($rootScope.reviewQuestions);
	}

	$scope.removeQuestion = function($index) {
		$rootScope.reviewQuestions.splice($index,1);
	}

	$scope.addQuestion = function() {
		$rootScope.reviewQuestions.push("");
	}

	$scope.setFocussedQuestion = function(index) {
		$scope.focussedQuestion = index;
		console.log($scope.focussedQuestion);
	}
}