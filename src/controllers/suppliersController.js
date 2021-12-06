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

const getSupplierById = async (req, res) => {
    try {
        const supplierId = req.params.id;
        const response = await models.Suppliers.findById(supplierId);

        if (response) {
            res.status(200).json({
                data: response,
                error: false,
            });
        } else {
        res.status(404).json({
            msg: "El proveedor no existe",
            error: true,
        });
        }
    } catch (error) {
        return res.status(500).json({
            msg: error,
            error: true,
        });
    }
}

const addSupplier = async (req, res) => {
    try {
        const supplier = new models.Suppliers(req.body);
        await supplier.save();
        res.status(200).json({
            data: supplier,
            error: false,
        });
    } catch (error) {
        return res.status(500).json({
            msg: error,
            error: true,
        });
    }
}

const updateSupplier = async (req, res) => {
    try {
        const supplierId = req.params.id;

        if (!Object.keys(req.body).length) {
            return res.status(404).json({
                error: true,
                msg: "Por favor, inserte los datos necesarios",
            });
        }

        const supplier = await models.Suppliers.findByIdAndUpdate(
            supplierId,
            req.body,
            // el new: true, retorna el objeto ya actualizado, y no el objeto antes de actualizar
            { new: true }
        );

        if (supplier) {
            res.status(200).json({
                error: false,
                data: product,
            });
        } else {
            res.status(404).json({
                error: true,
                msg: "El producto no existe",
            });
        }
    } catch (error) {
        res.status(500).json({
            error: true,
            msg: error,
        });
    }
}

const deleteSupplier = async (req, res) => {
    try {
        const supplierId = req.params.id;

        const supplierResponse = await models.Suppliers.findByIdAndRemove(
            supplierId
        );

        if (supplierResponse) {
            const productResponse = await models.Products.deleteMany({
                idSupplier: supplierId,
            });

            res.status(200).json({
                error: false,
                data: {
                    supplier: supplierResponse,
                    products: productResponse,
                },
                msg: `El proveedor con id ${supplierId} fue eliminado exitosamente ${productResponse ? `y sus productos` : ''}`,
            });
        } else {
            res.status(404).json({
                error: true,
                msg: "El proveedor no existe",
            });
        }
    } catch (error) {
        res.status(500).json({
            error: true,
            msg: error,
        });
    }
}

module.exports = {
    getSuppliers,
    getSupplierById,
    addSupplier,
    updateSupplier,
    deleteSupplier,
} 