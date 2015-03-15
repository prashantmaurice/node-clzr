
var index_home_allreviews = function( $rootScope, $scope, $http ){
	
	$scope.visibility = false;
	console.log('controller home-all-reviews');
	var PAGE_NAME = "home-all-reviews";
	$scope.$on("page-" + PAGE_NAME, function(){
		
		console.log($rootScope.allCheckinObjectsWithReviews);
		$scope.visibility = true;
	});
	$scope.$on("page-close", function(){
		$scope.visibility = false;
	});
}