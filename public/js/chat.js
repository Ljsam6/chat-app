var socket=io();

function scrollToBottom(){
  var messages=jQuery('#messages');
  var newMessage=messages.children('li:last-child')
  //heights
var scrollTop=messages.prop('scrollTop');
  var clientHeight=messages.prop('clientHeight');
  var scrollHeight=messages.prop('scrollHeight');
  var newMessageHeight=newMessage.innerHeight();
  var lastMessageHeight=newMessage.prev().innerHeight();

  if(scrollTop+clientHeight+newMessageHeight+lastMessageHeight >= scrollHeight){
    messages.scrollTop(scrollHeight);
  }
}

socket.on('connect', function(){
  console.log('connected to server');
   var params=jQuery.deparam(window.location.search);
socket.emit('join',params,function(err)
{
  if(err){
    window.location.href='/'
    alert(err);
  }
  else{
    console.log('no err');
  }
});


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
  scrollToBottom();

  // var li=jQuery('<li></li>');
  // var a=jQuery('<a target="_blank">My Current Location</a>');
  // li.text(`${message.from} ${sendAt}:`);
  // a.attr('href',message.url);
  // li.append(a);
  // jQuery('#messages').append(li);

});
socket.on('updateUserList',function(users){
  var ol=jQuery('<ol></ol>');

  users.forEach(function(user){
    ol.append(jQuery('<li></li>').text(user));
  });

  jQuery('#users').html(ol);
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
scrollToBottom();
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

var messageTextBox=jQuery('[name=message]');

  socket.emit('createMessage',{
   text: messageTextBox.val()
 },function(){
    messageTextBox.val('')

 });
});
