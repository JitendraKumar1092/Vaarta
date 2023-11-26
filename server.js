const express = require("express");
const path = require("path");
const http = require("http");
const app = express();
const socketio = require("socket.io");
const server = http.createServer(app);
const io = socketio(server);
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRooomUsers,
} = require("./utils/users");
const formatMessage = require("./utils/messages");

// set static folder
app.use(express.static(path.join(__dirname, "public")));
// Run it when a client connects
io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);
    //welcome current user
    socket.emit("message", formatMessage("Vaarta BOT", "welcome to Vaarta"));
    //Broadcast when a client connects
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage("Vaarta BOT", `${user.username} has join the Vaarta `)
      );
    // send users and room info
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRooomUsers(user.room),
    });
  });

  //listen for chat messages
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);
    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage("Vaarta Bot", `${user.username} has disconnected`)
      );
      // send users and room info
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRooomUsers(user.room),
      });
    }
  });
});
const PORT = 3001 || process.env.PORT;
server.listen(PORT, () => console.log(`serevr running on port ${PORT}`));
