const express = require ('express');
const app = express();
const port = 3000;



app.get('/user',(req,res) =>{
    res.send('This is a simple Express.js web server and returns a list of User.\n Hello World\n');
});

app.get('/user/:id',(req,res) =>{
    const userId = req.params.id;
    res.send(`This is a simple Express.js web server and returns a User with ID : ${userId}.\n Hello World\n'`);
});

app.get('/animal', (req,res) => {
    res.send('This is a simple Express.js web server and returns a Animal.\n Hello World\n')
})

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`)
});