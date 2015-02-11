var birthdayCtrl = function($scope, $rootScope, $http) {
	$scope.flipped = false;
	$('#notify1st').bootstrapSwitch();
	$('#notifyExact').bootstrapSwitch();
	$('#checkBirthdayPref').bootstrapSwitch();

	$("#checkBirthdayPref").on("switch-change", function (e, data) { console.log("change", data.value); });
}