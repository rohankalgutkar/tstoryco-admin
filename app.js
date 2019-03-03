const express = require('express')
const path = require('path');
const app = express()
var port = process.env.PORT || 3000;

app.use(express.static('public'))
app.get('/',function(req,res) {
    res.sendFile(path.join(__dirname+'/index.html'));
  });

app.listen(process.env.port || port);
console.log('Running at Port 3000');