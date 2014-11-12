
var server = require("./server");

//httpserver = server.start();

var io = require("socket.io").listen(httpserver);
console.log(io);
var serialport = require("serialport");
var SerialPort = serialport.SerialPort; // localize object constructor
var portname = "COM3";

var serialPort = new SerialPort(portname, {
    baudrate: 2400,
    parser: serialport.parsers.readline("\n") 
});

io.sockets.on('connection', function (socket) {
    // If socket.io receives message from the client browser then 
    // this call back will be executed.
    socket.on('message', function (msg) {
        console.log(msg);
    });
    // If a web browser disconnects from Socket.IO then this callback is called.
    socket.on('disconnect', function () {
        console.log('disconnected');
    });
});

serialPort.on("open", function () {
  console.log('open');
  serialPort.on('data', function(data) {
    console.log('data received: ' + data);
    var reading = parseInt(data);
    var stat = "vacant";
   if (reading < 50) {
        stat = "occupied";
    }
    io.sockets.emit('update',{value: data, status: stat});
  });   
});