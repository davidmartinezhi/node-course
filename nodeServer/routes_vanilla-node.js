const fs = require('fs');

const requestHandler = (req, res) => {
    const url = req.url;
    const method = req.method;

    if(url === '/'){
        res.write('<html>');
        res.write('<head><title>Enter Message</title></head>');
        res.write('<body><form action="/message" method = "POST"><input type="text" name="message"><button type="submit">Send</button></form></body>');
        res.write('</html>');
        return res.end(); // this will send the response back to the client
    }
    
    else if(url === '/message' && method === 'POST'){
        const body = [];
    
        req.on('data', (chunk) => { // this will be fired whenever a new chunk is ready to be read
            console.log(chunk);
            body.push(chunk);
        });
        req.on('end', () => { // this will be fired when the incoming request is done parsing
            const parsedBody = Buffer.concat(body).toString();
            console.log(parsedBody);
            const message = parsedBody.split('=')[1]; // this will give us the message
            //fs.writeFileSync('message.txt', message); // this will write the message to a file and stop the rest of instructions from being executed until the file is written, this is due to sync 
            fs.writeFile('message.txt', message, (err) => {
                res.writeHead(302, {'Location': '/'});
                return res.end();
            });
        });
    }
    else{
        res.write('<html>');
        res.write('<head><title>My First Page</title></head>');
        res.write('<body><h1>Hello from my Node.js Server!</h1></body>');
        res.write('</html>');
        return res.end(); // this will send the response back to the client
    }
}

module.exports = requestHandler; // this will export the requestHandler function