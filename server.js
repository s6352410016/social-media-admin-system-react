const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, './client/build')));
app.get('*', (req, res, next) => {
    res.sendFile(path.join(__dirname, './client/build/index.html'), (err) => {
        if (err) {
            res.status(500).json(err);
        }
    });
    next();
});

app.get("/test" , (req , res) => {
    res.send("ok");
});

app.listen(PORT, () => {
    console.log(`Server Listen To Port ${PORT}`);
});