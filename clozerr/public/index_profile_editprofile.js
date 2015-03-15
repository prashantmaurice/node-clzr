
var index_profile_editprofile = function( $rootScope, $scope, $http) {
	var CLOZERR_API = location.origin + '/';
	var CLOZERR_VENDORS_URL = CLOZERR_API + "vendor";
  $scope.myImage='';
  $scope.myCroppedImage='';
  var policy,signature;
  
  $scope.focusShowNothing = function() {
    console.log("focussed");		
    $('#statusLocationIndicator').removeClass('fa fa-spinner fa-pulse fa-2x');
    $('#statusLocationIndicator').removeClass('fa fa-times fa-2x');
    $('#statusLocationIndicator').removeClass('fa fa-check fa-2x');
    $('#statusLocationIndicator').addClass('fa fa-spinner fa-pulse fa-2x');
  }

  $scope.UploadPhoto=function(){

    
  }

  $scope.getAddress = function(lat, lon) {
    $http.get( "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + lon).
    success(function(data, status, headers, config) {
     console.log(data);
     $scope.vendorAddressRevGeoCoded = data.results[0].formatted_address;
   }).error(function(data, status, headers, config) {

   });
 }
 $scope.$on('page-editprofile',function() {
  $scope.vendorAddressRevGeoCoded = $scope.getAddress($rootScope.vendor.location[0],$rootScope.vendor.location[1]);
});	

 $scope.getLocation = function(address) {
  var geocoder = new google.maps.Geocoder();
  console.log('blurred');
  $('#statusLocationIndicator').removeClass('fa fa-spinner fa-pulse fa-2x');
  geocoder.geocode({ 'address': address }, function (results, status) {

   if (status == google.maps.GeocoderStatus.OK) {
    var latitude = results[0].geometry.location.lat();
    var longitude = results[0].geometry.location.lng();
    console.log('latitude : ' + latitude);
    console.log('longitude : ' + longitude);	

    $scope.vlatitude = latitude;
    $scope.vlongitude = longitude;

    $rootScope.vendor.location[0] = $scope.vlatitude;
    $rootScope.vendor.location[1] = $scope.vlongitude;

    $('#statusLocationIndicator').addClass('fa fa-check fa-2x');
  } else {		
    $('#statusLocationIndicator').addClass('fa fa-times fa-2x');
  }

});
}
var CLOZERR_PASSWORD_URL = CLOZERR_API + "auth/reset/password";
$scope.wrongData = false;
$scope.wrongPassword = false;
$scope.verifyPasswordChange = function(){
  if( !( $("#new_password_again").val() == $("#new_password").val() ) ){
   console.log("Password mismatch");
   $scope.wrongData = true;
   $scope.wrongPassword = false;
   return;
 }
 else $scope.wrongData = false;
 $http.get( CLOZERR_API + "auth/login/verifypassword?username=" + $rootScope.user.username + "&password=" + $("#old_password").val() ).
 success(function(data, status, headers, config) {

   if(data.result) {

    $scope.wrongPassword = false;
    $http.get( CLOZERR_PASSWORD_URL + "?access_token=" + localStorage.token + "&new_password=" + $("#new_password").val() ).
    success(function(data, status, headers, config) {
     $scope.wrongData = false;

     $("#new_password_again").val('');
     $("#new_password").val('');
     $("#old_password").val('');
     $('#modalChangePassword').modal('hide');

     $scope.getDetails();
   }).error(function(data, status, headers, config) {

   });

 }
 else $scope.wrongPassword = true;
 
}).error(function(data, status, headers, config) {

});
}

$scope.getDetails = function(){
  var CLOZERR_PROFILE_URL = CLOZERR_API + "auth/profile";
  var CLOZERR_VENDOR_URL = CLOZERR_API + "vendor/get";

  $http.get(CLOZERR_PROFILE_URL + "?access_token=" + localStorage.token).
  success(function(data, status, headers, config) {
   console.log( data );
   $rootScope.user = data;

   $http.get(CLOZERR_VENDOR_URL + "?vendor_id=" + $rootScope.user.vendor_id).
   success(function(data, status, headers, config) {
    console.log( data );
    $rootScope.vendor = data;
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
var upload=angular.module('clozerr',['ngImgCrop','ngSanitize', 'ngS3upload']);	

function Ctrl($scope, $rootScope) {
  $scope.myImage='';
  $scope.myCroppedImage='';
       /* $scope.files = {
       };*/
    	//$scope.options=

      $scope.openPhotoUploadDialog = function() {
        $('#fileInput').trigger('click');
      }

      $scope.performUpload = false;
      var handleFileSelect=function(evt) {
        console.log(evt);
        var file=evt.currentTarget.files[0];
        $rootScope.file=file;
          //$scope.fil=file;
          var reader = new FileReader();
          reader.onload = function (evt) {
            console.log('loaded');
            $scope.$apply(function($scope){
              $scope.myImage=evt.target.result;
              console.log(evt.target.result);
              console.log($scope.myImage.size);
              console.log($scope.myCroppedImage);
              $scope.key=''+ + (new Date()).getTime() + '-' + randomString(16);
          //console.log($scope.fil);
          $rootScope.myCroppedImage=$scope.myCroppedImage;
        });
          };
          reader.readAsDataURL(file);
        };
        $scope.$watch('myCroppedImage', function(newValue, oldValue) {
         console.log($scope.myCroppedImage);
       });
        $scope.$watch('performUpload',function(newValue,oldValue){
        	console.log($scope.performUpload);
        	if($scope.performUpload==true){
        		console.log(true);
        		console.log($rootScope.file[0]);
        		upload_image($scope,'https://clozerr.s3.amazonaws.com/',$scope.key,'public-read','jpg',$rootScope.options.key,$rootScope.options.policy,
        			$rootScope.options.signature,
        			$rootScope.file);
        	}
        })
        angular.element(document.querySelector('#fileInput')).on('change',handleFileSelect);
      };
      function upload_image(scope, uri, key, acl, type, accessKey, policy, signature, file) {
      //var deferred = $q.defer();
      scope.attempt = true;
      console.log(file);
      var fd = new FormData();
      fd.append('key', key);
      fd.append('acl', acl);
      fd.append('Content-Type', file.type);
      fd.append('AWSAccessKeyId', accessKey);
      fd.append('policy', policy);
      fd.append('signature', signature);
      fd.append("file", file);

      var xhr = new XMLHttpRequest();
      xhr.upload.addEventListener("progress", uploadProgress, false);
      xhr.addEventListener("load", uploadComplete, false);
      xhr.addEventListener("error", uploadFailed, false);
      xhr.addEventListener("abort", uploadCanceled, false);
      scope.$emit('s3upload:start', xhr);

      // Define event handlers
      function uploadProgress(e) {
        scope.$apply(function () {
          if (e.lengthComputable) {
            scope.progress = Math.round(e.loaded * 100 / e.total);
          } else {
            scope.progress = 'unable to compute';
          }
          var msg = {type: 'progress', value: scope.progress};
          scope.$emit('s3upload:progress', msg);
          /*if (typeof deferred.notify === 'function') {
            deferred.notify(msg);
          }*/

        });
      }
      function uploadComplete(e) {
        var xhr = e.srcElement || e.target;
        scope.$apply(function () {
          self.uploads--;
          scope.uploading = false;
          if (xhr.status === 204) { // successful upload
            scope.success = true;
            //deferred.resolve(xhr);
            scope.$emit('s3upload:success', xhr, {path: uri + key});
          } else {
            scope.success = false;
            //deferred.reject(xhr);
            scope.$emit('s3upload:error', xhr);
          }
        });
      }
      function uploadFailed(e) {
        var xhr = e.srcElement || e.target;
        scope.$apply(function () {
          self.uploads--;
          scope.uploading = false;
          scope.success = false;
          //deferred.reject(xhr);
          scope.$emit('s3upload:error', xhr);
        });
      }
      function uploadCanceled(e) {
        var xhr = e.srcElement || e.target;
        scope.$apply(function () {
          self.uploads--;
          scope.uploading = false;
          scope.success = false;
          //deferred.reject(xhr);
          scope.$emit('s3upload:abort', xhr);
        });
      }

      // Send the file
      scope.uploading = true;
      this.uploads++;
      xhr.open('POST', uri, true);
      xhr.send(fd);

      //return deferred.promise;
    };
    function randomString(length) {
      var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
      var result = '';
      for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];

        return result;
    };
