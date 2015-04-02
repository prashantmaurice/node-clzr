 
function checkin_date_data(checkin_array){
  var data={};
  var dates=[];
  for(var i=0;i<checkin_array.length;i++){
    var checkin_date=new Date(checkin_array[i].date_created);
    var date=(checkin_date.getFullYear()+"-"+(checkin_date.getMonth()+1)+"-"+checkin_date.getDate());
    console.log(checkin_date.toString());
    var date_obj=data[date] || {count : 0};
    if(!data[date]) dates.push(date);
    date_obj.count++;
    data[date]=date_obj;
  }
  var table=[];
  for(var i=0;i<dates.length;i++){
    var entry={date:dates[i] , visits:data[dates[i]].count};
    table.push(entry);
  }
  return table;
}

function checkin_time_day_data(checkin_array){
  var table=[];
  for(var i=0;i<24;i++) {
    table[i]=[];
    for(var j=0;j<7;j++){
      table[i][j]=0;
    }
  }
  for(var i=0;i<checkin_array.length;i++){
    var checkin_date=new Date(checkin_array[i].date_created);
    table[checkin_date.getHours()][checkin_date.getDay()]++;
  }
  var table2=[[],[],[]];
  for(var i=0;i<24;i++) {
    for(var j=0;j<7;j++){
      table2[0].push(i);
      table2[1].push(j);
      table2[2].push(table[i][j]);
    }
  }
  return table2;
}

function date_month(date){
  var splt=date.toString().split(" ");
  return splt[0]+","+splt[1]+ " "+splt[2];
    //return date.toString();
  }

  var index_analytics = function( $rootScope, $scope, $http ) {

    $scope.visibility = false;
    console.log("index_analytics loaded");
    var PAGE_NAME = "analytics";
    $scope.$on("page-" + PAGE_NAME, function(){
      $scope.visibility = true;
    });
    var CLOZERR_ANALYTICS = location.origin + '/analytics';
    $scope.$on("page-close", function(){
     $scope.visibility = false;
     var getGAData=function(startdate,enddate,metrics,dimensions,filter,callback){
      $http.get(CLOZERR_ANALYTICS+"?metric="+metrics+"dimensions="+dimensions+"startdate="+startdate+"enddate="+enddate+"filter="+filter)
      .success(function(data){
        console.log(data);
        callback(data);
      });
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
    var flag = 0;
    $rootScope.loadAnalytics = function() {
      if(flag==0) {
        var r = Raphael("checkin_day_time"),
        axisy = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        axisx = ["12am", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12pm", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"];
        var dt_table=checkin_time_day_data($rootScope.allCheckinObjects);
        var xs=dt_table[0],ys=dt_table[1],data=dt_table[2];
        r.dotchart(10, 10, 620, 260, xs, ys, data, {symbol: "o", max: 10, heat: false, axis: "0 0 1 1", axisxstep: 23, axisystep: 6, axisxlabels: axisx, axisxtype: " ", axisytype: " ", axisylabels: axisy}).
        hover(function () {
          if(this.value>0) {
            this.marker = this.marker || r.tag(this.x, this.y, "Visits : " + this.value, 0, this.r + 2).insertBefore(this);
            this.marker.show();
          }
        }, function () {
          this.marker && this.marker.hide();
        });
        Morris.Line({
          element: 'checkin_date',
          data: checkin_date_data($rootScope.allCheckinObjects),
          xkey: 'date',
          xLabels: 'day',
          ykeys: ['visits'],
          labels: ['Visits'],
          xLabelFormat: date_month,
          xLabelAngle: 60
        });
        flag++;
      }
    }
  };