var enableSxCtrl = function($scope, $rootScope, $http) {
	$scope.flipped = false;

	$rootScope.miscellaneous = {};
	$rootScope.miscellaneous.sxEnabled = false;
	$rootScope.miscellaneous.billAmt = 100;

	$scope.saveSxSettingsPref = function() {
		console.log("saved sx enabled");
	}
	
	$rootScope.$watch(function($rootScope) {
		return $rootScope.miscellaneous.sxEnabled ;
	}, function(newValue, oldValue) {
		console.log(newValue);
		console.log(oldValue);
		if($rootScope.miscellaneous.sxEnabled) {
			$rootScope.$broadcast('flip');
			$scope.flipped = !$scope.flipped;
		}
	});
	$scope.$on('flip',function() {
		$scope.flipped = false;
	});
}