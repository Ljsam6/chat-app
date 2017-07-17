var socket=io();

socket.on('connect', function(){
  console.log('connected to server');


  // socket.emit('createMessage',{
    // from:'josly',
  //   text:'yo wassup bro'
  // });
 });



socket.on('disconnect',function(){
  console.log('disconnected from client');
});
//location listener
socket.on('newLocationMessage',function(message){
  var sendAt=moment(message.time).format('h:mm a');

  var template=jQuery('#location-message-template').html();
  var html=Mustache.render(template,{
    from:message.from,
    url:message.url,
    time:sendAt
  });
  jQuery('#messages').append(html);
  // var li=jQuery('<li></li>');
  // var a=jQuery('<a target="_blank">My Current Location</a>');
  // li.text(`${message.from} ${sendAt}:`);
  // a.attr('href',message.url);
  // li.append(a);
  // jQuery('#messages').append(li);
});

//new message
socket.on('newMessage',function(message){
  var sendAt=moment(message.time).format('h:mm a');

var template=jQuery('#message-template').html();
var html=Mustache.render(template,{
   from:message.from,
  text:message.text,
  time:sendAt
});
jQuery('#messages').append(html);

});

//geolocation
var locationButton=jQuery('#location');
  locationButton.on('click',function(){

    if(!navigator.geolocation){
    return alert('your browser does not support geolocation please switch to chrome');
  }
  locationButton.attr('disabled','disabled').text('Sending location...');

navigator.geolocation.getCurrentPosition(function(location){
  locationButton.removeAttr('disabled').text('Send location');
   socket.emit('createlocation',{
     latitude:location.coords.latitude,
     longitude:location.coords.longitude
   });
},function(){
  locationButton.attr('disabled');
alert('unable to fetch location');
});
});


jQuery('#message-form').on('submit',function (e){
  e.preventDefault();
  socket.emit('createMessage',{
   from:'user',
   text:jQuery('[name=message]').val()
 },function(){
   jQuery('[name=message]').val('')

 });
});
