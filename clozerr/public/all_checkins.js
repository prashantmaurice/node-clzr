
function getBillHTML( checkin ){
  var str = "<h3 style='text-align:center' style='font-family:Roboto'>CLOZERR INVOICE</h3>"
      str += "<hr>"

      /*str += "<table class='table table-bordered' style='font-size:12px'><thead><tr>"
      str += "<th>Username</th>"
      str += "<th>User ID</th>"
      str += "<th>Offer ID</th>"
      str += "<th>Offer Caption</th>"

      str += "</tr></thead><tbody><tr>"

      str += "<td>" + checkin.user.profile.name + "</td>"
      str += "<td>" + checkin.user._id + "</td>"
      str += "<td>" + checkin.offer._id + "</td>"
      str += "<td>" + checkin.offer.caption + "</td>"

      str += "</tr></tbody></table>"
      str += "<hr>"*/
      return str;
}

var all_checkins = function( $rootScope, $scope, $http ){
  $scope.checkins = [];
  $scope.visibility = false;

  var CLOZERR_ALL_CHECKINS_URL = CLOZERR_API + "checkin/confirmed";

  $scope.update = function(){
    var access_token = localStorage.token;

    $scope.err = false;
    $scope.spinner = true;
    $scope.showData = false;
    $http.get( CLOZERR_ALL_CHECKINS_URL + "?access_token=" + access_token ).
    success( function( data, status, headers, config ) {
      $scope.checkins = data;
      $scope.spinner = false;
      $scope.showData = true;
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
