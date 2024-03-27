class Socket {
  connect(token) {
    const socket = new WebSocket("ws://127.0.0.1:8000/ws/chat/", {
        "headers": {
          "token": token
        }
      })
    socket.onopen = () => console.log("Established.");

    socket.onclose = () => console.log("disconnect.");

    socket.onerror = (e) => console.log("error.");
  }
}

export default Socket;
