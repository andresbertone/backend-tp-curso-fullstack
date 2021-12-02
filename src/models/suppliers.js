const mongoose = require('mongoose');

const suppliersSchema = mongoose.Schema({
    cuit:{
        type: String,
        required: true
    },
    companyName:{
        type: String,
        required: true
    },
    address:{
        type: String,
        required: true
    },
    email:{
        type: String,
    },
    phone:{
        type: String,
        required:true
    }
});

module.exports = mongoose.model('Suppliers', suppliersSchema);