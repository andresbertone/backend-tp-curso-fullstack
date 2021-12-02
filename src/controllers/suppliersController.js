const models = require('../models');

const getSuppliers = async (req, res) => {
    try{
        const response = await models.Suppliers.find();
        
        return res.status(200).json({
            data: response,
            error: false
        })
    }catch(error){
        return res.status(500).json({
            message: error,
            error: true
        });
    }
}

module.exports = {
    getSuppliers
}