var punchCardType = function($scope, $rootScope, $http) {
	console.log("loaded");
	var num = 0;
	$scope.punchcardtype = 'p5';
	$scope.textInputVis = false;
	$scope.showPunchCardInputs = function() {
		console.log("working");
		if($scope.punchcardtype=='p5') $scope.num = 5;
		else if($scope.punchcardtype=='p10') $scope.num = 10;
		else if($scope.punchcardtype=='p15') $scope.num = 15;
		else {
			console.log($('#customPunchCount').val());
			$scope.num = $('#customPunchCount').val();
		}
		$scope.textInputVis = true;
	}
	$scope.getNumber = function(num) {
		var range = [];
		for(var i=0;i<num;i++) {
			range.push(i);
		} 
		return range;
	}
}