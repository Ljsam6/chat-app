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

socket.on('newMessage',function(message){
  console.log('message recieved:',message);
var li=jQuery('<li></li>');
li.text(`${message.from}:${message.text}`);

jQuery('#messages').append(li);

});

jQuery('#message-form').on('submit',function (e){
  e.preventDefault();
  socket.emit('createMessage',{
   from:'user',
   text:jQuery('[name=message]').val()
 },function(){

 });
});
