var offer_list = function( $scope, $http) {
  $scope.offers = [];
  $scope.visibility = false;

  var CLOZERR_OFFERS_URL = CLOZERR_API + "/offer";

  $scope.load_offers = function() {
    var access_token = localStorage.token;
    $http.get( CLOZERR_OFFERS_URL + "/getmyoff" + "?access_token=" + access_token).
    success(function(data, status, headers, config) {
      $scope.offers = data;
    }).error(function(data, status, headers, config) {
      /*
          TODO: Throw error here.
          */
        });
  }

  $scope.$on("page-offer-list", function(){
    $scope.visibility = true;
  });

  $scope.$on("page-close", function(){
    $scope.visibility = false;
  });
}

var offer_update = function( $scope, $http) {

  var CLOZERR_OFFERS_URL = CLOZERR_API + "/offer";

  $scope.update_offer = function(offer) {

    var access_token = localStorage.token;
    $http.get(CLOZERR_OFFERS_URL + "/update?access_token=" + access_token + "&offer_id=" + offer._id + "&type=" + offer.type + "&caption=" + offer.caption + "&stamps" + offer.stamps +"&description=" + offer.description ).
    success(function(data, status, headers, config) {
      //redirect
      $('#offer_list').attr('style','display:inline');
      $('#create_form').attr('style','display:none');
      $('#update_form').attr('style','display:none');

    }).error(function(data, status, headers, config) {
        /*
            TODO: Throw error here.
          */
        });
  }

  $scope.$on("page-offer-update", function(){
    $scope.visibility = true;
  });

  $scope.$on("page-close", function(){
    $scope.visibility = false;
  });
}

var offer_create = function( $scope, $http) {

  $scope.create_offer = function() {
    $http.get( CLOZERR_OFFERS_URL + "/create" + "?access_token=" + access_token + "&offer_id=" + offer._id + "&type=" + offer.type + "&caption=" + offer.caption + "&stamps" + offer.stamps +"&description=" + offer.description ).
    success(function(data, status, headers, config) {
      $scope.update_vendor(data);
    }).error(function(data, status, headers, config) {
      /*
          TODO: Throw error here.
          */
        }); 
  }

  $scope.$on("page-vendor-create", function(){
    $scope.visibility = true;
  });

  $scope.$on("page-close", function(){
    $scope.visibility = false;
  });

}