var birthdayCtrl = function($scope, $rootScope, $http) {
	$scope.flipped = false;
	$('#notify1st').bootstrapSwitch();
	$('#notifyExact').bootstrapSwitch();
	$('#checkBirthdayPref').bootstrapSwitch();
	$scope.saveBirthdayPref = function() {
		console.log("saved birthday pref");
	}
}