const models = require('../models');
const mongoose = require('mongoose');

const objectIdValidator = mongoose.Types.ObjectId;

const getProducts = async (req, res) => {
    try {
        let response;
        
        if ( req.query.name ) {
            // Búsqueda parcial de productos por nombre dado un string
            const partialProductName = req.query.name;
            response = await models.Products.find({
                name: {
                    $regex: partialProductName,
                    $options: 'i'
                }
            });
        } else {
            response = await models.Products.find();
        }

        
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
}

const getProductById = async (req, res) => {
    try {
        const productId = req.params.id;

        const productIdIsValid = objectIdValidator.isValid(productId);

        if (!productIdIsValid) {
            return res.status(400).json({
                msg: 'El ID no corresponde con un ID generado por MongoDB',
                error: true
            });
        }

        const response = await models.Products.findById(productId);

        if (response) {
            res.status(200).json({
                data: response,
                error: false,
            });
        } else {
            res.status(404).json({
                msg: `El producto con ID ${productId} no existe`,
                error: true,
            });
        }
    } catch (error) {
        return res.status(500).json({
            msg: error,
            error: true,
        });
    }
};

const addProduct = async (req, res) => {
    try {
        if ( !validFields(req.body) ) {
            return res.status(400).json({
                msg: 'Faltan datos obligatorios para crear un producto. Verifique que los campos nombre de producto, imagen, precio, stock y proveedor estén completos',
                error: true,
            });
        };

        const idSupplierIsValid = await validIdSupplier(req.body.idSupplier);

        if ( !idSupplierIsValid ) {
            return res.status(400).json({
                msg: 'El ID del proveedor no es válido',
                error: true,
            });
        };

        const product = new models.Products(req.body);
        await product.save();

        res.status(201).json({
            data: product,
            error: false,
        });
    } catch (error) {
        return res.status(500).json({
            msg: error,
            error: true,
        });
    }
};

const updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;

        const productIdIsValid = objectIdValidator.isValid(productId);

        if (!productIdIsValid) {
            return res.status(400).json({
                msg: 'El ID no corresponde con un ID generado por MongoDB',
                error: true
            });
        };

        if ( !validFields(req.body) ) {
            return res.status(400).json({
                msg: 'Faltan datos obligatorios para modificar el producto. Verifique que los campos nombre de producto, imagen, precio, stock y proveedor estén completos',
                error: true,
            });
        };
        
        const idSupplierIsValid = await validIdSupplier(req.body.idSupplier);

        if ( !idSupplierIsValid ) {
            return res.status(400).json({
                msg: 'El ID del proveedor no es válido',
                error: true,
            });
        };

        const product = await models.Products.findByIdAndUpdate(
            productId,
            req.body,
            // el new: true, retorna el objeto ya actualizado, y no el objeto antes de actualizar
            { new: true }
        );
    
        if (product) {
            res.status(200).json({
                data: product,
                error: false,
            });
        } else {
            res.status(404).json({
                msg: `El producto con ID ${productId} no existe`,
                error: true,
            });
        }
    } catch (error) {
        res.status(500).json({
            msg: error,
            error: true,
        });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;

        const productIdIsValid = objectIdValidator.isValid(productId);

        if (!productIdIsValid) {
            return res.status(400).json({
                msg: 'El ID no corresponde con un ID generado por MongoDB',
                error: true
            });
        };

        const productResponse = await models.Products.findByIdAndRemove(
            productId
        );

        if (productResponse) {

            res.status(200).json({
                data: productResponse,
                msg: `El producto con ID ${productId} fue eliminado exitosamente`,
                error: false,
            });
        } else {
            res.status(404).json({
                msg: `El producto con ID ${productId} no existe`,
                error: true,
            });
        }
    } catch (error) {
        res.status(500).json({
            msg: error,
            error: true,
        });
    }
};


const validFields = (body) => {
    const productName = body.name;
    const image = body.image;
    const price = body.price;
    const stock = body.stock;
    const supplierId = body.idSupplier;

    if (productName && image && price && stock && supplierId) {
        return true;
    } else {
        return false;
    }
};

const validIdSupplier = async (idSupplier) => {
    const supplier = await models.Suppliers.findById(idSupplier);
    
    if (supplier) {
        return true;
    } else {
        return false;
    }
};

module.exports = {
    getProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct
}