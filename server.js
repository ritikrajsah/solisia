const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.ico': 'image/x-icon',
    '.json': 'application/json'
};

const server = http.createServer((req, res) => {
    let urlPath = req.url.split('?')[0]; // strip query string
    
    // Normalize clean URLs
    if (urlPath === '/' || urlPath === '') {
        urlPath = '/index.html';
    } else if (urlPath === '/about') {
        urlPath = '/about.html';
    } else if (urlPath === '/contact') {
        urlPath = '/contact.html';
    } else if (urlPath === '/solutions' || urlPath === '/service') {
        urlPath = '/solutions.html';
    } else if (urlPath === '/privacy-policy') {
        urlPath = '/privacy-policy.html';
    } else if (urlPath === '/terms-and-conditions') {
        urlPath = '/terms-and-conditions.html';
    } else if (urlPath === '/accessibility-statement') {
        urlPath = '/accessibility-statement.html';
    }

    // Determine target file path
    let filePath = path.join(__dirname, urlPath);
    
    // Check if file exists
    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            // Serve 404 response
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('404 Page Not Found - Solisia Replica');
            return;
        }

        // Determine content type
        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        // Read and serve file
        fs.readFile(filePath, (readErr, content) => {
            if (readErr) {
                res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
                res.end('500 Internal Server Error');
                return;
            }
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        });
    });
});

server.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`Solisia Replica Server is running on port ${PORT}`);
    console.log(`Local Access URL: http://localhost:${PORT}/`);
    console.log(`Project Location: ${__dirname}`);
    console.log(`====================================================`);
});
