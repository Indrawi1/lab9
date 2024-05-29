const http = require('http');

const authorName = "Milena Runets";
const port = 8085;

const server = http.createServer((req, res) => {
    const clientIP = req.remoteAddress;
    const currentTime = new Date().toLocaleString();

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(`<h1>Witaj!</h1>`);
    res.write(`<p>Adres IP klienta: ${clientIP}</p>`);
    res.write(`<p>Data i godzina w strefie czasowej serwera: ${currentTime}</p>`);
    res.write(`<p>Autor serwera: ${authorName}</p>`);
    res.write(`<p>Port serwera: ${port}</p>`);
    res.end();
});

server.listen(port, () => {
    console.log(`Serwer uruchomiony na porcie ${port}`);
    console.log(`Autor serwera: ${authorName}`);
    console.log(`Data uruchomienia: ${new Date().toISOString()}`);
});
