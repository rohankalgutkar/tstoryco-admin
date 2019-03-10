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
    var output = "";
    console.log('item length ' + data.length)

    for (var i = 0, l = data.length; i < l; i++) {
      var objRecord = data[i];
      var date = customAPIs.formatDate(objRecord.date);

        output = output 
        + '<blockquote> <ul class="alt"> '  
        + '<li> <span class="icon fa-calendar"> &nbsp;' + date + '</span></li>'
        + '<li> <span class="icon fa-user-circle-o"> &nbsp;' + objRecord.cust_name + '</span></li>'
        + '<li> <span class="icon fa-leaf"> &nbsp;' + objRecord.prod_name + '</span></li>'
        + '<li> <span class="icon fa-money"> &nbsp; ₹' + objRecord.grand_total + '</span></li>'
        
        + '</ul> </blockquote>'
    }

    return output;
});

app.get('/', function (req, res) {
    // var salesData = customAPIs.getAllSales(); console.log('In /, data is: ' +
    // (salesData)) res.render('index', {   data: salesData });

    var salesMaster = mongoose.Sale;
    salesMaster.find({}).sort({date_added: -1}).exec((err, docs) => {
        if (err) {
            console.log('Unable to connect to the DB!')
        } else {
            res.render('index', {data: docs});
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