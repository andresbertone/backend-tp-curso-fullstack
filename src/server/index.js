const express = require('express');
const products = require('../data/products.json');

const app = express();
const PORT = 3000;

const mappedProducts = products.map( ( product ) => {
    return {
        ...product,
        image: `http://localhost:${PORT}/${product.image}`
    }
});


app.use(express.static('public'));


app.get('/products', ( req, res ) => {
    res.status(200).send(mappedProducts);
});

app.get('/products/:id', ( req, res ) => {
    
    const product = mappedProducts.find( ( product ) => product.id === req.params.id );

    if ( !product ) {
        res.status(404).send(`Cannot find the product with id ${req.params.id}`);
    };

    res.status(200).send( product );

});


app.listen( PORT, () => {
    console.log(`Server running on port ${PORT}`);
});