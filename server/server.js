const path= require('path');
const publicPath=path.join(__dirname,'../public');
const port=process.env.PORT || 3000;
const socketIO=require('socket.io');
const http=require('http');

const express=require('express');
 var app=express();

 var server=http.createServer(app);
 var io=socketIO(server);

 io.on('connection',(socket)=>{
   console.log('new user connected');

socket.emit('newMessage',{
  from:'lijo',
  text:'hey there',
  createdAt:'123'
});
socket.on('createMessage',(mess)=>{
  console.log('message send:',mess);
});

   socket.on('disconnect',(io)=>{
     console.log('disconnected from user');
   });
 });



 app.use(express.static(publicPath));

 server.listen(port,()=>{
   console.log(`sever is up on ${port}`);
 });
