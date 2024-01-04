const app = require("./app");
const debug = require("debug")("node-angular");
const http = require("http");

const normalizePort = val => {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
};

const onError = error => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof port === "string" ? "pipe " + port : "port " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const onListening = () => {
  const addr = server.address();
  const bind = typeof port === "string" ? "pipe " + port : "port " + port;
  debug("Listening on " + bind);
};

const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

const server = http.createServer(app);

const io = require('socket.io')(server, {
  cors: { origin: "*" }
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('message', (message) =>     {
      console.log(message);
      io.emit('message', `${socket.id.substr(0,2)} said ${message}` );
  });
  socket.on('order', (message) =>     {
      console.log(message);
      io.emit('order', message );
  });
});
server.on("error", onError);
server.on("listening", onListening);
console.log({port})
server.listen(port);
