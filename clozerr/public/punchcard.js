var punchCardType = function($scope, $rootScope, $http) {
	console.log("loaded");

	$scope.offers = [];
	$scope.punchcardtype = 'pp';
	$scope.textInfoVis = [];

	$scope.showPunchCardInputs = function() {
		console.log("working");
		if($scope.punchcardtype=='pp') {
			$scope.num = $('#customPunchCountp').val();
			for(var i=1;i<=$scope.num;i++) {
				$scope.offers.push(5*i + " % OFF");
				$scope.textInfoVis.push(true);
			}
		}
		else if($scope.punchcardtype=='px') {
			$scope.num = $('#customPunchCountx').val();
			console.log($scope.num);
			for(var i=1;i<=$scope.num;i++) {
				$scope.offers.push("");
				$scope.textInfoVis.push(true);
			}
		}
		$scope.textInputVis = true;
	}
	$scope.savePunchCardInputs = function() {
		console.log("saving offers");
	}
	$scope.toggleEditSaveOffer = function(offer, $index) {
		if($scope.textInfoVis[$index]) {
			$scope.textInfoVis[$index] = false;
		}
		else {
			$scope.textInfoVis[$index] = true;
		}
	}
}