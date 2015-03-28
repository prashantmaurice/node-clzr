var index_settings_miscellaneous = function ($scope, $rootScope, $http) {

	//TODO : initialise with the values over there

	$('#sxEnabled').click (function(){
		var thisCheck = $(this);
		$("#sxOfferPanel").slideToggle();
	});

}