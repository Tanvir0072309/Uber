const http = require('http');
const app = require('./app.js');
const { initializeSocket } = require('./socket/socket.js');

const port = process.env.PORT || 3000;

// BUG FIX: socket.io needs the raw http.Server instance to attach to —
// previously the server was created and listened on directly, and
// initializeSocket() was never even called, so no socket connections
// were ever accepted.
const server = http.createServer(app);
initializeSocket(server);

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}/ ...`);
});