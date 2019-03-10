const mongoose = require('./mongoose.js')
const _ = require('lodash')

const deliveryAmt = 100

var preProcessSalesData = function (formData) {
    // console.log('Form input: ' + JSON.stringify(formData))

    formData.prod_face = _.has(formData, 'prod_face')
    formData.prod_quote = _.has(formData, 'prod_quote')
    formData.delivery = _.has(formData, 'delivery')

    console.log('formData.prod_price: '+ formData.prod_price)
    console.log('formData.prod_disc: '+ formData.prod_disc)
    var total_price = _.subtract(formData.prod_price, formData.prod_disc);
    console.log('total price: '+ total_price)
    
    
    if(formData.delivery){
        formData.grand_total = _.add(total_price, deliveryAmt)
    } else {
        formData.grand_total = total_price
    }
    console.log('grand_total: '+ formData.grand_total)
    


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

var generateSalesOutput = function (data){
    var output = "";
    console.log('Dataset length: ' + data.length)
    
    
    for (var i = 0, l = data.length; i < l; i++) {
        var objRecord = data[i];
        console.log('Dataset length: ' + objRecord)
      var date = this.formatDate(objRecord.date);
      var isDelivered = "";
      if(objRecord.delivery)
        isDelivered = '&nbsp;&nbsp;&nbsp; <span class="tbsp icon fa-truck"></span>'

      var discount = "";
      if(objRecord.prod_disc)
        discount = '&nbsp; <span class="icon fa-angle-double-down"> ₹' + objRecord.prod_disc + '</span>'
      
      var paymentMode = objRecord.payment_mode, fa;
      switch (paymentMode){
      case 'gpay_or_upi': 
        fa = 'google'
        break;
      case 'paytm': 
        fa = 'paypal'
        break;
      case 'cash': 
        fa = 'money'
        break;
      case 'bank_transfer': 
        fa = 'bank'
        break;
    }
    var paymentMethod = '&nbsp; <span class="icon fa-'+ fa +'"></span>'

        output = output 
        + '<blockquote> <ul class="alt"> '  
        + '<li> <span class="icon fa-calendar"> &nbsp;' + date + '</span></li>'
        + '<li> <span class="icon fa-user-circle-o"> &nbsp;' + objRecord.cust_name + '</span></li>'
        + '<li> <span class="icon fa-leaf"> &nbsp;' + objRecord.prod_name + '</span></li>'
        + '<li> <span class="icon fa-money tbsp"> &nbsp; ₹' + objRecord.grand_total + '</span> &nbsp;'
        + '<span class="icon fa-tag"> ₹' + objRecord.prod_price + '</span>'
        + discount
        + isDelivered
        + paymentMethod
        + '</li>'
        + '</ul> </blockquote>'
    }

    return output
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
    formatDate,
    generateSalesOutput
}