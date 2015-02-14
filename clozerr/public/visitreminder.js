var visitReminderCtrl = function($scope, $rootScope, $http) {
	$scope.flipped = false;
	$scope.saveVisitReminderPref = function() {
		console.log("saved visit reminder");
	}
	$scope.vrflip = function() {
		$rootScope.$broadcast('flip');
		$scope.flipped = !$scope.flipped;
	}
	$scope.$on('flip',function() {
		$scope.flipped = false;
	});
}