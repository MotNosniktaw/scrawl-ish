const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const NodeCache = require("node-cache");
const { uuid } = require("uuidv4");
const cache = new NodeCache();

app.get("/", (req, res) => {
  console.log("getting page");
  res.sendFile(__dirname + `/index.html`);
});

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("paint", (data) => {
    io.emit("paint", data);
  });
  socket.on("done", ({ data, target, sub }) => {
    const key = uuid();
    cache.set(key, data);
    io.emit("done", { key, target, sub });
  });
  socket.on("load", ({ key, sub }) => {
    const data = cache.get(key);
    io.emit("load", { data, key, sub });
  });
  socket.on("disconnect", (thing) => {
    console.log(thing);
    console.log("user disconnected");
  });
});

http.listen(8080, () => {
  console.log("listening on 4000");
});
