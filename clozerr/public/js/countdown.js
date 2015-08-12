
var countdown = function( selector ){
  //console.log("Setting interval.");
  setInterval( function(){
    //console.log("Running for all: "+selector);
    //console.log(selector);
    //console.log($(selector));
    $( selector ).each(function( item ){
      //console.log("Detected one.");
     //var datetime =new Date( 10 * 60  - new Date( new Date().getUTCSeconds() - new Date(  $(this).attr("data-time") ).getUTCSeconds() ).getUTCSeconds());
      var datetime = new Date( 60*60*1000 - (new Date().getTime() - new Date(  $(this).attr("data-time") ).getTime()));
      var inner_html = datetime.getUTCMinutes() + ":" + datetime.getUTCSeconds();
	  if( datetime.getUTCMinutes() == 0 && datetime.getUTCSeconds() == 0 ){
		$(window).trigger("checkin-expired");
	  }
      //console.log(datetime);
      $(this).html(inner_html);
    });
/*
    var datetime = new Date( 10 * 60 * 1000 ) - new Date( new Date() - new Date(  $(this).attr("data-time") ) );
    console.log(datetime);
      var inner_html = datetime.getUTCMinutes() + ":" + datetime.getUTCSeconds();
      
      $(selector).html(inner_html);*/
  }, 1000 );

}
