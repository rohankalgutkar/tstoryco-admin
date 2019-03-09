const mongoose = require('./mongoose.js')
const _ = require('lodash')

var preProcessSalesData = function (formData) {

    formData.prod_face = _.has(formData, 'prod_face')
    formData.prod_quote = _.has(formData, 'prod_quote')
    formData.delivery = _.has(formData, 'delivery')

    return formData
}

var insertSale = function (formData) {
    const sale = new mongoose.Sale(formData)
    sale.save()
}

module.exports = {
    preProcessSalesData,
    insertSale
}