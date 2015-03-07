var sample_checkins=[
    {
        "date_created" : new Date("2015-01-12T11:57:34.727Z")
    }

    ,
    {
        "date_created" : new Date("2015-01-12T12:30:42.555Z")
    }

    ,
    {
        "date_created" : new Date("2015-01-12T12:34:33.327Z")
    }

    ,
    {
        "date_created" : new Date("2015-01-12T12:35:59.735Z")
    }

    ,
    {
        "date_created" : new Date("2015-01-12T13:12:10.771Z")
    }

    ,
    {
        "date_created" : new Date("2015-01-12T13:19:41.339Z")
    }

    ,
    {
        "date_created" : new Date("2015-01-12T17:56:05.279Z")
    }

    ,
    {
        "date_created" : new Date("2015-01-12T19:19:02.848Z")
    }

    ,
    {
        "date_created" : new Date("2015-01-13T09:25:01.424Z")
    }

    ,
    {
        "date_created" : new Date("2015-01-13T10:17:29.642Z")
    }

    ,
    {
        "date_created" : new Date("2015-01-13T10:17:36.574Z")
    }

    ,
    {
        "date_created" : new Date("2015-01-13T10:17:47.895Z")
    }

    ,
    {
        "date_created" : new Date("2015-01-13T10:18:51.584Z")
    }

    ,
    {
        "date_created" : new Date("2015-01-13T11:54:39.312Z")
    }

    ,
    {
        "date_created" : new Date("2015-01-13T15:46:11.032Z")
    }

    ,
    {
        "date_created" : new Date("2015-01-13T16:38:29.226Z")
    }

    ,
    {
        "date_created" : new Date("2015-01-13T18:30:14.183Z")
    }

    ,
    {
        "date_created" : new Date("2015-01-14T11:53:16.960Z")
    }

    ,
    {
        "date_created" : new Date("2015-01-14T11:53:27.817Z")
    }

    ,
    {
        "date_created" : new Date("2015-01-14T11:53:32.945Z")
    }

    ,
    {
        "date_created" : new Date("2015-01-14T12:05:43.418Z")
    }

    ,
    {
        "date_created" : new Date("2015-01-14T12:07:02.283Z")
    }

    ,
    {
        "date_created" : new Date("2015-01-14T12:49:09.432Z")
    }

    ,
    {
        "date_created" : new Date("2015-01-14T13:42:17.090Z")
    }

    ,
    {
        "date_created" : new Date("2015-01-14T14:16:54.380Z")
    }

    ,
    {
        "date_created" : new Date("2015-01-14T14:36:58.305Z")
    }

    ,
    {
        "date_created" : new Date("2015-01-14T14:41:30.262Z")
    }

    ,
    {
        "date_created" : new Date("2015-01-14T14:54:58.114Z")
    }

    ,
    {
        "date_created" : new Date("2015-01-14T14:56:41.560Z")
    }

    ,
    {
        "date_created" : new Date("2015-01-14T15:45:47.921Z")
    }

    ,
    {
        "date_created" : new Date("2015-01-14T16:27:03.677Z")
    }

    ,
    {
        "date_created" : new Date("2015-01-14T16:27:30.573Z")
    }

    ,
    {
        "date_created" : new Date("2015-01-14T16:44:41.007Z")
    }

    ,
    {
        "date_created" : new Date("2015-01-14T17:06:27.259Z")
    }

    ,
    {
        "date_created" : new Date("2015-01-14T17:59:27.346Z")
    }

    ,
    {
        "date_created" : new Date("2015-01-14T19:46:48.141Z")
    }

    ,
    {
        "date_created" : new Date("2015-01-15T06:41:22.446Z")
    }

    ,
    {
        "date_created" : new Date("2015-01-15T07:01:07.051Z")
    }

    ,
    {
        "date_created" : new Date("2015-01-15T10:31:05.299Z")
    }

    ,
    {
        "date_created" : new Date("2015-01-15T10:32:26.123Z")
    }

    ,
    {
        "date_created" : new Date("2015-01-15T12:37:07.041Z")
    }

    ,
    {
        "date_created" : new Date("2015-01-15T14:46:11.747Z")
    }

    ,
    {
        "date_created" : new Date("2015-01-15T14:48:36.354Z")
    }

    ,
    {
        "date_created" : new Date("2015-01-15T16:32:52.279Z")
    }

    ,
    {
        "date_created" : new Date("2015-01-15T17:17:40.828Z")
    }

    ,
    {
        "date_created" : new Date("2015-01-15T17:18:37.593Z")
    }

    ,
    {
        "date_created" : new Date("2015-01-15T17:55:25.349Z")
    }

    ,
    {
        "date_created" : new Date("2015-01-15T19:08:06.923Z")
    }

    ,
    {
        "date_created" : new Date("2015-01-15T19:57:24.095Z")
    }

    ,
    {
        "date_created" : new Date("2015-01-15T20:03:00.962Z")
    }];

function checkin_chart(checkin_array){
    var data={};
    var dates=[];
    for(var i=0;i<checkin_array.length;i++){
        var checkin_date=checkin_array[i].date_created;
        var date=(checkin_date.toISOString().split('T'))[0];
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

function date_month(date){
    var splt=date.toString().split(" ");
    return splt[0]+","+splt[1]+ " "+splt[2];
    //return date.toString();
}
