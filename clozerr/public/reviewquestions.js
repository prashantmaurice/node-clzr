var reviewQuestionsCtrl = function($scope, $rootScope, $http) {
	console.log("loaded");
	$scope.reviewQuestions = ["Food","Ambience","Quality of Service"];
	$scope.focussedQuestion = 0;
	$scope.saveReviewQuestions = function() {
		console.log($scope.reviewQuestions);
		$rootScope.reviewQuestions = $scope.reviewQuestions;
	}

	$scope.removeQuestion = function($index) {
		$scope.reviewQuestions.splice($index,1);
	}

	$scope.addQuestion = function() {
		$scope.reviewQuestions.push("");
	}

	$scope.setFocussedQuestion = function(index) {
		$scope.focussedQuestion = index;
		console.log($scope.focussedQuestion);
	}
}