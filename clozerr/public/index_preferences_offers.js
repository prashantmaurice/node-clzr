var punchCardType = function($scope, $rootScope, $http) {
	console.log("loaded - punchCardType");

	$scope.textInfoVis = [];
	$scope.hoverCheck = [];
	$scope.tempOffer = null;


	var CLOZERR_API = location.origin + '/';
	var CLOZERR_VENDORS_URL = CLOZERR_API + "vendor";
	var CLOZERR_OFFERS_URL = CLOZERR_API + "offer";

	$scope.removeOffer = function($index) {


		$http.get( CLOZERR_OFFERS_URL + "/delete?vendor_id=" + $rootScope.vendor._id + "&offer_id=" + $rootScope.vendor.offers[$index]._id + "&access_token=" + localStorage.token ).
		success(function(data, status, headers, config) {
			$rootScope.pageChange("home");
			$rootScope.pageChange("preferences");
			$rootScope.vendor.offers.splice($index,1);
		}).error(function(data, status, headers, config) {
		});
	}

	$scope.addOffer = function() {

		$scope.tempOffer = {};
		$scope.tempOffer.caption = "";
		$scope.textInfoVis[$rootScope.vendor.offers.length] = false;
		$scope.tempOffer.description = "";

		$http.get( CLOZERR_OFFERS_URL + "/create?caption=" + $scope.tempOffer.caption + "&description=" + $scope.tempOffer.description + "&access_token=" + localStorage.token ).
		success(function(data, status, headers, config) {
			console.log(data);
			$scope.tempOffer = data.data;
			console.log($scope.tempOffer);
			$scope.tempOffer.caption = "";
			$scope.tempOffer.description = "";
			$rootScope.vendor.offers.push($scope.tempOffer);

			$http.get( CLOZERR_VENDORS_URL + "/addoffer?vendor_id=" + $rootScope.vendor._id + "&offer_id=" + data.data._id + "&access_token=" + localStorage.token ).
			success(function(data, status, headers, config) {
				console.log(data);
				$rootScope.pageChange("home");
				$rootScope.pageChange("preferences");
			}).error(function(data, status, headers, config) {
			});
		}).error(function(data, status, headers, config) {
		});	
	}	

	$scope.showPunchCardInputs = function() {
		console.log('true here')

		$scope.num = $rootScope.vendor.offers.length;
		for(var i=1;i<=$scope.num;i++) {
			$scope.textInfoVis.push(true);
			$scope.hoverCheck.push(false);
		}

		console.log($rootScope.vendor.offers);

		$scope.num = $rootScope.vendor.offers.length;

		console.log($scope.num);

		for(var i=1;i<=$scope.num;i++) {	
			$scope.textInfoVis.push(true);
			$scope.hoverCheck.push(false);
			$rootScope.vendor.offers[i-1].caption = unescape($rootScope.vendor.offers[i-1].caption);			
			$rootScope.vendor.offers[i-1].description = unescape($rootScope.vendor.offers[i-1].description);
			console.log($rootScope.vendor.offers[i-1].caption);
		}
	}

	$scope.$on('showPunchCardInputs', $scope.showPunchCardInputs);

	$scope.savePunchCardInputs = function() {
		console.log($rootScope.vendor.offers);
	}
	$scope.toggleEditSaveOffer = function(offer, $index) {
		if($scope.textInfoVis[$index]) {
			$scope.textInfoVis[$index] = false;
		}
		else {
			var access_token = localStorage.token;
			if($scope.tempOffer)
				$rootScope.vendor.offers[$index] = $scope.tempOffer;
			$http.get( CLOZERR_OFFERS_URL + "/update?offer_id=" + $rootScope.vendor.offers[$index]._id + "&caption=" + $rootScope.vendor.offers[$index].caption + "&description=" + $rootScope.vendor.offers[$index].description + "&access_token=" + access_token + "&type=" + $rootScope.vendor.offers[$index].type + "&stamps=" + ($index + 1)).
			success(function(data, status, headers, config) {
				console.log(data);
				$scope.textInfoVis[$index] = true;
			}).error(function(data, status, headers, config) {
			});
			$scope.tempOffer = null;
		}
	}
	$scope.toggleHover = function($index) {
		$scope.hoverCheck[$index] = !$scope.hoverCheck[$index];
	}
}