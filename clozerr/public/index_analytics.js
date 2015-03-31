 var index_analytics = function( $rootScope, $scope, $http ) {

  $scope.visibility = false;
  console.log("index_analytics loaded");
  var PAGE_NAME = "analytics";
  $scope.$on("page-" + PAGE_NAME, function(){
    $scope.visibility = true;
  console.log("index_analytics onned");
    $rootScope.$broadcast('page-analytics');
  });
     var CLOZERR_ANALYTICS = location.origin + '/analytics';
  $scope.$on("page-close", function(){
   $scope.visibility = false;
      var getGAData=function(startdate,enddate,metrics,dimensions,filter,callback){
          $http.get(CLOZERR_ANALYTICS+"?metric="+metrics+"dimensions="+dimensions+"startdate="+startdate+"enddate="+enddate+"filter="+filter)
              .success(function(data){
                  console.log(data);
                  callback(data);
              })
          ;
      }
      $scope.userData=function (startdate,enddate){
          var userChartData=[];
          for(var date=startdate,date2=startdate;date2<=enddate;date=date2){
              date2.setDate(date.getDate()+1);
              getGAData(date,date2,"ga:screenviews","ga:screenName","ga:screenName==MyCards",function(result){
                  userChartData.push({date:result.rows[0]});
              });
          }
          console.log(userChartData);
      }
 });
};