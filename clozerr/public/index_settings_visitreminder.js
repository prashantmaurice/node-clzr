var index_settings_visitreminder = function ($scope, $rootScope, $http) {

	//TODO : initialise with the values over there

	$('#checkvisitreminder').click (function(){
		var thisCheck = $(this);
		$("#visitreminderPanel").slideToggle();
	});

}