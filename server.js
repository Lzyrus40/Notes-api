// server.js
const app = require('./app');
const port = process.env.PORT || 3000;

try {
    app.listen(port, () => {
        console.log(`Server started at http://localhost:${port}`);
    });
} catch (error) {
    console.log(error.message);
}
