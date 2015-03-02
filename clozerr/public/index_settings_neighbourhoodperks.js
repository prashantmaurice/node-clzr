var index_settings_neighbourhoodperks = function ($scope, $rootScope, $http) {

	//TODO : initialise with the values over there

	$('#checkneighbourhoodperks').click (function(){
		var thisCheck = $(this);
		$("#neighbourhoodperksPanel").slideToggle();
	});

}