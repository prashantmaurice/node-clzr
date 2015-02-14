var birthdayCtrl = function($scope, $rootScope, $http) {
	$scope.flipped = false;
	$('#notify1st').bootstrapSwitch();
	$('#notifyExact').bootstrapSwitch();
	$('#checkBirthdayPref').bootstrapSwitch();
	$scope.saveBirthdayPref = function() {
		console.log("saved birthday pref");
	}
	$scope.bflip = function() {
		$rootScope.$broadcast('flip');
		$scope.flipped = !$scope.flipped;
	}
	$scope.$on('flip',function() {
		$scope.flipped = false;
	});
}