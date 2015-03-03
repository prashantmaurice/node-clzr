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
