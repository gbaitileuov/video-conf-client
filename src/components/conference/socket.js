import io from "socket.io-client";
// const sockets = io("/");
const sockets = io("https://tmed-server.herokuapp.com");
export default sockets;
