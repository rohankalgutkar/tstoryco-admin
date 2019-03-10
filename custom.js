const mongoose = require('./mongoose.js')
const _ = require('lodash')

const deliveryAmt = 100

var preProcessSalesData = function (formData) {
    // console.log('Form input: ' + JSON.stringify(formData))

    formData.prod_face = _.has(formData, 'prod_face')
    formData.prod_quote = _.has(formData, 'prod_quote')
    formData.delivery = _.has(formData, 'delivery')

    formData.prod_total_price = _.subtract(formData.prod_price, formData.prod_disc);

    if(formData.delivery){
        formData.grand_total = _.add(formData.prod_total_price, deliveryAmt)
    } else {
        formData.grand_total = formData.prod_total_price
    }

    formData.date_added = _.now()

    return formData
}

var insertSale = function (formData) {
    const sale = new mongoose.Sale(formData)
    sale.save()
}

var getAllSales = function () {
    var salesMaster = mongoose.Sale;
    var salesData = [];
    salesMaster.find({}, (err, docs) => {
            if (err) {
                console.log('Unable to connect to the DB!')
            } else {
                return docs;
                // console.log('Fetched records: ' + docs);
            }
        });
    
        // return salesData;
}

var formatDate = function formatDate(date) {
    var monthNames = [
      "January", "February", "March",
      "April", "May", "June", "July",
      "August", "September", "October",
      "November", "December"
    ];
  
    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();
  
    return day + ' ' + monthNames[monthIndex] + ' ' + year;
  }

module.exports = {
    preProcessSalesData,
    insertSale,
    getAllSales,
    formatDate
}