var punchCardType = function($scope, $rootScope, $http) {
	console.log("loaded");

	$scope.offers = [];
	$scope.punchcardtype = 'pp';
	$scope.textInfoVis = [];
	$scope.hoverCheck = [];

	$scope.showPunchCardInputs = function() {
		if($scope.punchcardtype=='pp') {
			$scope.num = $('#customPunchCountp').val();
			console.log($scope.num);
			if($scope.offers.length==0) {
				for(var i=1;i<=$scope.num;i++) {
					$scope.offers.push(5*i + " % OFF");
					$scope.textInfoVis.push(true);
					$scope.hoverCheck.push(false);
				}
			}
		}
		else if($scope.punchcardtype=='px') {
			$scope.num = $('#customPunchCountx').val();
			console.log($scope.num);
			for(var i=1;i<=$scope.num;i++) {
				$scope.offers.push("");
				$scope.textInfoVis.push(true);
				$scope.hoverCheck.push(false);
			}
		}
		$scope.textInputVis = true;
	}
	$scope.savePunchCardInputs = function() {
		console.log($scope.offers);
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