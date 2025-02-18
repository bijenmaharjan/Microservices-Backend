const app = require("./app");
const http = require("http");

const server = http.createServer(app);

server.listen(3002, (err) => {
  if (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal Server Error",ss
    });
  }
  console.log(`✅ captain Service is running on port 3002`);
});
