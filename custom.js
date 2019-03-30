const mongoose = require('./mongoose.js')
const _ = require('lodash')

const deliveryAmt = 100

var preProcessSalesData = function (formData) {
    // console.log('Form input: ' + JSON.stringify(formData))

    formData.prod_face = _.has(formData, 'prod_face')
    formData.prod_quote = _.has(formData, 'prod_quote')
    formData.delivery = _.has(formData, 'delivery')

    // console.log('formData.prod_price: '+ formData.prod_price)
    // console.log('formData.prod_disc: '+ formData.prod_disc)
    var total_price = _.subtract(formData.prod_price, formData.prod_disc);
    // console.log('total price: '+ total_price)

    if (formData.delivery) {
        formData.grand_total = _.add(total_price, deliveryAmt)
    } else {
        formData.grand_total = total_price
    }
    // console.log('grand_total: '+ formData.grand_total)

    formData.date_added = _.now()

    return formData
}

var insertSale = function (formData) {
    const sale = new mongoose.Sale(formData)
    sale.save()
}

var getAllSales = function () {
    var salesMaster = mongoose.Sale;
    var salesDataPromise = salesMaster.find({}).sort({
        date_added: -1
    });
    return salesDataPromise;
}

var generateSalesOutput = function (data) {
    var output = "";
    console.log('Dataset length: ' + data.length)

    for (var i = 0, l = data.length; i < l; i++) {
        var objRecord = data[i];
        var date = this.formatDate(objRecord.date);

        // Payment Info
        var isDelivered = "";
        if (objRecord.delivery)
            isDelivered = '&nbsp;&nbsp;&nbsp; <span class="fas fa-truck"></span>&nbsp; '

        var discount = "";
        if (objRecord.prod_disc) {
            discount = '&nbsp; <span class="fas fa-angle-double-down"></span>&nbsp; ₹' + objRecord.prod_disc
        }

        var paymentMode = objRecord.payment_mode,
            fa;
        switch (paymentMode) {
            case 'gpay_or_upi':
                fa = 'fab fa-google'
                break;
            case 'paytm':
                fa = 'fab fa-paypal'
                break;
            case 'cash':
                fa = 'fas fa-money-bill-wave'
                break;
            case 'bank_transfer':
                fa = 'fas fa-university'
                break;
        }
        var paymentMethod = '<div class="stick-right"><span class="' + fa + '"></span></div>'

        var orderStatus = "";
        if (objRecord.order_status == 'open')
            orderStatus = '<span class="fas fa-sync"></span>&nbsp; Open'
        else if (objRecord.order_status == 'complete')
            orderStatus = '<span class="fas fa-check-double"></span>&nbsp; Complete'

        var notes = "";
        if (objRecord.notes != "")
            notes = '</li><li><span class="fas fa-sticky-note"></span>&nbsp; ' + objRecord.notes;

        output = output + '<blockquote> <ul class="alt"> <li> <span class="fas fa-user-circle"></span>&nbsp; ' +
            objRecord.cust_name +
            '<div class="stick-right"><span class="tbspl fas fa-calendar-check"></span>&nbsp; ' + date + '</div></li></li><li> <span class="fas fa-tree"></span> &nbsp; ' + objRecord.prod_name + '</li><li><span class="fas fa-tag"></span>&nbsp; ₹' + objRecord.prod_price + discount + isDelivered +
            '<div class="stick-right-icon"><span class="fas fa-money-check-alt"></span>&nbsp; ₹' + objRecord.grand_total + '</div>' + paymentMethod +
            '</li><li>' + orderStatus + notes +
            '</li></ul> </blockquote>'
    }

    return output
}

var formatDate = function formatDate(date) {
    var monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];

    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();

    return day + ' ' + monthNames[monthIndex] + ' ' + year;
}

var getTodaysDate = function () {

    var date = new Date(),
        d = date.getDate(),
        m = date.getMonth() + 1,
        y = date.getFullYear(),
        output;

    if (d < 10) {
        d = "0" + d;
    };
    if (m < 10) {
        m = "0" + m;
    };

    output = y + "-" + m + "-" + d;

    return output;
};

var getDashDetails = function (salesData) {

    var cost = 0,
        discount = 0;
    _.each(salesData, (objSale) => {
        cost = cost + objSale.prod_price;
        discount = discount + objSale.prod_disc
    });
    cost = cost - discount;

    return {
        cost,
        discount
    }
}
module.exports = {
    preProcessSalesData,
    insertSale,
    getAllSales,
    formatDate,
    generateSalesOutput,
    getTodaysDate,
    getDashDetails
}