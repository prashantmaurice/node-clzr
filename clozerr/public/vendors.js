var vendor_list = function( $rootScope, $scope, $http ){

	$scope.vendors = [];
	$scope.visibility = false;

	var CLOZERR_VENDORS_URL = CLOZERR_API + "vendor";

	$scope.load_vendors = function() {

		var access_token = localStorage.admin_token;

		$http.get( CLOZERR_VENDORS_URL + "/get/all" + "?access_token=" + access_token).
		success(function(data, status, headers, config) {
			$scope.vendors = data;
		}).error(function(data, status, headers, config) {
			/*
			TODO: Throw error here.
			*/
		});

	}

	$scope.edit = function( vendor ){
		console.log( vendor );
		$rootScope.vendor_to_edit = vendor;
		$rootScope.pageChange("vendors");
	}

	$scope.$on("page-vendor-list", function(){
		$scope.visibility = true;
		$scope.load_vendors();
	});

	$scope.$on("page-close", function(){
		$scope.visibility = false;
	});

	$scope.create_vendor = function() {
		var access_token = localStorage.admin_token;
		$http.get( CLOZERR_VENDORS_URL + "/create" + "?access_token=" + access_token  + "&latitude=0&longitude=0&image=default&fid=0&name=default").
		success(function(data, status, headers, config) {
			$http.get( CLOZERR_API +  "auth/create" + "?access_token=" + access_token  + "&vendor_id=" + data.data._id + "&username=" + $("#vendor_username").val() ).
			success(function(data, status, headers, config) {
				$scope.load_vendors();
			}).error(function(data, status, headers, config) {
				/*
				TODO: Throw error here.
				*/
			});

		}).error(function(data, status, headers, config) {
			/*
			TODO: Throw error here.
			*/
		});
	}


}
function directUploadToS3(){
	$(function() {

		$('.direct-upload').each(function() {

			var form = $(this)

			$(this).fileupload({
				url: form.attr('action'),
				type: 'POST',
				autoUpload: true,
				dataType: 'xml', // This is really important as s3 gives us back the url of the file in a XML document
				add: function (event, data) {
					$.ajax({
						url: "/signed_urls",
						type: 'GET',
						dataType: 'json',
						data: {doc: {title: data.files[0].name}}, // send the file name to the server so it can generate the key param
						async: false,
						success: function(data) {
							// Now that we have our data, we update the form so it contains all
							// the needed data to sign the request
							form.find('input[name=key]').val(data.key)
							form.find('input[name=policy]').val(data.policy)
							form.find('input[name=signature]').val(data.signature)
						}
					})
					data.submit();
				},
				send: function(e, data) {
					$('.progress').fadeIn();
				},
				progress: function(e, data){
					// This is what makes everything really cool, thanks to that callback
					// you can now update the progress bar based on the upload progress
					var percent = Math.round((e.loaded / e.total) * 100)
					$('.bar').css('width', percent + '%')
				},
				fail: function(e, data) {
					console.log('fail')
				},
				success: function(data) {
					// Here we get the file url on s3 in an xml doc
					var url = $(data).find('Location').text()

					$('#real_file_url').val(url) // Update the real input in the other form
				},
				done: function (event, data) {
					$('.progress').fadeOut(300, function() {
						$('.bar').css('width', 0)
					})
				},
			})
		})
	})
}

var vendor_update = function( $rootScope, $scope, $http) {

	var CLOZERR_VENDORS_URL = CLOZERR_API + "vendor";

	$scope.update_vendor = function(vendor) {

		var access_token = localStorage.admin_token;
		$http.get(CLOZERR_VENDORS_URL + "/update?access_token=" + access_token + "&vendor_id=" + vendor._id + "&vendor_name=" + vendor.name + "&latitude=" + vendor.location[0] + "&longitude=" + vendor.location[1] +"&fid=" + vendor.fid + "&image=" + vendor.image + "&description=" + vendor.description + "&phone=" + vendor.phone + "&city=" + vendor.city + "&address=" + vendor.address + "&visible=" + vendor.visible + "&resource_name=" + vendor.resource_name ).
		success(function(data, status, headers, config) {
			//redirect


		}).error(function(data, status, headers, config) {
			/*
			TODO: Throw error here.
			*/
		});

	}

	$scope.load_vendor = function(){
		$scope.vendor = $rootScope.vendor_to_edit;
		$http.get(CLOZERR_VENDORS_URL + "/get?vendor_id=" + $scope.vendor._id ).
		success(function(data, status, headers, config) {
			//redirect
			$scope.vendor = data;

		}).error(function(data, status, headers, config) {
			/*
			TODO: Throw error here.
			*/
		});
	}

	$scope.new_offer = function( vendor ){
		$http.get(CLOZERR_API + "offer/create?vendor_id=" + $scope.vendor._id + "&access_token=" + localStorage.admin_token ).
		success(function(data, status, headers, config) {
			//redirect
			$http.get(CLOZERR_VENDORS_URL + "/addoffer?vendor_id=" + $scope.vendor._id + "&access_token=" + localStorage.admin_token + "&offer_id=" + data.data._id ).
			success(function(data, status, headers, config) {
				//redirect
				$scope.vendor = data.data;

			}).error(function(data, status, headers, config) {
				/*
				TODO: Throw error here.
				*/
			});
			//$scope.vendor = data;

		}).error(function(data, status, headers, config) {
			/*
			TODO: Throw error here.
			*/
		});
	}

	$scope.edit_offer = function( offer ){
		console.log( offer );
		$rootScope.offer_to_edit = offer;
		$rootScope.pageChange("offers");
	}


	$scope.$on("page-vendors", function(){
		//$scope.vendor = $rootScope.vendor_to_edit;
		$scope.load_vendor();
		$scope.visibility = true;
	});

	$scope.$on("page-close", function(){
		$scope.visibility = false;
	});
}


var offers = function( $rootScope, $scope, $http) {

	var CLOZERR_OFFERS_URL = CLOZERR_API + "offer";

	$scope.update_offer = function(offer) {

		var access_token = localStorage.admin_token;
		var offer = $scope.offer;
		$http.get(CLOZERR_OFFERS_URL + "/update?access_token=" + access_token + "&offer_id=" + offer._id + "&type=" + offer.type + "&description=" + encodeURIComponent( offer.description ) + "&caption=" + encodeURIComponent( offer.caption ) + "&stamps=" + offer.stamps ).
		success(function(data, status, headers, config) {
			//redirect

		}).error(function(data, status, headers, config) {
			/*
			TODO: Throw error here.
			*/
		});

	}

	$scope.load_offer = function(){
		$scope.offer = $rootScope.offer_to_edit;
		$http.get(CLOZERR_OFFERS_URL + "/get?offer_id=" + $scope.offer._id ).
		success(function(data, status, headers, config) {
			//redirect
			$scope.offer = data.data;

		}).error(function(data, status, headers, config) {
			/*
			TODO: Throw error here.
			*/
		});
	}

	$scope.$on("page-offers", function(){
		//$scope.vendor = $rootScope.vendor_to_edit;
		$scope.load_offer();
		$scope.visibility = true;
	});

	$scope.$on("page-close", function(){
		$scope.visibility = false;
	});
}
