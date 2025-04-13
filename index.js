const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the src directory
app.use('/js', express.static(path.join(__dirname, 'src/js')));
app.use('/css', express.static(path.join(__dirname, 'src/css')));
app.use('/html', express.static(path.join(__dirname, 'src/html')));

app.use(express.static(path.join(__dirname, 'src')));
app.use('/build', express.static(path.join(__dirname, 'build')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/html/login.html'));
});
app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/html/login.html'));
});
app.get('/admin.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/html/admin.html'));
});
app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/html/index.html'));
});
const port = 8080;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
