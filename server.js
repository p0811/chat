const http = require('http'); 
const app  = require('./app');
const config = require('./config/config');
const port = config.PORT || 3000


const server = http.createServer(app);

server.listen(port);