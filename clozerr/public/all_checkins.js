
function getBillHTML( checkin , convertToPDF){

  var c = document.getElementById("canvasBill");
  var ctx = c.getContext("2d");

  var dataInBillCaptions = [];
  dataInBillCaptions.push("Username");
  dataInBillCaptions.push("Offer");
  dataInBillCaptions.push("Offer level");
  dataInBillCaptions.push("Timestamp");

  var dataInBillValues = [];
  dataInBillValues.push(checkin.user.profile.name);
  dataInBillValues.push(checkin.offer.caption);
  dataInBillValues.push(checkin.offer.stamps);
  dataInBillValues.push( new Date( checkin.date_created ).toString());

  ctx.font = "20px Georgia";

  var imgClozerrNav = new Image();

  imgClozerrNav.src = '/clozerr-nav.png';

  imgClozerrNav.onload = function() {
    ctx.drawImage(imgClozerrNav, 0, 0);
    console.log('loaded');
    for(var i=0;i<dataInBillValues.length;i++) {
    ctx.fillText(dataInBillCaptions[i], 100, 40*i + 200);
    ctx.fillText(dataInBillValues[i], 300, 40*i + 200);
  }
  var imgData = c.toDataURL();
  convertToPDF(imgData);
  };


  

 /* function downloadCanvas(link, canvasId, filename) {
    link.href = document.getElementById(canvasId).toDataURL();
    link.download = filename;
  }

  document.getElementById('download').addEventListener('click', function() {
    downloadCanvas(this, 'canvasBill', 'test.pdf');
  }, false);
*/
}
/*
function downloadCanvas(link, canvasId, filename) {
    link.href = document.getElementById(canvasId).toDataURL();
    link.download = filename;
  } */

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
  getBillHTML(checkin, function(imgData) {
    var doc = new jsPDF();
    doc.addImage(imgData, "JPEG", 0, 0);
    doc.save();
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
