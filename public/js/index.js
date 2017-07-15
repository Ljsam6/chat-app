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
  var li=jQuery('<li></li>');
  var a=jQuery('<a target="_blank">My Current Location</a>');
  li.text(`${message.from}:`);
  a.attr('href',message.url);
  li.append(a);
  jQuery('#messages').append(li);

});


socket.on('newMessage',function(message){
  console.log('message recieved:',message);
var li=jQuery('<li></li>');
li.text(`${message.from}:${message.text}`);

jQuery('#messages').append(li);

});

//geolocation
var locationButton=jQuery('#location');
  locationButton.on('click',function(){
  if(!navigator.geolocation){
    return alert('your browser does not support geoocation please switch to chrome');
  }
navigator.geolocation.getCurrentPosition(function(location){
   socket.emit('createlocation',{
     latitude:location.coords.latitude,
     longitude:location.coords.longitude
   });
},function(){
  alert('unable to fetch location');
});
});


jQuery('#message-form').on('submit',function (e){
  e.preventDefault();
  socket.emit('createMessage',{
   from:'user',
   text:jQuery('[name=message]').val()
 },function(){

 });
});
