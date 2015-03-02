var neighbourhoodPerksCtrl = function($scope, $rootScope, $http) {
	$scope.flipped = false;
	$rootScope.np = {};
	$rootScope.np.distance = 1;
	$rootScope.np.activated = false;
	$rootScope.np.message = "Free coffee..";
	$scope.saveNeighPerksPref = function() {
		console.log("saved neighbourhood perks");
	}

	$rootScope.$watch(function($rootScope) {
		return $rootScope.np.activated ;
	}, function(newValue, oldValue) {
		if($rootScope.np.activated) {
			$rootScope.$broadcast('flip');
			$scope.flipped = !$scope.flipped;
		}
	});

	$scope.$on('flip',function() {
		$scope.flipped = false;
	});
}