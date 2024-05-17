const fs = require('fs').promises;

const text = 'This is a text - and it should be stored in a file!';

fs.writeFile('node-message.txt', text).then(() => {
  console.log('File created');
});


const http = require('http');
const server = http.createServer((req, res) => {
    res.end('Hello Node!'); // this completes the response and sends it to the client
});
server.listen(3000); // this starts the server on port 3000