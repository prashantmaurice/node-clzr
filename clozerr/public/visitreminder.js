var visitReminderCtrl = function($scope, $rootScope, $http) {
	$scope.flipped = false;

	$rootScope.vp = {};
	$rootScope.vp.activated = false;
	$rootScope.vp.days = 7;
	$rootScope.vp.visitMessage = "Get a Coffee free!";

	$scope.saveVisitReminderPref = function() {
		console.log("saved visit reminder");
	}
	
	$rootScope.$watch(function($rootScope) {
		return $rootScope.vp.activated ;
	}, function(newValue, oldValue) {
		if($rootScope.vp.activated) {
			$rootScope.$broadcast('flip');
			$scope.flipped = !$scope.flipped;
		}
	});
	$scope.$on('flip',function() {
		$scope.flipped = false;
	});
}