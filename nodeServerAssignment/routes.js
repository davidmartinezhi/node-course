const fs = require('fs');

const requestHandler = (req, res) => {
    const url = req.url; // this is the url of the incoming request
    const method = req.method; // this is the method of the incoming request
    
    res.setHeader('Content-Type', 'text/html');

    if(url === '/'){
        res.write('<html>');
        res.write('<head><title>Greetings</title></head>');
        res.write('<body>');
        res.write('<h1>Hello, welcome!</h1>');
        res.write('<form action="/create-user" method="POST"><input type="text" name="username"><button type="submit">Create User</button></form>')
        res.write('</body>');
        res.write('</html>');
        return res.end(); // this will send the response back to the client
    }
    else if(url === '/users'){
        res.write('<html>');
        res.write('<head><title>Users</title></head>');
        res.write('<body>');
        res.write('<ul>');
        res.write('<li>User 1</li>');
        res.write('<li>User 2</li>');
        res.write('<li>User 3</li>');
        res.write('<li>User 4</li>');
        res.write('</ul>');
        res.write('</body>');
        res.write('</html>');
        return res.end(); // this will send the response back to the client
    }

    if(url === '/create-user' && method === 'POST'){
        const body = [];

        req.on('data', (chunk) => {
            body.push(chunk);
        });

        req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString(); // this will convert the body to a string
            const user = parsedBody.split('=')[1]; // this will give us the user name

            fs.writeFile('users.txt', user, (err) => {
                res.writeHead(302, {'location': '/'});
                res.end();
            });

        });
    }

    
    //res.end(); // this will send the response back to the client
};

module.exports = requestHandler; // this is a global object that is available everywhere