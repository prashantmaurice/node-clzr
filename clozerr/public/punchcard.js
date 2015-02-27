var punchCardType = function($scope, $rootScope, $http) {
	console.log("loaded");

	$rootScope.offers = [];
	$scope.punchcardtype = 'pp';
	$scope.textInfoVis = [];
	$scope.hoverCheck = [];

	$scope.num = $('#customPunchCountp').val();
	for(var i=1;i<=$scope.num;i++) {
		$rootScope.offers.push(5*i + " % OFF");
		$scope.textInfoVis.push(true);
		$scope.hoverCheck.push(false);
	}

	console.log($rootScope.offers);

	$scope.showPunchCardInputs = function() {
		if($scope.punchcardtype=='pp') {
			$scope.num = $('#customPunchCountp').val();
			console.log($scope.num);
			if($rootScope.offers.length==0) {
				for(var i=1;i<=$scope.num;i++) {
					$rootScope.offers.push(5*i + " % OFF");
					$scope.textInfoVis.push(true);
					$scope.hoverCheck.push(false);
				}
			}
			else if($rootScope.offers.length!=$scope.num) {
				for(var i=$rootScope.offers.length+1;i<=$scope.num;i++) {
					$rootScope.offers.push(5*i + " % OFF");
					$scope.textInfoVis.push(true);
					$scope.hoverCheck.push(false);
				}
			}
		}
		else if($scope.punchcardtype=='px') {
			$scope.num = $('#customPunchCountx').val();
			console.log($scope.num);
			$rootScope.offers = [];
			for(var i=1;i<=$scope.num;i++) {
				$rootScope.offers.push("");
				$scope.textInfoVis.push(true);
				$scope.hoverCheck.push(false);
			}
		}
		$scope.textInputVis = true;
	}
	$scope.savePunchCardInputs = function() {
		console.log($rootScope.offers);
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