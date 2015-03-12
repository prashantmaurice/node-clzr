var birthdayCtrl = function($scope, $rootScope, $http) {
	$scope.flipped = false;

	$rootScope.bp = {};
	$rootScope.bp.activated = false;
	$rootScope.bp.birthdayWish = "Happy birthday";
	$rootScope.bp.notifyFirst = false;
	$rootScope.bp.notifyExact = true;

	$scope.saveBirthdayPref = function() {
		console.log("saved birthday pref");
	}

	$rootScope.$watch(function($rootScope) {
		return $rootScope.bp.activated ;
	}, function(newValue, oldValue) {
		if($rootScope.bp.activated) {
			$rootScope.$broadcast('flip');
			$scope.flipped = !$scope.flipped;
		}
	});
	$scope.$on('flip',function() {
		$scope.flipped = false;
	});
}