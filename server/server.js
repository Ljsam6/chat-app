const path= require('path');
const publicPath=path.join(__dirname,'../public');
const port=process.env.PORT || 3000;
const socketIO=require('socket.io');
const http=require('http');

const {generateMessage,generateLocationMessage}=require('./utils/message');

const express=require('express');
 var app=express();

 var server=http.createServer(app);
 var io=socketIO(server);

 io.on('connection',(socket)=>{
   console.log('new user connected');

// socket.emit('newMessage',{
//   from:'lijo',
//   text:'hey there',
//   createdAt:'123'
// });

socket.emit('newMessage',generateMessage('admin','welcome to chat app'));
socket.broadcast.emit('newMessage',generateMessage('admin','new user joined'));

socket.on('createMessage',(message,callback)=>{
  console.log('message send:',message);
  io.emit('newMessage',generateMessage(message.from,message.text));
 // socket.broadcast.emit('newMessage',{
 //    from:message.from,
 //    text:message.text,
 //    time:new Date().getTime()
 //    });
callback();
});

   socket.on('createlocation',(location)=>{
    //  console.log('location lang',location.langitude);
    //  console.log('location lat',location.latitude);
     io.emit('newLocationMessage',generateLocationMessage('admin',location.latitude,location.longitude));

 });

   socket.on('disconnect',(io)=>{
     console.log('disconnected from user');
   });
 });



 app.use(express.static(publicPath));

 server.listen(port,()=>{
   console.log(`sever is up on ${port}`);
 });
