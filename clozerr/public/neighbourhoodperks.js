var neighbourhoodPerksCtrl = function($scope, $rootScope, $http) {
	$scope.flipped = false;
	$scope.neighDistance = '1 km';
	$("#ex1").slider({
		tooltip : 'hide'
	});
	$('#ex1').on('slideStop', function(ev) {
		$scope.neighDistance = ev.value + ' km';
		console.log($scope.neighDistance);
	});

	$scope.getNeighDistance = function() {
		return $scope.neighDistance;
	}

	$scope.saveNeighPerksPref = function() {
		console.log("saved neighbourhood perks");
		console.log($('#ex1').data('slider').getValue());
	}
	$scope.npflip = function() {
		$rootScope.$broadcast('flip');
		$scope.flipped = !$scope.flipped;
	}
	$scope.$on('flip',function() {
		$scope.flipped = false;
	});
}