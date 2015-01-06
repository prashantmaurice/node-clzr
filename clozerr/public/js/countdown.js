
var countdown = function( selector ){

  setInterval( function(){
    $( selector ).each(function( item ){
      var datetime = new Date( new Date() - new Date(  $(item).attr("data-time") ) );
      var inner_html = datetime.getUTCMinutes() + ":" + datetime.getUTCSeconds();
      $(item).html(inner_html);
    });
  }, 1000 );

}
