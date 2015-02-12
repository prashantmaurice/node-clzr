var neighbourhoodPerksCtrl = function($scope, $rootScope, $http) {
	$scope.flipped = false;
	$scope.neighDistance = '1 km';
	$('#ex1').on('slideStop', function(ev) {
		$scope.neighDistance = ev.value + ' km';
		console.log($scope.neighDistance);
	});
	$("#ex1").slider({
		tooltip : 'hide'
	});

	$scope.saveNeighPerksPref = function() {
		console.log("saved neighbourhood perks");
		console.log($('#ex1').data('slider').getValue());
	}
}