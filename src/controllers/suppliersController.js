const models = require('../models');
const validator = require('validator');
const mongoose = require('mongoose');

const objectIdValidator = mongoose.Types.ObjectId;

const getSuppliers = async (req, res) => {
    try{
        const response = await models.Suppliers.find();
        
        return res.status(200).json({
            data: response,
            error: false
        })
    } catch (error) {
        return res.status(500).json({
            msg: error,
            error: true
        });
    }
};

const getSupplierById = async (req, res) => {
    try {
        const supplierId = req.params.id;

        const supplierIdIsValid = objectIdValidator.isValid(supplierId);

        if (!supplierIdIsValid) {
            return res.status(400).json({
                msg: 'El ID no corresponde con un ID generado por MongoDB',
                error: true
            });
        }

        const response = await models.Suppliers.findById(supplierId);

        if (response) {
            res.status(200).json({
                data: response,
                error: false
            });
        } else {
        res.status(404).json({
            msg: `El proveedor con id ${supplierId} no existe`,
            error: true
        });
        }
    } catch (error) {
        return res.status(500).json({
            msg: error,
            error: true
        });
    }
};

const addSupplier = async (req, res) => {
    try {
        if ( !validFields(req.body) ) {
            return res.status(400).json({
                msg: 'Faltan datos obligatorios para registrar un proveedor. Verifique que los campos cuit, razón social, dirección y número de teléfono estén completos',
                error: true
            });
        };

        if ( req.body.email ) {
            if ( !validator.isEmail(req.body.email) ) {
                return res.status(400).json({
                    msg: 'El campo email no es válido',
                    error: true
                });
            };
        };

        const supplier = new models.Suppliers(req.body);
        await supplier.save();

        res.status(201).json({
            data: supplier,
            error: false
        });
    } catch (error) {
        return res.status(500).json({
            msg: error,
            error: true
        });
    }
};

const updateSupplier = async (req, res) => {
    try {
        const supplierId = req.params.id;

        const supplierIdIsValid = objectIdValidator.isValid(supplierId);

        if (!supplierIdIsValid) {
            return res.status(400).json({
                msg: 'El ID no corresponde con un ID generado por MongoDB',
                error: true
            });
        };

        if ( !validFields(req.body) ) {
            return res.status(404).json({
                msg: 'Faltan datos obligatorios para modificar un proveedor. Verifique que los campos cuit, razón social, dirección y número de teléfono estén completos',
                error: true
            });
        };

        if ( req.body.email ) {
            if ( !validator.isEmail(req.body.email) ) {
                return res.status(400).json({
                    msg: 'El campo email no es válido',
                    error: true
                });
            };
        };

        const supplier = await models.Suppliers.findByIdAndUpdate(
            supplierId,
            req.body,
            // el new: true, retorna el objeto ya actualizado, y no el objeto antes de actualizar
            { new: true }
        );

        if (supplier) {
            res.status(200).json({
                data: supplier,
                error: false
            });
        } else {
            res.status(404).json({
                msg: `El proveedor con ID ${supplierId} no existe`,
                error: true
            });
        }
    } catch (error) {
        res.status(500).json({
            msg: error,
            error: true
        });
    }
};

const deleteSupplier = async (req, res) => {
    try {
        const supplierId = req.params.id;

        const supplierIdIsValid = objectIdValidator.isValid(supplierId);

        if (!supplierIdIsValid) {
            return res.status(400).json({
                msg: 'El ID no corresponde con un ID generado por MongoDB',
                error: true
            });
        };

        const supplierResponse = await models.Suppliers.findByIdAndRemove(
            supplierId
        );

        if (supplierResponse) {
            const productResponse = await models.Products.deleteMany({
                idSupplier: supplierId
            });

            res.status(200).json({
                data: {
                    supplier: supplierResponse,
                    products: productResponse
                },
                msg: `El proveedor con ID ${supplierId} ${productResponse ? `y sus productos fueron eliminados exitosamente` : 'fue eliminado exitosamente'}`,
                error: false
            });
        } else {
            res.status(404).json({
                msg: `El proveedor con ID ${supplierId} no existe`,
                error: true
            });
        }
    } catch (error) {
        res.status(500).json({
            msg: error,
            error: true
        });
    }
};


const validFields = (body) => {
    const cuit = body.cuit;
    const companyName = body.companyName;
    const address = body.address;
    const phoneNumber = body.phone;

    if (cuit && companyName && address && phoneNumber) {
        return true;
    } else {
        return false;
    }
};

module.exports = {
    getSuppliers,
    getSupplierById,
    addSupplier,
    updateSupplier,
    deleteSupplier,
} 