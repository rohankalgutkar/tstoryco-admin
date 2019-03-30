const express = require('express');
const basicAuth = require('express-basic-auth')
const bodyParser = require('body-parser')
const _ = require('lodash')

var customAPIs = require('./custom')

const hbs = require('hbs')

const app = express()
app.use(basicAuth({
    users: {
        'admin': 'supersecret'
    },
    challenge: true
}))


app.use(express.static('public'))
app.use(bodyParser.urlencoded({
    extended: true
}));
app.set('view engine', 'html');
app.engine('html', require('hbs').__express);

hbs.registerHelper('completeBlockquote', function (completeOrders) {
    return customAPIs.generateSalesOutput(completeOrders);
});

hbs.registerHelper('openBlockquote', function (openOrders) {
    return customAPIs.generateSalesOutput(openOrders);
});

app.get('/', function (req, res) {

    var defaultDate = customAPIs.getTodaysDate();
    var salesData = customAPIs.getAllSales();

    salesData.then((salesData) => {
        var cost = 0,
            // earning = 0,
            discount = 0;
        _.each(salesData, (objSale) => {
            cost = cost + objSale.prod_price;
            // earning = earning + objSale.grand_total
            discount = discount + objSale.prod_disc
        });
        cost = cost - discount;
        console.log('Earning:' + cost);
        console.log('discount:' + discount);

        res.render('index', {
            completeOrders: _.filter(salesData, function (o) {
                return o.order_status == 'complete';
            }),
            openOrders: _.filter(salesData, function (o) {
                return o.order_status == 'open';
            }),
            defaultDate,
            cost,
            discount
        });
    }).catch((e) => {
        console.log('Didnt work' + e);
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