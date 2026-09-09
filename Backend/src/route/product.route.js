const {getProduct,createProduct,updateProduct,deleteProduct} = require('../controller/product.controller')
const upload = require('../middleware/upload');

const productRoute = (app) => {
    app.get('/api/v1/products/getAll', getProduct);
    app.post('/api/v1/products/createProduct', upload.single('image'), createProduct);
    app.put('/api/v1/products/updateProduct/:id', upload.single('image'), updateProduct);
    app.delete('/api/v1/products/deleteProduct/:id', deleteProduct);
}
module.exports = productRoute