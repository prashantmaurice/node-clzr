var punchCardType = function($scope, $rootScope, $http) {
	console.log("loaded - punchCardType");

	$scope.textInfoVis = [];
	$scope.hoverCheck = [];

	

	$scope.showPunchCardInputs = function() {
		console.log('true here')

		$scope.num = $rootScope.vendor.offers.length;
		for(var i=1;i<=$scope.num;i++) {
			$scope.textInfoVis.push(true);
			$scope.hoverCheck.push(false);
		}

		console.log($rootScope.vendor.offers);

		$scope.num = $rootScope.vendor.offers.length;

		console.log($scope.num);

		for(var i=1;i<=$scope.num;i++) {	
			$scope.textInfoVis.push(true);
			$scope.hoverCheck.push(false);
			$rootScope.vendor.offers[i-1].caption = unescape($rootScope.vendor.offers[i-1].caption);
			console.log($rootScope.vendor.offers[i-1].caption);
		}
	}

	$scope.$on('showPunchCardInputs', $scope.showPunchCardInputs);

	$scope.savePunchCardInputs = function() {
		console.log($rootScope.vendor.offers);
	}
	$scope.toggleEditSaveOffer = function(offer, $index) {
		if($scope.textInfoVis[$index]) {
			$scope.textInfoVis[$index] = false;
		}
		else {
			$scope.textInfoVis[$index] = true;
		}
	}
	$scope.toggleHover = function($index) {
		$scope.hoverCheck[$index] = !$scope.hoverCheck[$index];
	}
}