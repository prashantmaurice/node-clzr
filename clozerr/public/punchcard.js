var punchCardType = function($scope, $rootScope, $http) {
	console.log("loaded");

	$scope.offers = [];
	$scope.punchcardtype = 'pp';
	$scope.textInputVis = false;
	$scope.showPunchCardInputs = function() {
		console.log("working");
		if($scope.punchcardtype=='pp') {
			$scope.num = $('#customPunchCountp').val();
			for(var i=1;i<=$scope.num;i++) {
				$scope.offers.push(5*i + " % OFF");
			}
		}
		else if($scope.punchcardtype=='px') {
			$scope.num = $('#customPunchCountx').val();
			console.log($scope.num);
			for(var i=1;i<=$scope.num;i++) {
				$scope.offers.push("");
			}
		}
		$scope.textInputVis = true;
	}
	$scope.savePunchCardInputs = function() {
		console.log("saving offers");
	}
}