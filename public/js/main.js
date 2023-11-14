const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");
// username and room name from url
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});
console.log(username, room);

const socket = io();
// join chatroom
socket.emit("joinRoom", { username, room });
// gewt room and users
socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});
// message from server
socket.on("message", (message) => {
  console.log(message);
  outputMessage(message);
  // Scrool down on recieving new message
  chatMessages.scrollTop = chatMessages.scrollHeight;
});
chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  // Get the message text
  const msg = event.target.elements.msg.value;
  //emit message to the server
  socket.emit("chatMessage", msg);
  // clear the Input field
  event.target.elements.msg.value = "";
  event.target.elements.msg.focus();
});
// output Message to DOM
function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
  <p class="text">
    ${message.text}
  </p>`;
  document.querySelector(".chat-messages").appendChild(div);
}
// add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}
// add users to DOM
function outputUsers(users) {
  userList.innerHTML = `
  ${users.map((user) => `<li>${user.username}</li>`).join("")}`;
}
 