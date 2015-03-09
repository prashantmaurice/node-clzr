
function getBillHTML( checkin ){
  var str = "<h3 style='text-align:center' style='font-family:Roboto'>CLOZERR INVOICE</h3>"
  str += "<hr>"

  str += "<ul>"
      //str += "<li>Username</li>"
      //str += "<li>User ID</li>"
      //str += "<li>Offer ID</li>"
      //str += "<li>Offer Caption</li>"

      //str += "</tr></thead><tbody><tr>"

      str += "<li>Username: " + checkin.user.profile.name + "</li>"
      str += "<li>User ID:  " + checkin.user._id + "</li>"
      str += "<li>Offer ID: " + checkin.offer._id + "</li>"
      str += "<li>Offer:    " + checkin.offer.caption + "</li>"
      str += "<li>Timestamp:    " + new Date( checkin.date_created ).toString() + "</li>"

      //str += "</tr></tbody></table>"
      str += "</ul>"
      return str;
    }

    var all_checkins = function( $rootScope, $scope, $http, $window){
      $scope.checkins = [];
      $scope.visibility = false;

      $scope.popReview = {};
      $scope.popReview.question = [];
      $scope.popReview.stars = [5,3,4];
      $scope.popReview.question.push('How do you rate the food in our restaurant ?');
      $scope.popReview.question.push('How do you rate the ambience of our restaurant ?');
      $scope.popReview.question.push('How do you rate the hygeine in our restaurant ?');
      $scope.popReview.remarks = "Nothing special to say..";

      $scope.popUpReviewVisibility = false;

      $scope.showPopUpReview = function(event, review, index) {

        $scope.currentCheckinPos = index;
        $scope.popUpReviewX = event.clientX;
        $scope.popUpReviewY = event.clientY;
    //$scope.popReview = review;
    $scope.popUpReviewVisibility = true;
    $scope.popUpReviewStyle = {'position':'absolute','z-index':100,'background':'#fff','top':$scope.popUpReviewY-200,'left':$scope.popUpReviewX};
  }


  $scope.hidePopUpReview = function() {
   $scope.popUpReviewVisibility = false;
 }

 $scope.getArray = function(num) {
  return new Array(num);
}

$scope.getAvgStars = function(stars) {
  if(stars=="N/A") return "N/A";
  var avg = 0;
  for(var i=0;i<stars.length;i++) {
    avg = avg + stars[i];
  }
  return avg/5 + "/5.0";
}

var CLOZERR_VENDORS_URL = CLOZERR_API + "vendor";

$scope.notifyUser = function() {
  var strData = decodeURIComponent(jQuery.param({data:$scope.notifyUser.data}));
  $http.get( CLOZERR_VENDORS_URL + "/send/push" + "?vendor_id=" + $rootScope.vendor._id + "&user_id=" + $scope.checkins[$scope.currentCheckinPos].user._id + "&access_token=" + localStorage.token + "&" + strData).
  success(function(data, status, headers, config) {
    console.log(data);
    //hide the popup review
  }).error(function(data, status, headers, config) {
        //TODO : Throw error
      });
}

var CLOZERR_ALL_CHECKINS_URL = CLOZERR_API + "checkin/confirmed";

$scope.preprocess = function( checkin ){
  checkin.offer.caption = unescape(checkin.offer.caption);
  checkin.offer.description = unescape(checkin.offer.caption);
  if( !checkin.review ){
    checkin.review = { stars:"N/A", remarks:"N/A" }
  }
  else if(checkin.review.remarks==""||checkin.review.remarks==undefined) {
    checkin.review.remarks = "-NIL-";
  }
  return checkin;
}
$scope.update = function(){
  var access_token = localStorage.token;

  $scope.err = false;
  $scope.spinner = true;
  $scope.showData = false;
  $http.get( CLOZERR_ALL_CHECKINS_URL + "?access_token=" + access_token ).
  success( function( data, status, headers, config ) {
    $scope.checkins = data;
    console.log(data);
    $scope.spinner = false;
    $scope.showData = true;
    for(var i=0;i<$scope.checkins.length;i++) {
      $scope.checkins[i] = $scope.preprocess($scope.checkins[i]);
    }
  }).error( function( data, status, headers, config ) {
    $scope.err = true;
  });

}

$scope.createBill = function( checkin ){
  var doc = new jsPDF();

    // We'll make our own renderer to skip this editor
    var specialElementHandlers = {
      '#editor': function(element, renderer){
        return true;
      }
    };

    // All units are in the set measurement for the document
    // This can be changed to "pt" (points), "mm" (Default), "cm", "in"
    doc.fromHTML(getBillHTML( checkin ), 15, 15, {
      'width': 200,
      'elementHandlers': specialElementHandlers
    }, function(dispose){
      doc.save("bill-" + checkin._id + ".pdf");
    });

  }

  $scope.$on("page-all-checkins", function(){
    $scope.visibility = true;
    $scope.update();
  });

  $scope.$on("page-close", function(){
    $scope.visibility = false;
  });

  //$scope.update();
  /*
    TODO: Register for SocketIO messages here.
    */
  }
