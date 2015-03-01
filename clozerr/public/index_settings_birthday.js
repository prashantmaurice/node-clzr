var index_settings_birthday = function ($scope, $rootScope, $http) {

	//TODO : initialise with the values over there

	$('#checkBirthday').click (function(){
		var thisCheck = $(this);
		$("#birthdayWishPanel").slideToggle();
	});

}