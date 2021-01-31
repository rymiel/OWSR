const connect = require("connect");
const serveStatic = require("serve-static");
connect()
  .use(serveStatic(__dirname + "/public"))
  .listen(8080, function () {
    console.log("Server running on http://localhost:8080");
  });
