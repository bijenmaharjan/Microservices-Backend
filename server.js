const app = require("./app");
const http = require("http");

const server = http.createServer(app);

server.listen(3003, (err) => {
  console.log(`✅ ride Service is running on port 3003`);
});
