try {
  const WebSocket = require('ws');
  const socket = new WebSocket("ws://127.0.0.1:8000/ws/chat/",
    {
      "headers": {
        "token": "5e49dac2d9a7a238212123f1f10a6ba7fefe304f"
      }
    })

  socket.onopen = () => console.log("Established.");

  socket.onmessage = msg => {
    console.log(msg);
    data = JSON.parse(msg["data"]);
    if (data["error"]) {
      console.warn("Error: ", data["error"])
    }
    else {
      console.warn(data["msg"])
    }
  }

  socket.onclose = () => console.log("disconnect.");

  socket.onerror = (e) => console.log("error.");
}
catch (err) {
  console.log(err);
}


