function linechart(array,xkey,ykey,labels,chartname){
    var d = document.createElement("div");
    d.id=chartname;
    d.style.height='250px';
    var chartdiv=document.getElementById("charts");
    chartdiv.appendChild(d);
    var script=document.createElement("script");
    console.log(array);
    script.text="new Morris.Line({element: \'"+chartname+"\',data: "+JSON.stringify(array)+" ," +
    "xkey: \'"+xkey+"\' , ykeys: "+JSON.stringify(ykey)+" , labels: "+JSON.stringify(labels)+"});"
    console.log(script.text);
    chartdiv.appendChild(script);
}

function areachart(array,xkey,ykey,labels,chartname){
    var d = document.createElement("div");
    d.id=chartname;
    d.style.height='250px';
    var chartdiv=document.getElementById("charts");
    chartdiv.appendChild(d);
    var script=document.createElement("script");
    console.log(array);
    script.text="new Morris.Area({element: \'"+chartname+"\',data: "+JSON.stringify(array)+" ," +
    "xkey: \'"+xkey+"\' , ykeys: "+JSON.stringify(ykey)+" , labels: "+JSON.stringify(labels)+"});"
    console.log(script.text);
    chartdiv.appendChild(script);
}

function barchart(array,xkey,ykey,labels,chartname){
    var d = document.createElement("div");
    d.id=chartname;
    d.style.height='250px';
    var chartdiv=document.getElementById("charts");
    chartdiv.appendChild(d);
    var script=document.createElement("script");
    console.log(array);
    script.text="new Morris.Bar({element: \'"+chartname+"\',data: "+JSON.stringify(array)+" ," +
    "xkey: \'"+xkey+"\' , ykeys: "+JSON.stringify(ykey)+" , labels: "+JSON.stringify(labels)+"});"
    console.log(script.text);
    chartdiv.appendChild(script);
}

function getdonutarray(array,labels){
    var n=array.length,m=labels.length;
    var da="[";
    for(var i=0;i<n;i++){
        da=da+"{label : \'"+labels[i%m]+"\' , value : "+array[i]+" }";
        if(i<n-1) da=da+",";
    }
    return da+"]";
}

function donutchart(array,labels,chartname){
    var d = document.createElement("div");
    d.id=chartname;
    d.style.height='250px';
    var chartdiv=document.getElementById("charts");
    chartdiv.appendChild(d);
    var script=document.createElement("script");
    console.log(array);
    script.text="new Morris.Donut({element: \'"+chartname+"\',data: "+getdonutarray(array,labels)+"});"
    console.log(script.text);
    chartdiv.appendChild(script);
}
