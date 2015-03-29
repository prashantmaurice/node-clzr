
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
	$scope.getAvgStars = function(stars) {
		if(stars=="N/A") return "N/A";
		var avg = 0;
		for(var i=0;i<stars.length;i++) {
			avg = avg + stars[i];
		}
		avg = avg/stars.length;
		avg = avg.toFixed(2);
		return avg + "/5.00";
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