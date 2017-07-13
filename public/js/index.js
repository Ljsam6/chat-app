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
});
