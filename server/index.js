const http = require("http");
const PORT = process.env.PORT || 5000;



http
	.createServer(function (request, response) {
		response.writeHead(200, { "Content-Type": "text/plain" });
		response.end("Hello Connect");
	})
	.listen(5000);
