const path= require('path');
const publicPath=path.join(__dirname,'../public');
const port=process.env.PORT || 3000;
const socketIO=require('socket.io');
const http=require('http');

const {Users}=require('./utils/users');
const {generateMessage,generateLocationMessage}=require('./utils/message');
const {isRealString}=require('./utils/validation');
const express=require('express');
 var app=express();
var users=new Users();
 var server=http.createServer(app);
 var io=socketIO(server);

 io.on('connection',(socket)=>{
   console.log('new user connected');

// socket.emit('newMessage',{
//   from:'lijo',
//   text:'hey there',
//   createdAt:'123'
// });


socket.on('join',(params,callback)=>{
  if(!isRealString(params.name) || !isRealString(params.room)){
  return callback('Name and room name are required');
  }

  socket.join(params.room);
  users.removeUser(socket.id);
  users.addUser(socket.id,params.name,params.room);

  io.to(params.room).emit('updateUserList',users.getUserlist(params.room));
  socket.emit('newMessage',generateMessage('admin','welcome to chat app'));
  socket.broadcast.to(params.room).emit('newMessage',generateMessage('admin',`${params.name} has joined the chat.`));

  callback();
});

socket.on('createMessage',(message,callback)=>{

  var user=users.getUser(socket.id);

  if(user && isRealString(message.text)){
    io.to(user.room).emit('newMessage',generateMessage(user.name,message.text));

  }
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
      var user=users.getUser(socket.id);
      if(user){
        io.to(user.room).emit('newLocationMessage',generateLocationMessage(user.name,location.latitude,location.longitude));

      }

 });

   socket.on('disconnect',()=>{
    var user=users.removeUser(socket.id);

    if(user){
      io.to(user.room).emit('updateUserList',users.getUserlist(user.room));
      io.to(user.room).emit('newMessage',generateMessage('Admin',`${user.name} has left the chat`));
    }

   });
 });



 app.use(express.static(publicPath));

 server.listen(port,()=>{
   console.log(`sever is up on ${port}`);
 });
