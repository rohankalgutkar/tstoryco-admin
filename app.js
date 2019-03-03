const express = require('express')
const path = require('path');
const app = express()
const port = 3000

app.use(express.static('public'))
app.get('/',function(req,res) {
    res.sendFile(path.join(__dirname+'/index.html'));
  });

app.listen(process.env.port || 3000);
console.log('Running at Port 3000');