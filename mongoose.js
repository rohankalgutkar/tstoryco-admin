const mongoose = require('mongoose');
const dbURL = process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/sales-master';

mongoose.connect(dbURL, {
    useNewUrlParser: true,
    useCreateIndex: true
})

// Model for Sales Master. If the number of models increase, refactor the code.
// Put the models in a different /models folder and import it here.

const Sale = mongoose.model('Sale', {
    cust_name: String,
    cust_phone: String,
    cust_email: String,
    cust_address: String,
    prod_name: String,
    prod_face: Boolean,
    prod_quote: Boolean,
    prod_qty: String,
    prod_price: String,
    prod_disc: String,
    delivery: Boolean,
    date: Date,
    payment_mode: String,
    entered_by: String,
    notes: String
})

module.exports = {
    Sale
}