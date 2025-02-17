const app = require("./app");
const http = require("http");

const server = http.createServer(app);

server.listen(3001, (err) => {
  console.log(`✅ User Service is running on port 3001`);
});
