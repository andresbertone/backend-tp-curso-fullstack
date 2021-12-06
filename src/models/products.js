const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    description:{
        type: String,
    },
    image:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    quotas:{
        type: Number,
        default: 1
    },
    stock:{
        type: Number,
        required: true
    },
    idSupplier:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Suppliers",
        required: true
    }
});

module.exports = mongoose.model('Products', productSchema);