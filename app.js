const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
var customAPIs = require('./custom')
// temp
const mongoose = require('./mongoose.js')

const hbs = require('hbs');

const app = express()

app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'html');
app.engine('html', require('hbs').__express);

hbs.registerHelper('blockquote', function (data, options) {
    return customAPIs.generateSalesOutput(data);
});

app.get('/', function (req, res) {

    var salesMaster = mongoose.Sale;
    salesMaster.find({}).sort({date_added: -1}).exec((err, docs) => {
        if (err) {
            console.log('Unable to connect to the DB!')
        } else {
            res.render('index', {data: docs,
              defaultDate: customAPIs.getTodaysDate()});
        }
    });
});

app.post('/salesentry', function (req, res) {
    var processedFormData = customAPIs.preProcessSalesData(req.body);
    customAPIs.insertSale(processedFormData);

    res.redirect('/#success');
})

var port = process.env.PORT || 3000;
app.listen(port);

console.log('Running at Port ' + port);