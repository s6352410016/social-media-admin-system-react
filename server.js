const express = require('express');
const path = require('path');
const app = express();
const PORT = 8000 || process.env.PORT;

app.use(express.static(path.join(__dirname, './client/build')));
app.get('*', (req, res, next) => {
    res.sendFile(path.join(__dirname, './client/build/index.html'), (err) => {
        if (err) {
            res.status(500).json(err);
        }
    });
    next();
});

app.listen(PORT, () => {
    console.log(`Server Listen To Port ${PORT}`);
});