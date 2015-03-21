
var index_home_allreviews = function( $rootScope, $scope, $http ){
	
	$scope.visibility = false;
	$scope.getNumber = function(stars) {
		var avgst=0;
		for(var kw=0;kw<stars.length;kw++) {
			avgst = avgst + stars[kw];
		}
		if(stars.length!=0) {
			avgst = avgst/stars.length;
		}
		avgst = parseInt(avgst+"");
		return new Array(avgst);   
	}
	$scope.getStatusOfReviewStars = function(stars) {
		if(stars==undefined || stars==0 || stars=="0") {
			return "No ratings available";
		}
	}
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